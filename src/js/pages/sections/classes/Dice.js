import $ from "jquery";

export default class Dice {
  static faces = 6;
  value;

  constructor() {
    this.roll();
  }

  roll() {
    this.value = Math.floor(Math.random() * Dice.faces) + 1;
    return this.value;
  }

  show() {
    const p = this._getAsciiPattern(this.value);

    // Cornice ridotta per adattarsi al contenuto di 3 caratteri (+---+ sono 5 char totali)
    let asciiArt = "+-----+\n";
    asciiArt += `| ${p[0]} |\n`;
    asciiArt += `| ${p[1]} |\n`;
    asciiArt += `| ${p[2]} |\n`;
    asciiArt += "+-----+";

    // Usiamo <pre> per l'ASCII art
    const $el = $(`<div class="dice"><pre>${asciiArt}</pre></div>`);

    return $el;
  }

  _getAsciiPattern(val) {
    // Pattern compatti 3x3
    // 'o' = punto, ' ' = spazio
    const patterns = {
      1: ["   ", " o ", "   "],
      2: ["o  ", "   ", "  o"],
      3: ["o  ", " o ", "  o"],
      4: ["o o", "   ", "o o"],
      5: ["o o", " o ", "o o"],
      6: ["o o", "o o", "o o"],
    };

    return patterns[val] || patterns[1];
  }
}
