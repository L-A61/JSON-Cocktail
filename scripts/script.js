// Déclaration d'un tableau comme valeur pour la variable cocktailList
let cocktailList = new Array();

// Selecteur des éléments HTML
let ingredient_choice = document.getElementById("ingredient_choice");
let cocktail_choice = document.getElementById("cocktail_choice");
let searchbar = document.getElementById("searchbar");
let submit = document.getElementById("send");
let cocktail_section = document.getElementById("cocktail_section");
let cocktail_info = document.getElementById("cocktail_info");
let randomBtn = document.getElementById("randomBtn");
let randomChoice = document.getElementById("randomChoice");

// Permet d'éviter l'actualisation par défaut à la saisie des éléments input et button de la balise form.
searchbar.addEventListener("change", function (event) {
    event.preventDefault();
});
submit.addEventListener("click", function (event) {
    event.preventDefault();
})

// Début du lien vers les API utilisés, ce lien est utilisé comme base
const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

// Au click du bouton Search, on appel un fetch des deux API selon si on cherche un cocktail selon son nom ou un ingrédient utilisé. Puis appel de la fonction createCocktails
submit.addEventListener("click", () => {
    const query = searchbar.value.trim();
    const searchType = cocktail_choice.checked ? 'name' : 'ingredient';

    if (!query) return alert("Veuillez entrer un terme de recherche.");

    const endpoint =
        searchType === 'name'
            ? `${API_BASE}search.php?s=${query}`
            : `${API_BASE}filter.php?i=${query}`;

    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => createCocktails(data.drinks))
        .catch(console.error);
})

// Fonction qui insère les cocktails trouvés dans l'API à l'intérieur de la liste cocktailList. 
// Si aucun cocktail n'est trouvé, l'innerHTML de cocktail_section affiche "No data found". Sinon, on appel la fonction showCocktails
function createCocktails(_cocktails) {
    cocktailList = _cocktails;
    
    if (Array.isArray(cocktailList)==false) {
        cocktail_section.innerHTML = "<p>No data found</p>";
    } else {
        showCocktails(cocktailList);
    }
}

// Affiche dans une card bootstrap chaque nom de cocktail et leur image présent dans la liste cocktailList ainsi qu'un bouton pour leur modal
function showCocktails(_cocktails) {
    cocktail_section.innerHTML = "";

    for (let i = 0; i < _cocktails.length; i++) {
        let cocktail = document.createElement("article");
        cocktail.setAttribute("class", "card");

        cocktail.innerHTML =
            '<img src="' +
            _cocktails[i].strDrinkThumb +
            '">' +

            '<h3>' +
            _cocktails[i].strDrink +
            '</h3>' +
            '<button class="btn btn-danger btnInfo" data-bs-toggle="modal" data-bs-target="#exampleModal" id="btnInfo">Info</button>';

        cocktail_section.appendChild(cocktail);
    }

    let btnInfo = document.getElementsByClassName("btnInfo");
    // Chaque bouton recupère l'id de leur cocktail respective en appelant la fonction callCocktailInfo
    for (let i = 0; i < btnInfo.length; i++) {
        btnInfo[i].addEventListener('click', function () {
            callCocktailInfo(_cocktails[i].idDrink);
        })
    }

    // Cette fonction fait un fetch de l'API servant à récupérer un cocktail selon son ID. Puis appel la fonction showCocktailsInfo
    function callCocktailInfo(_id) {
        const endpoint =
            `${API_BASE}lookup.php?i=${_id}`;

        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => showCocktailsInfo(data.drinks[0]))
            .catch(console.error);
    }

    // Fonction pour afficher dans une modal le nom du cocktail, son image, sa catégorie, son type de verre, si c'est alcoholique ainsi que ses ingrédients, mesures et ses instructions
    function showCocktailsInfo(_data) {
        let modal_title = document.getElementsByClassName("modal-title")[0];
        let modal_body = document.getElementsByClassName("modal-body")[0];
        modal_title.innerHTML = "";
        modal_body.innerHTML = "";
        let title_content = document.createElement("h1");
        title_content.innerHTML = _data.strDrink;

        let body_content = document.createElement("p")
        body_content.innerHTML =
            '<img src="' + _data.strDrinkThumb + '">' +
            "<p>Category: " + _data.strCategory + "</p>" +
            "<p>Glass: " + _data.strGlass + "</p>" +
            "<p>" + _data.strAlcoholic + "</p>";

        Object.keys(_data)
            .filter((key) => key.startsWith('strIngredient') && _data[key]) //je filtre les clés et ne récupère que celle qui commencent par strIngredient
            .forEach((key, index) => { // puis je boucle dessus
                const ingredient = _data[key];
                const measureKey = `strMeasure${index + 1}`;
                const measure = _data[measureKey] || "Not specified quantity";
                body_content.innerHTML += `<li>${ingredient} - ${measure}</li>`;
            });

        body_content.innerHTML += "<p>Instructions: " + _data.strInstructions + "</p>";

        modal_title.appendChild(title_content);
        modal_body.appendChild(body_content);
    }
}

// Appel d'un fetch de l'API "https://www.thecocktaildb.com/api/json/v1/1/random.php" qui fait appel à la fonction showRandomInfo
randomBtn.addEventListener("click", function () {
    const endpoint = `${API_BASE}random.php`;

    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => showRandomInfo(data.drinks[0]))
        .catch(console.error);
});

// Fonction pour afficher en dessous du bouton Shake me a cocktail le nom du cocktail aléatoire et sur une modal les détails du cocktails
function showRandomInfo(_data) {
    randomChoice.innerHTML = _data.strDrink;
    let modal_title = document.getElementsByClassName("modal-title")[0];
    let modal_body = document.getElementsByClassName("modal-body")[0];
    modal_title.innerHTML = "";
    modal_body.innerHTML = "";
    let title_content = document.createElement("h1");
    title_content.innerHTML = _data.strDrink;

    let body_content = document.createElement("p");
    body_content.innerHTML =
        '<img src="' + _data.strDrinkThumb + '">' +
        "<p>Category: " + _data.strCategory + "</p>" +
        "<p>Glass: " + _data.strGlass + "</p>" +
        "<p>" + _data.strAlcoholic + "</p>";

    Object.keys(_data)
        .filter((key) => key.startsWith('strIngredient') && _data[key]) //je filtre les clés et ne récupère que celle qui commencent par strIngredient
        .forEach((key, index) => { // puis je boucle dessus
            const ingredient = _data[key];
            const measureKey = `strMeasure${index + 1}`;
            const measure = _data[measureKey] || "Not specified quantity";
            body_content.innerHTML += `<li>${ingredient} - ${measure}</li>`;
        });


    // "<p>Ingredients: <li>"+_data.strIngredient1 +" : "+ _data.strMeasure1+"</li></p>"+
    body_content.innerHTML += "<p>Instructions: " + _data.strInstructions + "</p>";

    modal_title.appendChild(title_content);
    modal_body.appendChild(body_content);
}