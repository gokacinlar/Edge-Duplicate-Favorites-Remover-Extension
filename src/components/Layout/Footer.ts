import Localize from "../../i18n";
import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import CreateTemplate from "../../utils/componentLogic";

class Footer extends HTMLElement implements LifecycleCallbacks {
    constructor() {
        super();
        new CreateTemplate().initializeComponent(Footer.footerLayout(), this);
    }

    private static footerLayout(): string {
        return /*html*/ `
            <section id="footer" class="h-100">
                <div id="controlsArea" class="d-flex flex-row align-items-start justify-content-evenly gap-1
                    flex-grow-0 w-100 h-100 px-2 py-2 shadow-sm">
                    <app-button
                        id="expandLowerMenu"
                        type="button"
                        role="button"
                        data-bs-toggle="tooltip" data-bs-title="${Localize.translate("expandMenu.message")}"
                        class="bee-color-button bg-gradient flex-grow-3 btn btn-sm rounded-pill fs-6 fw-medium">
                        <i class="expand-lower-arrow d-flex justify-content-center remix-icon-element ri-arrow-up-s-line"></i>
                    </app-button>
                    <app-button
                        id="toolsBtn"
                        type="button"
                        role="button"
                        hasText="${Localize.translate("tools.message")}"
                        data-bs-toggle="tooltip" data-bs-title="${Localize.translate("tools.message")}"
                        class="bee-color-button bg-gradient flex-grow-2 btn btn-sm rounded-pill fs-6 fw-medium">
                    </app-button>
                    <app-dropdown class="dropup-center dropup">
                        <app-button
                            id="bulkActionsBtn"
                            type="button"
                            role="button"
                            hasText="${Localize.translate("bulkActions.message")}"
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
                        hasText="${Localize.translate("getFavorites.message")}"
                        data-bs-toggle="tooltip" data-bs-title="${Localize.translate("getFavorites.message")}"
                        class="bg-gradient flex-grow-1 btn btn-sm rounded-pill fs-6 fw-medium text-white text-truncate">
                    </app-button>
                </div>
            </section>
        `;
    }

    private static handleFooterMenuResizing(loweringBtn: string, footerMenu: HTMLElement | null) {
        let lowered = false;

        if (!footerMenu || !loweringBtn) {
            console.error("Please provide an element to be resized and button to trigger this event.");
            return;
        }

        const button = document.querySelector(`#${loweringBtn}`) as HTMLButtonElement;
        if (!button) {
            console.error("Button not found:", loweringBtn);
            return;
        }

        const menuStateMessage = document.querySelector("#expandLowerMenu") as HTMLElement;
        const menuStateMessageTooltip = document.querySelector("#expandLowerMenu") as HTMLElement;
        const iconState = document.querySelector(".expand-lower-arrow") as HTMLElement;
        button.addEventListener("click", () => {
            lowered = !lowered;

            if (lowered) {
                footerMenu.classList.add("flex-grow-1");
                // Remix Arrow Icon Animation
                iconState.style.rotate = "180deg";
                // Menu tooltip message
                menuStateMessage.setAttribute("data-bs-title", Localize.translate("expandMenuLowered.message"));
                menuStateMessageTooltip.setAttribute("data-bs-toggle", Localize.translate("expandMenuLowered.message"));
            } else {
                footerMenu.classList.remove("flex-grow-1");
                // Remix Arrow Icon Animation
                iconState.style.rotate = "0deg";
                // Menu tooltip message
                menuStateMessage.setAttribute("data-bs-title", Localize.translate("expandMenu.message"));
                menuStateMessageTooltip.setAttribute("data-bs-toggle", Localize.translate("expandMenu.message"));
            }
        });
    }

    private handleMenuFooterResizingState(): void {
        const menuFooterDiv = document.querySelector("app-footer") as HTMLElement;
        Footer.handleFooterMenuResizing("expandLowerMenu", menuFooterDiv);
    }

    connectedCallback(): void {
        this.handleMenuFooterResizingState();
    }
    attributeChangedCallback(): void { }
    disconnectedCallback(): void { }
}

export default Footer;
customElements.define("app-footer", Footer);
