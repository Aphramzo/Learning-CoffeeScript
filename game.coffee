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


fs = require 'fs' #fs = file system
owl2 = fs.readFileSync 'OWL2.txt', 'utf8' # reads the content of the file into this string, blocking-ly

wordList = owl2.match /^(\w+)/mg
wordList = (word for word in wordList when word.length <= GRIDSIZE)

isWord = (str) ->
	str in wordList
	
numberOfTiles = 
	A:9, 
	B:2, 
	C:2, 
	D:4,
	E:12,
	F:2,
	G:3,
	H:2,
	I:9,
	J:1,
	K:1,
	L:4,
	M:2,
	N:6,
	O:8,
	P:2,
	Q:1,
	R:6,
	S:4,
	T:6,
	U:4,
	V:2,
	W:2,
	X:1,
	Y:2,
	Z:1
	
totalTiles = 0
totalTiles += count for letter, count of numberOfTiles #take the value in the key, value looping struct to add to totalTiles count
 
alphabet = (letter for letter of numberOfTiles).sort() #just creating a list of the keys only in number of tiles (so you know, the ABCs)

console.log totalTiles + ' is the number of tiles'
randomLetter = ->
	randomNumber = Math.ceil Math.random() * totalTiles
	x = 1
	for letter in alphabet
		x += numberOfTiles[letter]
		return letter if x > randomNumber

grid = for x in [0...GRIDSIZE]
	for y in [0...GRIDSIZE]
		randomLetter()

printGrid = ->
	rows = for x in [0...GRIDSIZE]
		for y in [0...GRIDSIZE]
			grid[y][x]
	rowStrings = (' ' + row.join(' | ') for row in rows)
	rowSeparator = ('-' for i in [1...GRIDSIZE*4]).join('')
	console.log '\n' + rowStrings.join("\n#{rowSeparator}\n") + '\n'
	
letterValues = 
	A:1,
	B:3,
	C:3,
	D:2,
	E:1,
	F:4,
	G:2,
	H:4,
	I:1,
	J:8,
	K:5,
	L:1,
	M:3,
	N:1,
	O:1,
	P:3,
	Q:10,
	R:1,
	S:1,
	T:1,
	U:1,
	V:4,
	W:4,
	X:8,
	Y:4,
	Z:10
	
moveCount = 0
score = 0
usedWords = []

scoreMove = (grid,swapCoordiantes) ->
	{x1,x2,y1,y2} = swapCoordiantes #I GET IT, that is actually super nifty
	words = wordsThroughTile(grid, x1, y1).concat wordsThroughTile(grid, x2, y2)
	moveScore = multiplier = 0 #settings both to 0
	newWords = []
	for word in words when word not in usedWords and word not in newWords # this word cannot be used this turn (newWords) OR at all this game (global scoped usedWords)
		multiplier++
		moveScore += letterValues[letter] for letter in word
		newWords.push word
	usedWords = usedWords.concat newWords
	moveScore *= multiplier #looks like it is important to use swaps that give multi words!
	{moveScore, newWords}
		
wordsThroughTile = (grid, x,y) ->
	strings = []
	for length in [MIN_WORD_LENGTH..GRIDSIZE]
		range = length - 1
		addTiles = (func) ->
			strings.push (func(i) for i in [0..range]).join ''
		for offset in [0...length]
			if inRange(x-offset,y) and inRange(x-offset+range,y)
				addTiles (i) -> grid[x-offset+i][y]
			if inRange(x,y-offset) and inRange(x,y-offset+range)
				addTiles (i) -> grid[x][y-offset+i]
			if inRange(x-offset,y-offset) and inRange(x-offset+range, y-offset+range)
				addTiles (i) -> grid[x-offset+i][y-offset+i]
			if inRange(x-offset,y-offset) and inRange(x-offset+range, y+offset-range)
				addTiles (i) -> grid[x-offset+i][y+offset-i]
	str for str in strings when isWord str
	

console.log 'Welcome to the 5x5!'
for x in [0...GRIDSIZE]								#look through the initialized grid and see what words exist
	for y in [0...GRIDSIZE]
		scoreMove grid, {x1:x, x2:x, y1:y, y2:y}
		
unless usedWords.length is 0						#if there were existing words display them 
	console.log """
		Initially used words:
		#{usedWords.sort().join ', ' }
	"""

console.log "Please choose a tile in the form (x, y)"



console.log 'Start playing this stupid thing'
promptForFirstTile()
		