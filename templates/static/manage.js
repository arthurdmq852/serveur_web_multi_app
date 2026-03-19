const addBtn = document.getElementById('add-btn');
const deleteBtn = document.getElementById('delete-btn');
const deleteSelect = document.getElementById('delete-app-select');

let myApps = JSON.parse(localStorage.getItem('savedApps')) || [
    { name: "WordPress", url: "/wordpress/" },
    { name: "NodeJS", url: "/nodejs/" }
];

function updateDeleteList() {
    deleteSelect.innerHTML = 'index.html'; 
    myApps.forEach(function(app, index) {
        let newOption = document.createElement('option');
        newOption.value = index;
        newOption.textContent = app.name;
        deleteSelect.appendChild(newOption);
    });
}

addBtn.addEventListener('click', function() {
    let appName = document.getElementById('new-app-name').value;
    let appUrl = document.getElementById('new-app-url').value || "#";

    if (appName) {
        myApps.push({ name: appName, url: appUrl });
        localStorage.setItem('savedApps', JSON.stringify(myApps));
        updateDeleteList(); 
        
        document.getElementById('new-app-name').value = ''; 
        document.getElementById('new-app-url').value = '';
        alert(appName + " a été ajoutée !");
    }
});

deleteBtn.addEventListener('click', function() {
    let selectedIndex = deleteSelect.value;
    if (selectedIndex !== "") {
        let removedName = myApps[selectedIndex].name;
        myApps.splice(selectedIndex, 1);
        localStorage.setItem('savedApps', JSON.stringify(myApps));
        updateDeleteList();
        alert(removedName + " a été supprimée !");
    }
});

updateDeleteList();