import jQuery from "jquery";

export default class WinAlert {
  static show(title, message, onClose = null) {
    WinAlert._createModal(title, message, [
      {
        label: "OK",
        class: "btn-main",
        onClick: () => {
          if (onClose) onClose();
          return true;
        },
      },
    ]);
  }

  static ask(title, message, onConfirm, onCancel = null) {
    WinAlert._createModal(title, message, [
      {
        label: "ANNULLA",
        class: "btn-main",
        style: "background:#ccc; border-color:#999; color:#333;",
        onClick: () => {
          if (onCancel) onCancel();
          return true;
        },
      },
      {
        label: "CONFERMA",
        class: "btn-main",
        onClick: () => {
          if (onConfirm) onConfirm();
          return true;
        },
      },
    ]);
  }

  static _createModal(title, message, buttons) {
    // CLONA TEMPLATE WIN ALERT
    const $overlay = jQuery("#template_win_alert").clone().removeAttr("id");

    $overlay.find(".js-title").text(title);
    $overlay.find(".js-message").html(message); // Usa html per supportare <br>

    const $footer = $overlay.find(".js-footer");

    buttons.forEach((btnConfig) => {
      const $btn = jQuery(`<button class="${btnConfig.class}">${btnConfig.label}</button>`);
      if (btnConfig.style) $btn.attr("style", btnConfig.style);

      $btn.on("click", () => {
        const shouldClose = btnConfig.onClick();
        if (shouldClose) $overlay.remove();
      });

      $footer.append($btn);
    });

    jQuery("body").append($overlay);
  }
}
