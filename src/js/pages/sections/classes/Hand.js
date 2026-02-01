import Dice from "./Dice";
import jQuery from "jquery"; // Assicuriamoci di avere jQuery

export default class Hand {
  clip = null;
  callback = null;
  dices = [];
  previousDices = [];

  constructor(clip, callback, previousDices = []) {
    this.clip = jQuery(".js-dice-container", clip);
    // Non svuotiamo subito qui, lo facciamo in launchDices
    this.callback = callback;
    this.previousDices = previousDices;

    // Riferimento al container principale per il blocco input
    this.$gameContainer = this.clip.closest(".game-container");
  }

  init() {
    this.launchDices();
  }

  launchDices() {
    this.clip.empty();

    // 1. BLOCCA LO SCHERMO
    this.$gameContainer.addClass("input-locked");

    const newDiceObjects = [];

    // 2. CREAZIONE OGGETTI (ma non mostriamo ancora i valori finali nuovi)
    for (let i = 0; i < 5; i++) {
      const previousDice = this.previousDices ? this.previousDices[i] : null;

      // CASO A: DADO HOLDATO (Nessuna animazione)
      if (previousDice && previousDice.dice.held) {
        const dice = new Dice(previousDice.dice.getValue());
        dice.held = true;
        const diceEl = dice.show();
        this.clip.append(diceEl);
        newDiceObjects.push({ dice: dice, element: diceEl });
      }
      // CASO B: DADO DA TIRARE (Animazione)
      else {
        // Creiamo il dado. Il costruttore genera già un valore random (il risultato finale),
        // MA noi visualmente mostreremo un'animazione prima di svelarlo.
        const dice = new Dice();
        const diceEl = dice.show();

        // Aggiungiamo la classe che fa tremare il dado
        diceEl.addClass("dice-rolling");

        this.clip.append(diceEl);
        newDiceObjects.push({ dice: dice, element: diceEl });
      }
    }

    this.dices = newDiceObjects;

    // 3. IL TEMPO DELL'ATTESA (600ms di suspense)
    setTimeout(() => {
      // 4. FINE ANIMAZIONE
      this.dices.forEach((dObj) => {
        if (dObj.element.hasClass("dice-rolling")) {
          // Ferma il tremolio
          dObj.element.removeClass("dice-rolling");
          // Aggiorna la faccia col numero vero uscito
          dObj.dice.updateFace();
        }
      });

      // 5. SBLOCCA LO SCHERMO
      this.$gameContainer.removeClass("input-locked");

      // 6. PROCEDI COL GIOCO
      this.callback(this.dices);
    }, 600); // Durata dell'animazione
  }
}
