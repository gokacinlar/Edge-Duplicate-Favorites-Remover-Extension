import { sections, etc, messages, stylingProperties, buttonProperties, actionProperties } from './static.js';
import { handleDeleteFolderYes, handleEmptyFoldersAfterDeletion } from './events.js';

export function updateInfoText(duplicateCount) {
    if (duplicateCount === 1) {
        sections.infoText.innerText = `${duplicateCount} duplicate has been found!`;
    } else if (duplicateCount === 0) {
        sections.infoText.innerText = messages.fail;
        sections.bookmarksDiv.remove();
    } else {
        sections.infoText.innerText = `${duplicateCount} ${messages.success}`;
    }
    scaleUpTop(sections.infoText);

    sections.bookmarksDiv.style.display = duplicateCount === 0 ? "none" : "block";
}

export function enableButtons() {
    etc.removeButtons.forEach(button => button.disabled = false);
    sections.submitBtn.disabled = false;
}

export function disableButtons() {
    etc.removeButtons.forEach(button => button.disabled = true);
    sections.submitBtn.disabled = true;
}

export function isEmptyFolder(node) {
    return !(node.id === "2" || node.id === "727") && node.children && node.children.length === 0;
}

export function cleanUpDuplicateLists() {
    const duplicateUlElements = document.querySelectorAll("ul.list-group");
    duplicateUlElements.forEach(ul => ul.remove());

    document.body.setAttribute("style", "height: fit-content !important; width: 512px;");
    document.documentElement.setAttribute("style", "height: fit-content !important;");
}

// handle the animation
export function scaleUpTop(elem) {
    elem.classList.add("scale-up-top");
    elem.addEventListener("animationend", () => {
        elem.classList.remove("scale-up-top");
    });
}

export function createPopUpWarning() {
    const popUpWarning = document.createElement("div");

    popUpWarning.className = stylingProperties.basicDiv;
    popUpWarning.innerText = actionProperties.confirm;

    scaleUpTop(popUpWarning);
    return popUpWarning;
}

export function createPopUpButton(bookmarkNode, listItem, popUpWarning) {
    const popUpBtn = document.createElement("button");
    popUpBtn.className = buttonProperties.btnDangerLg;
    popUpBtn.innerText = "Yes";
    popUpBtn.setAttribute("title", "Remove Favorites");

    popUpBtn.addEventListener("click", async () => {
        await chrome.bookmarks.remove(bookmarkNode.id);
        etc.duplicateCount--;

        listItem.remove();
        popUpWarning.remove();

        const buttonsToBeDisabled = document.querySelectorAll(".remove-btn");
        buttonsToBeDisabled.forEach(button => {
            button.disabled = false;
        });

        handleEmptyFoldersAfterDeletion();
    });

    return popUpBtn;
}

export function createDeleteFolderDiv() {
    const deleteFolderDiv = document.createElement("div");
    deleteFolderDiv.className = stylingProperties.basicDiv;
    deleteFolderDiv.innerText = actionProperties.searchEmptyFolder;
    scaleUpTop(deleteFolderDiv);

    const deleteFolderBtnYes = createDeleteFolderButton("Yes", handleDeleteFolderYes);
    const deleteFolderBtnNo = createDeleteFolderButton("No", () => sections.bookmarksDiv.remove());

    deleteFolderDiv.appendChild(deleteFolderBtnYes);
    deleteFolderDiv.appendChild(deleteFolderBtnNo);
    return deleteFolderDiv;
}

export function createDeleteFolderButton(text, onClick) {
    const button = document.createElement("button");

    button.className = buttonProperties.yesBtn;
    button.innerText = text;
    button.addEventListener("click", onClick);

    return button;
}