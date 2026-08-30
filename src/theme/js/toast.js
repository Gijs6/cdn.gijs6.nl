(function () {
    var ICONS = {
        success: "M20 6 9 17l-5-5",
        danger: "M18 6 6 18M6 6l12 12",
        warning:
            "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01",
        info: "M12 16v-4M12 8h.01"
    };

    function tray() {
        var t = document.querySelector(".toaster");
        if (!t) {
            t = document.createElement("div");
            t.className = "toaster";
            t.setAttribute("aria-live", "polite");
            document.body.appendChild(t);
        }
        return t;
    }

    function dismiss(el) {
        el.classList.add("is-leaving");
        el.addEventListener("animationend", function () {
            el.remove();
        });
        setTimeout(function () {
            el.remove();
        }, 300);
    }

    function toast(message, opts) {
        opts = opts || {};
        var type = opts.type || "info";
        var el = document.createElement("div");
        el.className = "toast toast--" + type;
        el.setAttribute("role", "status");
        el.setAttribute("data-enter", "");

        if (ICONS[type]) {
            var svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            svg.setAttribute("class", "toast__icon");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("stroke-width", "2");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            var path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            path.setAttribute("d", ICONS[type]);
            svg.appendChild(path);
            el.appendChild(svg);
        }

        var body = document.createElement("div");
        body.className = "toast__body";
        body.textContent = message;
        el.appendChild(body);

        var close = document.createElement("button");
        close.type = "button";
        close.className = "toast__dismiss";
        close.setAttribute("aria-label", "Dismiss");
        close.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        close.addEventListener("click", function () {
            dismiss(el);
        });
        el.appendChild(close);

        tray().appendChild(el);

        var timeout = opts.timeout == null ? 5000 : opts.timeout;
        if (timeout)
            setTimeout(function () {
                dismiss(el);
            }, timeout);

        return el;
    }

    window.toast = toast;

    document
        .querySelectorAll(".toast[data-auto-dismiss]")
        .forEach(function (el) {
            var ms = parseInt(el.getAttribute("data-auto-dismiss"), 10) || 5000;
            setTimeout(function () {
                dismiss(el);
            }, ms);
            var b = el.querySelector(".toast__dismiss");
            if (b)
                b.addEventListener("click", function () {
                    dismiss(el);
                });
        });
})();
