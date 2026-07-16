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

/* ==========================================
   SERVICE WORKER
========================================== */

if("serviceWorker" in navigator){

    window.addEventListener("load", async () => {
        try{
            const registration = await navigator.serviceWorker.register(
                "./service-worker.js",
                {
                    updateViaCache: "none"
                }
            );

            await registration.update();

            console.log("Vault service worker registered.");

        }catch(error){
            console.error("Service worker registration failed:", error);
        }
    });

}
initializeGarageEvents();