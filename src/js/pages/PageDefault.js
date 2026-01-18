import Pqp from "../3x1010/Pqp";
import Main from "./sections/Main";

export default class PageDefault {
  main;
  init() {
    Pqp.activateRandomSeed();
    this.main = new Main();
    this.main.init();
  }
}
