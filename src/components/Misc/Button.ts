import type { LifecycleCallbacks } from "../../ts/interfaces/iFaces";
import { createClassElement } from "../../utils/helpers";

class NavigationButton extends HTMLElement implements LifecycleCallbacks {
	private _buttonElement: HTMLElement | null = null;
	private _isSetUp: boolean = false;
	public static observedAttributes = [
		"class", "type", "role", "title", "style",
	];

	private create(): HTMLElement {
		if (!this._buttonElement) {
			this._buttonElement = createClassElement<HTMLElement>(this, HTMLElement) || document.createElement("button");
		}
		return this._buttonElement;
	}

	private props(): void {
		// Attributes
		const className = this.getAttribute("class");
		const role = this.getAttribute("role");
		const title = this.getAttribute("title");
		// Custom styles
		this.setAttribute("style", "cursor; pointer");

		try {
			const button = this.create();

			if (className) button.className = className;
			if (role) button.role = role;
			if (title) button.title = title;
		} catch (error: unknown) {
			throw new Error(`Error while creating class element: ${error}`);
		}
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

export default NavigationButton;
customElements.define("app-nav-button", NavigationButton);
