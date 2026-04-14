import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";
import de from "./_locales/de/messages.json";
// Languages
import en from "./_locales/en/messages.json";
import fr from "./_locales/fr/messages.json";
import tr from "./_locales/tr/messages.json";

export const defaultNS = "common";
export const resources = {
	en: { common: en }, tr: { common: tr },
	de: { common: de }, fr: { common: fr },
};

class Localize {
	private static readonly LANG_DETECTION_OPTIONS = {
		order: ["querystring", "navigator"],
		lookupQuerystring: "lng",
		lookupCookie: "i18next",
		lookupLocalStorage: "i18nextLng",
		caches: ["localStorage", "cookie"],
	};

	public init(): void {
		Localize.initI18n();
	}

	private static initI18n(): void {
		const storedLanguage = localStorage.getItem("i18nextLng") || "en";

		if (!["en", "tr"].includes(storedLanguage)) {
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
				supportedLngs: ["en", "tr", "de", "fr"],
				lng: storedLanguage,
				detection: Localize.LANG_DETECTION_OPTIONS,
				retryTimeout: 350,
				maxRetries: 5,
			});
	}

	public static translate(key: string): string {
		if (typeof key !== "string") {
			throw new Error("Input type for i18next localization must be string.");
		}
		return i18next.t(key);
	}
}

export default Localize;
