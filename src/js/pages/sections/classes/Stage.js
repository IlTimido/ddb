import Lowers from "./Lowers";
import Player from "./Player";
import Round from "./Round";
import StatsPanel from "./StatsPanel";
import Uppers from "./Uppers";

export default class Stage {
  clip = null;
  statsPanel = null;
  config = null;
  currentRoundIndex = -1;
  rounds = [];
  lowers = [];
  uppers = [];

  constructor(config) {
    this.config = config;
  }

  init() {
    this.createStageScreen();
    this.nextRound();
  }

  nextRound() {
    this.currentRoundIndex++;
    const round = new Round(this.currentRoundIndex, this.statsPanel, this.clip, this.config, this.lowers, this.uppers);
    this.rounds.push(round);
    round.init();
  }

  createStageScreen() {
    console.log(this.config);
    this.clip = jQuery("#template_screen_game").clone();
    this.clip.removeAttr("id");
    jQuery(".js-main").append(this.clip);
    // Nome tappa
    jQuery(".js-stage-name", this.clip).text(this.config.name);
    this.statsPanel = new StatsPanel(jQuery(".js-stats-panel", this.clip));
    this.statsPanel.init(this.config, this.rounds);
    // Inizializza lowers e uppers
    this.lowers = new Lowers(this.clip, this.config.lowers.slice());
    this.lowers.init();
    this.uppers = new Uppers(this.clip, this.config.uppers.slice());
    this.uppers.init();
    // Inizializza i gold
    jQuery(".js-total-gold", this.clip).text(Player.gold);
  }
}
