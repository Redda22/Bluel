
const edition = document.querySelector(".edition"); // afficheur du mode édition
const log = document.getElementById("log"); // boutton login / logout
const modifier_button = document.getElementById("modifier"); // boutton modifier
const conn_alert = document.getElementById("alert"); // afficheur d'état de connexion




const filter = document.querySelector(".filter"); // div de filtre
let btns = [];
let filterState = ""; // correspond à l'état actuel du filtre. "" = pas de filtre


const gallery = document.querySelector(".gallery"); // div contenant tout les travaux
let cards = [];
let img = [];
let title = [];


let token = "";
let connected = false; // état de connextion

// fonction principale
async function main() {
    token = localStorage.getItem('Token'); // récupération du token dans le localstorage

    // si le token est présent :
    if (token) {
        connected = true;
    }

    // si nous somme connecté :
    if (connected) {
        log.innerHTML = "logout"; // changement de login en logout

        modifier_button.style.visibility = "visible"; // boutton de modification des travaux visible

        // affichage de l'alerteur de connexion
        conn_alert.style.visibility = "visible";
        conn_alert.style.backgroundColor = "rgba(50, 150, 0, 1)";
        conn_alert.textContent = "Connecté";
        // suppression apres 2 secondes
        setTimeout(function () {
            conn_alert.style.visibility = "hidden";
            edition.style.visibility = "visible";
        }, 2000);

        // la div de mode édition s'affiche
        edition.style.height = "5.5vh";

    }

    // condition du boutton login et logout
    log.addEventListener("click", function () {
        // en cas de clique si je suis connecté :
        if (connected) {
            connected = false; // anuler l'état de connexion
            localStorage.removeItem('Token'); // suppression du token du localstorage

            log.innerHTML = "login"; // mettre le bouton en mode login

            modifier_button.style.visibility = "hidden"; // suppression du boutton de modification des travaux
            edition.style.height = "0vh"; // suppression de la div de mode édition

            conn_alert.style.visibility = "visible";
            conn_alert.style.backgroundColor = "rgba(150, 0, 0, 1)";
            conn_alert.textContent = "Déconnecté";
            // Affichaque pendant 2s
            setTimeout(function () {
                conn_alert.style.visibility = "hidden";
                edition.style.visibility = "hidden";
            }, 2000);


        }
        // en cas de clique si je suis déconnecté
        else {
            window.location.href = "../Login/index.html"; // retour à la page de connexion
        }
    });




    // tableau destiné à contenir tout les états de chaque bouttons du filtre
    let btnState = [];


    // Système de filtre des cartes
    async function Cards_System() {

        // système de filtre
        try {
            // récupération des différentes catégories de travaux présent dans l'api
            const categories = await fetch("http://localhost:5678/api/categories");
            // le tout dans le tableau de donnée categoriesData
            let categoriesData = await categories.json();

            // pour chaque groupe de donnée dans le tableau de donnée. Un groupe correspond à : {"id": 1, "name": "Objets"}
            categoriesData.forEach(dataGroup => {
                btns[dataGroup.id] = document.createElement("button"); // création d'un boutton
                btns[dataGroup.id].id = "btn" + dataGroup.id; // ajout d'un id au boutton
                btns[dataGroup.id].textContent = dataGroup.name; // ajout de la catégorie en texte pour le boutton
                filter.appendChild(btns[dataGroup.id]); // insertion de chaque bouttons dans la div de filtre

                btnState.push(false); // ajout d'une valeur à btnState qui est un tableau contenant l'état binaire de chaques bouttons, initié en mode false
            });

            // Zone de condionnement des bouttons / Filtre
            btns.forEach(btn => {
                // écouter chaque bouttons
                btn.addEventListener("click", function () {

                    let btnNumber = parseInt(btn.id.match(/\d+/) - 1); // numérotation du boutton sous forme int. à travers match on recherche le numéro de l'id. -1 car btnState commence par 0

                    // Si l'état du boutton est false alors :
                    if (btnState[btnNumber] == false) {

                        btnState.fill(false); // mettre les états de tout les bouttons en false

                        btnState[btnNumber] = true; // mettre le button correspondant à l'actuelle btnNumber en true

                        filterState = categoriesData[btnNumber].name; // donner un état au filtre

                        btns.forEach(otherBtn => {
                            otherBtn.style.backgroundColor = "white";
                            otherBtn.style.color = "#1D6154";
                        });

                        btn.style.backgroundColor = "#1D6154";
                        btn.style.color = "white";
                        works();
                    }
                    // si l'état du boutton est true, et que l'on reclique dessus, alors on réinitialise tout les bouttons et l'état du filtre
                    else {
                        btnState.fill(false);
                        filterState = "";
                        btn.style.backgroundColor = "white";
                        btn.style.color = "#1D6154";
                        works();
                    }
                });
            });

            works();

        }
        catch (error) {
            console.log("Une erreur est survenue: ", error);
        }
    }

    Cards_System();

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

    let list_works = document.querySelector(".list_works");
    let modifier_interface = document.querySelector(".modifier_interface");
    let button_add = document.querySelector(".button_add");
    let snaps = [];
    let trash = [];
    let gallery_close = document.querySelector(".gallery_close");
    let delete_works = [];

    modifier_button.addEventListener("click", function () {
        modifier_interface.style.visibility = "visible";
        modifier();
    });

    gallery_close.addEventListener("click", function () {
        modifier_interface.style.visibility = "hidden";
    });

    async function modifier() {
        try {
            const works = await fetch("http://localhost:5678/api/works"); // Récupération des données depuis l'API
            let worksData = await works.json(); // Conversion de la réponse en format JSON

            list_works.innerHTML = "";

            worksData.forEach(dataGroup => { // Parcours de chaque groupe de données

                let img = document.createElement("img"); // Crée un élément <img>
                img.src = dataGroup.imageUrl; // Définit l'attribut 'src' de <img>

                snaps[dataGroup.id] = document.createElement("figure"); // Crée un élément <img> pour chaque projet
                snaps[dataGroup.id].appendChild(img); // Ajoute <img> à <figure>

                trash[dataGroup.id] = document.createElement("i"); // Crée un élément <i> pour chaque projet
                trash[dataGroup.id].classList.add('fa-solid', 'fa-trash-can', 'trash' + dataGroup.id);
                snaps[dataGroup.id].appendChild(trash[dataGroup.id]);

                list_works.appendChild(snaps[dataGroup.id]);

                let url = 'http://localhost:5678/api/works/' + dataGroup.id;

                trash[dataGroup.id].addEventListener("click", function () {
                    deleteData(url);
                })


            });

            if (delete_works) {
                console.log(delete_works)
            }
        }
        catch (error) {
            console.log("Une erreur est survenue: ", error);
        }



    }


    async function deleteData(url) {
        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la suppression des données :", error);
        }

        // mise à jour des galleries
        modifier();
        works();
    }


}


main();