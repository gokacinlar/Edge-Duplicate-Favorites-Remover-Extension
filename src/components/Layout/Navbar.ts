
import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import CreateTemplate from "../../utils/componentLogic";
import { adjustThemeIconState } from "../../utils/helpers";
import ThemeManager from "../../utils/themeModeSwitchHandler";

class NavBar extends HTMLElement implements LifecycleCallbacks {
    constructor() {
        super();
        new CreateTemplate().initializeComponent(NavBar.navBarLayout(), this);
    }

    private handleThemeToggle(): void {
        const theme = ThemeManager.getInstance();
        theme.toggle();
    }

    private setupThemeButton(): void {
        const themeButton = this.querySelector("#changeThemeButton");
        if (themeButton) {
            themeButton.addEventListener("click", () => this.handleThemeToggle());
        }
    }

    private static navBarLayout(): string {
        return /*html*/`
            <nav class="navbar d-flex justify-content-end py-2">
                <ul class="navbar-ul list-group list-group-flush w-100 d-flex flex-row align-items-center justify-content-end px-2 gap-1">
                    <li class="list-group-item m-0 p-0 border-0 rounded-pill">
                        <app-dropdown class="dropstart">
                            <app-button
                                id="changeLanguageButton"
                                type="button"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                class="bee-color-button btn btn-sm rounded-pill dropdown-toggle
                                    d-flex flex-row align-items-center justify-content-center shadow-sm">
                                <i class="d-flex justify-content-center remix-icon-element ri-translate-2"></i>
                            </app-button>
                            <ul class="lang-switch-list navbar-dropdown dropdown-menu rounded-4 shadow-sm">
                                <li class="dropdown-item"><span class="fi fi-us"></span> English</li>
                                <li class="dropdown-item"><span class="fi fi-de"></span> Deutsch</li>
                                <li class="dropdown-item"><span class="fi fi-fr"></span> French</li>
                                <li class="dropdown-item"><span class="fi fi-tr"></span> Türkçe</li>
                            </ul>
                        </app-dropdown>
                    </li>
                    <li class="list-group-item m-0 p-0 border-0 rounded-pill">
                        <app-button
                            id="changeThemeButton"
                            type="button"
                            role="button"
                            data-bs-toggle="tooltip" data-bs-title="Change Theme"
                            class="bee-color-button btn btn-sm rounded-pill theme-switch-toggle-icon shadow-sm">
                            <i class="d-flex justify-content-center remix-icon-element ri-moon-line"></i>
                        </app-button>
                    </li>
                    <li class="list-group-item m-0 p-0 border-0 rounded-pill">
                        <app-button
                            data-bs-toggle="tooltip" data-bs-title="GitHub"
                            class="bee-color-button btn btn-sm rounded-pill theme-switch-toggle-icon shadow-sm">
                            <i class="d-flex justify-content-center remix-icon-element ri-github-line"></i>
                        </app-button>
                    </li>
                    <li class="list-group-item m-0 p-0 border-0 rounded-pill">
                        <app-button
                            data-bs-toggle="tooltip" data-bs-title="BuyMeACoffee"
                            class="bee-color-button btn btn-sm rounded-pill theme-switch-toggle-icon shadow-sm">
                            <i class="d-flex justify-content-center remix-icon-element ri-cup-line"></i>
                        </app-button>
                    </li>
                </ul>
            </nav>
        `;
    }

    private updateThemeIcon(): void {
        const iconEl = this.querySelector(".theme-switch-toggle-icon i");
        if (iconEl) {
            const theme = ThemeManager.getInstance().getTheme();
            adjustThemeIconState(iconEl as HTMLElement, theme, "ri-moon-line", "ri-sun-line",);
        }
    }

    connectedCallback(): void {
        this.updateThemeIcon();
        this.setupThemeButton();
        document.addEventListener("theme-changed", () => this.updateThemeIcon());
    }
    attributeChangedCallback(): void { }
    disconnectedCallback(): void { }
}

export default NavBar;
customElements.define("app-navbar", NavBar);
