import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import { createClassElement } from "../../utils/helpers";

class Button extends HTMLElement implements LifecycleCallbacks {
	private _buttonElement: HTMLElement | null = null;
	private _isSetUp: boolean = false;
	private _originalInnerHTML: string | null = null;

	public static observedAttributes = [
		"class", "href", "type", "role", "title", "hasText", "isExpandable"
	];

	private create(): HTMLElement {
		if (!this._buttonElement) {
			this._buttonElement = createClassElement<HTMLElement>(this, HTMLElement) || document.createElement("button");
			this._originalInnerHTML = this._buttonElement.innerHTML;
		}
		return this._buttonElement;
	}

	private props(): void {
		// Attributes
		const className = this.getAttribute("class");
		const href = this.getAttribute("href");
		const type = this.getAttribute("type");
		const role = this.getAttribute("role");
		const title = this.getAttribute("title");
		const hasText = this.getAttribute("hasText");
		// Element props
		try {
			const button = this.create();

			if (className) button.className = className;
			if (title) button.title = title;
			if (type) button.setAttribute("type", type);
			if (role) button.setAttribute("role", role);
			if (href) button.setAttribute("href", href);
			if (hasText) {
				const original = this._originalInnerHTML ?? button.innerHTML;
				button.innerHTML = hasText + original;
			};
		} catch (error: unknown) {
			throw new Error(`Error while creating class element: ${error}`);
		}
	}

	private static watchForHoverToExpandButton(): CustomEvent {
		return new CustomEvent("button-element-expanding", {
			bubbles: true,
			cancelable: true,
			detail: "This event listens for if app-button has an expandable state."
		});
	}

	connectedCallback(): void {
		if (!this._isSetUp) {
			this.props();
			const button = this.create();

			if (!this.contains(button)) {
				this.appendChild(button);
			}

			this._isSetUp = true;
		}

		// Event dispatch
		this.dispatchEvent(Button.watchForHoverToExpandButton());
	}

	disconnectedCallback(): void {
		if (this._isSetUp && this._buttonElement) {
			this._isSetUp = false;
		}
	}

	attributeChangedCallback(
		_name: string,
		oldValue: string,
		newValue: string,
	): void {
		if (this.isConnected && oldValue !== newValue) {
			this.props();
		}
	}
}

export default Button;
customElements.define("app-button", Button);
