// No Blame (for p5.js)
// A specialized poetry line sorting and hexagram generating program
// Text by Tyler Carter, code by Eric Goddard-Scovel
// Begun in July of 2015, Processing (Java) version 0.1 completed September 18, 2015
// p5.js (javascript) version completed March 2021

// See www.noblamebook.com for more information on this project

// Initialize variables for stanza pattern and poem generation.
var patternSlots = 4, patternRange = 16, numberOfPoems = 16;
var linesPerStanza = 4, numberOfStanzas = 4, numberOfLines = 16;
var poemNum = 0;
// Array for initial generation of shuffled 1-16 integers (for stanza pattern generation).
var randomizedPatternSlotsArrSeed = [];
// ArrayList to hold all generated stanza patterns.
var stanzaPatternsArrayList = [];
// Initiate the duplicate array indices counter with a non-zero value (any old non-zero value will do).
// This is used by checkForDuplicateArrayIndices() in the stanza_patterns tab.
var duplicateIndices = 3;
// Arrays of arrays (2d arrays) for stanza patterns, poem source lists, and patterned poems (final output).
var stanzaPatterns = [];
var originalPoemSources = [];
var linguisticListsSources = [];
// Initialize arrays to hold all used line values in a signle 256 item list.
// I will cast the hexagrams later using the values in this list.
var lineValuesForHexGenOriginal = [];
var lineValuesForHexGenLinguistic = [];
var lineValuesForHexGenUnshuffledSets = [];
// Initialize arrays for all 256 lines of the final poem sets ( 2 set of 16 16-line poems).
var originalPoemsShuffled = [];
var linguisticPoemsShuffled = [];
// Boolean to avoid duplicate lines being drawn
var lineHasBeenUsed;
var aLine;
// This counter will be used by the draw function for keeping track of which poem page is to be drawn
var drawPoemPageCounter = 0; // Note: The counter runs from 0-63, corresponding to pages 1-64. I only add 1 when drawing the page number to the screen. This helps with working with arrays whose indices align with specific pages.

// Initialize next and previous page buttons
var nextPageButton;
var previousPageButton;
var refreshPageButton;

var pageXShift = 75;

// NOTE: Chrome doesn't support loading fonts like this from localhost. If I run it through Node, there will be no problem, or if I use standar web fonts.

function preload() {
  // Preload fonts -- Replace with Google fonts
  myFont = loadFont('fonts/Aver.ttf');
  // myFontItal = loadFont('fonts/AverItalic.ttf')
  // myFontBold = loadFont('fonts/AverBold.ttf')
  myFontBoldItalic = loadFont('fonts/AverBoldItalic.ttf')
  // Add preload calls for all art image files
}

//                                                        MAIN PROGRAM LOOP
function setup() {
  // Set display frame size.
  var canvas = createCanvas(1000, 1100);
  canvas.parent('sketch-holder');

  nextPageButton = createImg('assets/next-page-button-36px.png');
  nextPageButton.parent('sketch-holder');
  nextPageButton.position(987, 500);
  nextPageButton.mouseClicked(nextPage);

  previousPageButton = createImg('assets/previous-page-button-36px.png');
  previousPageButton.parent('sketch-holder');
  previousPageButton.position(987, 562);
  previousPageButton.mouseClicked(previousPage);

  refreshPageButton = createImg('assets/refresh-page-button-36px.png');
  refreshPageButton.parent('sketch-holder');
  refreshPageButton.position(987, 624);
  refreshPageButton.mouseClicked(refreshPage);

  background(255);

  makePoemSet(3); // Generate the 16 poem sets from the linguistic poem set.
  makePoemSet(4); // Generate the 16 poem sets from the original poem set.
  // Cast hexagrams from all 64 poems across the 4 sets.
  castHexagrams();
  // Check for duplicate entries that make the set incomplete; run castHexagrams over until complete set is generated.
  isSetComplete64Hexagrams();
  assembleAllPoemSetsArray();
  assembleBookByCastHexagrams();
  createLineArtArray();
  // NOTE:  These methods may not all need to be called in setup() once the cover page and other front matter pages are added.  They can be in draw() only.
  // drawPoemHexagram();
  angleMode(DEGREES)
  // rectMode(CENTER)  // Note: This can probably be removed. Test after relevant lines are transferred to the main-program setup().
  lineArtDrawingBuffer = createGraphics(650, 650)
  lineArtAssemblyBuffer = createGraphics(650, 650)
  makeLineArtBookSetArray()
  drawBookPage();
  textAlign(LEFT);
  text(drawPoemPageCounter+1, 748+pageXShift, 1000);
  noLoop();
}

// CREATE DRAW() FUNCTION to display poems on website
function draw(){
  constrainPageNumbers();
  background(255);
  drawPageBorder();
  drawPageNavDividers();
  drawBookPage();
  // drawPoemHexagram();
  textSize(16);
  textFont(myFont);
  textAlign(LEFT);
  text(drawPoemPageCounter+1, 748+pageXShift, 1000);
}

var borderXInit = 75;
var borderWidth = 850;
var borderHeight = 1099;

function drawPageBorder(){
  stroke(180);
  strokeWeight(1);
  line(borderXInit, 1, borderXInit+borderWidth, 1);
  line(borderXInit+borderWidth, 1, borderXInit+borderWidth, borderHeight);
  line(borderXInit, 1, borderXInit, borderHeight);
  line(borderXInit, borderHeight, borderXInit+borderWidth, borderHeight);
  strokeWeight(0);
  noStroke();
}

function drawTitleUnderline(){
  stroke(40);
  strokeCap(SQUARE);
  strokeWeight(1);
  line(450, 180, 550, 180);
  strokeWeight(0);
  noStroke();
}

function drawPageNavDividers(){
  stroke(180);
  strokeWeight(1);
  line(949, 510, 981, 510);
  line(949, 570, 981, 570);
  strokeWeight(0);
  noStroke();
}

function nextPage(){
  drawPoemPageCounter += 1;
  redraw();
}

function previousPage(){
  drawPoemPageCounter -= 1;
  redraw();
}

function refreshPage() {
  window.location.href = window.location.href;
}

function constrainPageNumbers() {
  if (drawPoemPageCounter < 0) {
    drawPoemPageCounter += 1;
  }
  if (drawPoemPageCounter > 63) {
    drawPoemPageCounter -= 1;
  }  
}

// This functions as a simple switch to trigger either drawing art on a page or drawing a poem
// The real useful code is in drawArtPage() and drawPoemPage()
function drawBookPage(){
  // This if statement checks if the current page counter number (page number -1) should have art (i.e., has no poem assigned to it).
  if (lineArtPageNumbers.indexOf(drawPoemPageCounter) > -1) {
    drawArtPage()
  } else {
    drawPoemPage()
  }
}

// Draws everything needed for the art pages. Connects to the code in line_art.js via the lineArtPagesArray
function drawArtPage(){
  textSize(20);
  textFont(myFontBoldItalic);

  textAlign(CENTER);

  // First, print the poem title / hexagram title from the assembledBookArray
  text(assembledBookArray[drawPoemPageCounter][1], 425+pageXShift, 160);
  drawTitleUnderline();

  // Test text version of art pages.  This will test that I have the correct trigrams connected to the pages too.
  textSize(36);
  textFont(myFont);
  textAlign(CENTER);

  // First, I must translate the current "book" page to the current lineArtPagesArray index
  // NOTE: thisLineArtPagesArrayIndex correspond with the playlistCounter variable in my test drawArt code
  let thisLineArtPagesArrayIndex
  for (i = 0; i < 16; i++) {
    let currentArray = lineArtPagesArray[i]
    if (currentArray.indexOf(drawPoemPageCounter) > -1) {
      thisLineArtPagesArrayIndex = i
      break
    } else {
      continue
    } 
  }

  // Next, I will print the art image for the current page.
  // Identify the current bottom trigram of this page's hexagram
  let thisBottomTrigram = lineArtPagesArray[thisLineArtPagesArrayIndex][2]

  // These bottom trigrams will be rotated 90 degrees to be vertical
  verticalConditionsArray = ['123', 'a23', 'a2c', '1b3']

  // console.log(verticalConditionsArray.includes(bottomTrigram))

  if (verticalConditionsArray.includes(thisBottomTrigram)) {  // If true, then the image will be rotated 90 degrees
  push()
    translate(1100, 0)
    rotate(90)
    image(lineArtBookSetArray[thisLineArtPagesArrayIndex], 220, 275) // worked at 245, 275
    pop()
  } else { // If not, then it will be drawn as usual (without rotation)
    image(lineArtBookSetArray[thisLineArtPagesArrayIndex], 175, 220) // worked at 175, 245
  }
}

function drawPoemPage(){
  textSize(20);
  textFont(myFontBoldItalic);

  textAlign(CENTER);
  // First, print the poem title / hexagram title from the assembledBookArray
  text(assembledBookArray[drawPoemPageCounter][1], 425+pageXShift, 160);
  drawTitleUnderline();

  // Next, I will print the poem for the current page number
  var poemXPosition = 175;
  var poemYStart = 280;
  var poemLineSpace = 30;
  var nextStanzaSpace = 118;
  for (i=0;i<4;i++) {
    for (j=0;j<4;j++) {
      textSize(16);
      textFont(myFont);
      textAlign(LEFT);
      text(assembledBookArray[drawPoemPageCounter][2][j+(i*4)], poemXPosition, poemYStart + (poemLineSpace*(i+j)));
    }
    poemYStart += nextStanzaSpace;
  }
}

// No longer used.
/*
function drawPoemHexagram(){
  var currentHexagramTag = assembledBookArray[drawPoemPageCounter][0];
  var looper = 0;
  var lineWidth = 72;
  var lineHeight = 2;
  var xPosition = 500-(lineWidth/2);
  var yPosition = 175;
  var lineSpacing = lineWidth/6;
  var brokenLineWidth = (lineWidth*5/12);
  var brokenLineGap = (lineWidth*7/12);

  while (looper < 6) {
    if (currentHexagramTag.substring(looper,looper+1) == str(looper+1)) {  // i.e. if it is a number
      fill(0);
      rect(xPosition, yPosition, lineWidth, lineHeight);
      yPosition -= lineSpacing;
      looper++
    } else { // i.e. if it is a letter
      fill(0);
      rect(xPosition, yPosition, brokenLineWidth, lineHeight);
      rect(xPosition+brokenLineGap, yPosition, brokenLineWidth, lineHeight);
      yPosition -= lineSpacing;
      looper++
    }
  }
}

*/

/*
  Wireframe for drawArt() and related art integration functions:
  1. Populate an array with the hexagram assignments for art pages.  Search for assembledbookarray indices with blank strings "  ".
  2. Create function to identify bottom and top trigrams for the art hexagrams.
  3. Create a function that will draw the correct art on the correct page.  Will likely be a procedure in the DrawPoemPage() function, or be called from it.
  4. Create a switch function that triggers the 8 lines patterns / objects for bottom and top trigrams.
  
  Wireframe for related saveBookToPDF() function:
  1. Use either saveCanvas() or the PHP method employed by wasdswag on this forum page:
     https://forum.processing.org/two/discussion/10913/saving-the-p5-js-canvas-as-an-image-on-my-server
  2. Create a PDF from the book page images.  NOTE:  Art images are already scaled up.  What about the rest of the book/pages?
     Can those be eaisly scaled up as well for this process?
  3. [OPTIONAL] Place a watermark on the cover page of the PDF with the "printing" number of the book.  This data can be stored on a JSON.
  4. Make sure that image files are wiped from server once PDF is created from the images.
  5. Serve user with PDF file to download.  Store a secondary copy to the server as well [OPTIONAL - Why did I want this?].

*/

/*
function drawArt() {
  textSize(16);
  textFont(myFont);
  textAlign(LEFT);
  text("\[ In Development: This page will display generative art. \]", 175, 275)
}
*/


///                                       STANZA PATTERNS                                          

function makeStanzaPatternSlotArrays() {
// Initialize pattern slots of 16 randomized lists of 0-15
  randomizedPatternSlotsArrSeed = [];
  randomizedPatternSlotsArray1 = [];
  randomizedPatternSlotsArray2 = [];
  randomizedPatternSlotsArray3 = [];
  randomizedPatternSlotsArray4 = [];
  // Populate Seed Array with 0-15
  for (i=0; i < 16; i++) {
    randomizedPatternSlotsArrSeed.push(i);
  }

  // Randomize the order of elements in the Array by shuffling, create 4 shuffled arrays
  randomizedPatternSlotsArray1 = shuffle(randomizedPatternSlotsArrSeed);
  randomizedPatternSlotsArray2 = shuffle(randomizedPatternSlotsArray1);
  randomizedPatternSlotsArray3 = shuffle(randomizedPatternSlotsArray2);
  randomizedPatternSlotsArray4 = shuffle(randomizedPatternSlotsArray3);
}

// This function checks all array indices [i] against each other for duplicate values.
// This will ensure that the stanza patterns will have four unique values, and
// that each of the sixteen lists is only drawn 4 times, resulting in 16 lines
// being used.
function checkForDuplicateArrayIndices() {
  for (i=0; i<16; i++) {
    if (randomizedPatternSlotsArray1[i] == randomizedPatternSlotsArray2[i]) {
      duplicateIndices = duplicateIndices + 1;
    } else if (randomizedPatternSlotsArray1[i] == randomizedPatternSlotsArray3[i]) {
      duplicateIndices = duplicateIndices + 1;
    } else if (randomizedPatternSlotsArray1[i] == randomizedPatternSlotsArray4[i]) {
      duplicateIndices = duplicateIndices + 1;
    } else if (randomizedPatternSlotsArray2[i] == randomizedPatternSlotsArray3[i]) {
      duplicateIndices = duplicateIndices + 1;
    } else if (randomizedPatternSlotsArray2[i] == randomizedPatternSlotsArray4[i]) {
      duplicateIndices = duplicateIndices + 1;
    } else if (randomizedPatternSlotsArray3[i] == randomizedPatternSlotsArray4[i]) {
      duplicateIndices = duplicateIndices + 1;
    }
  }
}

// This function will assemble the 16 four-element stanza pattern arrays from
// the arrays generated in makeStanzaPatternSlotArrays().
function makeStanzaPatterns() {
  for (i=0; i < numberOfPoems; i++) {
    // Create a new local array for each stanza pattern of 4 numbers (1-16)
    var aStanzaPattern = [];
    // Populate new array with correct index from Stanza Patterns Slot Arrays
    for (j=0; j < patternSlots; j++) {
      // Make sure the loop pulls index value j from the correct randomizedPatternSlotsArray
      if (j == 0) {
        var stanzaPatternSlotIndexNum = randomizedPatternSlotsArray1.slice(0);
      } else if (j == 1) { 
        var stanzaPatternSlotIndexNum = randomizedPatternSlotsArray2.slice(0);
      } else if (j == 2) { 
        var stanzaPatternSlotIndexNum = randomizedPatternSlotsArray3.slice(0);
      } else if (j == 3) { 
        var stanzaPatternSlotIndexNum = randomizedPatternSlotsArray4.slice(0);
      }
      aStanzaPattern[j] = stanzaPatternSlotIndexNum[i];
    }
    // Add the stanza pattern to the ArrayList of all stanza patterns
    stanzaPatterns.push(aStanzaPattern);
  }
}

//                                        MAKE POEMS                                          

// This function will use the stanza patterns created by makeStanzaPatterns() to
// generate the two sets of 16 poems from first the linguistic lists (which will make
// set 3), then the original poems (to make set 4).

// Define the original poems for later inclusion in allPoemSets. These arrays will not be shuffled or overwritten by the program like the next duplicate set (below).
var originalPoem1 = ['The universe has a beginning. ', 'And before that? ', 'Truth is found by subtracting what it could not be.', 'Another heaven altogether.', 'The distance between them.', 'Before & after.', 'This world is divided because time projects from a single point.', 'Light travels there & back.  ', 'The terminally dense blue of night\'s approach.', 'Dawn\'s red light on the horizon. ', 'Like Stephen Hawking said, sorrow expands.', 'A rower\'s meticulous form. ', 'The night sky does not shine like the stars. ', 'The night sky is burning too. ', 'We know this because the night sky does not.', 'Light waves filled with color. '];
var originalPoem2 = ['A self is made of words. Every moment seen is elsewhere, ', 'The best I can do is describe it.', 'A self is elsewhere.', 'Counting the trains at the station. ', 'Habit precludes every word and its interpretation.  ', 'I presume the thing before the thing, ideas of the world ', 'in the body of the world. ', '\"A stone mason uses the stone, yet he does not use it up.\"', 'A poem comes into focus.', 'Purpose occurs concurrently with language.', 'I want to be a better person', 'for you.', 'I wonder what my statue would look like?', 'said the little girl to her father. ', 'She held her hem at arms length and admired her shadow. ', 'He did the same.'];
var originalPoem3 = ['Deserted restaurant. ', 'Desire to eat. ', 'Our first job is to survive. ', 'He pretended to be a dragon.', 'Desire vomits on the floor.', 'Desire\'s desire.', 'Dirty streets in the old market place. ', 'The old witch stole my name.', 'The priests begin to set up. ', '\"Do not stay too long in the spirit world.\" ', 'Your real name is the Kohaku river, she screams. ', 'The Earth hurtles towards them.', 'An old rusty bike is pulled out of the mud. ', 'A row of hens.', 'Moving quietly behind the alter.', 'We too have names. '];
var originalPoem4 = ['I\'ve never seen a dinosaur though I\'ve seen its skeleton.', 'Horses and people used to be smaller.', 'The shape of a life or the life itself?', 'A meteorite hits the earth: I\'ll give you something to cry about.', 'I\'ve seen a six-toed cat.', 'Circles and squares exist, seashells exist.', 'Some people are born with webbing between their toes.', 'A slow and clumsy ape falls from a tree.', 'I haven\'t seen her for years.', 'Geese fly south in the winter.', 'The thinning neck eventually pinches and the drop drips.', 'A bird calls from the back of a rhinoceros.', 'I\'m going through one of those cycles.', 'Grass grows where grass grows.', 'When I say small I mean the size of a television. ', 'A pact was made between the settlers and the natives.'];
var originalPoem5 = ['It came from the sky, mostly.', 'To see what life was like I asked the man pushing his car. ', 'Pieces fit pressed against each other or magnets \"work hard.\"', 'A joke, a dense work of metal. ', 'Bodies filled with cream and butter.', 'Snow piled on the curb, plows moved around.', 'Making sure they were safe I said goodbye, cotton.', 'A wool sweater, independent.', 'Carry your body as you would a baby. ', 'Possession. \"I never knew how exciting addiction could be.\"', 'Walking over a sheet of ice, I take small steps.', 'A trench leads to each house.', 'Our rent was due: the streets were full of snow. ', 'These kinds of ideas. ', 'Earlier we managed to push his car out.', 'A rut gleaming in the snow.'];
var originalPoem6 = ['In the bottom corner of the screen is a timer.', 'Have you seen them race each other?', 'Two-hundred meters of free style, circular and simple.', 'Whistling for the winner, women, commercial.', 'Sitting in a kitchen, a clean place to write, a television, quietness.', 'Isolating each thought, picking them apart from each other.', 'All the winners have medals.', 'What is this thing hanging from my neck?', 'At work, one is a distraction from the other.', 'Ideas, or pieces of pictures moving. ', 'An ornate bridge leads to an empty parking lot. ', 'How many days have I missed?', 'They\'re racing across the pool, racing each other.', 'Instincts or repeated thoughts, swimmers appear on the television.', 'A lap is there and back.', 'I approach the burned out automobile with caution.'];
var originalPoem7 = ['pictures, memory', 'a postal distribution center', 'the odds', '\"x\"', 'flys, ants ', 'a loose fitting t-shirt', '\"the pearly gates\"', 'F.B.I.', 'bacteria, a second thought', 'an orange cone, an orange jumpsuit', 'the sun', 'steel/wood/concrete', 'distance, mountains ', 'a great catch', 'the sea', 'electricity'];
var originalPoem8 = ['A classic is something that is always nice.', 'I don\'t remember: I don\'t remember being small.', 'If there is no theory it was \"nice to see you.\"', 'City: terrified of missing out.', 'A snake bashes its front tooth on a rock.', 'I shook my head yes, empty.', 'The sun rose early.', 'One writes to understand.', 'A garden insists on itself and pushes the dirt aside.', '\"My dear quiet love,\" she wrote.', 'It was a small moon but managed to guide us.', 'Summer lives alone.', 'We write poems like zippers.', 'I love you like a pig in a barnyard.', 'Towards an immense capital, a caustic depth.', 'Soap is clean by definition.'];
var originalPoem9 = ['The frog made a squishing sound in my hand the sky opened up like a head of lettuce. ', 'Like Stephen Hawking sorrow expanding like a rower\'s meticulous form. ', 'The machine in a trance its metal arm swings.', 'The sounds of a shovel and now the work man and now the work man.', 'I wake up at eight I shoot the machine gun. ', 'I electrocute the bumblebee. ', 'Like a magnet like concrete the man\'s eyes were rotten two holes like a plug. ', 'Like the meticulous design of a park a trash can.', 'Because of a peculiarity in spirit we might think about where we are.', 'I flick an insect off the bed.', 'Not like a bonnet pushed back a horde of neck and hands.', 'Like a true story a cow\'s eye.', 'I found my body pensive and motionless.', 'I found a hole in my sock I found a foot stool.', 'If I disappeared today tomorrow would you carry a picture of someone not here anymore?', 'Would you carry a Styrofoam cup to a trash can?'];
var originalPoem10 = ['Color is the first thing to go: I squint in the sun.', 'A caricature of yourself, a copy or faking imitation.', '\"Ice Cube is a caricature of himself.\"', 'In Japan it takes less than two weeks for a product to reach \"100% market saturation.\" ', 'My neck bends like a branch covered in snow.', 'A pair of pants that fits.', 'Imagine the in-seam running on forever, to China.', 'There\'s so much to say about appearance: old pink T-shirt.', 'My \"Kansas City Royals\" hat is \"Dirty As Hell.\" ', 'A sea shell.', 'Three is a pattern, a fourth is one more. ', 'In Japan In Japan In Japan In Japan.', 'I can only imagine with the help of a toy.', '())))())))))))((()((((()(((((()))))))))))))))()(((((((((())()', 'We sat by the water we talked about water, sailing.', 'We sat on the rocks we talked about law.'];
var originalPoem11 = ['What are the Pistons thinking? ', 'The Pistons have lost their identity.', 'Walt Whitman found god in a barley corn.', 'She loved the sea.', 'Electricity.', 'The interviewer laughed and asked him to talk some more.', '\"I can\'t find the enemy,\" he said.', '\"It means I don\'t play.\"', 'Q: May we eat fish? ', 'A: (no reply)', 'What does it mean?', 'Its heart, still beeping.', 'Why are you leaving?', '\"I reckon a feller needs a change of pace.\"', 'Even the snow plow gets cold.', 'We sat together.'];
var originalPoem12 = ['A man with blood on his head stumbles into the street.', 'Wind swept plaza at the corner of 34th and 7th. ', 'Sadness. ', 'I think I\'m beginning to know what this is. ', 'The corner of 42nd and 6th. ', '\"It\'s not hard to leave you just do it.\"', 'Unless you miss the bus, I chuckled to myself.', 'A windy day.', 'It doesn\'t matter how you do it.', 'I thought I.', 'A man drinks his Coke.', 'The shadow of One Penn Plaza.', 'Between us, a young couple escapes into each other. ', 'An old man wanders without bearing.', 'The pull of the moon. ', 'The pull of the tides on the shore. '];
var originalPoem13 = ['Why do A\'B\'C\'D\' appear in the same place at the same time? ', 'Why do A\' and B\' seem to be linked? ', 'Why C\' and D\'? ', 'Presence is an indicator of \"why this is so\" as much as any causal relationship we might apply.', 'For example A\', B\', C\', and D\' are linked in this example because I have linked them. ', 'They are in the same place at the same time but they are not alone. ', 'There are other things with them, such as the paper you are reading this on or where you\'re sitting,   ', 'To prove causality we ignore things.', 'We find what we are looking for by isolating what we are looking for from the things around it.   ', 'To the extreme, we can isolate a thing even from itself. ', 'What sentence has come before this one and what did you eat for breakfast? ', 'Does this have anything to do with how we read? ', 'When silence becomes part of discourse, physicality shifts from an idea to an actor. ', 'We inhabit the objects we read about. ', 'We find the relationships we are looking for. ', 'John Cage said that if something bores you for two minutes, listen to it for four. '];
var originalPoem14 = ['Halloween was canceled in Russia this year.', 'We didn\'t talk much about ourselves.', 'Dilapidated city block means Run Down.', 'A thing in two is against itself.', 'This isn\'t a geo-political statement.', 'We divide into pieces. ', 'Proudly associated with the beautiful world.', 'There is a will there is a will.', 'In Russia they wonder if the \"old guard\" has moved on.', 'We contain each other. ', 'Compare your notes.', 'One representation, two.', 'It\'s too cold to party (unless you\'re in Russia).', 'We nod over breakfast, hands over the sun.', 'Baby\'s neck or man hands?', 'One fallout loves the other.'];
var originalPoem15 = ['Was talking to nobody (wide eyes).', 'The bottom of lake tongue. ', 'I\'m sorry but you\'re in my seat. ', 'Bodies filled with cream and butter.', 'And then I draped my arm around her.', 'The city is a spider web of light. ', 'Let this plane rise.', 'Let these wings stay fastened.', '\"I can think of nothing less likely to fly.\" ', 'My body simultaneously aches and fills.', 'Is nothing fuel?', 'There is no one to ask.', 'We must keep doing this.', 'Weather: should we be worried? ', 'Exit and note loss clearly. ', 'Without permission we taxi.'];
var originalPoem16 = ['Bob.', 'Susan.', 'AbbyBen', 'and Tyler.', 'April. ', 'Lucy.', 'SterlingTuck ', 'and Andy.', 'Tom.', 'Alpha-Romeo.', 'Watercress.', 'Dirt bike.', 'Ted.', 'Adam.', 'Matt.', 'Cathy.'];

// Define the liguistic list poems for later inclusion in allPoemSets. These arrays will not be shuffled or overwritten by the program like the next duplicate set (below).
var linguisticList1 = ['"A stone mason uses the stone, yet he does not use it up."', '"Do not stay too long in the spirit world." ', '\"the pearly gates\"', '"My dear quiet love," she wrote.', '"Ice Cube is a caricature of himself."', 'My "Kansas City Royals" hat is "Dirty As Hell." ', 'In Japan it takes less than two weeks for a product to reach "100% market saturation." ', '"I can\'t find the enemy," he said.', '"It means I don\'t play."', '"I reckon a feller needs a change of pace."', '"It"s not hard to leave you just do it."', '"I can think of nothing less likely to fly." ', 'Pieces fit pressed against each other or magnets "work hard."', 'If there is no theory it was "nice to see you."', 'In Russia they wonder if the \"old guard\" has moved on.', 'Possession: "I never knew how exciting addiction could be."'];
var linguisticList2 = ['I presume the thing before the thing, ideas of the world ', 'I want to be a better person', 'I haven\'t seen her for years.', 'I approach the burned out automobile with caution.', 'I don\'t remember: I don\'t remember being small.', 'I shook my head yes, empty.', 'I love you like a pig in a barnyard.', 'I wake up at eight I shoot the machine gun. ', 'I electrocute the bumblebee. ', 'I found my body pensive and motionless.', 'I found a hole in my sock I found a foot stool.', 'I flick an insect off the bed.', 'I can only imagine with the help of a toy.', 'I thought I.', 'I think I\'m beginning to know what this is. ', 'I wonder what my statue would look like?'];
var linguisticList3 = ['Walt Whitman found god in a barley corn.', 'John Cage said that if something bores you for two minutes, listen to it for four. ', 'F.B.I.', 'Bob.', 'Susan.', 'AbbyBen', 'April. ', 'Lucy.', 'SterlingTuck ', 'Tom.', 'Ted.', 'Adam.', 'Matt.', 'Cathy.', 'Like Stephen Hawking sorrow expanding like a rower\'s meticulous form. ', 'Like Stephen Hawking said, sorrow expands.'];
var linguisticList4 = ['We know this because the night sky does not.', 'We inhabit the objects we read about. ', 'We find the relationships we are looking for. ', 'We find what we are looking for by isolating what we are looking for from the things around it.   ', 'We didn\'t talk much about ourselves.', 'We divide into pieces. ', 'We contain each other. ', 'We sat by the water we talked about water, sailing.', 'We sat on the rocks we talked about law.', 'We sat together.', 'We too have names. ', 'We nod over breakfast, hands over the sun.', 'We must keep doing this.', 'We write poems like zippers.', 'Our rent was due: the streets were full of snow. ', 'Our first job is to survive. '];
var linguisticList5 = ['for you.', 'said the little girl to her father. ', 'in the body of the world. ', 'the sun', 'the sea', 'flys, ants ', 'bacteria, a second thought', 'steel/wood/concrete', '\"x\"', 'and Andy.', 'and Tyler.', 'electricity', 'distance, mountains ', 'In Japan In Japan In Japan In Japan.', '())))())))))))((()((((()(((((()))))))))))))))()(((((((((())()', 'the odds'];
var linguisticList6 = ['The corner of 42nd and 6th. ', 'The shadow of One Penn Plaza.', 'The bottom of lake tongue. ', 'The universe has a beginning. ', 'The city is a spider web of light. ', 'The sun rose early.', 'The sounds of a shovel and now the work man and now the work man.', 'The best I can do is describe it.', 'The frog made a squishing sound in my hand the sky opened up like a head of lettuce. ', 'The machine in a trance its metal arm swings.', 'The interviewer laughed and asked him to talk some more.', 'The distance between them.', 'The priests begin to set up.', 'The pull of the moon. ', 'The pull of the tides on the shore. ', 'The terminally dense blue of night\'s approach.'];
var linguisticList7 = ['I\'m going through one of those cycles.', 'I\'ve never seen a dinosaur though I\'ve seen its skeleton.', 'I\'ve seen a six-toed cat.', 'I\'m sorry but you\'re in my seat. ', 'She held her hem at arms length and admired her shadow. ', 'He did the same.', 'He pretended to be a dragon.', 'Your real name is the Kohaku river, she screams. ', 'One writes to understand.', 'My neck bends like a branch covered in snow.', 'She loved the sea.', 'My body simultaneously aches and fills.', 'They are in the same place at the same time.', 'They\'re racing across the pool, racing each other.', 'It was a small moon but managed to guide us.', 'Its heart, still beeping.'];
var linguisticList8 = ['a postal distribution center', 'A wool sweater, independent.', 'A rower\'s meticulous form. ', 'A slow and clumsy ape falls from a tree.', 'A windy day.', 'An old rusty bike is pulled out of the mud. ', 'An ornate bridge leads to an empty parking lot. ', 'a loose fitting t-shirt', 'a great catch', 'an orange cone, an orange jumpsuit', 'An old man wanders without bearing', 'The thinning neck eventually pinches and the drop drips.', 'The night sky does not shine like the stars. ', 'The night sky is burning too. ', 'The old witch stole my name.', 'A sea shell.'];
var linguisticList9 = ['A self is made of words. Every moment seen is elsewhere, ', 'A self is elsewhere.', 'A pact was made between the settlers and the natives.', 'A joke, a dense work of metal. ', 'A trench leads to each house.', 'A rut gleaming in the snow.', 'A row of hens.', 'A lap is there and back.', 'A classic is something that is always nice.', 'A caricature of yourself, a copy or faking imitation.', 'A pair of pants that fits.', 'A poem comes into focus.', 'A man with blood on his head stumbles into the street.', 'A man drinks his Coke.', 'A thing in two is against itself.', 'A garden insists on itself and pushes the dirt aside.'];
var linguisticList10 = ['The shape of a life or the life itself?', 'Have you seen them race each other?', 'What is this thing hanging from my neck?', 'How many days have I missed?', 'If I disappeared today tomorrow would you carry a picture of someone not here anymore?', 'What are the Pistons thinking? ', 'What does it mean?', 'Why are you leaving?', 'Why do A\'B\'C\'D\' appear in the same place at the same time? ', 'Why do A\' and B\' seem to be linked? ', 'What sentence has come before this one and what did you eat for breakfast? ', 'Does this have anything to do with how we read? ', 'Baby\'s neck or man hands?', 'Is nothing fuel?', 'Would you carry a Styrofoam cup to a trash can?', 'Why C\' and D\'?'];
var linguisticList11 = ['Truth is found by subtracting what it could not be.', 'Light travels there & back. ', 'Dawn\'s red light on the horizon. ', 'Light waves filled with color. ', 'Habit precludes every word and its interpretation.  ', 'Purpose occurs concurrently with language.', 'Desire vomits on the floor.', 'Desire\'s desire.', 'Desire to eat. ', 'Circles and squares exist, seashells exist.', 'Presence is an indicator of \"why this is so\" as much as any causal relationship we might apply.', 'Ideas, or pieces of pictures moving. ', 'Instincts or repeated thoughts, swimmers appear on the television.', 'Before & after.', 'Color is the first thing to go: I squint in the sun.', 'Sadness.'];
var linguisticList12 = ['Geese fly south in the winter.', 'Grass grows where grass grows.', 'Bodies filled with cream and butter.', 'Snow piled on the curb, plows moved around.', 'Halloween was canceled in Russia this year.', 'Alpha-Romeo.', 'Watercress.', 'Dirt bike.', 'Electricity.', 'City: terrified of missing out.', 'Summer lives alone.', 'Soap is clean by definition.', 'Three is a pattern, a fourth is one more. ', 'Horses and people used to be smaller.', 'One fallout loves the other.', 'One representation, two.'];
var linguisticList13 = ['Counting the trains at the station. ', 'Moving quietly behind the alter.', 'Whistling for the winner, women, commercial.', 'Sitting in a kitchen, a clean place to write, a television, quietness.', 'Isolating each thought, picking them apart from each other.', 'Was talking to nobody (wide eyes).', 'Carry your body as you would a baby. ', 'Imagine the in-seam running on forever, to China.', 'Compare your notes.', 'Let this plane rise.', 'Let these wings stay fastened.', 'Exit and note loss clearly. ', 'Towards an immense capital, a caustic depth.', 'Making sure they were safe I said goodbye, cotton.', 'Walking over a sheet of ice, I take small steps.', 'To see what life was like I asked the man pushing his car. '];
var linguisticList14 = ['A bird calls from the back of a rhinoceros.', 'A snake bashes its front tooth on a rock.', 'A meteorite hits the earth: I\'ll give you something to cry about.', 'The Earth hurtles towards them.', 'The Pistons have lost their identity.', 'These kinds of ideas.   ', 'This isn\'t a geo-political statement.', 'There is a will there is a will.', 'There is no one to ask.', 'It doesn\' matter how you do it.', 'All the winners have medals.', 'Weather: should we be worried?', 'Bodies filled with cream and butter. ', 'pictures, memory', 'This world is divided because time projects from a single point.', 'And then I draped my arm around her.'];
var linguisticList15 = ['Dilapidated city block means Run Down', 'Two-hundred meters of free style, circular and simple.', 'Wind swept plaza at the corner of 34th and 7th. ', 'Another heaven altogether.', 'Deserted restaurant. ', 'Dirty streets in the old market place. ', 'Proudly associated with the beautiful world.', 'Some people are born with webbing between their toes.', 'There\'s so much to say about appearance: old pink T-shirt.', 'It came from the sky, mostly.', 'Without permission we taxi.', 'Earlier we managed to push his car out.', 'At work, one is a distraction from the other.', 'Even the snow plow gets cold.', 'To the extreme, we can isolate a thing even from itself. ', 'It\'s too cold to party (unless you\'re in Russia).'];
var linguisticList16 = ['Like a magnet like concrete the man\'s eyes were rotten two holes like a plug. ', 'When silence becomes part of discourse, physicality shifts from an idea to an actor. ', 'For example A\', B\', C\', and D\' are linked in this example because I have linked them.', 'Like the meticulous design of a park a trash can.', 'Like a true story a cow\'s eye.', 'Not like a bonnet pushed back a horde of neck and hands.', 'Between us, a young couple escapes into each other. ', 'Because of a peculiarity in spirit we might think about where we are.', 'In the bottom corner of the screen is a timer.', 'To prove causality we ignore things.', 'Q: May we eat fish? ', 'A: (no reply)', 'There are other things with them, such as the paper you are reading this on or where you\'re sitting, ', 'When I say small I mean the size of a television. ', 'Unless you miss the bus, I chuckled to myself.', 'And before that? '];

function makePoemSet(setNumber) {
  // Make the stanza patterns then make the shuffled poems set from the linguistic lists.
  makeStanzaPatternSlotArrays(); // Create the four shuffled arrays of 1-16.
  checkForDuplicateArrayIndices(); // Initial check for duplicates, extremely likely to have duplicates.

  // This loop will continue creating new stanza pattern slot arrays until there are no duplicate indices.
  while (duplicateIndices != 0) {
    duplicateIndices = 0;
    makeStanzaPatternSlotArrays();
    checkForDuplicateArrayIndices();
  }

  // Translate the 4 pattern slots arrays into the 16 patterns for the third set of poems (the first shuffled set).
  makeStanzaPatterns();

  if (setNumber == 3) {

    // Define the 16 Linguistic Lists source poem arrays
    var linguisticListSource1 = ['"A stone mason uses the stone, yet he does not use it up."', '"Do not stay too long in the spirit world." ', '\"the pearly gates\"', '"My dear quiet love," she wrote.', '"Ice Cube is a caricature of himself."', 'My "Kansas City Royals" hat is "Dirty As Hell." ', 'In Japan it takes less than two weeks for a product to reach "100% market saturation." ', '"I can\'t find the enemy," he said.', '"It means I don\'t play."', '"I reckon a feller needs a change of pace."', '"It"s not hard to leave you just do it."', '"I can think of nothing less likely to fly." ', 'Pieces fit pressed against each other or magnets "work hard."', 'If there is no theory it was "nice to see you."', 'In Russia they wonder if the \"old guard\" has moved on.', 'Possession: "I never knew how exciting addiction could be."'];
    var linguisticListSource2 = ['I presume the thing before the thing, ideas of the world ', 'I want to be a better person', 'I haven\'t seen her for years.', 'I approach the burned out automobile with caution.', 'I don\'t remember: I don\'t remember being small.', 'I shook my head yes, empty.', 'I love you like a pig in a barnyard.', 'I wake up at eight I shoot the machine gun. ', 'I electrocute the bumblebee. ', 'I found my body pensive and motionless.', 'I found a hole in my sock I found a foot stool.', 'I flick an insect off the bed.', 'I can only imagine with the help of a toy.', 'I thought I.', 'I think I\'m beginning to know what this is. ', 'I wonder what my statue would look like?'];
    var linguisticListSource3 = ['Walt Whitman found god in a barley corn.', 'John Cage said that if something bores you for two minutes, listen to it for four. ', 'F.B.I.', 'Bob.', 'Susan.', 'AbbyBen', 'April. ', 'Lucy.', 'SterlingTuck ', 'Tom.', 'Ted.', 'Adam.', 'Matt.', 'Cathy.', 'Like Stephen Hawking sorrow expanding like a rower\'s meticulous form. ', 'Like Stephen Hawking said, sorrow expands.'];
    var linguisticListSource4 = ['We know this because the night sky does not.', 'We inhabit the objects we read about. ', 'We find the relationships we are looking for. ', 'We find what we are looking for by isolating what we are looking for from the things around it.   ', 'We didn\'t talk much about ourselves.', 'We divide into pieces. ', 'We contain each other. ', 'We sat by the water we talked about water, sailing.', 'We sat on the rocks we talked about law.', 'We sat together.', 'We too have names. ', 'We nod over breakfast, hands over the sun.', 'We must keep doing this.', 'We write poems like zippers.', 'Our rent was due: the streets were full of snow. ', 'Our first job is to survive. '];
    var linguisticListSource5 = ['for you.', 'said the little girl to her father. ', 'in the body of the world. ', 'the sun', 'the sea', 'flys, ants ', 'bacteria, a second thought', 'steel/wood/concrete', '\"x\"', 'and Andy.', 'and Tyler.', 'electricity', 'distance, mountains ', 'In Japan In Japan In Japan In Japan.', '())))())))))))((()((((()(((((()))))))))))))))()(((((((((())()', 'the odds'];
    var linguisticListSource6 = ['The corner of 42nd and 6th. ', 'The shadow of One Penn Plaza.', 'The bottom of lake tongue. ', 'The universe has a beginning. ', 'The city is a spider web of light. ', 'The sun rose early.', 'The sounds of a shovel and now the work man and now the work man.', 'The best I can do is describe it.', 'The frog made a squishing sound in my hand the sky opened up like a head of lettuce. ', 'The machine in a trance its metal arm swings.', 'The interviewer laughed and asked him to talk some more.', 'The distance between them.', 'The priests begin to set up.', 'The pull of the moon. ', 'The pull of the tides on the shore. ', 'The terminally dense blue of night\'s approach.'];
    var linguisticListSource7 = ['I\'m going through one of those cycles.', 'I\'ve never seen a dinosaur though I\'ve seen its skeleton.', 'I\'ve seen a six-toed cat.', 'I\'m sorry but you\'re in my seat. ', 'She held her hem at arms length and admired her shadow. ', 'He did the same.', 'He pretended to be a dragon.', 'Your real name is the Kohaku river, she screams. ', 'One writes to understand.', 'My neck bends like a branch covered in snow.', 'She loved the sea.', 'My body simultaneously aches and fills.', 'They are in the same place at the same time.', 'They\'re racing across the pool, racing each other.', 'It was a small moon but managed to guide us.', 'Its heart, still beeping.'];
    var linguisticListSource8 = ['a postal distribution center', 'A wool sweater, independent.', 'A rower\'s meticulous form. ', 'A slow and clumsy ape falls from a tree.', 'A windy day.', 'An old rusty bike is pulled out of the mud. ', 'An ornate bridge leads to an empty parking lot. ', 'a loose fitting t-shirt', 'a great catch', 'an orange cone, an orange jumpsuit', 'An old man wanders without bearing', 'The thinning neck eventually pinches and the drop drips.', 'The night sky does not shine like the stars. ', 'The night sky is burning too. ', 'The old witch stole my name.', 'A sea shell.'];
    var linguisticListSource9 = ['A self is made of words. Every moment seen is elsewhere, ', 'A self is elsewhere.', 'A pact was made between the settlers and the natives.', 'A joke, a dense work of metal. ', 'A trench leads to each house.', 'A rut gleaming in the snow.', 'A row of hens.', 'A lap is there and back.', 'A classic is something that is always nice.', 'A caricature of yourself, a copy or faking imitation.', 'A pair of pants that fits.', 'A poem comes into focus.', 'A man with blood on his head stumbles into the street.', 'A man drinks his Coke.', 'A thing in two is against itself.', 'A garden insists on itself and pushes the dirt aside.'];
    var linguisticListSource10 = ['The shape of a life or the life itself?', 'Have you seen them race each other?', 'What is this thing hanging from my neck?', 'How many days have I missed?', 'If I disappeared today tomorrow would you carry a picture of someone not here anymore?', 'What are the Pistons thinking? ', 'What does it mean?', 'Why are you leaving?', 'Why do A\'B\'C\'D\' appear in the same place at the same time? ', 'Why do A\' and B\' seem to be linked? ', 'What sentence has come before this one and what did you eat for breakfast? ', 'Does this have anything to do with how we read? ', 'Baby\'s neck or man hands?', 'Is nothing fuel?', 'Would you carry a Styrofoam cup to a trash can?', 'Why C\' and D\'?'];
    var linguisticListSource11 = ['Truth is found by subtracting what it could not be.', 'Light travels there & back. ', 'Dawn\'s red light on the horizon. ', 'Light waves filled with color. ', 'Habit precludes every word and its interpretation.  ', 'Purpose occurs concurrently with language.', 'Desire vomits on the floor.', 'Desire\'s desire.', 'Desire to eat. ', 'Circles and squares exist, seashells exist.', 'Presence is an indicator of \"why this is so\" as much as any causal relationship we might apply.', 'Ideas, or pieces of pictures moving. ', 'Instincts or repeated thoughts, swimmers appear on the television.', 'Before & after.', 'Color is the first thing to go: I squint in the sun.', 'Sadness.'];
    var linguisticListSource12 = ['Geese fly south in the winter.', 'Grass grows where grass grows.', 'Bodies filled with cream and butter.', 'Snow piled on the curb, plows moved around.', 'Halloween was canceled in Russia this year.', 'Alpha-Romeo.', 'Watercress.', 'Dirt bike.', 'Electricity.', 'City: terrified of missing out.', 'Summer lives alone.', 'Soap is clean by definition.', 'Three is a pattern, a fourth is one more. ', 'Horses and people used to be smaller.', 'One fallout loves the other.', 'One representation, two.'];
    var linguisticListSource13 = ['Counting the trains at the station. ', 'Moving quietly behind the alter.', 'Whistling for the winner, women, commercial.', 'Sitting in a kitchen, a clean place to write, a television, quietness.', 'Isolating each thought, picking them apart from each other.', 'Was talking to nobody (wide eyes).', 'Carry your body as you would a baby. ', 'Imagine the in-seam running on forever, to China.', 'Compare your notes.', 'Let this plane rise.', 'Let these wings stay fastened.', 'Exit and note loss clearly. ', 'Towards an immense capital, a caustic depth.', 'Making sure they were safe I said goodbye, cotton.', 'Walking over a sheet of ice, I take small steps.', 'To see what life was like I asked the man pushing his car. '];
    var linguisticListSource14 = ['A bird calls from the back of a rhinoceros.', 'A snake bashes its front tooth on a rock.', 'A meteorite hits the earth: I\'ll give you something to cry about.', 'The Earth hurtles towards them.', 'The Pistons have lost their identity.', 'These kinds of ideas.   ', 'This isn\'t a geo-political statement.', 'There is a will there is a will.', 'There is no one to ask.', 'It doesn\' matter how you do it.', 'All the winners have medals.', 'Weather: should we be worried?', 'Bodies filled with cream and butter. ', 'pictures, memory', 'This world is divided because time projects from a single point.', 'And then I draped my arm around her.'];
    var linguisticListSource15 = ['Dilapidated city block means Run Down', 'Two-hundred meters of free style, circular and simple.', 'Wind swept plaza at the corner of 34th and 7th. ', 'Another heaven altogether.', 'Deserted restaurant. ', 'Dirty streets in the old market place. ', 'Proudly associated with the beautiful world.', 'Some people are born with webbing between their toes.', 'There\'s so much to say about appearance: old pink T-shirt.', 'It came from the sky, mostly.', 'Without permission we taxi.', 'Earlier we managed to push his car out.', 'At work, one is a distraction from the other.', 'Even the snow plow gets cold.', 'To the extreme, we can isolate a thing even from itself. ', 'It\'s too cold to party (unless you\'re in Russia).'];
    var linguisticListSource16 = ['Like a magnet like concrete the man\'s eyes were rotten two holes like a plug. ', 'When silence becomes part of discourse, physicality shifts from an idea to an actor. ', 'For example A\', B\', C\', and D\' are linked in this example because I have linked them.', 'Like the meticulous design of a park a trash can.', 'Like a true story a cow\'s eye.', 'Not like a bonnet pushed back a horde of neck and hands.', 'Between us, a young couple escapes into each other. ', 'Because of a peculiarity in spirit we might think about where we are.', 'In the bottom corner of the screen is a timer.', 'To prove causality we ignore things.', 'Q: May we eat fish? ', 'A: (no reply)', 'There are other things with them, such as the paper you are reading this on or where you\'re sitting, ', 'When I say small I mean the size of a television. ', 'Unless you miss the bus, I chuckled to myself.', 'And before that? '];

    // Create new ArrayList for all sixteen poem source lists
    var linguisticListsSources = [];
  
    // Populate the new Arraylist with the linguistic lists
    linguisticListsSources.push(linguisticListSource1);
    linguisticListsSources.push(linguisticListSource2);
    linguisticListsSources.push(linguisticListSource3);
    linguisticListsSources.push(linguisticListSource4);
    linguisticListsSources.push(linguisticListSource5);
    linguisticListsSources.push(linguisticListSource6);
    linguisticListsSources.push(linguisticListSource7);
    linguisticListsSources.push(linguisticListSource8);
    linguisticListsSources.push(linguisticListSource9);
    linguisticListsSources.push(linguisticListSource10);
    linguisticListsSources.push(linguisticListSource11);
    linguisticListsSources.push(linguisticListSource12);
    linguisticListsSources.push(linguisticListSource13);
    linguisticListsSources.push(linguisticListSource14);
    linguisticListsSources.push(linguisticListSource15);
    linguisticListsSources.push(linguisticListSource16);

    // Run this 16 times (top level, creates each poem)
    for (i=0; i < numberOfPoems; i++) {
      // Create new array to hold 4 stanzas of 4 patterned lines (same stanza pattern for all stanzas in 16-line poem).
      var thisStanzaPattern = stanzaPatterns[i]; // Get the stanza pattern for each poem
      var thisShuffledLinguisticPoem = [];
      // Next two loops will sort through all 16 poemSourceLists entries to pull
      // lines, based on the stanza patterns generated earlier, from the corresponding
      // source arrays (either the original poems or linguistic lists). Note that the values
      // from the stanza patterns indicate which source file a new line should be drawn from.
      // After a line is used, it is then altered to ensure there are no duplicates.
      
      // This loop (second level) runs four times to assemble the four stanzas of each poem
      for (j=0; j < numberOfStanzas; j++) {
        // This loop runs four times to assemble the four lines of each stanza
        for (k=0; k < linesPerStanza; k++) {
          // Locate the correct stanza pattern value for each line
          var aLinePatternValue = thisStanzaPattern[k];
          // Grab the right array from the linguisticListsSources 2D array and assign it to aPoemSource
          var aPoemSource = linguisticListsSources[aLinePatternValue];
          // Now grab a random line from the source file indicated by the stanza pattern
          var lineValueToUse = (int(random(aPoemSource.length)));
          var lineBeingUsed = aPoemSource[lineValueToUse];
          // Add each unique line to the allPatternedPoemLines array
          thisShuffledLinguisticPoem.push(lineBeingUsed);
          // Now remove the String in aPoemSource at index lineValueToUse so it will not be used again
          aPoemSource.splice(lineValueToUse, 1);
          // Now replace the original poemsSourceLists array (which has just been used as aPoemSource)
          // in the ArrayList with the ammended aPoemSource, then send the lineValueToUse to an array
          // so I can cast the hexagrams later.
          // This needs to replace the entire array at index value aLinePatternValue in the 2D array linguisticListsSources
          // with the aPoemSource array.
          linguisticListsSources.splice(aLinePatternValue, 1, aPoemSource);
          // Now store the line value of the randomly chosen line from this poem for later use in hexagram and title generation
          lineValuesForHexGenLinguistic.push(lineValueToUse);
        }
      }
      //Push each 16-index poem array as an indes to linguisticPoemsShuffled, which will contain sixteen arrays, one for each shuffled poem.
      linguisticPoemsShuffled.push(thisShuffledLinguisticPoem);
    }
  } else if (setNumber == 4) {
    
    // Note: See comments in if statement above for comments on this section. The only differences
    // between this else if statement and it are (1) the setNumber is 4 now, and (2) the function
    // now uses the original poems as sources and outputs data that will be used to generate hexagrams
    // for the shuffled original poems later.
    
    // Define the 16 Original Poems source poem arrays
    var originalPoemSource1 = ['The universe has a beginning. ', 'And before that? ', 'Truth is found by subtracting what it could not be.', 'Another heaven altogether.', 'The distance between them.', 'Before & after.', 'This world is divided because time projects from a single point.', 'Light travels there & back.  ', 'The terminally dense blue of night\'s approach.', 'Dawn\'s red light on the horizon. ', 'Like Stephen Hawking said, sorrow expands.', 'A rower\'s meticulous form. ', 'The night sky does not shine like the stars. ', 'The night sky is burning too. ', 'We know this because the night sky does not.', 'Light waves filled with color. '];
    var originalPoemSource2 = ['A self is made of words. Every moment seen is elsewhere, ', 'The best I can do is describe it.', 'A self is elsewhere.', 'Counting the trains at the station. ', 'Habit precludes every word and its interpretation.  ', 'I presume the thing before the thing, ideas of the world ', 'in the body of the world. ', '\"A stone mason uses the stone, yet he does not use it up.\"', 'A poem comes into focus.', 'Purpose occurs concurrently with language.', 'I want to be a better person', 'for you.', 'I wonder what my statue would look like?', 'said the little girl to her father. ', 'She held her hem at arms length and admired her shadow. ', 'He did the same.'];
    var originalPoemSource3 = ['Deserted restaurant. ', 'Desire to eat. ', 'Our first job is to survive. ', 'He pretended to be a dragon.', 'Desire vomits on the floor.', 'Desire\'s desire.', 'Dirty streets in the old market place. ', 'The old witch stole my name.', 'The priests begin to set up. ', '\"Do not stay too long in the spirit world.\" ', 'Your real name is the Kohaku river, she screams. ', 'The Earth hurtles towards them.', 'An old rusty bike is pulled out of the mud. ', 'A row of hens.', 'Moving quietly behind the alter.', 'We too have names. '];
    var originalPoemSource4 = ['I\'ve never seen a dinosaur though I\'ve seen its skeleton.', 'Horses and people used to be smaller.', 'The shape of a life or the life itself?', 'A meteorite hits the earth: I\'ll give you something to cry about.', 'I\'ve seen a six-toed cat.', 'Circles and squares exist, seashells exist.', 'Some people are born with webbing between their toes.', 'A slow and clumsy ape falls from a tree.', 'I haven\'t seen her for years.', 'Geese fly south in the winter.', 'The thinning neck eventually pinches and the drop drips.', 'A bird calls from the back of a rhinoceros.', 'I\'m going through one of those cycles.', 'Grass grows where grass grows.', 'When I say small I mean the size of a television. ', 'A pact was made between the settlers and the natives.'];
    var originalPoemSource5 = ['It came from the sky, mostly.', 'To see what life was like I asked the man pushing his car. ', 'Pieces fit pressed against each other or magnets \"work hard.\"', 'A joke, a dense work of metal. ', 'Bodies filled with cream and butter.', 'Snow piled on the curb, plows moved around.', 'Making sure they were safe I said goodbye, cotton.', 'A wool sweater, independent.', 'Carry your body as you would a baby. ', 'Possession. \"I never knew how exciting addiction could be.\"', 'Walking over a sheet of ice, I take small steps.', 'A trench leads to each house.', 'Our rent was due: the streets were full of snow. ', 'These kinds of ideas. ', 'Earlier we managed to push his car out.', 'A rut gleaming in the snow.'];
    var originalPoemSource6 = ['In the bottom corner of the screen is a timer.', 'Have you seen them race each other?', 'Two-hundred meters of free style, circular and simple.', 'Whistling for the winner, women, commercial.', 'Sitting in a kitchen, a clean place to write, a television, quietness.', 'Isolating each thought, picking them apart from each other.', 'All the winners have medals.', 'What is this thing hanging from my neck?', 'At work, one is a distraction from the other.', 'Ideas, or pieces of pictures moving. ', 'An ornate bridge leads to an empty parking lot. ', 'How many days have I missed?', 'They\'re racing across the pool, racing each other.', 'Instincts or repeated thoughts, swimmers appear on the television.', 'A lap is there and back.', 'I approach the burned out automobile with caution.'];
    var originalPoemSource7 = ['pictures, memory', 'a postal distribution center', 'the odds', '\"x\"', 'flys, ants ', 'a loose fitting t-shirt', '\"the pearly gates\"', 'F.B.I.', 'bacteria, a second thought', 'an orange cone, an orange jumpsuit', 'the sun', 'steel/wood/concrete', 'distance, mountains ', 'a great catch', 'the sea', 'electricity'];
    var originalPoemSource8 = ['A classic is something that is always nice.', 'I don\'t remember: I don\'t remember being small.', 'If there is no theory it was \"nice to see you.\"', 'City: terrified of missing out.', 'A snake bashes its front tooth on a rock.', 'I shook my head yes, empty.', 'The sun rose early.', 'One writes to understand.', 'A garden insists on itself and pushes the dirt aside.', '\"My dear quiet love,\" she wrote.', 'It was a small moon but managed to guide us.', 'Summer lives alone.', 'We write poems like zippers.', 'I love you like a pig in a barnyard.', 'Towards an immense capital, a caustic depth.', 'Soap is clean by definition.'];
    var originalPoemSource9 = ['The frog made a squishing sound in my hand the sky opened up like a head of lettuce. ', 'Like Stephen Hawking sorrow expanding like a rower\'s meticulous form. ', 'The machine in a trance its metal arm swings.', 'The sounds of a shovel and now the work man and now the work man.', 'I wake up at eight I shoot the machine gun. ', 'I electrocute the bumblebee. ', 'Like a magnet like concrete the man\'s eyes were rotten two holes like a plug. ', 'Like the meticulous design of a park a trash can.', 'Because of a peculiarity in spirit we might think about where we are.', 'I flick an insect off the bed.', 'Not like a bonnet pushed back a horde of neck and hands.', 'Like a true story a cow\'s eye.', 'I found my body pensive and motionless.', 'I found a hole in my sock I found a foot stool.', 'If I disappeared today tomorrow would you carry a picture of someone not here anymore?', 'Would you carry a Styrofoam cup to a trash can?'];
    var originalPoemSource10 = ['Color is the first thing to go: I squint in the sun.', 'A caricature of yourself, a copy or faking imitation.', '\"Ice Cube is a caricature of himself.\"', 'In Japan it takes less than two weeks for a product to reach \"100% market saturation.\" ', 'My neck bends like a branch covered in snow.', 'A pair of pants that fits.', 'Imagine the in-seam running on forever, to China.', 'There\'s so much to say about appearance: old pink T-shirt.', 'My \"Kansas City Royals\" hat is \"Dirty As Hell.\" ', 'A sea shell.', 'Three is a pattern, a fourth is one more. ', 'In Japan In Japan In Japan In Japan.', 'I can only imagine with the help of a toy.', '())))())))))))((()((((()(((((()))))))))))))))()(((((((((())()', 'We sat by the water we talked about water, sailing.', 'We sat on the rocks we talked about law.'];
    var originalPoemSource11 = ['What are the Pistons thinking? ', 'The Pistons have lost their identity.', 'Walt Whitman found god in a barley corn.', 'She loved the sea.', 'Electricity.', 'The interviewer laughed and asked him to talk some more.', '\"I can\'t find the enemy,\" he said.', '\"It means I don\'t play.\"', 'Q: May we eat fish? ', 'A: (no reply)', 'What does it mean?', 'Its heart, still beeping.', 'Why are you leaving?', '\"I reckon a feller needs a change of pace.\"', 'Even the snow plow gets cold.', 'We sat together.'];
    var originalPoemSource12 = ['A man with blood on his head stumbles into the street.', 'Wind swept plaza at the corner of 34th and 7th. ', 'Sadness. ', 'I think I\'m beginning to know what this is. ', 'The corner of 42nd and 6th. ', '\"It\'s not hard to leave you just do it.\"', 'Unless you miss the bus, I chuckled to myself.', 'A windy day.', 'It doesn\'t matter how you do it.', 'I thought I.', 'A man drinks his Coke.', 'The shadow of One Penn Plaza.', 'Between us, a young couple escapes into each other. ', 'An old man wanders without bearing.', 'The pull of the moon. ', 'The pull of the tides on the shore. '];
    var originalPoemSource13 = ['Why do A\'B\'C\'D\' appear in the same place at the same time? ', 'Why do A\' and B\' seem to be linked? ', 'Why C\' and D\'? ', 'Presence is an indicator of \"why this is so\" as much as any causal relationship we might apply.', 'For example A\', B\', C\', and D\' are linked in this example because I have linked them. ', 'They are in the same place at the same time but they are not alone. ', 'There are other things with them, such as the paper you are reading this on or where you\'re sitting,   ', 'To prove causality we ignore things.', 'We find what we are looking for by isolating what we are looking for from the things around it.   ', 'To the extreme, we can isolate a thing even from itself. ', 'What sentence has come before this one and what did you eat for breakfast? ', 'Does this have anything to do with how we read? ', 'When silence becomes part of discourse, physicality shifts from an idea to an actor. ', 'We inhabit the objects we read about. ', 'We find the relationships we are looking for. ', 'John Cage said that if something bores you for two minutes, listen to it for four. '];
    var originalPoemSource14 = ['Halloween was canceled in Russia this year.', 'We didn\'t talk much about ourselves.', 'Dilapidated city block means Run Down.', 'A thing in two is against itself.', 'This isn\'t a geo-political statement.', 'We divide into pieces. ', 'Proudly associated with the beautiful world.', 'There is a will there is a will.', 'In Russia they wonder if the \"old guard\" has moved on.', 'We contain each other. ', 'Compare your notes.', 'One representation, two.', 'It\'s too cold to party (unless you\'re in Russia).', 'We nod over breakfast, hands over the sun.', 'Baby\'s neck or man hands?', 'One fallout loves the other.'];
    var originalPoemSource15 = ['Was talking to nobody (wide eyes).', 'The bottom of lake tongue. ', 'I\'m sorry but you\'re in my seat. ', 'Bodies filled with cream and butter.', 'And then I draped my arm around her.', 'The city is a spider web of light. ', 'Let this plane rise.', 'Let these wings stay fastened.', '\"I can think of nothing less likely to fly.\" ', 'My body simultaneously aches and fills.', 'Is nothing fuel?', 'There is no one to ask.', 'We must keep doing this.', 'Weather: should we be worried? ', 'Exit and note loss clearly. ', 'Without permission we taxi.'];
    var originalPoemSource16 = ['Bob.', 'Susan.', 'AbbyBen', 'and Tyler.', 'April. ', 'Lucy.', 'SterlingTuck ', 'and Andy.', 'Tom.', 'Alpha-Romeo.', 'Watercress.', 'Dirt bike.', 'Ted.', 'Adam.', 'Matt.', 'Cathy.'];
    
    var originalPoemSources = [];

    // Populate the new Arraylist with the linguistic lists
    originalPoemSources.push(originalPoemSource1);
    originalPoemSources.push(originalPoemSource2);
    originalPoemSources.push(originalPoemSource3);
    originalPoemSources.push(originalPoemSource4);
    originalPoemSources.push(originalPoemSource5);
    originalPoemSources.push(originalPoemSource6);
    originalPoemSources.push(originalPoemSource7);
    originalPoemSources.push(originalPoemSource8);
    originalPoemSources.push(originalPoemSource9);
    originalPoemSources.push(originalPoemSource10);
    originalPoemSources.push(originalPoemSource11);
    originalPoemSources.push(originalPoemSource12);
    originalPoemSources.push(originalPoemSource13);
    originalPoemSources.push(originalPoemSource14);
    originalPoemSources.push(originalPoemSource15);
    originalPoemSources.push(originalPoemSource16);

    for (i=0; i < numberOfPoems; i++) {
      var thisStanzaPattern = stanzaPatterns[i];
      var thisShuffledOriginalPoem = [];
      for (j=0; j < numberOfStanzas; j++) {
        for (k=0; k < linesPerStanza; k++) {
          var aLinePatternValue = thisStanzaPattern[k];
          var aPoemSource = originalPoemSources[aLinePatternValue];
          var lineValueToUse = (int(random(aPoemSource.length)));
          var lineBeingUsed = aPoemSource[lineValueToUse];
          thisShuffledOriginalPoem.push(lineBeingUsed);
          aPoemSource.splice(lineValueToUse, 1);
          originalPoemSources.splice(aLinePatternValue, 1, aPoemSource);
          lineValuesForHexGenOriginal.push(lineValueToUse);
        }
      }
      originalPoemsShuffled.push(thisShuffledOriginalPoem);
    }
  }
}

//                                       HEXAGRAMS                                          
/*  Hexagram generation

These functions will query random line values of each poem for whether they are even or odd, then add those results
to generate one of the four possible lines (see chart below), much like the standard coin tossing casting method.
If the line value is even, 3 will be added to the count; if odd, then 2 will be added.

6 = --- X ---  (divided changing)
7 = ---------  (solid)
8 = ---   ---  (divided)
9 = ----O----  (solid changing)

*/

// Initialize variables
var LowerYPosOffset = 90;
var castingSum;
var lineNumber;
var oneCastingValue;
var aLineValue = 0;
var generatedHexArray = [];
var aHexagramTag = '';
var poemTitlesFromHexagrams = [];

// Create counter for the hexagram casting loop to see how many times it runs before generating all 64 hexagrams.
var hexGenCounter = 0;

function castHexagrams(poemNum) {
  // Who is to blame for the meanings I make?
  
  // Note: For the first two sets, I don't need to get lineValuesForHexGen_____.
  // I can just use (the array index value + 1) for an array of each poem / linguistic list.
  // For the second two sets, get values from lineValuesForHexGen_____.
  // Populate lineValuesForHexGenUnshuffledSets with 256 elements, 1-16 repeated 16 times
  for (i=0; i<16; i++) {
    for (j=0; j<16; j++) {
      lineValuesForHexGenUnshuffledSets.push(j); // FLAG - MAKE SURE I USED APPEND RIGHT (THAT THE ORDER IS CORRECT)
    }
  }

  // This array will ensure that each set uses the correct lineValuesForHexGen_____ values.
  var thisSetForHexGen = [];

  // Initialize the setNumber for the first set.
  var setNumber = 1;
  // Loop until hexagrams for all sets have been cast.
  while (setNumber != 5) {
    if (setNumber == 1) {
      // Make the hexagrams for set one, the original poems.
      thisSetForHexGen = lineValuesForHexGenUnshuffledSets;
    } else if (setNumber == 2) {
      // Make the hexagrams for set two, the linguistic lists. // NOTE - This will become the set of illustrations
      thisSetForHexGen = lineValuesForHexGenUnshuffledSets;
    } else if (setNumber == 3) {
      // Make the hexagrams for set three, the shuffled linguistic poems.
      thisSetForHexGen = lineValuesForHexGenLinguistic;
    } else if (setNumber == 4) {
      // Make the hexagrams for set four, the shuffled original poems.
      thisSetForHexGen = lineValuesForHexGenOriginal;
    }
    // Create an ArrayList from thisSetForHexGen
    var poemsLineValues = [];
    for (i=0; i<16; i++) {
      var aPoemsLineValues = [];
      for (j=0; j<16; j++) {
        var aPoemLineValue = thisSetForHexGen[j+(i*16)];
        aPoemsLineValues[j] = aPoemLineValue;
      }
      poemsLineValues.push(aPoemsLineValues); // FLAG - MAKE SURE I USED APPEND RIGHT (THAT THE ORDER IS CORRECT)
    }
    // Check random lines from each poem (each set of 16 values from poemLineValuesForHexagramGenArray)
    // to get castingSum for each line to be drawn.
    for (i=0; i<16; i++) {
      // Clear the background each time through for drawHexLine()
      background(255);
      // Get correct set of 16 values from poemLineValues.
      var thisPoemsLineValues = [];
      thisPoemsLineValues = poemsLineValues[i];      
      // Draw each hexagram and export PNG to /poem/hexagrams directory, numbered the same as
      // the corresponding poem number across all four sets (i.e. 1-64).
      for (j=0; j<6; j++) {
        castingSum = 0;   
        for (k=0; k<3; k++) {
          if (k == 0) {
            // Make the link between the poem casting results and the hexagram casting results
            // stronger for first toss. I will use one of the first two line values. 
            var randNum2 =  (int(random(2)));
            var aLineValue = thisPoemsLineValues[randNum2];
            if ((isEven(aLineValue) == true)) oneCastingValue = 3;
            else if ((isEven(aLineValue) == false)) oneCastingValue = 2;
          } else if (k == 1) {
            // Introduce a 'wild card' element this time with a random line value from the poem
            var randNum16 = (int(random(16)));
            var aLineValue = thisPoemsLineValues[randNum16];
            if ((isEven(aLineValue) == true)) oneCastingValue = 3;
            else if ((isEven(aLineValue) == false)) oneCastingValue = 2;
          } else if (k == 2) {
            // I have programmed the third coin toss to function as the modified coin in the "modified coin toss" casting method.
            // if the castingSum does not equal 4 (meaning both first tosses were tails), do another normal toss the normal code above
            if (castingSum !== 4) {
              var randNum16 = (int(random(16)));
              var aLineValue = thisPoemsLineValues[randNum16];
              if ((isEven(aLineValue) == true)) oneCastingValue = 3;
              else if ((isEven(aLineValue) == false)) oneCastingValue = 2;
            } else {                                                // else, the first two tosses were tails, and I will reflip the third coin if it is either heads or tails
              var randNum16 = (int(random(16)));
              var aLineValue = thisPoemsLineValues[randNum16];
              if ((isEven(aLineValue) == true)) {   // Coin was heads (even), so reflip
                var randNum16 = (int(random(16)));
                var aLineValue = thisPoemsLineValues[randNum16];
                if ((isEven(aLineValue) == true)) oneCastingValue = 3;  // If toss is still even, or "heads," then add 3 as usual (to make 7 in all)
                else if ((isEven(aLineValue) == false)) oneCastingValue = 5;  // If toss this time is odd, or "tails," then add 4 so the final result is a 9
              } else if ((isEven(aLineValue) == false)) {  //  Coin was tails (odd), so reflip
                var randNum16 = (int(random(16)));
                var aLineValue = thisPoemsLineValues[randNum16];
                if ((isEven(aLineValue) == true)) oneCastingValue = 4;  // If toss this time is even, then add 4 so the final result is 8
                else if ((isEven(aLineValue) == false)) oneCastingValue = 2;  // If toss is still odd, then add 2 as usual (to make 6 in all)
              }
            }
          }
          castingSum += oneCastingValue;
        }
        // Use tagHexagramLines funtion to create hexagram tags
        tagHexagram(castingSum, j); // Get the hexagram tag for each line
        aHexagramTag += aHexagramTagItem; // Add each character to the tag (creating a 6 character tag by the end of this loop)
      }

      // Increment hexGenCounter each time a hexagram is cast and tagged
      hexGenCounter += 1;
   
      // Check to see if hexagram has already been cast. Recast if it is already in hexagramTags.
      if ($.inArray(aHexagramTag, hexagramTags) > -1) {
        i -= 1;
      } else {
        // Add this hexagram tag to the list of generated hexagram tags
        hexagramTags.push(aHexagramTag);  
        // Display the number of iterations required to generate each hexagram (for debugging)
        hexGenCounter = 0;
      }
       
      // Clear aHexagramTag for the next generation
      aHexagramTag = '';
    }
    // Increment setNumber by 1 so the while loop moves to the next set of 16 poems
    setNumber += 1;
  }
}

// A simple function to check if an integer is even or odd. Used by castHexagrams().
var anumber;
function isEven (aNumber) {
  if ((aNumber & 1) ==0) return true;
  else return false;
}

// The tagHexagram function is used by castHexagrams() to generate unique 6-character 'tags' to each hexagram.
// The function will take as input the castingSum for each line and return the translated tag character.

// The hexagram tags are composed of ascending values from the bottom line (first) to the top (last).
// Broken lines will be represent by a letter a-f, and solid lines an integer 1-6.

// Initialize arrays for hexagram tags.
var solidLines = [1,2,3,4,5,6];
var brokenLines = ['a','b','c','d','e','f'];
var hexagramTags = [];
var aHexagramTagItem;

function tagHexagram(castingSum, lineNumber) {
  // If the line is divided/broken, place a letter in the hexagram tag.
  if (castingSum == 6 || castingSum == 8) {
    aHexagramTagItem = brokenLines[lineNumber];
    // Otherwise, place an integer.
  } else if (castingSum == 7 || castingSum == 9) {
    aHexagramTagItem = solidLines[lineNumber];
  }
  return aHexagramTagItem;
}

// Now make sure that the set that has been generated is actually a full set of
// all 64 hexagrams with none repeated.
var hexComparisonList = [];

function isSetComplete64Hexagrams() {
  for (i=0; i<64; i++) {
    // Check if each generated hexagram tag is in the unique64HexagramTags list.
    // Send all results to a comparison list.
    if($.inArray(unique64HexagramTags[i], hexagramTags) > -1) {
      hexComparisonList.push('true');
    } else {
      hexComparisonList.push('false');
      }
  }
  // REMOVE THESE CONSOLE DEBUG LINES UPON FINAL CLEANUP
  if ($.inArray('false', hexComparisonList) > -1) {
    // console.log('Oh no! The generated set of hexagrams IS NOT a complete set.');
  } else {
    // console.log('Hurray! The generated set of hexagrams IS a complete set.');
  }
}

// These two array s below contain (1) the full set of hexagram tags
// for all possible hexagrams, and (2) the names and order as found in
// the Wilhelm/Baynes translation of the I Ching.

// The ordering of indices in the arrays is taken from the order of the
// hexagrams as provided in the index of the Wilhelm/Baynes version as well
// (They appear in different orders in the index and book proper. The tags are
// in the order as in the index, and the number in the comment beside each tag
// is the "hexagram" number for locating it in the text of the I Ching).

// Note that the tags progress from the bottom to the top line of each
// hexagram. Numerals refer to solid lines and letters to broken lines.

var unique64HexagramTags = [
  '123456', // 1
  'a23456', // 44
  '1b3456', // 13
  '12c456', // 10
  '123d56', // 9
  '1234e6', // 14
  '12345f', // 43
  'ab3456', // 33
  '1bc456', // 25
  '12cd56', // 61
  '123de6', // 26
  '1234ef', // 34
  'a2c456', // 6
  '1b3d56', // 37
  '12c4e6', // 38
  '123d5f', // 5
  'a23d56', // 57
  '1b34e6', // 30
  '12c45f', // 58
  'a234e6', // 50
  '1b345f', // 49
  'a2345f', // 28
  'abc456', // 12
  '1bcd56', // 42
  '12cde6', // 41
  '123def', // 11
  'a2cd56', // 59
  '1b3de6', // 22
  '12c4ef', // 54
  'ab3d56', // 53
  '1bc4e6', // 21
  '12cd5f', // 60
  'a23de6', // 18
  '1b34ef', // 55
  'ab34e6', // 56
  '1bc45f', // 17
  'a234ef', // 32
  'ab345f', // 31
  'a2c45f', // 47
  'a23d5f', // 48
  '1b3d5f', // 63
  'a2c4e6', // 64
  'abcd56', // 20
  '1bcde6', // 27
  '12cdef', // 19
  'a2cde6', // 4
  '1b3def', // 36
  'ab3de6', // 52
  '1bc4ef', // 51
  'abc4e6', // 35
  '1bcd5f', // 3
  'a23def', // 46
  'ab34ef', // 62
  'abc45f', // 45
  'a2cd5f', // 29
  'ab3d5f', // 39
  'a2c4ef', // 40
  '1bcdef', // 24
  'a2cdef', // 7
  'ab3def', // 15
  'abc4ef', // 16
  'abcd5f', // 8
  'abcde6', // 23
  'abcdef'  // 2
];

// This array will be used to identify which trigrams make up the hexagrams for an assigned art piece.  
// I can also count how many letters are in a hexagram and use that as a variable (for spacing between lines, perhaps)
var trigramTags = [
  '123', // The Creative / Heaven [BOTTOM]
  '456', // The Creative / Heaven [TOP]
  'a23', // The Gentle / Wind [BOTTOM]
  'd56', // The Gentle / Wind [TOP]
  '1b3', // The Clinging / Fire [BOTTOM]
  '4e6', // The Clinging / Fire [TOP]
  '12c', // The Joyous / Lake [BOTTOM]
  '45f', // The Joyous / Lake [TOP]
  'ab3', // Keeping Still / Mountain [BOTTOM]
  'de6', // Keeping Still / Mountain [TOP]
  '1bc', // The Arousing / Thunder [BOTTOM]
  '4ef', // The Arousing / Thunder [TOP]
  'a2c', // The Abysmal / Water [BOTTOM]
  'd5f', // The Abysmal / Water [TOP]
  'abc', // The Receptive / Earth [BOTTOM]
  'def' // The Receptive / Earth [TOP]
];

// This has duplicate values of each so that it will correspond 1:1 with trigramTags[].  This shouldn't be needed after testing is complete.
var trigramTagNames = [
  'Heaven (below)', 
  'Heaven (above)', 
  'Wind (below)', 
  'Wind (above)', 
  'Fire (below)', 
  'Fire (above)', 
  'Lake (below)', 
  'Lake (above)', 
  'Mountain (below)', 
  'Mountain (above)', 
  'Thunder (below)', 
  'Thunder (above)', 
  'Water (below)', 
  'Water (above)', 
  'Earth (below)', 
  'Earth (above)' 
]

// The first array contains the order of the hexagrams as laid out in the the Wilhelm/Baines I Ching.
// The second array contains all of the names and titles of the hexagrams,
// listed in the same order as the array above so they can easily be
// accessed later.

var iChingHexagramsOrder = [1,44,13,10,9,14,43,33,25,61,26,34,6,37,38,5,57,30,58,50,49,28,12,42,41,11,59,22,54,53,21,60,18,55,56,17,32,31,47,48,63,64,20,27,19,4,36,52,51,35,3,46,62,45,29,39,40,24,7,15,16,8,23,2];

var unique64HexagramTagNames = [
  '1. The Creative', // 1
  '44. Coming to Meet', 
  '13. Fellowship with Men', 
  '10. Treading [Conduct]', 
  '9. The Taming Power of the Small', // 5
  '14. Possession in Great Measure', 
  '43. Break-through (Resoluteness)', 
  '33. Retreat', 
  '25. Innocence (The Unexpected)', // 9
  '61. Inner Truth', 
  '26. The Taming Power of the Great', 
  '34. The Power of the Great', 
  '6. Conflict', // 13
  '37. The Family [The Clan]', 
  '38. Opposition', 
  '5. Waiting (Nourishment)', 
  '57. The Gentle (The Penetrating, Wind)', // 17 
  '30. The Clinging, Fire', 
  '58. The Joyous, Lake', 
  '50. The Caldron', 
  '49. Revolution (Molting)', // 21
  '28. Preponderance of the Great', 
  '12. Standstill [Stagnation]', 
  '42. Increase', 
  '41. Decrease', // 25
  '11. Peace', 
  '59. Dispersion [Dissolution]', 
  '22. Grace', 
  '54. The Marrying Maiden', // 29
  '53. Development (Gradual Progress)', 
  '21. Biting Through', 
  '60. Limitation', 
  '18. Work on What Has Been Spoiled [Decay]', // 33
  '55. Abundance [Fullness]', 
  '56. The Wanderer', 
  '17. Following', 
  '32. Duration', // 37
  '31. Influence (Wooing)', 
  '47. Oppression (Exhaustion)', 
  '48. The Well', 
  '63. After Completion', // 41
  '64. Before Completion', 
  '20. Contemplation (View)', 
  '27. The Corners of the Mouth (Providing Nourishment)', 
  '19. Approach', // 45
  '4. Youthful Folly', 
  '36. Darkening of the Light', 
  '52. Keeping Still, Mountain', 
  '51. The Arousing (Shock, Thunder)', // 49
  '35. Progress', 
  '3. Difficulty at the Beginning', 
  '46. Pushing Upward', 
  '62. Preponderance of the Small', // 53
  '45. Gathering Together [Massing]', 
  '29. The Abysmal (Water)', 
  '39. Obstruction', 
  '40. Deliverance', // 57 
  '24. Return (The Turning Point)', 
  '7. The Army', 
  '15. Modesty', 
  '16. Enthusiasm', // 61
  '8. Holding Together [Union]', 
  '23. Splitting Apart', 
  '2. The Receptive'
];


//                                        BOOK ARRAY                                               

/* 
For this demonstration version (before the generative art replaces the linguistic lists), I will
first add the original poems, then the linguistic lists, then retrieve each final poem from the patternedPoems arrays
for the shuffled linguistic lists and the shuffled original poems.

These will then be drawn by drawPoemPage().

For Tyler's final, desired version, I need to reorder the poems in the array to be in ascending numerical order.
*/

var allPoemSets = [];

// 
var linguisticListReplacementStatement = ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "]

function assembleAllPoemSetsArray() {

  // Add the unshuffled original poems to the array
  allPoemSets.push(originalPoem1);
  allPoemSets.push(originalPoem2);
  allPoemSets.push(originalPoem3);
  allPoemSets.push(originalPoem4);
  allPoemSets.push(originalPoem5);
  allPoemSets.push(originalPoem6);
  allPoemSets.push(originalPoem7);
  allPoemSets.push(originalPoem8);
  allPoemSets.push(originalPoem9);
  allPoemSets.push(originalPoem10);
  allPoemSets.push(originalPoem11);
  allPoemSets.push(originalPoem12);
  allPoemSets.push(originalPoem13);
  allPoemSets.push(originalPoem14);
  allPoemSets.push(originalPoem15);
  allPoemSets.push(originalPoem16);

  // Add the unshuffled linguistic lists to the array
  for (i=0; i<16; i++) {
    allPoemSets.push(linguisticListReplacementStatement);
  }

  // Add the shuffled lines from the allPatternedPoemLinesLinguistic array
  for (i=0; i<16; i++) {
    allPoemSets.push(linguisticPoemsShuffled[i]);
  }

  // Add the shuffled lines from the originalPoemsShuffled array
  for (i=0; i<16; i++) {
    allPoemSets.push(originalPoemsShuffled[i]);
  }
}

// /*

// This function will assemble the book in the final order, which is 1 through 64 according to the hexagram numbers. This will in effect
// shuffle the order of the book according to the random order in which the hexagrams where cast for each poem in the book.

// define new array to hold all 64 arrays, one for each cast hexagram/title/poem
var assembledBookArray = new Array();

function assembleBookByCastHexagrams() {
  // define a blank array to add to book array
  var anAssembledBookArrayPage = [];
  // use a loop to assemble each page of the book from existing arrays to the following indices of the current array:
  // [0] the cast hexagram tag, [1] the hexagram title for that tag, [2] the poem (page) that the hexagram was cast for
  // this is a variable to store the index value of the current cast hexagram.

  for (i=0; i<64; i++) {
    // I have to locate the index value hexagram number [i] in the cast hexagrams (hexagramTags) list. This involves getting 
    // the indexOf for number [i+1] in the iChingHexagramsOrder array (tagIndexA), then getting the hexagram tag for that from 
    // unique64HexagramTags (thisHexTag), then using indexOf to find its index value in the hexagramTags cast hexagrams array (currentCastHexagramTagIndex).
    var thisUnique64HexagramTagIndex = iChingHexagramsOrder.indexOf(i+1);
    var thisHexTag = unique64HexagramTags[thisUnique64HexagramTagIndex];
    var thisCastHexagramTagIndex = hexagramTags.indexOf(thisHexTag);

    // First I will add the cast hexagram tag to index[0] of the array
    anAssembledBookArrayPage.push(thisHexTag);
    // Now I will push to index[1] the hexagram name of the current tag using that index value
    anAssembledBookArrayPage.push(unique64HexagramTagNames[thisUnique64HexagramTagIndex]);
    // Finally, I will push to index[2] the poem that is located in the position where the current cast hexagram was cast
    anAssembledBookArrayPage.push(allPoemSets[thisCastHexagramTagIndex]);
    // Now to send this 3-item array to the fully assembled book array
    assembledBookArray.push(anAssembledBookArrayPage);
    // Clear anAssembledBookArrayPage for the next page in the loop
    anAssembledBookArrayPage = [];
  }
}

// 2D Array will contain data for the 16 line art pages.  Each 2nd level index will contain this sub-array:  [0] index values in assembledBookArray for art pages, [1] hexagram tag, [2] bottom trigram, [3] top trigram.
// The generated art work will be stored in a different array; code is located in the line_art.js file.
var lineArtPagesArray = new Array()  

// Simple array with just the index values of art pages (for the art/poem switch function)
var lineArtPageNumbers = new Array()

// Assembles an array containing needed data concerning the line art, along with the generated art itself
function createLineArtArray() {
  let aLineArtPage = []
  let lineArtPageIndexValue

  // Check all indices of anAssembledBookArrayPage[] and transfer index values for those for which the first index of the poem is blank ("  ") to aLineArtPage[]\
  for (i=0; i<64; i++) {
     let thisIndexContent = assembledBookArray[i][2][0]  // Check on this.  Should be the first value of the blank "poem" placeholder array.  YES CORRECT
     let thisIndexHexagramTag = assembledBookArray[i][0]
     if (thisIndexContent == "  ") {
       aLineArtPage.push(i)
       aLineArtPage.push(thisIndexHexagramTag)
       // Push the partially complete page arrays to the full array
       lineArtPagesArray.push(aLineArtPage)
       // Now to add just the index number for the poem/art page switcher function
       lineArtPageNumbers.push(i)
     }
     // Clear temp array for the next page
     aLineArtPage = []
  }

  // Split the hextag into two 3-character bits then store each as bottom and top trigram in indices [2] and [3] of 
  for (i=0; i<16; i++) {
    let thisArtHexTagChunks = []
    let thisArtHexTag = lineArtPagesArray[i][1]
    // console.log('thisArtHexTag = ' + thisArtHexTag)
    // Modified from StackOverflow.  Uses match and a regex to break strings into chunks of three characters then save all chuncks to an array.
    thisArtHexTagChunks = thisArtHexTag.match(/.{1,3}/g)
    // console.log('thisArtHexTagChunks = ')
    // console.log(thisArtHexTagChunks)
    let thisBottomTrigramTag = thisArtHexTagChunks[0]
    // console.log('thisBottomTrigramTag = ') 
    // console.log(thisBottomTrigramTag)
    let thisTopTrigramTag = thisArtHexTagChunks[1]
    // console.log('thisTopTrigramTag = ') 
    // console.log(thisTopTrigramTag)
    append(lineArtPagesArray[i], thisBottomTrigramTag)
    append(lineArtPagesArray[i], thisTopTrigramTag)
  }
  console.log('lineArtPagesArray = ')
  console.log(lineArtPagesArray)

}

// DEPRECATED CODE 

// NOTE: This will be replaced with "Next Page" and "Previous Page" buttons.

/*
function keyPressed(){
  if (-1 < drawPoemPageCounter < 65) {
    if (keyIsPressed) {
      if ((key == 'd') || (key == 'D')) {
        drawPoemPageCounter += 1;
        redraw();
      }
      if ((key == 'a') || (key == 'A')) {
        drawPoemPageCounter -= 1;
        redraw();
      }
    }
  }
}
*/

  /* DOM select() method to attach a mouse event to an HTML DOM element (buttom image) outside of the canvas
     Note: mousePressed() was not working due to bug in p5.js file, but mouseClicked() worked.

  nextPageButtonTop = select('#nextpage-img');
  nextPageButtonTop.mouseClicked(nextPage);

  previousPageButtonTop = select('#previouspage-img');
  previousPageButtonTop.mouseClicked(previousPage);
  */

  /*
RECOMMONDED ALTERNATE FUNCTION TO P5.JS DEPRECATED SHUFFLE() METHOD

NOTE: This method is much slower than shuffle() was. Maybe I 
will just stick with that until I get this to run through Node 
with more resources. Or find a more efficient shuffling method.

 * Shuffles array in place.
 * @param {Array} a items An array containing the items.

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
*/