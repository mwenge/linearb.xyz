function sendKey(keyValue) {
  return function (event) {
    var e = new KeyboardEvent("keydown", {
          bubbles : true,
          key : keyValue,
    });
    document.dispatchEvent(e);
  }
}

function toggleColor(element) {
  var color = element.style.backgroundColor;
  element.style.backgroundColor = color == "purple" ? "black" : "purple";
}

var cycleColor = (function () {
  var frequency = .6;
  var i = 0;
  return function () {
    i++;
    var red   = Math.round(Math.sin(frequency*i + 0) * 55 + 200);
    var green = Math.round(Math.sin(frequency*i + 2) * 55 + 200);
    var blue  = Math.round(Math.sin(frequency*i + 4) * 55 + 200);
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";
  }
})();

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

function ensureValue(v, d) {
  if (v) { return v;}
  return d;
}

function lettersWithImages(name) {
  var splitter = new GraphemeSplitter();
  var words = inscriptions.get(name).words;
  var letters = [];
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word == '\u{1076b}' || word == '\n' || word == '𐄁') {
      continue;
    }
    if (word == inscriptions.get(name).transliteratedWords[i]) {
      continue;
    }
    letters = letters.concat(splitter.splitGraphemes(stripErased(word)));
  }
  return letters;
}

function wordIndexForLetterIndex(name, index) {
  var splitter = new GraphemeSplitter();
  var words = inscriptions.get(name).words;
  var letters = 0;
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word == '\u{1076b}' || word == '\n' || word == '𐄁') {
      continue;
    }
    if (word == inscriptions.get(name).transliteratedWords[i]) {
      continue;
    }
    letters += splitter.countGraphemes(stripErased(word));
    if (letters > index) {
      return i;
    }
  }
  return 0;
}


function getDictionaryEntry(word) {
  if (!dictionary.has(word)) {
    return word;
  }
  value = dictionary.get(word);
  if (value == "") {
    return word;
  }
  return value;
}

