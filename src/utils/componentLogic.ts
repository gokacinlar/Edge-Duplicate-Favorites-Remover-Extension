import type * as type from "../ts/types/index";
import SanitizeInputHTML from "./componentSanitization";

class CreateTemplate {
	// Method to initialize component creation
	public initializeComponent(componentRoot: string, htmlTarget: HTMLElement) {
		const templateContent: string = componentRoot;
		const createTemplate = new CreateTemplate();

		createTemplate.create({
			content: templateContent,
			target: htmlTarget,
		});
	}

	// Method to create a template
	private create({
		content = "Put your DOM content here.",
		target,
	}: type.TemplateOptions) {
		if (typeof content !== "string" || !content.trim()) {
			throw new Error("Template content must be a non-empty string");
		}

		// Create a template node and append our content
		const template = document.createElement("template") as HTMLTemplateElement;
		const sanitizedContent = new SanitizeInputHTML(content).getSanitized();
		template.innerHTML = sanitizedContent;

		try {
			if (!content || !target) {
				throw new Error("Content or target does not exist.");
			}

			const fragment = template.content.cloneNode(true) as DocumentFragment;
			target.appendChild(fragment);
			return template;
		} catch (error: unknown) {
			throw new Error(
				`Unable to append template content as a web component: ${error}`,
			);
		}
	}
}

export default CreateTemplate;
