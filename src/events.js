import { sections, etc } from './static.js';
import { buttonProperties, actionProperties } from './styling.js';
import { isEmptyFolder, cleanUpDuplicateLists, createPopUpWarning, createPopUpButton, createDeleteFolderDiv } from './helpers.js';

// Initialize etc.removeButtons array
etc.removeButtons = [];

// Function to check if bookmark meets the valid criteria
export function isValidBookmark(bookmark) {
    if (bookmark) {
        return bookmark.url && bookmark.title;
    }
    return false; // Return false if bookmark is not defined
}

// Function to create a remove button to give option to delete duplicate favorites
export function createRemoveButton(bookmarkNode, listItem) {
    const removeButton = document.createElement("button");
    removeButton.className = buttonProperties.btnDangerSml;
    removeButton.innerText = "Remove duplicate";

    removeButton.addEventListener("click", () => {
        etc.removeButtons.push(removeButton); // Add the remove button to the etc.removeButtons array
        handleRemoveButtonClick(bookmarkNode, listItem);
    });

    return removeButton;
}

// Function to recursively search for empty bookmark/favorites folders
export function findEmptyFolders(bookmarksTree, emptyFolders = []) {
    for (const node of bookmarksTree) {
        if (node.children) {
            if (isEmptyFolder(node)) {
                emptyFolders.push(node);
            } else {
                findEmptyFolders(node.children, emptyFolders);
            }
        }
    }
    return emptyFolders;
}

// Function to trigger what's gonna happen when remove button is clicked
export async function handleRemoveButtonClick(bookmarkNode, listItem) {
    const popUpWarning = createPopUpWarning();

    document.body.appendChild(popUpWarning);

    const buttonsToBeDisabled = document.querySelectorAll(".remove-btn");
    buttonsToBeDisabled.forEach(button => {
        button.disabled = true;
    });

    const popUpBtn = createPopUpButton(bookmarkNode, listItem, popUpWarning);
    popUpWarning.appendChild(popUpBtn);
}

// Function to trigger when "Delete" button is pressed to delete empty bookmark folders
export async function handleDeleteFolderYes() {
    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    const emptyFolders = findEmptyFolders(bookmarkTreeNodes);

    if (emptyFolders.length > 0) {
        emptyFolders.forEach(folder => chrome.bookmarks.removeTree(folder.id));
        sections.infoText.innerText = actionProperties.successDeletionFolder;
    } else {
        sections.infoText.innerText = actionProperties.emptyFoldersFalse;
    }

    sections.bookmarksDiv.remove();
    cleanUpDuplicateLists();
}

// Function to decide what's gonna happen after empty bookmark folders are deleted
export async function handleEmptyFoldersAfterDeletion() {
    if (etc.duplicateCount === 0) {
        sections.infoText.innerText = actionProperties.success;
        const deleteFolderDiv = createDeleteFolderDiv();
        sections.bookmarksDiv.appendChild(deleteFolderDiv);
        sections.submitBtn.disabled = false;
    }
}