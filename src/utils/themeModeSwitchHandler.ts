import { adjustThemeIconState } from "../utils/helpers";

class ThemeManager {
	private static instance: ThemeManager;
	private mediaQuery: MediaQueryList;
	private readonly storageKey = "theme";

	private constructor() {
		this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		this.initialize();
	}

	public static getInstance(): ThemeManager {
		if (!ThemeManager.instance) {
			ThemeManager.instance = new ThemeManager();
		}
		return ThemeManager.instance;
	}

	private initialize(): void {
		this.addCurrentThemeToLocalStorageIfMissing();
		this.applyTheme();
		this.setupMediaQueryListener();
		this.handleThemeSwitchingButtonIconState();
	}

	// Get initial theme from user preference
	private static getSystemTheme(): string {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	private addCurrentThemeToLocalStorageIfMissing(): void {
		try {
			if (!localStorage.getItem(this.storageKey)) {
				localStorage.setItem(this.storageKey, ThemeManager.getSystemTheme());
			}
		} catch (error: unknown) {
			console.error(`Error while adding theme to Local Storage: ${error}`);
		}
	}

	private getCurrentThemeFromLocalStorage(): string {
		try {
			const theme = localStorage.getItem(this.storageKey);
			return theme ?? ThemeManager.getSystemTheme();
		} catch (error: unknown) {
			console.error(`Error while reading theme from Local Storage: ${error}`);
			return ThemeManager.getSystemTheme();
		}
	}

	private applyTheme(): void {
		const theme = this.getCurrentThemeFromLocalStorage();
		document.documentElement.setAttribute("data-theme", theme);
		this.handleThemeSwitchingButtonIconState();
		this.dispatchThemeChangeEvent(theme);
	}

	private setupMediaQueryListener(): void {
		const onChange = (e: MediaQueryListEvent) => {
			const stored = (() => {
				try {
					return localStorage.getItem(this.storageKey);
				} catch {
					return null;
				}
			})();
			if (!stored) {
				const systemTheme = e.matches ? "dark" : "light";
				document.documentElement.setAttribute("data-theme", systemTheme);
				this.handleThemeSwitchingButtonIconState();
				this.dispatchThemeChangeEvent(systemTheme);
			}
		};

		// support both addEventListener and older addListener
		if ((this.mediaQuery as MediaQueryList).addEventListener) {
			this.mediaQuery.addEventListener("change", onChange);
		} else if ((this.mediaQuery as MediaQueryList).addListener) {
			(this.mediaQuery as MediaQueryList).addListener(onChange);
		}
	}

	private handleThemeSwitchingButtonIconState(): void {
		const el = document.querySelector(".theme-switch-toggle-icon i",) as HTMLElement;
		if (!el) {
			return;
		}

		const current =
			document.documentElement.getAttribute("data-theme") ||
			ThemeManager.getSystemTheme();
		// Add dynamic icon switch when theme switch happens
		adjustThemeIconState(el, current, "ri-moon-line", "ri-sun-line");
	}

	public toggle(): void {
		const current = this.getTheme();
		// Handle the logic between determining current theme & target theme
		const original = current === "dark" || current === "light" ? current : ThemeManager.getSystemTheme();
		const next = original === "dark" ? "light" : "dark";
		this.setTheme(next);
	}

	public setTheme(theme: string): void {
		try {
			localStorage.setItem(this.storageKey, theme);
			document.documentElement.setAttribute("data-theme", theme);
			this.handleThemeSwitchingButtonIconState();
			this.dispatchThemeChangeEvent(theme);
		} catch (error: unknown) {
			console.error(`Error while setting theme: ${error}`);
		}
	}

	public getTheme(): string {
		return this.getCurrentThemeFromLocalStorage();
	}

	private dispatchThemeChangeEvent(theme: string): void {
		const event = new CustomEvent("theme-changed", {
			detail: { theme },
			bubbles: true,
		});
		document.dispatchEvent(event);
	}
}

export default ThemeManager;
