/* ==========================================
   VAULT
   FINANCE / PAYCHECK PLANNER
========================================== */

/* ==========================================
   DATA SAFETY
========================================== */

function ensureFinanceData(){

    if(!appData.finance){

        appData.finance = {
            paycheckAmount: 0,
            lastPaycheckDate: getToday(),
            frequencyDays: 14,
            expenses: []
        };

    }

    if(!Array.isArray(appData.finance.expenses)){
        appData.finance.expenses = [];
    }

    if(!Number.isFinite(Number(appData.finance.paycheckAmount))){
        appData.finance.paycheckAmount = 0;
    }

    if(!Number.isFinite(Number(appData.finance.frequencyDays))){
        appData.finance.frequencyDays = 14;
    }

}

/* ==========================================
   DATE CALCULATIONS
========================================== */

function parseLocalDate(dateString){

    if(!dateString){
        return new Date();
    }

    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);

}

function toLocalDateString(date){

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function getNextPaycheckDate(){

    ensureFinanceData();

    const frequencyDays =
        Math.max(Number(appData.finance.frequencyDays), 1);

    const nextDate =
        parseLocalDate(appData.finance.lastPaycheckDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    nextDate.setHours(0, 0, 0, 0);

    /*
       Move forward through every paycheck date until
       the result is today or later.
    */

    while(nextDate < today){

        nextDate.setDate(
            nextDate.getDate() + frequencyDays
        );

    }

    return nextDate;

}

function getPreviousPaycheckDate(){

    const nextPaycheck = getNextPaycheckDate();

    const previousPaycheck =
        new Date(nextPaycheck);

    previousPaycheck.setDate(
        previousPaycheck.getDate() -
        Number(appData.finance.frequencyDays)
    );

    return previousPaycheck;

}

function getPaycheckDaysLeft(){

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextPaycheck = getNextPaycheckDate();

    return Math.max(
        Math.ceil(
            (nextPaycheck - today) /
            (1000 * 60 * 60 * 24)
        ),
        0
    );

}

function getPaycheckCycleProgress(){

    const previousPaycheck = getPreviousPaycheckDate();
    const nextPaycheck = getNextPaycheckDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fullCycle =
        nextPaycheck - previousPaycheck;

    const completed =
        today - previousPaycheck;

    if(fullCycle <= 0){
        return 0;
    }

    return Math.min(
        Math.max(
            (completed / fullCycle) * 100,
            0
        ),
        100
    );

}

/* ==========================================
   FINANCE CALCULATIONS
========================================== */
function getEstimatedRegularPay(){

    ensureFinanceData();

    const rate =
        Number(appData.finance.hourlyRate || 0);

    const hours =
        Number(appData.finance.regularHours || 0);

    return rate * hours;

}

function getEstimatedPremiumPay(){

    ensureFinanceData();

    const rate =
        Number(appData.finance.hourlyRate || 0);

    const hours =
        Number(appData.finance.premiumHours || 0);

    const multiplier =
        Number(appData.finance.premiumMultiplier || 1.5);

    return rate * hours * multiplier;

}

function getEstimatedGrossPay(){

    return getEstimatedRegularPay() +
        getEstimatedPremiumPay();

}

function getEstimatedDeductions(){

    const grossPay =
        getEstimatedGrossPay();

    const deductionPercent =
        Number(appData.finance.deductionPercent || 0);

    return grossPay *
        Math.max(deductionPercent, 0) / 100;

}

function getEstimatedNetPay(){

    return Math.max(
        getEstimatedGrossPay() -
        getEstimatedDeductions(),
        0
    );

}

function getFinanceExpenseTotal(){

    ensureFinanceData();

    return appData.finance.expenses.reduce(
        (total, expense) => {

            if(expense.paid){
                return total;
            }

            return total + Number(expense.amount || 0);

        },
        0
    );

}

function getSafeToSave(){

    const paycheck =
        Number(appData.finance.paycheckAmount || 0);

    return Math.max(
        paycheck - getFinanceExpenseTotal(),
        0
    );

}

function getProjectedBalance(){

    return Number(appData.balance || 0) +
        getSafeToSave();

}

function getFinanceExpenseById(expenseId){

    ensureFinanceData();

    return appData.finance.expenses.find(
        expense =>
            Number(expense.id) === Number(expenseId)
    );

}

/* ==========================================
   RENDERING
========================================== */

function renderFinance(){

    ensureFinanceData();

    const nextPaycheckDate =
        getNextPaycheckDate();

    const daysLeft =
        getPaycheckDaysLeft();

    const progress =
        getPaycheckCycleProgress();

    const expenseTotal =
        getFinanceExpenseTotal();

    const safeToSave =
        getSafeToSave();

    const projectedBalance =
        getProjectedBalance();

    const paycheckAmount =
        Number(appData.finance.paycheckAmount || 0);
    
    const estimatedGrossPay =
    getEstimatedGrossPay();

    const estimatedDeductions =
    getEstimatedDeductions();

    const estimatedNetPay =
    getEstimatedNetPay();

    const dateElement =
        document.getElementById("next-paycheck-date");

    if(!dateElement){
        return;
    }

    dateElement.textContent =
        formatDate(toLocalDateString(nextPaycheckDate));

    document
        .getElementById("paycheck-days-left")
        .textContent = daysLeft;

    document
        .getElementById("estimated-paycheck")
        .textContent = formatMoney(paycheckAmount);

    document
        .getElementById("planned-expenses-total")
        .textContent = formatMoney(expenseTotal);

    document
        .getElementById("safe-to-save-total")
        .textContent = formatMoney(safeToSave);

    document
        .getElementById("projected-balance")
        .textContent = formatMoney(projectedBalance);

    document
        .getElementById("paycheck-progress-fill")
        .style.width = `${progress}%`;

    document
        .getElementById("paycheck-cycle-label")
        .textContent =
            daysLeft === 0
                ? "Payday is today."
                : `${daysLeft} ${
                    daysLeft === 1 ? "day" : "days"
                } until payday.`;

    document
        .getElementById(
            "projected-balance-description"
        )
        .textContent =
            safeToSave > 0
                ? `${formatMoney(safeToSave)} can move into savings after planned expenses.`
                : "Your planned expenses currently use the entire paycheck.";

    renderFinanceExpenses();
    
    const regularHoursElement =
    document.getElementById(
        "estimated-regular-hours"
    );

if(regularHoursElement){

    regularHoursElement.textContent =
        formatHours(appData.finance.regularHours);

    document
        .getElementById("estimated-premium-hours")
        .textContent =
            formatHours(appData.finance.premiumHours);

    document
        .getElementById("estimated-gross-pay")
        .textContent =
            formatMoney(estimatedGrossPay);

    document
        .getElementById("estimated-deductions")
        .textContent =
            `−${formatMoney(estimatedDeductions)}`;

    document
        .getElementById("estimated-net-pay")
        .textContent =
            formatMoney(estimatedNetPay);

}
}

function renderFinanceExpenses(){

    const expenseList =
        document.getElementById(
            "finance-expense-list"
        );

    if(!expenseList){
        return;
    }

    const expenses =
        appData.finance.expenses;

    if(!expenses.length){

        expenseList.innerHTML = `
            <div class="empty-state">
                No expenses planned for this paycheck.
            </div>
        `;

        return;

    }

    expenseList.innerHTML =
        expenses
            .map(createFinanceExpenseHTML)
            .join("");

}

function createFinanceExpenseHTML(expense){

    return `
        <button
            class="finance-expense-row ${
                expense.paid ? "paid" : ""
            }"
            data-expense-id="${expense.id}"
            type="button"
        >

            <div class="finance-expense-icon ${expense.color || "blue"}">

                <span class="material-symbols-rounded">
                    ${expense.icon || "payments"}
                </span>

            </div>

            <div class="finance-expense-info">

                <h3>${escapeHTML(expense.title)}</h3>

                <p>
                    ${escapeHTML(
                        expense.category || "Expense"
                    )}
                    ${expense.paid ? " • Paid" : ""}
                </p>

            </div>

            <strong>
                ${formatMoney(expense.amount)}
            </strong>

            <span class="material-symbols-rounded expense-chevron">
                chevron_right
            </span>

        </button>
    `;

}

/* ==========================================
   EVENT INITIALIZATION
========================================== */

function initializeFinanceEvents(){

    ensureFinanceData();

    const settingsButton =
        document.getElementById(
            "finance-settings-button"
        );

    const addExpenseButton =
        document.getElementById(
            "add-expense-button"
        );

    const expenseList =
        document.getElementById(
            "finance-expense-list"
        );

    if(settingsButton){

        settingsButton.addEventListener(
            "click",
            openPaycheckSettingsModal
        );

    }

    if(addExpenseButton){

        addExpenseButton.addEventListener(
            "click",
            openAddExpenseModal
        );

    }

    if(expenseList){

        expenseList.addEventListener(
            "click",
            event => {

                const expenseRow =
                    event.target.closest(
                        ".finance-expense-row"
                    );

                if(!expenseRow){
                    return;
                }

                openExpenseDetailsModal(
                    expenseRow.dataset.expenseId
                );

            }
        );

    }
    const editPayEstimatorButton =
    document.getElementById(
        "edit-pay-estimator-button"
    );

const applyPayEstimateButton =
    document.getElementById(
        "apply-pay-estimate-button"
    );

if(editPayEstimatorButton){

    editPayEstimatorButton.addEventListener(
        "click",
        openPayEstimatorModal
    );

}

if(applyPayEstimateButton){

    applyPayEstimateButton.addEventListener(
        "click",
        applyEstimatedPaycheck
    );

}

}

/* ==========================================
   PAYCHECK SETTINGS
========================================== */

function openPaycheckSettingsModal(){

    ensureFinanceData();

    openModal(
        "Paycheck Settings",
        `
            <div class="modal-form">

                <label for="finance-paycheck-amount">
                    Estimated Paycheck
                </label>

                <input
                    id="finance-paycheck-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    value="${appData.finance.paycheckAmount}"
                >

                <label for="finance-last-paycheck">
                    A Known Paycheck Date
                </label>

                <input
                    id="finance-last-paycheck"
                    type="date"
                    value="${appData.finance.lastPaycheckDate}"
                >

                <label for="finance-frequency">
                    Pay Frequency
                </label>

                <select id="finance-frequency">

                    <option
                        value="7"
                        ${
                            Number(
                                appData.finance.frequencyDays
                            ) === 7
                                ? "selected"
                                : ""
                        }
                    >
                        Every week
                    </option>

                    <option
                        value="14"
                        ${
                            Number(
                                appData.finance.frequencyDays
                            ) === 14
                                ? "selected"
                                : ""
                        }
                    >
                        Every two weeks
                    </option>

                    <option
                        value="28"
                        ${
                            Number(
                                appData.finance.frequencyDays
                            ) === 28
                                ? "selected"
                                : ""
                        }
                    >
                        Every four weeks
                    </option>

                </select>

                <p class="modal-helper-text">
                    Vault uses the known date to calculate
                    every future payday automatically.
                </p>

                <button
                    id="save-paycheck-settings"
                    class="primary-button"
                    type="button"
                >
                    Save Settings
                </button>

            </div>
        `
    );

    document
        .getElementById(
            "save-paycheck-settings"
        )
        .addEventListener(
            "click",
            savePaycheckSettings
        );

}

function savePaycheckSettings(){

    const amountInput =
        document.getElementById(
            "finance-paycheck-amount"
        );

    const dateInput =
        document.getElementById(
            "finance-last-paycheck"
        );

    const frequencyInput =
        document.getElementById(
            "finance-frequency"
        );

    const amount =
        Number(amountInput.value);

    if(!Number.isFinite(amount) || amount < 0){

        showInputError(
            amountInput,
            "Enter a valid paycheck amount."
        );

        return;

    }

    if(!dateInput.value){

        showInputError(
            dateInput,
            "Choose one known paycheck date."
        );

        return;

    }

    appData.finance.paycheckAmount =
        amount;

    appData.finance.lastPaycheckDate =
        dateInput.value;

    appData.finance.frequencyDays =
        Number(frequencyInput.value);

    saveData();
    renderFinance();
    closeModal();

}

/* ==========================================
   ADD EXPENSE
========================================== */

function openAddExpenseModal(){

    openModal(
        "Add Expense",
        createExpenseFormHTML()
    );

    document
        .getElementById("save-expense-button")
        .addEventListener(
            "click",
            saveNewExpense
        );

}

function createExpenseFormHTML(expense = null){

    return `
        <div class="modal-form">

            <label for="expense-title">
                Expense Name
            </label>

            <input
                id="expense-title"
                type="text"
                maxlength="50"
                placeholder="Motorcycle insurance"
                value="${
                    expense
                        ? escapeHTMLAttribute(expense.title)
                        : ""
                }"
            >

            <label for="expense-amount">
                Amount
            </label>

            <input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                placeholder="27.00"
                value="${
                    expense
                        ? expense.amount
                        : ""
                }"
            >

            <label for="expense-category">
                Category
            </label>

            <select id="expense-category">

                ${createExpenseCategoryOptions(
                    expense?.category
                )}

            </select>

            <label for="expense-icon">
                Icon
            </label>

            <select id="expense-icon">

                ${createExpenseIconOptions(
                    expense?.icon
                )}

            </select>

            <button
                id="${
                    expense
                        ? "update-expense-button"
                        : "save-expense-button"
                }"
                class="primary-button"
                type="button"
            >
                ${
                    expense
                        ? "Save Changes"
                        : "Add Expense"
                }
            </button>

        </div>
    `;

}

function createExpenseCategoryOptions(selected){

    const categories = [
        "Insurance",
        "Fuel",
        "Gear",
        "Maintenance",
        "Food",
        "Subscription",
        "Transportation",
        "Other"
    ];

    return categories
        .map(category => `
            <option
                value="${category}"
                ${
                    selected === category
                        ? "selected"
                        : ""
                }
            >
                ${category}
            </option>
        `)
        .join("");

}

function createExpenseIconOptions(selected){

    const icons = [
        {
            value: "shield",
            label: "Insurance"
        },
        {
            value: "local_gas_station",
            label: "Fuel"
        },
        {
            value: "sports_motorsports",
            label: "Gear"
        },
        {
            value: "build",
            label: "Maintenance"
        },
        {
            value: "restaurant",
            label: "Food"
        },
        {
            value: "subscriptions",
            label: "Subscription"
        },
        {
            value: "directions_bus",
            label: "Transportation"
        },
        {
            value: "payments",
            label: "Other"
        }
    ];

    return icons
        .map(icon => `
            <option
                value="${icon.value}"
                ${
                    selected === icon.value
                        ? "selected"
                        : ""
                }
            >
                ${icon.label}
            </option>
        `)
        .join("");

}

function saveNewExpense(){

    const titleInput =
        document.getElementById(
            "expense-title"
        );

    const amountInput =
        document.getElementById(
            "expense-amount"
        );

    const categoryInput =
        document.getElementById(
            "expense-category"
        );

    const iconInput =
        document.getElementById(
            "expense-icon"
        );

    const title =
        titleInput.value.trim();

    const amount =
        Number(amountInput.value);

    if(!title){

        showInputError(
            titleInput,
            "Enter an expense name."
        );

        return;

    }

    if(!Number.isFinite(amount) || amount <= 0){

        showInputError(
            amountInput,
            "Enter a valid expense amount."
        );

        return;

    }

    const category =
        categoryInput.value;

    appData.finance.expenses.push({
        id: Date.now(),
        title,
        amount,
        category,
        icon: iconInput.value,
        color: getExpenseColor(category),
        paid: false
    });

    saveData();
    renderFinance();
    closeModal();

}

/* ==========================================
   EXPENSE DETAILS / EDITING
========================================== */

function openExpenseDetailsModal(expenseId){

    const expense =
        getFinanceExpenseById(expenseId);

    if(!expense){
        return;
    }

    openModal(
        expense.title,
        `
            <div class="expense-details-modal">

                <div class="finance-expense-icon large ${expense.color || "blue"}">

                    <span class="material-symbols-rounded">
                        ${expense.icon || "payments"}
                    </span>

                </div>

                <p>${escapeHTML(expense.category)}</p>

                <h3>${formatMoney(expense.amount)}</h3>

                <div class="expense-detail-actions">

                    <button
                        id="toggle-expense-paid"
                        class="primary-button"
                        type="button"
                    >
                        ${
                            expense.paid
                                ? "Mark Unpaid"
                                : "Mark Paid"
                        }
                    </button>

                    <button
                        id="edit-expense-button"
                        class="secondary-button"
                        type="button"
                    >
                        Edit Expense
                    </button>

                    <button
                        id="delete-expense-button"
                        class="danger-button"
                        type="button"
                    >
                        Delete Expense
                    </button>

                </div>

            </div>
        `
    );

    document
        .getElementById("toggle-expense-paid")
        .addEventListener(
            "click",
            () => toggleExpensePaid(expense.id)
        );

    document
        .getElementById("edit-expense-button")
        .addEventListener(
            "click",
            () => openEditExpenseModal(expense.id)
        );

    document
        .getElementById("delete-expense-button")
        .addEventListener(
            "click",
            () => openDeleteExpenseModal(expense.id)
        );

}

function toggleExpensePaid(expenseId){

    const expense =
        getFinanceExpenseById(expenseId);

    if(!expense){
        return;
    }

    expense.paid = !expense.paid;

    saveData();
    renderFinance();
    closeModal();

}

function openEditExpenseModal(expenseId){

    const expense =
        getFinanceExpenseById(expenseId);

    if(!expense){
        return;
    }

    openModal(
        "Edit Expense",
        createExpenseFormHTML(expense)
    );

    document
        .getElementById(
            "update-expense-button"
        )
        .addEventListener(
            "click",
            () => saveExpenseChanges(expense.id)
        );

}

function saveExpenseChanges(expenseId){

    const expense =
        getFinanceExpenseById(expenseId);

    if(!expense){
        return;
    }

    const titleInput =
        document.getElementById(
            "expense-title"
        );

    const amountInput =
        document.getElementById(
            "expense-amount"
        );

    const categoryInput =
        document.getElementById(
            "expense-category"
        );

    const iconInput =
        document.getElementById(
            "expense-icon"
        );

    const title =
        titleInput.value.trim();

    const amount =
        Number(amountInput.value);

    if(!title){

        showInputError(
            titleInput,
            "Enter an expense name."
        );

        return;

    }

    if(!Number.isFinite(amount) || amount <= 0){

        showInputError(
            amountInput,
            "Enter a valid expense amount."
        );

        return;

    }

    expense.title = title;
    expense.amount = amount;
    expense.category = categoryInput.value;
    expense.icon = iconInput.value;
    expense.color =
        getExpenseColor(expense.category);

    saveData();
    renderFinance();
    closeModal();

}

function openDeleteExpenseModal(expenseId){

    const expense =
        getFinanceExpenseById(expenseId);

    if(!expense){
        return;
    }

    openModal(
        "Delete Expense",
        createConfirmModal(
            "Delete",
            `Remove "${expense.title}" from this paycheck plan?`,
            "Delete"
        )
    );

    document
        .getElementById("cancel-action")
        .addEventListener(
            "click",
            closeModal
        );

    document
        .getElementById("confirm-action")
        .addEventListener(
            "click",
            () => deleteFinanceExpense(expense.id)
        );

}

function deleteFinanceExpense(expenseId){

    appData.finance.expenses =
        appData.finance.expenses.filter(
            expense =>
                Number(expense.id) !==
                Number(expenseId)
        );

    saveData();
    renderFinance();
    closeModal();

}

/* ==========================================
   COLOR HELPERS
========================================== */

function getExpenseColor(category){

    const colors = {
        Insurance: "green",
        Fuel: "orange",
        Gear: "purple",
        Maintenance: "yellow",
        Food: "red",
        Subscription: "blue",
        Transportation: "blue",
        Other: "blue"
    };

    return colors[category] || "blue";

}

if(!Number.isFinite(Number(appData.finance.hourlyRate))){
    appData.finance.hourlyRate = 13;
}

if(!Number.isFinite(Number(appData.finance.regularHours))){
    appData.finance.regularHours = 0;
}

if(!Number.isFinite(Number(appData.finance.premiumHours))){
    appData.finance.premiumHours = 0;
}

if(!Number.isFinite(Number(appData.finance.premiumMultiplier))){
    appData.finance.premiumMultiplier = 1.5;
}

if(!Number.isFinite(Number(appData.finance.deductionPercent))){
    appData.finance.deductionPercent = 0;
}

function formatHours(hours){

    const value = Number(hours || 0);

    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(1);

}

/* ==========================================
   PAY ESTIMATOR
========================================== */

function openPayEstimatorModal(){

    ensureFinanceData();

    openModal(
        "Pay Estimator",
        `
            <div class="modal-form">

                <label for="estimator-hourly-rate">
                    Hourly Wage
                </label>

                <input
                    id="estimator-hourly-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    value="${appData.finance.hourlyRate}"
                >

                <label for="estimator-regular-hours">
                    Regular Hours
                </label>

                <input
                    id="estimator-regular-hours"
                    type="number"
                    min="0"
                    step="0.25"
                    inputmode="decimal"
                    value="${appData.finance.regularHours}"
                >

                <div class="modal-field-row">

                    <div>
                        <label for="estimator-premium-hours">
                            Premium Hours
                        </label>

                        <input
                            id="estimator-premium-hours"
                            type="number"
                            min="0"
                            step="0.25"
                            inputmode="decimal"
                            value="${appData.finance.premiumHours}"
                        >
                    </div>

                    <div>
                        <label for="estimator-premium-multiplier">
                            Multiplier
                        </label>

                        <select id="estimator-premium-multiplier">

                            <option
                                value="1.5"
                                ${
                                    Number(
                                        appData.finance
                                            .premiumMultiplier
                                    ) === 1.5
                                        ? "selected"
                                        : ""
                                }
                            >
                                1.5×
                            </option>

                            <option
                                value="2"
                                ${
                                    Number(
                                        appData.finance
                                            .premiumMultiplier
                                    ) === 2
                                        ? "selected"
                                        : ""
                                }
                            >
                                2×
                            </option>

                        </select>
                    </div>

                </div>

                <label for="estimator-deductions">
                    Estimated Deductions
                </label>

                <div class="percentage-input">

                    <input
                        id="estimator-deductions"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        inputmode="decimal"
                        value="${appData.finance.deductionPercent}"
                    >

                    <span>%</span>

                </div>

                <p class="modal-helper-text">
                    Use premium hours for holiday pay or
                    overtime. Deductions are only an estimate.
                </p>

                <div
                    id="estimator-live-preview"
                    class="estimator-live-preview"
                ></div>

                <button
                    id="save-pay-estimator-button"
                    class="primary-button"
                    type="button"
                >
                    Save Estimate
                </button>

            </div>
        `
    );

    const estimatorInputs = [
        "estimator-hourly-rate",
        "estimator-regular-hours",
        "estimator-premium-hours",
        "estimator-premium-multiplier",
        "estimator-deductions"
    ];

    estimatorInputs.forEach(inputId => {

        document
            .getElementById(inputId)
            .addEventListener(
                "input",
                updatePayEstimatorPreview
            );

    });

    document
        .getElementById(
            "save-pay-estimator-button"
        )
        .addEventListener(
            "click",
            savePayEstimator
        );

    updatePayEstimatorPreview();

}

function readPayEstimatorForm(){

    return {
        hourlyRate: Number(
            document
                .getElementById(
                    "estimator-hourly-rate"
                )
                .value
        ),

        regularHours: Number(
            document
                .getElementById(
                    "estimator-regular-hours"
                )
                .value
        ),

        premiumHours: Number(
            document
                .getElementById(
                    "estimator-premium-hours"
                )
                .value
        ),

        premiumMultiplier: Number(
            document
                .getElementById(
                    "estimator-premium-multiplier"
                )
                .value
        ),

        deductionPercent: Number(
            document
                .getElementById(
                    "estimator-deductions"
                )
                .value
        )
    };

}

function calculatePayEstimate(values){

    const regularPay =
        values.hourlyRate *
        values.regularHours;

    const premiumPay =
        values.hourlyRate *
        values.premiumHours *
        values.premiumMultiplier;

    const grossPay =
        regularPay + premiumPay;

    const deductions =
        grossPay *
        values.deductionPercent / 100;

    return {
        regularPay,
        premiumPay,
        grossPay,
        deductions,
        netPay: Math.max(
            grossPay - deductions,
            0
        )
    };

}

function updatePayEstimatorPreview(){

    const preview =
        document.getElementById(
            "estimator-live-preview"
        );

    if(!preview){
        return;
    }

    const values =
        readPayEstimatorForm();

    const estimate =
        calculatePayEstimate(values);

    preview.innerHTML = `
        <div>
            <span>Gross</span>
            <strong>
                ${formatMoney(estimate.grossPay)}
            </strong>
        </div>

        <div>
            <span>Take-Home</span>
            <strong>
                ${formatMoney(estimate.netPay)}
            </strong>
        </div>
    `;

}

function savePayEstimator(){

    const values =
        readPayEstimatorForm();

    const inputs = {
        hourlyRate: document.getElementById(
            "estimator-hourly-rate"
        ),

        regularHours: document.getElementById(
            "estimator-regular-hours"
        ),

        premiumHours: document.getElementById(
            "estimator-premium-hours"
        ),

        deductionPercent: document.getElementById(
            "estimator-deductions"
        )
    };

    if(
        !Number.isFinite(values.hourlyRate) ||
        values.hourlyRate < 0
    ){

        showInputError(
            inputs.hourlyRate,
            "Enter a valid hourly wage."
        );

        return;

    }

    if(
        !Number.isFinite(values.regularHours) ||
        values.regularHours < 0
    ){

        showInputError(
            inputs.regularHours,
            "Enter valid regular hours."
        );

        return;

    }

    if(
        !Number.isFinite(values.premiumHours) ||
        values.premiumHours < 0
    ){

        showInputError(
            inputs.premiumHours,
            "Enter valid premium hours."
        );

        return;

    }

    if(
        !Number.isFinite(values.deductionPercent) ||
        values.deductionPercent < 0 ||
        values.deductionPercent > 100
    ){

        showInputError(
            inputs.deductionPercent,
            "Deductions must be between 0 and 100%."
        );

        return;

    }

    appData.finance.hourlyRate =
        values.hourlyRate;

    appData.finance.regularHours =
        values.regularHours;

    appData.finance.premiumHours =
        values.premiumHours;

    appData.finance.premiumMultiplier =
        values.premiumMultiplier;

    appData.finance.deductionPercent =
        values.deductionPercent;

    saveData();
    renderFinance();
    closeModal();

}

function applyEstimatedPaycheck(){

    const estimatedNetPay =
        getEstimatedNetPay();

    appData.finance.paycheckAmount =
        estimatedNetPay;

    saveData();
    renderFinance();

    showFinanceToast(
        `${formatMoney(estimatedNetPay)} applied as your next paycheck.`
    );

}

function showFinanceToast(message){

    const oldToast =
        document.querySelector(
            ".vault-toast"
        );

    if(oldToast){
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className = "vault-toast";

    toast.innerHTML = `
        <span class="material-symbols-rounded">
            check_circle
        </span>

        <p>${escapeHTML(message)}</p>
    `;

    document
        .querySelector(".app")
        .appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("visible");
    });

    setTimeout(() => {

        toast.classList.remove("visible");

        setTimeout(() => {
            toast.remove();
        }, 250);

    }, 2500);

}