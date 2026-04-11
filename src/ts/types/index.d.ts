declare module "*.scss" {
	const classes: { [key: string]: string };
	export default classes;
}

type TemplateOptions = {
	content: string;
	target: HTMLElement;
};

export type {
	TemplateOptions
}