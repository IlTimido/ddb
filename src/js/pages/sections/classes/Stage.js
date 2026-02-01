import WinAlert from "../helpers/WinAlert";
import Lowers from "./Lowers";
import Player from "./Player";
import Round from "./Round";
import ScoreSheet from "./ScoreSheet";
import Shop from "./Shop";
import StatsPanel from "./StatsPanel";
import Uppers from "./Uppers";
import Utility from "./Utility"; // <--- NUOVO IMPORT
import jQuery from "jquery";

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
    this.onStageComplete = onStageComplete; // <--- Salviamo il riferimento
  }

  init() {
    this.createStageScreen();
    this.renderConsumables();
    this.renderJollies(); // <--- NUOVO: Renderizza i Jolly
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
      // Auto-Vendita e Pulizia
      [...Player.activeEffects].forEach((item) => {
        if (item.category === "UpperTwos" && item.tier === 0) {
          this.sellConsumable(item.id);
          WinAlert.show("SCADUTO", `Investimento scaduto! Venduto automaticamente per ${item.accumulatedValue}$`);
        }
      });
      this.cleanupEffects("stage");

      // Rimuovi consumabili scaduti a fine tappa
      Player.consumables = Player.consumables.filter((item) => {
        if (item.category !== "UpperThrees" && item.tier === 0) return false;
        if (item.category === "UpperThrees") return false;
        return true;
      });
      this.renderConsumables();

      // --- APERTURA SHOP ---
      setTimeout(() => {
        WinAlert.show("TAPPA COMPLETATA!", `Hai battuto il punteggio target!<br>Incasso Tappa: <b>${this.config.moneyReward || 5}$</b>`, () => {
          // Aggiungiamo ricompensa tappa (opzionale ma consigliato)
          Player.gold += this.config.moneyReward || 5;

          // Creiamo lo Shop
          const shop = new Shop(() => {
            // Quando l'utente clicca "Prossima Tappa" nello Shop...
            // Chiamiamo la callback di Route per caricare la nuova tappa
            if (this.onStageComplete) this.onStageComplete();
          });
          shop.init();
          shop.bindEvents();
        });
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
    // Rimuoviamo il vecchio stage screen se presente per evitare duplicati
    jQuery(".game-container").not("#template_screen_game").remove();

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
    // 1. Definisci il tipo di durata
    let durationType = "round";
    if (matchData.category === "UpperOnes") {
      durationType = "round";
    } else if (matchData.category === "UpperTwos") {
      // Twos hanno regole speciali: Tier 0 scade a fine tappa, Tier 1 a fine Run
      durationType = matchData.tier === 0 ? "stage" : "run";
    } else {
      durationType = matchData.tier === 0 ? "round" : "stage";
    }

    // 2. Calcola Valore Vendita
    const sellValue = (staticData.baseValue || 0) + (matchData.tier || 0);

    // 3. Prepara i dati per la Utility
    const utilityData = {
      id: matchData.category + "_" + Date.now(),
      category: matchData.category,
      name: staticData.name,
      // Seleziona la descrizione corretta in base al tier
      description: matchData.tier === 0 ? staticData.tier0 : staticData.tier1,
      tier: matchData.tier,
      cost: 0, // Le carte craftate non costano nulla
      sellValue: sellValue,
      durationType: durationType,
      // Inizializza valore accumulato (Start a 1 per Twos, 0 per altri)
      accumulatedValue: matchData.category === "UpperTwos" ? 1 : 0,
    };

    // 4. Istanzia la classe Utility (Sostituisce l'oggetto anonimo)
    const newItem = new Utility(utilityData);

    // --- ECCEZIONE: TWOS (Vanno diretti in ACTIVE) ---
    if (matchData.category === "UpperTwos") {
      Player.activeEffects.push(newItem);
      this.renderActiveEffects();
      WinAlert.show("INVESTIMENTO", `Hai ottenuto un investimento!<br>Valore attuale: <b>${newItem.accumulatedValue}$</b>`);
      return true;
    }

    // --- CONTROLLO SPAZIO INVENTARIO ---
    if (Player.consumables.length >= Player.MAX_CONSUMABLES) {
      WinAlert.show("INVENTARIO PIENO", "Non hai spazio per prendere questa carta.");
      return false;
    }

    // 5. Aggiungi all'inventario
    Player.consumables.push(newItem);
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

    // Reset valore accumulato quando si attiva (per sicurezza, anche se per Fours parte da 0)
    item.accumulatedValue = 0;

    // Sposta da Consumables a ActiveEffects
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

  // --- RENDERERS UI (Aggiornati per usare Utility.js) ---

  renderConsumables() {
    const $container = this.clip.find(".js-consumables-container");
    $container.find(".mini-card").remove();
    $container.find(".placeholder-text").toggle(Player.consumables.length === 0);

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
      // item è un'istanza di Utility
      const $card = item.create("active", {
        onSell: (u) => this.sellConsumable(u.id), // Necessario per vendere i Twos attivi
      });
      // Nota: item.create() aggiunge già la classe "active-effect" se il contesto è "active"
      $container.append($card);
    });
  }

  // NOTA: _createMiniCard è stato rimosso perché la logica è ora in Utility.js

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

  // --- METODO VENDITA ---
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

  renderJollies() {
    const $container = this.clip.find(".js-jolly-container");
    $container.find(".jolly-card").remove(); // Pulisce
    $container.find(".placeholder-text").toggle(Player.jollies.length === 0); // Nasconde placeholder se ci sono carte

    Player.jollies.forEach((jolly) => {
      // Usa il metodo create di Jolly.js
      const $card = jolly.create("inventory", (clickedJolly) => {
        WinAlert.ask("VENDITA JOLLY", `Vuoi vendere <b>${clickedJolly.name}</b> per ${clickedJolly.sellValue}$?`, () => {
          // Logica vendita Jolly
          Player.gold += clickedJolly.sellValue;
          Player.jollies = Player.jollies.filter((j) => j !== clickedJolly);
          this.renderJollies();
          jQuery(".js-total-gold", this.clip).text(Player.gold + "$");
        });
      });

      // Riduciamo un po' la dimensione per farli stare nella barra (opzionale, via CSS o scale)
      $card.css("transform", "scale(0.85)");
      $container.append($card);
    });
  }
}
