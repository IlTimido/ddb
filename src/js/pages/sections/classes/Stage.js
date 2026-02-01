import WinAlert from "../helpers/WinAlert";
import Lowers from "./Lowers";
import Player from "./Player";
import Round from "./Round";
import ScoreSheet from "./ScoreSheet";
import StatsPanel from "./StatsPanel";
import Uppers from "./Uppers";
import jQuery from "jquery"; // Aggiunto import mancante se serve, o già presente

export default class Stage {
  clip = null;
  statsPanel = null;
  config = null;
  currentRoundIndex = -1;
  rounds = [];
  lowers = [];
  uppers = [];

  constructor(config) {
    this.config = config;
  }

  init() {
    this.createStageScreen();
    this.renderConsumables();
    this.renderActiveEffects();
    this.nextRound();
  }

  nextRound() {
    // --- 1. CLEANUP DEL ROUND PRECEDENTE ---
    this.clip.removeClass("input-locked");
    this.clip.find(".js-combinations-track").empty();
    this.clip.find(".js-dice-container").empty();

    this.lowers.clearHighlights();
    this.uppers.clearHighlights();

    const $btnRoll = this.clip.find(".js-btn-roll");
    $btnRoll.show();
    $btnRoll.off("click");

    this.currentRoundIndex++;
    const round = new Round(this.currentRoundIndex, this.statsPanel, this.clip, this.config, this.lowers, this.uppers, this.onRoundComplete.bind(this), this);
    this.rounds.push(round);
    this.statsPanel.update();
    round.init();
  }

  onRoundComplete() {
    let currentStageScore = 0;
    this.rounds.forEach((r) => (currentStageScore += r.state.score));
    const targetScore = this.config.toBeat;

    // 2. CHECK VITTORIA TAPPA
    if (currentStageScore >= targetScore) {
      // AUTO-VENDITA TWOS SCADUTI
      [...Player.activeEffects].forEach((item) => {
        if (item.category === "UpperTwos" && item.tier === 0) {
          this.sellConsumable(item.id);
          WinAlert.show("SCADUTO", `Investimento scaduto! Venduto automaticamente per ${item.accumulatedValue}$`);
        }
      });

      this.cleanupEffects("stage");

      Player.consumables = Player.consumables.filter((item) => {
        if (item.category !== "UpperThrees" && item.tier === 0) return false;
        if (item.category === "UpperThrees") return false;
        return true;
      });
      this.renderConsumables();

      setTimeout(() => {
        WinAlert.show("VITTORIA!", "TAPPA COMPLETATA!<br>(Qui ci sarà lo Shop)");
      }, 500);
      return;
    }

    // 3. CHECK GAME OVER
    if (this.currentRoundIndex >= this.config.rounds - 1) {
      this.triggerGameOver();
      return;
    }

    // 4. NEXT ROUND
    this.nextRound();
  }

  triggerGameOver() {
    const $overlay = jQuery('<div class="game-over-overlay">GAME OVER<br><span style="font-size:20px">Click to Restart</span></div>');
    jQuery("body").append($overlay);
    $overlay.on("click", () => {
      window.location.reload();
    });
  }

  createStageScreen() {
    this.clip = jQuery("#template_screen_game").clone();
    this.clip.removeAttr("id");
    jQuery(".js-main").append(this.clip);
    jQuery(".js-stage-name", this.clip).text(this.config.name);
    this.statsPanel = new StatsPanel(jQuery(".js-stats-panel", this.clip));
    this.statsPanel.init(this.config, this.rounds);
    this.lowers = new Lowers(this.clip, this.config.lowers.slice());
    this.lowers.init();
    this.uppers = new Uppers(this.clip, this.config.uppers.slice());
    this.uppers.init();
    jQuery(".js-total-gold", this.clip).text(Player.gold + "$");
  }

  acquireConsumable(matchData, staticData) {
    // --- ECCEZIONE: TWOS (Vanno diretti in ACTIVE) ---
    if (matchData.category === "UpperTwos") {
      const item = {
        id: matchData.category + "_" + Date.now(),
        category: matchData.category,
        name: staticData.name,
        tier: matchData.tier,
        description: matchData.tier === 0 ? staticData.tier0 : staticData.tier1,
        durationType: matchData.tier === 0 ? "stage" : "run",
        accumulatedValue: 1,
      };
      Player.activeEffects.push(item);
      this.renderActiveEffects();
      WinAlert.show("INVESTIMENTO", `Hai ottenuto un investimento!<br>Valore attuale: <b>${item.accumulatedValue}$</b>`);
      return true;
    }
    if (Player.consumables.length >= Player.MAX_CONSUMABLES) {
      WinAlert.show("INVENTARIO PIENO", "Non hai spazio per prendere questa carta.");
      return false;
    }

    let durationType = "round";
    if (matchData.category === "UpperOnes") {
      durationType = "round";
    } else {
      durationType = matchData.tier === 0 ? "round" : "stage";
    }

    // CALCOLO VALORE DI VENDITA (Base + Tier Bonus)
    // Tier 0 -> Base Value
    // Tier 1 -> Base Value + 1
    const sellValue = (staticData.baseValue || 0) + (matchData.tier || 0);

    const consumableItem = {
      id: matchData.category + "_" + Date.now(),
      category: matchData.category,
      name: staticData.name,
      tier: matchData.tier,
      description: matchData.tier === 0 ? staticData.tier0 : staticData.tier1,
      durationType: durationType,
      sellValue: sellValue, // NUOVO: Salviamo il valore
    };

    Player.consumables.push(consumableItem);
    this.renderConsumables();
    return true;
  }

  activateConsumable(itemId) {
    const index = Player.consumables.findIndex((c) => c.id === itemId);
    if (index === -1) return;

    const item = Player.consumables[index];

    // --- GESTIONE SPECIALE: THREES (ISTANTANEA) ---
    if (item.category === "UpperThrees") {
      Player.consumables.splice(index, 1);
      this.renderConsumables();
      if (item.tier === 0) {
        this._applyThreesRandom();
      } else {
        this._applyThreesSelection();
      }
      return;
    }

    item.accumulatedValue = 0;
    Player.consumables.splice(index, 1);
    Player.activeEffects.push(item);

    this.renderConsumables();
    this.renderActiveEffects();
    console.log(`Attivato effetto: ${item.name}`);

    const currentRound = this.rounds[this.currentRoundIndex];
    if (currentRound) {
      currentRound.recalculateState();
    }
  }

  cleanupEffects(scope) {
    if (scope === "stage") {
      Player.activeEffects = [];
    } else {
      Player.activeEffects = Player.activeEffects.filter((eff) => eff.durationType !== "round");
    }
    this.renderActiveEffects();
  }

  // --- RENDERERS UI ---

  renderConsumables() {
    const $container = this.clip.find(".js-consumables-container");
    $container.find(".mini-card").remove();
    Player.consumables.forEach((item) => {
      const $card = this._createMiniCard(item, true); // true = inventario
      $container.append($card);
    });
  }

  renderActiveEffects() {
    const $container = this.clip.find(".js-active-effects-container");
    $container.find(".mini-card").remove();
    Player.activeEffects.forEach((item) => {
      const $card = this._createMiniCard(item, false); // false = attivo
      $card.addClass("active-effect");
      $container.append($card);
    });
  }

  _createMiniCard(item, isInInventory) {
    const displayTier = item.tier + 1;
    const fullTitle = `${item.name} - Tier ${displayTier}`;
    const tierClass = item.tier === 0 ? "tier-0" : "tier-1";

    // --- VISUALIZZAZIONE VALORE ---
    let dynamicValueHtml = "";
    const baseStyle = "margin-bottom:5px; font-weight:900; font-size:12px; padding:2px; border-radius:4px; border:1px solid";

    if (item.accumulatedValue !== undefined && item.accumulatedValue > 0 && item.category !== "UpperTwos") {
      dynamicValueHtml = `<div style="${baseStyle} #D32F2F; color:#D32F2F;">+${item.accumulatedValue} Chips</div>`;
    } else if (item.category === "UpperFours" && !isInInventory) {
      dynamicValueHtml = `<div style="${baseStyle} #999; color:#999; font-weight:bold; font-size:11px;">+0 Chips</div>`;
    } else if (item.category === "UpperFives" && !isInInventory) {
      dynamicValueHtml = `<div style="${baseStyle} #D32F2F; color:#D32F2F;">+5 Mult</div>`;
    } else if (item.category === "UpperSixes" && !isInInventory) {
      dynamicValueHtml = `<div style="${baseStyle} #2E7D32; color:#2E7D32;">+50 Chips</div>`;
    } else if (item.category === "UpperTwos") {
      dynamicValueHtml = `<div style="${baseStyle} #DAA520; color:#FFD700; background:#FFF8E1; color:#B8860B;">Valore: ${item.accumulatedValue}$</div>`;
    }

    const $el = jQuery(`
      <div class="mini-card">
        <div class="mini-header ${tierClass}">${fullTitle}</div>
        <div class="mini-body">
            ${dynamicValueHtml}
            <div class="mini-desc">${item.description}</div>
        </div>
        <div class="mini-footer"></div>
      </div>
    `);

    const $footer = $el.find(".mini-footer");

    // CASO A: INVENTARIO (Pulsanti USA e VENDI)
    if (isInInventory) {
      // Button USA
      const $btn = jQuery('<button class="btn-mini-use">USA</button>');
      $btn.on("click", () => {
        if (this.clip.hasClass("input-locked")) return;
        this.activateConsumable(item.id);
      });
      $footer.append($btn);

      // Button VENDI (NUOVO)
      // Mostriamo il valore di vendita nel pulsante
      const sellLabel = `VENDI (${item.sellValue || 0}$)`;
      const $btnSell = jQuery(`<button class="btn-mini-use" style="background:#D32F2F; margin-top:2px;">${sellLabel}</button>`);
      $btnSell.on("click", () => {
        // FIX CONFIRM -> WinAlert.ask
        WinAlert.ask("VENDITA", `Vuoi vendere <b>${item.name}</b> per <b>${item.sellValue}$</b>?`, () => {
          this.sellConsumable(item.id);
        });
      });
      $footer.append($btnSell);
    }
    // CASO B: ATTIVA MA È UN "TWO" (Pulsante VENDI)
    else if (item.category === "UpperTwos") {
      const $btnSell = jQuery('<button class="btn-mini-use" style="background:#D32F2F;">VENDI</button>');
      $btnSell.on("click", () => {
        // FIX CONFIRM -> WinAlert.ask
        WinAlert.ask("INCASSARE", `Vuoi incassare l'investimento?<br>Valore attuale: <b>${item.accumulatedValue}$</b>`, () => {
          this.sellConsumable(item.id);
        });
      });
      $footer.append($btnSell);
    }

    return $el;
  }

  // --- LOGICA TIER 1/2 THREES ---
  _applyThreesRandom() {
    const allLowers = ScoreSheet.getAllLowers().filter((c) => c !== ScoreSheet.LOWER_CHANCE);
    for (let i = 0; i < 2; i++) {
      const randomCat = allLowers[Math.floor(Math.random() * allLowers.length)];
      this.lowers.addExtra(randomCat);
    }
    WinAlert.show("EFFETTO ATTIVATO", "2 Categorie Lower casuali sono state aggiunte alla lista!");
  }

  _applyThreesSelection() {
    const allLowers = ScoreSheet.getAllLowers().filter((c) => c !== ScoreSheet.LOWER_CHANCE);
    const $overlay = jQuery(`<div class="selection-overlay"></div>`);
    const $box = jQuery(`<div class="selection-box"><h2>Scegli 2 Categorie</h2></div>`);
    const $list = jQuery(`<div class="selection-list"></div>`);
    allLowers.forEach((cat) => {
      const staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === cat);
      const name = staticData ? staticData.name : cat;
      const $item = jQuery(`
            <label class="selection-item">
                <input type="checkbox" value="${cat}" class="js-sel-check">
                ${name}
            </label>
        `);
      $list.append($item);
    });
    const $confirmBtn = jQuery(`<button class="btn-main" style="width:100%">CONFERMA</button>`);

    $list.find("input").on("change", function () {
      const checkedCount = $list.find("input:checked").length;
      if (checkedCount > 2) {
        this.checked = false;
        WinAlert.show("ATTENZIONE", "Puoi sceglierne solo 2!");
      }
    });
    $confirmBtn.on("click", () => {
      const $checked = $list.find("input:checked");
      if ($checked.length !== 2) {
        WinAlert.show("ERRORE", "Devi selezionare esattamente 2 categorie.");
        return;
      }
      $checked.each((i, el) => {
        this.lowers.addExtra(el.value);
      });
      $overlay.remove();
      this.clip.removeClass("input-locked");
    });

    $box.append($list).append($confirmBtn);
    $overlay.append($box);
    jQuery("body").append($overlay);
  }

  // --- METODO VENDITA AGGIORNATO ---
  sellConsumable(itemId) {
    // 1. Cerca nell'Inventario
    let index = Player.consumables.findIndex((c) => c.id === itemId);
    let list = Player.consumables;
    let isInventory = true;

    // 2. Se non c'è, cerca in Active (per i Twos)
    if (index === -1) {
      index = Player.activeEffects.findIndex((c) => c.id === itemId);
      list = Player.activeEffects;
      isInventory = false;
    }

    if (index === -1) return;

    const item = list[index];
    // Se è inventario usa sellValue, se è attivo (Twos) usa accumulatedValue
    const value = isInventory ? item.sellValue || 0 : item.accumulatedValue || 0;

    // Esegui vendita
    Player.gold += value;
    list.splice(index, 1);

    // Aggiorna UI
    if (isInventory) this.renderConsumables();
    else this.renderActiveEffects();

    jQuery(".js-total-gold", this.clip).text(Player.gold + "$");
    console.log(`Venduto ${item.name} per ${value}$`);
  }

  incrementEconomy() {
    let changed = false;
    Player.activeEffects.forEach((item) => {
      if (item.category === "UpperTwos") {
        item.accumulatedValue = (item.accumulatedValue || 0) + 1;
        changed = true;
      }
    });
    if (changed) this.renderActiveEffects();
  }
}
