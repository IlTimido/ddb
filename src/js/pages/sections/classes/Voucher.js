import jQuery from "jquery";

export default class Voucher {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.cost = data.cost;
    this.properties = data.properties;
  }

  create(context, callbacks = {}) {
    // CLONA TEMPLATE
    const $card = jQuery("#template_voucher_card").clone().removeAttr("id");

    // POPOLA DATI
    $card.find(".voucher-name").text(this.name);
    $card.find(".voucher-desc").text(this.description);

    const $footer = $card.find(".voucher-footer");

    if (context === "shop") {
      const $btn = jQuery('<button class="btn-voucher-action btn-buy"></button>');
      $btn.text(`COMPRA (${this.cost}$)`);
      $btn.on("click", () => {
        if (callbacks.onBuy) callbacks.onBuy(this);
      });
      $footer.append($btn);
    } else {
      const $lbl = jQuery('<div class="voucher-status">PERMANENTE</div>');
      $footer.append($lbl);
    }

    return $card;
  }
}
