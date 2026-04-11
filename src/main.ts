// Interfaces
import type { LifecycleCallbacks } from "./ts/interfaces/iFaces";
// Components
import "./components/Components";
// Service Worker
import "./worker";
// *** APP ***
import "./app/Root";
// Assets (bootstrap, fonts, images etc.)
import "./assets/assets";
// Utilities
import "./utils/bootstrapRelated";

class Main implements LifecycleCallbacks {
	attributeChangedCallback(): void { }
	connectedCallback(): void { }
	disconnectedCallback(): void { }
}

export default Main;
