(function () {
    function text(trigger) {
        if (
            trigger.hasAttribute("data-copy") &&
            trigger.getAttribute("data-copy")
        ) {
            return trigger.getAttribute("data-copy");
        }
        var sel = trigger.getAttribute("data-copy-target");
        var node = sel ? document.querySelector(sel) : null;
        if (node)
            return node.value != null && node.tagName === "INPUT"
                ? node.value
                : node.textContent.trim();
        return "";
    }

    function flash(trigger) {
        var label = trigger.getAttribute("data-copy-done") || "copied";
        var prev = trigger.getAttribute("data-label-prev");
        if (prev === null)
            trigger.setAttribute("data-label-prev", trigger.textContent);
        var original = trigger.getAttribute("data-label-prev");
        trigger.textContent = label;
        trigger.classList.add("is-copied");
        setTimeout(function () {
            trigger.textContent = original;
            trigger.classList.remove("is-copied");
        }, 1400);
    }

    document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-copy], [data-copy-target]");
        if (!trigger) return;
        var value = text(trigger);
        if (!value) return;
        e.preventDefault();
        var done = function () {
            if (window.toast && trigger.hasAttribute("data-copy-toast")) {
                window.toast(
                    trigger.getAttribute("data-copy-toast") ||
                        "Copied to clipboard",
                    { type: "success" }
                );
            } else {
                flash(trigger);
            }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(done, function () {});
        } else {
            var ta = document.createElement("textarea");
            ta.value = value;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
                done();
            } catch (err) {}
            ta.remove();
        }
    });
})();
