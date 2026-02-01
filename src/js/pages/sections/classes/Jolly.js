import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet";

export default class Jolly {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.rarity = data.rarity;
    this.description = data.description;
    this.cost = data.cost;
    this.sellValue = data.sellValue;
    this.properties = data.properties;
  }

  /**
   * Crea l'elemento HTML della card
   * @param {string} context - "shop" | "inventory"
   * @param {Object} callbacks - { onBuy, onSell }
   */
  create(context, callbacks = {}) {
    // <--- MODIFICATO
    const rarityClass = this.rarity.toLowerCase();

    const $card = jQuery(`
      <div class="jolly-card rarity-${rarityClass}">
        <div class="jolly-header">
            <span class="jolly-name">${this.name}</span>
        </div>
        <div class="jolly-art">
            <div class="jolly-placeholder">${this.name.charAt(0)}</div>
        </div>
        <div class="jolly-body">
            <div class="jolly-rarity">${this.rarity}</div>
            <div class="jolly-desc">${this.description}</div>
        </div>
        <div class="jolly-footer"></div>
      </div>
    `);

    const $footer = $card.find(".jolly-footer");
    const $btn = jQuery('<button class="btn-jolly-action"></button>');

    if (context === "shop") {
      $btn.text(`COMPRA (${this.cost}$)`);
      $btn.addClass("btn-buy");
      // FIX: Usiamo callbacks.onBuy
      $btn.on("click", () => {
        if (callbacks.onBuy) callbacks.onBuy(this);
      });
    } else {
      $btn.text(`VENDI (${this.sellValue}$)`);
      $btn.addClass("btn-sell");
      // FIX: Usiamo callbacks.onSell
      $btn.on("click", () => {
        if (callbacks.onSell) callbacks.onSell(this);
      });
    }

    $footer.append($btn);

    return $card;
  }
}
