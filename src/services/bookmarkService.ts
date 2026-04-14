import type { BookmarkState, BookmarkTreeNode } from "../ts/interfaces/iFaces";

class BookmarkService {
	private static instance: BookmarkService;
	private state: BookmarkState = {
		duplicateCount: 0,
		bookmarksUrls: {},
		duplicateFolders: {},
		removeButtons: [],
	};

	private constructor() { }

	public static getInstance(): BookmarkService {
		if (!BookmarkService.instance) {
			BookmarkService.instance = new BookmarkService();
		}
		return BookmarkService.instance;
	}

	public resetState(): void {
		this.state.duplicateCount = 0;
		this.state.bookmarksUrls = {};
		this.state.duplicateFolders = {};
		this.state.removeButtons = [];
	}

	public getState(): BookmarkState {
		return this.state;
	}

	public incrementDuplicateCount(): void {
		this.state.duplicateCount++;
	}

	public decrementDuplicateCount(): void {
		this.state.duplicateCount--;
	}

	public addRemoveButton(button: HTMLButtonElement): void {
		this.state.removeButtons.push(button);
	}

	public getBookmarks(): Promise<BookmarkTreeNode[]> {
		return new Promise((resolve, reject) => {
			try {
				chrome.bookmarks.getTree((tree) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve(tree);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	public async removeBookmark(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				chrome.bookmarks.remove(id, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve();
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	public async removeTree(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				chrome.bookmarks.removeTree(id, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve();
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	public async getBookmarkParent(id: string): Promise<BookmarkTreeNode[]> {
		return new Promise((resolve, reject) => {
			try {
				chrome.bookmarks.get(id, (result) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve(result);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	public async getFolderPath(bookmarkNode: BookmarkTreeNode): Promise<string> {
		let folderPath = "";
		let currentNode = bookmarkNode;

		while (currentNode.parentId && currentNode.parentId !== "0") {
			const parent = await this.getBookmarkParent(currentNode.parentId);
			if (parent.length > 0) {
				folderPath = `${parent[0].title} > ${folderPath}`;
				currentNode = parent[0];
			} else {
				break;
			}
		}
		return folderPath;
	}

	public isValidBookmark(bookmark: BookmarkTreeNode | null): boolean {
		if (bookmark) {
			return !!(bookmark.url && bookmark.title);
		}
		return false;
	}

	public isEmptyFolder(node: BookmarkTreeNode): boolean {
		return (
			!(node.id === "2" || node.id === "727") &&
			!!(node.children && node.children.length === 0)
		);
	}

	public findEmptyFolders(
		bookmarksTree: BookmarkTreeNode[],
		emptyFolders: BookmarkTreeNode[] = [],
	): BookmarkTreeNode[] {
		for (const node of bookmarksTree) {
			if (node.children) {
				if (this.isEmptyFolder(node)) {
					emptyFolders.push(node);
				} else {
					this.findEmptyFolders(node.children, emptyFolders);
				}
			}
		}
		return emptyFolders;
	}

	public isUrlSeen(url: string | undefined): boolean {
		if (!url) return false;
		return !!this.state.bookmarksUrls[url];
	}

	public markUrlAsSeen(url: string): void {
		this.state.bookmarksUrls[url] = true;
	}

	public addDuplicateFolder(url: string, folderPath: string): void {
		if (!this.state.duplicateFolders[url]) {
			this.state.duplicateFolders[url] = [];
		}
		this.state.duplicateFolders[url].push(folderPath);
	}
}

export default BookmarkService;
