//***BACKGROUND, a.k.a SERVICE WORKER ***/

// Wait for our i18next page translation command and if it exists
// Reload the tab.
chrome.runtime.onMessage.addListener((msg, sender, _respond): boolean => {
	if (msg.type === "reloadTab" && sender.tab?.id) {
		chrome.tabs.reload(sender.tab.id);
	}
	return true;
});
