/* ==========================================
   VAULT
   LOCAL STORAGE
========================================== */

const STORAGE_KEY = "vault_app_data";

/* ---------- Load Data ---------- */

function loadData(){
    const savedData = localStorage.getItem(STORAGE_KEY);

    if(!savedData){
        saveData();
        return;
    }

    try{
        const parsedData = JSON.parse(savedData);

        appData = {
            ...appData,
            ...parsedData
        };

    }catch(error){
        console.error("Vault failed to load saved data:", error);
        saveData();
    }
}

/* ---------- Save Data ---------- */

function saveData(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* ---------- Reset Data ---------- */

function resetData(){
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

/* ---------- Export Data ---------- */

function exportData(){
    const dataString = JSON.stringify(appData, null, 4);

    const blob = new Blob([dataString], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "vault-backup.json";

    link.click();

    URL.revokeObjectURL(url);
}

/* ---------- Import Data ---------- */

function importData(file){
    const reader = new FileReader();

    reader.onload = event => {
        try{
            const importedData = JSON.parse(event.target.result);

            appData = {
                ...appData,
                ...importedData
            };

            saveData();
            renderAllPages();

        }catch(error){
            console.error("Vault failed to import data:", error);
            alert("That file could not be imported.");
        }
    };

    reader.readAsText(file);
}