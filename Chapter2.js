// Generated by CoffeeScript 1.6.3
(function() {
  var GRIDSIZE, inRange, inputCallback, isInt, promptForFirstTile, promptForSecondTile, stdin, strToCoords;

  stdin = process.openStdin();

  stdin.setEncoding('utf8');

  inputCallback = null;

  stdin.on('data', function(input) {
    return inputCallback(input);
  });

  promptForFirstTile = function() {
    console.log('Please enter the coords for the first tile');
    return inputCallback = function(input) {
      if (strToCoords(input)) {
        return promptForSecondTile();
      }
    };
  };

  promptForSecondTile = function() {
    console.log('And the second one?');
    return inputCallback = function(input) {
      if (strToCoords(input)) {
        console.log('Swapping Tiles');
        return promptForFirstTile();
      }
    };
  };

  GRIDSIZE = 5;

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

  console.log('Start playing this stupid thing');

  promptForFirstTile();

}).call(this);
