import jQuery from "jquery";

export default class Dice {
  static faces = 6;
  value;
  held = false;
  btn = null;
  $visual = null; // Salviamo il riferimento al div visuale

  constructor(forcedValue = null) {
    if (forcedValue !== null) {
      this.value = forcedValue;
    } else {
      this.roll();
    }
  }

  roll() {
    this.value = Math.floor(Math.random() * Dice.faces) + 1;
    return this.value;
  }

  getValue() {
    return this.value;
  }

  toggleHold() {
    this.held = !this.held;
  }

  isHeld() {
    return this.held;
  }

  // Metodo per aggiornare SOLO il disegno (usato post-animazione)
  updateFace() {
    if (this.$visual) {
      const asciiArt = this._generateAscii(this.value);
      this.$visual.find("pre").text(asciiArt);
    }
  }

  show() {
    const asciiArt = this._generateAscii(this.value);

    const $container = jQuery('<div class="dice-wrapper"></div>');
    // Salviamo il riferimento a $visual
    this.$visual = jQuery(`<div class="dice"><pre>${asciiArt}</pre></div>`);

    const $btn = jQuery('<button type="button" class="btn-hold">HOLD</button>');
    this.btn = $btn;

    if (this.held) {
      $btn.addClass("active");
    }

    $btn.on("click", () => {
      this.toggleHold();
      $btn.toggleClass("active");
    });

    $container.append(this.$visual);
    $container.append($btn);

    return $container;
  }

  // Ho estratto la generazione dell'ASCII in un helper per poterlo riusare in updateFace
  _generateAscii(val) {
    const p = this._getAsciiPattern(val);
    let art = "┌─────┐\n";
    art += `│ ${p[0]} │\n`;
    art += `│ ${p[1]} │\n`;
    art += `│ ${p[2]} │\n`;
    art += "└─────┘";
    return art;
  }

  _getAsciiPattern(val) {
    const dot = "o";
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
