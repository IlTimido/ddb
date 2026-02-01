import jQuery from "jquery";

export default class BoosterPack {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.cost = data.cost;
    this.totalCards = data.totalCards;
    this.chooseCards = data.chooseCards;
    this.description = data.description;
  }

  create(buyCallback) {
    const typeClass = this.type === "jolly" ? "pack-jolly" : "pack-utility";

    // CLONA TEMPLATE
    const $pack = jQuery("#template_booster_pack").clone().removeAttr("id");

    // POPOLA DATI
    $pack.addClass(typeClass);
    $pack.find(".js-name").text(this.name);
    $pack.find(".js-count").text(`${this.totalCards} Carte`);

    const $btn = $pack.find(".js-btn-buy");
    $btn.text(`COMPRA (${this.cost}$)`);
    $btn.on("click", () => {
      if (buyCallback) buyCallback(this);
    });

    $pack.attr("title", this.description);
    return $pack;
  }
}
