import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class CardUpper {
  /**
   * @param {Object} matchData - { category, score, tier }
   */
  constructor(matchData) {
    this.matchData = matchData;

    // Recupera i dati statici
    this.staticData = ScoreSheet.UPPERS_DATA.find((d) => d.entry === matchData.category);
  }

  create() {
    if (!this.staticData) return jQuery("");

    // 1. Clona il template
    const $card = jQuery("#template_combo_card").clone().removeAttr("id");

    // 2. Aggiungi una classe specifica per lo stile (es. header grigio diverso)
    $card.addClass("card-upper");

    // 3. Calcolo testi in base al Tier
    // matchData.tier è 0 o 1.
    // Tier 0 -> Label "Tier 1" -> Descrizione tier0
    // Tier 1 -> Label "Tier 2" -> Descrizione tier1
    const displayTier = this.matchData.tier + 1;
    const descriptionText = this.matchData.tier === 1 ? this.staticData.tier1 : this.staticData.tier0;

    // 4. Popola Header
    $card.find(".card-title").text(this.staticData.name);
    $card.find(".card-type").text("UPPER"); // Label Type

    // 5. Popola Body
    // Sostituiamo "Level" con "Tier" nella label se vuoi, o usiamo la struttura esistente
    $card.find(".card-info").html(`Tier <span class="js-lvl">${displayTier}</span>`);

    // Valori: Le Upper solitamente non danno Molt, ma danno Chips (somma dadi) + Effetto
    // Nascondiamo la riga del Molt se è 0 o non pertinente, oppure lasciamo standard
    $card.find(".js-chips").text(this.matchData.score);
    $card.find(".js-mult").parent().hide(); // Nascondiamo il moltiplicatore per le Upper se non serve

    // Descrizione dell'effetto speciale
    $card.find(".js-desc").text(descriptionText);

    // 6. Pulsante AZIONE
    const $btn = $card.find(".js-btn-action");

    // *** MODIFICA: Testo specifico per Upper ***
    $btn.text("OTTIENI");

    $btn.on("click", () => {
      console.log(`Ottieni Upper: ${this.staticData.name} (Tier ${displayTier})`);
      // Qui aggiungeremo la logica di gioco
    });

    return $card;
  }
}
