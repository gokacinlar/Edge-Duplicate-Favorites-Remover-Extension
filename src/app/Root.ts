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
                <section id="upperNavigation" class="row mx-0 flex-grow-0">
                    <app-navbar class="px-0 w-100"></app-navbar>
                </section>
                <section id="mainRoot" class="row mx-0 flex-grow-1">
                    <div class="d-flex flex-column w-100 h-100 align-items-center justify-content-between">
                        <div id="displayArea" class="flex-grow-1 overflow-auto">
                            this is the display area
                        </div>
                        <div id="controlsArea" class="flex-grow-0 w-100 px-2 py-2">
                            this is the controls area
                        </div>
                    </div>
                </section>
            </main>
        `;
    }
}

export default AppRoot;
customElements.define("app-root", AppRoot);
