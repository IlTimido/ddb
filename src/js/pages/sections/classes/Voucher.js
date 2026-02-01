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
    // <--- MODIFICATO
    const $card = jQuery(`
      <div class="voucher-card">
        <div class="voucher-ticket-cutout"></div>
        <div class="voucher-header"><span class="voucher-name">${this.name}</span></div>
        <div class="voucher-body">
            <div class="voucher-icon">V</div>
            <div class="voucher-desc">${this.description}</div>
        </div>
        <div class="voucher-footer"></div>
      </div>
    `);

    const $footer = $card.find(".voucher-footer");

    if (context === "shop") {
      const $btn = jQuery('<button class="btn-voucher-action btn-buy"></button>');
      $btn.text(`COMPRA (${this.cost}$)`);

      // FIX: Usiamo callbacks.onBuy
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
