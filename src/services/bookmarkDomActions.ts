import BookmarkService from "./bookmarkService";

class BookmarkDomActions {
    private static readonly service = BookmarkService.getInstance();
    private static readonly MAX_INITAL_NUMBER_OF_DUPLICATES_SHOWN: number = 15;
    private readonly duplicateListClassName = "list-group border-2 px-2 py-2 shadow-sm gap-1 h-100 d-flex flex-column align-items-center justify-content-start";
    private readonly duplicateItemClassName = "duplicate-item list-group-item bg-secondary-subtle text-black bg-gradient px-1 py-1 rounded-3 scrollbar-hide overflow-scroll";

    private async fetchDuplicateData(): Promise<Record<string, string[]>> {
        const result = await BookmarkDomActions.service.findDuplicates();
        return result.duplicateFolders;
    }

    // Render duplicate bookmarks in DOM
    public async renderDuplicatesToElement(targetElementId: string): Promise<void> {
        try {
            const targetElement = this.getTargetElement(targetElementId);
            const data = await this.fetchDuplicateData();

            if (this.hasDuplicates(data)) {
                const listElement = this.createDuplicatesList(data, BookmarkDomActions.MAX_INITAL_NUMBER_OF_DUPLICATES_SHOWN);
                targetElement.appendChild(listElement);
                this.handleShowMoreDuplicates(targetElement, this.totalDuplicatesNumber(data))
                // Clear welcoming message
                this.deleteInitialArea();
            } else {
                console.warn("No duplicates have been found. Aborting...");
            }
        } catch (error: unknown) {
            throw new Error(`Error rendering duplicates to DOM: ${error}`);
        }
    }

    private hasDuplicates(duplicateData: Record<string, string[]>): boolean {
        return Object.keys(duplicateData).length > 0;
    }

    private getTargetElement(targetElementId: string): HTMLElement {
        const element = document.querySelector(`#${targetElementId}`);
        if (!element) {
            throw new Error(`Target element with ID "${targetElementId}" not found`);
        }
        return element as HTMLElement;
    }

    // UL element to contain our duplicates
    // After creating and appending your duplicate list
    private createDuplicatesList(duplicateData: Record<string, string[]>, initalDuplicatesShown: number): HTMLUListElement {
        const ulElement = document.createElement("ul");
        ulElement.className = this.duplicateListClassName;

        // Determine the max 
        const data = Object.entries(duplicateData).slice(0, initalDuplicatesShown);
        for (const [url, folderPaths] of data) {
            const duplicateItem = this.createDuplicateItem(url, folderPaths);
            ulElement.appendChild(duplicateItem);
        }

        return ulElement;
    }

    // List total duplicates
    private totalDuplicatesNumber(duplicate: Record<string, string[]>): number {
        return Object.values(duplicate).reduce((sum, folderPaths) => sum + folderPaths.length, 0);
    }

    // Individual duplicates shown
    private createDuplicateItem(url: string, folderPaths: string[]): HTMLLIElement {
        const liElement = document.createElement("li");
        liElement.className = this.duplicateItemClassName;

        const urlDisplay = this.createUrlDisplay(url, folderPaths.length);
        const folderDisplay = this.createFolderDisplay(folderPaths);

        liElement.appendChild(urlDisplay);
        liElement.appendChild(folderDisplay);

        return liElement;
    }

    private createUrlDisplay(url: string, duplicateCount: number): HTMLDivElement {
        const container = document.createElement("div") as HTMLDivElement;
        container.className = "d-flex flex-row align-items-center justify-content-between bg-primary-subtle bg-gradient rounded-3 px-1 py-1";

        const duplicateCounterContainer = this.createDuplicateCountInDisplay(duplicateCount);
        const value = document.createElement("a") as HTMLAnchorElement;
        value.target = "_blank";
        value.className = "link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover flex-grow-1 text-start text-truncate";
        value.href = url;
        value.textContent = url;

        container.appendChild(document.createTextNode(" "));
        container.appendChild(value);
        container.appendChild(duplicateCounterContainer);
        return container;
    }

    private createDuplicateCountInDisplay(count: number): Node {
        const duplicateContainer = document.createElement("div") as HTMLDivElement;
        duplicateContainer.classList.add("duplicate-count-container");

        const span = document.createElement("span") as HTMLSpanElement;
        const altSpan = document.createElement("span") as HTMLSpanElement;
        span.classList.add("duplicate-count-indicator");
        altSpan.classList.add("duplicate-count-indicator-message");
        altSpan.textContent = " duplicates";
        span.textContent = count.toString();

        span.appendChild(altSpan);
        duplicateContainer.appendChild(span);
        return duplicateContainer;
    }

    private createFolderDisplay(folderPaths: string[]): HTMLDivElement {
        const container = document.createElement("div");
        container.className = "scrollbar-hide overflow-scroll";
        const label = document.createElement("strong");
        label.textContent = "Found in:";

        const folderList = document.createElement("ul");
        folderList.className = "scrollbar-hide list-group d-flex flex-row flex-wrap align-items-center justify-content-start gap-1 overflow-scroll";

        for (const folderPath of folderPaths) {
            const displayPath = this.formatFolderPath(folderPath);
            const listItem = document.createElement("li");
            listItem.textContent = displayPath;
            listItem.className = "list-group-item rounded-pill flex-grow-1 px-2 py-1";
            folderList.appendChild(listItem);
        }

        container.appendChild(label);
        container.appendChild(folderList);
        return container;
    }

    private deleteInitialArea(): void {
        const displayAreaElement = document.querySelector(".duplicate-notifier") as HTMLDivElement;

        if (!displayAreaElement) {
            console.error("Please provide an element to be deleted.");
        }

        displayAreaElement.remove();
    }

    private formatFolderPath(folderPath: string): string {
        // Display Bookmark toolbar message instead of root
        if (folderPath.includes("Root")) {
            return "Bookmark Toolbar";
        }
        return folderPath;
    }

    private handleShowMoreDuplicates(targetElement: HTMLElement, duplicateCount: number): void {
        const showMoreButton: string = `
            <app-button
                id="showMoreDuplicates" type="button" role="button"
                hasText="Show More... (${duplicateCount} duplicates)"
                data-bs-toggle="tooltip" data-bs-title="Show More... (${duplicateCount} duplicates)"
                class="btn btn-sm bg-gradient flex-grow-0 btn btn-sm rounded-pill fs-6 fw-medium text-white text-truncate mb-2">
            </app-button>
        `;

        if (targetElement) {
            if (duplicateCount < BookmarkDomActions.MAX_INITAL_NUMBER_OF_DUPLICATES_SHOWN) {
                return;
            } else {
                targetElement.insertAdjacentHTML("afterend", showMoreButton);
            }
        }
    }
}

export default BookmarkDomActions;