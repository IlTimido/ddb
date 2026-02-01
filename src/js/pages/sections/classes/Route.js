import Stage from "./Stage";
import WinAlert from "../helpers/WinAlert";
import jQuery from "jquery";

export default class Route {
  stage = null;
  currentStageIndex = 0;
  config = null;
  stages = [];

  constructor(config) {
    this.config = config;
    this.stages = config.stages;
  }

  init() {
    this.loadStage(this.currentStageIndex);
  }

  loadStage(index) {
    if (index >= this.stages.length) {
      WinAlert.show("VITTORIA TOTALE", "Hai completato tutte le tappe della Run!");
      return;
    }

    // Cleanup visivo
    if (this.stage) {
      jQuery(".js-stage-name").empty();
    }

    this.currentStageIndex = index;
    const stageConfig = this.stages[this.currentStageIndex];

    // *** IMPORTANTE: Passiamo la callback (secondo parametro) ***
    this.stage = new Stage(stageConfig, () => this.onStageComplete());
    this.stage.init();
  }

  // Questa viene chiamata quando lo Stage finisce (dopo lo Shop)
  onStageComplete() {
    console.log("Stage Completato. Carico il prossimo...");
    this.loadStage(this.currentStageIndex + 1);
  }
}
