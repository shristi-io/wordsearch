console.log("Welcome to Words API");

let searchBtn = document.getElementById("searchButton");
let searchWord = document.getElementById("searchWord");

// Trigger search on button click
searchBtn.addEventListener("click", defFetcher);

// Trigger search on "Enter" key press
searchWord.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        defFetcher();
    }
});

function defFetcher() {
    let searchTerm = searchWord.value.toLowerCase().trim();

    // Prevent searching if the input is empty
    if (!searchTerm) {
        alert("Please enter a word");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`, true);

    xhr.onload = function () {
        if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            let html = `<h5 id="wordTitle" class="card-title">"${searchTerm}"</h5>`;
            
            obj.forEach(function(element) {
                if (element["word"] === searchTerm) {
                    for (let i = 0; i < element["meanings"].length; i++) {
                        html += `
                            <li>${element["meanings"][i]["definitions"][0]["definition"]}</li>
                        `;
                    }
                }
            });

            // 1. Update the list definitions
            let defList = document.getElementById("definitionsList");
            defList.innerHTML = html;
            searchWord.value = "";

            // 2. Swap the UI elements (Safely OUTSIDE the forEach loop)
            let cardBody = document.getElementById("card-body");
            cardBody.removeChild(searchBtn);
            cardBody.removeChild(searchWord);

            let closeButton = document.createElement('button');
            closeButton.id = "closeBtn";
            closeButton.className = "btn btn-primary";
            closeButton.innerText = `Search another word`;
            cardBody.appendChild(closeButton);

            // 3. Handle resetting the UI for a new search
            closeButton.addEventListener("click", function () {
                cardBody.removeChild(closeButton);
                defList.innerHTML = "";
                // Re-insert the input and button in the correct order
                cardBody.insertBefore(searchWord, defList);
                cardBody.insertBefore(searchBtn, defList);
                
                // Optional: Automatically focus the input for the user
                searchWord.focus(); 
            });
            
        } else {
            alert("Word not found");
        }
    }

    xhr.send();
}
