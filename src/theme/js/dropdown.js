(function () {
    var open = null;

    function panelFor(trigger) {
        var sel = trigger.getAttribute("data-menu");
        if (sel) return document.querySelector(sel);
        var anchor = trigger.closest(".menu-anchor, .popover-anchor");
        return anchor ? anchor.querySelector(".menu, .popover") : null;
    }

    function close() {
        if (!open) return;
        open.panel.hidden = true;
        open.trigger.setAttribute("aria-expanded", "false");
        open = null;
    }

    function show(trigger, panel) {
        close();
        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        open = { trigger: trigger, panel: panel };
        var first = panel.querySelector(
            "a, button:not([disabled]), [tabindex]"
        );
        if (first) first.focus();
    }

    document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-menu], [data-menu-toggle]");
        if (trigger) {
            var panel = panelFor(trigger);
            if (!panel) return;
            e.preventDefault();
            if (open && open.panel === panel) close();
            else show(trigger, panel);
            return;
        }
        if (open && !open.panel.contains(e.target)) close();
    });

    document.addEventListener("keydown", function (e) {
        if (!open) return;
        if (e.key === "Escape") {
            var t = open.trigger;
            close();
            t.focus();
            return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            var items = Array.prototype.slice.call(
                open.panel.querySelectorAll("a, button:not([disabled])")
            );
            if (!items.length) return;
            e.preventDefault();
            var i = items.indexOf(document.activeElement);
            var next = e.key === "ArrowDown" ? i + 1 : i - 1;
            if (next < 0) next = items.length - 1;
            if (next >= items.length) next = 0;
            items[next].focus();
        }
    });
})();
