import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class CardLower {
  /**
   * @param {Object} matchData - Dati dal calcolatore { category, score, indices }
   * @param {Object[]} allDiceObjects - Array originale dei dadi [{dice: Obj, element: jQuery}]
   */
  constructor(matchData, allDiceObjects) {
    this.matchData = matchData;
    this.allDiceObjects = allDiceObjects;

    // Recupera i dati statici (mult, chips base, nome)
    this.staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === matchData.category);
  }

  create() {
    if (!this.staticData) {
      console.error("Dati statici non trovati per", this.matchData.category);
      return jQuery("");
    }

    // 1. Clona il template
    const $card = jQuery("#template_combo_card").clone().removeAttr("id");

    // 2. Popola Testi
    $card.find(".card-title").text(this.staticData.name);
    $card.find(".card-type").text("LOWER");
    $card.find(".js-lvl").text("1");
    $card.find(".js-desc").text(this.staticData.description);

    // Chips e Mult (Base)
    // Nota: qui metto i baseChips statici. Se vuoi sommare il punteggio dei dadi
    // ai chips, modifica qui sotto: this.staticData.baseChips + this.matchData.score
    $card.find(".js-chips").text(this.staticData.baseChips);
    $card.find(".js-mult").text(this.staticData.baseMult);

    // 3. Gestione Pulsante USA
    $card.find(".js-btn-action").on("click", () => {
      console.log(`Usato: ${this.staticData.name}`);
      // Qui emetteremo un evento o chiameremo una callback per dire al Round che è finita
      // es. document.dispatchEvent(new CustomEvent('card-selected', { detail: this.matchData }));
    });

    // 4. MINIATURA DADI (Il punto B)
    this._renderMiniDice($card);

    return $card;
  }

  _renderMiniDice($card) {
    // Creiamo il contenitore per i dadi mini
    const $miniContainer = jQuery('<div class="mini-dice-container"></div>');

    // Iteriamo sui dadi originali per clonarli
    this.allDiceObjects.forEach((diceObj, index) => {
      // diceObj.element è il wrapper .dice-wrapper esistente
      // Lo cloniamo
      const $clone = diceObj.element.clone();

      // PULIZIA PROFONDA
      $clone.find(".btn-hold").remove();
      $clone.removeAttr("id"); // Rimuovi ID dal wrapper
      $clone.find("*").removeAttr("id"); // Rimuovi ID dai figli

      // Rimuovi eventuali stili inline che jQuery potrebbe aver aggiunto (es. display: none/block)
      $clone.removeAttr("style");
      $clone.find("*").removeAttr("style");

      // Verifica se questo indice è tra quelli vincenti
      if (this.matchData.indices.includes(index)) {
        // Applica classe per evidenziare (sul div .dice o sul pre)
        $clone.find(".dice").addClass("dice-highlight");
      }

      $miniContainer.append($clone);
    });

    // Appendiamo il mini container nel corpo della card, prima della descrizione
    // o dopo i valori, a tua scelta. Qui lo metto dopo i valori.
    $card.find(".card-values").after($miniContainer);
  }
}
