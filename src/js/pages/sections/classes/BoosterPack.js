import jQuery from "jquery";

export default class BoosterPack {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type; // 'utility' o 'jolly'
    this.cost = data.cost;
    this.totalCards = data.totalCards;
    this.chooseCards = data.chooseCards;
    this.description = data.description;
  }

  /**
   * Crea l'elemento HTML della bustina per lo shop
   * @param {Function} buyCallback - Funzione chiamata quando si clicca "COMPRA"
   */
  create(buyCallback) {
    const typeClass = this.type === "jolly" ? "pack-jolly" : "pack-utility";

    const $pack = jQuery(`
      <div class="booster-pack ${typeClass}">
        <div class="pack-wrapper">
            <div class="pack-top"></div> <div class="pack-body">
                <div class="pack-name">${this.name}</div>
                <div class="pack-info">
                    <span>${this.totalCards} Carte</span>
                </div>
            </div>
            <div class="pack-bottom"></div>
        </div>
        <div class="pack-footer"></div>
      </div>
    `);

    const $footer = $pack.find(".pack-footer");
    const $btn = jQuery('<button class="btn-pack-buy"></button>');
    $btn.text(`COMPRA (${this.cost}$)`);

    $btn.on("click", () => {
      if (buyCallback) buyCallback(this);
    });

    $footer.append($btn);

    // Tooltip semplice per la descrizione (opzionale, o visualizzato direttamente)
    $pack.attr("title", this.description);

    return $pack;
  }
}
