document.addEventListener("DOMContentLoaded", () => {
	const nav = document.querySelector(".site-nav");
	if (nav) {
		const updateNavOffset = () => {
			document.documentElement.style.setProperty("--nav-height", `${Math.ceil(nav.getBoundingClientRect().height)}px`);
		};

		updateNavOffset();
		window.addEventListener("load", updateNavOffset);
		window.addEventListener("resize", updateNavOffset);

		if ("ResizeObserver" in window) {
			const resizeObserver = new ResizeObserver(updateNavOffset);
			resizeObserver.observe(nav);
		}

		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(updateNavOffset).catch(() => {});
		}

		const navMenu = document.getElementById("siteNav");
		if (navMenu) {
			navMenu.addEventListener("shown.bs.collapse", updateNavOffset);
			navMenu.addEventListener("hidden.bs.collapse", updateNavOffset);
		}
	}

	const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
	if (revealItems.length) {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		revealItems.forEach((item, index) => {
			item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
			observer.observe(item);
		});
	}

	document.querySelectorAll("[data-schedule-group]").forEach(group => {
		const buttons = Array.from(group.querySelectorAll("[data-schedule-target]"));
		const panels = Array.from(group.querySelectorAll("[data-schedule-panel]"));

		const activatePanel = panelId => {
			buttons.forEach(button => {
				const isActive = button.dataset.scheduleTarget === panelId;
				button.setAttribute("aria-pressed", String(isActive));
			});

			panels.forEach(panel => {
				panel.hidden = panel.dataset.schedulePanel !== panelId;
			});
		};

		buttons.forEach(button => {
			button.addEventListener("click", () => activatePanel(button.dataset.scheduleTarget));
		});

		const defaultPanel = buttons.find(button => button.getAttribute("aria-pressed") === "true");
		if (defaultPanel) {
			activatePanel(defaultPanel.dataset.scheduleTarget);
		}
	});
});
