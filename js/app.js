/* ==========================================
   VAULT
   APP ENTRY POINT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Vault is running.");

    initializeApp();

});

function initializeApp(){

    loadData();

    initializeNavigation();

    initializeGoalEvents();

    initializeAddGoalEvent();

    initializeTransactionEvents();

    initializeSettingsEvents();

    renderAllPages();

}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

initializeGarageEvents();