(function () {
    function button(el) {
        if (el.matches("button, input[type=submit]")) return el;
        return el.querySelector(
            "button[type=submit], button:not([type]), input[type=submit]"
        );
    }

    function ask(question, el, onConfirm) {
        var trigger = button(el) || el;
        var split = question.indexOf("? ");
        var title = split === -1 ? question : question.slice(0, split + 1);
        var detail = split === -1 ? "" : question.slice(split + 2);

        var dlg = document.createElement("dialog");
        dlg.className = "dialog";
        dlg.setAttribute("aria-labelledby", "confirm-title");

        var head = document.createElement("div");
        head.className = "dialog__head";
        var h2 = document.createElement("h2");
        h2.id = "confirm-title";
        h2.textContent = title;
        head.appendChild(h2);
        dlg.appendChild(head);

        if (detail) {
            var body = document.createElement("div");
            body.className = "dialog__body";
            var p = document.createElement("p");
            p.textContent = detail;
            body.appendChild(p);
            dlg.appendChild(body);
        }

        var actions = document.createElement("div");
        actions.className = "dialog__actions";
        var cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "btn";
        cancel.textContent = "Cancel";
        var ok = document.createElement("button");
        ok.type = "button";
        ok.className = trigger.classList.contains("btn--danger")
            ? "btn btn--danger"
            : "btn";
        ok.textContent =
            el.getAttribute("data-confirm-action") ||
            (trigger.value && trigger.tagName === "INPUT"
                ? trigger.value
                : trigger.textContent.trim());
        actions.appendChild(cancel);
        actions.appendChild(ok);
        dlg.appendChild(actions);

        cancel.addEventListener("click", function () {
            dlg.close();
        });
        ok.addEventListener("click", function () {
            dlg.close();
            onConfirm();
        });
        dlg.addEventListener("close", function () {
            dlg.remove();
        });

        document.body.appendChild(dlg);
        dlg.showModal();
        ok.focus();
    }

    document.addEventListener("htmx:confirm", function (e) {
        if (!e.detail.question) return;
        e.preventDefault();
        ask(e.detail.question, e.detail.elt, function () {
            e.detail.issueRequest(true);
        });
    });

    document.addEventListener(
        "submit",
        function (e) {
            var form = e.target;
            var question = form.getAttribute("data-confirm");
            if (!question || form.hasAttribute("data-confirmed")) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            var submitter = e.submitter;
            ask(question, submitter || form, function () {
                form.setAttribute("data-confirmed", "");
                form.requestSubmit(submitter);
                form.removeAttribute("data-confirmed");
            });
        },
        true
    );
})();
