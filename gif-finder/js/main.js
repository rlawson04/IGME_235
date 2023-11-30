   // 1
   window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
   // 2
   let displayTerm = "";
   
   // 3
   function searchButtonClicked(){
       console.log("searchButtonClicked() called");
       
     // 1
     const Giphy_URL = "https://api.giphy.com/v1/gifs/search?";

     // 2
     let Giphy_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

     // 3
     let url = Giphy_URL;
     url += "api_key=" + Giphy_KEY;

     // 4
     let term = document.querySelector("#searchterm").value;
     displayTerm = term;

     // 5
     term = term.trim();

     // 6
     term = encodeURIComponent(term);

     // 7
     if(term.length < 1) return;

     // 8
     url += "&q=" + term;

     // 9
     let limit = document.querySelector("#limit").value;
     url += "&limit=" + limit;

     // 10
     document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

     // 11
     console.log(url);

     // 12 Request data!
     getData(url);
   }

   function getData(url){
     // 1 - create a new XHR object
     let xhr = new XMLHttpRequest();

     // 2 - set the onload handler
     xhr.onload = dataLoaded;

     // 3 - set the onerror handler
     xhr.onerror = dataError;

     // 4 - open connection and send the request
     xhr.open("GET",url);
     xhr.send();
   }

   function dataLoaded(e){
     // 5 - event.target is the xhr object
     let xhr = e.target;

     // 6 - xhr.response text is the JSON file we just downloaded
     console.log(xhr.responseText);

     // 7 - turn the text into a parsable JavaScript object
     let obj = JSON.parse(xhr.responseText);

     // 8 - if there are no results, print a message and return
     if(!obj.data || obj.data.length == 0){
       document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
       return; // bail out
     }

     // 9 - Start building an HTML string we will display to the user 
     let results = obj.data;
     console.log("results.length = " + results.length);
     let bigString = "";

     // 10 - loop through the array of results 
     for(let i=0; i<results.length; i++){
       let result = results[i];

       // 11 - get the URL to the GIF
       let smallURL = result.images.fixed_width_downsampled.url;
       if (!smallURL) smallURL = "images/no-image-found.png"

       // 12 - get the URL to the GIPHY page
       let url = result.url;

       // 12.5 - get rating
       let rating = (result.rating ? result.rating : "NA").toUpperCase();

       // 13 - Build a <div> to hold each result
       // ES6 String templating
       let line = `<div class='result'><img src ='${smallURL}' title= '${result.id}' />`;
       line += `<span><a target='_blank' href='${url}'>View on GIPHY </a><p>Rating: ${rating}</p></span></div>`;

       // 15 - add the <div> to `bigString` and loop
       bigString += line;
     }
     
     // 16 - all done building the HTML - show it to the user!
     document.querySelector("#content").innerHTML = bigString;

     // 17 - update the status
     document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
   }


   function dataError(e){
     // print error message
     console.log("An error occured :(");
   }