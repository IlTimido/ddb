export default class ScoreSheet {
  static LOWER_CHANCE = "LowerChance";
  static LOWER_PAIR = "LowerPair";
  static LOWER_TWO_PAIRS = "LowerTwoPairs";
  static LOWER_THREE_OF_A_KIND = "LowerThreeOfAKind";
  static LOWER_SMALL_STRAIGHT = "LowerSmallStraight";
  static LOWER_ALL_DIFFERENT = "LowerAllDifferent";
  static LOWER_FULL_HOUSE = "LowerFullHouse";
  static LOWER_ALL_EVEN = "LowerAllEven";
  static LOWER_ALL_ODD = "LowerAllOdd";
  static LOWER_LARGE_STRAIGHT = "LowerLargeStraight";
  static LOWER_FOUR_OF_A_KIND = "LowerFourOfAKind";
  static LOWER_FIVE_OF_A_KIND = "LowerFiveOfAKind";

  static UPPER_ONES = "UpperOnes";
  static UPPER_TWOS = "UpperTwos";
  static UPPER_THREES = "UpperThrees";
  static UPPER_FOURS = "UpperFours";
  static UPPER_FIVES = "UpperFives";
  static UPPER_SIXES = "UpperSixes";

  // --- MODIFICATO: NUOVI VALORI BILANCIATI ---
  static LOWERS_DATA = [
    // TIER 1: Safety
    { entry: ScoreSheet.LOWER_CHANCE, name: "Chance", description: "Somma tutti i dati.", baseMult: 1, baseChips: 5 },
    { entry: ScoreSheet.LOWER_PAIR, name: "Pair", description: "Almeno una coppia di dadi uguali.", baseMult: 2, baseChips: 10 },

    // TIER 2: Common
    { entry: ScoreSheet.LOWER_TWO_PAIRS, name: "Two Pairs", description: "Due coppie di dadi uguali.", baseMult: 3, baseChips: 20 },
    { entry: ScoreSheet.LOWER_THREE_OF_A_KIND, name: "Three of a Kind", description: "Almeno tre dadi uguali.", baseMult: 3, baseChips: 30 },

    // TIER 3: Strategy
    { entry: ScoreSheet.LOWER_SMALL_STRAIGHT, name: "Small Straight", description: "Quattro numeri consecutivi.", baseMult: 4, baseChips: 30 },
    { entry: ScoreSheet.LOWER_ALL_DIFFERENT, name: "All Different", description: "Tutti i dadi con numeri diversi.", baseMult: 4, baseChips: 40 },
    { entry: ScoreSheet.LOWER_FULL_HOUSE, name: "Full House", description: "Un tris e una coppia.", baseMult: 5, baseChips: 40 },

    // TIER 4: Hard
    { entry: ScoreSheet.LOWER_ALL_EVEN, name: "All Even", description: "Tutti i dadi con numeri pari.", baseMult: 6, baseChips: 50 },
    { entry: ScoreSheet.LOWER_ALL_ODD, name: "All Odd", description: "Tutti i dadi con numeri dispari.", baseMult: 6, baseChips: 50 },
    { entry: ScoreSheet.LOWER_LARGE_STRAIGHT, name: "Large Straight", description: "Cinque numeri consecutivi.", baseMult: 7, baseChips: 60 },

    // TIER 5: Jackpot
    { entry: ScoreSheet.LOWER_FOUR_OF_A_KIND, name: "Four of a Kind", description: "Almeno quattro dadi uguali.", baseMult: 8, baseChips: 70 },
    { entry: ScoreSheet.LOWER_FIVE_OF_A_KIND, name: "Five of a Kind", description: "Tutti i dadi uguali.", baseMult: 15, baseChips: 120 },
  ];

  static UPPERS_DATA = [
    { entry: ScoreSheet.UPPER_ONES, name: "Ones", description: "Somma dei dadi con valore 1.", tier0: "Un tiro extra in qualunque round.", tier1: "Un tiro extra in qualunque tappa." },
    { entry: ScoreSheet.UPPER_TWOS, name: "Twos", description: "Somma dei dadi con valore 2.", tier0: "Ogni round incrementa il valore di 1, venduta automticamente a fine tappa.", tier1: "Ogni tappa incrementa il valore di 1, venduta automaticamente a fine percorso." },
    { entry: ScoreSheet.UPPER_THREES, name: "Threes", description: "Somma dei dadi con valore 3.", tier0: "Aggiunge 2 categorie Lower casuali alla tappa corrente.", tier1: "Aggiunge 2 categorie Lower scelte dal giocatore alla tappa corrente." },
    { entry: ScoreSheet.UPPER_FOURS, name: "Fours", description: "Somma dei dadi con valore 4.", tier0: "+30 chips per ogni dado del valore 4 che esce in questo round.", tier1: "+30 chips per ogni dado del valore 4 che esce nel round in cui si gioca questa Upper." },
    { entry: ScoreSheet.UPPER_FIVES, name: "Fives", description: "Somma dei dadi con valore 5.", tier0: "+5 mult al punteggio totale di questo round.", tier1: "+5 mult al punteggio totale del round in cui si gioca questa Upper." },
    { entry: ScoreSheet.UPPER_SIXES, name: "Sixes", description: "Somma dei dadi con valore 6.", tier0: "+50 chips al punteggio totale di questo round.", tier1: "+50 chips al punteggio totale del round in cui si gioca questa Upper." },
  ];

  static getAllLowers() {
    return [ScoreSheet.LOWER_CHANCE, ScoreSheet.LOWER_PAIR, ScoreSheet.LOWER_TWO_PAIRS, ScoreSheet.LOWER_THREE_OF_A_KIND, ScoreSheet.LOWER_SMALL_STRAIGHT, ScoreSheet.LOWER_ALL_DIFFERENT, ScoreSheet.LOWER_FULL_HOUSE, ScoreSheet.LOWER_ALL_EVEN, ScoreSheet.LOWER_ALL_ODD, ScoreSheet.LOWER_LARGE_STRAIGHT, ScoreSheet.LOWER_FOUR_OF_A_KIND, ScoreSheet.LOWER_FIVE_OF_A_KIND];
  }

  static getAllUppers() {
    return [ScoreSheet.UPPER_ONES, ScoreSheet.UPPER_TWOS, ScoreSheet.UPPER_THREES, ScoreSheet.UPPER_FOURS, ScoreSheet.UPPER_FIVES, ScoreSheet.UPPER_SIXES];
  }

  /**
   * FASE 1: Valutazione della mano.
   * Analizza i dadi e le liste disponibili per trovare le combinazioni valide.
   * * @param {Array} dices - Array [{dice: Obj, element: jQuery}, ...]
   * @param {Lowers} lowersManager - Istanza della classe Lowers
   * @param {Uppers} uppersManager - Istanza della classe Uppers
   * @returns {Array} Array di oggetti match: { category: string, type: 'lower'|'upper', score: number, description: string }
   */
  static evaluateHand(dices, lowersManager, uppersManager) {
    const values = dices.map((d) => d.dice.value); // Estraiamo solo i numeri [1, 3, 3, 5, 6]

    // Calcoliamo i dati statistici della mano (frequenze, somme, ecc.)
    const stats = ScoreSheet._analyzeDice(values);
    const validMatches = [];

    // --- 1. CONTROLLO UPPERS ---
    // Iteriamo sulle entry che il giocatore HA effettivamente nella sua lista
    uppersManager.items.forEach((item) => {
      const category = item.entry; // Es. "Ones", "Twos"

      // Calcola il punteggio (o controlla validità) per questa categoria
      const result = ScoreSheet._checkUpper(category, stats);

      if (result.isValid) {
        validMatches.push({
          category: category,
          type: "upper",
          score: result.score, // Es. Somma dei dadi di quel numero
          tier: result.tier,
          // Qui potremmo aggiungere altre info per la card (es. "Level 1")
        });
      }
    });

    // --- 2. CONTROLLO LOWERS ---
    lowersManager.items.forEach((item) => {
      const category = item.entry; // Es. "Full House"

      // Calcola validità per questa categoria
      const result = ScoreSheet._checkLower(category, stats);

      if (result.isValid) {
        validMatches.push({
          category: category,
          type: "lower",
          score: result.score,
          indices: result.indices,
          // Aggiungiamo un flag per dire se è un match "esatto" o parziale se serve
        });
      }
    });

    return validMatches;
  }

  // ==========================================
  // HELPERS LOGICI (Privati)
  // ==========================================

  /**
   * Crea un oggetto con le statistiche dei dadi per facilitare i controlli
   */
  static _analyzeDice(values) {
    const counts = {}; // Mappa frequenze: { 1: 0, 2: 3, ... }
    let sum = 0;

    // Inizializza a 0
    for (let i = 1; i <= 6; i++) counts[i] = 0;

    values.forEach((v) => {
      counts[v]++;
      sum += v;
    });

    // Array delle frequenze (es. [0, 2, 3, 0, 0, 0] per un Full House di 2 e 3)
    const frequencies = Object.values(counts);
    // Valori unici ordinati (per le scale)
    const uniqueSorted = [...new Set(values)].sort((a, b) => a - b);

    return { values, counts, sum, frequencies, uniqueSorted };
  }

  static _checkUpper(category, stats) {
    let targetNum = 0;

    switch (category) {
      case ScoreSheet.UPPER_ONES:
        targetNum = 1;
        break;
      case ScoreSheet.UPPER_TWOS:
        targetNum = 2;
        break;
      case ScoreSheet.UPPER_THREES:
        targetNum = 3;
        break;
      case ScoreSheet.UPPER_FOURS:
        targetNum = 4;
        break;
      case ScoreSheet.UPPER_FIVES:
        targetNum = 5;
        break;
      case ScoreSheet.UPPER_SIXES:
        targetNum = 6;
        break;
      default:
        return { isValid: false, score: 0 };
    }

    const count = stats.counts[targetNum];

    // LOGICA TIER:
    // 2 o 3 dadi = Tier 0 (Visualizzato come Tier 1)
    // 4 o 5 dadi = Tier 1 (Visualizzato come Tier 2)

    if (count >= 2) {
      const tier = count >= 4 ? 1 : 0;
      return { isValid: true, score: count * targetNum, tier: tier };
    }

    return { isValid: false, score: 0 };
  }

  static _checkLower(category, stats) {
    const f = stats.frequencies;
    const v = stats.values; // Array originale dei valori [es. 1, 3, 3, 5, 6]
    let isValid = false;
    let score = 0;
    let indices = []; // Qui salveremo gli indici dei dadi da colorare

    switch (category) {
      case ScoreSheet.LOWER_CHANCE:
        isValid = true;
        score = stats.sum;
        indices = [0, 1, 2, 3, 4]; // Tutti validi
        break;

      case ScoreSheet.LOWER_PAIR:
        // Trova il numero che compare >= 2 volte (partendo dal più alto)
        const pairVal = ScoreSheet._findValueByFrequency(stats, 2);
        isValid = pairVal > 0;
        if (isValid) {
          score = ScoreSheet._getNOfAKindScore(stats, 2);
          indices = ScoreSheet._getIndicesForVal(v, pairVal, 2); // Prendi 2 dadi con quel valore
        }
        break;

      case ScoreSheet.LOWER_TWO_PAIRS:
        // Logica un po' più complessa: trovare due numeri diversi con count >= 2
        const pairs = [];
        for (let i = 6; i >= 1; i--) {
          if (stats.counts[i] >= 2) pairs.push(i);
        }
        isValid = pairs.length >= 2;
        if (isValid) {
          score = stats.sum; // O regola specifica
          // Prendi i primi due dadi della prima coppia e i primi due della seconda
          const idx1 = ScoreSheet._getIndicesForVal(v, pairs[0], 2);
          const idx2 = ScoreSheet._getIndicesForVal(v, pairs[1], 2);
          indices = [...idx1, ...idx2];
        }
        break;

      case ScoreSheet.LOWER_THREE_OF_A_KIND:
        const threeVal = ScoreSheet._findValueByFrequency(stats, 3);
        isValid = threeVal > 0;
        if (isValid) {
          score = stats.sum;
          indices = ScoreSheet._getIndicesForVal(v, threeVal, 3);
        }
        break;

      case ScoreSheet.LOWER_FOUR_OF_A_KIND:
        const fourVal = ScoreSheet._findValueByFrequency(stats, 4);
        isValid = fourVal > 0;
        if (isValid) {
          score = stats.sum;
          indices = ScoreSheet._getIndicesForVal(v, fourVal, 4);
        }
        break;

      case ScoreSheet.LOWER_FIVE_OF_A_KIND:
        const fiveVal = ScoreSheet._findValueByFrequency(stats, 5);
        isValid = fiveVal > 0;
        if (isValid) {
          score = 50;
          indices = [0, 1, 2, 3, 4];
        }
        break;

      case ScoreSheet.LOWER_FULL_HOUSE:
        const tripla = ScoreSheet._findValueByFrequency(stats, 3);
        // Cerca la coppia (che non sia la tripla stessa, nel caso di 5 uguali che valgono come full)
        let coppia = 0;
        for (let i = 6; i >= 1; i--) {
          if (stats.counts[i] >= 2 && i !== tripla) coppia = i;
        }

        isValid = tripla > 0 && coppia > 0;
        if (isValid) {
          score = 25;
          indices = [...ScoreSheet._getIndicesForVal(v, tripla, 3), ...ScoreSheet._getIndicesForVal(v, coppia, 2)];
        }
        break;

      case ScoreSheet.LOWER_SMALL_STRAIGHT:
        const seqSmall = ScoreSheet._getStraightSequence(stats.uniqueSorted, 4);
        isValid = seqSmall.length === 4;
        if (isValid) {
          score = 30;
          indices = ScoreSheet._getIndicesForSequence(v, seqSmall);
        }
        break;

      case ScoreSheet.LOWER_LARGE_STRAIGHT:
        const seqLarge = ScoreSheet._getStraightSequence(stats.uniqueSorted, 5);
        isValid = seqLarge.length === 5;
        if (isValid) {
          score = 40;
          indices = ScoreSheet._getIndicesForSequence(v, seqLarge);
        }
        break;

      case ScoreSheet.LOWER_ALL_DIFFERENT:
        isValid = stats.uniqueSorted.length === 5;
        if (isValid) {
          score = stats.sum;
          indices = [0, 1, 2, 3, 4];
        }
        break;

      case ScoreSheet.LOWER_ALL_EVEN:
        isValid = stats.values.every((val) => val % 2 === 0);
        if (isValid) {
          score = stats.sum;
          indices = [0, 1, 2, 3, 4];
        }
        break;

      case ScoreSheet.LOWER_ALL_ODD:
        isValid = stats.values.every((val) => val % 2 !== 0);
        if (isValid) {
          score = stats.sum;
          indices = [0, 1, 2, 3, 4];
        }
        break;
    }

    return { isValid, score, indices };
  }

  // --- NUOVI HELPER ---

  static _findValueByFrequency(stats, n) {
    for (let i = 6; i >= 1; i--) {
      if (stats.counts[i] >= n) return i;
    }
    return 0;
  }

  // Restituisce gli indici dei dadi che hanno un certo valore (limitato a 'count' occorrenze)
  static _getIndicesForVal(allValues, targetVal, countNeeded) {
    const found = [];
    allValues.forEach((v, idx) => {
      if (v === targetVal && found.length < countNeeded) {
        found.push(idx);
      }
    });
    return found;
  }

  // Restituisce la sequenza di numeri (es. [1,2,3,4]) se esiste
  static _getStraightSequence(uniqueSorted, lengthRequired) {
    if (uniqueSorted.length < lengthRequired) return [];
    let currentSeq = [uniqueSorted[0]];

    for (let i = 0; i < uniqueSorted.length - 1; i++) {
      if (uniqueSorted[i + 1] === uniqueSorted[i] + 1) {
        currentSeq.push(uniqueSorted[i + 1]);
      } else {
        if (currentSeq.length >= lengthRequired) return currentSeq;
        currentSeq = [uniqueSorted[i + 1]];
      }
    }
    return currentSeq.length >= lengthRequired ? currentSeq.slice(0, lengthRequired) : [];
  }

  // Mappa una sequenza di valori (es [1,2,3,4]) agli indici originali dei dadi
  static _getIndicesForSequence(allValues, sequence) {
    const indices = [];
    const usedIndices = new Set();

    sequence.forEach((targetVal) => {
      // Trova il primo indice di questo valore che non abbiamo ancora usato
      const idx = allValues.findIndex((v, i) => v === targetVal && !usedIndices.has(i));
      if (idx !== -1) {
        usedIndices.add(idx);
        indices.push(idx);
      }
    });
    return indices;
  }

  // Calcola somma per N of a Kind (prende il valore più alto se ce ne sono più di uno)
  static _getNOfAKindScore(stats, n) {
    // Trova il numero più alto che appare almeno n volte
    for (let i = 6; i >= 1; i--) {
      if (stats.counts[i] >= n) {
        return i * n;
      }
    }
    return 0;
  }

  // Algoritmo generico per le scale
  static _checkStraight(uniqueSorted, lengthRequired) {
    if (uniqueSorted.length < lengthRequired) return false;

    let consecutive = 1;
    for (let i = 0; i < uniqueSorted.length - 1; i++) {
      // Se il prossimo numero è esattamente attuale + 1
      if (uniqueSorted[i + 1] === uniqueSorted[i] + 1) {
        consecutive++;
      } else {
        consecutive = 1; // Reset se sequenza rotta
      }
      if (consecutive >= lengthRequired) return true;
    }
    return consecutive >= lengthRequired;
  }
}
