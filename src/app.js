import { sections, etc, stylingProperties } from './static.js';
import { isValidBookmark, createRemoveButton, } from './events.js';
import { updateInfoText, disableButtons } from './helpers.js';

sections.submitBtn.addEventListener("click", handleSubmit);

async function handleSubmit() {
    // Reset duplicateCount and bookmarksUrls before fetching bookmarks
    etc.duplicateCount = 0;
    etc.bookmarksUrls = {};
    etc.duplicateFolders = {};

    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    const bookmarksList = await displayBookmarks(bookmarkTreeNodes);
    sections.bookmarksDiv.appendChild(bookmarksList);
    updateInfoText(etc.duplicateCount); // Pass duplicateCount here to be used in helpers.js
}

// Function to create Ulist items to hold the bookmarks
async function displayBookmarks(bookmarkNodes) {
    const list = document.createElement("ul");
    list.className = stylingProperties.wrapperDiv;

    for (const item of bookmarkNodes) {
        if (isValidBookmark(item)) {
            // Wait for duplicates to be listed
            const listItem = await displayBookmark(item);
            if (listItem !== null) {
                if (listItem.querySelector("button")) {
                    list.appendChild(listItem);
                }
            }
        } else {
            console.error("Invalid bookmark data found: ", item);
        }
        if (item.children) {
            const childList = await displayBookmarks(item.children);
            if (childList.hasChildNodes()) {
                list.appendChild(childList);
            }
        }
    }
    return list;
}


// Function to display actual bookmarks in the DOM
async function displayBookmark(bookmarkNode) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item bg-warning bg-gradient d-flex flex-row flex-grow-1 gap-2 justify-content-between align-items-center rounded bg-primary text-white border-0"

    if (bookmarkNode.url && etc.bookmarksUrls[bookmarkNode.url]) {
        etc.duplicateCount++; // Increment the number only if it's a duplicate
        // Store the folder where the duplicate is found
        // to be later used to display folder names in which
        // duplicate bookmarks are located
        if (!etc.duplicateFolders[bookmarkNode.url]) {
            etc.duplicateFolders[bookmarkNode.url] = [];
        }

        let folderPath = await getFolderPath(bookmarkNode);
        // Remove the last ">" from the string output of parentId
        folderPath = folderPath.slice(0, -2);
        etc.duplicateFolders[bookmarkNode.url].push(folderPath);

        // Display the title and folder name
        listItem.innerHTML = `
        <div class="d-flex flex-column gap-1 text-black">
            <p class="mx-0 my-0 fw-medium">${bookmarkNode.title}</p>
            <p class="p-1 rounded bg-primary bg-gradient text-light mx-0 my-0">${folderPath}</p>
        </div>
        `;

        const removeButton = createRemoveButton(bookmarkNode, listItem);
        listItem.appendChild(removeButton);
        disableButtons();
    } else if (bookmarkNode.url) {
        etc.bookmarksUrls[bookmarkNode.url] = true;
        return null;
    }
    return listItem;
}


// Function to get the folder path of a bookmark
async function getFolderPath(bookmarkNode) {
    let folderPath = "";
    let currentNode = bookmarkNode;

    while (currentNode.parentId !== "0") {
        // Get the folders via parentId
        // https://developer.chrome.com/docs/extensions/reference/api/bookmarks#type-BookmarkTreeNodeUnmodifiable
        const parent = await chrome.bookmarks.get(currentNode.parentId);
        if (parent.length > 0) {
            folderPath = parent[0].title + " > " + folderPath;
            currentNode = parent[0];  // Ensure reassignment works
        } else {
            break;
        }
    }
    return folderPath;
}
