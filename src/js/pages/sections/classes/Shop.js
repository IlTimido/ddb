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

  generateItems() {
    this.items.cards = [];
    this.items.packs = [];
    this.items.voucher = null;

    this._generateCards();

    const availableVouchers = ScoreSheet.VOUCHERS_DATA.filter((v) => !Player.vouchers.some((pv) => pv.id === v.id));
    if (availableVouchers.length > 0) {
      const randomVoucher = availableVouchers[Math.floor(Math.random() * availableVouchers.length)];
      this.items.voucher = new Voucher(randomVoucher);
    }

    for (let i = 0; i < Player.SHOP_BOOSTER_PACKS; i++) {
      const randomPack = this._getRandomItem(ScoreSheet.BOOSTERS_DATA);
      this.items.packs.push(new BoosterPack(randomPack));
    }
  }

  _generateCards() {
    this.items.cards = [];
    for (let i = 0; i < Player.SHOP_DAILY_CARDS; i++) {
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

  render() {
    if (!this.$el) {
      this.$el = this._createSkeleton();
      jQuery(".js-main").append(this.$el);
      this.bindEvents(); // Bind events only once when skeleton is created
    }

    this.$el.find(".js-shop-gold").text(Player.gold + "$");

    const $cardsArea = this.$el.find(".js-area-cards");
    $cardsArea.empty();
    this.items.cards.forEach((item) => {
      const $cardHtml = item.create("shop", {
        onBuy: (clickedItem) => this.tryBuyItem(clickedItem),
      });
      $cardsArea.append($cardHtml);
    });

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

    const $packsArea = this.$el.find(".js-area-packs");
    $packsArea.empty();
    this.items.packs.forEach((pack) => {
      const $pHtml = pack.create((clickedPack) => this.tryBuyPack(clickedPack));
      $packsArea.append($pHtml);
    });
  }

  _createSkeleton() {
    // CLONA TEMPLATE SHOP SCREEN
    return jQuery("#template_shop_screen").clone().removeAttr("id");
  }

  bindEvents() {
    this.$el
      .find(".js-btn-next")
      .off("click")
      .on("click", () => {
        this.$el.remove();
        this.stageCallback();
      });

    this.$el.find(".js-btn-reroll").text(`Reroll Offerte (${Player.REROLL_COST}$)`);
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

    // CLONA TEMPLATE OVERLAY
    const $overlay = jQuery("#template_booster_overlay").clone().removeAttr("id");

    $overlay.find(".js-title").text(pack.name);
    $overlay.find(".js-info").text(`Scegli ${pack.chooseCards} carte`);

    const $container = $overlay.find(".js-container");
    let chosenCount = 0;
    let isInteractionLocked = false;

    content.forEach((item) => {
      const $card = item.create("inventory");
      $card.find(".mini-footer, .jolly-footer").remove();

      $card.on("click", () => {
        if (isInteractionLocked || chosenCount >= pack.chooseCards) return;

        const isJolly = item.rarity !== undefined;
        const isUtility = item.tier !== undefined;

        if (isJolly && Player.jollies.length >= Player.MAX_JOLLIES) {
          WinAlert.show("PIENO", "Slot Jolly Pieni!");
          return;
        }
        if (isUtility && Player.consumables.length >= Player.MAX_CONSUMABLES) {
          WinAlert.show("PIENO", "Inventario Pieno!");
          return;
        }

        if (isJolly) Player.jollies.push(item);
        else Player.consumables.push(item);

        chosenCount++;
        $card.css({ opacity: 0, transform: "scale(0)" });

        if (chosenCount >= pack.chooseCards) {
          isInteractionLocked = true;
          $container.css("pointer-events", "none");

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
