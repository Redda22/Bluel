const edition = document.querySelector(".edition"); // afficheur du mode édition
const log = document.getElementById("log"); // boutton login / logout
const modifier_button = document.getElementById("modifier"); // boutton modifier
const conn_alert = document.getElementById("alert"); // afficheur d'état de connexion
const gallery = document.querySelector(".gallery"); // div contenant tout les travaux
const filter = document.querySelector(".filter"); // div de filtre
const modifier_interface = document.querySelector(".modifier_interface"); // interface de modification de la gallerie
const gallery_interface = document.querySelector(".gallery_interface");
const add_work = document.querySelector(".add_work");
const arrow_back = document.querySelector(".arrow_back");
const gallery_close = document.querySelector(".gallery_close"); // boutton de fermeture de la gallerie d'édition
const add_work_close = document.querySelector(".add_work_close");
const button_add = document.querySelector(".button_add"); // boutton d'ajout de travaux
const imgPreview = document.getElementById('imagePreview');
const add_button = document.querySelector(".add_photo #add_button");
const add_img_input = document.querySelector(".add_photo input");
const add_validate = document.querySelector(".add_validate");
const choose_photo = document.querySelector(".choose_photo");
const list_select = document.getElementById("categorie");
const titre_select = document.getElementById("titre");
const btn_all = document.getElementById("btn_all");

// fonction modifier
const list_works = document.querySelector(".list_works"); // div contenant la liste des travaux éditable dans l'interface de modification
let figure = []; // les <figure> contenant chaque img de travaux
let trash = []; // logo poubelle dans chaque figure

let btns = [];
let cards = [];
let img = [];
let title = [];
let options = [];
let btnState = []; // tableau destiné à contenir tout les états de chaque bouttons du filtre
let filterState = ""; // correspond à l'état actuel du filtre. "" = pas de filtre
let token = "";
let connected = false; // état de connextion
let dataImg = "";



token = localStorage.getItem('Token'); // récupération du token dans le localstorage
// si le token est présent :
if (token) {
    connected = true;
}
// si nous somme connecté :
if (connected) {
    log.innerHTML = "logout"; // changement de login en logout

    modifier_button.style.visibility = "visible"; // boutton de modification des travaux visible

    filter.style.display = "none"

    alert("Connecté", "rgba(50, 150, 0, 1)");

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

        filter.style.display = "flex"
        btnState.fill(false); // Tout les bouton du filtre en négatif

        modifier_button.style.visibility = "hidden"; // suppression du boutton de modification des travaux
        edition.style.height = "0vh"; // suppression de la div de mode édition


        alert("Déconnecté", "rgba(150, 0, 0, 1)");

    }
    // en cas de clique si je suis déconnecté
    else {
        window.location.href = "../Login/index.html"; // retour à la page de connexion
    }
});


Cards_System();


// Quand je clique sur le boutton modifier
modifier_button.addEventListener("click", function () {
    modifier_interface.style.display = "flex"; // Affichage de l'interface de modification qui était en display: "none"
    gallery_interface.style.display = "flex"; // Affichage de la gallerie de l'interface de modification
    add_work.style.display = "none"; // Par précaution, ne pas afficher la page d'ajout de travaux
    modifier(); // Appel de la fonction d'affichage des travaux pour modifications
});

// En cas de clique sur la zone sombre de l'interface, en dehors de la case blanche
modifier_interface.addEventListener("click", function (event) {
    // Si le clique est fait précisement sur la zone grise, et non sur la case blanche
    if (event.target === this) {
        // Effacement de tout les composants (par précaution)
        modifier_interface.style.display = "none";
        imgPreview.style.display = "none";
        add_work.style.display = "none";
        gallery_interface.style.display = "none";
    }
})

/* *************** Gallerie Photo ******************** */
// Quand je clique sur la croix de l'interface, page côté gallerie
gallery_close.addEventListener("click", function () {
    modifier_interface.style.display = "none"; // Effacement de l'interface
});
// Quand je clique sur le boutton "Ajouter une photo"
button_add.addEventListener("click", function () {
    gallery_interface.style.display = "none"; // Effacement de la page de gallerie de modification
    add_work.style.display = "flex"; // Affichage de la page d'ajout

    imgPreview.style.display = "none"; // Effacement de la visualisation de l'image importé (page d'Ajout)
    choose_photo.style.display = "flex"; // Affichage du boutton pour importer une photo

    list_select.innerHTML = ""; // Pour éviter l'accumulation, mettre la liste de categories de la page d'ajout à vide

    // Création et ajout d'une option vide au boutton de categorie
    var emptyOption = document.createElement('option');
    emptyOption.textContent = "";
    emptyOption.value = "";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    list_select.insertBefore(emptyOption, list_select.firstChild);

    add_select(); // recherche de chaque categories disponible dans l'API et les mettres en options

})
async function add_select() {
    try {
        const categories = await fetch("http://localhost:5678/api/categories");
        let categoriesData = await categories.json();

        categoriesData.forEach(dataGroup => {
            options[dataGroup.id] = document.createElement("option");
            options[dataGroup.id].textContent = dataGroup.name;
            // Boutton de selection des categories
            document.getElementById("categorie").appendChild(options[dataGroup.id]);
        });

    }
    catch (error) {
        console.log("Une erreur est survenue: ", error);
    }
}


/* ****************** Ajout Photo ******************** */
// Quand je clique sur le boutton retour de l'interface
arrow_back.addEventListener("click", function () {
    gallery_interface.style.display = "flex"; // Affichage de la page gallerie de modification
    add_work.style.display = "none"; // Effacement de la page d'Ajout de photo
})
// Quand je clique sur la croix de l'interface, page côté Ajout de travaux
add_work_close.addEventListener("click", function () {
    modifier_interface.style.display = "none"; // Effacement de l'interface
});


// En cas de clique sur le boutton d'intégration d'une nouvelle photo
add_button.addEventListener("click", function () {
    add_img_input.click(); // Emmettre un clique sur l'input de type file
});
// Dès la réception du clique, ouvrir le menu de selection
add_img_input.addEventListener("change", function (event) {

    var file = event.target.files[0];
    if (file && file.size <= 4 * 1024 * 1024) {  // Vérifie si un fichier a été sélectionné et si sa taille est <= 4 Mo
        var reader = new FileReader();

        reader.onload = function (e) {
            dataImg = e.target.result;  // Stocke de l'image sous forme data64
            imgPreview.src = dataImg; // Met imgPreview à l'url de l'image sélectionné

            choose_photo.style.display = "none"; // Effacement de la div d'ajout de photo
            imgPreview.style.display = "block"; // Affichage de l'image

            if (/\S/.test(titre_select.value) && dataImg != "" && list_select.selectedIndex > 0) {  // Vérifie si un titre est associé, si une image est chargée et si une categorie est séléctionné
                add_validate.style.backgroundColor = "#1D6154";  // Active le bouton de validation (vert)
                add_validate.style.cursor = "pointer";
            }
            else {
                // Sinon ne l'active pas
                add_validate.style.backgroundColor = "#A7A7A7";  // Désactive le bouton de validation (gris)
                add_validate.style.cursor = "not-allowed";
            }
        };

        reader.readAsDataURL(file);  // Commence la lecture du fichier en tant qu'URL de données
        this.value = "";  // Réinitialise l'élément input de type fichier après le chargement du fichier (par précaution)
    }
    else {
        alert("Fichier trop volumineux", "rgba(150, 0, 0, 1)"); // alerte personalisé si l'image est trop grande
        this.value = "";
        return;
    }
})

// Detection que tout les champs sont remplis, autrement le boutton de validation n'est pas activé
document.addEventListener('keyup', function () { // Champ du titre
    // Si il y'a une image lié et un titre associé sur la page d'ajout, alors mettre le boutton d'ajout en vert
    if (/\S/.test(titre_select.value) && dataImg != "" && list_select.selectedIndex > 0) {
        add_validate.style.backgroundColor = "#1D6154";
        add_validate.style.cursor = "pointer";
    }
    else {
        add_validate.style.backgroundColor = "#A7A7A7";
        add_validate.style.cursor = "not-allowed";
    }
});
list_select.addEventListener('change', function () { // champ des categories
    if (/\S/.test(titre_select.value) && dataImg != "" && list_select.selectedIndex > 0) {
        add_validate.style.backgroundColor = "#1D6154";
        add_validate.style.cursor = "pointer";
    }
    else {
        add_validate.style.backgroundColor = "#A7A7A7";
        add_validate.style.cursor = "not-allowed";
    }
});

// Boutton Valider
add_validate.addEventListener("click", function () {
    // Si tous les champs sont remplis
    if (dataImg && titre_select.value != "" && list_select.selectedIndex > 0) {
        post_work(); // Je poste le travail
    }
    else {
        alert("champs manquants", "rgba(0, 0, 0, 1)");
    }
})






async function Cards_System() {

    // système de filtre
    try {
        const categories = await fetch("http://localhost:5678/api/categories");// récupération des différentes catégories de travaux présent dans l'api
        let categoriesData = await categories.json();// le tout dans le tableau de donnée categoriesData

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

                    // Désactivation de tout les autres bouttons
                    btns.forEach(otherBtn => {
                        otherBtn.style.backgroundColor = "white";
                        otherBtn.style.color = "#1D6154";
                    });
                    // Boutton "Tous"
                    btn_all.style.backgroundColor = "white";
                    btn_all.style.color = "#1D6154";

                    // Activation du boutton sur lequel j'ai cliqué
                    btn.style.backgroundColor = "#1D6154";
                    btn.style.color = "white";
                    
                    works();
                }
            });
        });

        // Boutton "Tous" activé par default
        btn_all.style.backgroundColor = "#1D6154";
        btn_all.style.color = "white";

        // En cas de clique sur le boutton "Tous"
        btn_all.addEventListener("click", function () {
            btns.forEach(otherBtn => {
                otherBtn.style.backgroundColor = "white";
                otherBtn.style.color = "#1D6154";
            });
            btn_all.style.backgroundColor = "#1D6154";
            btn_all.style.color = "white";
            btnState.fill(false);
            filterState = "";
            works();
        });


        works();

    }
    catch (error) {
        console.log("Une erreur est survenue: ", error);
    }
}

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
async function modifier() {
    try {
        const works = await fetch("http://localhost:5678/api/works");
        let worksData = await works.json();

        list_works.innerHTML = ""; // Par précaution on vide la liste avant de réactualiser, afin de ne pas crée d'accumulation non désiré

        worksData.forEach(dataGroup => { // Parcours de chaque groupe de données

            let img = document.createElement("img"); // Crée un élément <img>
            img.src = dataGroup.imageUrl; // Définit l'attribut 'src' de <img>

            trash[dataGroup.id] = document.createElement("i"); // Crée un élément <i> pour chaque travaux
            trash[dataGroup.id].classList.add('fa-solid', 'fa-trash-can', 'trash');

            figure[dataGroup.id] = document.createElement("figure"); // Crée un élément <figure> pour chaque travaux
            figure[dataGroup.id].appendChild(img); // Ajoute de l'image à figure
            figure[dataGroup.id].appendChild(trash[dataGroup.id]); // Ajout du logo poubelle à figure

            list_works.appendChild(figure[dataGroup.id]); // Ajout des figures à la liste des travaux

            // Si un logo poubelle spécifique reçois un clique :
            trash[dataGroup.id].addEventListener("click", function () {
                let url = 'http://localhost:5678/api/works/' + dataGroup.id; // Déterminer l'url de l'image concerné
                deleteData(url); // appel de la fonction de supression pour supprimer le travaux venant de l'url
            })


        });
    }
    catch (error) {
        console.log("Une erreur est survenue: ", error);
    }
}

async function deleteData(url) {
    try { // Essaie de fetch avec l'url donné précédement, en method delete
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // token d'autorisation
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`); // en cas d'érreur
        }
        alert("Work supprimé", "rgba(0, 0, 0, 1)");  // en cas de réussite, mettre une alerte de réussite

    } catch (error) {
        console.error("Erreur lors de la suppression des données :", error);
    }

    // mise à jour des galleries
    modifier(); // dans la gallerie de modification
    works(); // Dans la gallerie principale
}

// Fonction pour post d'un nouveau work
async function post_work() {

    var imgBlob = dataURLtoBlob(dataImg); // Conversion en blob

    // Formulaire de données adapté à l'API
    let formData = new FormData();
    formData.append('image', imgBlob);
    formData.append('title', titre_select.value);
    formData.append('category', list_select.selectedIndex + 1);

    await fetch('http://localhost:5678/api/works', {
        method: 'POST',

        body: formData,

        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP, statut : ${response.status}`);
            }
            // Actualisation des galleries
            works();
            modifier();
            // Effacement de l'interface
            add_work.style.display = "none";
            modifier_interface.style.display = "none";

            alert("Work ajouté", "rgba(0, 0, 0, 1)");
        })
        .catch(error => console.error('Erreur lors de la requête fetch:', error));
}
// Fonction de conversion de l'image sélectionné en blob
function dataURLtoBlob(dataImg) {
    var arr = dataImg.split(','), // Divise la Data URL en deux parties
        mime = arr[0].match(/:(.*?);/)[1], // Extrait le type MIME de la première partie
        bstr = atob(arr[1]), // Décodage base64 pour obtenir une chaîne binaire
        n = bstr.length, // Longueur de la chaîne binaire
        u8arr = new Uint8Array(n); // Crée un tableau d'octets pour stocker les données binaires

    while (n--) { // Convertit la chaîne binaire en tableau d'octets
        u8arr[n] = bstr.charCodeAt(n); // Assignation de chaque caractère à un octet du tableau
    }

    return new Blob([u8arr], { type: mime }); // Crée et retourne un Blob avec les données et le type MIME
}

// Fonctiction d'alerte personalisé
function alert(text, color) {
    conn_alert.style.visibility = "visible";
    conn_alert.style.backgroundColor = color;
    conn_alert.textContent = text;
    // Affichage pendant 2s
    setTimeout(function () {
        conn_alert.style.visibility = "hidden";
        edition.style.visibility = "hidden";
    }, 2000);
}