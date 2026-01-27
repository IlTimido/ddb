import CardLower from "./CardLower";
import CardUpper from "./CardUpper";
import Hand from "./Hand";
import ScoreSheet from "./ScoreSheet";
import Player from "./Player";
import jQuery from "jquery";

export default class Round {
  static handPerRound = 5;
  // Costante per l'attesa (5 secondi)
  static SHOW_SCORE_DURATION = 5000;

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
    this.state.handsPlayed++;
    this.statsPanel.setCurrentHand(this.state.handsPlayed);

    const $track = this.clip.find(".js-combinations-track");
    $track.empty();

    if (this.state.handsPlayed >= this.config.handsPerRound) {
      jQuery(".js-btn-roll", this.clip).off("click").hide();
      dices.forEach((dObj) => dObj.dice.btn.hide());
    }

    this.lowers.clearHighlights();
    this.uppers.clearHighlights();

    const validMatches = ScoreSheet.evaluateHand(dices, this.lowers, this.uppers);

    validMatches.forEach((match) => {
      let $cardElement = null;

      // Definiamo la callback che ora accetta anche $cardElement
      const onSelectCallback = (matchData, staticData, $cardElement) => {
        this.onCardSelected(matchData, staticData, $cardElement);
      };

      if (match.type === "lower") {
        const cardLower = new CardLower(match, dices, onSelectCallback);
        $cardElement = cardLower.create();
        this.lowers.highlight(match.category, true);
      } else if (match.type === "upper") {
        const cardUpper = new CardUpper(match, onSelectCallback);
        $cardElement = cardUpper.create();
        this.uppers.highlight(match.category, true);
      }

      if ($cardElement) {
        $track.append($cardElement);
      }
    });
  }

  /**
   * Gestisce il click su una carta con teatralità
   */
  onCardSelected(matchData, staticData, $selectedCard) {
    console.log("Carta selezionata:", matchData.category);

    // 1. CALCOLO PUNTEGGIO
    let total = 0;
    if (matchData.type === "lower") {
      const chips = staticData.baseChips + matchData.score;
      const mult = staticData.baseMult;
      total = chips * mult;
    } else {
      total = matchData.score;
    }

    // 2. AGGIORNA STATO GLOBALE
    Player.totalScore += total;
    this.state.score += total;
    jQuery(".js-score-current", this.clip).text(this.state.score);

    // Disabilita nella lista laterale
    if (matchData.type === "lower") {
      const clip = this.lowers.getClip(matchData.category);
      if (clip) clip.addClass("disabled").removeClass("highlight");
    } else {
      const clip = this.uppers.getClip(matchData.category);
      if (clip) clip.addClass("disabled").removeClass("highlight");
    }

    // --- FASE TEATRALE ---

    // A. Nascondi pulsante Tira Dadi e Hold
    this.clip.find(".js-btn-roll").hide();
    this.clip.find(".btn-hold").hide();

    // B. Rimuovi tutte le altre carte
    $selectedCard.siblings().addClass("fade-out-card");

    // Rimuovile dal DOM dopo 300ms (tempo transizione CSS)
    setTimeout(() => {
      $selectedCard.siblings().remove();
    }, 300);

    // C. Disabilita interazione sulla carta scelta
    const $btnAction = $selectedCard.find(".js-btn-action");
    $btnAction.prop("disabled", true).text(matchData.type === "lower" ? "USATA" : "PRESA");
    $selectedCard.addClass("selected-locked");

    // D. Mostra il Punteggione (RITARDATO)
    // Facciamo passare 600ms totali: 300ms per sparire le altre + 300ms di "silenzio" in cui si vede solo la carta scelta.
    setTimeout(() => {
      const $scoreDisplay = jQuery(`<div class="score-reveal">+${total}</div>`);
      this.clip.find(".js-combinations-track").append($scoreDisplay);
    }, 600);

    // E. Attendi e chiudi
    // Aggiungiamo i 600ms di ritardo al tempo totale di attesa
    console.log(`Attendo il reveal...`);
    setTimeout(() => {
      this.endRound();
    }, Round.SHOW_SCORE_DURATION + 600);
  }

  endRound() {
    // Per ora alert, poi faremo la logica vera
    alert("Round Concluso! Punti fatti: " + this.state.score);
    // Qui chiameremo this.stage.nextRound()
  }
}
