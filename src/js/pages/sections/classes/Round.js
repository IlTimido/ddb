import CardLower from "./CardLower";
import CardUpper from "./CardUpper";
import Hand from "./Hand";
import ScoreSheet from "./ScoreSheet";
import Player from "./Player";
import jQuery from "jquery";

export default class Round {
  static handPerRound = 5;
  static SHOW_SCORE_DURATION = 3000;

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

  // Aggiunto onRoundComplete
  onRoundComplete = null;

  // Aggiungiamo onRoundComplete come ultimo parametro
  constructor(roundNumber, statsPanel, clip, config, lowers, uppers, onRoundComplete, stageReference) {
    this.roundNumber = roundNumber;
    this.statsPanel = statsPanel;
    this.clip = clip;
    this.config = config;
    this.lowers = lowers;
    this.uppers = uppers;
    this.onRoundComplete = onRoundComplete;
    this.stage = stageReference; // Salviamo lo stage
  }

  init() {
    const max = this.getMaxHands();
    this.statsPanel.setRollsLeft(max); // Usa il nuovo metodo
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

  // Calcola il limite di mani (3 base + eventuali bonus)
  getMaxHands() {
    // Controlla se c'è l'effetto attivo "Ones" (indipendentemente dal Tier)
    const hasOnesEffect = Player.activeEffects.some((eff) => eff.category === "UpperOnes");
    const bonus = hasOnesEffect ? 1 : 0;
    return this.config.handsPerRound + bonus;
  }

  // NUOVO METODO: Chiamato dallo Stage quando si attiva un consumabile
  recalculateState() {
    console.log("Ricalcolo stato del round...");

    const currentMax = this.getMaxHands();
    const played = this.state.handsPlayed;
    const left = currentMax - played;

    // 1. Aggiorna il contatore visivo
    this.statsPanel.setRollsLeft(left);

    // 2. Se abbiamo guadagnato un lancio (played < max) ma l'interfaccia era nascosta...
    if (played < currentMax) {
      const $btnRoll = this.clip.find(".js-btn-roll");

      // Se il pulsante era nascosto, riattiviamo tutto!
      if ($btnRoll.is(":hidden")) {
        console.log("Riattivo interfaccia di lancio!");

        // Mostra pulsante Roll e riattacca l'evento (off/on per sicurezza)
        $btnRoll.show().off("click").on("click", this.onRollDice.bind(this));

        // Mostra i pulsanti HOLD sui dadi
        // (Dobbiamo recuperare l'ultima mano giocata e mostrare i btn dei suoi dadi)
        if (this.hands.length > 0) {
          const lastHand = this.hands[this.hands.length - 1];
          lastHand.dices.forEach((dObj) => {
            dObj.dice.btn.show();
          });
        }
      }
    }
  }

  // Aggiorniamo anche handleResults per usare getMaxHands invece di config fisso
  handleResults(dices) {
    console.log("Risultati mano:", dices);
    this.previousDices = dices;
    this.state.handsPlayed++;

    // --- LOGICA UPPER FOURS (Accumulo Chips) ---
    // 1. Controlla se l'effetto è attivo
    const foursEffect = Player.activeEffects.find((eff) => eff.category === "UpperFours");

    if (foursEffect) {
      // 2. Conta quanti 4 sono usciti in QUESTO lancio (escludendo quelli holdati)
      let foursCount = 0;
      dices.forEach((dObj) => {
        // dObj.dice.isHeld() ritorna true se il dado era bloccato PRIMA del lancio
        // Se non è bloccato, vuol dire che è appena stato tirato (o è il primo lancio)
        if (!dObj.dice.isHeld() && dObj.dice.value === 4) {
          foursCount++;
        }
      });

      // 3. Aggiorna il valore
      if (foursCount > 0) {
        const bonus = foursCount * 30;
        foursEffect.accumulatedValue = (foursEffect.accumulatedValue || 0) + bonus;
        console.log(`Upper Fours: trovati ${foursCount} dadi nuovi. Bonus totale: ${foursEffect.accumulatedValue}`);

        // 4. Aggiorna UI dello Stage per mostrare il nuovo numero
        this.stage.renderActiveEffects();
      }
    }

    // USIAMO IL CALCOLO DINAMICO
    const currentMax = this.getMaxHands();
    const left = currentMax - this.state.handsPlayed;
    this.statsPanel.setRollsLeft(left);

    const $track = this.clip.find(".js-combinations-track");
    $track.empty();
    if (this.state.handsPlayed >= currentMax) {
      jQuery(".js-btn-roll", this.clip).off("click").hide();
      dices.forEach((dObj) => dObj.dice.btn.hide());
    }

    // ... (il resto clearHighlights, evaluateHand rimane uguale) ...
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

  onCardSelected(matchData, staticData, $selectedCard) {
    this.clip.addClass("input-locked");

    // --- 1. GESTIONE UPPER (Acquisizione) ---
    if (matchData.type === "upper") {
      const acquired = this.stage.acquireConsumable(matchData, staticData);
      if (!acquired) {
        this.clip.removeClass("input-locked");
        return;
      }
      // Continua per calcolare i punti della carta stessa...
    }

    // --- CALCOLO BONUS ATTIVI ---

    // 1. Bonus CHIPS Variabile (Fours)
    let bonusChips = 0;
    const foursEffect = Player.activeEffects.find((eff) => eff.category === "UpperFours");
    if (foursEffect && foursEffect.accumulatedValue) {
      bonusChips += foursEffect.accumulatedValue;
    }

    // 2. Bonus CHIPS Fisso (Sixes)
    const sixesEffect = Player.activeEffects.find((eff) => eff.category === "UpperSixes");
    if (sixesEffect) {
      bonusChips += 50;
    }

    // 3. Bonus MULT (Fives)
    let bonusMult = 0;
    const fivesEffect = Player.activeEffects.find((eff) => eff.category === "UpperFives");
    if (fivesEffect) {
      bonusMult += 5;
    }

    // --- 2. CALCOLO PUNTEGGIO ---
    let total = 0;

    if (matchData.type === "lower") {
      // Lower: (Base Chips + Dadi + BonusChips) * (Base Mult + BonusMult)
      const chips = staticData.baseChips + matchData.score + bonusChips;
      const mult = staticData.baseMult + bonusMult;

      total = chips * mult;
      console.log(`Score Calc Lower: Chips(${chips}) * Mult(${mult}) = ${total}`);
    } else {
      // Upper: (Score Dadi + BonusChips) * (1 + BonusMult)
      // Nota: Le Upper di solito non hanno mult, quindi partiamo da 1 base.
      const chips = matchData.score + bonusChips;
      const mult = 1 + bonusMult;

      total = chips * mult;
      console.log(`Score Calc Upper: Chips(${chips}) * Mult(${mult}) = ${total}`);
    }

    // --- 3. FINALIZZAZIONE ---
    this._finalizeSelection(total, matchData, staticData, $selectedCard);
  }

  /**
   * Helper per chiudere il round
   */
  _finalizeSelection(total, matchData, staticData, $selectedCard) {
    // A. Aggiorna Stato Globale
    Player.totalScore += total;
    this.state.score += total;
    this.statsPanel.update();

    // B. Consuma la carta dalla lista (Lista SX o DX)
    if (matchData.type === "lower") {
      // *** FIX: RIMOSSO IL CODICE CHE AGGIUNGEVA .disabled MANUALMENTE ***
      // Prima c'era: if(clip) clip.addClass('disabled')...

      // Rimuoviamo solo l'highlight perché la selezione è finita
      const clip = this.lowers.getClip(matchData.category);
      if (clip) clip.removeClass("highlight");

      // Chiamiamo consume: sarà LUI a decidere se mettere .disabled o no
      // in base a quante copie sono rimaste.
      this.lowers.consume(matchData.category);
    } else {
      // Per le Upper la logica rimane semplice (ne hai 1, la usi, sparisce)
      const clip = this.uppers.getClip(matchData.category);
      if (clip) clip.addClass("disabled").removeClass("highlight");
      this.uppers.consume(matchData.category);
    }

    // C. Fase Teatrale (Animazioni)
    this.clip.find(".js-btn-roll").hide();
    this.clip.find(".btn-hold").hide();

    $selectedCard.siblings().addClass("fade-out-card");

    setTimeout(() => {
      $selectedCard.siblings().remove();
    }, 300);

    const $btnAction = $selectedCard.find(".js-btn-action");
    // Cambiamo testo in base al tipo
    const actionText = matchData.type === "lower" ? "USATA" : "PRESA";
    $btnAction.prop("disabled", true).text(actionText);
    $selectedCard.addClass("selected-locked");

    // D. Mostra Punteggio (+12 o +150)
    setTimeout(() => {
      const $scoreDisplay = jQuery(`<div class="score-reveal">+${total}</div>`);
      this.clip.find(".js-combinations-track").append($scoreDisplay);
    }, 600);

    console.log(`Attendo il reveal...`);
    setTimeout(() => {
      this.endRound();
    }, Round.SHOW_SCORE_DURATION + 600);
  }

  // Modifichiamo endRound
  endRound() {
    // 1. Incrementa valore investimenti (Twos)
    if (this.stage) {
      this.stage.incrementEconomy();

      // 2. Pulisci effetti scaduti (One-shot)
      this.stage.cleanupEffects("round");
    }

    if (this.onRoundComplete) {
      this.onRoundComplete();
    }
  }
}
