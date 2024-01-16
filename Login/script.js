form = document.getElementById("form");
const conn_alert = document.getElementById("alert");

form.addEventListener("submit", function (e) {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();

});

// fonction asynchrone nécessaire pour l'appélation await
async function conn() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const url = "http://localhost:5678/api/users/login";
    const data = { email: email, password: password };

    try {
        // attente d'une réponse provenant de l'url
        const response = await fetch(url, {
            method: 'POST', // spécification de la méthode http à utiliser
            headers: {
                'Content-Type': 'application/json', // Définition du type de contenu envoyé comme json
                'Accept': 'application/json' // Indication que le type de contenu attendu en réponse est json
            },
            body: JSON.stringify(data) // Conversion des données à envoyer en une chaîne json
        });

        // Si la communication est impossible : 
        if (!response.ok) {

            // Caractéristiques du message d'erreur
            conn_alert.style.visibility = "visible";
            conn_alert.style.backgroundColor = "rgba(200, 0, 0, 1)";
            conn_alert.textContent = "Erreur : Informations incorrecte";
            // Disparition du message après 3 secondes
            setTimeout(function () {
                conn_alert.style.visibility = "hidden";
            }, 3000);

            // Renvoie de l'erreur
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Si la communication à été établie :
        const responseData = await response.json(); // récupération des données de retour
        const token = responseData.token; // récupération du token venant des données de retour
        localStorage.setItem('Token', token); // stockage du token en localstorage
        window.location.href = "../ProfilePage/index.html"; // changement de page
        //return responseData.token;

    }
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }

}
