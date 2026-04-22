import type { TranslationKey } from "./ts/interfaces/iFaces";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";
import es from "./_locales/es/messages.json";
import en from "./_locales/en/messages.json";
import de from "./_locales/de/messages.json";
import fr from "./_locales/fr/messages.json";
import tr from "./_locales/tr/messages.json";

export const resources = {
	en: { common: en },
	tr: { common: tr },
	de: { common: de },
	fr: { common: fr },
	es: { common: es },
};

class Localize {
	private static readonly SUPPORTED_LANGS: Array<string> = [
		"en",
		"tr",
		"de",
		"fr",
		"es",
	];
	private static readonly LANG_DETECTION_OPTIONS = {
		order: ["querystring", "navigator"],
		lookupQuerystring: "lng",
		lookupCookie: "i18next",
		lookupLocalStorage: "i18nextLng",
		caches: ["localStorage", "cookie"],
	};

	public init(): void {
		Localize.initI18n();
		Localize.attachLanguageButtons();
	}

	private static initI18n(): void {
		const stored = localStorage.getItem("i18nextLng") ?? "en";

		if (!Localize.SUPPORTED_LANGS.includes(stored)) {
			localStorage.setItem("i18nextLng", "en");
		}

		i18next
			.use(XHR)
			.use(LanguageDetector)
			.init({
				load: "languageOnly",
				debug: false,
				fallbackLng: "en",
				defaultNS: "common",
				ns: ["common"],
				resources,
				interpolation: { escapeValue: false },
				supportedLngs: ["en", "es", "tr", "de", "fr"],
				lng: stored,
				detection: Localize.LANG_DETECTION_OPTIONS,
				retryTimeout: 350,
				maxRetries: 5,
			});
	}

	// Actual translation method
	public static translate(key: TranslationKey): string {
		return i18next.t(key);
	}

	private static attachLanguageButtons(): void {
		document.addEventListener("DOMContentLoaded", () => {
			const elements = document.querySelectorAll("[data-language]",) as NodeListOf<HTMLElement>;

			if (!elements) {
				console.error(`Unable to find language buttons`);
				return;
			}

			elements.forEach((element) => {
				element.addEventListener("click", (e) => {
					e.preventDefault();
					// Get data-language value
					const langToBeAppended = element.dataset.language;
					if (!langToBeAppended) {
						console.error("Unable to find new language key.");
					} else {
						Localize.setPageLanguage(langToBeAppended);
					}
				});
			});
		});
	}

	public static setPageLanguage(lang: string): void {
		if (!lang || !Localize.SUPPORTED_LANGS.includes(lang)) {
			console.error("Translation could not proceed without language key provided.",);
			return;
		}

		i18next
			.changeLanguage(lang)
			.then(() => {
				localStorage.setItem("i18nextLng", lang);

				if (typeof chrome !== "undefined") {
					// Send a message to our service worker to notify user about reloading the page.
					chrome.runtime.sendMessage({ type: "reloadTab" });
				} else {
					window.location.reload();
				}
			}).catch((err: unknown) => console.error("changeLanguage error:", err));
	}
}

export default Localize;