stdin = process.openStdin() #so this is some Nodejs stuff I dont know yet, I think standard input
stdin.setEncoding 'utf8'
inputCallback = null
stdin.on 'data', (input) -> inputCallback input #Whenever there is data put in, call the inputCallback function

		
GRIDSIZE = 5 #We wanna play on a 5x5 grid
MIN_WORD_LENGTH = 3

promptForFirstTile = ->
	printGrid()
	console.log 'Please enter the coords for the first tile'
	inputCallback = (input) -> #So, for this scope we want this function to just check for valid coords and then prompt for the 2nd
		try 
			{x,y} = strToCoords input
		catch e
			console.log e
			return
		promptForSecondTile x,y

promptForSecondTile = (x1,y1) ->
	console.log 'And the second one?'
	inputCallback = (input) -> #And for this scope it checks and starts over again basically
		try
			{x: x2, y: y2} = strToCoords input
		catch e
			console.log e
			return
		if x1 is x2 and y1 is y2
			console.log "They can't be the same tile"
		else
			console.log "Swapping tiles. Reticulating Splines"
			x1--; x2--; y1--; y2--; # they are HUMANS not ROBOTS! 1 based, dammit
			[grid[x1][y1], grid[x2][y2]] = [grid[x2][y2], grid[x1][y1]]
			{moveScore, newWords} = scoreMove grid, {x1,y1,x2,y2}
			unless moveScore is 0
				console.log """
					You formed the following word(s):
					#{newWords.sort().join(', ')}
					
					"""
				score += moveScore
			moveCount++
			console.log "Your score is #{score} after #{moveCount} moves"
			console.log """
				All Words Used:
				#{usedWords.sort().join(', ')}
				"""
			promptForFirstTile()

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

