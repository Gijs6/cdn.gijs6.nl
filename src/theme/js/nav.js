(function () {
    var page = document.querySelector(".page--sidebar.is-drawer");
    if (!page) return;

    var toggle = document.querySelector(".app-bar__menu-toggle");
    var aside = page.querySelector(".page__aside");
    if (!aside) return;

    var backdrop = page.querySelector(".page__backdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "page__backdrop";
        page.appendChild(backdrop);
    }

    function set(openState) {
        page.classList.toggle("is-open", openState);
        if (toggle)
            toggle.setAttribute("aria-expanded", openState ? "true" : "false");
        document.body.style.overflow = openState ? "hidden" : "";
    }

    if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", function () {
            set(!page.classList.contains("is-open"));
        });
    }
    backdrop.addEventListener("click", function () {
        set(false);
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && page.classList.contains("is-open"))
            set(false);
    });
    aside.addEventListener("click", function (e) {
        if (e.target.closest("a")) set(false);
    });
    var mq = window.matchMedia("(min-width: 48rem)");
    mq.addEventListener("change", function (e) {
        if (e.matches) set(false);
    });
})();
