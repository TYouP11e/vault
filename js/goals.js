/* ==========================================
   VAULT
   GOALS LOGIC
========================================== */

function getGoalById(goalId){
    return appData.goals.find(goal => goal.id === Number(goalId));
}

function canAffordGoal(goal){
    return appData.balance >= goal.target;
}

function getAffordableGoals(){
    return appData.goals.filter(goal => !goal.purchased && canAffordGoal(goal));
}

function initializeGoalEvents(){
    const goalList = document.getElementById("goal-list");

    goalList.addEventListener("click", event => {
        const goalCard = event.target.closest(".goal-card");

        if(!goalCard){
            return;
        }

        const goalId = goalCard.dataset.goalId;
        openGoalDetails(goalId);
    });
}

function initializeAddGoalEvent(){
    const addGoalButton = document.getElementById("add-goal-button");

    addGoalButton.addEventListener("click", () => {
        openModal("Add Goal", createGoalModal());

        document
            .getElementById("confirm-goal")
            .addEventListener("click", submitNewGoal);
    });
}

/* ---------- Goal Details Modal ---------- */

function openGoalDetails(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    openModal(goal.title, createGoalDetailsModal(goal));

    document
        .getElementById("goal-toggle-purchase")
        .addEventListener("click", () => toggleGoalPurchase(goal.id));

    document
        .getElementById("goal-edit")
        .addEventListener("click", () => openEditGoalModal(goal.id));

    document
        .getElementById("goal-delete")
        .addEventListener("click", () => openDeleteGoalModal(goal.id));
}

function createGoalDetailsModal(goal){
    const daysLeft = getDaysUntil(goal.dueDate);
    const affordable = canAffordGoal(goal);

    return `
        <div class="goal-details-modal">

            <div class="goal-modal-icon">
                <span class="material-symbols-rounded">${goal.icon}</span>
            </div>

            <div class="goal-modal-info">
                <p>${goal.category}</p>
                <h3>${formatMoney(goal.target)}</h3>
                <p>${formatDate(goal.dueDate)} • ${daysLeft >= 0 ? `${daysLeft} days left` : "Past due"}</p>
            </div>

            <div class="goal-modal-actions">

                <button id="goal-toggle-purchase"
                        class="primary-button"
                        ${!goal.purchased && !affordable ? "disabled" : ""}>
                    ${goal.purchased ? "Mark Not Purchased" : affordable ? "Mark Purchased" : "Not Enough Saved"}
                </button>

                <button id="goal-edit" class="secondary-button">
                    Edit Goal
                </button>

                <button id="goal-delete" class="danger-button">
                    Delete Goal
                </button>

            </div>

        </div>
    `;
}

/* ---------- Add Goal ---------- */

function submitNewGoal(){
    const title = document.getElementById("goal-title").value.trim();
    const target = Number(document.getElementById("goal-price").value);
    const category = document.getElementById("goal-category").value;
    const dueDate = document.getElementById("goal-date").value || "2027-01-01";

    if(!title){
        alert("Please enter a goal name.");
        return;
    }

    if(!target || target <= 0){
        alert("Please enter a valid price.");
        return;
    }

    const newGoal = {
        id: Date.now(),
        title,
        category,
        icon: getDefaultIconForCategory(category),
        target,
        dueDate,
        purchased: false,
        color: getDefaultColorForCategory(category)
    };

    appData.goals.push(newGoal);

    saveData();
    renderAllPages();
    closeModal();
}

/* ---------- Edit Goal ---------- */

function openEditGoalModal(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    openModal("Edit Goal", createEditGoalModal(goal));

    document
        .getElementById("confirm-edit-goal")
        .addEventListener("click", () => submitEditGoal(goal.id));
}

function createEditGoalModal(goal){
    return `
        <div class="modal-form">

            <label>Goal Name</label>
            <input id="edit-goal-title" type="text" value="${goal.title}">

            <label>Target Price</label>
            <input id="edit-goal-price" type="number" value="${goal.target}">

            <label>Category</label>
            <select id="edit-goal-category">
                <option ${goal.category === "Gear" ? "selected" : ""}>Gear</option>
                <option ${goal.category === "Bike" ? "selected" : ""}>Bike</option>
                <option ${goal.category === "Maintenance" ? "selected" : ""}>Maintenance</option>
                <option ${goal.category === "Insurance" ? "selected" : ""}>Insurance</option>
                <option ${goal.category === "Registration" ? "selected" : ""}>Registration</option>
            </select>

            <label>Due Date</label>
            <input id="edit-goal-date" type="date" value="${goal.dueDate}">

            <button id="confirm-edit-goal" class="primary-button">
                Save Changes
            </button>

        </div>
    `;
}

function submitEditGoal(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    const title = document.getElementById("edit-goal-title").value.trim();
    const target = Number(document.getElementById("edit-goal-price").value);
    const category = document.getElementById("edit-goal-category").value;
    const dueDate = document.getElementById("edit-goal-date").value || goal.dueDate;

    if(!title){
        alert("Please enter a goal name.");
        return;
    }

    if(!target || target <= 0){
        alert("Please enter a valid price.");
        return;
    }

    goal.title = title;
    goal.target = target;
    goal.category = category;
    goal.dueDate = dueDate;
    goal.icon = getDefaultIconForCategory(category);
    goal.color = getDefaultColorForCategory(category);

    saveData();
    renderAllPages();
    closeModal();
}

/* ---------- Delete Goal ---------- */

function openDeleteGoalModal(goalId){
    const goal = getGoalById(goalId);

    if(!goal){
        return;
    }

    openModal(
        "Delete Goal",
        createConfirmModal(
            "Delete",
            `This will permanently delete "${goal.title}". This will not change your current savings balance.`,
            "Delete"
        )
    );

    document.getElementById("cancel-action").addEventListener("click", closeModal);

    document.getElementById("confirm-action").addEventListener("click", () => {
        deleteGoal(goal.id);
    });
}

function deleteGoal(goalId){
    appData.goals = appData.goals.filter(goal => goal.id !== Number(goalId));

    saveData();
    renderAllPages();
    closeModal();
}

/* ---------- Purchase / Undo ---------- */

function purchaseGoal(goalId){
    const goal = getGoalById(goalId);

    if(!goal || goal.purchased){
        return;
    }

    if(!canAffordGoal(goal)){
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
    closeModal();
}

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
    closeModal();
}

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

/* ---------- Defaults ---------- */

function getDefaultIconForCategory(category){
    const icons = {
        Gear: "sports_motorsports",
        Bike: "two_wheeler",
        Maintenance: "build",
        Insurance: "shield",
        Registration: "description"
    };

    return icons[category] || "flag";
}

function getDefaultColorForCategory(category){
    const colors = {
        Gear: "purple",
        Bike: "blue",
        Maintenance: "orange",
        Insurance: "green",
        Registration: "yellow"
    };

    return colors[category] || "blue";
}

/* ---------- Helpers ---------- */

function getToday(){
    return new Date().toISOString().split("T")[0];
}