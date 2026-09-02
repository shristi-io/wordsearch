console.log("Welcome to Words API");

let searchBtn = document.getElementById("searchButton");
let searchWordInput = document.getElementById("searchWord"); // Grab the input field

// 1. Existing click listener
searchBtn.addEventListener("click", defFetcher);

// 2. New Enter key listener
searchWordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        defFetcher();
    }
});

function defFetcher() {
    let searchWord = document.getElementById("searchWord");
    let searchTerm = searchWord.value.toLowerCase().trim();

    if (!searchTerm) {
        alert("Please enter a word");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`, true);

    xhr.onload = function () {
        if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            
            // Build the HTML string completely before updating the DOM
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

            // 1. Update the definitions list
            let defList = document.getElementById("definitionsList");
            defList.innerHTML = html;
            
            // 2. Clear the input value
            searchWord.value = "";

            // 3. Swap the UI elements (Moved OUTSIDE the forEach loop)
            let cardBody = document.getElementById("card-body");
            cardBody.removeChild(searchBtn);
            cardBody.removeChild(searchWord);

            let closeButton = document.createElement('button');
            closeButton.id = "closeBtn";
            closeButton.className = "btn btn-primary";
            closeButton.innerText = `Search another word`;
            cardBody.appendChild(closeButton);

            // 4. Handle resetting the UI
            closeButton.addEventListener("click", function () {
                cardBody.removeChild(closeButton);
                defList.innerHTML = "";
                // Re-insert the input and button in the correct order
                cardBody.insertBefore(searchWord, defList);
                cardBody.insertBefore(searchBtn, defList);
            });
            
        } else {
            alert("Word not found");
        }
    }

    xhr.send();
}
