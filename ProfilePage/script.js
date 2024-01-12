const gallery = document.querySelector(".gallery"); // Sélectionne l'élément 'gallery' du DOM
const log = document.getElementById("log");
const modifier_button = document.getElementById("modifier");
const conn_alert = document.getElementById("alert");
// Initialisation de tableaux pour stocker les éléments des cartes
let cards = [];
let img = [];
let title = [];

const filter = document.querySelector(".filter");
let btns = [];
let filterState = "";

let token = "";

let connected = false;

async function main() {
    token = localStorage.getItem('Token');
    console.log(token);

    if (token) {
        connected = true;
    }

    if (connected) {
        modifier_button.style.visibility = "visible";
        log.innerHTML = "logout";

        conn_alert.style.visibility = "visible";
        conn_alert.style.backgroundColor = "rgba(50, 150, 0, 1)";
        conn_alert.textContent = "Connecté";
        setTimeout(function () {
            conn_alert.style.visibility = "hidden";
        }, 2000);
    }

    log.addEventListener("click", function () {
        if (connected) {
            connected = false;
            log.innerHTML = "login";
            log.style.color = "black";
            localStorage.removeItem('Token');
            modifier_button.style.visibility = "hidden";

            conn_alert.style.visibility = "visible";
            conn_alert.style.backgroundColor = "rgba(150, 0, 0, 1)";
            conn_alert.textContent = "Déconnecté";
            setTimeout(function () {
                conn_alert.style.visibility = "hidden";
            }, 2000);
        }
        else {
            window.location.href = "../Login/index.html";
        }
    });











    async function Cards_System() {
        // Système de filtre de d'affichage des cartes
        try {
            const categories = await fetch("http://localhost:5678/api/categories");
            let categoriesData = await categories.json();

            categoriesData.forEach(dataGroup => {
                btns[dataGroup.id] = document.createElement("button");
                btns[dataGroup.id].id = "btn" + dataGroup.id;
                btns[dataGroup.id].textContent = dataGroup.name;
                filter.appendChild(btns[dataGroup.id]);

            });

            // Zone de condionnement des bouttons / Filtre
            let btnState = [false, false, false];
            btns.forEach(btn => {
                btn.addEventListener("click", function () {
                    let btnNumber = parseInt(btn.id.match(/\d+/) - 1);

                    if (btnState[btnNumber] == false) {
                        btnState = [false, false, false];
                        btnState[btnNumber] = true;
                        filterState = categoriesData[btnNumber].name;

                        btns.forEach(otherBtn => {
                            otherBtn.style.backgroundColor = "white";
                            otherBtn.style.color = "#1D6154";
                        });

                        btn.style.backgroundColor = "#1D6154";
                        btn.style.color = "white";
                        works();
                    }
                    else {
                        btnState = [false, false, false];
                        filterState = "";
                        btn.style.backgroundColor = "white";
                        btn.style.color = "#1D6154";
                        works();
                    }
                });
            });

            async function works() {
                try {

                    const works = await fetch("http://localhost:5678/api/works"); // Récupération des données depuis l'API
                    let worksData = await works.json(); // Conversion de la réponse en format JSON

                    gallery.innerHTML = "";

                    worksData.forEach(dataGroup => { // Parcours de chaque groupe de données
                        cards[dataGroup.id] = document.createElement("figure"); // Crée un élément <figure> pour chaque projet
                        img[dataGroup.id] = document.createElement("img"); // Crée un élément <img> pour chaque projet
                        title[dataGroup.id] = document.createElement("figcaption"); // Crée un élément <figcaption> pour chaque projet

                        if (filterState == "" || filterState == dataGroup.category.name) {

                            img[dataGroup.id].src = dataGroup.imageUrl; // Définit l'attribut 'src' de <img>
                            title[dataGroup.id].textContent = dataGroup.title; // Définit le texte de <figcaption>

                            cards[dataGroup.id].appendChild(img[dataGroup.id]); // Ajoute <img> à <figure>
                            cards[dataGroup.id].appendChild(title[dataGroup.id]); // Ajoute <figcaption> à <figure>

                            gallery.appendChild(cards[dataGroup.id]); // Ajoute <figure> à l'élément 'gallery' dans le DOM
                        }
                    });
                }
                catch (error) {
                    console.log("Une erreur est survenue: ", error);
                }

            }

            works();

        }
        catch (error) {
            console.log("Une erreur est survenue: ", error);
        }
    }

    Cards_System();


}


main();