import jQuery from "jquery";

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

    // Usiamo i caratteri box-drawing per una cornice unita
    // ┌───┐
    // │ o │
    // └───┘
    let asciiArt = "┌─────┐\n";
    asciiArt += `│ ${p[0]} │\n`;
    asciiArt += `│ ${p[1]} │\n`;
    asciiArt += `│ ${p[2]} │\n`;
    asciiArt += "└─────┘";

    // Creiamo il div con jQuery esplicito
    const el = jQuery(`<div class="dice"><pre>${asciiArt}</pre></div>`);

    return el;
  }

  _getAsciiPattern(val) {
    // Pattern compatti 3x3
    // 'o' = punto (puoi anche usare un bullet '•' per farlo più pieno)
    const dot = "o";
    // const dot = "•"; // Alternativa più carina

    const patterns = {
      1: ["   ", ` ${dot} `, "   "],
      2: [`${dot}  `, "   ", `  ${dot}`],
      3: [`${dot}  `, ` ${dot} `, `  ${dot}`],
      4: [`${dot} ${dot}`, "   ", `${dot} ${dot}`],
      5: [`${dot} ${dot}`, ` ${dot} `, `${dot} ${dot}`],
      6: [`${dot} ${dot}`, `${dot} ${dot}`, `${dot} ${dot}`],
    };

    return patterns[val] || patterns[1];
  }
}
