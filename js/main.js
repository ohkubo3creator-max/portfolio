/* =========================================================
   大久保 翔啓 / Shokei — Portfolio interactions
   ビルドなしの静的サイトのため、型は JSDoc で付与
   （TypeScript 相当の補完・型チェックをエディタ上で得る）
   ========================================================= */
(function () {
  "use strict";

  /**
   * フッターの著作権表記に現在の年を反映する。
   * 対象要素（#year）が無ければ何もしない。
   * @returns {void}
   */
  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /**
   * スクロールに応じて `.fade` 要素を順次フェードインさせる。
   * IntersectionObserver 非対応環境では全要素を即時表示にフォールバックする。
   * @returns {void}
   */
  function initScrollFade() {
    /** @type {NodeListOf<HTMLElement>} */
    var faders = document.querySelectorAll(".fade");

    // フォールバック：監視APIが無ければアニメーションせず即時表示
    if (!("IntersectionObserver" in window)) {
      faders.forEach(function (el) { el.classList.add("show"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        obs.unobserve(entry.target); // 一度表示したら監視解除（再発火を防ぐ）
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    faders.forEach(function (el) { observer.observe(el); });
  }

  initFooterYear();
  initScrollFade();
})();
