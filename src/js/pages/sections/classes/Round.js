import CardLower from "./CardLower";
import CardUpper from "./CardUpper";
import Hand from "./Hand";
import ScoreSheet from "./ScoreSheet";

export default class Round {
  static handPerRound = 5;
  config = null;
  currentHandIndex = -1;
  statsPanel = null;
  roundNumber = 0;
  clip = null;
  state = {
    score: 0,
    handsPlayed: 0,
  };
  hands = [];
  previousDices = null;
  lowers = null;
  uppers = null;

  constructor(roundNumber, statsPanel, clip, config, lowers, uppers) {
    this.roundNumber = roundNumber;
    this.statsPanel = statsPanel;
    this.clip = clip;
    this.config = config;
    this.lowers = lowers;
    this.uppers = uppers;
  }

  init() {
    this.statsPanel.setCurrentHand(this.hands.length);
    // Il pulsante tira i dadi
    jQuery(".js-btn-roll", this.clip).on("click", this.onRollDice.bind(this));
  }

  onRollDice() {
    this.nextHand();
  }

  nextHand() {
    this.currentHandIndex++;
    const hand = new Hand(this.clip, this.handleResults.bind(this), this.previousDices);

    hand.init();
    this.hands.push(hand);
  }

  handleResults(dices) {
    console.log("Risultati mano:", dices);
    this.previousDices = dices;
    // Incrementa le mani giocate
    this.state.handsPlayed++;
    this.statsPanel.setCurrentHand(this.state.handsPlayed);

    const $track = this.clip.find(".js-combinations-track");
    $track.empty();

    if (this.state.handsPlayed >= this.config.handsPerRound) {
      // Nasconde il pulsante tira i dadi
      jQuery(".js-btn-roll", this.clip).off("click");
      jQuery(".js-btn-roll", this.clip).hide();
      //console.log("Round finito");
      // Nasconde anche i pulsanti hold sui dadi
      for (let i = 0; i < dices.length; i++) {
        const diceObj = dices[i];
        diceObj.dice.btn.hide();
      }
    }
    // Valuta quali sono le combinazioni che fittano in questa mano
    this.lowers.clearHighlights();
    this.uppers.clearHighlights();
    const validMatches = ScoreSheet.evaluateHand(dices, this.lowers, this.uppers);
    validMatches.forEach((match) => {
      let $cardElement = null;

      if (match.type === "lower") {
        const cardLower = new CardLower(match, dices);
        $cardElement = cardLower.create();
        // Highlight lista laterale
        this.lowers.highlight(match.category, true);
      } else if (match.type === "upper") {
        const cardUpper = new CardUpper(match); // Non servono i dadi qui
        $cardElement = cardUpper.create();
        // Highlight lista laterale (assumendo tu abbia uppers.highlight simile a lowers)
        this.uppers.highlight(match.category, true);
      }

      if ($cardElement) {
        $track.append($cardElement);
      }
    });
  }
}
