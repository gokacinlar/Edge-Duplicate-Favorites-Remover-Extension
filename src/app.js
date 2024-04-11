let bookmarksUrls = {};
let duplicateCount = 0;
let removeButtons = []; // global array to store all the remove buttons
let submitBtn = document.getElementById("submit");
let infoText = document.getElementById("infoText");
let bookmarksDiv = document.getElementById("bookmarks");

submitBtn.addEventListener("click", async () => {
    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    console.log(bookmarkTreeNodes);
    bookmarksDiv.innerHTML = "";
    bookmarksUrls = {};
    duplicateCount = 0;
    bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));

    if (duplicateCount === 1) {
        infoText.innerText = duplicateCount + " duplicate has been found!";
        bookmarksDiv.style.display = "block";
    } else if (duplicateCount === 0) {
        infoText.innerText = "No duplicates have been found!";
    } else {
        infoText.innerText = duplicateCount + " duplicates have been found.";
        bookmarksDiv.style.display = "block";
    }
});

function displayBookmarks(bookmarkNodes) {
    let list = document.createElement("ul");
    list.className = "list-group w-100 d-flex flex-column gap-3 h-auto justify-content-between";
    for (let item of bookmarkNodes) {
        // validate favorites data before passing to displayBookmark
        if (isValidBookmark(item)) {
            let listItem = displayBookmark(item);
            if (listItem) {
                list.appendChild(listItem);
            }
        } else {
            console.error("Invalid bookmark data found: ", item);
        }
        if (item.children) {
            let childList = displayBookmarks(item.children);
            if (childList.hasChildNodes()) {
                list.appendChild(childList);
            }
        }
    }
    return list;
}

// helper function to validate bookmark data
function isValidBookmark(bookmark) {
    return bookmark && bookmark.url && bookmark.title;
}

function displayBookmark(bookmarkNode) {
    // add list item to contain all the duplicate elements
    let listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex flex-fill flex-row flex-grow-1 gap-3 justify-content-between align-items-center rounded bg-primary text-white border-0";
    listItem.innerText = bookmarkNode.title ? bookmarkNode.title : "No Title";
    if (bookmarkNode.url && bookmarksUrls[bookmarkNode.url]) {
        duplicateCount++;

        // add remove button
        let removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger text-white btn-sm ml-auto";
        removeButton.innerText = "Remove duplicate";

        // function to remove duplicate favorites
        removeButton.addEventListener("click", () => {
            removeButtons.forEach(button => button.disabled = true);

            let popUpWarning = document.createElement("div");
            popUpWarning.className = "w-100 p-3 d-flex flex-row gap-3 justify-content-between align-items-center bg-primary border-0";
            popUpWarning.innerText = "This action cannot be undone. Do you wish to continue?";

            let popUpBtn = document.createElement("button");
            popUpBtn.className = "btn btn-warning btn-lg p-1 w-25";
            popUpBtn.innerText = "Yes";
            popUpBtn.setAttribute("title", "Remove Favorites");

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
                    document.documentElement.setAttribute("style", "height: fit-content !important;");

                    // remove disabled in submit btn

                    submitBtn.disabled = false;
                }
            });

            document.body.appendChild(popUpWarning);
            popUpWarning.appendChild(popUpBtn);
        });

        listItem.appendChild(removeButton);

        // Add the remove button to the remove buttons array
        removeButtons.push(removeButton);
    } else {
        bookmarksUrls[bookmarkNode.url] = true;
        return null;
    }
    return listItem;
}