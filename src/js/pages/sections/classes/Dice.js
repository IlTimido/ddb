import jQuery from "jquery";

export default class Dice {
  static faces = 6;
  value;
  held = false; // Stato iniziale: non bloccato

  constructor() {
    this.roll();
  }

  roll() {
    // Se il dado è bloccato, tecnicamente non dovrebbe essere "rollato" dal DiceManager,
    // ma lasciamo che sia il manager a decidere se chiamare questo metodo o no.
    this.value = Math.floor(Math.random() * Dice.faces) + 1;
    return this.value;
  }

  toggleHold() {
    this.held = !this.held;
  }

  isHeld() {
    return this.held;
  }

  show() {
    const p = this._getAsciiPattern(this.value);
    const dot = "o"; // o "•"

    // Disegno ASCII
    let asciiArt = "┌─────┐\n";
    asciiArt += `│ ${p[0]} │\n`;
    asciiArt += `│ ${p[1]} │\n`;
    asciiArt += `│ ${p[2]} │\n`;
    asciiArt += "└─────┘";

    // 1. Creiamo un container per allineare dado e bottone in verticale
    const $container = jQuery('<div class="dice-wrapper"></div>');

    // 2. Il dado vero e proprio
    const $visual = jQuery(`<div class="dice"><pre>${asciiArt}</pre></div>`);

    // 3. Il pulsante HOLD
    const $btn = jQuery('<button type="button" class="btn-hold">HOLD</button>');

    // Applichiamo lo stato visivo corrente (se stiamo ridisegnando un dado già bloccato)
    if (this.held) {
      $btn.addClass("active");
    }

    // Gestione Click
    $btn.on("click", () => {
      this.toggleHold(); // Aggiorna lo stato logico (true/false)
      $btn.toggleClass("active"); // Aggiorna lo stato visivo (colore)
    });

    // Assembliamo il tutto
    $container.append($visual);
    $container.append($btn);

    return $container;
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
