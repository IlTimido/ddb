import Dice from "./Dice";

export default class Hand {
  clip = null;
  callback = null;
  dices = [];
  previousDices = [];
  constructor(clip, callback, previousDices = []) {
    this.clip = jQuery(".js-dice-container", clip);
    this.clip.empty();
    this.callback = callback;
    this.previousDices = previousDices;
  }

  init() {
    this.launchDices();
  }

  launchDices() {
    //  this.clip = Rower.create();
    for (let i = 0; i < 5; i++) {
      // Controlla se il previousDices ha un hold su questo dado
      const previousDice = this.previousDices ? this.previousDices[i] : null;
      if (previousDice && previousDice.dice.held) {
        // Riutilizza il valore del dado precedente
        const dice = new Dice(previousDice.dice.getValue());
        dice.held = true; // Mantieni lo stato hold
        const diceEl = dice.show();

        this.clip.append(diceEl);
        this.dices.push({ dice: dice, element: diceEl });
      } else {
        const dice = new Dice();
        const diceEl = dice.show();
        this.clip.append(diceEl);
        this.dices.push({ dice: dice, element: diceEl });
      }
    }
    this.callback(this.dices);
  }
}
