/* ==========================================
   VAULT
   UI HELPERS + COMPONENT TEMPLATES
========================================== */

/* ---------- Formatters ---------- */

function formatMoney(amount){
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString){
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

function getDaysUntil(dateString){
    const today = new Date();
    const target = new Date(dateString);

    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const difference = target - today;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

/* ---------- App Calculations ---------- */

function getTotalTarget(){
    return appData.categories.reduce((total, category) => {
        return total + category.target;
    }, 0);
}

function getNextGoal(){
    const incompleteGoals = appData.goals
        .filter(goal => !goal.purchased)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return incompleteGoals[0] || null;
}

function getCategorySavedAmount(categoryTitle){
    const categoryGoals = appData.goals.filter(goal => {
        return goal.category === categoryTitle;
    });

    const totalCategoryCost = categoryGoals.reduce((total, goal) => {
        return total + goal.target;
    }, 0);

    if(totalCategoryCost === 0){
        return Math.min(appData.balance, appData.categories.find(c => c.title === categoryTitle)?.target || 0);
    }

    const category = appData.categories.find(c => c.title === categoryTitle);

    if(!category){
        return 0;
    }

    const categoryShare = category.target / getTotalTarget();

    return Math.min(appData.balance * categoryShare, category.target);
}

function getPercent(current, target){
    if(target <= 0){
        return 0;
    }

    return Math.min((current / target) * 100, 100);
}

/* ---------- HTML Templates ---------- */

function createNextGoalHTML(goal){
    const daysLeft = getDaysUntil(goal.dueDate);
    const missing = Math.max(goal.target - appData.balance, 0);

    return `
        <div class="next-goal-card">

            <div class="next-goal-icon">
                <span class="material-symbols-rounded">
                    ${goal.icon}
                </span>
            </div>

            <div class="next-goal-info">

                <h3>${goal.title}</h3>

                <p>
                    ${formatMoney(goal.target)} • ${formatDate(goal.dueDate)}
                </p>

                <p>
                    ${daysLeft >= 0 ? `${daysLeft} days left` : "Past due"} •
                    <span class="next-goal-price">
                        ${missing === 0 ? "Ready to buy" : `${formatMoney(missing)} needed`}
                    </span>
                </p>

            </div>

        </div>
    `;
}

function createActivityHTML(transaction){
    const isDeposit = transaction.type === "deposit";

    return `
        <div class="activity-row">

            <div class="activity-icon ${transaction.type}">
                <span class="material-symbols-rounded">
                    ${isDeposit ? "arrow_downward" : "arrow_upward"}
                </span>
            </div>

            <div class="activity-info">

                <h4>${transaction.title}</h4>

                <p>${formatDate(transaction.date)}</p>

            </div>

            <div class="activity-amount ${transaction.type}">
                ${isDeposit ? "+" : "-"}${formatMoney(transaction.amount)}
            </div>

        </div>
    `;
}

function createGoalHTML(goal){
    const daysLeft = getDaysUntil(goal.dueDate);

    return `
        <div class="goal-card" data-goal-id="${goal.id}">

            <div class="goal-icon">
                <span class="material-symbols-rounded">
                    ${goal.icon}
                </span>
            </div>

            <div class="goal-details">

                <h3>${goal.title}</h3>

                <p>
                    ${goal.category} • ${formatDate(goal.dueDate)}
                </p>

            </div>

            <div class="goal-meta">

                <div class="goal-price">
                    ${formatMoney(goal.target)}
                </div>

                <div class="goal-status ${goal.purchased ? "purchased" : ""}">
                    <span class="material-symbols-rounded">
                        ${goal.purchased ? "check_circle" : "schedule"}
                    </span>

                    ${goal.purchased ? "Done" : `${daysLeft}d`}
                </div>

            </div>

        </div>
    `;
}

function createVaultCategoryHTML(category){
    const saved = getCategorySavedAmount(category.title);
    const percent = getPercent(saved, category.target);

    return `
        <div class="vault-category">

            <div class="category-icon ${category.color}">
                <span class="material-symbols-rounded">
                    ${category.icon}
                </span>
            </div>

            <div class="category-info">

                <div class="category-top">

                    <h3>${category.title}</h3>

                    <div class="category-money">
                        <strong>${formatMoney(saved)}</strong>
                        <span>${formatMoney(category.target)}</span>
                    </div>

                </div>

                <div class="category-bottom">

                    <div class="progress-bar">
                        <div class="progress-fill ${category.color}"
                             style="width:${percent}%">
                        </div>
                    </div>

                    <div class="category-percent">
                        ${Math.round(percent)}%
                    </div>

                </div>

            </div>

        </div>
    `;
}