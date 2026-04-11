const tooltipTriggerList = document.querySelectorAll(
	'[data-bs-toggle="tooltip"]',
);
const _tooltipList = [...tooltipTriggerList].map(
	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);
