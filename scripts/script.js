let cocktailList = new Array();
let nameList = new Array();
let ingredientList = new Array();

let ingredient_choice = document.getElementById("ingredient_choice");
let cocktail_choice = document.getElementById("cocktail_choice");
let searchbar = document.getElementById("searchbar");
let submit = document.getElementById("send");
let cocktail_section = document.getElementById("cocktail-section");




searchbar.addEventListener("change", function(event) {
    event.preventDefault()
    console.log("changed")
});

submit.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("clicked")
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
    cocktail_section.innerHTML ="";
    
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
        '<button class="btn btn-primary" id="btnInfo">Info</button>';

        cocktail_section.appendChild(cocktail);
    }
}