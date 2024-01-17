
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

        filter.style.display = "none"
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

            filter.style.display = "flex"
            btnState.fill(false);

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


    let btnState = []; // tableau destiné à contenir tout les états de chaque bouttons du filtre

    // Affichage des travaux
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
                        btn_all.style.backgroundColor = "white";
                        btn_all.style.color = "#1D6154";

                        btn.style.backgroundColor = "#1D6154";
                        btn.style.color = "white";
                        works();
                    }
                });
            });

            let btn_all = document.getElementById("btn_all");

            btn_all.style.backgroundColor = "#1D6154";
            btn_all.style.color = "white";

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
    Cards_System();


    let modifier_interface = document.querySelector(".modifier_interface"); // interface de modification de la gallerie
    let gallery_interface = document.querySelector(".gallery_interface");
    let add_work = document.querySelector(".add_work");

    let arrow_back = document.querySelector(".arrow_back");

    let gallery_close = document.querySelector(".gallery_close"); // boutton de fermeture de la gallerie d'édition
    let add_work_close = document.querySelector(".add_work_close");

    let button_add = document.querySelector(".button_add"); // boutton d'ajout de travaux

    let list_works = document.querySelector(".list_works"); // div contenant la liste des travaux éditable dans l'interface de modification
    let snaps = []; // les <figure> contenant chaque img de travaux
    let trash = []; // logo poubelle dans chaque snaps


    modifier_button.addEventListener("click", function () {
        modifier_interface.style.display = "flex";
        gallery_interface.style.display = "flex";
        add_work.style.display = "none";
        modifier();
    });
    gallery_close.addEventListener("click", function () {
        modifier_interface.style.display = "none";
    });
    add_work_close.addEventListener("click", function () {
        modifier_interface.style.display = "none";
    });



    button_add.addEventListener("click", function () {
        gallery_interface.style.display = "none";
        imgPreview.style.display = "none";
        add_work.style.display = "flex";
        choose_photo.style.display = "flex";
        add_select();

    })
    arrow_back.addEventListener("click", function () {
        gallery_interface.style.display = "flex";
        add_work.style.display = "none";
        choose_photo.style.display = "flex";
        imgPreview.style.display = "none";
        
    })

    modifier_interface.addEventListener("click", function (event) {
        if (event.target === this) {
            modifier_interface.style.display = "none";
            imgPreview.style.display = "none";
            add_work.style.display = "none";
            gallery_interface.style.display = "none";
        }
    })

    // affichage des travaux à modifier avec posibilité des les supprimer
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
                trash[dataGroup.id].classList.add('fa-solid', 'fa-trash-can', 'trash');
                snaps[dataGroup.id].appendChild(trash[dataGroup.id]);

                list_works.appendChild(snaps[dataGroup.id]);

                let url = 'http://localhost:5678/api/works/' + dataGroup.id;

                trash[dataGroup.id].addEventListener("click", function () {
                    deleteData(url);
                })


            });
        }
        catch (error) {
            console.log("Une erreur est survenue: ", error);
        }
    }
    // suppression de travaux
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
        } catch (error) {
            console.error("Erreur lors de la suppression des données :", error);
        }

        // mise à jour des galleries
        modifier();
        works();
    }

    let urlImg = "";

    let add_button = document.querySelector(".add_photo #add_button");
    let add_img_input = document.querySelector(".add_photo input");

    let choose_photo = document.querySelector(".choose_photo");

    add_button.addEventListener("click", function () {
        add_img_input.click();
    });

    let imgPreview = document.getElementById('imagePreview');

    add_img_input.addEventListener("change", function (event) {
        var file = event.target.files[0];
        if (file && file.size <= 4 * 1024 * 1024) {
            var reader = new FileReader(); // Crée un FileReader
            reader.onload = function (e) {
                imgPreview.src = "";
                imgPreview.src = e.target.result; // Résultat de FileReader
                urlImg = e.target.result;

                choose_photo.style.display = "none";
                imgPreview.style.display = "block";

                // Si il y'a une image lié et un titre associé sur la page d'ajout, alors mettre le boutton d'ajout en vert
                if (/\S/.test(titre_select.value) && urlImg != "") {
                    add_validate.style.backgroundColor = "#1D6154";
                    add_validate.style.cursor = "pointer";
                }
                else{
                    add_validate.style.backgroundColor = "#A7A7A7";
                    add_validate.style.cursor = "not-allowed";
                }
                
            };
            reader.readAsDataURL(file);

            // réinitialiser file après le chargement
            this.value = "";
        }
        else{
            alert("Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 4 Mo.");
            return;
        }
    })

    let list_select = document.getElementById("categorie");
    let titre_select = document.getElementById("titre");


    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    

    document.addEventListener('keyup', function() {
        // Si il y'a une image lié et un titre associé sur la page d'ajout, alors mettre le boutton d'ajout en vert
        if (/\S/.test(titre_select.value) && urlImg != "") {
            add_validate.style.backgroundColor = "#1D6154";
            add_validate.style.cursor = "pointer";
        }
        else{
            add_validate.style.backgroundColor = "#A7A7A7";
            add_validate.style.cursor = "not-allowed";
        }
    });

    let add_validate = document.querySelector(".add_validate");
    add_validate.addEventListener("click", function () {

        if (urlImg && titre_select.value != "") {

            var imgBlob = dataURLtoBlob(urlImg);
            let formData = new FormData();
            //formData.append('id', 50);
            formData.append('image', imgBlob); // Assurez-vous que c'est un objet File ou Blob
            formData.append('title', titre_select.value);
            formData.append('category', list_select.selectedIndex + 1);
            //formData.append('userId', 1);

            fetch('http://localhost:5678/api/works', {
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
                    works();
                    modifier();
                    add_work.style.display = "none";
                    modifier_interface.style.display = "none";
                    console.log(response.json());
                })
                //.then(data => console.log('Réponse de l\'API :', data))
                .catch(error => console.error('Erreur lors de la requête fetch:', error));
        }
        else {
            console.log("information manquante");
        }


    })


    let options = [];
    async function add_select() {
        try {
            const categories = await fetch("http://localhost:5678/api/categories");
            let categoriesData = await categories.json();
            categoriesData.forEach(dataGroup => {
                options[dataGroup.id] = document.createElement("option");
                options[dataGroup.id].textContent = dataGroup.name;
                document.getElementById("categorie").appendChild(options[dataGroup.id]);
            });

        }
        catch (error) {
            console.log("Une erreur est survenue: ", error);
        }
    }


}

main();