import jQuery from "jquery";
import Player from "./Player";
import ScoreSheet from "./ScoreSheet";
import Jolly from "./Jolly";
import Utility from "./Utility";
import Voucher from "./Voucher";
import BoosterPack from "./BoosterPack";
import WinAlert from "../helpers/WinAlert";

export default class Shop {
  constructor(stageCallback) {
    this.stageCallback = stageCallback;
    this.$el = null;

    this.items = {
      cards: [],
      voucher: null,
      packs: [],
    };
  }

  init() {
    this.generateItems();
    this.render();
  }

  // --- LOGICA GENERAZIONE ---
  generateItems() {
    this.items.cards = [];
    this.items.packs = [];
    this.items.voucher = null;

    // 1. Genera le Carte (Offerte del Giorno)
    this._generateCards();

    // 2. Un Voucher
    const availableVouchers = ScoreSheet.VOUCHERS_DATA.filter((v) => !Player.vouchers.some((pv) => pv.id === v.id));
    if (availableVouchers.length > 0) {
      const randomVoucher = availableVouchers[Math.floor(Math.random() * availableVouchers.length)];
      this.items.voucher = new Voucher(randomVoucher);
    }

    // 3. Genera Pacchetti (Usa variabile Player)
    for (let i = 0; i < Player.SHOP_BOOSTER_PACKS; i++) {
      const randomPack = this._getRandomItem(ScoreSheet.BOOSTERS_DATA);
      this.items.packs.push(new BoosterPack(randomPack));
    }
  }

  // --- Genera solo le carte (usato anche dal Reroll) ---
  _generateCards() {
    this.items.cards = [];
    // Usa variabile Player
    for (let i = 0; i < Player.SHOP_DAILY_CARDS; i++) {
      // 50% Jolly, 50% Utility
      if (Math.random() > 0.5) {
        const randomJolly = this._getRandomItem(ScoreSheet.JOLLY_DATA);
        this.items.cards.push(new Jolly(randomJolly));
      } else {
        const randomUtil = this._getRandomItem(ScoreSheet.SHOP_UTILITIES_DATA);
        this.items.cards.push(new Utility(randomUtil));
      }
    }
  }

  _getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // --- RENDER UI ---
  render() {
    if (!this.$el) {
      this.$el = this._createSkeleton();
      jQuery(".js-main").append(this.$el);
    }

    this.$el.find(".js-shop-gold").text(Player.gold + "$");

    // 1. Render Cards
    const $cardsArea = this.$el.find(".js-area-cards");
    $cardsArea.empty();
    this.items.cards.forEach((item) => {
      const $cardHtml = item.create("shop", {
        onBuy: (clickedItem) => this.tryBuyItem(clickedItem),
      });
      $cardsArea.append($cardHtml);
    });

    // 2. Render Voucher
    const $voucherArea = this.$el.find(".js-area-voucher");
    $voucherArea.empty();
    if (this.items.voucher) {
      const $vHtml = this.items.voucher.create("shop", {
        onBuy: (clickedItem) => this.tryBuyItem(clickedItem),
      });
      $voucherArea.append($vHtml);
    } else {
      $voucherArea.append('<div style="opacity:0.5; font-weight:bold;">SOLD OUT</div>');
    }

    // 3. Render Packs
    const $packsArea = this.$el.find(".js-area-packs");
    $packsArea.empty();
    this.items.packs.forEach((pack) => {
      const $pHtml = pack.create((clickedPack) => this.tryBuyPack(clickedPack));
      $packsArea.append($pHtml);
    });
  }

  _createSkeleton() {
    return jQuery(`
      <div class="shop-container">
        <header class="shop-header">
            <h1>Negozio</h1>
            <div class="shop-gold js-shop-gold">0$</div>
        </header>

        <div class="shop-grid">
            <div class="shop-section area-cards">
                <span class="section-title">Offerte del Giorno</span>
                <div class="section-content js-area-cards"></div>
            </div>
            
            <div class="shop-section area-packs">
                <span class="section-title">Buste</span>
                <div class="section-content js-area-packs"></div>
            </div>

            <div class="shop-section area-voucher">
                <span class="section-title">Voucher</span>
                <div class="section-content js-area-voucher"></div>
            </div>
            
            <div class="area-actions">
                <button class="btn-shop-action btn-next js-btn-next">Prossima Tappa &rarr;</button>
                <button class="btn-shop-action btn-reroll js-btn-reroll">Reroll Offerte (${Player.REROLL_COST}$)</button>
            </div>
        </div>
      </div>
    `);
  }

  bindEvents() {
    this.$el
      .find(".js-btn-next")
      .off("click")
      .on("click", () => {
        this.$el.remove();
        this.stageCallback();
      });

    this.$el
      .find(".js-btn-reroll")
      .off("click")
      .on("click", () => {
        if (Player.gold >= Player.REROLL_COST) {
          Player.gold -= Player.REROLL_COST;
          this._generateCards();
          this.render();
          WinAlert.show("REROLL", "Nuove offerte disponibili!");
        } else {
          WinAlert.show("POVERO", "Non hai abbastanza soldi per il Reroll!");
        }
      });
  }

  tryBuyItem(item) {
    if (Player.gold < item.cost) {
      WinAlert.show("POVERO", "Non hai abbastanza soldi!");
      return;
    }

    const isJolly = item.rarity !== undefined;
    const isVoucher = item.properties !== undefined && !isJolly && item.cost > 0;
    const isUtility = item.tier !== undefined || item.effectType !== undefined;

    // Check Spazio usando le costanti di Player
    if (isJolly) {
      if (Player.jollies.length >= Player.MAX_JOLLIES) {
        WinAlert.show("PIENO", "Slot Jolly pieni!");
        return;
      }
      Player.jollies.push(item);
    } else if (isUtility) {
      if (Player.consumables.length >= Player.MAX_CONSUMABLES) {
        WinAlert.show("PIENO", "Inventario Consumabili pieno!");
        return;
      }
      Player.consumables.push(item);
    } else if (isVoucher) {
      if (Player.vouchers.some((v) => v.id === item.id)) {
        WinAlert.show("POSSEDUTO", "Hai già questo voucher!");
        return;
      }
      Player.vouchers.push(item);
      this.items.voucher = null;
    }

    Player.gold -= item.cost;

    if (isJolly || isUtility) {
      this.items.cards = this.items.cards.filter((i) => i !== item);
    }

    WinAlert.show("ACQUISTATO", `Hai comprato ${item.name}!`);
    this.render();
  }

  tryBuyPack(pack) {
    if (Player.gold < pack.cost) {
      WinAlert.show("POVERO", "Non hai abbastanza soldi!");
      return;
    }

    Player.gold -= pack.cost;
    this.items.packs = this.items.packs.filter((p) => p !== pack);
    this.render();

    this.openBoosterPack(pack);
  }

  openBoosterPack(pack) {
    const content = [];
    const sourceData = pack.type === "jolly" ? ScoreSheet.JOLLY_DATA : ScoreSheet.SHOP_UTILITIES_DATA;
    const pool = pack.type === "utility" ? [...sourceData, ...ScoreSheet.UPPERS_DATA] : sourceData;

    for (let i = 0; i < pack.totalCards; i++) {
      const rawData = this._getRandomItem(pool);
      if (pack.type === "jolly") content.push(new Jolly(rawData));
      else content.push(new Utility(rawData));
    }

    const $overlay = jQuery(`
        <div class="booster-overlay">
            <h2>${pack.name}</h2>
            <div class="booster-info">Scegli ${pack.chooseCards} carte</div>
            <div class="booster-cards-container"></div>
        </div>
      `);

    const $container = $overlay.find(".booster-cards-container");
    let chosenCount = 0;
    let isInteractionLocked = false; // FLAG DI SICUREZZA

    content.forEach((item) => {
      const $card = item.create("inventory");
      $card.find(".mini-footer, .jolly-footer").remove();

      $card.on("click", () => {
        // 1. BLOCCO IMMEDIATO: Se stiamo già processando o abbiamo finito, ignora click
        if (isInteractionLocked || chosenCount >= pack.chooseCards) return;

        const isJolly = item.rarity !== undefined;
        const isUtility = item.tier !== undefined;

        // Check Spazio
        if (isJolly && Player.jollies.length >= Player.MAX_JOLLIES) {
          WinAlert.show("PIENO", "Slot Jolly Pieni!");
          return;
        }
        if (isUtility && Player.consumables.length >= Player.MAX_CONSUMABLES) {
          WinAlert.show("PIENO", "Inventario Pieno!");
          return;
        }

        // Aggiungi
        if (isJolly) Player.jollies.push(item);
        else Player.consumables.push(item);

        chosenCount++;
        $card.css({ opacity: 0, transform: "scale(0)" });

        // Se abbiamo raggiunto il limite, BLOCCA TUTTO
        if (chosenCount >= pack.chooseCards) {
          isInteractionLocked = true; // Impedisce altri click sulle altre carte
          $container.css("pointer-events", "none"); // Disabilita CSS per sicurezza visiva

          setTimeout(() => {
            $overlay.fadeOut(300, () => $overlay.remove());
            WinAlert.show("COMPLETATO", "Carte aggiunte all'inventario!");
            this.render();
          }, 500);
        }
      });

      $container.append($card);
    });

    jQuery("body").append($overlay);
  }
}
