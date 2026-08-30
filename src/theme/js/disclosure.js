(function () {
    document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-disclosure]");
        if (trigger) {
            var sel = trigger.getAttribute("data-disclosure");
            var target = sel
                ? document.querySelector(sel)
                : trigger.nextElementSibling;
            if (!target) return;
            e.preventDefault();
            var expanded = trigger.getAttribute("aria-expanded") === "true";
            trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
            target.hidden = expanded;
            return;
        }

        var all = e.target.closest("[data-accordion-toggle]");
        if (all) {
            var scope = all.closest("[data-accordion]") || document;
            var wantOpen =
                all.getAttribute("data-accordion-toggle") !== "close";
            scope
                .querySelectorAll("details.accordion__item, details")
                .forEach(function (d) {
                    d.open = wantOpen;
                });
        }
    });

    document.querySelectorAll("[data-disclosure]").forEach(function (trigger) {
        if (!trigger.hasAttribute("aria-expanded")) {
            var sel = trigger.getAttribute("data-disclosure");
            var target = sel
                ? document.querySelector(sel)
                : trigger.nextElementSibling;
            trigger.setAttribute(
                "aria-expanded",
                target && !target.hidden ? "true" : "false"
            );
        }
    });
})();
