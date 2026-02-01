export default class Player {
  static totalScore = 0;
  static gold = 0;

  // Limiti inventario
  static MAX_CONSUMABLES = 5; // Aumentiamo a 5 visto che c'è lo scroll

  // Inventario: contiene oggetti { id, name, tier, description, durationType }
  static consumables = [];

  // Effetti Attivi: contiene gli stessi oggetti ma spostati qui quando usati
  static activeEffects = [];
}
