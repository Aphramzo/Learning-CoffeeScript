// Generated by CoffeeScript 1.6.3
(function() {
  var GRIDSIZE, MIN_WORD_LENGTH, alphabet, count, fs, grid, inRange, inputCallback, isInt, isWord, letter, letterValues, moveCount, numberOfTiles, owl2, printGrid, promptForFirstTile, promptForSecondTile, randomLetter, score, scoreMove, stdin, strToCoords, totalTiles, usedWords, word, wordList, wordsThroughTile, x, y, _i, _j,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  stdin = process.openStdin();

  stdin.setEncoding('utf8');

  inputCallback = null;

  stdin.on('data', function(input) {
    return inputCallback(input);
  });

  GRIDSIZE = 5;

  MIN_WORD_LENGTH = 3;

  promptForFirstTile = function() {
    printGrid();
    console.log('Please enter the coords for the first tile');
    return inputCallback = function(input) {
      var e, x, y, _ref;
      try {
        _ref = strToCoords(input), x = _ref.x, y = _ref.y;
      } catch (_error) {
        e = _error;
        console.log(e);
        return;
      }
      return promptForSecondTile(x, y);
    };
  };

  promptForSecondTile = function(x1, y1) {
    console.log('And the second one?');
    return inputCallback = function(input) {
      var e, moveScore, newWords, x2, y2, _ref, _ref1, _ref2;
      try {
        _ref = strToCoords(input), x2 = _ref.x, y2 = _ref.y;
      } catch (_error) {
        e = _error;
        console.log(e);
        return;
      }
      if (x1 === x2 && y1 === y2) {
        return console.log("They can't be the same tile");
      } else {
        console.log("Swapping tiles. Reticulating Splines");
        x1--;
        x2--;
        y1--;
        y2--;
        _ref1 = [grid[x2][y2], grid[x1][y1]], grid[x1][y1] = _ref1[0], grid[x2][y2] = _ref1[1];
        _ref2 = scoreMove(grid, {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        }), moveScore = _ref2.moveScore, newWords = _ref2.newWords;
        if (moveScore !== 0) {
          console.log("You formed the following word(s):\n" + (newWords.join(', ')) + "\n");
          score += moveScore;
        }
        moveCount++;
        console.log("Your score is " + score + " after " + moveCount + " moves");
        return promptForFirstTile();
      }
    };
  };

  inRange = function(x, y) {
    return (0 <= x && x < GRIDSIZE) && (0 <= y && y < GRIDSIZE);
  };

  isInt = function(num) {
    return num === Math.round(num);
  };

  strToCoords = function(input) {
    var halves, x, y;
    halves = input.split(',');
    if (halves.length === 2) {
      x = parseFloat(halves[0]);
      y = parseFloat(halves[1]);
      if (!isInt(x) || !isInt(y)) {
        return console.log('Your coords must be an integer. Try again dummy.');
      } else if (!inRange(x - 1, y - 1)) {
        return console.log("Your coords need to be between 1 and " + GRIDSIZE + ".");
      } else {
        return {
          x: x,
          y: y
        };
      }
    } else {
      return console.log('Need to enter coords in like X, Y');
    }
  };

  fs = require('fs');

  owl2 = fs.readFileSync('OWL2.txt', 'utf8');

  wordList = owl2.match(/^(\w+)/mg);

  wordList = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = wordList.length; _i < _len; _i++) {
      word = wordList[_i];
      if (word.length <= GRIDSIZE) {
        _results.push(word);
      }
    }
    return _results;
  })();

  isWord = function(str) {
    return __indexOf.call(wordList, str) >= 0;
  };

  numberOfTiles = {
    A: 9,
    B: 2,
    C: 2,
    D: 4,
    E: 12,
    F: 2,
    G: 3,
    H: 2,
    I: 9,
    J: 1,
    K: 1,
    L: 4,
    M: 2,
    N: 6,
    O: 8,
    P: 2,
    Q: 1,
    R: 6,
    S: 4,
    T: 6,
    U: 4,
    V: 2,
    W: 2,
    X: 1,
    Y: 2,
    Z: 1
  };

  totalTiles = 0;

  for (letter in numberOfTiles) {
    count = numberOfTiles[letter];
    totalTiles += count;
  }

  alphabet = ((function() {
    var _results;
    _results = [];
    for (letter in numberOfTiles) {
      _results.push(letter);
    }
    return _results;
  })()).sort();

  console.log(totalTiles + ' is the number of tiles');

  randomLetter = function() {
    var randomNumber, x, _i, _len;
    randomNumber = Math.ceil(Math.random() * totalTiles);
    x = 1;
    for (_i = 0, _len = alphabet.length; _i < _len; _i++) {
      letter = alphabet[_i];
      x += numberOfTiles[letter];
      if (x > randomNumber) {
        return letter;
      }
    }
  };

  grid = (function() {
    var _i, _results;
    _results = [];
    for (x = _i = 0; 0 <= GRIDSIZE ? _i < GRIDSIZE : _i > GRIDSIZE; x = 0 <= GRIDSIZE ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (y = _j = 0; 0 <= GRIDSIZE ? _j < GRIDSIZE : _j > GRIDSIZE; y = 0 <= GRIDSIZE ? ++_j : --_j) {
          _results1.push(randomLetter());
        }
        return _results1;
      })());
    }
    return _results;
  })();

  printGrid = function() {
    var i, row, rowSeparator, rowStrings, rows;
    rows = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 0; 0 <= GRIDSIZE ? _i < GRIDSIZE : _i > GRIDSIZE; x = 0 <= GRIDSIZE ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (y = _j = 0; 0 <= GRIDSIZE ? _j < GRIDSIZE : _j > GRIDSIZE; y = 0 <= GRIDSIZE ? ++_j : --_j) {
            _results1.push(grid[y][x]);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    rowStrings = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        _results.push(' ' + row.join(' | '));
      }
      return _results;
    })();
    rowSeparator = ((function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 1, _ref = GRIDSIZE * 4; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push('-');
      }
      return _results;
    })()).join('');
    return console.log('\n' + rowStrings.join("\n" + rowSeparator + "\n") + '\n');
  };

  letterValues = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10
  };

  moveCount = 0;

  score = 0;

  usedWords = [];

  scoreMove = function(grid, swapCoordiantes) {
    var moveScore, multiplier, newWords, words, x1, x2, y1, y2, _i, _j, _len, _len1;
    x1 = swapCoordiantes.x1, x2 = swapCoordiantes.x2, y1 = swapCoordiantes.y1, y2 = swapCoordiantes.y2;
    words = wordsThroughTile(grid, x1, y1).concat(wordsThroughTile(grid, x2, y2));
    moveScore = multiplier = 0;
    newWords = [];
    for (_i = 0, _len = words.length; _i < _len; _i++) {
      word = words[_i];
      if (!(__indexOf.call(usedWords, word) < 0 && __indexOf.call(newWords, word) < 0)) {
        continue;
      }
      multiplier++;
      for (_j = 0, _len1 = word.length; _j < _len1; _j++) {
        letter = word[_j];
        moveScore += letterValues[letter];
      }
      newWords.push(word);
    }
    usedWords = usedWords.concat(newWords);
    moveScore *= multiplier;
    return {
      moveScore: moveScore,
      newWords: newWords
    };
  };

  wordsThroughTile = function(grid, x, y) {
    var addTiles, length, offset, range, str, strings, _i, _j, _k, _len, _results;
    strings = [];
    for (length = _i = MIN_WORD_LENGTH; MIN_WORD_LENGTH <= GRIDSIZE ? _i <= GRIDSIZE : _i >= GRIDSIZE; length = MIN_WORD_LENGTH <= GRIDSIZE ? ++_i : --_i) {
      range = length - 1;
      addTiles = function(func) {
        var i;
        return strings.push(((function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= range ? _j <= range : _j >= range; i = 0 <= range ? ++_j : --_j) {
            _results.push(func(i));
          }
          return _results;
        })()).join(''));
      };
      for (offset = _j = 0; 0 <= length ? _j < length : _j > length; offset = 0 <= length ? ++_j : --_j) {
        if (inRange(x - offset, y) && inRange(x - offset + range, y)) {
          addTiles(function(i) {
            return grid[x - offset + i][y];
          });
        }
        if (inRange(x, y - offset) && inRange(x, y - offset + range)) {
          addTiles(function(i) {
            return grid[x][y - offset + i];
          });
        }
        if (inRange(x - offset, y - offset) && inRange(x - offset + range, y - offset + range)) {
          addTiles(function(i) {
            return grid[x - offset + i][y - offset + i];
          });
        }
        if (inRange(x - offset, y - offset) && inRange(x - offset + range, y + offset - range)) {
          addTiles(function(i) {
            return grid[x - offset + i][y + offset - i];
          });
        }
      }
    }
    _results = [];
    for (_k = 0, _len = strings.length; _k < _len; _k++) {
      str = strings[_k];
      if (isWord(str)) {
        _results.push(str);
      }
    }
    return _results;
  };

  console.log('Welcome to the 5x5!');

  for (x = _i = 0; 0 <= GRIDSIZE ? _i < GRIDSIZE : _i > GRIDSIZE; x = 0 <= GRIDSIZE ? ++_i : --_i) {
    for (y = _j = 0; 0 <= GRIDSIZE ? _j < GRIDSIZE : _j > GRIDSIZE; y = 0 <= GRIDSIZE ? ++_j : --_j) {
      scoreMove(grid, {
        x1: x,
        x2: x,
        y1: y,
        y2: y
      });
    }
    if (usedWords.length !== 0) {
      console.log("Initially used words:\n" + (usedWords.join(', ')));
    }
  }

  console.log("Please choose a tile in the form (x, y)");

  console.log('Start playing this stupid thing');

  promptForFirstTile();

}).call(this);
