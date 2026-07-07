/* ==========================================
   VAULT
   NAVIGATION
========================================== */

const pages = document.querySelectorAll(".page");
const navigationButtons = document.querySelectorAll(".nav-item");

/* ==========================================
   INITIALIZE
========================================== */

function initializeNavigation(){

    navigationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            navigateTo(page);

        });

    });

}

/* ==========================================
   PAGE NAVIGATION
========================================== */

function navigateTo(pageID){

    hideAllPages();

    removeActiveNavigation();

    const selectedPage = document.getElementById(pageID);

    if(selectedPage){

        selectedPage.classList.add("active");

    }

    document
        .querySelector(`[data-page="${pageID}"]`)
        .classList.add("active");

}

/* ==========================================
   HELPERS
========================================== */

function hideAllPages(){

    pages.forEach(page => {

        page.classList.remove("active");

    });

}

function removeActiveNavigation(){

    navigationButtons.forEach(button => {

        button.classList.remove("active");

    });

}