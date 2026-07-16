/* ==========================================
   VAULT
   PAGE RENDERING
========================================== */

function renderHome(){

    const balanceElement = document.getElementById("current-balance");
    const progressLabel = document.querySelector(".progress-label");
    const progressFill = document.querySelector(".overall-progress-fill");
    const nextGoal = document.getElementById("next-goal");
    const activityList = document.getElementById("activity-list");

    balanceElement.textContent = formatMoney(appData.balance);

    const totalTarget = getTotalTarget();
    const percent = totalTarget > 0
        ? Math.min((appData.balance / totalTarget) * 100, 100)
        : 0;

    progressFill.style.width = `${percent}%`;
    progressLabel.textContent = `${Math.round(percent)}% Complete`;

    const upcomingGoal = getNextGoal();

    nextGoal.innerHTML = upcomingGoal
        ? createNextGoalHTML(upcomingGoal)
        : `<p class="empty-state">No goals yet.</p>`;

    activityList.innerHTML = appData.transactions.length
        ? appData.transactions.map(createActivityHTML).join("")
        : `<p class="empty-state">No recent activity.</p>`;
}

function renderGoals(){

    const goalList = document.getElementById("goal-list");

    goalList.innerHTML = appData.goals.length
        ? appData.goals.map(createGoalHTML).join("")
        : `<p class="empty-state">No goals yet. Add your first one.</p>`;
}

function renderVault(){

    const vaultCategories = document.getElementById("vault-categories");

    vaultCategories.innerHTML = appData.categories.length
        ? appData.categories.map(createVaultCategoryHTML).join("")
        : `<p class="empty-state">No vault categories yet.</p>`;
}

function renderAllPages(){
    renderHome();
    renderGoals();
    renderVault();
    renderGarage();
    renderFinance();
}