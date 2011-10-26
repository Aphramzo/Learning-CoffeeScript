stdin = process.openStdin() #so this is some Nodejs stuff I dont know yet, I think standard input
stdin.setEncoding 'utf8'
inputCallback = null
stdin.on 'data', (input) -> inputCallback input #Whenever there is data put in, call the inputCallback function

promptForFirstTile = ->
	console.log 'Please enter the coords for the first tile'
	inputCallback = (input) -> #So, for this scope we want this function to just check for valid coords and then prompt for the 2nd
		promptForSecondTile() if strToCoords input

promptForSecondTile = ->
	console.log 'And the second one?'
	inputCallback = (input) -> #And for this scope it checks and starts over again basically
		if strToCoords input
			console.log 'Swapping Tiles'
			promptForFirstTile()
			
GRIDSIZE = 5 #We wanna play on a 5x5 grid
inRange = (x,y) ->
	0 <= x < GRIDSIZE and 0 <= y < GRIDSIZE #simple function to make sure the coords fit on our grid

isInt = (num) ->
	num is Math.round(num) #I find it hard to believe there isnt a standard IsInt type function, but for now...

strToCoords = (input) ->
	halves = input.split(',')
	if halves.length is 2
		x = parseFloat halves[0]
		y = parseFloat halves[1]
		if !isInt(x) or !isInt(y)
			console.log 'Your coords must be an integer. Try again dummy.'
		else if not inRange x-1, y-1
			console.log "Your coords need to be between 1 and #{GRIDSIZE}."
		else
			{x,y}
	else
		console.log 'Need to enter coords in like X, Y'

console.log 'Start playing this stupid thing'
promptForFirstTile()