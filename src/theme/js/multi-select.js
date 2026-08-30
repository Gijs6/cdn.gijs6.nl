(function () {
    function enhance(select) {
        if (select.dataset.enhanced) return;
        select.dataset.enhanced = "1";
        select.hidden = true;

        var options = Array.prototype.map.call(select.options, function (o) {
            return {
                value: o.value,
                label: o.textContent,
                selected: o.selected
            };
        });

        var root = document.createElement("div");
        root.className = "multi-select";

        var control = document.createElement("div");
        control.className = "multi-select__control";
        control.tabIndex = -1;

        var input = document.createElement("input");
        input.type = "text";
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-expanded", "false");
        input.placeholder = select.getAttribute("data-placeholder") || "";

        var menu = document.createElement("div");
        menu.className = "multi-select__menu";
        menu.hidden = true;

        control.appendChild(input);
        root.appendChild(control);
        root.appendChild(menu);
        select.parentNode.insertBefore(root, select.nextSibling);

        function sync() {
            Array.prototype.forEach.call(select.options, function (o) {
                var match = options.find(function (x) {
                    return x.value === o.value;
                });
                o.selected = match ? match.selected : false;
            });
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        function renderChips() {
            control
                .querySelectorAll(".multi-select__chip")
                .forEach(function (c) {
                    c.remove();
                });
            options
                .filter(function (o) {
                    return o.selected;
                })
                .forEach(function (o) {
                    var chip = document.createElement("span");
                    chip.className = "multi-select__chip";
                    chip.textContent = o.label;
                    var x = document.createElement("button");
                    x.type = "button";
                    x.className = "multi-select__chip-remove";
                    x.setAttribute("aria-label", "Remove " + o.label);
                    x.innerHTML =
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
                    x.addEventListener("click", function () {
                        o.selected = false;
                        renderChips();
                        renderMenu();
                        sync();
                    });
                    chip.appendChild(x);
                    control.insertBefore(chip, input);
                });
        }

        function renderMenu() {
            var q = input.value.toLowerCase();
            menu.innerHTML = "";
            options
                .filter(function (o) {
                    return o.label.toLowerCase().indexOf(q) > -1;
                })
                .forEach(function (o) {
                    var item = document.createElement("div");
                    item.className = "multi-select__option";
                    item.setAttribute("role", "option");
                    item.setAttribute(
                        "aria-selected",
                        o.selected ? "true" : "false"
                    );
                    item.textContent = o.label;
                    item.addEventListener("mousedown", function (e) {
                        e.preventDefault();
                        o.selected = !o.selected;
                        input.value = "";
                        renderChips();
                        renderMenu();
                        sync();
                    });
                    menu.appendChild(item);
                });
        }

        function openMenu() {
            menu.hidden = false;
            input.setAttribute("aria-expanded", "true");
            renderMenu();
        }
        function closeMenu() {
            menu.hidden = true;
            input.setAttribute("aria-expanded", "false");
        }

        control.addEventListener("click", function () {
            input.focus();
        });
        input.addEventListener("focus", openMenu);
        input.addEventListener("input", renderMenu);
        input.addEventListener("blur", function () {
            setTimeout(closeMenu, 120);
        });
        input.addEventListener("keydown", function (e) {
            if (e.key === "Backspace" && input.value === "") {
                var last = options
                    .filter(function (o) {
                        return o.selected;
                    })
                    .pop();
                if (last) {
                    last.selected = false;
                    renderChips();
                    renderMenu();
                    sync();
                }
            }
            if (e.key === "Escape") closeMenu();
        });

        renderChips();
    }

    document
        .querySelectorAll("select[multiple][data-multi-select]")
        .forEach(enhance);
})();
