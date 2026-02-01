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

  create(context, callbacks = {}) {
    const rarityClass = this.rarity.toLowerCase();

    // CLONA TEMPLATE
    const $card = jQuery("#template_jolly_card").clone().removeAttr("id");

    // POPOLA DATI
    $card.addClass(`rarity-${rarityClass}`);
    $card.find(".jolly-name").text(this.name);
    $card.find(".jolly-placeholder").text(this.name.charAt(0));
    $card.find(".jolly-rarity").text(this.rarity);
    $card.find(".jolly-desc").text(this.description);

    const $btn = $card.find(".js-btn-action");

    if (context === "shop") {
      $btn.text(`COMPRA (${this.cost}$)`);
      $btn.addClass("btn-buy");
      $btn.on("click", () => {
        if (callbacks.onBuy) callbacks.onBuy(this);
      });
    } else {
      $btn.text(`VENDI (${this.sellValue}$)`);
      $btn.addClass("btn-sell");
      $btn.on("click", () => {
        if (callbacks.onSell) callbacks.onSell(this);
      });
    }

    return $card;
  }
}
