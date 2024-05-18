let submitBtn = document.getElementById("submit");
let infoText = document.getElementById("infoText");
let bookmarksDiv = document.getElementById("bookmarks");

// remove hardcoding stuff

const stylingProperties = {
    mainDiv: "list-group-item d-flex flex-fill flex-row flex-grow-1 gap-3 justify-content-between align-items-center rounded bg-primary text-white border-0",
    basicDiv: "w-auto p-3 m-2 d-flex flex-row gap-3 justify-content-between align-items-center bg-primary border-0 rounded",
    wrapperDiv: "list-group w-100 d-flex flex-column gap-3 h-auto justify-content-between",
}

const buttonProperties = {
    yesBtn: "btn btn-outline-warning text-white btn-lg ml-auto",
    noBtn: "btn btn-outline-danger text-white btn-lg ml-auto",
    btnDangerSml: "btn btn-danger text-white btn-sm ml-auto",
    btnDangerLg: "btn btn-warning btn-lg p-1 w-25",
}

const actionProperties = {
    confirm: "This action cannot be undone. Do you wish to continue?",
    success: "You have successfully deleted all the duplicate bookmarks!",
    successDeletionFolder: "All empty folders have been removed!",
    searchEmptyFolder: "Do you want to search for empty folders?",
    emptyFoldersFalse: "No empty folders have been found!" + "\n\n" + "Please note some of the root bookmark folders cannot be deleted such as 'Other Favorites' or 'Deleted Favorites'.",
}

let bookmarksUrls = {};
let duplicateCount = 0;

submitBtn.addEventListener("click", async () => {
    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    console.log(bookmarkTreeNodes);
    bookmarksDiv.innerHTML = "";
    bookmarksUrls = {}; // crucial to prevent app from seeing all favorites as duplicates
    duplicateCount = 0;
    bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));

    if (duplicateCount === 1) {
        infoText.innerText = duplicateCount + " duplicate has been found!";
        scaleUpTop(infoText);
        bookmarksDiv.style.display = "block";
    } else if (duplicateCount === 0) {
        infoText.innerText = "No duplicates have been found!";
        scaleUpTop(infoText);
    } else {
        infoText.innerText = duplicateCount + " duplicates have been found.";
        scaleUpTop(infoText);
        bookmarksDiv.style.display = "block";
    }
});

function displayBookmarks(bookmarkNodes) {
    let list = document.createElement("ul");
    list.className = stylingProperties.wrapperDiv;
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

let removeButtons = []; // global array to store all the remove buttons

function displayBookmark(bookmarkNode) {
    // add list item to contain all the duplicate elements
    let listItem = document.createElement("li");
    listItem.className = stylingProperties.mainDiv;
    listItem.innerText = bookmarkNode.title ? bookmarkNode.title : "No Title";
    if (bookmarkNode.url && bookmarksUrls[bookmarkNode.url]) {
        duplicateCount++;

        // add remove button
        let removeButton = document.createElement("button");
        removeButton.className = buttonProperties.btnDangerSml;
        removeButton.innerText = "Remove duplicate";

        // function to remove duplicate favorites
        removeButton.addEventListener("click", () => {
            removeButtons.forEach(button => button.disabled = true);
            submitBtn.disabled = true;

            let popUpWarning = document.createElement("div");
            popUpWarning.className = stylingProperties.basicDiv;
            popUpWarning.innerText = actionProperties.confirm;
            scaleUpTop(popUpWarning);

            let popUpBtn = document.createElement("button");
            popUpBtn.className = buttonProperties.btnDangerLg;
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
                    infoText.innerText = actionProperties.success;

                    // remove unnecessary dom bookmarks div
                    let bookmarksDiv = document.getElementById("bookmarks");

                    // function to remove (if any) empty folders in bookmarks
                    let deleteFolderDiv = document.createElement("div");
                    deleteFolderDiv.className = stylingProperties.basicDiv;
                    deleteFolderDiv.innerText = actionProperties.searchEmptyFolder;
                    scaleUpTop(deleteFolderDiv);

                    // create buttons to approve or deny the deletion of empty folders

                    let deleteFolderBtnYes = document.createElement("button");
                    deleteFolderBtnYes.className = buttonProperties.yesBtn;
                    deleteFolderBtnYes.innerText = "Yes";
                    deleteFolderDiv.appendChild(deleteFolderBtnYes);

                    let deleteFolderBtnNo = document.createElement("button");
                    deleteFolderBtnNo.className = buttonProperties.noBtn;
                    deleteFolderBtnNo.innerText = "No";
                    deleteFolderDiv.appendChild(deleteFolderBtnNo);

                    bookmarksDiv.appendChild(deleteFolderDiv);

                    // actual work is done here
                    deleteFolderBtnYes.addEventListener("click", async () => {
                        const bookmarkTreeNodes = await chrome.bookmarks.getTree();
                        const emptyFolders = findEmptyFolders(bookmarkTreeNodes);

                        if (emptyFolders.length >= 1) {
                            emptyFolders.forEach(folder => {
                                chrome.bookmarks.removeTree(folder.id);
                            })
                            infoText.innerText = actionProperties.successDeletionFolder;
                        } else {
                            // this probably won't work since code cannot modify root folders
                            // such as "Other Favorites" but added nevertheless
                            infoText.innerText = actionProperties.emptyFoldersFalse;
                        }

                        bookmarksDiv.remove();
                    });

                    deleteFolderBtnNo.addEventListener("click", () => {
                        bookmarksDiv.remove();
                    });

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

// function to recursively check if a folder in bookmark is empty

function isEmptyFolder(node) {
    // check if empty folders are actually non-editable root folders of
    // the browser itself such as "Other Favorites" or "Deleted Favorites"
    // node id's of these folders are 2 (Other Favorites) & 727 (Deleted Favorites)
    if (node.id === "2" && node.id === "727") {
        console.error("Can't modify the favorites folders in the root directory of the browser.");
        return false;
    }
    return node.children && node.children.length === 0;
}

// function to search bookmarks and find empty folder

function findEmptyFolders(bookmarksTree, emptyFolders = []) {
    for (let node of bookmarksTree) {
        // check if any folder's existence
        if ((node.id !== "2" && node.id !== "727") && node.children) {
            // check if current node is an empty folder
            if (isEmptyFolder(node)) {
                emptyFolders.push(node);
                console.log(emptyFolders);
            } else {
                // check children nodes
                findEmptyFolders(node.children, emptyFolders);
            }
        }
    }
    return emptyFolders;
}

// function to handle the animations

function scaleUpTop(elem) {
    elem.classList.add("scale-up-top");
    elem.addEventListener("animationend", () => {
        elem.classList.remove("scale-up-top");
    });
}