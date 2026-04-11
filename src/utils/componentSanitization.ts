import type { Config } from "dompurify";
import DOMPurify from "dompurify";

class SanitizeInputHTML {
	private _sanitized: string;

	constructor(inputString: string) {
		this._sanitized = this.sanitize(inputString); // Final output
	}

	public getSanitized(): string {
		return this._sanitized;
	}

	private sanitize(input: string): string {
		if (!input) {
			console.error("Please provide string to be sanitized.");
			return "";
		}

		return SanitizeInputHTML.domPurify(input);
	}

	private static domPurify(str: string): string {
		if (!str) {
			console.error("String to be DOMPurified is missing.");
			return "";
		} else {
			try {
				const domSanitizeOptions: Config = {
					CUSTOM_ELEMENT_HANDLING: {
						tagNameCheck: /^[a-z]+-/,
						attributeNameCheck: /.*/,
						allowCustomizedBuiltInElements: true,
					},
				};

				const purified = DOMPurify.sanitize(str, domSanitizeOptions);
				return purified;
			} catch (error: unknown) {
				throw new Error(`Error while string sanitization:  ${error}`);
			}
		}
	}
}

export default SanitizeInputHTML;
