import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class Lowers {
  constructor($context, lowersList) {
    this.$context = $context;
    this.dataList = lowersList;
    this.$container = this.$context.find(".js-lower-list");
    this.items = [];
  }

  init() {
    this._render();
  }

  _render() {
    this.$container.empty();
    this.items = [];

    const counts = this.dataList.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    Object.keys(counts).forEach((entryName) => {
      const count = counts[entryName];
      this._createItem(entryName, count);
    });
  }

  _createItem(entryName, count) {
    const $el = jQuery("#template_list_entry").clone().removeAttr("id");
    const staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === entryName);
    const displayName = staticData ? staticData.name : entryName;

    // --- MODIFICA 1: GESTIONE INFINITO ---
    const isInfinite = staticData && staticData.infinite;

    $el.find(".entry-name").text(displayName);

    if (isInfinite) {
      // Usiamo l'entità HTML per l'infinito
      $el.find(".entry-count").html("(&infin;)");
    } else {
      $el.find(".entry-count").text(`(${count})`);
    }

    this.$container.append($el);

    this.items.push({
      entry: entryName,
      clip: $el,
      consumed: false,
      infinite: isInfinite, // Salviamo questa info per dopo
    });
  }

  getClip(entryName) {
    const found = this.items.find((item) => item.entry === entryName);
    return found ? found.clip : null;
  }

  // --- MODIFICA 2: IMPEDIRE IL CONSUMO ---
  consume(entryName) {
    const item = this.items.find((item) => item.entry === entryName);

    // Se è infinita (Chance), non facciamo nulla
    if (item && item.infinite) return;

    if (item) {
      // 1. Rimuoviamo UNA istanza dalla lista logica (dataList)
      const indexInData = this.dataList.indexOf(entryName);
      if (indexInData > -1) {
        this.dataList.splice(indexInData, 1);
      }

      // 2. Calcoliamo quante ne rimangono
      const remaining = this.dataList.filter((e) => e === entryName).length;

      // 3. Aggiorniamo il testo del contatore
      item.clip.find(".entry-count").text(`(${remaining})`);

      // 4. Logica di Disabilitazione
      if (remaining > 0) {
        // Se ne rimangono, la categoria è ancora VIVA
        item.consumed = false;
        // Assicuriamoci che non sia disabilitata visivamente
        item.clip.removeClass("disabled");
      } else {
        // Se sono finite, ORA la uccidiamo
        item.consumed = true;
        item.clip.addClass("disabled").removeClass("highlight");
      }
    }
  }

  highlight(entryName, enable = true) {
    const item = this.items.find((i) => i.entry === entryName);
    // highlight funziona solo se non consumato
    if (item && !item.consumed) {
      if (enable) item.clip.addClass("highlight");
      else item.clip.removeClass("highlight");
    }
  }

  clearHighlights() {
    this.items.forEach((item) => {
      item.clip.removeClass("highlight");
    });
  }

  // Metodo per aggiungere una categoria extra al volo
  addExtra(entryName) {
    // 1. Aggiungi ai dati logici
    this.dataList.push(entryName);

    // 2. Trova l'item UI
    const item = this.items.find((i) => i.entry === entryName);
    if (!item) return;

    // 3. Calcola nuovo totale
    const newCount = this.dataList.filter((c) => c === entryName).length;

    // 4. Aggiorna UI
    const $countEl = item.clip.find(".entry-count");
    $countEl.text(`(${newCount})`);

    // 5. ANIMAZIONE
    $countEl.removeClass("pop-green");
    void $countEl[0].offsetWidth;
    $countEl.addClass("pop-green");

    // 6. RIABILITAZIONE (Fix Scenario B)
    // Se il conteggio è > 0, dobbiamo assicurarci che la categoria sia ATTIVA
    if (newCount > 0) {
      item.consumed = false;
      item.clip.removeClass("disabled");
      // Nota: non aggiungiamo .highlight qui, quello lo farà il prossimo tiro di dadi
    }
  }
}
