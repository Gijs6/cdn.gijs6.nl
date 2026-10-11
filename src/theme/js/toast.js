(function () {
    var TYPES = {
        success: "success",
        warning: "warning",
        error: "danger",
        danger: "danger"
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

    function autoDismiss(el, ms) {
        if (ms)
            setTimeout(function () {
                el.remove();
            }, ms);
    }

    function toast(message, opts) {
        opts = opts || {};
        var el = document.createElement("div");
        el.className = "toast toast--" + (TYPES[opts.type] || "info");
        el.setAttribute("role", "status");

        var body = document.createElement("div");
        body.className = "toast__body";
        body.textContent = message;
        el.appendChild(body);

        var close = document.createElement("button");
        close.type = "button";
        close.className = "toast__dismiss";
        close.setAttribute("aria-label", "Dismiss");
        close.textContent = "×";
        el.appendChild(close);

        tray().appendChild(el);
        autoDismiss(el, opts.timeout == null ? 6000 : opts.timeout);
        return el;
    }

    function wire() {
        document
            .querySelectorAll(".toast[data-auto-dismiss]:not([data-wired])")
            .forEach(function (el) {
                el.setAttribute("data-wired", "");
                autoDismiss(
                    el,
                    parseInt(el.getAttribute("data-auto-dismiss"), 10) || 6000
                );
            });
    }

    window.toast = toast;

    document.addEventListener("click", function (e) {
        var button = e.target.closest && e.target.closest(".toast__dismiss");
        if (button) button.closest(".toast").remove();
    });

    document.addEventListener("toast", function (e) {
        (e.detail.messages || []).forEach(function (m) {
            toast(m.text, { type: m.type });
        });
    });

    function failed(message) {
        return function (e) {
            var target = e.detail.target || e.detail.elt;
            if (
                target &&
                target.closest &&
                target.closest("[data-error-inline]")
            )
                return;
            toast(message, { type: "danger" });
        };
    }

    document.addEventListener(
        "htmx:responseError",
        failed("Something went wrong on our end. Try again later.")
    );
    document.addEventListener(
        "htmx:sendError",
        failed(
            "Couldn't reach the server. Check your connection and try again."
        )
    );

    document.addEventListener("htmx:afterSettle", wire);
    wire();
})();
