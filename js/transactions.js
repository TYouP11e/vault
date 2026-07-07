/* ==========================================
   VAULT
   TRANSACTIONS / BALANCE ACTIONS
========================================== */

function initializeTransactionEvents(){
    document.getElementById("deposit-button").addEventListener("click", () => {
        openModal("Deposit", createDepositModal());

        document.getElementById("confirm-deposit").addEventListener("click", () => {
            submitTransaction("deposit");
        });
    });

    document.getElementById("withdraw-button").addEventListener("click", () => {
        openModal("Withdraw", createWithdrawModal());

        document.getElementById("confirm-withdraw").addEventListener("click", () => {
            submitTransaction("withdraw");
        });
    });
}

function submitTransaction(type){
    const amount = Number(document.getElementById("transaction-amount").value);

    if(!amount || amount <= 0){
        alert("Please enter a valid amount.");
        return;
    }

    if(type === "withdraw" && amount > appData.balance){
        alert("You can't withdraw more than your current savings.");
        return;
    }

    appData.balance += type === "deposit" ? amount : -amount;

    appData.transactions.unshift({
        id: Date.now(),
        type,
        title: type === "deposit" ? "Deposit" : "Withdraw",
        amount,
        date: getToday()
    });

    saveData();
    renderAllPages();
    animateBalanceUpdate();
    closeModal();
}

function animateBalanceUpdate(){
    const balance = document.getElementById("current-balance");
    const progress = document.querySelector(".overall-progress-fill");

    balance.classList.remove("updated");
    progress.classList.remove("updated");

    void balance.offsetWidth;
    void progress.offsetWidth;

    balance.classList.add("updated");
    progress.classList.add("updated");
}

function initializeSettingsEvents(){
    const clearButton = document.getElementById("clear-transactions-button");

    if(!clearButton){
        return;
    }

    clearButton.addEventListener("click", () => {

    openModal(

        "Clear Transactions",

        createConfirmModal(

            "Clear",

            "This will permanently remove every transaction. Your savings balance will not change.",

            "Clear"

        )

    );

    document
        .getElementById("cancel-action")
        .addEventListener("click", closeModal);

    document
        .getElementById("confirm-action")
        .addEventListener("click", () => {

            appData.transactions = [];

            saveData();

            renderAllPages();

            closeModal();

        });

});
}