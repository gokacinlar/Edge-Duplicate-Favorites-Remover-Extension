/**
 * This function creates a DOM-ready class element within a custom component to streamline element creation
 * @param target Usually the class instance/element itself: "this"
 * @param element Element itself
 * @param elementType Element's type
 */
export function createClassElement<T extends HTMLElement>(
	element: T | null | undefined,
	elementType: new () => T,
): T {
	if (!element) {
		return new elementType();
	}
	return element;
}

/**
 * This function checks and adjusts top upper right button icon's initial stage based on active theme
 * @param element
 * @param value
 * @param firstState
 * @param lastState
 */
export function adjustThemeIconState(
	element: HTMLElement,
	current: string,
	darkClass = "ri-moon-line",
	lightClass = "ri-sun-line"
) {
	try {
		if (!element) {
			throw new Error(`Unable to find ${element}. Aborting...`);
		}

		element.classList.remove(darkClass, lightClass);
		element.classList.add(current === "dark" ? darkClass : lightClass);
	} catch (error: unknown) {
		throw new Error(`Error while adjusting theme switch button icon: ${error}`);
	}
}
