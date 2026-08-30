(function () {
    function panels(tab) {
        var id = tab.getAttribute("aria-controls");
        return id ? document.getElementById(id) : null;
    }

    function activate(tab, tablist) {
        var tabs = tablist.querySelectorAll('[role="tab"]');
        for (var i = 0; i < tabs.length; i++) {
            var selected = tabs[i] === tab;
            tabs[i].setAttribute("aria-selected", selected ? "true" : "false");
            tabs[i].tabIndex = selected ? 0 : -1;
            var p = panels(tabs[i]);
            if (p) p.hidden = !selected;
        }
    }

    document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
        tablist.addEventListener("click", function (e) {
            var tab = e.target.closest('[role="tab"]');
            if (tab) {
                activate(tab, tablist);
                tab.focus();
            }
        });
        tablist.addEventListener("keydown", function (e) {
            var tabs = Array.prototype.slice.call(
                tablist.querySelectorAll('[role="tab"]')
            );
            var i = tabs.indexOf(document.activeElement);
            if (i < 0) return;
            var n = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown")
                n = (i + 1) % tabs.length;
            if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                n = (i - 1 + tabs.length) % tabs.length;
            if (e.key === "Home") n = 0;
            if (e.key === "End") n = tabs.length - 1;
            if (n === null) return;
            e.preventDefault();
            activate(tabs[n], tablist);
            tabs[n].focus();
        });
    });
})();
