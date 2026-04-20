
import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import CreateTemplate from "../../utils/componentLogic";

class Footer extends HTMLElement implements LifecycleCallbacks {
    constructor() {
        super();
        new CreateTemplate().initializeComponent(Footer.footerLayout(), this);
    }

    private static footerLayout(): string {
        return /*html*/`
            <section id="footer">
                <div id="controlsArea" class="d-flex flex-row align-items-center justify-content-evenly gap-1
                    flex-grow-0 w-100 px-2 py-2 shadow-sm">
                    <app-button
                        id="expandLowerMenu"
                        type="button"
                        role="button"
                        data-bs-toggle="tooltip" data-bs-title="Expand Menu"
                        class="bee-color-button bg-gradient flex-grow-3 btn btn-sm rounded-pill fs-6 fw-medium">
                        <i class="d-flex justify-content-center remix-icon-element ri-arrow-up-s-line"></i>
                    </app-button>
                    <app-button
                        id="getFavoritesButton"
                        type="button"
                        role="button"
                        hasText ="Tools"
                        data-bs-toggle="tooltip" data-bs-title="See Available Tools"
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
                        <ul class="bulk-actions-list navbar-dropdown dropdown-menu rounded-4 shadow-sm">
                        </ul>
                    </app-dropdown>
                    <app-button
                        id="getFavoritesButton"
                        type="button"
                        role="button"
                        hasText ="Get Favorites"
                        data-bs-toggle="tooltip" data-bs-title="Click to see favorites"
                        class="bee-color-button bg-gradient flex-grow-1 btn btn-sm rounded-pill fs-6 fw-medium">
                    </app-button>
                </div>
            </section>
        `;
    }


    connectedCallback(): void { }
    attributeChangedCallback(): void { }
    disconnectedCallback(): void { }
}

export default Footer;
customElements.define("app-footer", Footer);
