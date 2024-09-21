import { sections, etc } from './static.js';
import { stylingProperties } from './styling.js';
import { isValidBookmark, createRemoveButton, } from './events.js';
import { updateInfoText, disableButtons } from './helpers.js';

sections.submitBtn.addEventListener("click", handleSubmit);

async function handleSubmit() {
    // Reset duplicateCount and bookmarksUrls before fetching bookmarks
    etc.duplicateCount = 0;
    etc.bookmarksUrls = {};

    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    sections.bookmarksDiv.appendChild(displayBookmarks(bookmarkTreeNodes));
    updateInfoText(etc.duplicateCount); // Pass duplicateCount here to be used in helpers.js
}

function displayBookmarks(bookmarkNodes) {
    const list = document.createElement("ul");
    list.className = stylingProperties.wrapperDiv;

    for (const item of bookmarkNodes) {
        if (isValidBookmark(item)) {
            const listItem = displayBookmark(item);
            if (listItem) {
                // Append the content to DOM if it is a duplicate
                // NOTE: Lazy workaround
                if (listItem.querySelector("button")) { // Check if the list item has a remove button
                    list.appendChild(listItem);
                }
            }
        } else {
            console.error("Invalid bookmark data found: ", item);
        }
        if (item.children) {
            const childList = displayBookmarks(item.children);
            if (childList.hasChildNodes()) {
                list.appendChild(childList);
            }
        }
    }
    return list;
}

// Function to display actual bookmarks in the DOM
function displayBookmark(bookmarkNode) {
    const listItem = document.createElement("li");
    listItem.className = stylingProperties.mainDiv;
    listItem.innerText = bookmarkNode.title || "No Title";

    if (bookmarkNode.url && etc.bookmarksUrls[bookmarkNode.url]) {
        etc.duplicateCount++; // Increment only if it's a duplicate
        const removeButton = createRemoveButton(bookmarkNode, listItem);
        listItem.appendChild(removeButton);
        disableButtons();
    } else {
        etc.bookmarksUrls[bookmarkNode.url] = true;
        return null;
    }
    return listItem;
}