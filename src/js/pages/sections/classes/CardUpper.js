import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class CardUpper {
  // Aggiungiamo onSelect
  constructor(matchData, onSelect) {
    this.matchData = matchData;
    this.onSelect = onSelect; // Salviamo

    this.staticData = ScoreSheet.UPPERS_DATA.find((d) => d.entry === matchData.category);
  }

  create() {
    if (!this.staticData) return jQuery("");

    const $card = jQuery("#template_combo_card").clone().removeAttr("id");
    $card.addClass("card-upper");

    const displayTier = this.matchData.tier + 1;
    const descriptionText = this.matchData.tier === 1 ? this.staticData.tier1 : this.staticData.tier0;

    $card.find(".card-title").text(this.staticData.name);
    $card.find(".card-type").text("UPPER");
    $card.find(".card-info").html(`Tier <span class="js-lvl">${displayTier}</span>`);

    $card.find(".js-chips").text(this.matchData.score);
    $card.find(".js-mult").parent().hide();
    $card.find(".js-desc").text(descriptionText);

    const $btn = $card.find(".js-btn-action");
    $btn.text("OTTIENI");

    // Gestione Click
    $btn.on("click", () => {
      if (this.onSelect) {
        this.onSelect(this.matchData, this.staticData, $card);
      }
    });

    return $card;
  }
}
