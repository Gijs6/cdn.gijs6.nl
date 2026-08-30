(function () {
    function cellValue(row, index) {
        var cell = row.children[index];
        if (!cell) return "";
        var raw = cell.getAttribute("data-sort-value");
        if (raw === null) raw = cell.textContent.trim();
        var num = parseFloat(raw.replace(/[^0-9.eE+-]/g, ""));
        return raw !== "" && !isNaN(num) && /[0-9]/.test(raw)
            ? num
            : raw.toLowerCase();
    }

    document
        .querySelectorAll("table[data-sortable], .table[data-sortable]")
        .forEach(function (table) {
            var head = table.tHead;
            var body = table.tBodies[0];
            if (!head || !body) return;

            Array.prototype.forEach.call(
                head.rows[0].cells,
                function (th, index) {
                    if (th.hasAttribute("data-no-sort")) return;
                    th.style.cursor = "pointer";
                    if (!th.querySelector(".table__sort")) {
                        var btn = document.createElement("button");
                        btn.type = "button";
                        btn.className = "table__sort";
                        while (th.firstChild) btn.appendChild(th.firstChild);
                        btn.insertAdjacentHTML(
                            "beforeend",
                            ' <svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>'
                        );
                        th.appendChild(btn);
                    }

                    th.addEventListener("click", function () {
                        var current = th.getAttribute("aria-sort");
                        var dir =
                            current === "ascending"
                                ? "descending"
                                : "ascending";
                        Array.prototype.forEach.call(
                            head.rows[0].cells,
                            function (c) {
                                c.removeAttribute("aria-sort");
                            }
                        );
                        th.setAttribute("aria-sort", dir);

                        var rows = Array.prototype.slice.call(body.rows);
                        rows.sort(function (a, b) {
                            var va = cellValue(a, index);
                            var vb = cellValue(b, index);
                            if (va < vb) return dir === "ascending" ? -1 : 1;
                            if (va > vb) return dir === "ascending" ? 1 : -1;
                            return 0;
                        });
                        rows.forEach(function (r) {
                            body.appendChild(r);
                        });
                    });
                }
            );
        });
})();
