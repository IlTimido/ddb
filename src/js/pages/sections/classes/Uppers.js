import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js"; // Importiamo per accedere ai dati statici

export default class Uppers {
  /**
   * @param {jQuery} $context - Il contenitore principale dello Stage
   * @param {string[]} uppersList - Array di stringhe (es. ["UpperOnes", "UpperTwos"])
   */
  constructor($context, uppersList) {
    this.$context = $context;
    this.dataList = uppersList;

    this.$container = this.$context.find(".js-upper-list");
    this.items = [];
  }

  init() {
    this._render();
  }

  _render() {
    this.$container.empty();
    this.items = [];

    // Iteriamo sulla lista delle Upper possedute
    this.dataList.forEach((entryName) => {
      this._createItem(entryName);
    });
  }

  _createItem(entryName) {
    const $el = jQuery("#template_list_entry").clone().removeAttr("id");

    // --- MODIFICA 1: DECODIFICA NOME ---
    // Cerca l'oggetto corrispondente in ScoreSheet.UPPERS_DATA
    const staticData = ScoreSheet.UPPERS_DATA.find((d) => d.entry === entryName);

    // Se lo trova usa il .name (es. "Ones"), altrimenti usa l'ID grezzo come fallback
    const displayName = staticData ? staticData.name : entryName;

    $el.find(".entry-name").text(displayName);

    // Nelle Upper non mostriamo il contatore
    $el.find(".entry-count").text("");

    this.$container.append($el);

    this.items.push({
      entry: entryName,
      clip: $el,
    });
  }

  /**
   * Restituisce il clip jQuery associato al nome della entry
   * @param {string} entryName
   * @returns {jQuery|null}
   */
  getClip(entryName) {
    const found = this.items.find((item) => item.entry === entryName);
    return found ? found.clip : null;
  }

  // --- MODIFICA 2: GESTIONE HIGHLIGHT ---

  /**
   * Attiva o disattiva l'evidenziazione per una specifica entry
   * @param {string} entryName - L'ID della entry (es. ScoreSheet.UPPER_ONES)
   * @param {boolean} enable - true per accendere, false per spegnere
   */
  highlight(entryName, enable = true) {
    const item = this.items.find((i) => i.entry === entryName);
    if (item) {
      if (enable) {
        item.clip.addClass("highlight");
      } else {
        item.clip.removeClass("highlight");
      }
    }
  }

  /**
   * Rimuove l'evidenziazione da TUTTE le voci della lista
   */
  clearHighlights() {
    this.items.forEach((item) => {
      item.clip.removeClass("highlight");
    });
  }
}
