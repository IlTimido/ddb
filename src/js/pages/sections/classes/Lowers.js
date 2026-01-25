import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js"; // Importiamo per accedere ai dati statici

export default class Lowers {
  /**
   * @param {jQuery} $context - Il contenitore principale dello Stage (this.clip)
   * @param {string[]} lowersList - Array di stringhe (es. ["LowerChance", "LowerPair"])
   */
  constructor($context, lowersList) {
    this.$context = $context;
    this.dataList = lowersList;

    // Trova il contenitore specifico all'interno del contesto
    this.$container = this.$context.find(".js-lower-list");

    // Array dove salveremo gli oggetti { entry: "LowerPair", clip: jQueryObject }
    this.items = [];
  }

  init() {
    this._render();
  }

  _render() {
    // 1. Pulisce il contenitore
    this.$container.empty();
    this.items = [];

    // 2. Conta le occorrenze
    const counts = this.dataList.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    // 3. Itera sulle chiavi e crea i clip
    Object.keys(counts).forEach((entryName) => {
      const count = counts[entryName];
      this._createItem(entryName, count);
    });
  }

  _createItem(entryName, count) {
    // Clona il template
    const $el = jQuery("#template_list_entry").clone().removeAttr("id");

    // --- MODIFICA 1: DECODIFICA NOME ---
    // Cerca l'oggetto corrispondente in ScoreSheet.LOWERS_DATA
    const staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === entryName);

    // Se lo trova usa il .name (es. "Pair"), altrimenti usa l'ID grezzo come fallback
    const displayName = staticData ? staticData.name : entryName;

    // Popola i dati visivi
    $el.find(".entry-name").text(displayName);
    $el.find(".entry-count").text(`(${count})`);

    // Aggiunge al DOM
    this.$container.append($el);

    // Salva il riferimento
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
   * @param {string} entryName - L'ID della entry (es. ScoreSheet.LOWER_PAIR)
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
