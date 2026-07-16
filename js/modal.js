/* ==========================================
   VAULT
   MODAL SYSTEM
========================================== */

const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

/* ==========================================
   OPEN
========================================== */

function openModal(title, html){

    modalTitle.textContent = title;

    modalBody.innerHTML = html;

    modalOverlay.classList.remove("hidden");

}

/* ==========================================
   CLOSE
========================================== */

function closeModal(){

    modalOverlay.classList.add("hidden");

    modalBody.innerHTML = "";

}

/* ==========================================
   EVENTS
========================================== */

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", function(event){

    if(event.target === modalOverlay){

        closeModal();

    }

});

/* ==========================================
   MODAL TEMPLATES
========================================== */

/* ==========================================
   TRANSACTION MODALS
========================================== */

function createTransactionModal(type){
    const isDeposit = type === "deposit";

    return `
        <div class="modal-form">

            <label for="transaction-title">
                Name
            </label>

            <input
                id="transaction-title"
                type="text"
                maxlength="50"
                placeholder="${isDeposit ? "Paycheck" : "Bought gloves"}"
                value="${isDeposit ? "Deposit" : "Withdraw"}"
            >

            <label for="transaction-amount">
                Amount
            </label>

            <input
                id="transaction-amount"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                placeholder="0.00"
            >

            <label for="transaction-description">
                Description
                <span class="optional-label">Optional</span>
            </label>

            <textarea
                id="transaction-description"
                rows="4"
                maxlength="300"
                placeholder="${isDeposit
                    ? "Example: DQ paycheck after tax"
                    : "Example: Alpinestars gloves from Argyll Motorsports"}"
            ></textarea>

            <label for="transaction-date">
                Date
            </label>

            <input
                id="transaction-date"
                type="date"
                value="${getToday()}"
            >

            <button
                id="confirm-transaction"
                class="primary-button"
                type="button"
            >
                ${isDeposit ? "Add Deposit" : "Add Withdrawal"}
            </button>

        </div>
    `;
}

function createDepositModal(){
    return createTransactionModal("deposit");
}

function createWithdrawModal(){
    return createTransactionModal("withdraw");
}

function createTransactionDetailsModal(transaction){
    const isDeposit = transaction.type === "deposit";

    return `
        <div class="transaction-details">

            <div class="transaction-detail-hero">

                <div class="activity-icon large ${transaction.type}">
                    <span class="material-symbols-rounded">
                        ${isDeposit ? "arrow_downward" : "arrow_upward"}
                    </span>
                </div>

                <p>${isDeposit ? "Deposit" : "Withdrawal"}</p>

                <h3 class="${transaction.type}">
                    ${isDeposit ? "+" : "-"}${formatMoney(transaction.amount)}
                </h3>

            </div>

            <div class="transaction-detail-list">

                <div class="transaction-detail-item">
                    <span>Name</span>
                    <strong>${transaction.title || (isDeposit ? "Deposit" : "Withdraw")}</strong>
                </div>

                <div class="transaction-detail-item">
                    <span>Date</span>
                    <strong>${formatDate(transaction.date)}</strong>
                </div>

                <div class="transaction-detail-item description-item">
                    <span>Description</span>
                    <p>
                        ${transaction.description || "No description added."}
                    </p>
                </div>

            </div>

            <button
                id="edit-transaction-button"
                class="primary-button"
                type="button"
            >
                <span class="material-symbols-rounded">edit</span>
                Edit Transaction
            </button>

        </div>
    `;
}

function createEditTransactionModal(transaction){
    return `
        <div class="modal-form">

            <label for="edit-transaction-title">
                Name
            </label>

            <input
                id="edit-transaction-title"
                type="text"
                maxlength="50"
                value="${escapeHTMLAttribute(
                    transaction.title ||
                    (transaction.type === "deposit" ? "Deposit" : "Withdraw")
                )}"
            >

            <label for="edit-transaction-amount">
                Amount
            </label>

            <input
                id="edit-transaction-amount"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                value="${transaction.amount}"
            >

            <label for="edit-transaction-description">
                Description
                <span class="optional-label">Optional</span>
            </label>

            <textarea
                id="edit-transaction-description"
                rows="4"
                maxlength="300"
            >${escapeHTML(transaction.description || "")}</textarea>

            <label for="edit-transaction-date">
                Date
            </label>

            <input
                id="edit-transaction-date"
                type="date"
                value="${transaction.date}"
            >

            <button
                id="save-transaction-button"
                class="primary-button"
                type="button"
            >
                Save Changes
            </button>

        </div>
    `;
}

/* ---------- Safe text helpers ---------- */

function escapeHTML(value){
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeHTMLAttribute(value){
    return escapeHTML(value);
}

function createGoalModal(){

    return `

        <div class="modal-form">

            <label>Goal Name</label>

            <input
                id="goal-title"
                type="text"
                placeholder="Helmet"
            >

            <label>Target Price</label>

            <input
                id="goal-price"
                type="number"
                placeholder="950"
            >

            <label>Category</label>

            <select id="goal-category">

                <option>Gear</option>
                <option>Bike</option>
                <option>Maintenance</option>
                <option>Insurance</option>
                <option>Registration</option>

            </select>

            <label>Due Date</label>

            <input
                id="goal-date"
                type="date"
            >

            <button
                id="confirm-goal"
                class="primary-button"
            >

                Add Goal

            </button>

        </div>

    `;

}

function createConfirmModal(title, message, buttonText){

    return `

        <div class="confirm-modal">

            <p class="confirm-message">

                ${message}

            </p>

            <div class="confirm-buttons">

                <button
                    id="cancel-action"
                    class="secondary-button">

                    Cancel

                </button>

                <button
                    id="confirm-action"
                    class="danger-button">

                    ${buttonText}

                </button>

            </div>

        </div>

    `;

}