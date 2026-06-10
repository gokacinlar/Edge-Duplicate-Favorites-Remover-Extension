import Localize from "../i18n";
import type { LifecycleCallbacks } from "../ts/interfaces/iFaces";
import CreateTemplate from "../utils/componentLogic";
import StaticReadOnlyInformation from "../utils/static";
import ThemeManager from "../utils/themeModeSwitchHandler";
import { initTooltips } from "../utils/bootstrapRelated";

class AppRoot extends HTMLElement implements LifecycleCallbacks {
	private static readonly welcomeMessage = new StaticReadOnlyInformation().WELCOME_MESSAGE;
	private static rootLayout(): string {
		return /*html*/ `
            <main id="app-root" class="container-fluid gx-0 h-100 d-flex flex-column">
                <section id="upperNavigation" class="row mx-0 flex-grow-0 shadow-sm">
                    <app-navbar class="px-0"></app-navbar>
                </section>
                <section id="mainRoot" class="row mx-0 flex-grow-1">
                    <div class="d-flex flex-column w-100 h-100 align-items-center justify-content-between">
                        <div id="displayArea" class="w-100 flex-grow-1 overflow-auto">
                            <div class="duplicate-notifier d-flex align-items-center justify-content-center h-100">
								<span>${Localize.translate("infoInitial.message")}</span>
							</div>
                        </div>
                        <app-footer class="w-100">
                        </app-footer>
                    </div>
                </section>
            </main>
        `;
	}

	connectedCallback(): void {
		console.info(AppRoot.welcomeMessage);
		initTooltips();
		ThemeManager.getInstance();
		new Localize().init();
		new CreateTemplate().initializeComponent(AppRoot.rootLayout(), this);
	}
	attributeChangedCallback(): void { }
	disconnectedCallback(): void {
		console.clear();
	}
}

export default AppRoot;
customElements.define("app-root", AppRoot);
