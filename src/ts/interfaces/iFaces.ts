export interface LifecycleCallbacks {
    attributeChangedCallback(
        name?: string,
        oldValue?: string,
        newValue?: string,
    ): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}

export interface BookmarkTreeNode {
    id?: string;
    parentId?: string;
    index?: number;
    title?: string;
    url?: string;
    dateAdded?: number;
    dateGroupModified?: number;
    unmodifiable?: string;
    children?: BookmarkTreeNode[];
}

export interface BookmarkState {
    duplicateCount: number;
    bookmarksUrls: Record<string, boolean>;
    duplicateFolders: Record<string, string[]>;
    removeButtons: HTMLButtonElement[];
}

export interface SectionElements {
    submitBtn: HTMLButtonElement | null;
    infoText: HTMLElement | null;
    bookmarksDiv: HTMLElement | null;
}

export interface StylingProperties {
    mainDiv: string;
    foundFavDiv: string;
    basicDiv: string;
    wrapperDiv: string;
}

export interface ButtonProperties {
    yesBtn: string;
    noBtn: string;
    btnDangerSml: string;
    btnDangerLg: string;
}

export interface ActionMessages {
    confirm: string;
    success: string;
    successDeletionFolder: string;
    searchEmptyFolder: string;
    emptyFoldersFalse: string;
}

export interface InfoMessages {
    found: string;
    notFound: string;
    foundOne: string;
    foundMultiple: string;
}