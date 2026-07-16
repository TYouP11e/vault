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

    initializeActivityEvents();

    initializeGarageEvents();

    initializeFinanceEvents();

    

}

/* ==========================================
   TEMPORARILY DISABLE SERVICE WORKERS
========================================== */

if("serviceWorker" in navigator){

    window.addEventListener("load", async () => {

        const registrations =
            await navigator.serviceWorker.getRegistrations();

        for(const registration of registrations){
            await registration.unregister();
        }

        const cacheNames = await caches.keys();

        for(const cacheName of cacheNames){
            await caches.delete(cacheName);
        }

        console.log("Vault service workers and caches cleared.");

    });

}

