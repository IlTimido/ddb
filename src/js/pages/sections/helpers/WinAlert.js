import jQuery from "jquery";

export default class WinAlert {
  /**
   * Mostra un messaggio informativo (Sostituisce alert)
   * @param {string} title - Titolo della finestra
   * @param {string} message - Messaggio
   * @param {Function} onClose - Callback opzionale quando si chiude
   */
  static show(title, message, onClose = null) {
    WinAlert._createModal(title, message, [
      {
        label: "OK",
        class: "btn-main",
        onClick: () => {
          if (onClose) onClose();
          return true; // Chiude il modale
        },
      },
    ]);
  }

  /**
   * Chiede conferma all'utente (Sostituisce confirm)
   * @param {string} title
   * @param {string} message
   * @param {Function} onConfirm - Callback eseguita SOLO se preme conferma
   */
  static ask(title, message, onConfirm) {
    WinAlert._createModal(title, message, [
      {
        label: "ANNULLA",
        class: "btn-main",
        style: "background:#ccc; border-color:#999; color:#333;", // Stile grigio per annulla
        onClick: () => true, // Chiude e basta
      },
      {
        label: "CONFERMA",
        class: "btn-main",
        onClick: () => {
          if (onConfirm) onConfirm();
          return true; // Chiude
        },
      },
    ]);
  }

  // Metodo privato per costruire l'HTML
  static _createModal(title, message, buttons) {
    const $overlay = jQuery('<div class="win-alert-overlay"></div>');
    const $box = jQuery('<div class="win-alert-box"></div>');

    // Header
    $box.append(`<div class="alert-header">${title}</div>`);

    // Body
    $box.append(`<div class="alert-body">${message}</div>`);

    // Footer (Bottoni)
    const $footer = jQuery('<div class="alert-footer"></div>');

    buttons.forEach((btnConfig) => {
      const $btn = jQuery(`<button class="${btnConfig.class}">${btnConfig.label}</button>`);
      if (btnConfig.style) $btn.attr("style", btnConfig.style);

      $btn.on("click", () => {
        const shouldClose = btnConfig.onClick();
        if (shouldClose) $overlay.remove();
      });

      $footer.append($btn);
    });

    $box.append($footer);
    $overlay.append($box);
    jQuery("body").append($overlay);
  }
}
