export default class Player {
  static totalScore = 0;
  static gold = 100;
  static lives = 2; // NUOVO: Vite Default

  // --- LIMITI INVENTARIO ---
  static MAX_CONSUMABLES = 5;
  static MAX_JOLLIES = 5;

  // --- CONFIGURAZIONE SHOP ---
  static SHOP_DAILY_CARDS = 2;
  static SHOP_BOOSTER_PACKS = 2;
  static REROLL_COST = 5;

  // --- INVENTARI ---
  static consumables = [];
  static activeEffects = [];
  static jollies = [];
  static vouchers = [];
}
