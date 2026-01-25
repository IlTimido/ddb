import jQuery from "jquery";
import Run from "./classes/Run";

export default class Main {
  run = null;
  constructor() {}

  init() {
    this.run = new Run();
    this.run.init();
  }
}
