import Stage from "./Stage";

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
    this.stage = new Stage(this.stages[this.currentStageIndex]);
    this.stage.init();
  }
}
