const buttonGroup = document.querySelector('.button-group');

function chargerApps() {
    let mesApps = JSON.parse(localStorage.getItem('savedApps'));

    if (!mesApps) {
        mesApps = [
            { name: "WordPress", url: "/wordpress/" },
            { name: "NodeJS", url: "/nodejs/" }
        ];
    }

    if (buttonGroup) {
        buttonGroup.innerHTML = ''; 

        mesApps.forEach(function(app) {
            let nouveauBouton = document.createElement('a');
            nouveauBouton.className = "app-button";
            nouveauBouton.href = app.url;
            nouveauBouton.textContent = app.name;
            buttonGroup.appendChild(nouveauBouton);
        });
    }
}

chargerApps();