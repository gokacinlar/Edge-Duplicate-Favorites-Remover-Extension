export const sections = {
    submitBtn: document.getElementById("submit"),
    infoText: document.getElementById("infoText"),
    bookmarksDiv: document.getElementById("bookmarks")
}

export const messages = {
    success: "duplicates have been found.",
    fail: "No duplicates have been found."
}

export let etc = {
    duplicateCount: 0,
    bookmarksUrls: {},
    removeButtons: []
}

// Styling properties and action messages
export const stylingProperties = {
    mainDiv: "list-group-item d-flex flex-fill flex-row flex-grow-1 gap-3 justify-content-between align-items-center rounded bg-primary text-white border-0",
    foundFavDiv: "d-flex flex-row gap-1 justify-content-between align-items-center rounded bg-primary text-white border-0",
    basicDiv: "w-auto p-3 m-2 d-flex flex-row gap-3 justify-content-between align-items-center bg-primary border-0 rounded",
    wrapperDiv: "list-group w-100 d-flex flex-column gap-3 h-auto justify-content-between",
};

export const buttonProperties = {
    yesBtn: "btn btn-outline-warning text-white btn-lg ml-auto",
    noBtn: "btn btn-outline-danger text-white btn-md ml-auto",
    btnDangerSml: "remove-btn btn btn-danger text-white btn-sm fs-5 ml-auto lh-sm shadow-sm",
    btnDangerLg: "btn btn-warning btn-lg p-1 w-25",
};

export const actionProperties = {
    confirm: "This action cannot be undone. Do you wish to continue?",
    success: "You have successfully deleted all the duplicate bookmarks!",
    successDeletionFolder: "All empty folders have been removed!",
    searchEmptyFolder: "Do you want to search for empty folders?",
    emptyFoldersFalse: "No empty folders have been found!\n\nPlease note some of the root bookmark folders cannot be deleted such as 'Other Favorites' or 'Deleted Favorites'.",
};