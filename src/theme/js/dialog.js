(function () {
    function target(el) {
        var sel = el.getAttribute("data-dialog");
        return sel ? document.querySelector(sel) : el.closest("dialog");
    }

    document.addEventListener("click", function (e) {
        var opener = e.target.closest("[data-dialog]");
        if (opener) {
            var dlg = target(opener);
            if (dlg && typeof dlg.showModal === "function") {
                e.preventDefault();
                dlg.showModal();
            }
            return;
        }
        var closer = e.target.closest("[data-dialog-close]");
        if (closer) {
            var d = closer.closest("dialog");
            if (d) {
                e.preventDefault();
                d.close(closer.getAttribute("data-dialog-close") || "");
            }
        }
    });

    document.addEventListener("click", function (e) {
        var dlg = e.target;
        if (
            dlg.nodeName === "DIALOG" &&
            dlg.open &&
            dlg.hasAttribute("data-dialog-light-dismiss")
        ) {
            var r = dlg.getBoundingClientRect();
            var inside =
                e.clientX >= r.left &&
                e.clientX <= r.right &&
                e.clientY >= r.top &&
                e.clientY <= r.bottom;
            if (!inside) dlg.close();
        }
    });
})();
