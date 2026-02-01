import jQuery from "jquery";
import WinAlert from "../helpers/WinAlert";

export default class Utility {
  constructor(data) {
    this.id = data.id || "util_" + Date.now();
    this.name = data.name;
    this.description = data.description;
    this.tier = data.tier !== undefined ? data.tier : 0;
    this.cost = data.cost || 0;
    this.sellValue = data.sellValue || 0;
    this.category = data.category || null;
    this.effectType = data.effectType || null;
    this.effectVal = data.effectVal || 0;
    this.accumulatedValue = data.accumulatedValue || 0;
    this.durationType = data.durationType || (this.tier === 0 ? "round" : "stage");
  }

  create(context, callbacks = {}) {
    const displayTier = this.tier + 1;
    const fullTitle = `${this.name} - Tier ${displayTier}`;
    const tierClass = this.tier === 0 ? "tier-0" : "tier-1";

    // CLONA TEMPLATE
    const $el = jQuery("#template_mini_card").clone().removeAttr("id");

    // POPOLA DATI
    $el.find(".mini-header").addClass(tierClass).text(fullTitle);
    $el.find(".mini-desc").text(this.description);

    // GESTIONE VALORE DINAMICO
    const $dynamicVal = $el.find(".js-dynamic-val");
    let dynamicValueHtml = "";
    const baseStyle = "margin-bottom:5px; font-weight:900; font-size:12px; padding:2px; border-radius:4px; border:1px solid";

    if (this.accumulatedValue > 0 && this.category !== "UpperTwos") {
      dynamicValueHtml = `<div style="${baseStyle} #D32F2F; color:#D32F2F;">+${this.accumulatedValue} Chips</div>`;
    } else if (this.category === "UpperTwos") {
      dynamicValueHtml = `<div style="${baseStyle} #DAA520; color:#FFD700; background:#FFF8E1; color:#B8860B;">Valore: ${this.accumulatedValue}$</div>`;
    } else if (this.effectType === "add_mult") {
      dynamicValueHtml = `<div style="${baseStyle} #D32F2F; color:#D32F2F;">+${this.effectVal} Mult</div>`;
    } else if (this.effectType === "add_chips") {
      dynamicValueHtml = `<div style="${baseStyle} #2E7D32; color:#2E7D32;">+${this.effectVal} Chips</div>`;
    }

    $dynamicVal.html(dynamicValueHtml);

    const $footer = $el.find(".js-footer");

    // PULSANTI
    if (context === "shop") {
      const $btn = jQuery(`<button class="btn-mini-use btn-buy">COMPRA (${this.cost}$)</button>`);
      $btn.on("click", () => {
        if (callbacks.onBuy) callbacks.onBuy(this);
      });
      $footer.append($btn);
    } else if (context === "inventory") {
      const $btnUse = jQuery('<button class="btn-mini-use">USA</button>');
      $btnUse.on("click", () => {
        if (callbacks.onUse) callbacks.onUse(this);
      });
      $footer.append($btnUse);

      const $btnSell = jQuery(`<button class="btn-mini-use" style="background:#D32F2F; margin-top:2px;">VENDI (${this.sellValue}$)</button>`);
      $btnSell.on("click", () => {
        WinAlert.ask("VENDITA", `Vendi <b>${this.name}</b> per <b>${this.sellValue}$</b>?`, () => {
          if (callbacks.onSell) callbacks.onSell(this);
        });
      });
      $footer.append($btnSell);
    } else if (context === "active" && this.category === "UpperTwos") {
      const $btnSell = jQuery('<button class="btn-mini-use" style="background:#D32F2F;">INCASSA</button>');
      $btnSell.on("click", () => {
        WinAlert.ask("INCASSARE", `Incassi investimento: <b>${this.accumulatedValue}$</b>?`, () => {
          if (callbacks.onSell) callbacks.onSell(this);
        });
      });
      $footer.append($btnSell);
    }

    if (context === "active") $el.addClass("active-effect");
    return $el;
  }
}
