/* ==========================================
   VAULT
   VAULT / CATEGORY LOGIC
========================================== */

/* ---------- Category Helpers ---------- */

function getCategoryByTitle(categoryTitle){
    return appData.categories.find(category => {
        return category.title === categoryTitle;
    });
}

function getGoalsByCategory(categoryTitle){
    return appData.goals.filter(goal => {
        return goal.category === categoryTitle;
    });
}

function getCategoryTarget(categoryTitle){
    const category = getCategoryByTitle(categoryTitle);

    return category ? category.target : 0;
}

/* ---------- Category Progress ---------- */

function getCategoryGoalTotal(categoryTitle){
    return getGoalsByCategory(categoryTitle).reduce((total, goal) => {
        return total + goal.target;
    }, 0);
}

function getCategoryPurchasedTotal(categoryTitle){
    return getGoalsByCategory(categoryTitle).reduce((total, goal) => {
        if(goal.purchased){
            return total + goal.target;
        }

        return total;
    }, 0);
}

function getCategoryRemaining(categoryTitle){
    const target = getCategoryTarget(categoryTitle);
    const saved = getCategorySavedAmount(categoryTitle);

    return Math.max(target - saved, 0);
}

function getCategoryPercent(categoryTitle){
    const category = getCategoryByTitle(categoryTitle);

    if(!category){
        return 0;
    }

    const saved = getCategorySavedAmount(categoryTitle);

    return getPercent(saved, category.target);
}

/* ---------- App Wide Progress ---------- */

function getOverallProgress(){
    const totalTarget = getTotalTarget();

    if(totalTarget <= 0){
        return 0;
    }

    return getPercent(appData.balance, totalTarget);
}

function getTotalRemaining(){
    const totalTarget = getTotalTarget();

    return Math.max(totalTarget - appData.balance, 0);
}

/* ---------- Affordability By Category ---------- */

function getAffordableGoalsByCategory(categoryTitle){
    return getGoalsByCategory(categoryTitle).filter(goal => {
        return !goal.purchased && canAffordGoal(goal);
    });
}

/* ---------- Summary Data ---------- */

function getVaultSummary(){
    return appData.categories.map(category => {
        const saved = getCategorySavedAmount(category.title);
        const percent = getPercent(saved, category.target);
        const remaining = Math.max(category.target - saved, 0);
        const goals = getGoalsByCategory(category.title);
        const purchasedGoals = goals.filter(goal => goal.purchased);

        return {
            ...category,
            saved,
            percent,
            remaining,
            goalCount: goals.length,
            purchasedGoalCount: purchasedGoals.length
        };
    });
}