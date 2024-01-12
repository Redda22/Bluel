form = document.getElementById("form");

form.addEventListener("submit", function(e) {
    // Empêche le comportement par défaut du formulaire
    e.preventDefault();

});

async function conn() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const url = "http://localhost:5678/api/users/login";
    const data = { email: email, password: password }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const responseData = await response.json();
        localStorage.setItem('Token',responseData.token);
        window.location.href = "../ProfilePage/index.html";
        return responseData.token;
        
    }
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }

}
