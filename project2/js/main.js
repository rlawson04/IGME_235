"use strict"

// declare storage constants
const prefix = "rbl2991-poke-";
const typeKey = prefix + "type";
const genKey = prefix + "generation";

// grab the stored data
const storedType = localStorage.getItem(typeKey);
const storedGen = localStorage.getItem(genKey);

// Search button onclick handler
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked

  // If stored data exists, change the dropdowns to match
  if (storedType){
	  document.querySelector(`option[value='${storedType}']`).selected = true;
  }
  if (storedGen){
	  document.querySelector(`option[value='${storedGen}']`).selected = true;
  }
  
  // when the user changes their favorites, update localStorage
  document.querySelector("#type").onchange = e => {localStorage.setItem(typeKey, e.target.value); };
  document.querySelector("#generation").onchange = e => {localStorage.setItem(genKey, e.target.value);};
};
	
// Global variables
let pokeStrings = [];
let pokeObjs = [];
   
// On search button event
function searchButtonClicked(){
 const pokeType = document.querySelector("#type").value;

  // Grabs the whole pokemon API type list
  let Poke_URL = "https://pokeapi.co/api/v2/type/";

  // If "Any" is selected grab the entire pokemon list
  if (pokeType == "default")
  {
    Poke_URL = "https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0"
  }
  else
  {
    Poke_URL += pokeType;
    Poke_URL += "?limit=100000&offset=0";
  }

  // Calls the get data function
  getData(Poke_URL);
}

function getData(url){
 // Creates a new XHR object
 let xhr = new XMLHttpRequest();

 // Set the onload handler
 xhr.onload = dataLoaded;

 // Set the onerror handler
 xhr.onerror = dataError;

 // Open connection and send the request
 xhr.open("GET",url);
 xhr.send();
}
    
function dataLoaded(e){
  // Clear previous calls
  if(pokeObjs.length > 1){
    pokeObjs = [];
  }

  let resultsTestSelector = document.querySelector("#results");

  // Event.target is the xhr object
  let xhr = e.target;

  // Turn the text into a parsable JavaScript object
  let obj = JSON.parse(xhr.responseText);

  let results = [];

  // Grab pokemon list
  if(obj.pokemon)
  {
    results = obj.pokemon;
  }
  else
  {
    results = obj.results;
  }

  // loop through the array of results 
  for(let i=0; i<results.length; i++){
    
    // Each pokemon Object
    let result = "";
    if(results[i].pokemon)
    {
      result = results[i].pokemon
    }
    else
    {
      result = results[i];
    }

    // Takes the pokemon object and creates the individual responses for it
    pokeData(result);
  }  
} 

function dataError(e){
  // print error message
  console.log("An error occured :(");
}

function pokeData(obj){
  let pokemonInfo = obj.url;
  pokeGetData(pokemonInfo);
}

function pokeGetData(url){
  let xhr2 = new XMLHttpRequest();
  xhr2.onload = pokeDataLoad;
  xhr2.onerror = dataError;
  xhr2.open("GET",url);
  xhr2.send();
    
}

function pokeDataLoad(e){
    
  let xhr2 = e.target;
  let obj = JSON.parse(xhr2.responseText);
    
  // Take information from object
  let types = obj.types;
  let gen =  obj.game_indices;
  const pokeGen = document.querySelector("#generation").value;
  let sprites = obj.sprites;

  //Some pokemon are missing game index data
  if (gen.length > 1)
  {
    // Uses the generation tag to filter the results
    if (gen[0].version.name == pokeGen)
    {
      pokeStrings.push("<div class='result'><span>Name: " + obj.name + "<br>Weight: " + obj.weight + "<br>Height: " + obj.height + "<img src='" + obj.sprites.front_default + "' alt='sprite'><img src='" + obj.sprites.front_shiny + "' alt='shiny sprite'></span></div>");  
      pokeObjs.push(obj);
    }
  }

  document.querySelector('#content').innerHTML = `${pokeObjs.length} Results`

  // Prints out list 
  pokePrint();
}

function sortAZ(e){  
  document.querySelector("#results").innerHTML = "";  
  pokeStrings.length = 0;

  // Sorts the list alphabetically by name
  pokeObjs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  for(let i = 0; i< pokeObjs.length; i++)
  {
    let obj = pokeObjs[i];
    pokeStrings.push("<div class='result'><span>Name: " + obj.name + "<br>Weight: " + obj.weight + "<br>Height: " + obj.height + "<img src='" + obj.sprites.front_default + "' alt='sprite'><img src='" + obj.sprites.front_shiny + "' alt='shiny sprite'></span></div>");  
  }

  pokeStrings.forEach(element => {
    document.querySelector("#results").innerHTML += element
  });
}

function pokePrint(e){
  document.querySelector("#results").innerHTML = "";  
  pokeStrings.length = 0;

  // Prints out the list in the order they were passed in
  for(let i = 0; i< pokeObjs.length; i++)
  {
    let obj = pokeObjs[i];
    pokeStrings.push("<div class='result'><span>Name: " + obj.name + "<br>Weight: " + obj.weight + "<br>Height: " + obj.height + "<img src='" + obj.sprites.front_default + "' alt='sprite'><img src='" + obj.sprites.front_shiny + "' alt='shiny sprite'></span></div>");  
  }

  pokeStrings.forEach(element => {
    document.querySelector("#results").innerHTML += element
  });    
}

function sortType(e){  
  document.querySelector("#results").innerHTML = "";  
  pokeStrings.length = 0;

  // Sorts list by their type alphabetically (bug, dark, dragon...)
  pokeObjs.sort((a,b) => (a.types[0].type.name > b.types[0].type.name) ? 1 : ((b.types[0].type.name > a.types[0].type.name) ? -1 : 0));
  for(let i = 0; i< pokeObjs.length; i++)
  {
    let obj = pokeObjs[i];
    pokeStrings.push("<div class='result'><span>Name: " + obj.name + "<br>Weight: " + obj.weight + "<br>Height: " + obj.height + "<img src='" + obj.sprites.front_default + "' alt='sprite'><img src='" + obj.sprites.front_shiny + "' alt='shiny sprite'></span></div>");  
  }

  pokeStrings.forEach(element => {
    document.querySelector("#results").innerHTML += element
  });
}