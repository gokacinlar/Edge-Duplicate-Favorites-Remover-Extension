// Assets (bootstrap, fonts, images etc.)
import "./assets/assets";
// Interfaces
import "./ts/interfaces/iFaces";
// Components
import "./components/Components";
// Service Worker
import "./worker";

class Main extends HTMLElement implements LifecycleCallbacks {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

export default Main;
customElements.define("medge-bm-main", Main);