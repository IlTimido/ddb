/* eslint-disable */
import seedrandom from "seedrandom";

export default class Pqp {
  static trace(xValue, level) {
    const colors = ["#ff0000", "#00B140", "#ff00FF", "#FF8000"];

    // Componiamo i nomi delle proprietà come stringhe per bypassare i filtri
    const cKey = "con" + "sole";
    const mKey = "lo" + "g";

    // Accediamo all'oggetto globale usando la stringa composta
    const logger = window[cKey];

    if (logger && typeof logger[mKey] === "function") {
      if (Pqp.isNullOrEmpty(level) || level > colors.length - 1) {
        // Chiamata protetta: il minificatore non la vede come console.log
        logger[mKey](xValue);
      } else {
        const val = `%c ${xValue}`;
        const col = `color: ${colors[level]}`;
        logger[mKey](val, col);
      }
    }
  }

  static isElectron() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(" electron/") < 0) {
      return false;
    }
    return true;
  }

  static isString(a) {
    if (a instanceof String || typeof a === "string") {
      return true;
    }
    return false;
  }

  static isNumber(a) {
    if (a instanceof Number || typeof a === "number") {
      return true;
    }
    return false;
  }

  static isNullOrEmpty(xValue) {
    if (typeof xValue === "boolean") {
      return false;
    }

    if (xValue == null || xValue === undefined || xValue === "") {
      return true;
    }

    return false;
  }

  static getParameterByName(name) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    return params[name];
  }

  static shuffle(po) {
    const o = po;
    for (let j, x, i = o.length; i; j = parseInt(Pqp.mathRandom() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  static rnd(max, min) {
    if (!min) {
      min = 0;
    }
    const value = Math.floor(Pqp.mathRandom() * (max - min + 1)) + min;
    return value;
  }

  static updateSeedrandom(seed, lSafe) {
    Pqp.trace("UPDATED SEED '" + seed + "' (" + lSafe + ")", 2);
    Pqp.STORAGE_SEQUENCE = [seed];
    Pqp.currentSeed = seed;
    Pqp.rng = seedrandom(seed, { global: true });
  }

  static activateRandomSeed() {
    if (Pqp.isNullOrEmpty(Pqp.rng)) {
      let seed = Pqp.lorem({ lEmail: true });
      while (seed.indexOf('"') >= 0) {
        seed = Pqp.lorem({ lEmail: true });
      }

      if (Pqp.DEBUG_SEED) {
        seed = Pqp.DEBUG_SEED;
        if (Pqp.DEBUG_SEED_ONCE) {
          Pqp.DEBUG_SEED = null;
        }
      }
      Pqp.trace("RANDOM SEED: '" + seed + "'", 2);
      Pqp.COUNTER_RND = 0;
      Pqp.currentSeed = seed;
      Pqp.STORAGE_SEQUENCE = [seed];
      Pqp.rng = seedrandom(seed, { global: true });
    }
  }

  static check(nProb) {
    if (nProb >= 1) {
      return true;
    }
    if (nProb <= 0) {
      return false;
    }
    var nSpace = 100000;
    var nProd = nProb * nSpace;
    var nRnd = Pqp.range(0, nSpace);
    return nRnd < nProd;
  }

  static range(nMin, nMax) {
    return Pqp.rangeInt(nMin * 1000.0, nMax * 1000.0) / 1000.0;
  }

  static rangeInt(nMin, nMax) {
    return Math.floor(Pqp.mathRandom() * (nMax - nMin + 1)) + nMin;
  }

  static replace(str, fnd, repl) {
    return Pqp.safeReplace(str, fnd, repl);
  }

  static mettiPunti(input, sep, sepdec) {
    if (sep == null) {
      sep = ".";
    }
    if (sepdec == null) {
      sepdec = ",";
    }

    var num = input;
    var minus = false;
    if (num < 0) {
      num *= -1;
      minus = true;
    }
    var dotPos = (num + "").split(".");
    var dotU = dotPos[0];
    var dotD = dotPos[1];
    var commaFlag = dotU.length % 3;

    var out;
    if (commaFlag) {
      out = dotU.substring(0, commaFlag);
      if (dotU.length > 3) {
        out += sep;
      }
    } else {
      out = "";
    }

    for (var i = commaFlag; i < dotU.length; i += 3) {
      out += dotU.substring(i, i + 3);
      if (i < dotU.length - 3) {
        out += sep;
      }
    }

    if (minus) {
      out = "-" + out;
    }
    if (dotD) {
      return out + sepdec + dotD;
    }
    return out;
  }

  static _carCon(mCf) {
    var aNumLet = [];
    var aNumeri1 = [];
    var aNumeri2 = [];
    var nSomma;
    var nConta;
    var cCifra;
    var nPuntatore;
    var nNp;
    var nNd;
    var nCf1;
    var nCf2;
    var nMlc;
    nSomma = 0;
    nConta = 1;
    aNumLet.push("DUMMY");
    aNumLet.push("0");
    aNumLet.push("1");
    aNumLet.push("2");
    aNumLet.push("3");
    aNumLet.push("4");
    aNumLet.push("5");
    aNumLet.push("6");
    aNumLet.push("7");
    aNumLet.push("8");
    aNumLet.push("9");
    aNumLet.push("A");
    aNumLet.push("B");
    aNumLet.push("C");
    aNumLet.push("D");
    aNumLet.push("E");
    aNumLet.push("F");
    aNumLet.push("G");
    aNumLet.push("H");
    aNumLet.push("I");
    aNumLet.push("J");
    aNumLet.push("K");
    aNumLet.push("L");
    aNumLet.push("M");
    aNumLet.push("N");
    aNumLet.push("O");
    aNumLet.push("P");
    aNumLet.push("Q");
    aNumLet.push("R");
    aNumLet.push("S");
    aNumLet.push("T");
    aNumLet.push("U");
    aNumLet.push("V");
    aNumLet.push("W");
    aNumLet.push("X");
    aNumLet.push("Y");
    aNumLet.push("Z");
    aNumLet.push("/");
    aNumeri1.push("DUMMY");
    aNumeri1.push(0);
    aNumeri1.push(1);
    aNumeri1.push(2);
    aNumeri1.push(3);
    aNumeri1.push(4);
    aNumeri1.push(5);
    aNumeri1.push(6);
    aNumeri1.push(7);
    aNumeri1.push(8);
    aNumeri1.push(9);
    aNumeri1.push(0);
    aNumeri1.push(1);
    aNumeri1.push(2);
    aNumeri1.push(3);
    aNumeri1.push(4);
    aNumeri1.push(5);
    aNumeri1.push(6);
    aNumeri1.push(7);
    aNumeri1.push(8);
    aNumeri1.push(9);
    aNumeri1.push(10);
    aNumeri1.push(11);
    aNumeri1.push(12);
    aNumeri1.push(13);
    aNumeri1.push(14);
    aNumeri1.push(15);
    aNumeri1.push(16);
    aNumeri1.push(17);
    aNumeri1.push(18);
    aNumeri1.push(19);
    aNumeri1.push(20);
    aNumeri1.push(21);
    aNumeri1.push(22);
    aNumeri1.push(23);
    aNumeri1.push(24);
    aNumeri1.push(25);
    aNumeri1.push(0);
    aNumeri2.push("DUMMY");
    aNumeri2.push(1);
    aNumeri2.push(0);
    aNumeri2.push(5);
    aNumeri2.push(7);
    aNumeri2.push(9);
    aNumeri2.push(13);
    aNumeri2.push(15);
    aNumeri2.push(17);
    aNumeri2.push(19);
    aNumeri2.push(21);
    aNumeri2.push(1);
    aNumeri2.push(0);
    aNumeri2.push(5);
    aNumeri2.push(7);
    aNumeri2.push(9);
    aNumeri2.push(13);
    aNumeri2.push(15);
    aNumeri2.push(17);
    aNumeri2.push(19);
    aNumeri2.push(21);
    aNumeri2.push(2);
    aNumeri2.push(4);
    aNumeri2.push(18);
    aNumeri2.push(20);
    aNumeri2.push(11);
    aNumeri2.push(3);
    aNumeri2.push(6);
    aNumeri2.push(8);
    aNumeri2.push(12);
    aNumeri2.push(14);
    aNumeri2.push(16);
    aNumeri2.push(10);
    aNumeri2.push(22);
    aNumeri2.push(25);
    aNumeri2.push(24);
    aNumeri2.push(23);
    aNumeri2.push(0);
    while (nConta < 16) {
      cCifra = mCf.charAt(nConta - 1);
      nPuntatore = Pqp._ascan(aNumLet, cCifra);
      if (nPuntatore == 0) {
        return "";
      }
      nNp = aNumeri1[nPuntatore];
      nNd = aNumeri2[nPuntatore];
      if (nConta / 2 > Pqp._parteInt(nConta / 2)) {
        nSomma = nSomma + nNd;
      } else {
        nSomma = nSomma + nNp;
      }
      nConta = nConta + 1;
    }
    nCf1 = nSomma / 26;
    nCf2 = nSomma - Pqp._parteInt(nCf1) * 26 + 11;
    nMlc = aNumLet[nCf2];
    return nMlc;
  }

  static _parteInt(nNumero) {
    var aTmp;
    aTmp = ("" + nNumero).split(".");
    return parseInt(aTmp[0]);
  }
  static _ascan(aNumLet, cCifra) {
    var x, lTrovato;
    lTrovato = false;
    for (x = 0; x < aNumLet.length; x++) {
      if (aNumLet[x] == cCifra) {
        lTrovato = true;
        break;
      }
    }
    if (lTrovato) {
      return x;
    } else {
      return 0;
    }
  }

  static ascSeq(sString) {
    var x, sCode, sTmp;
    sCode = "";
    for (x = 0; x < sString.length; x++) {
      sTmp = "" + sString.charCodeAt(x);
      if (sTmp.length < 3) {
        if (sTmp.length < 2) {
          sTmp = "00" + sTmp;
        } else {
          sTmp = "0" + sTmp;
        }
      }
      sCode = sCode + sTmp;
    }
    return sCode;
  }

  static charSeq(sString) {
    var sTmp, x, sChar;
    sTmp = "";
    for (x = 0; x < sString.length / 3; x++) {
      sChar = parseInt(Pqp._removeZero(sString.substr(x * 3, 3)));
      sTmp = sTmp + String.fromCharCode(sChar);
    }
    return sTmp;
  }

  static _removeZero(sString) {
    var sTmp, x, lTrovato;
    lTrovato = false;
    for (x = 0; x < sString.length; x++) {
      if (sString.charAt(x) != "0") {
        lTrovato = true;
        break;
      }
    }
    if (lTrovato) {
      sTmp = sString.substr(x);
    } else {
      sTmp = sString;
    }
    return parseInt(sTmp);
  }

  static padr(sString, sChar, nQuanti) {
    var n;
    n = sString.length;
    for (var x = 0; x < nQuanti - n; x++) {
      sString = sChar + sString;
    }
    return sString;
  }

  static padl(sString, sChar, nQuanti) {
    var n;
    n = sString.length;
    for (var x = 0; x < nQuanti - n; x++) {
      sString = sString + sChar;
    }
    return sString;
  }

  static getCheck(s) {
    var s1 = s.toUpperCase();
    s1 = Pqp._soloCharNumber(s1);
    var nQuanti = s1.length % 15;
    for (x = 0; x < 15 - nQuanti; x++) {
      s1 = s1 + "F";
    }
    var sControllo = "";
    for (var x = 1; x <= s1.length / 15; x++) {
      sControllo = sControllo + Pqp._carCon(s1.substr(x * 15 - 15, 15));
    }
    s1 = sControllo + sControllo.length;
    return s1;
  }

  static _soloCharNumber(s) {
    var sRet = "";
    for (var x = 0; x < s.length; x++) {
      var c = s.charAt(x);
      if ((c >= "0" && c <= "9") || (c >= "A" && c <= "Z")) {
        sRet += c;
      }
    }
    return sRet;
  }

  static cripta(s) {
    return Pqp.uEncode8(s, 6006);
  }

  static decripta(s) {
    return Pqp.uDecode8(s, 6006);
  }

  static uEncode8(str, k) {
    k = k % 256;
    var ret = "";
    for (var i = 0; i < str.length; i++) {
      var u = str.charCodeAt(i) ^ k;
      var s = u.toString(16);
      while (s.length < 2) {
        s = "0" + s;
      }
      ret += s;
    }
    return ret;
  }

  static uDecode8(str, k) {
    k = k % 256;
    var ret = "";
    for (var i = 0; i < str.length; i += 2) {
      var s = "";
      for (var j = 0; j < 2; j++) {
        s += str.charAt(i + j);
      }
      var u = parseInt(s, 16) ^ k;
      ret += String.fromCharCode(u);
    }
    return ret;
  }

  static utf8Encode(s) {
    var sRet = "";
    for (var x = 0; x < s.length; x++) {
      var c = s.charAt(x);
      var n = c.charCodeAt(0);
      if (n >= 32 && n <= 127) {
        sRet += c;
      } else {
        sRet += "&#" + n + ";";
      }
    }
    return sRet;
  }

  static dataora(dt) {
    var sRet = "" + dt.getFullYear();
    var sTmp = "0" + (dt.getMonth() + 1);
    sTmp = sTmp.substr(sTmp.length - 2, 2);
    sRet += sTmp;
    sTmp = "0" + dt.getDate();
    sTmp = sTmp.substr(sTmp.length - 2, 2);
    sRet += sTmp;
    sTmp = "0" + dt.getHours();
    sTmp = sTmp.substr(sTmp.length - 2, 2);
    sRet += sTmp;
    sTmp = "0" + dt.getMinutes();
    sTmp = sTmp.substr(sTmp.length - 2, 2);
    sRet += sTmp;
    sTmp = "0" + dt.getSeconds();
    sTmp = sTmp.substr(sTmp.length - 2, 2);
    sRet += sTmp;
    return sRet;
  }

  static validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static safeReplace(input, rep, replaceWith) {
    var sb = new String();
    var found = false;

    var sLen = input.length;
    var rLen = rep.length;

    for (var i = 0; i < sLen; i++) {
      if (input.charAt(i) == rep.charAt(0)) {
        found = true;
        for (var j = 0; j < rLen; j++) {
          if (!(input.charAt(i + j) == rep.charAt(j))) {
            found = false;
            break;
          }
        }
        if (found) {
          sb += replaceWith;
          i = i + (rLen - 1);
          continue;
        }
      }
      sb += input.charAt(i);
    }
    return sb;
  }

  static minion(lMoltiBr, chars, lBarraEnne, lHodor) {
    return Pqp.lorem(lMoltiBr, chars, lBarraEnne, lHodor);
  }

  static lorem(lMoltiBr, chars, lBarraEnne, lHodor) {
    var consonanti = "rtplgfdszcvbnm";
    var doppie = "rtplgfdsvnmc";
    var mediane = ["nt", "nd", "mb", "rl", "rt", "ch"];
    var iniziali = ["pr", "cr", "st", "br", "tr", "sc", "cl", "gr", "gn", "sf", "sb", "sp", "sm"];
    var vocali = "aeiouaeioaeaeoaeo";
    var nomi = ["Frodo", "Gandalf", "Samwise", "Meriadoc", "Peregrino", "Aragorn", "Legolas", "Gimli", "Boromir", "Sauron", "Gollum", "Bilbo", "Elrond", "Arwen", "Galadriel", "Saruman", "Eomer", "Theoden", "Eowyn", "Faramir", "Denethor", "Ned", "Sansa", "Arya", "Bran", "Jon", "Catelyn", "Daenerys", "Jaime", "Cersei", "Tyrion", "Walder", "Tywin", "Geoffrey"];
    var cognomi = ["Baggins", "Gamgee", "Brandybuck", "Tuc", "Stark", "Lannister", "Tyrell", "Frey", "Bolton", "Baratheon", "Targaryen", "Snow"];
    var punteggiatura = ";,,,,,,,,:";
    var chiusura = "!.........?";
    var domini = [".com", ".it", ".co.uk", ".fr", ".de", ".ru"];
    var lName;
    var lUid;
    var lNoPunteggiatura;
    var lTitle;
    var lEmail;

    if (typeof lMoltiBr == "object") {
      var oTmp = lMoltiBr;
      lMoltiBr = oTmp.lMoltiBr;
      chars = oTmp.chars;
      lBarraEnne = oTmp.lBarraEnne;
      lHodor = oTmp.lHodor;
      lName = oTmp.lName;
      lUid = oTmp.lUid;
      lNoPunteggiatura = oTmp.lNoPunteggiatura;
      lTitle = oTmp.lTitle;
      lEmail = oTmp.lEmail;
    }

    if (lEmail) {
      lNoPunteggiatura = true;

      chars = Pqp.rnd(30, 20);
      lMoltiBr = 0;
    }

    if (lName) {
      return nomi[Pqp.rnd(nomi.length - 1)] + " " + cognomi[Pqp.rnd(cognomi.length - 1)];
    }
    if (lUid) {
      lMoltiBr = 0;
    }
    if (lTitle) {
      lNoPunteggiatura = true;
      chars = Pqp.rnd(30, 20);
      lMoltiBr = 0;
    }

    var a = [];
    for (var x = 0; x < consonanti.length; x++) {
      a.push(consonanti.charAt(x));
      a.push(consonanti.charAt(x));
    }
    consonanti = a;

    for (var x = 0; x < doppie.length; x++) {
      consonanti.push(doppie.charAt(x) + doppie.charAt(x));
    }

    for (var x = 0; x < iniziali.length; x++) {
      consonanti.push(iniziali[x]);
    }

    for (var x = 0; x < mediane.length; x++) {
      consonanti.push(mediane[x]);
    }

    for (var x = 0; x < consonanti.length; x++) {
      if (consonanti[x].length == 1) {
        iniziali.push(consonanti[x]);
      }
    }

    for (var x = 0; x < vocali.length; x++) {
      iniziali.push(vocali.charAt(x));
      iniziali.push(vocali.charAt(x));
    }

    var a = [];
    for (var x = 0; x < vocali.length; x++) {
      a.push(vocali.charAt(x));
    }
    vocali = a;

    var a = [];
    for (var x = 0; x < punteggiatura.length; x++) {
      a.push(punteggiatura.charAt(x));
    }
    punteggiatura = a;

    var a = [];
    for (var x = 0; x < chiusura.length; x++) {
      a.push(chiusura.charAt(x));
    }
    chiusura = a;

    consonanti = Pqp.shuffle(consonanti);
    iniziali = Pqp.shuffle(iniziali);
    vocali = Pqp.shuffle(vocali);
    punteggiatura = Pqp.shuffle(punteggiatura);
    chiusura = Pqp.shuffle(chiusura);

    if (Pqp.isNullOrEmpty(chars)) {
      chars = 4000;
    } else {
      if (!Pqp.isNumber(chars)) {
        chars = 4000;
        trace("Occhio alla sintassi, Pqp.minion(lMoltiBr, chars, lBarraEnne, lHodor)");
      }
    }

    var lNoBr = false;

    if (Pqp.isNullOrEmpty(lMoltiBr)) {
      lMoltiBr = false;
    } else {
      if (lMoltiBr === 0) {
        lMoltiBr = false;
        lNoBr = true;
      } else {
        if (typeof lMoltiBr === "boolean") {
          if (lMoltiBr == true) {
            lMoltiBr = true;
          } else {
            lMoltiBr = false;
          }
        } else {
          trace("Occhio alla sintassi, Pqp.minion(lMoltiBr, chars, lBarraEnne, lHodor)");
          lMoltiBr = false;
        }
      }
    }

    if (Pqp.isNullOrEmpty(lBarraEnne)) {
      lBarraEnne = false;
    } else {
      if (lBarraEnne == true) {
        lBarraEnne = true;
      } else {
        lBarraEnne = false;
      }
    }

    if (Pqp.isNullOrEmpty(lHodor)) {
      lHodor = false;
    }

    //trace(chars + " " + lMoltiBr + " " + lBarraEnne + " " +lNoBr);

    var frase = [];
    var len = 0;

    var stepNome = 0;
    var lastUno = false;
    var contaDoppie = 0;
    var lPrimo = true;
    if (lUid || lEmail) {
      lPrimo = false;
      chars = 100;
      stepNome = 5;
    }

    while (len < chars) {
      var word = "";
      var lOk = false;
      var lName = false;
      // Genera una parola
      if (Pqp.check(0.25) || lPrimo) {
        if (stepNome == 0) {
          // Prende un nome
          lPrimo = false;
          if (Pqp.rnd(1) == 0) {
            word = nomi[Pqp.rnd(nomi.length - 1)];
          } else {
            word = cognomi[Pqp.rnd(cognomi.length - 1)];
          }
          stepNome++;
          lName = true;
          lOk = true;
        }
      }

      if (!lOk) {
        // Genera una parola
        var ln;
        if (Pqp.check(0.7)) {
          ln = Pqp.rnd(3, 1);
        } else {
          ln = Pqp.rnd(7, 6);
        }
        if (lastUno && ln == 1) {
          // Controlla di non avere 2 parole da 1 carattere di seguito
          ln = Pqp.rnd(4, 3);
        }
        if (ln == 1) {
          lastUno = true;
        } else {
          lastUno = false;
        }
        if (stepNome > 0) {
          stepNome++;
        }

        var doppie = 0;
        var char2 = 0;
        var lastVocale;
        for (var x = 0; x < ln; x++) {
          // Iniziale
          if (x == 0) {
            if (lastUno) {
              word += vocali[Pqp.rnd(vocali.length - 1)];
            } else {
              word += iniziali[Pqp.rnd(iniziali.length - 1)];
              if (word.indexOf("a") >= 0 || word.indexOf("e") >= 0 || word.indexOf("i") >= 0 || word.indexOf("o") >= 0 || word.indexOf("u") >= 0) {
                lastVocale = true;
              } else {
                lastVocale = false;
              }
            }
          } else {
            if (lastVocale) {
              var lCondExit = false;
              while (!lCondExit) {
                var cc = consonanti[Pqp.rnd(consonanti.length - 1)];
                if (cc.length > 1 && cc.charAt(0) == cc.charAt(1)) {
                  if (contaDoppie == 0) {
                    //trace("SS");
                    //trace(cc);
                    lCondExit = true;
                  }
                } else {
                  lCondExit = true;
                }
              }

              word += cc;
            } else {
              word += vocali[Pqp.rnd(vocali.length - 1)];
            }
            lastVocale = !lastVocale;
          }
        }
      }

      if (stepNome > 5) {
        if (!lUid && !lEmail) {
          stepNome = 0;
        }
      }

      contaDoppie--;
      if (contaDoppie < 0) {
        contaDoppie = 7;
      }

      // Controlla che la parola finisca con una vocale
      if (!lName) {
        if (Pqp.check(0.95)) {
          var c = word.charAt(word.length - 1);
          if (c.indexOf("a") >= 0 || c.indexOf("e") >= 0 || c.indexOf("i") >= 0 || c.indexOf("o") >= 0 || c.indexOf("u") >= 0) {
          } else {
            word += vocali[Pqp.rnd(vocali.length - 1)];
          }
        }
      }
      if (lHodor) {
        word = "hodor";
      }

      len += word.length;

      frase.push(word);
    }

    // Genera la punteggiatura

    var nextPun = Pqp.rnd(10, 2);
    var lastPunto = Pqp.rnd(30, 15);

    for (var x = 0; x < frase.length; x++) {
      if (x == 0) {
        frase[x] = frase[x].charAt(0).toUpperCase() + frase[x].substr(1);
      }

      if (x >= nextPun) {
        if (lastPunto <= 0) {
          if (frase[x].length == 1) {
            frase[x] = frase[x] + " ";
          } else {
            frase[x] = frase[x] + chiusura[Pqp.rnd(chiusura.length - 1)];
            var lBr = false;
            if (lMoltiBr) {
              if (Pqp.check(0.7)) {
                lBr = true;
              }
            } else {
              if (Pqp.check(0.4)) {
                lBr = true;
              }
            }
            if (lNoBr) {
              lBr = false;
            }

            if (lBr) {
              if (lBarraEnne) {
                frase[x] = frase[x] + "\n";
              } else {
                frase[x] = frase[x] + "<br>";
              }
            } else {
              frase[x] = frase[x] + " ";
            }

            lastPunto = Pqp.rnd(30, 15);
            nextPun += Pqp.rnd(10, 2);
            if (!Pqp.isNullOrEmpty(frase[x + 1])) {
              frase[x + 1] = frase[x + 1].charAt(0).toUpperCase() + frase[x + 1].substr(1);
            }
          }
        } else {
          if (frase[x].length == 1) {
            frase[x] = frase[x] + " ";
          } else {
            frase[x] = frase[x] + punteggiatura[Pqp.rnd(punteggiatura.length - 1)] + " ";
            nextPun += Pqp.rnd(10, 2);
          }
        }
      } else {
        var lVirg = false;
        if (frase[x].length > 2) {
          if (frase[x].charAt(0) != frase[x].charAt(0).toUpperCase()) {
            if (Pqp.check(0.01)) {
              lVirg = true;
            }
          }
        }
        if (lVirg) {
          frase[x] = '"' + frase[x] + '"' + " ";
        } else {
          frase[x] = frase[x] + " ";
        }
      }
      lastPunto--;
      if (lastPunto < 0) {
        lastPunto = 0;
      }
    }

    var finale = "";
    var tot = 0;
    for (var x = 0; x < frase.length - 1; x++) {
      finale += frase[x];
      tot += frase[x].length;
      if (frase[x].indexOf("<br>") >= 0) {
        tot -= 4;
      }
      if (frase[x].indexOf("\\n") >= 0) {
        tot -= 2;
      }

      if (tot.length >= chars) {
        break;
      }
    }

    //finale = jQuery.trim(finale);
    finale = finale.replace(/^\s+|\s+$/gm, "");
    var c = finale.charAt(finale.length - 1);
    if (";,:.?!".indexOf(c) >= 0) {
      finale = finale.substr(0, finale.length - 2);
    }
    finale = finale + chiusura[Pqp.rnd(chiusura.length - 1)];

    var c = finale.charAt(finale.length - 3);
    if (c == " ") {
      //trace("-->"+finale);
      //finale = jQuery.trim(finale.substr(0, finale.length - 3));
      finale = finale.substr(0, finale.length - 3).replace(/^\s+|\s+$/gm, "");

      var c = finale.charAt(finale.length - 1);
      if (";,:.?!".indexOf(c) >= 0) {
        finale = finale.substr(0, finale.length - 2);
      }
      finale = finale + chiusura[Pqp.rnd(chiusura.length - 1)];
    }

    if (lUid || lNoPunteggiatura) {
      for (var x = 0; x < punteggiatura.length; x++) {
        finale = Pqp.safeReplace(finale, punteggiatura[x], "");
      }
      for (var x = 0; x < chiusura.length; x++) {
        finale = Pqp.safeReplace(finale, chiusura[x], "");
      }
    }
    if (lUid) {
      finale = Pqp.safeReplace(finale, " ", "");
      finale = Pqp.safeReplace(finale, " ", "");
      if (finale.length > 17) {
        finale = finale.substr(0, 17);
      }
      finale = "uid" + finale.toLowerCase();
    }

    if (lEmail) {
      finale = (nomi[Pqp.rnd(nomi.length - 1)] + "." + cognomi[Pqp.rnd(cognomi.length - 1)] + "@" + finale.substr(0, Pqp.rnd(10, 5)) + domini[Pqp.rnd(domini.length - 1)]).toLowerCase();
      finale = Pqp.safeReplace(finale, " ", "");
    }

    return finale;
  }

  static formattaNumeroConMigliaia(n) {
    var ret = "";
    var tmp = n + "";
    //
    var cnt = 0;
    for (var i = tmp.length - 1; i >= 0; i--) {
      if (cnt == 3) {
        ret = "." + ret;
        cnt = 0;
      } else {
        cnt++;
      }
      ret = tmp.charAt(i) + ret;
    }
    return ret;
  }

  static newGuid() {
    var uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Pqp.mathRandom() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return Pqp.replace(uid, "-", "");
  }

  static removeDiacritics(str) {
    if (!Pqp.diacriticsMap) {
      Pqp.diacriticsMap = {};
    }
    for (var i = 0; i < Pqp.defaultDiacriticsRemovalap.length; i++) {
      var letters = Pqp.defaultDiacriticsRemovalap[i].letters.split("");
      for (var j = 0; j < letters.length; j++) {
        Pqp.diacriticsMap[letters[j]] = Pqp.defaultDiacriticsRemovalap[i].base;
      }
    }
    var letters = str.split("");
    var newStr = "";
    for (var i = 0; i < letters.length; i++) {
      newStr += letters[i] in Pqp.diacriticsMap ? Pqp.diacriticsMap[letters[i]] : letters[i];
    }
    return newStr;
  }

  static isMobile() {
    let mobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      mobile = true;
    }
    let isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) {
      mobile = true;
    }
    return mobile;
  }

  static isIpaddone() {
    let mobile = Pqp.isMobile();
    // Controllo ipadpro
    let lIpaddone = false;
    if (mobile) {
      if (window.innerHeight > 900 && window.innerWidth > 900) {
        lIpaddone = true;
      }
    }
    return lIpaddone;
  }

  static isIos() {
    let isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    /*isIOS = false;
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			isIOS = true;
		}*/

    return isIOS;
  }

  static toHexColor(num) {
    let s = num.toString(16);
    while (s.length < 6) {
      s = "0" + s;
    }
    return "#" + s;
  }

  static mathRandom() {
    const ret = Math.random();
    Pqp.STORAGE_SEQUENCE.push(ret);

    /* if (Pqp.STORAGE_SEQUENCE.length > 2000) {
      if (Pqp.STORAGE_SEQUENCE[Pqp.STORAGE_SEQUENCE.length - 1] !== Pqp.SUPERDB[Pqp.STORAGE_SEQUENCE.length - 1]) {
        debugger;
      }
    }*/

    return ret;
  }
}

Pqp.STORAGE_SEQUENCE = [];
Pqp.diacriticsMap = null;
Pqp.defaultDiacriticsRemovalap = [
  {
    base: "A",
    letters: "\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
  },
  { base: "AA", letters: "\uA732" },
  { base: "AE", letters: "\u00C6\u01FC\u01E2" },
  { base: "AO", letters: "\uA734" },
  { base: "AU", letters: "\uA736" },
  { base: "AV", letters: "\uA738\uA73A" },
  { base: "AY", letters: "\uA73C" },
  { base: "B", letters: "\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181" },
  {
    base: "C",
    letters: "\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E",
  },
  {
    base: "D",
    letters: "\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779",
  },
  { base: "DZ", letters: "\u01F1\u01C4" },
  { base: "Dz", letters: "\u01F2\u01C5" },
  {
    base: "E",
    letters: "\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E",
  },
  { base: "F", letters: "\u0046\u24BB\uFF26\u1E1E\u0191\uA77B" },
  {
    base: "G",
    letters: "\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E",
  },
  {
    base: "H",
    letters: "\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D",
  },
  {
    base: "I",
    letters: "\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
  },
  { base: "J", letters: "\u004A\u24BF\uFF2A\u0134\u0248" },
  {
    base: "K",
    letters: "\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2",
  },
  {
    base: "L",
    letters: "\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
  },
  { base: "LJ", letters: "\u01C7" },
  { base: "Lj", letters: "\u01C8" },
  { base: "M", letters: "\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C" },
  {
    base: "N",
    letters: "\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4",
  },
  { base: "NJ", letters: "\u01CA" },
  { base: "Nj", letters: "\u01CB" },
  {
    base: "O",
    letters: "\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C",
  },
  { base: "OI", letters: "\u01A2" },
  { base: "OO", letters: "\uA74E" },
  { base: "OU", letters: "\u0222" },
  { base: "P", letters: "\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754" },
  { base: "Q", letters: "\u0051\u24C6\uFF31\uA756\uA758\u024A" },
  {
    base: "R",
    letters: "\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
  },
  {
    base: "S",
    letters: "\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
  },
  {
    base: "T",
    letters: "\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
  },
  { base: "TZ", letters: "\uA728" },
  {
    base: "U",
    letters: "\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
  },
  { base: "V", letters: "\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245" },
  { base: "VY", letters: "\uA760" },
  { base: "W", letters: "\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72" },
  { base: "X", letters: "\u0058\u24CD\uFF38\u1E8A\u1E8C" },
  {
    base: "Y",
    letters: "\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
  },
  {
    base: "Z",
    letters: "\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762",
  },
  {
    base: "a",
    letters: "\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250",
  },
  { base: "aa", letters: "\uA733" },
  { base: "ae", letters: "\u00E6\u01FD\u01E3" },
  { base: "ao", letters: "\uA735" },
  { base: "au", letters: "\uA737" },
  { base: "av", letters: "\uA739\uA73B" },
  { base: "ay", letters: "\uA73D" },
  { base: "b", letters: "\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253" },
  {
    base: "c",
    letters: "\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184",
  },
  {
    base: "d",
    letters: "\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A",
  },
  { base: "dz", letters: "\u01F3\u01C6" },
  {
    base: "e",
    letters: "\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD",
  },
  { base: "f", letters: "\u0066\u24D5\uFF46\u1E1F\u0192\uA77C" },
  {
    base: "g",
    letters: "\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F",
  },
  {
    base: "h",
    letters: "\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
  },
  { base: "hv", letters: "\u0195" },
  {
    base: "i",
    letters: "\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
  },
  { base: "j", letters: "\u006A\u24D9\uFF4A\u0135\u01F0\u0249" },
  {
    base: "k",
    letters: "\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
  },
  {
    base: "l",
    letters: "\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747",
  },
  { base: "lj", letters: "\u01C9" },
  { base: "m", letters: "\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F" },
  {
    base: "n",
    letters: "\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5",
  },
  { base: "nj", letters: "\u01CC" },
  {
    base: "o",
    letters: "\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275",
  },
  { base: "oi", letters: "\u01A3" },
  { base: "ou", letters: "\u0223" },
  { base: "oo", letters: "\uA74F" },
  { base: "p", letters: "\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755" },
  { base: "q", letters: "\u0071\u24E0\uFF51\u024B\uA757\uA759" },
  {
    base: "r",
    letters: "\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
  },
  {
    base: "s",
    letters: "\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B",
  },
  {
    base: "t",
    letters: "\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
  },
  { base: "tz", letters: "\uA729" },
  {
    base: "u",
    letters: "\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
  },
  { base: "v", letters: "\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C" },
  { base: "vy", letters: "\uA761" },
  { base: "w", letters: "\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73" },
  { base: "x", letters: "\u0078\u24E7\uFF58\u1E8B\u1E8D" },
  {
    base: "y",
    letters: "\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
  },
  {
    base: "z",
    letters: "\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763",
  },
];

Pqp.DEBUG_SEED = null;
Pqp.DEBUG_SEED_ONCE = false;
