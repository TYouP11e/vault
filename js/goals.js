/* ==========================================
   VAULT
   GOALS LOGIC
========================================== */

/* ---------- Find Goal ---------- */

function getGoalById(goalId){
    return appData.goals.find(goal => goal.id === Number(goalId));
}

/* ---------- Affordability ---------- */

function canAffordGoal(goal){
    return appData.balance >= goal.target;
}

function getAffordableGoals(){
    return appData.goals.filter(goal => {
        return !goal.purchased && canAffordGoal(goal);
    });
}

/* ---------- Purchase Goal ---------- */

function purchaseGoal(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    if(goal.purchased){
        return;
    }

    if(!canAffordGoal(goal)){
        alert(`You still need ${formatMoney(goal.target - appData.balance)} for ${goal.title}.`);
        return;
    }

    appData.balance -= goal.target;
    goal.purchased = true;

    appData.transactions.unshift({
        id: Date.now(),
        type: "withdraw",
        title: `Bought ${goal.title}`,
        amount: goal.target,
        date: getToday()
    });

    saveData();
    renderAllPages();
}

/* ---------- Undo Purchase ---------- */

function undoPurchaseGoal(goalId){
    const goal = getGoalById(goalId);

    if(!goal || !goal.purchased){
        return;
    }

    appData.balance += goal.target;
    goal.purchased = false;

    appData.transactions.unshift({
        id: Date.now(),
        type: "deposit",
        title: `Refunded ${goal.title}`,
        amount: goal.target,
        date: getToday()
    });

    saveData();
    renderAllPages();
}

/* ---------- Toggle Goal ---------- */

function toggleGoalPurchase(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    if(goal.purchased){
        undoPurchaseGoal(goalId);
    }else{
        purchaseGoal(goalId);
    }
}

/* ---------- Goal Events ---------- */

function initializeGoalEvents(){
    const goalList = document.getElementById("goal-list");

    goalList.addEventListener("click", event => {
        const goalCard = event.target.closest(".goal-card");

        if(!goalCard){
            return;
        }

        const goalId = goalCard.dataset.goalId;

        toggleGoalPurchase(goalId);
    });
}

/* ---------- Helpers ---------- */

function getToday(){
    return new Date().toISOString().split("T")[0];
}

function initializeAddGoalEvent(){ const addGoalButton = document.getElementById("add-goal-button"); addGoalButton.addEventListener("click", () => { openModal("Add Goal", createGoalModal()); document.getElementById("confirm-goal").addEventListener("click", submitNewGoal); }); } function submitNewGoal(){ const title = document.getElementById("goal-title").value.trim(); const target = Number(document.getElementById("goal-price").value); const category = document.getElementById("goal-category").value; const dueDate = document.getElementById("goal-date").value || "2027-01-01"; if(!title){ alert("Please enter a goal name."); return; } if(!target || target <= 0){ alert("Please enter a valid price."); return; } const newGoal = { id: Date.now(), title, category, icon: "flag", target, dueDate, purchased: false, color: "blue" }; appData.goals.push(newGoal); saveData(); renderAllPages(); closeModal(); }