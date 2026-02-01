import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet.js";

export default class Uppers {
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
    this.dataList.forEach((entryName) => {
      this._createItem(entryName);
    });
  }

  _createItem(entryName) {
    const $el = jQuery("#template_list_entry").clone().removeAttr("id");
    const staticData = ScoreSheet.UPPERS_DATA.find((d) => d.entry === entryName);
    const displayName = staticData ? staticData.name : entryName;

    $el.find(".entry-name").text(displayName);
    $el.find(".entry-count").text("");

    this.$container.append($el);

    this.items.push({
      entry: entryName,
      clip: $el,
      consumed: false, // NUOVO
    });
  }

  getClip(entryName) {
    const found = this.items.find((item) => item.entry === entryName);
    return found ? found.clip : null;
  }

  // NUOVO METODO
  consume(entryName) {
    const item = this.items.find((item) => item.entry === entryName);
    if (item) {
      item.consumed = true;
    }
  }

  highlight(entryName, enable = true) {
    const item = this.items.find((i) => i.entry === entryName);
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
}
