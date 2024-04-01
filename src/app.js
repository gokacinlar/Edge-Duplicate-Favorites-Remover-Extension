let bookmarksUrls = {};
let duplicateCount = 0;
let removeButtons = []; // global array to store all the remove buttons

document.getElementById("submit").addEventListener("click", () => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log(bookmarkTreeNodes);
        let bookmarksDiv = document.getElementById("bookmarks");
        bookmarksDiv.innerHTML = "";
        bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));
    });
});

document.getElementById("submit").addEventListener("click", () => {
    let infoText = document.getElementById("infoText");
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log(bookmarkTreeNodes);
        let bookmarksDiv = document.getElementById("bookmarks");
        bookmarksDiv.innerHTML = "";
        bookmarksUrls = {};
        duplicateCount = 0;
        bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));
        if (duplicateCount === 1) {
            infoText.innerText = duplicateCount + " duplicate have been found!";
        }
        if (duplicateCount === 0) {
            infoText.innerText = "No duplicates have been found!";
        } else {
            infoText.innerText = duplicateCount + " duplicates have been found.";
            bookmarksDiv.style.display = "block";
        }
    });
});

function displayBookmarks(bookmarkNodes) {
    let list = document.createElement("ul");
    list.className = "list-group";
    for (let i = 0; i < bookmarkNodes.length; i++) {
        let listItem = displayBookmark(bookmarkNodes[i]);
        if (listItem) {
            list.appendChild(listItem);
        }
        if (bookmarkNodes[i].children) {
            list.appendChild(displayBookmarks(bookmarkNodes[i].children));
        }
    }
    return list;
}


function displayBookmark(bookmarkNode) {
    if (bookmarkNode.url && bookmarksUrls[bookmarkNode.url]) {
        duplicateCount++;

        let listItem = document.createElement("li");
        listItem.className = "w-100 list-group-item d-flex flex-row gap-3 mb-3 justify-content-between align-items-center rounded bg-primary text-white border-0";
        listItem.innerText = bookmarkNode.title ? bookmarkNode.title : "No Title";

        let removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger text-white btn-sm ml-auto";
        removeButton.innerText = "Remove duplicate";
        removeButton.addEventListener("click", () => {
            removeButtons.forEach(button => button.disabled = true);

            let popUpWarning = document.createElement("div");
            popUpWarning.className = "w-100 p-3 d-flex flex-row gap-3 justify-content-between align-items-center bg-primary border-0";
            popUpWarning.innerText = "This action cannot be undone. Do you wish to continue?"
            let popUpBtn = document.createElement("button");
            popUpBtn.className = "btn btn-warning btn-lg p-1 w-25"
            popUpBtn.innerText = "Yes"
            document.body.appendChild(popUpWarning);

            popUpBtn.addEventListener("click", function () {
                chrome.bookmarks.remove(bookmarkNode.id);
                duplicateCount--;
                listItem.remove();
                popUpWarning.remove();

                removeButtons.forEach(button => button.disabled = false);

                if (duplicateCount === 0) {
                    infoText.innerText = "You have successfully deleted all the duplicate bookmarks!";
                    // remove unnecessary dom bookmarks div
                    let bookmarksDiv = document.getElementById("bookmarks");
                    bookmarksDiv.remove();
                    // remove leftover nested ul list-groups
                    let duplicateUlElements = document.querySelectorAll("ul.list-group");
                    duplicateUlElements.forEach((ul) => {
                        ul.remove();
                    });
                    // styling to reset height & width after deletion of favorites
                    document.body.setAttribute("style", "height: fit-content !important; width: 512px;");
                    document.documentElement.setAttribute("style", "height: fit-content !important;")
                }
            });

            document.body.appendChild(popUpWarning);
            popUpWarning.appendChild(popUpBtn);
        });
        listItem.appendChild(removeButton);

        // Add the remove button to the remove buttons array
        removeButtons.push(removeButton);

        return listItem;
    } else {
        bookmarksUrls[bookmarkNode.url] = true;

        return null;
    }
}