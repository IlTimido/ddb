import "../scss/styles.scss";
import jQuery from "jquery";
import PageDefault from "./pages/PageDefault";

// jQuery non dipende da FactoryManager, quindi può stare qui
window.jQuery = window.$ = jQuery;

// 1. Definiamo la classe
export default class FactoryManager {
  static factory(cls) {
    return new FactoryManager.classes[cls]();
  }
}

// 2. ORA che la classe esiste, aggiungiamo le proprietà statiche
FactoryManager.classes = { PageDefault };

// 3. E infine esponiamola a window per l'HTML
window.FactoryManager = FactoryManager;
