(function () {
    document.querySelectorAll(".tooltip[data-tooltip]").forEach(function (el) {
        if (
            !el.hasAttribute("tabindex") &&
            !/^(a|button|input|select|textarea)$/i.test(el.nodeName)
        ) {
            el.tabIndex = 0;
        }
        if (!el.hasAttribute("aria-label")) {
            el.setAttribute("aria-label", el.getAttribute("data-tooltip"));
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        var active = document.activeElement;
        if (
            active &&
            active.matches &&
            active.matches(".tooltip[data-tooltip]")
        )
            active.blur();
    });
})();
