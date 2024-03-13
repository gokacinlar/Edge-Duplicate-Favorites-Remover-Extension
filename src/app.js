document.getElementById("submit").addEventListener("click", function () {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        console.log(bookmarkTreeNodes);
        let bookmarksDiv = document.getElementById("bookmarks");
        bookmarksDiv.innerHTML = "";
        bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));
    });
});

let bookmarksUrls = {};
let duplicateCount = 0;

document.getElementById("submit").addEventListener("click", function () {
    let infoText = document.getElementById("infoText");
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        console.log(bookmarkTreeNodes);
        let bookmarksDiv = document.getElementById("bookmarks");
        bookmarksDiv.innerHTML = "";
        bookmarksUrls = {};
        duplicateCount = 0;
        bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));
        if (duplicateCount === 0) {
            infoText.innerText = "No duplicates have been found!";
        } else {
            infoText.innerText = duplicateCount + " duplicates have been found!";
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
        listItem.className = "w-100 list-group-item d-flex flex-row gap-3 justify-content-around align-items-center m-1 rounded bg-primary text-white border-0";
        listItem.innerText = bookmarkNode.title ? bookmarkNode.title : "No Title";

        let removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger text-white btn-sm ml-auto";
        removeButton.innerText = "Remove duplicate";
        removeButton.addEventListener("click", function () {
            let bookmarksDiv = document.getElementById("bookmarks");
            chrome.bookmarks.remove(bookmarkNode.id);
            listItem.remove();
            duplicateCount--;
            if (duplicateCount === 0) {
                infoText.innerText = "You have successfully deleted all the duplicate bookmarks!";
                bookmarksDiv.style.display = "none";
            }
        });
        listItem.appendChild(removeButton);

        return listItem;
    } else {
        bookmarksUrls[bookmarkNode.url] = true;

        return null;
    }
}