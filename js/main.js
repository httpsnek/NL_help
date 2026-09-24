(function () {
  "use strict";

  // Контакты — поменять здесь, когда клиент пришлёт реальные
  var CONTACTS = {
    phone: "31600000000",   // без + и пробелов
    telegram: "nlassist"    // username без @
  };

  var STORAGE_KEY = "nlassist-lang";
  var nodes = document.querySelectorAll("[data-i18n]");

  // Русский — из разметки
  var RU = Object.assign({}, window.I18N_RU_EXTRA);
  nodes.forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (!(key in RU)) RU[key] = el.innerHTML;
  });
  var DICT = { ru: RU, uk: window.I18N_UK };

  var currentLang = "ru";
  var currentTopic = null;

  function t(key) {
    return (DICT[currentLang] && DICT[currentLang][key]) || RU[key] || "";
  }

  function readLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ru" || saved === "uk") return saved;
    } catch (e) {}
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("uk") === 0 ? "uk" : "ru";
  }

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    nodes.forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll(".lang__btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    updateMessengerLinks();
  }

  // Текст ситуации подставляется в первое сообщение (WhatsApp и Telegram поддерживают ?text=)
  function updateMessengerLinks() {
    var topicText = currentTopic ? t(currentTopic) : "";
    var message = topicText ? t("ct.greeting") + " " + topicText : t("ct.greeting.empty");
    var encoded = encodeURIComponent(message);

    document.querySelectorAll('[data-msg="wa"]').forEach(function (a) {
      a.href = "https://wa.me/" + CONTACTS.phone + "?text=" + encoded;
    });
    document.querySelectorAll('[data-msg="tg"]').forEach(function (a) {
      a.href = "https://t.me/" + CONTACTS.telegram + "?text=" + encoded;
    });

    var box = document.querySelector(".contact__topic");
    if (box) {
      box.hidden = !topicText;
      box.querySelector(".contact__topic-text").textContent = topicText;
    }
  }

  document.querySelectorAll(".lang__btn").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
  });

  document.querySelectorAll("[data-topic]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      currentTopic = chip.getAttribute("data-topic");
      updateMessengerLinks();
    });
  });

  var year = document.querySelector(".js-year");
  if (year) year.textContent = new Date().getFullYear();

  setLang(readLang());
})();
