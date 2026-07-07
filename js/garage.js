function renderGarage(){
    const bikeProfile = document.getElementById("bike-profile");

    const bike = appData.bike;

    bikeProfile.innerHTML = `
        <div class="garage-hero card">

            <div class="garage-image">
                ${
                    bike.image
                    ? `<img src="${bike.image}" alt="${bike.name}">`
                    : `<span class="material-symbols-rounded">two_wheeler</span>`
                }
            </div>

            <div class="garage-info">
                <p>Current Bike</p>
                <h2>${bike.name}</h2>
                <span>${bike.year} ${bike.make} ${bike.model}</span>
            </div>

        </div>

        <div class="garage-grid">

            <div class="garage-stat card">
                <span class="material-symbols-rounded">speed</span>
                <p>Mileage</p>
                <h3>${bike.mileage.toLocaleString()} km</h3>
            </div>

            <div class="garage-stat card">
                <span class="material-symbols-rounded">payments</span>
                <p>Value</p>
                <h3>${formatMoney(bike.purchasePrice)}</h3>
            </div>

            <div class="garage-stat card">
                <span class="material-symbols-rounded">shield</span>
                <p>Insurance</p>
                <h3>${bike.insuranceMonthly ? formatMoney(bike.insuranceMonthly) + "/mo" : "Not set"}</h3>
            </div>

            <div class="garage-stat card">
                <span class="material-symbols-rounded">event</span>
                <p>Status</p>
                <h3>Planning</h3>
            </div>

        </div>
    `;
}

function initializeGarageEvents(){
    const editBikeButton = document.getElementById("edit-bike-button");

    editBikeButton.addEventListener("click", () => {
        openBikeModal();
    });
}

function openBikeModal(){
    const bike = appData.bike;

    openModal("Bike Profile", `
        <div class="modal-form">

            <label>Bike Name</label>
            <input id="bike-name" type="text" value="${bike.name}">

            <label>Make</label>
            <input id="bike-make" type="text" value="${bike.make}">

            <label>Model</label>
            <input id="bike-model" type="text" value="${bike.model}">

            <label>Year</label>
            <input id="bike-year" type="number" value="${bike.year}">

            <label>Mileage (km)</label>
            <input id="bike-mileage" type="number" value="${bike.mileage}">

            <label>Purchase Price</label>
            <input id="bike-price" type="number" value="${bike.purchasePrice}">

            <label>Insurance / Month</label>
            <input id="bike-insurance" type="number" value="${bike.insuranceMonthly}">

            <button id="save-bike-button" class="primary-button">
                Save Bike
            </button>

        </div>
    `);

    document.getElementById("save-bike-button").addEventListener("click", saveBikeProfile);
}

function saveBikeProfile(){
    appData.bike.name = document.getElementById("bike-name").value.trim();
    appData.bike.make = document.getElementById("bike-make").value.trim();
    appData.bike.model = document.getElementById("bike-model").value.trim();
    appData.bike.year = document.getElementById("bike-year").value;
    appData.bike.mileage = Number(document.getElementById("bike-mileage").value);
    appData.bike.purchasePrice = Number(document.getElementById("bike-price").value);
    appData.bike.insuranceMonthly = Number(document.getElementById("bike-insurance").value);

    saveData();
    renderGarage();
    closeModal();
}