let cocktailList = new Array();
let nameList = new Array();
let ingredientList = new Array();

let ingredient_choice = document.getElementById("ingredient_choice");
let cocktail_choice = document.getElementById("cocktail_choice");
let searchbar = document.getElementById("searchbar");
let submit = document.getElementById("send");
let cocktail_section = document.getElementById("cocktail_section");
let cocktail_info = document.getElementById("cocktail_info")

searchbar.addEventListener("change", function(event) {
    event.preventDefault()
});

submit.addEventListener("click", function(event) {
    event.preventDefault();
})

const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

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

function createCocktails(_cocktails) {
    cocktailList = _cocktails;
    showCocktails(cocktailList);
}

function showCocktails(_cocktails) {
    cocktail_section.innerHTML = "";
    
    for (let i = 0; i < _cocktails.length; i++) {
        let cocktail = document.createElement("article")
        cocktail.setAttribute("class","card");

        cocktail.innerHTML =
        '<img src="' +
        _cocktails[i].strDrinkThumb +
        '">' +

        '<h3>' +
        _cocktails[i].strDrink +
        '</h3>'+
        '<button class="btn btn-primary btnInfo" data-bs-toggle="modal" data-bs-target="#exampleModal" id="btnInfo">Info</button>';

        cocktail_section.appendChild(cocktail);
    }

    let btnInfo = document.getElementsByClassName("btnInfo")

    for (let i = 0; i < btnInfo.length; i++) {
        btnInfo[i].addEventListener('click', function () {
            callCocktailInfo(_cocktails[i].idDrink)
        })
    }
    
    function callCocktailInfo(_id) {
        const endpoint =
        `${API_BASE}lookup.php?i=${_id}`
    
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => showCocktailsInfo(data.drinks[0]))
        .catch(console.error);
    }
    
    function showCocktailsInfo(_data) {
        let modal_title = document.getElementsByClassName("modal-title")[0];
        let modal_body = document.getElementsByClassName("modal-body")[0];
        modal_title.innerHTML = "";
        modal_body.innerHTML = "";
        let title_content = document.createElement("h1");
        title_content.innerHTML = _data.strDrink;

        let ingredient;
        let measure;
        
        let body_content = document.createElement("p")
        body_content.innerHTML =
        '<img src="' + _data.strDrinkThumb + '">' + 
        "<p>Category: "+_data.strCategory+"</p>"+
        "<p>Glass: "+_data.strGlass+"</p>"+
        "<p>"+_data.strAlcoholic+"</p>";

        Object.keys(_data)
        .filter((key) => key.startsWith('strIngredient') && _data[key]) //je filtre les clés et ne récupère que celle qui commencent par strIngredient
        .forEach((key, index) => { // puis je boucle dessus
            const ingredient = _data[key]; 
            const measureKey = `strMeasure${index + 1}`;
            const measure = _data[measureKey] || "Not specified quantity";
            body_content.innerHTML += `<li>${ingredient} - ${measure}</li>`;
        });


        // "<p>Ingredients: <li>"+_data.strIngredient1 +" : "+ _data.strMeasure1+"</li></p>"+
         body_content.innerHTML +="<p>Instructions: "+_data.strInstructions+"</p>";

        modal_title.appendChild(title_content);
        modal_body.appendChild(body_content);
    }
}