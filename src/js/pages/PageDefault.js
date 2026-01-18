import Pqp from "../3x1010/Pqp";

export default class PageDefault {
  init() {
    Pqp.activateRandomSeed();
    // eslint-disable-next-line no-console
    console.log("-->PageDefault initialized");
  }
}
