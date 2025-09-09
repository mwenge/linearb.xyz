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


function lettersInWord(word) {
  var splitter = new GraphemeSplitter();
  return splitter.countGraphemes(word);
}

function isNumber(character) {
  var unicode = character.codePointAt(0);
  if (unicode < 65792 || unicode > 65855) {
    return false;
  }
  return true;
}


function addLetterImagesToChart(img, image, inscription) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.name);
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      var word = letters[i];

      if (area.width < 10) {
        continue;
      }
      if (word == "—" || word == '') {
        continue;
      }

      item = document.getElementById(word);
      if (!item) {
        var d1 = document.createElement("div");
        d1.className = 'concordance-item-wrapper';
        container.appendChild(d1);
        
        var item = document.createElement("div");
        item.className = 'concordance-item-container';
        item.id = word;
        item.name = word;
        d1.appendChild(item);

        var label = document.createElement("div");
        label.className = "concordance-container-label";
        label.textContent = word + " in the Linear B corpus";
        d1.appendChild(label);
      }
      var d1 = document.createElement("div");
      d1.className = "inscription-container";

      var imageContainer = document.createElement("div");
      imageContainer.className = "concordance-item";
      d1.appendChild(imageContainer);

      var span = document.createElement("div");
      span.className = "concordance-label";
      span.textContent = inscription.name;
      d1.appendChild(span);

      item.appendChild(d1);
      
      span = document.createElement("span");
      imageContainer.appendChild(span);

      var canvas = document.createElement('canvas');
      var w = area.width;
      var h = area.height;
      if (h > w) {
        canvas.height = 50;
        canvas.width = 50 * w / h;
      } else {
        canvas.width = 50;
        canvas.height = 50 * h / w;
      }
      var ctx = canvas.getContext('2d', {alpha: false});
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
      span.appendChild(canvas);
    }
  };
}

function addWordImagesToChart(img, image, inscription, type) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var currentWord = 0;
    var prevWord = -1;
    var item = null;
    var imageSpan = null;
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      currentWord = wordIndexForLetterIndex(inscription.name, i);

      var word = stripErased(inscription.words[currentWord]);

      if (currentWord != prevWord) {
        item = document.getElementById(type + "-" + word);
        if (!item) {
          var d1 = document.createElement("div");
          d1.className = 'concordance-item-wrapper';
          container.appendChild(d1);
          
          var item = document.createElement("div");
          item.className = 'concordance-item-container';
          if (lettersInWord(word) > 1) {
            item.className += " concordance-item-word-container";
          }

          item.id = type + "-" + word;
          item.name = type + "-" + word;
          d1.appendChild(item);

          var label = document.createElement("div");
          label.className = "concordance-container-label";
          label.textContent = word + " in the Linear A corpus";
          d1.appendChild(label);
        }
        var d1 = document.createElement("div");
        d1.className = "inscription-container";

        var imageContainer = document.createElement("div");
        imageContainer.className = "concordance-item";
        d1.appendChild(imageContainer);
        imageSpan = document.createElement("span");
        imageContainer.appendChild(imageSpan);

        var span = document.createElement("div");
        span.className = "concordance-label";
        span.textContent = inscription.name;
        d1.appendChild(span);

        item.appendChild(d1);
      }
      prevWord = currentWord;

      var canvas = document.createElement('canvas');
      canvas.height = 40;
      canvas.width = 40 * (area.width / area.height);
      var ctx = canvas.getContext('2d', {alpha: false});
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
      imageSpan.appendChild(canvas);
    }
  };
}

function loadWords(inscription) {
  var imagesToLoad = (imageType == "facsimile") ? inscription.facsimileImages : inscription.images;
  imagesToLoad.forEach( image => {
    var img = new Image();
    img.src = "../" + encodeURIComponent(image);
    if (displayType == "word") {
      img.addEventListener("load", addWordImagesToChart(img, image, inscription));
    } else {
      img.addEventListener("load", addLetterImagesToChart(img, image, inscription));
    }
  });
}

function loadChart() {
  container.innerHTML = "";
  for (var inscription of inscriptions.values()) {
    loadWords(inscription);
  }
}

var imageType = "facsimile";
var displayType = "letter";
var toggleImageType = function(e) {
    if (imageType == "facsimile") {
      imageType = "photo";
      document.getElementById("facsimiles-command").style.backgroundColor = "black"; 
      document.getElementById("photos-command").style.backgroundColor = "purple"; 
    } else {
      imageType = "facsimile";
      document.getElementById("facsimiles-command").style.backgroundColor = "purple"; 
      document.getElementById("photos-command").style.backgroundColor = "black"; 
    }
    loadChart();
};
var toggleDisplayType = function(e) {
    if (displayType == "letter") {
      displayType = "word";
      document.getElementById("words-command").style.backgroundColor = "purple"; 
      document.getElementById("letters-command").style.backgroundColor = "black"; 
    } else {
      displayType = "letter";
      document.getElementById("words-command").style.backgroundColor = "black"; 
      document.getElementById("letters-command").style.backgroundColor = "purple"; 
    }
    loadChart();
};

