import WinAlert from "../helpers/WinAlert";
import Lowers from "./Lowers";
import Player from "./Player";
import Round from "./Round";
import StatsPanel from "./StatsPanel";
import Uppers from "./Uppers";
import Utility from "./Utility";
import Shop from "./Shop";
import jQuery from "jquery";
import ScoreSheet from "./ScoreSheet";

export default class Stage {
  clip = null;
  statsPanel = null;
  config = null;
  currentRoundIndex = -1;
  rounds = [];
  lowers = [];
  uppers = [];

  constructor(config, onStageComplete) {
    this.config = config;
    this.onStageComplete = onStageComplete;
  }

  init() {
    this.createStageScreen();
    this.renderConsumables();
    this.renderJollies();
    this.renderActiveEffects();
    this.nextRound();
  }

  nextRound() {
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

    // A. VITTORIA TAPPA
    if (currentStageScore >= targetScore) {
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
        WinAlert.show("TAPPA COMPLETATA!", `Hai battuto il punteggio target!<br>Incasso Tappa: <b>${this.config.moneyReward || 5}$</b>`, () => {
          Player.gold += this.config.moneyReward || 5;
          this.updatePlayerStats();

          const shop = new Shop(() => {
            if (this.onStageComplete) this.onStageComplete();
          });
          shop.init();
          shop.bindEvents();
        });
      }, 500);
      return;
    }

    // B. TARGET NON RAGGIUNTO E ROUND FINITI
    if (this.currentRoundIndex >= this.config.rounds - 1) {
      if (Player.lives > 1) {
        Player.lives--;
        this.updatePlayerStats();

        WinAlert.ask(
          "ATTENZIONE!",
          `Non hai raggiunto il punteggio target.<br>Hai perso una vita. Te ne restano: <b>${Player.lives}</b>.<br>Vuoi ritentare la tappa?`,
          () => {
            this.retryStage();
          },
          () => {
            this.triggerGameOver();
          },
        );
      } else {
        this.triggerGameOver();
      }
      return;
    }

    this.nextRound();
  }

  retryStage() {
    console.log("Retrying Stage...");
    this.currentRoundIndex = -1;
    this.rounds = [];
    this.init();
  }

  triggerGameOver() {
    // CLONA TEMPLATE GAME OVER
    const $overlay = jQuery("#template_game_over").clone().removeAttr("id");
    jQuery("body").append($overlay);
    $overlay.on("click", () => {
      window.location.reload();
    });
  }

  createStageScreen() {
    jQuery(".game-container").not("#template_screen_game").remove();

    this.clip = jQuery("#template_screen_game").clone().removeAttr("id");
    jQuery(".js-main").append(this.clip);
    jQuery(".js-stage-name", this.clip).text(this.config.name);

    this.statsPanel = new StatsPanel(jQuery(".js-stats-panel", this.clip));
    this.statsPanel.init(this.config, this.rounds);

    this.lowers = new Lowers(this.clip, this.config.lowers.slice());
    this.lowers.init();

    this.uppers = new Uppers(this.clip, this.config.uppers.slice());
    this.uppers.init();

    this.updatePlayerStats();
  }

  updatePlayerStats() {
    jQuery(".js-total-gold", this.clip).text(Player.gold + "$");
    jQuery(".js-total-lives", this.clip).html(Player.lives + "&hearts;");
  }

  acquireConsumable(matchData, staticData) {
    let durationType = "round";
    if (matchData.category === "UpperOnes") {
      durationType = "round";
    } else if (matchData.category === "UpperTwos") {
      durationType = matchData.tier === 0 ? "stage" : "run";
    } else {
      durationType = matchData.tier === 0 ? "round" : "stage";
    }

    const sellValue = (staticData.baseValue || 0) + (matchData.tier || 0);
    const utilityData = {
      id: matchData.category + "_" + Date.now(),
      category: matchData.category,
      name: staticData.name,
      description: matchData.tier === 0 ? staticData.tier0 : staticData.tier1,
      tier: matchData.tier,
      cost: 0,
      sellValue: sellValue,
      durationType: durationType,
      accumulatedValue: matchData.category === "UpperTwos" ? 1 : 0,
    };

    const newItem = new Utility(utilityData);
    if (matchData.category === "UpperTwos") {
      Player.activeEffects.push(newItem);
      this.renderActiveEffects();
      WinAlert.show("INVESTIMENTO", `Hai ottenuto un investimento!<br>Valore attuale: <b>${newItem.accumulatedValue}$</b>`);
      return true;
    }

    if (Player.consumables.length >= Player.MAX_CONSUMABLES) {
      WinAlert.show("INVENTARIO PIENO", "Non hai spazio per prendere questa carta.");
      return false;
    }

    Player.consumables.push(newItem);
    this.renderConsumables();
    return true;
  }

  activateConsumable(itemId) {
    const index = Player.consumables.findIndex((c) => c.id === itemId);
    if (index === -1) return;
    const item = Player.consumables[index];

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

  renderJollies() {
    const $container = this.clip.find(".js-jolly-container");
    $container.find(".jolly-card").remove();
    $container.find(".placeholder-text").toggle(Player.jollies.length === 0);
    Player.jollies.forEach((jolly) => {
      const $card = jolly.create("inventory", {
        onSell: (clickedJolly) => {
          WinAlert.ask("VENDITA JOLLY", `Vuoi vendere <b>${clickedJolly.name}</b> per ${clickedJolly.sellValue}$?`, () => {
            this.sellConsumable(clickedJolly.id);
          });
        },
      });
      $card.css("transform", "scale(0.85)");
      $container.append($card);
    });
  }

  renderConsumables() {
    const $container = this.clip.find(".js-consumables-container");
    $container.find(".mini-card").remove();
    Player.consumables.forEach((item) => {
      const $card = item.create("inventory", {
        onUse: (u) => this.activateConsumable(u.id),
        onSell: (u) => this.sellConsumable(u.id),
      });
      $container.append($card);
    });
  }

  renderActiveEffects() {
    const $container = this.clip.find(".js-active-effects-container");
    $container.find(".mini-card").remove();
    Player.activeEffects.forEach((item) => {
      const $card = item.create("active", {
        onSell: (u) => this.sellConsumable(u.id),
      });
      $container.append($card);
    });
  }

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

    // CLONA TEMPLATE SELECTION OVERLAY
    const $overlay = jQuery("#template_selection_overlay").clone().removeAttr("id");

    $overlay.find(".js-title").text("Scegli 2 Categorie");
    const $list = $overlay.find(".js-list");

    allLowers.forEach((cat) => {
      const staticData = ScoreSheet.LOWERS_DATA.find((d) => d.entry === cat);
      const name = staticData ? staticData.name : cat;

      // CLONA TEMPLATE ITEM
      const $item = jQuery("#template_selection_item").clone().removeAttr("id");
      $item.find(".js-sel-check").val(cat);
      $item.find(".js-name").text(name);

      $list.append($item);
    });

    const $confirmBtn = $overlay.find(".js-btn-confirm");

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

    jQuery("body").append($overlay);
  }

  sellConsumable(itemId) {
    let index = Player.consumables.findIndex((c) => c.id === itemId);
    let list = Player.consumables;
    let isJolly = false;

    if (index === -1) {
      index = Player.activeEffects.findIndex((c) => c.id === itemId);
      list = Player.activeEffects;
    }

    if (index === -1) {
      index = Player.jollies.findIndex((c) => c.id === itemId);
      list = Player.jollies;
      isJolly = true;
    }

    if (index === -1) return;

    const item = list[index];
    const value = item.accumulatedValue > 0 ? item.accumulatedValue : item.sellValue || 0;

    Player.gold += value;
    list.splice(index, 1);

    if (isJolly) this.renderJollies();
    else {
      this.renderConsumables();
      this.renderActiveEffects();
    }

    this.updatePlayerStats();
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
