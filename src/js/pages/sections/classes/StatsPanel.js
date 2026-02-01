import jQuery from "jquery";

export default class StatsPanel {
  clip = null;
  config = null;
  rounds = []; // Salviamo il riferimento ai round per rileggerli

  constructor(clip) {
    this.clip = clip;
  }

  init(config, rounds) {
    this.config = config;
    this.rounds = rounds; // IMPORTANTE: Salviamo il riferimento
    this.update();
  }

  // NUOVO METODO CENTRALE
  update() {
    // 1. Aggiorna Numero Round
    // rounds.length è il numero di round attuali creati
    jQuery(".js-round-current", this.clip).text(this.rounds.length + "/" + this.config.rounds);

    // 2. Aggiorna Target
    jQuery(".js-score-target", this.clip).text(this.config.toBeat);

    // 3. Calcola il Punteggio Totale della Tappa (sommando tutti i round)
    let currentStageScore = 0;
    this.rounds.forEach((round) => {
      currentStageScore += round.state.score;
    });

    // Aggiorna UI Score
    jQuery(".js-score-current", this.clip).text(currentStageScore);
  }

  setCurrentHand(handIndex) {
    jQuery(".js-rolls-left", this.clip).text(this.config.handsPerRound - handIndex);
  }

  // Aggiungi o sostituisci questo metodo
  setRollsLeft(val) {
    // Se val < 0 per qualche bug, mostra 0
    const safeVal = val < 0 ? 0 : val;
    jQuery(".js-rolls-left", this.clip).text(safeVal);
  }
}
