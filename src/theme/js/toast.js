(function () {
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
        el.remove();
    }

    function toast(message, opts) {
        opts = opts || {};
        var type = opts.type || "info";
        var el = document.createElement("div");
        el.className = "toast toast--" + type;
        el.setAttribute("role", "status");

        var body = document.createElement("div");
        body.className = "toast__body";
        body.textContent = message;
        el.appendChild(body);

        var close = document.createElement("button");
        close.type = "button";
        close.className = "toast__dismiss";
        close.setAttribute("aria-label", "Dismiss");
        close.textContent = "\u00d7";
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
