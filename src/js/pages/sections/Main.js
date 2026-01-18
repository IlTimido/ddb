import Dice from "./classes/Dice";
import jQuery from "jquery";

export default class Main {
  constructor() {}

  init() {
    this.throwDices();
  }

  throwDices() {
    const row = Main.addRow();
    for (let i = 0; i < 5; i++) {
      const dice = new Dice();
      const diceEl = dice.show();
      row.append(diceEl);
    }
    jQuery(".js-main").append(row);
  }

  static addRow() {
    return jQuery('<div class="row"></div>');
  }
}
