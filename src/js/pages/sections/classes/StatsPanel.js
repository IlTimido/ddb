export default class StatsPanel {
  clip = null;
  config = null;

  constructor(clip) {
    this.clip = clip;
  }

  init(config, rounds) {
    this.config = config;
    jQuery(".js-round-current", this.clip).text(rounds.length + 1 + "/" + config.rounds);
    jQuery(".js-score-target", this.clip).text(config.toBeat);
    // Segna i punti attuali
    let currentScore = 0;
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      currentScore += round.state.score;
    }
    jQuery(".js-score-current", this.clip).text(currentScore);
  }

  setCurrentHand(handIndex) {
    jQuery(".js-rolls-left", this.clip).text(this.config.handsPerRound - handIndex);
  }
}
