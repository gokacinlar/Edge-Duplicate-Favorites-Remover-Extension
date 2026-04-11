import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import { createClassElement } from "../../utils/helpers";

class DropDown extends HTMLElement implements LifecycleCallbacks {
    private _dropdownElement: HTMLElement | null = null;
    protected _isSetUp: boolean = false;
    public static observedAttributes = [
        "class"
    ];

    protected create(): HTMLElement {
        if (!this._dropdownElement) {
            this._dropdownElement = createClassElement<HTMLElement>(this, HTMLElement) || document.createElement("div");
        }
        return this._dropdownElement;
    }

    protected props(): void {
        const className = this.getAttribute("class");

        try {
            const div = this.create();
            if (className) div.className = className;
            div.appendChild(new DropDownButton());
        } catch (error: unknown) {
            throw new Error(`Error while creating class element: ${error}`);
        }
    }

    connectedCallback(): void {
        if (!this._isSetUp) {
            this.props();
            const div = this.create();

            if (!this.contains(div)) {
                this.appendChild(div);
            }

            this._isSetUp = true;
        }
    }

    attributeChangedCallback(): void { }
    disconnectedCallback(): void {
        if (this._isSetUp && this._dropdownElement) {
            this._isSetUp = false;
        }
    }
}

class DropDownButton extends DropDown implements LifecycleCallbacks {
    private dropDownButtonElement: HTMLElement | null = null;
    public static observedAttributes = [
        "class", "type", "data-bs-toggle", "aria-expanded"
    ];

    create(): HTMLElement {
        if (!this.dropDownButtonElement) {
            this.dropDownButtonElement = createClassElement<HTMLElement>(this, HTMLElement) || document.createElement("button");
        }
        return this.dropDownButtonElement;
    }

    props(): void {
        const className = this.getAttribute("class");
        const type = this.getAttribute("type");
        const dataBsToggle = this.getAttribute("data-bs-toggle");
        const ariaExpanded = this.getAttribute("aria-expanded");

        try {
            const div = this.create();
            if (className) div.className = className;
            if (type) div.setAttribute("type", type);
            if (dataBsToggle) div.setAttribute("data-bs-toggle", "dropdown");
            if (ariaExpanded) div.setAttribute("aria-expanded", "false");
        } catch (error: unknown) {
            throw new Error(`Error while creating class element: ${error}`);
        }
    }

    connectedCallback(): void { }
    attributeChangedCallback(): void { }
    disconnectedCallback(): void { }
}

export default DropDown;
customElements.define("app-dropdown", DropDown);