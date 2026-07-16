/* ==========================================
   VAULT
   TRANSACTIONS / BALANCE ACTIONS
========================================== */

/* ---------- Initialization ---------- */

function initializeTransactionEvents(){
    const depositButton = document.getElementById("deposit-button");
    const withdrawButton = document.getElementById("withdraw-button");

    depositButton.addEventListener("click", () => {
        openTransactionModal("deposit");
    });

    withdrawButton.addEventListener("click", () => {
        openTransactionModal("withdraw");
    });
}

function initializeActivityEvents(){
    const activityList = document.getElementById("activity-list");

    activityList.addEventListener("click", event => {
        const activityRow = event.target.closest(".activity-row");

        if(!activityRow){
            return;
        }

        const transactionId = Number(activityRow.dataset.transactionId);

        openTransactionDetails(transactionId);
    });
}

/* ---------- Create Transaction ---------- */

function openTransactionModal(type){
    const modalHeading = type === "deposit"
        ? "Add Deposit"
        : "Add Withdrawal";

    openModal(modalHeading, createTransactionModal(type));

    document
        .getElementById("confirm-transaction")
        .addEventListener("click", () => {
            submitTransaction(type);
        });
}

function submitTransaction(type){
    const titleInput = document.getElementById("transaction-title");
    const amountInput = document.getElementById("transaction-amount");
    const descriptionInput = document.getElementById("transaction-description");
    const dateInput = document.getElementById("transaction-date");

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const description = descriptionInput.value.trim();
    const date = dateInput.value || getToday();

    if(!title){
        showInputError(titleInput, "Please enter a transaction name.");
        return;
    }

    if(!Number.isFinite(amount) || amount <= 0){
        showInputError(amountInput, "Please enter a valid amount.");
        return;
    }

    if(type === "withdraw" && amount > appData.balance){
        showInputError(
            amountInput,
            "You cannot withdraw more than your current savings."
        );
        return;
    }

    if(type === "deposit"){
        appData.balance += amount;
    }else{
        appData.balance -= amount;
    }

    appData.transactions.unshift({
        id: Date.now(),
        type,
        title,
        amount,
        description,
        date
    });

    saveData();
    renderAllPages();
    closeModal();
    animateBalanceUpdate();
}

/* ---------- Transaction Details ---------- */

function getTransactionById(transactionId){
    return appData.transactions.find(transaction => {
        return Number(transaction.id) === Number(transactionId);
    });
}

function openTransactionDetails(transactionId){
    const transaction = getTransactionById(transactionId);

    if(!transaction){
        return;
    }

    openModal(
        transaction.title ||
        (transaction.type === "deposit" ? "Deposit" : "Withdrawal"),
        createTransactionDetailsModal(transaction)
    );

    document
        .getElementById("edit-transaction-button")
        .addEventListener("click", () => {
            openEditTransaction(transaction.id);
        });
}

/* ---------- Edit Transaction ---------- */

function openEditTransaction(transactionId){
    const transaction = getTransactionById(transactionId);

    if(!transaction){
        return;
    }

    openModal(
        "Edit Transaction",
        createEditTransactionModal(transaction)
    );

    document
        .getElementById("save-transaction-button")
        .addEventListener("click", () => {
            saveTransactionChanges(transaction.id);
        });
}

function saveTransactionChanges(transactionId){
    const transaction = getTransactionById(transactionId);

    if(!transaction){
        return;
    }

    const titleInput = document.getElementById("edit-transaction-title");
    const amountInput = document.getElementById("edit-transaction-amount");
    const descriptionInput = document.getElementById(
        "edit-transaction-description"
    );
    const dateInput = document.getElementById("edit-transaction-date");

    const newTitle = titleInput.value.trim();
    const newAmount = Number(amountInput.value);
    const newDescription = descriptionInput.value.trim();
    const newDate = dateInput.value || transaction.date;

    if(!newTitle){
        showInputError(titleInput, "Please enter a transaction name.");
        return;
    }

    if(!Number.isFinite(newAmount) || newAmount <= 0){
        showInputError(amountInput, "Please enter a valid amount.");
        return;
    }

    /*
       Remove the old transaction's effect from the balance,
       then apply the edited amount.
    */

    const oldSignedAmount = transaction.type === "deposit"
        ? transaction.amount
        : -transaction.amount;

    const newSignedAmount = transaction.type === "deposit"
        ? newAmount
        : -newAmount;

    const updatedBalance =
        appData.balance - oldSignedAmount + newSignedAmount;

    if(updatedBalance < 0){
        showInputError(
            amountInput,
            "This change would make your savings balance negative."
        );

        return;
    }

    appData.balance = updatedBalance;

    transaction.title = newTitle;
    transaction.amount = newAmount;
    transaction.description = newDescription;
    transaction.date = newDate;

    saveData();
    renderAllPages();
    closeModal();
    animateBalanceUpdate();
}

/* ---------- Validation UI ---------- */

function showInputError(input, message){
    clearInputErrors();

    input.classList.add("input-error");
    input.focus();

    const error = document.createElement("p");

    error.className = "form-error";
    error.textContent = message;

    input.insertAdjacentElement("afterend", error);
}

function clearInputErrors(){
    document.querySelectorAll(".input-error").forEach(input => {
        input.classList.remove("input-error");
    });

    document.querySelectorAll(".form-error").forEach(error => {
        error.remove();
    });
}

/* ---------- Balance Animation ---------- */

function animateBalanceUpdate(){
    const balance = document.getElementById("current-balance");
    const progress = document.querySelector(".overall-progress-fill");

    if(!balance || !progress){
        return;
    }

    balance.classList.remove("updated");
    progress.classList.remove("updated");

    void balance.offsetWidth;
    void progress.offsetWidth;

    balance.classList.add("updated");
    progress.classList.add("updated");
}