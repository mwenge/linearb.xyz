/*
# Copyright (c) 2019 Robert Hogan (robhogan at gmail.com) All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#    * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above
# copyright notice, this list of conditions and the following disclaimer
# in the documentation and/or other materials provided with the
# distribution.
#    * Neither the name of Google Inc. nor the names of its
# contributors may be used to endorse or promote products derived from
# this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var result = document.getElementById("result");
result.addEventListener("animationend", function() { result.style.display = "none"; result.style.animationDelay = "0s";});

const searchHiddenEvent = new Event("searchhidden");
console.log("If you have any feedback or issues contact me @mwenge on Twitter or open a ticket at https://github.com/mwenge/LinearAExplorer/issues")
document.onkeydown = checkKey;
function checkKey(e) {
  var search = document.getElementById("search");
  // Keystrokes in search box needed to be ignored.
  if (search == document.activeElement) {
    if (e.key == "Escape") {
      hideSearch();
    }
    return;
  }
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  if (e.ctrlKey) {
    return;
  }
  switch(e.key) {
    case "?": // show help
      if (help_menu.style.display == "block") {
        help_menu.style.display = "none";
      } else {
        help_menu.style.display = "block";
      }
      toggleColor(document.getElementById("help-command"));
      break;
    case "/": // '/' - focus search bar
      showSearch();
      break;
    case "t": // 't' - toggle translation
      toggleTranslation(document);
      toggleColor(document.getElementById("translate-command"));
      break;
    case "w": // 'w' - highlight words according to frequency
      updateDisplayOfWordFrequency(document, true);
      break;
    case "i": // 'i' - copy image of inscription to clipboard
      var current = getInscriptionHoveredOver();
      result.style.animationDelay = "90s";
      result.style.display = "inline-block";
      result.textContent = "Copying Image to clipboard";
      if (current) {
        captureImage(current);
      }
      break;
    case "Escape":
      hideSearch();
      zoomItem(current);
      break;
    case "z": // 'z' - zoom
      var current = getInscriptionHoveredOver();
      zoomItem(current);
      break;
    case "1": // '1 to 9' - save state to 1 to 9
    case "2": 
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      result.style.display = "none";
      result.style.display = "inline-block";
      saveSearchTerms(e.keyCode);
      result.textContent = "Saved search terms";
      break;
    case "!": // '1 to 9' - save state to 1 to 9
    case "\"": 
    case "£":
    case "$":
    case "%":
    case "^":
    case "&":
    case "*":
    case "(":
      result.style.display = "none";
      result.style.display = "inline-block";
      loadSearchTerms(e.keyCode);
      result.textContent = "Loaded search terms";
      break;
    case "c": // 'c' - clear search terms
      var container = document.getElementById("search-terms");
      container.innerHTML = "";
      clearTags();
      applySearchTerms();
      break;
    default:
      return;
  }
  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
}

function toggleSearch() {
  if (search.style.visibility == "visible") {
    hideSearch();
    return;
  }
  showSearch();
}
function hideSearch() {
  var element = (document.getElementById("search-command"));
  element.style.backgroundColor = "black";
  var search = document.getElementById('search');
  search.style.visibility = 'hidden';
  search.parentNode.style.visibility = 'hidden';
  document.dispatchEvent(searchHiddenEvent);
}

function showSearch() {
  var element = (document.getElementById("search-command"));
  element.style.backgroundColor = "purple";
  var container = document.getElementById("filter-details-container");
  container.innerHTML = "";

  search.style.visibility = "visible";
  search.parentNode.style.visibility = "visible";
  search.value = '';
  search.focus();
  search.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      updateSearchTerms(event.target.value)();
    }
  }); 
}

function createHTMLTemplate(html) {
      var template = document.createElement('template');
      html = html.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html;
      return template;
}

function makeShowApparatus(inscription) {
  var commentaries = [
    documentsInMycenaeanGreek,
    linearBAnIntroduction,
    companionToLinearBVol1,
    companionToLinearBVol2,
    palaceNestor1,
  ];

  var b;
  for (var c of commentaries) {
    var refs = c.comments[inscription.label];
    if (!refs) {
      continue;
    }
    if (!b) {
      b = document.createElement("div");
      b.id = inscription.name + "-biblio-container";
      b.className = "biblio-container";
      var p = document.getElementById(inscription.name + "-comment-placeholder");
      p.append(b);
    }

    var cellID = inscription.name + window.btoa(c.name) +  "-refs";
    var t = "<div class=\"biblio-row\">" +
              "<div class=\"biblio-cell\"><img src=\"" + c.img + "\" width=\"40\" height=\"50\"></div>" +
              "<div class=\"biblio-cell\">" +
                "<div class=\"biblio-row\">" + c.name + "</div>" +
                "<div class=\"biblio-row\" id =\"" + cellID + "\"></div>" +
              "</div>" +
            "</div>";
    var template = createHTMLTemplate(t);
    var entry = template.content.firstChild.cloneNode(true);
    b.append(entry);

    var refCell = document.getElementById(cellID);
    var span = document.createElement("span");
    span.className = "biblio-ref";
    span.textContent = "Open at: ";
    refCell.appendChild(span);
    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      var span = document.createElement("span");
      span.className = "biblio-ref";
      span.textContent = "p. " + ref + ((refs.length - i > 1) ? ", " : "");
      span.addEventListener("click", showBiblioPreview(c.doc + "#page=" + ref));
      refCell.appendChild(span);
    }
  }
}

function showBiblioPreview(src) {
  return function(e) {
    window.open(src, '_blank');
  };
}

function autocomplete(inp) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  var splitter = new GraphemeSplitter();
  var searchHints = Array.from(inscriptions.values()).map(x => x.site).filter((v, i, a) => a.indexOf(v) === i);
  searchHints = searchHints.concat(Array.from(inscriptions.values()).map(x => x.name));
  searchHints = searchHints.concat(Array.from(inscriptions.values()).map(x => x.label));
  searchHints = searchHints.concat(Array.from(inscriptions.values()).map(x => x.scribe).filter((v, i, a) => a.indexOf(v) === i));
  searchHints = searchHints.concat(Array.from(inscriptions.values()).map(x => x.findspot).filter((v, i, a) => a.indexOf(v) === i));

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();

    if (!val) { return false;}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("div");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.insertBefore(a, document.getElementById("search"));

    var text = event.target.value.toLowerCase();
    if (text.length > 2) {
      searchHints.forEach( hint => {
        if (hint.toLowerCase().includes(text)) {
          addEntry(this, a, hint, "");
        }
      });
    }

    var syllables = text.split('-');
    var textInGlyphs = syllables.map(syllable => syllableToGlyph.has(syllable)
      ? syllableToGlyph.get(syllable) : "").join('');
    var accumulatedOffset = 0;
    if (textInGlyphs == "") {
      return;
    }

    addEntry(this, a, textInGlyphs, wordsInCorpus.has(textInGlyphs) ? wordsInCorpus.get(textInGlyphs) : 0);
    wordsInCorpus.forEach( (value, key, map) => {
      if (key.includes(textInGlyphs) && key != textInGlyphs) {
        addEntry(this, a, key, value);
      }
    });

    function addEntry(e, a, key, value) {
      if (a.children.length > 10) {
        return;
      }
      /*create a DIV element for each matching element:*/
      var b = document.createElement("div");
      b.className = "autocomplete-item"

      var glyphsInText = splitter.splitGraphemes(key).map(glyph => glyphToSyllable.has(glyph)
        ? glyphToSyllable.get(glyph) : "").join('-');

      b.innerHTML = "<div class=\"autocomplete-item-left\">" + key + "</div>";
      if (value) {
        b.innerHTML += "<div class=\"autocomplete-item-right\">" + glyphsInText
          + " (" + value + ") </div>";
      }
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + key  + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function(e) {
        /*insert the value for the autocomplete text field:*/
        inp.value = this.getElementsByTagName("input")[0].value;
        inp.focus();
        /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
        closeAllLists();
      });
      a.appendChild(b);
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByClassName("autocomplete-item");
    if (e.keyCode == 38) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 40) { //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("searchhidden", function (e) {
    closeAllLists(e.target);
  });
}


function closeZoomedWindow(e) {
  zoomItem(null);
  e.stopPropagation();
}

function getInscriptionHoveredOver() {
  var n = document.querySelector(":hover");
  var nn;
  while (n) {
    nn = n;
    if (nn.className == "item-container") {
      return nn;
    }
    n = nn.querySelector(":hover");
  }
  return null;
}

function hasMatchForHighlight(fullWordMatch, searchTerm, text) {
  if (fullWordMatch) {
    return (searchTerm == text);
  }
  searchTerm = searchTerm.replace(/\\/g, "");
  var re = new RegExp(searchTerm);
  return (re.test(text));
}

function highlightMatchesInElement(element, searchTerm, highlightColor) {
  if (searchTerm == "") {
    return;
  }
  var fullWordMatch = searchTerm.includes("\"");
  searchTerm = searchTerm.replace(/\"/g, "");
  for (var j = 0; j < element.children.length; j++) {
    var span = element.children[j];
    if (hasMatchForHighlight(fullWordMatch, searchTerm, stripErased(span.textContent.trim()))) {
      var inscription = element.getAttribute("inscription");
      if (!inscription) {
        continue;
      }
      var translation = document.getElementById(inscription + "-translation-" + j);
      translation.style.backgroundColor = highlightColor;
      var transliteration = document.getElementById(inscription + "-transliteration-" + j);
      transliteration.style.backgroundColor = highlightColor;
      var transcription = document.getElementById(inscription + "-transcription-" + j);
      transcription.style.backgroundColor = highlightColor;

      highlightedSearchElements.push(translation);
      highlightedSearchElements.push(transliteration);
      highlightedSearchElements.push(transcription);

      var highlightedElements = setHighlightLettersInTranscription(inscription, j, highlightColor);
      highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
    }
  }
}

var highlightedSearchElements = [];
function clearHighlights() {
  for (var index in highlightedSearchElements) {
    highlightedSearchElements[index].style.backgroundColor = "";
    highlightedSearchElements[index].style.border = "none";
  }
  highlightedSearchElements = [];
}

function makeMoveLens(img, result, imageToAdd, name) {
  return function(e) {
    result.style.display = "flex";

    var lensD = 80;
    /* Calculate the ratio between itemZoom DIV and lens: */
    var cx = 200 / lensD;
    var cy = 200 / lensD;

    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - (lensD / 2);
    y = pos.y - (lensD / 2);
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lensD) {x = img.width - lensD;}
    if (x < 0) {x = 0;}
    if (y > img.height - lensD) {y = img.height - lensD;}
    if (y < 0) {y = 0;}
    /* Display what the lens "sees": */
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";

    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  };
}

function makeGiveUpOnImages(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].remove();
    }
    e.stopPropagation();
  };
}

function makeHideElements(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].style.display = "none";
    }
    e.stopPropagation();
  };
}

function makeZoomItem(item) {
  return function(e) {
    zoomItem(item);
  };
}

function addImageToItem(item, imageToAdd, inscription, imageType, stack, classSuffix) {
  var itemShell = document.createElement("div");
  itemShell.className = 'item-shell item-shell' + classSuffix;
  item.appendChild(itemShell);

  if (inscription.site == "Pylos") {
    itemShell.classList.add("pylos-image");
  }

  var itemZoom = document.createElement("div");
  itemZoom.className = 'item-zoom';
  itemShell.appendChild(itemZoom);

  var label = document.createElement("div");
  label.className = 'label';
  label.textContent = inscription.label;
  itemZoom.appendChild(label);

  var inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item' + ' image-item' + classSuffix;
  var imageWrapper = document.createElement("div");
  imageWrapper.setAttribute("class", "img-wrapper");
  imageWrapper.id = "image-wrapper-" + imageType + "-" + inscription.name;
  inscriptionImage.appendChild(imageWrapper);

  var copyright = document.createElement("div");
  copyright.setAttribute("class", "imagerights-label");
  copyright.textContent = inscription.imageRights;
  if (inscription.imageRights) {
    copyright.addEventListener("click", event => { window.open(inscription.imageRightsURL); event.stopPropagation(); });
  }
  itemShell.appendChild(copyright);

  var img = document.createElement("img");
  img.src = encodeURIComponent(imageToAdd);
  img.id = "image-" + imageType + "-" + encodeURIComponent(imageToAdd);
  img.height = "200";
  img.addEventListener("error", makeGiveUpOnImages([inscriptionImage, itemZoom]));
  img.addEventListener("load", addWordsToImage(imageToAdd, inscription.name, imageType, img, imageWrapper, itemZoom, item, stack));
  imageWrapper.appendChild(img);
  itemShell.appendChild(inscriptionImage);

  itemZoom.style.backgroundImage = "url('" + img.src + "')";
  // img.addEventListener("mousemove", makeMoveLens(img, itemZoom, imageToAdd, inscription.name, stack));
  itemShell.addEventListener("mousemove", showCopyright(copyright));
  itemShell.addEventListener("mouseout", makeHideElements([itemZoom, copyright]));
  function showCopyright() {
    return function (e) {
      copyright.style.display = "block";
    };
  }
}

function addWordsToImage(imageToAdd, name, imageType, img, imageWrapper, itemZoom, item, stack) {
  return function(e) {
    if (!coordinates.has(imageToAdd)) {
      return;
    }
    var imageCoords = coordinates.get(imageToAdd);
    var currentWord = 0;
    var prevWord = -1;
    var wordContainer = null;
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      currentWord = wordIndexForLetterIndex(name, i);

      if (currentWord != prevWord) {
        wordContainer = document.createElement("div");
        wordContainer.className = "word-highlight";
        var wordID = "image-" + imageType + "-" + name + "-word-highlight-" + currentWord;
        wordContainer.classList.add(wordID);
        wordContainer.style.top = ((area.y / img.naturalHeight) * 100) + '%';
        wordContainer.style.left = ((area.x / img.naturalWidth) * 100) + '%';
        wordContainer.id = wordID;
        wordContainer.addEventListener("mouseout", clearHighlight(name, currentWord));
        imageWrapper.appendChild(wordContainer);
      }
      prevWord = currentWord;

      var highlight = document.createElement("div");
      highlight.className = "letter-highlight";
      highlight.id = "image-" + imageType + "-" + name + "-letter-highlight-" + i;
      highlight.style.width = ((area.width / img.naturalWidth) * 100) + '%';
      highlight.style.height = ((area.height / img.naturalHeight) * 100) + '%';
      highlight.style.top = ((area.y / img.naturalHeight) * 100) + '%';
      highlight.style.left = ((area.x / img.naturalWidth) * 100) + '%';
      // highlight.addEventListener("mousemove", makeMoveLens(img, itemZoom, imageToAdd, name, stack));
      highlight.addEventListener("mouseenter", highlightWords(name, currentWord));
      highlight.addEventListener("click", updateSearchTerms("\"" + inscriptions.get(name).words[currentWord] + "\""));
      highlight.addEventListener("mouseout", clearHighlight(name, currentWord));
      wordContainer.appendChild(highlight);
    }

    // Highlight any search terms in the image
    var searchTerms = document.getElementById("search-terms");
    for (var i = 0; i < searchTerms.children.length; i++) {
      var searchElement = searchTerms.children[i];
      if (!searchElement) {
        continue;
      }
      var term = searchElement.textContent;
      for (var j = 0; j < item.children.length; j++) {
        var element = item.children[j];
        var highlightColor = searchElement.getAttribute("highlightColor");
        highlightMatchesInElement(element, term, highlightColor);
      }
    }

    var inscription = inscriptions.get(name);
    for (var tag of consoleButtons.get('activeWordTags').currentActiveTags()) {
      var highlightColor = tagColors[tag];
      for (var index in inscription.wordTags) {
        if (!inscription.wordTags[index].includes(tag)) {
          continue;
        }

        var highlightedElements = setHighlightLettersInTranscription(name, index, highlightColor);
        highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
      }
    }
  };
}

var captureImage = function(root) {
  html2canvas(root, {
    backgroundColor: 'white'
  })
    .then(function(canvas) {
      canvas.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
        result.style.animationDelay = "0s";
        result.textContent = "Image copied to clipboard";
      });
    })
};

var zoomItem = (function(item) {
  var zoomedElement = null;
  return function(item) {
    var itemToZoom = item;
    if (zoomedElement) {
      itemToZoom = zoomedElement;
      zoomedElement = null;
    } else {
      zoomedElement = item;
    }
    if (!itemToZoom) {
      return;
    }

    Array.prototype.map.call(itemToZoom.getElementsByClassName("item-shell"), x => x.classList.toggle("zoomed-item"));
    Array.prototype.map.call(itemToZoom.getElementsByClassName("item"), x => x.classList.toggle("zoomed-item"));
    Array.prototype.map.call(itemToZoom.getElementsByClassName("close-window"), x => x.classList.toggle("zoomed-close-window"));
    itemToZoom.classList.toggle("zoomed-item-container");
  }
})();

var updateDisplayOfWordFrequency = (function(root, update) {
  var displayed = true;
  return function(root, update) {
    if (update) {
      displayed = !displayed;
    }
    Array.prototype.map.call(root.getElementsByTagName("span"), x => displayed ? x.classList.add("word-frequency-none") : x.classList.remove("word-frequency-none"));
  }
})();

function getClassNameForWord(word) {
  word = stripErased(word);
  var stem = "word-frequency-";
  if (wordsInCorpus.has(word)) {
    var wordCount = Math.min(10, wordsInCorpus.get(word));
    return stem + wordCount; 
  }
  return stem + "1"; 
}

function displayingTranslation(container) {
  var lastChild = container.lastChild;
  if (!lastChild || lastChild.nodeName != "DIV") {
    return false;
  }
  var displayingTranslation = lastChild.getElementsByClassName("translation-item")[0].style.display == "block";
  return displayingTranslation;
}

function loadInscription(inscription) {
  if (inscription.element) {
    return null;
  }

  function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
  }
  var splitter = new GraphemeSplitter();
  var letters = splitter.splitGraphemes(inscription.transcription).filter(w => !isASCII(w)).length;
  var small = letters < 15 && inscription.site != "Pylos"  ? "-small" : "";
  var large = letters > 75 ? "-large" : "";
  var stacked = (inscription.displayHint == "row") ? "" : "-stacked";
  var classSuffix = stacked + small + large;
  var stack = (inscription.displayHint == "row") ? false : true;

  var item = document.createElement("div");
  item.className = 'item-container item-container' + classSuffix;
  item.id = inscription.name;
  item.addEventListener("dblclick", makeZoomItem(item));

  inscription.images.forEach( image => {
    addImageToItem(item, image, inscription, "photo", stack, classSuffix)
  });
  inscription.facsimileImages.forEach( image => {
    addImageToItem(item, image, inscription, "transcription", stack, classSuffix)
  });


  var transcript = document.createElement("div");
  transcript.className = 'item text-item' + stacked;
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < inscription.words.length; i++) {
    var word = inscription.words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word;
      span.className = getClassNameForWord(word);
      span.classList.add("word-alignment");
      span.classList.add("word-frequency-none");
      if (word == inscription.transliteratedWords[i]) {
        span.textContent += " ";
        span.classList.add("apparatus");
      }

      var searchTerm = stripErased(word);
      span.id = inscription.name + "-transcription-" + i;
      span.addEventListener("mouseenter", highlightWords(inscription.name, i));
      span.addEventListener("mouseout", clearHighlight(inscription.name, i));
      span.addEventListener("click", updateSearchTerms("\"" + span.textContent + "\""));
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  var transliteration = populateText(inscription, "transliteration", inscription.transliteratedWords, classSuffix);
  item.appendChild(transliteration);

  var translation = ""
  if (!inscription.translatedWords) {
    translation = populateText(inscription, "translation", inscription.transliteratedWords.map(x => getDictionaryEntry(x)), classSuffix);
  } else {
    translation = populateText(inscription, "translation", inscription.translatedWords, classSuffix);
  }
  translation.style.display = "none";
  item.appendChild(translation);

  var tagContainer = document.createElement("div");
  tagContainer.className = 'tag-container';
  item.appendChild(tagContainer);

  var tagsToAdd = [[[inscription.support], 'activeSupports'],
    [[inscription.scribe], 'activeScribes'],
    [[inscription.findspot], 'activeFindspots'],
    [[inscription.site], 'activeFindspots'],
    [contexts.get(inscription.name), 'activeContexts'],
    [tags.get(inscription.name), 'activeTagValues']]  
    .filter(w => w[0] != undefined && w[0] != "");

  tagsToAdd.forEach( tagData => {
    tagData[0].forEach( tag => {
      var activeMetadataName = tagData[1];
      var label = document.createElement("div");
      label.className = 'tag';
      if (!tagColors[tag]) {
        tagColors[tag] = cycleColor(); 
      }
      label.style.backgroundColor = tagColors[tag];
      label.textContent = tag;
      label.addEventListener("click", consoleButtons.get(activeMetadataName).toggleMetadatum(tag));
      tagContainer.appendChild(label);
    });
  });
  var paddingFactor = Math.ceil(tagsToAdd.length / 2);
  var paddingToAdd = 20 * paddingFactor;
  // Apply padding to image item so that the tags fit and item separators display properly
  var imageContainer = item.getElementsByClassName("item-shell")[0];
  if (imageContainer) {
    imageContainer.style.paddingBottom = paddingToAdd + "px";
  }

  var label = document.createElement("div");
  label.className = "label";
  label.textContent = inscription.label;
  item.appendChild(label);

  var label = document.createElement("div");
  label.className = "close-window";
  label.id = inscription.name + "-close-window";
  label.onclick = closeZoomedWindow;
  item.appendChild(label);


  inscription.element = item;
  if (displayingTranslation(container)) {
    toggleTranslation(item);
  }

  var wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.appendChild(item);

  var label = document.createElement("div");
  label.className = "comment-placeholder";
  label.id = inscription.name + "-comment-placeholder";
  wrapper.appendChild(label);

  container.appendChild(wrapper);

  makeShowApparatus(inscription);

  updateDisplayOfWordFrequency(item, false);

  return item;
}

function populateText(inscription, type, words, classSuffix) {
  var transcript = document.createElement("div");
  transcript.className = 'item text-item text-item' + classSuffix + ' ' + type + '-item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word + " ";
      span.className = getClassNameForWord(inscription.words[i]);
      span.classList.add("word-alignment");
      span.classList.add("word-frequency-none");
      span.id = inscription.name + "-" + type + "-" + i;
      span.addEventListener("mouseenter", highlightWords(inscription.name, i));
      span.addEventListener("mouseout", clearHighlight(inscription.name, i));
      span.addEventListener("click", updateSearchTerms("\"" + inscription.words[i] + "\""));
    }
    transcript.appendChild(span);
  }
  transcript.appendChild(document.createElement("br"));
  transcript.appendChild(document.createElement("br"));
  return transcript;
}

function toggleTranslation(container) {
  Array.prototype.map.call(container.getElementsByClassName("translation-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
  Array.prototype.map.call(container.getElementsByClassName("transliteration-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
}

function getWordsAsImage(inscription, targetWord) {
  var zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));
  var imagesToLoad = [];
  imagesToLoad = imagesToLoad.concat(zip(inscription.images,
    Array(inscription.images.length).fill("photo")));
  imagesToLoad = imagesToLoad.concat(zip(inscription.facsimileImages,
    Array(inscription.facsimileImages.length).fill("transcription")));

  var concordanceItem = document.createElement("div");
  for (var imageInfo of imagesToLoad) {
    var imgName = imageInfo[0];
    var imgType = imageInfo[1];
    if (!coordinates.has(imgName)) {
      continue;
    }


    var imageCoords = coordinates.get(imgName);
    var currentWord = 0;
    var prevWord = -1;
    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.name);

    var span = document.createElement("div");
    span.className = "tip-display tip-image-display";
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      if (!area.width) {
        continue;
      }
      currentWord = wordIndexForLetterIndex(inscription.name, i);

      if (currentWord != targetWord) {
        continue;
      }
      if (currentWord > targetWord) {
        break;
      }

      var canvas = document.createElement('canvas');
      canvas.height = 50;
      canvas.width = 50 * (area.width / area.height);
      var ctx = canvas.getContext('2d', {alpha: false});
      var img = document.getElementById("image-" + imgType + "-" + encodeURIComponent(imgName));
      if (!img) {
        continue;
      }
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
      span.appendChild(canvas);
    }
    if (span.children.length) {
      concordanceItem.appendChild(span);
    }
  }
  return concordanceItem;
}

function getLexiconEntry(word) {
  var entry = {
    word: "",
    transcription: "",
    greek: "",
    translation: "",
    interpretations: [],
  }

  // Loook for the word with and without a one character suffix, e.g. -qe
  var splitter = new GraphemeSplitter();
  var glyphs = splitter.splitGraphemes(word);
  var words = [word];
  for (var i = 0; i < 4; i++) {
    if (glyphs.length < 3) {
      break;
    }
    glyphs = glyphs.slice(0, -1);
    var trunc = glyphs.join('');
    words.push(trunc);
  }
  for(var w of words) {
    if (lexicon.has(w)) {
      var t = lexicon.get(w);
      if (t.translation.length || t.interpretations.length) {
        return lexicon.get(w);
      }
    }
  }
  return entry;
}

function getLookupCandidates(word, i, words) {
  var j = i;
  var w = word;
  var cands = [];
  while (["[", "]"].includes(words[j - 1])) {
    j -= 2;
    if (j < 0) {
      break;
    }
    w = words[j] + w;
    cands.push(w);
  }
  var candidates = cands;

  var cands = [];
  for (var w of candidates.concat([word])) {
    var j = i;
    while (["[", "]"].includes(words[j + 1])) {
      j += 2;
      if (j > words.length) {
        break;
      }
      w = w + words[j];
      cands.push(w);
    }
  }
  cands.push(word);
  return candidates.concat(cands);
}

function searchLexicon(word, i, words) {

  var cands = getLookupCandidates(word, i, words);
  var entry;
  for (var cand of cands) {
    entry = getLexiconEntry(cand);
    if (entry.translation.length) {
      return entry;
    }
  }
  return entry;
}

function addWordTip(word, name, index) {

  word = stripErased(word.trim());
  var wordCount = 0;
  if (wordsInCorpus.has(word)) {
    wordCount = wordsInCorpus.get(word) - 1;
  }

  var bib = document.getElementById(name + "-biblio-container");
  if (bib) {
    bib.style.visibility = "hidden";
  }

  var tip = document.getElementById(name + "-inscription-word-tip");
  var inscriptionElement = document.getElementById(name);
  if (!tip) {
    var tip = document.createElement("div")
    tip.className = 'word-tip';
    tip.id = name + "-inscription-word-tip";
    document.getElementById(name + "-comment-placeholder").appendChild(tip);
  }
  tip.style.display = "block";
  tip.innerHTML = "";

  var inscription = inscriptions.get(name);
  var entry = searchLexicon(word, index, inscription.words);
  entry.word = word;

  var wordCommentElement = document.createElement("div");
  wordCommentElement.className = "lexicon";
  for (var key of [entry.word, entry.transcription, entry.greek, entry.translation]) {
    if (!key) {
      continue;
    }
    var wordDisplay = document.createElement("div");
    wordDisplay.className = "tip-display";
    wordDisplay.textContent = key;
    wordCommentElement.appendChild(wordDisplay);
  }
  tip.appendChild(wordCommentElement);

  var wordCommentElement = document.createElement("div");
  wordCommentElement.className = "lexicon";
  wordCommentElement.appendChild(getWordsAsImage(inscription, index));
  tip.appendChild(wordCommentElement);

  for (var d of entry.interpretations) {
    if (d.length > 200) {
      continue;
    }
    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lemma";
    wordCommentElement.textContent = d;
    tip.appendChild(wordCommentElement);
  }

  var tipText = "";
  switch(wordCount) {
    case 0:
      tipText = "There is no other instance of this word."
      break;
    case 1:
      tipText = wordCount + " other instance of this word. Click to add to filter."
      break;
    default:
      tipText = wordCount + " other instances of this word. Click to add to filter."
  }
  var wordCommentElement = document.createElement("span");
  wordCommentElement.className = "tip-text";
  wordCommentElement.textContent = tipText;
  tip.appendChild(wordCommentElement);
}

function setHighlightLettersInTranscription(name, index, highlight) {
  var highlightedElements = [];
  for (var imageType of ["photo", "transcription"]) {
    var els = document.getElementsByClassName("image-" + imageType + "-" + name + "-word-highlight-" + index);
    Array.from(els).forEach( el => {
      var elements = el.getElementsByClassName("letter-highlight");
      Array.from(elements).forEach( element => {
        element.style.backgroundColor = highlight;
        element.style.border = highlight != "" ? "0.5px solid black" : "none";
        highlightedElements.push(element);
      });
    });
  }
  return highlightedElements;
}

function paintHighlightOnZoomImage(itemZoom, img, element ) {
  return function(e) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d', {alpha: false});

    var imageWidth = img.naturalWidth;
    var imageHeight = img.naturalHeight;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

    for (var i = 0; i < element.children.length; i++) {
      var highlight = element.children[i];
      if (highlight.tagName != "DIV") {
        continue;
      }
      var x = Math.floor((imageWidth * parseFloat(highlight.style.left)) / 100)
      var y = Math.floor((imageHeight * parseFloat(highlight.style.top)) / 100)
      var width = Math.floor((imageWidth * parseFloat(highlight.style.width)) / 100)
      var height = Math.floor((imageHeight * parseFloat(highlight.style.height)) / 100)
      ctx.fillStyle = highlight.style.backgroundColor;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "black";
      ctx.lineWidth = 0.2;
      ctx.strokeRect(x, y, width, height);
    }
    var dataURI = canvas.toDataURL();
    itemZoom.style.backgroundImage = "url('" + dataURI + "')";
  }
}

function highlightWords(name, index) {
  return function(e) {
    var items = ["transcription", "translation", "transliteration", "product"];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var element = document.getElementById(name + "-" + item + "-" + index);
      if (!element) {
        continue;
      }
      if (element.style.backgroundColor) {
        continue;
      }
      element.style.backgroundColor = "yellow";
      setHighlightLettersInTranscription(name, index, "rgba(255, 255, 0, 0.5)");
    }
    var element = document.getElementById(name + "-transcription-" + index);
    addWordTip(element.textContent, name, index);
  }
}

function clearHighlight(name, index) {
  return function(evt) {
    var tip = document.getElementById(name + "-inscription-word-tip");
    if (tip) {
      tip.style.display = "none";
    }
    var bib = document.getElementById(name + "-biblio-container");
    if (bib) {
      bib.style.visibility = "visible";
    }
    
    var items = ["transcription", "transliteration", "translation", "product"];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var element = document.getElementById(name + "-" + item + "-" + index);
      if (!element) {
        continue;
      }
      if (highlightedSearchElements.includes(element)) {
        continue;
      }
      element.style.backgroundColor = "";
      setHighlightLettersInTranscription(name, index, "");
    }
  }
}

function hideWordChart() {
  var wordChart = document.getElementById("word-chart");
  if (!wordChart) {
    return;
  }
  wordChart.style.visibility = "hidden";
}

function showWordChart(searchTerm, item) {
  var wordChart = document.getElementById("word-chart");
  if (!wordChart) {
    wordChart = document.createElement("div");
    wordChart.className = 'word-tip';
    wordChart.id = 'word-chart';
    wordChart.style.visibility = "hidden";
    document.body.appendChild(wordChart);
  }

  return function(e) {
    wordChart.innerHTML = "";

    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lexicon";
    var wordDisplay = document.createElement("div");
    wordDisplay.className = "tip-display";
    wordDisplay.textContent = searchTerm;
    searchTerm = searchTerm.replace(/\"/g, "");
    wordCommentElement.appendChild(wordDisplay);
    var transliteratedWordDisplay = document.createElement("div");
    transliteratedWordDisplay.className = "tip-display";
    transliteratedWordDisplay.textContent = "";
    wordCommentElement.appendChild(transliteratedWordDisplay);

    wordChart.appendChild(wordCommentElement);

    var entry = getLexiconEntry(searchTerm);
    entry.word = searchTerm;

    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lexicon";
    for (var key of [entry.word, entry.transcription, entry.greek, entry.translation]) {
      if (!key) {
        continue;
      }
      var wordDisplay = document.createElement("div");
      wordDisplay.className = "tip-display";
      wordDisplay.textContent = key;
      wordCommentElement.appendChild(wordDisplay);
    }
    wordChart.appendChild(wordCommentElement);

    var wordImages = document.createElement("div");
    wordImages.className = "lexicon";
    wordChart.appendChild(wordImages);

    var tagList = document.createElement("div");
    tagList.className = "lexicon";
    tagList.textContent = "Tags: ";
    wordChart.appendChild(tagList);

    var tipText = "";
    var wordCount = 0;
    if (wordsInCorpus.has(searchTerm)) {
      wordCount = wordsInCorpus.get(searchTerm);
    }
    switch(wordCount) {
      case 0:
        tipText = ""
        break;
      case 1:
        tipText = wordCount + " instances of this word."
        break;
      default:
        tipText = wordCount + " instances of this word."
    }
    var wordCommentElement = document.createElement("span");
    wordCommentElement.className = "tip-text";
    wordCommentElement.textContent = tipText;
    wordChart.appendChild(wordCommentElement);

    var tagsAdded = [];
    for (var inscription of inscriptions.values()) {
      if (!inscription.element) {
        continue;
      }
      if (inscription.element.style.visibility == "hidden") {
        continue;
      }
      for (var i = 0; i < inscription.words.length; i++) {
        var word = stripErased(inscription.words[i]);
        var transliteratedWord = stripErased(inscription.transliteratedWords[i]);
        if (word != searchTerm && transliteratedWord != searchTerm) {
          continue;
        }
        if (transliteratedWordDisplay.textContent == "") {
          transliteratedWordDisplay.textContent = inscription.transliteratedWords[i];
        }
        var wordContainer = document.createElement("div");
        wordContainer.className = "tip-tag";
        wordContainer.appendChild(getWordsAsImage(inscription, i));
        var tag = document.createElement("div");
        tag.className = "word-image-label";
        tag.textContent = inscription.name;
        wordContainer.appendChild(tag);
        wordImages.appendChild(wordContainer);

        var tagsForWord = ensureValue(inscription.wordTags[i], []);
        for (var x of tagsForWord) {
          if (tagsAdded.includes(x)) {
            continue;
          }
          var tag = document.createElement("div");
          tag.className = "tip-tag";
          tag.textContent = x;
          tagList.appendChild(tag);
          tagsAdded.push(x);
        }
      }
    }
    wordChart.style.top = item.getBoundingClientRect().top + "px";
    wordChart.style.right = document.getElementById("top-right-console").clientWidth + "px";
    wordChart.style.visibility = "visible";
  }
}

function updateSearchTerms(searchTerm) {
  return function(evt) {
    if (!searchTerm.length) {
      return;
    }
    searchTerm = stripErased(searchTerm);
    var container = document.getElementById("search-terms");
    var existingElement = document.getElementById("search-for-" +  searchTerm);
    if (existingElement) {
      return;
    }
    var item = document.createElement("div");
    item.className = 'search-term';
    item.textContent = searchTerm;
    item.id = "search-for-" + searchTerm;
    item.setAttribute("term", searchTerm);
    item.addEventListener("click", removeFilter);
    item.addEventListener("mouseenter", showWordChart(searchTerm, item));
    item.addEventListener("mouseout", hideWordChart);

    var color = cycleColor();
    item.style.backgroundColor = color;
    item.style.opacity = "0.8";
    item.setAttribute("highlightColor", color);

    container.appendChild(item);
    applySearchTerms();
    if (!evt) {
      return;
    }
    evt.stopPropagation();
  }
}

function saveSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  localStorage.setItem(key, container.innerHTML);
  changeIcon("icons/" + number + '.png');
}

function loadSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  container.innerHTML = localStorage.getItem(key);
  applySearchTerms();
  changeIcon("icons/" + number + '.png');
}

function hasMatch(fullWordMatch, searchTerm, inscription) {
  searchTerm = searchTerm.replace(/\\/g, "");
  let searchTermLower = searchTerm.toLowerCase();
  var re = new RegExp(searchTerm);
  if (!fullWordMatch) {
    var containsRegEx = inscription.translatedWords.filter(word => re.test(word)).length > 0;
    containsRegEx |= inscription.transliteratedWords.filter(word => re.test(word)).length > 0;
    var containsTerm = inscription.translatedWords.filter(word => word.toLowerCase().includes(searchTermLower)).length > 0;
    containsTerm |= inscription.transliteratedWords.filter(word => word.toLowerCase().includes(searchTermLower)).length > 0;
    return (containsRegEx || containsTerm ||
      inscription.transcription.includes(searchTerm) ||
      inscription.name.toLowerCase().includes(searchTermLower) ||
      inscription.label.toLowerCase().includes(searchTermLower) ||
      inscription.findspot.includes(searchTerm) ||
      inscription.site.toLowerCase().includes(searchTermLower) ||
      inscription.scribe.includes(searchTerm) ||
      inscription.words.includes(searchTerm) ||
      inscription.words.map(x => stripErased(x)).includes(searchTerm)
    );
  }

  var containsTerm = inscription.translatedWords.filter(word => word == searchTerm).length > 0;
  containsTerm |= inscription.transliteratedWords.filter(word => word == searchTerm).length > 0;
  return (containsTerm ||
    inscription.name == searchTerm ||
    inscription.words.includes(searchTerm) ||
    inscription.words.map(x => stripErased(x)).includes(searchTerm)
  );
}

function getMatchingSequences(wordTags, activeWordTags) {
  /*
  Copyright (c) 2015 Julian Alexander Fleischer

  Permission is hereby granted, free of charge, to any
  person obtaining a copy of this software and associated
  documentation files (the "Software"), to deal in the
  Software without restriction, including without
  limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software
  is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice
  shall be included in all copies or substantial portions
  of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
  ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
  TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
  CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
  IN THE SOFTWARE.*/
  var m = 0;
  var i = 0;
  var table = [];

  var pos = 2;
  var cnd = 0;

  table[0] = -1;
  table[1] = 0;

  // build the table for KMP. This takes `O(word.length)` steps.
  while (pos < activeWordTags.length) {
    if (activeWordTags[pos - 1] == activeWordTags[cnd]) {
      cnd = cnd + 1;
      table[pos] = cnd;
      pos = pos + 1;
    } else if (cnd > 0) {
      cnd = table[cnd];
    } else {
      table[pos] = 0;
      pos = pos + 1;
    }
  }

  var matches = [];
  // scan the string. This takes `O(string.length)` steps.
  while (m + i < wordTags.length) {
    var tags = wordTags[m + i];
    if (tags.includes(activeWordTags[i])) {
      if (i == activeWordTags.length - 1) {
        matches.push(m);
      }
      i = i + 1;
    } else {
      if (table[i] > -1) {
        m = m + i - table[i];
        i = table[i];
      } else {
        i = 0;
        m = m + 1;
      }
    }
  }
  // Returns -1 if the subsequence was not found in the sequence.
  return matches;
}

function highlightMatchingWordTags(inscription, wordTags, activeWordTags) {
  var wordTagsWithIndex = wordTags.map((tag, index) => { tag.originalIndex = index; return tag; }).filter(tag => tag.length);
  var matches = getMatchingSequences(wordTagsWithIndex, activeWordTags);
  matches.forEach( i => {
    // Retrieve the original index for wordTags
    i = wordTagsWithIndex[i].originalIndex; 

    // Now that we have the correct index, display the tags.
    var j = 0;
    while (j < activeWordTags.length) {
      var tags = wordTags[i];
      if (!tags.length) {
        i++;
        continue;
      }
      var highlightColor = tagColors[activeWordTags[j]];
      var translation = document.getElementById(inscription.name + "-translation-" + i);
      if (!translation) {
        i++;
        continue;
      }
      translation.style.backgroundColor = highlightColor;
      var transliteration = document.getElementById(inscription.name + "-transliteration-" + i);
      transliteration.style.backgroundColor = highlightColor;
      var transcription = document.getElementById(inscription.name + "-transcription-" + i);
      transcription.style.backgroundColor = highlightColor;
      highlightedSearchElements.push(translation);
      highlightedSearchElements.push(transliteration);
      highlightedSearchElements.push(transcription);

      var highlightedElements = setHighlightLettersInTranscription(inscription.name, i, highlightColor);
      highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
      i++;
      j++;
    }
  });
}

function hasWordTagCombination(wordTags, activeWordTags) {
  var matches = getMatchingSequences(wordTags.filter(tag => tag.length), activeWordTags);
  return matches.length > 0;
}

function hasTag(tag, inscription) {
  return (
    (tags.has(inscription.name) && tags.get(inscription.name).includes(tag)) ||
    (contexts.has(inscription.name) && contexts.get(inscription.name).includes(tag)) ||
    inscription.support.includes(tag) ||
    inscription.findspot == tag ||
    inscription.site == tag ||
    inscription.name.substr(0, 2) == tag ||
    inscription.scribe == tag
  );
}

function applySearchTerms() {

  var searchTerms = document.getElementById("search-terms");
  var numberOfSearchTerms = searchTerms.children.length;
  var searchTermValues = Array.prototype.slice.call(searchTerms.children)
    .map(x => stripErased(x.textContent));
  var numberOfTags = activeTags.length + consoleButtons.get('activeWordTags').currentActiveTags().length;
  var hasSearchTerm = (numberOfSearchTerms + numberOfTags > 0)
  if (!hasSearchTerm) {
    document.getElementById("clear-command").style.backgroundColor = "black";
  } else {
    document.getElementById("clear-command").style.backgroundColor = "purple";
  }
  clearHighlights();

  for (var inscription of inscriptions.values()) {
    if (!hasSearchTerm) {
      if (inscription.element) {
        inscription.element.style.display = "flex";
      }
      continue;
    }
    var shouldDisplay = false;
    searchTermValues.forEach( searchTerm => {
      var fullWordMatch = searchTerm.includes("\"");
      searchTerm = searchTerm.replace(/\"/g, "");

      if (hasMatch(fullWordMatch, searchTerm, inscription)) {
        shouldDisplay = true;
      }
    });

    var tagsToAdd = [];
    activeTags.forEach( tag => {
      if (hasTag(tag, inscription)) {
        shouldDisplay = true;
        tagsToAdd.push(tag);
      }
    });

    var shouldHighlightWordTags = hasWordTagCombination(inscription.wordTags, consoleButtons.get('activeWordTags').currentActiveTags());
    if (shouldHighlightWordTags) {
      shouldDisplay = true;
    }

    if (!shouldDisplay) {
      if (inscription.element) {
        inscription.element.style.display = "none";
      }
      continue;
    }

    var newElement = loadInscription(inscription);
    observer.observe(inscription.element);
    if (!newElement) {
      inscription.element.style.display = "flex";
    }

    for (var i = 0; i < searchTerms.children.length; i++) {
      var searchElement = searchTerms.children[i];
      if (!searchElement) {
        continue;
      }
      var term = searchElement.textContent;
      for (var j = 0; j < inscription.element.children.length; j++) {
        var element = inscription.element.children[j];
        var highlightColor = searchElement.getAttribute("highlightColor");
        highlightMatchesInElement(element, term, highlightColor);
      }
    }

    if (shouldHighlightWordTags) {
      highlightMatchingWordTags(inscription, inscription.wordTags, consoleButtons.get('activeWordTags').currentActiveTags());
    }
  }
}

function removeFilter(evt) {
  evt.target.parentElement.removeChild(evt.target);
  hideWordChart();
  applySearchTerms();
}

function searchForWord(evt, name, index) {
  var element = document.getElementById(name + "-transcription-" + index);
  var searchTerm = stripErased(element.textContent);
  var searchBox = document.getElementById("search");
  searchBox.value = searchTerm;
  searchBox.dispatchEvent(new InputEvent("input"));
}

function shuffleImagesToFront(array) {

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const hasImage = function(x) { return inscriptions.get(x).images.length > 0; }
  const hasLetterMaps = function(x) { 
    var imgs = inscriptions.get(x).images;
    if (!imgs.length) {
      return false;
    }
    return imgs.some(v => coordinates.has(v));
  }
  let a1 = shuffle(array.filter((v, i, a) => hasLetterMaps(v)));
  a1 = a1.concat(shuffle(array.filter((v, i, a) => hasImage(v))));
  a1 = a1.concat(shuffle(array.filter((v, i, a) => !hasImage(v))));

  return a1;
}

// Shuffle the inscriptions so we display a different group at the top every time
var inscriptionsToLoad = shuffleImagesToFront(Array.from(inscriptions.keys()))[Symbol.iterator]();
var tagColors = {};
function consoleButton(button, metadata, activeMetadataName) {
  var activeMetadata = [];
  if (activeMetadataName == "activeFindsites") {
    document.querySelectorAll('area').forEach( x =>  {
      x.addEventListener("mouseenter", showPin);
      x.addEventListener("mouseleave", hidePin);
      x.addEventListener("click", toggleMetadatum(''));
    });
  }

  document.addEventListener("click", function (e) {
    var container = document.getElementById("filter-details-container");
    container.style.visibility = "hidden";
    container.showing = "";
    hideMap();
  });

  button.addEventListener("click", function (event) { 
    metadata = metadata.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });

    var search = document.getElementById("search");
    search.style.visibility = "hidden";
    document.getElementById("search-command").style.backgroundColor = "black";

    var container = document.getElementById("filter-details-container");
    container.innerHTML = "";
    if (activeMetadataName == "activeWordTags") {
      // Create a console for adding word tags to.
      var item = document.createElement("div");
      item.className = 'word-tag-container';
      item.id = 'word-tag-container';
      container.appendChild(item);
      for (var i = 0; i < activeMetadata.length; i++) {
        var tag = activeMetadata[i];
        var item = document.createElement("div");
        item.className = 'tag';
        item.style.backgroundColor = tagColors[tag];
        item.textContent = tag;
        item.addEventListener("click", removeWordTag(i));
        document.getElementById("word-tag-container").appendChild(item);
      }
    }
    if (activeMetadataName == "activeFindsites") {
      showMap();
    } else {
      hideMap();
    }

    if (container.showing == activeMetadataName) {
      container.style.visibility = "hidden";
      container.showing = "";
      return;
    }
    container.showing = activeMetadataName;
    container.style.visibility = "visible";

    for (var datum of metadata) {
      var item = document.createElement("div");
      item.className = 'filter-tag';
      item.textContent = datum;
      if (activeMetadataName == "activeWordTags") { 
        item.addEventListener("click", toggleWordTag(datum));
      } else {
        item.addEventListener("click", toggleMetadatum(datum));
        item.style.backgroundColor = activeMetadata.includes(datum) ? tagColors[datum] : "black";
        item.style.color = activeMetadata.includes(datum) ? "black" : "white";
      }
      container.appendChild(item);
    }
    event.stopPropagation();
  });

  function hideMap() {
    var findsites = document.getElementById("findsites");
    findsites.style.visibility = "hidden";
    Array.prototype.map.call(findsites.getElementsByClassName("pin"), x => x.style.visibility = "hidden");
  }

  function toggleMetadatum(datum) {
    return function(event) {
      if (activeMetadataName == "activeFindsites") {
        datum = event.target.alt;
      }
      if (activeMetadata.includes(datum)) {
        activeMetadata.splice(activeMetadata.indexOf(datum), 1);
      } else {
        activeMetadata.push(datum);
        if (!tagColors[datum]) {
          tagColors[datum] = cycleColor(); 
        }
      }

      if (activeMetadataName == "activeFindsites") {
        var pin = document.getElementById("pin-" + datum);
        pin.style.visibility = activeMetadata.includes(datum) ? "visible" : "hidden";
      }

      button.style.backgroundColor = activeMetadata.length ? "purple" : "black";
      toggleTag(event, datum);
      event.stopPropagation();
    }
  }
  this.toggleMetadatum = toggleMetadatum;

  function removeWordTag(index) {
    return function(event) {
      activeMetadata.splice(index, 1);
      var element = document.getElementById("wordtags-command");
      element.style.backgroundColor = activeMetadata.length ? "purple" : "black";
      removeFilter(event);
    }
  }

  function toggleWordTag(datum) {
    return function(event) {
      activeMetadata.push(datum);
      if (!tagColors[datum]) {
        tagColors[datum] = cycleColor(); 
      }

      var item = document.createElement("div");
      item.className = 'tag';
      item.style.backgroundColor = tagColors[datum];
      item.textContent = datum;
      item.addEventListener("click", removeWordTag(activeMetadata.length - 1));
      document.getElementById("word-tag-container").appendChild(item);

      applySearchTerms();
      button.style.backgroundColor = "purple";
      event.stopPropagation();
    }
  }

  function toggleTag(event, tag) {
    if (activeTags.includes(tag)) {
      activeTags.splice(activeTags.indexOf(tag), 1);
    } else {
      activeTags.push(tag);
    }
    var element = event.target;
    // Don't change the color of the tag if it is not being clicked from the menu
    if (element.className == "filter-tag") {
      var color = element.style.backgroundColor;
      element.style.color = color == tagColors[tag] ? "white" : "black";
      element.style.backgroundColor = color == tagColors[tag] ? "black" : tagColors[tag];
    }
    applySearchTerms();
  }

  function clearTags() {
    activeMetadata = [];
  }
  this.clearTags = clearTags

  function currentActiveTags() {
    return activeMetadata;
  }
  this.currentActiveTags = currentActiveTags

  function showPin(event) {
    var spot = event.target.alt;
    document.getElementById("pin-" + spot).style.visibility = 'visible';
  }

  function hidePin(event) {
    var spot = event.target.alt;
    if (activeMetadata.includes(spot)) {
      document.getElementById("pin-" + spot).style.visibility = 'visible';
      return;
    }
    document.getElementById("pin-" + spot).style.visibility = 'hidden';
  }

  function showMap() {
    var findsites = document.getElementById('findsites');
    var isVisible = findsites.style.visibility == "visible";
    if (isVisible) {
      findsites.style.visibility = 'hidden';
      Array.prototype.map.call(document.getElementsByClassName("pin"), x => x.style.visibility = "hidden");
      return;
    }
    activeMetadata.forEach( spot => {
      var pin = document.getElementById("pin-" + spot);
      pin.style.visibility = "visible";
    });

    var search = document.getElementById("search");
    search.style.visibility = "hidden";
    document.getElementById("search-command").style.backgroundColor = "black";

    var container = document.getElementById("filter-details-container");
    container.innerHTML = "";

    var container = document.getElementById("findsites");
    container.style.visibility = "visible";
  }
}

function clearTags() {
  var container = document.getElementById("filters-container");
  Array.prototype.map.call(container.getElementsByClassName("filter-command"),
    x => x.style.backgroundColor = "black");
  container = document.getElementById("filter-details-container");
  Array.prototype.map.call(container.getElementsByClassName("filter-tag"),
    x => { x.style.backgroundColor = "black"; x.style.color = "white";});
  container = document.getElementById("filter-details-container");
  if (container) {
    container.innerHTML = "";
  }
  activeTags = [];
  consoleButtons.forEach( (value, key, map) => value.clearTags());
}

var activeTags = [];

// create config object: rootMargin and threshold
// are two properties exposed by the interface
const config = {
  rootMargin: '0px 0px 40% 0px',
  threshold: 0.5
};

// Load inscriptions as they come into view
let observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    // Only load new inscriptions if a search isn't active
    var searchTerms = document.getElementById("search-terms");
    var numberOfSearchTerms = searchTerms.children.length;
    if (entry.isIntersecting && !numberOfSearchTerms && !highlightedSearchElements.length
      && !activeTags.length && !consoleButtons.get('activeWordTags').currentActiveTags().length) {
      [1,2].forEach( x => { 
        var key = inscriptionsToLoad.next().value;
        if (key) {
          var inscription = inscriptions.get(key);
          if (!inscription.element) {
            loadInscription(inscription);
          }
          observer.observe(inscription.element);
        }
      });
      self.unobserve(entry.target);
    }
  });
}, config);

var consoleButtons = new Map();
function loadExplorer() {
  var supports = [];
  var scribes = [];
  var findspots = [];

  loadInscriptionLevelTags();
  loadAnnotations();

  var buttonsToAdd = [
    [document.getElementById("wordtags-command"), wordtags, 'activeWordTags'],
    [document.getElementById("contexts-command"), Array.from(contexts.values()).flat(), 'activeContexts'],
    [document.getElementById("tags-command"), Array.from(tags.values()).flat(), 'activeTagValues'],
    [document.getElementById("scribes-command"), scribes, 'activeScribes'],
    [document.getElementById("findspots-command"), findspots, 'activeFindspots'],
  ];
  buttonsToAdd.forEach( vals => {
    var name = vals[2];
    consoleButtons.set(name, new consoleButton(vals[0], vals[1], name));
  });

  document.getElementById("search-command").addEventListener("click", toggleSearch);
  document.getElementById("help-command").addEventListener("click", sendKey('?'));
  document.getElementById("help_menu").addEventListener("click", sendKey('?'));
  document.getElementById("clear-command").addEventListener("click", sendKey('c'));
  autocomplete(document.getElementById("search"));

  for (var i = 0; i < 10; i++) {
    var key = inscriptionsToLoad.next().value;
    var visibleInscription = loadInscription(inscriptions.get(key));
    observer.observe(visibleInscription);
  }
  showSearch();

  function loadInscriptionLevelTags() {
    for (var inscription of inscriptions.values()) {
      for (var item of [[supports, inscription.support],
        [scribes, inscription.scribe],
        [findspots, inscription.findspot],
      ]) {
        var tag = item[1];
        if (!tag) {
          continue;
        }
        if (item[0].includes(tag)) {
          continue;
        }
        item[0].push(tag);
      }
    }
  }

  var wordtags = [];
  function loadAnnotations() {
    var collectedWordTags = [];
    for (var annotation of wordAnnotations) {
      var inscription = inscriptions.get(annotation.name);
      if (!inscription) {
        continue;
      }
      inscription.wordTags = [];
      for (var word of annotation.tagsForWords) {
        inscription.wordTags.push(word.tags);
        collectedWordTags.push(...word.tags);
      }
    }

    // Dedupe the list
    wordtags = collectedWordTags.filter((v, i, a) => a.indexOf(v) === i);

    // Filter out the site names
    var sites = Array.from(inscriptions.values()).map(x => x.site).filter((v, i, a) => a.indexOf(v) === i);
    wordtags = wordtags.filter((v, i, a) => !sites.includes(v));
  }
}

loadExplorer();

window.onload = function() {
  // If we've been passed a specific inscription in the URL path
  // then zoom it.
  var urlPath = /\/\/(.+)\/(.+)/.exec(document.referrer);
  if (urlPath) {
    var id = urlPath[2];
    if (!inscriptions.has(id)) {
      return;
    }
    loadInscription(inscriptions.get(id))
    var inscription = document.getElementById(id);
    zoomItem(inscription);
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
