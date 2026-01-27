import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class CardLower {
  // Aggiungiamo onSelect come terzo parametro
  constructor(matchData, allDiceObjects, onSelect) {
    this.matchData = matchData;
    this.allDiceObjects = allDiceObjects;
    this.onSelect = onSelect; // Salviamo il riferimento

    this.staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === matchData.category);
  }

  create() {
    if (!this.staticData) {
      console.error("Dati statici non trovati per", this.matchData.category);
      return jQuery("");
    }

    const $card = jQuery("#template_combo_card").clone().removeAttr("id");

    $card.find(".card-title").text(this.staticData.name);
    $card.find(".card-type").text("LOWER");
    $card.find(".js-lvl").text("1");
    $card.find(".js-desc").text(this.staticData.description);

    // Mostriamo i valori base. Il calcolo vero lo faremo nel Round.
    $card.find(".js-chips").text(this.staticData.baseChips);
    $card.find(".js-mult").text(this.staticData.baseMult);

    // Gestione Click
    $card.find(".js-btn-action").on("click", () => {
      // Chiamiamo la funzione del Round passando i dati e i dati statici
      if (this.onSelect) {
        this.onSelect(this.matchData, this.staticData, $card);
      }
    });

    this._renderMiniDice($card);

    return $card;
  }

  _renderMiniDice($card) {
    // Creiamo il contenitore per i dadi mini
    const $miniContainer = jQuery('<div class="mini-dice-container"></div>');
    const winIndices = this.matchData.indices || [];

    this.allDiceObjects.forEach((diceObj, index) => {
      const $clone = diceObj.element.clone();
      $clone.find(".btn-hold").remove();
      $clone.removeAttr("id");
      $clone.find("*").removeAttr("id");
      $clone.removeAttr("style");
      $clone.find("*").removeAttr("style");

      if (winIndices.includes(index)) {
        $clone.find(".dice").addClass("dice-highlight");
      } else {
        // Opzionale: rendi i dadi non usati semi-trasparenti
        // $clone.css("opacity", "0.3");
      }
      $miniContainer.append($clone);
    });
    $card.find(".card-values").after($miniContainer);
  }
}
