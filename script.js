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

});
