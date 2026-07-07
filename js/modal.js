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

function createDepositModal(){

    return `

        <div class="modal-form">

            <label>Amount</label>

            <input
                id="transaction-amount"
                type="number"
                placeholder="0.00"
                autofocus
            >

            <button id="confirm-deposit" class="primary-button">

                Deposit

            </button>

        </div>

    `;

}

function createWithdrawModal(){

    return `

        <div class="modal-form">

            <label>Amount</label>

            <input
                id="transaction-amount"
                type="number"
                placeholder="0.00"
                autofocus
            >

            <button id="confirm-withdraw" class="primary-button">

                Withdraw

            </button>

        </div>

    `;

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