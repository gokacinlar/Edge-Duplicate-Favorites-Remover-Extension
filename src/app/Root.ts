import CreateTemplate from "../utils/componentLogic";
import ThemeManager from "../utils/themeModeSwitchHandler";

class AppRoot extends HTMLElement {
    constructor() {
        super();
        ThemeManager.getInstance();
        new CreateTemplate().initializeComponent(AppRoot.rootLayout(), this);
    }

    private static rootLayout(): string {
        return /*html*/ `
            <main id="app-root" class="container-fluid gx-0 h-100 container-fluid gx-0 h-100 d-flex flex-column">
                <section id="upperNavigation" class="row mx-0 flex-grow-0 shadow-sm">
                    <app-navbar class="d-flex flex-row align-items-center justify-content-between px-0 w-100">
                        <a href="https://notbyai.fyi/tr/"
                            class="link-offset-2 link-underline link-underline-opacity-0" rel="noopener noreferrer"
                            target="_blank">
                            <img
                                class="img-fluid mx-1 notbyai-badge"
                                src="../assets/images/icons/notbyai/badge-white.svg"
                                data-bs-toggle="tooltip" data-bs-title="This extension is primarily made by a human."
                            >
                        </a>
                    </app-navbar>
                </section>
                <section id="mainRoot" class="row mx-0 flex-grow-1">
                    <div class="d-flex flex-column w-100 h-100 align-items-center justify-content-between">
                        <div id="displayArea" class="flex-grow-1 overflow-auto">
                            this is the display area
                        </div>
                        <div id="controlsArea" class="d-flex flex-row align-items-center justify-content-evenly gap-1
                            flex-grow-0 w-100 px-2 py-2 shadow-sm">
                            <app-button
                                id="expandLowerMenu"
                                type="button"
                                role="button"
                                class="bee-color-button bg-gradient flex-grow-3 btn btn-sm rounded-pill fs-6 fw-medium">
                                <i class="d-flex justify-content-center remix-icon-element ri-arrow-up-s-line"></i>
                            </app-button>
                            <app-button
                                id="getFavoritesButton"
                                type="button"
                                role="button"
                                hasText ="Tools"
                                class="bee-color-button bg-gradient flex-grow-2 btn btn-sm rounded-pill fs-6 fw-medium">
                            </app-button>
                            <app-dropdown class="dropup-center dropup">
                                <app-button
                                    id="bulkActionsBtn"
                                    type="button"
                                    role="button"
                                    hasText ="Bulk Actions"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    class="dropdown-toggle bee-color-button bg-gradient flex-grow-1 btn btn-sm rounded-pill
                                        d-flex flex-row align-items-center justify-content-center gap-1 fs-6 fw-medium">
                                </app-button>
                                <ul class="lang-switch-list navbar-dropdown dropdown-menu rounded-4 shadow-sm">
                                    <li class="dropdown-item"><span class="fi fi-us"></span> English</li>
                                    <li class="dropdown-item"><span class="fi fi-de"></span> Deutsch</li>
                                    <li class="dropdown-item"><span class="fi fi-fr"></span> French</li>
                                    <li class="dropdown-item"><span class="fi fi-es"></span> Spanish</li>
                                    <li class="dropdown-item"><span class="fi fi-tr"></span> Türkçe</li>
                                </ul>
                            </app-dropdown>
                            <app-button
                                id="getFavoritesButton"
                                type="button"
                                role="button"
                                hasText ="Get Favorites"
                                class="bee-color-button bg-gradient flex-grow-1 btn btn-sm rounded-pill fs-6 fw-medium">
                            </app-button>
                        </div>
                    </div>
                </section>
            </main>
        `;
    }
}

export default AppRoot;
customElements.define("app-root", AppRoot);
