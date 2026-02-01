export default class Player {
  static totalScore = 0;
  static gold = 100; // Budget iniziale per test

  // --- LIMITI INVENTARIO ---
  static MAX_CONSUMABLES = 5;
  static MAX_JOLLIES = 5;

  // --- CONFIGURAZIONE SHOP ---
  static SHOP_DAILY_CARDS = 2; // Numero di carte (Jolly/Utility) in vendita
  static SHOP_BOOSTER_PACKS = 2; // Numero di pacchetti in vendita
  static REROLL_COST = 5;

  // --- INVENTARI ---
  static consumables = []; // Utility/Upper
  static activeEffects = []; // Twos/Effetti Round
  static jollies = []; // Carte Jolly permanenti
  static vouchers = []; // Voucher permanenti
}
