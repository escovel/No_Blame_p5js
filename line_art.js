// Line art code for No Blame 
// Code and concept by Eric Goddard-Scovel

/*

DESCRIPTION: This code implements a system for interpreting the 64 hexagrams of the I Ching as 64 generative artworks, and was
commissioned to provide an integral generative art component of 16 works per instance of the No Blame generative poetry book project.

The artistic interpretation is based conceptually on the 8 trigrams of the I Ching, with two variations of each trigram for the top
and bottom positions it can occupy in a hexagram. For each hexagram's generative art image, first the bottom trigram pattern is 
drawn in darker, more opaque, and often thicker lines, and then the top trigram is drawn and superimposed over that in lighter, 
thinner, and offen more transparent lines. The associated elements of each trigram as well as other concepts and images associated 
with it were taken into consideration when designing the generative art, so they present a combination of natural represtation and 
abstraction.

As new visual symbols of the hexagrams, I did not seek to replace the stark and simple beauty and logic of the original system of
six lines. Instead, I felt that I might give a different perspective by drawing many thousands of more lines using contemporary
creative coding methods, and have them arranged in such a way to present the combined tones and energies of the trigrams that
make up each hexagram.

*/

let lineArtDrawingBuffer  // 
let lineArtAssemblyBuffer  // Off-screen graphics buffer for merging the two trigram line patterns
let lineArtTempArray = []   // Array for storing the two trigram line patterns until merging and seding to the lineArtBookSetArray
let lineArtBookSetArray = []   // Array for storing the final merged line art images for drawing to the page. Either keep this array, or push all image data to lineArtPagesArray indices [i][4].
let verticalConditionsArray = []
let topTrigram
let bottomTrigram
let yLoopStart = 50
let yLoopEnd = 600
let xLoopStart = 50
let xLoopEnd = 600

let lineWeight
let lineGray
let lineAlpha
let lineSpacing
let smallestStep
let largestStep
let step
let angle = 0
let xShift
let lastX
let lastY
let xShiftVariance
let xLoopStepCounter
let shiftX
let shiftY

let randoShift

// Note:  This setup function is for testing/drafting of the system only.
// Necessary lines from this will be incorporated in the the No Blame main program setup() function.
// function setup() {
//   createCanvas(650, 650)
//   noLoop() 
//   angleMode(DEGREES)
//   // rectMode(CENTER)  // Note: This can probably be removed. Test after relevant lines are transferred to the main-program setup().
//   lineArtDrawingBuffer = createGraphics(650, 650)
//   lineArtAssemblyBuffer = createGraphics(650, 650)
//   makeLineArtBookSetArray()
//   drawArtTEST()
//   // testBoxes()
// }

function makeLineArtBookSetArray() {
  for (let x = 0; x < 16; x++) {

    // Then, draw the bottom trigram
    bottomTrigram = lineArtPagesArray[x][2]   // Note: Will be determined by getTrigramValuesFromHexTag()

    switch(bottomTrigram) {
      case '123':
      creativeHeavenBOTTOM()
      break;
      case 'abc':
      receptiveEarthBOTTOM()
      break;
      case '1bc':
      arousingThunderBOTTOM()
      break;
      case 'a23':
      penetratingWindBOTTOM()
      break;
      case 'a2c':
      abysmalWaterBOTTOM()
      break;
      case '1b3':
      clingingFireBOTTOM()
      break;
      case 'ab3':
      keepingStillMountainBOTTOM()
      break;
      case '12c':
      joyousLakeBOTTOM()
      break;
    }

    // Next, draw the top trigram
    topTrigram = lineArtPagesArray[x][3]   // Note: Will be determined by getTrigramValuesFromHexTag()

    switch(topTrigram) {
      case '456':
      creativeHeavenTOP()
      break;
      case 'def':
      receptiveEarthTOP()
      break;
      case '4ef':
      arousingThunderTOP()
      break;
      case 'd56':
      penetratingWindTOP()
      break;
      case 'd5f':
      abysmalWaterTOP()
      break;
      case '4e6': 
      clingingFireTOP()
      break;
      case 'de6':
      keepingStillMountainTOP()
      break;
      case '45f':
      joyousLakeTOP()
      break;
    }

    // Finally, assemble the art in the lineArtAssemblyArray then push assembled art to the lineArtBookSetArray[]
    // This will be drawn for test purposed with a new modified drawArtTEST()

    lineArtAssemblyBuffer.image(lineArtTempArray[0], 0, 0)
    lineArtAssemblyBuffer.image(lineArtTempArray[1], 0, 0)
    lineArtBookSetArray.push(lineArtAssemblyBuffer)
    
    // Clear the assembly buffer for the next one
    lineArtTempArray = [] 
    lineArtAssemblyBuffer = createGraphics(650, 650)
  }
}

// CREATIVE -- HEAVEN

function creativeHeavenBOTTOM() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  
  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart + 16 ; yInit <= yLoopEnd; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    // lineGray = 8 + noise(random(5)) * 12
    // lineAlpha = 240 + noise(random(5)) * 60
    // lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    // lineWeight = random(24, 32)
    xLoopEnd = 600
    lineWeight = random(30, 32)
    lineSpacing = random(51.5, 52)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 24; x <= xLoopEnd + 10; x += step) {
      // randoShift = random(0.75, 1.5)
      // smallestStep = floor(random(7, 8))
      // largestStep = smallestStep + floor(random(3, 4))
      // step = floor(random(smallestStep, largestStep))

      step = random(47.75, 48.25)
      y = yInit + noise(yNoise) * 1
      lineArtDrawingBuffer.strokeWeight(lineWeight)

      let heavenLineThickness = 10
      	for(let z = 0; z <= heavenLineThickness; z += 0.5) {
     		lineGray = 12 + random(-z * 10, z * 10) + noise(random(5)) * 68
      		lineAlpha = 220 - (z * 20) + noise(random(5)) * 20
      		lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
        	lineArtDrawingBuffer.line(x - z, y + random(-1, 1), lastX - z, lastY + random(-1, 1))
      	}
      // lineArtDrawingBuffer.line(x, y, lastX, lastY)
      lastX = x + 30 // random(5.9, 6.2) // + random(-1,1)
      lastY = y
      yNoise += 0.03  // random(0.08, 0.12)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function creativeHeavenTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  
  lineArtDrawingBuffer.push()
  lineArtDrawingBuffer.translate(650,650)
  lineArtDrawingBuffer.rotate(radians(float(random(178, 182))))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 30 ; yInit <= yLoopEnd + 30 ; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    lineGray = 255
    lineAlpha = random(0, 4)
    xLoopEnd = 600
    lineWeight = random(6, 16)
    lineSpacing = random(0.5, 3)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 40; x <= xLoopEnd + 40; x += step) {
      // randoShift = random(0.75, 1.5)
      // smallestStep = floor(random(7, 8))
      // largestStep = smallestStep + floor(random(3, 4))
      // step = floor(random(smallestStep, largestStep))
      // lineGray = 160 + noise(random(5)) * 65
      // lineAlpha = 20 + noise(random(5)) * 60
      lineWeight += sqrt(xLoopStepCounter) * random(0.0005, 0.001)
      lineAlpha += random(0.04, 0.4) * 0.2
      lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
      step = 3  // random(6, 12)
      y = yInit + noise(yNoise)
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      // if (xLoopStepCounter == 0) {
      //   xShiftVariance = random(0.5, 0.2)
      //   xShift = x * (noise(random(5)) * xShiftVariance) + 2
      //   x += xShift
      //   // lineArtDrawingBuffer.line(x, y, lastX, lastY)
      //   xLoopEnd += xShift
      // } else {
        lineArtDrawingBuffer.line(x, y, lastX, lastY)
      // }
      lastX = x // + random(1.9, 2.1) // + random(-1,1)
      lastY = y
      yNoise += random(0.02, 0.04)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function receptiveEarthBOTTOM() {
  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart; yInit  <= yLoopEnd + 20; yInit += lineSpacing) {
    let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 5 + noise(random(5)) * 25
    lineAlpha = 0 + noise(random(5)) * 70
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(100, 200)
    lineSpacing = random(41, 76)
    xLoopEnd = 600
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart + 6 ; x <= xLoopEnd + 4; x += step) {
      smallestStep = 1
      largestStep = 2
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * 3) * 4  // Alternate:  let y = yInit + (sin(rad) * random(0.5, 0.525)) + 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      // if (xLoopStepCounter == 0) {
      //   xShiftVariance = random(-0.1, 0.15)  // Alternative:  (-0.05, 0.4)
      //   xShift = x * (noise(random(5)) * xShiftVariance)
      //   x += xShift
      //   xLoopEnd += xShift // + (noise(random(5)) * xShiftVariance)
      // } else {
        // shiftX = 8
        // shiftY = 24 
        lineArtDrawingBuffer.line(x, y, lastX, lastY) // lineArtDrawingBuffer.line(x + shiftX, y + shiftY, lastX, lastY)
      // }
      lastX = x - 10
      lastY = y
      angle += random(0, 80)
      xLoopStepCounter += 1
    }
  }
  // draw four white rectangles to "clean" the edges (make a perfect square)
  lineArtDrawingBuffer.rectMode(CENTER)
  lineArtDrawingBuffer.strokeWeight(0)
  lineArtDrawingBuffer.fill(255)
  lineArtDrawingBuffer.rect(25, 325, 50, 650)
  lineArtDrawingBuffer.rect(625, 325, 50, 650)
  lineArtDrawingBuffer.rect(325, 25, 650, 50)
  lineArtDrawingBuffer.rect(325, 625, 650, 50)

  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function receptiveEarthTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  
  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 30 ; yInit <= yLoopEnd + 6; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    xLoopStart = 45 + random(-6, 6)
    xLoopEnd = 610
    lineWeight = random(0.25, 1)
    lineSpacing = random(0.75, 1.25)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd; x += step) {
      // randoShift = random(0.75, 1.5)
      // smallestStep = floor(random(7, 8))
      // largestStep = smallestStep + floor(random(3, 4))
      // step = floor(random(smallestStep, largestStep))

      step = random (12.75, 18.25)// step = random(8.75, 20.25)
      y = yInit + noise(yNoise) * 80
      lineArtDrawingBuffer.strokeWeight(lineWeight)

      let earthLineThickness = 6
      	for(let z = 0; z <= earthLineThickness; z += 2) {
     		  lineGray = 250 + random(-z * 5, z * 5) + noise(random(5)) * 5
      		lineAlpha = 15 - (z * 12) + noise(random(5)) * 40
      		lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
        	lineArtDrawingBuffer.line(x - z, y + random(-16, 14), lastX - z, lastY + random(-6, 10))
      	}
      // lineArtDrawingBuffer.line(x, y, lastX, lastY)
      lastX = x + random(6, 18) // random(5.9, 6.2) // + random(-1,1)
      lastY = y
      yNoise +=  random(0.03, 0.06) // 0.03
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function arousingThunderBOTTOM() {

  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 14; yInit <= yLoopEnd - 40; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    // let thunderLineThickness = floor(random(1, 8)) // Replace with static integer if constant thickness desired
    xLoopStepCounter = 0
    lineGray = 5 + noise(random(5)) * 12
    lineAlpha = 80 + noise(random(5)) * 120
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(1.5, 2)
    xLoopEnd = 600
    lineSpacing = random(8, 12)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 5; x <= xLoopEnd + 5; x += step) {
      // randoShift = random(0, 0.5) * noise(random(40))
      smallestStep = floor(random(12, 16))
      largestStep = smallestStep + floor(random(8, 12))
      step = floor(random(smallestStep, largestStep))
      y = yInit + noise(yNoise) * 48
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.2, 0.4)
        xShift = x * (noise(random(50)) * xShiftVariance)
        x += xShift + random(-2, 6)
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        xLoopEnd -= xShift * 0.2
      } else {
        let thunderLineThickness = floor(random(2, 24))
      	for(let z = 0; z <= thunderLineThickness; z += 0.5) {
           lineArtDrawingBuffer.line(x, y + z, lastX, lastY + z)
      	}
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        // lineArtDrawingBuffer.line(x, y+1, lastX, lastY+1)
        // lineArtDrawingBuffer.line(x, y+2, lastX, lastY+2)
        // lineArtDrawingBuffer.line(x, y+3, lastX, lastY+3)
        // lineArtDrawingBuffer.line(x, y+4, lastX, lastY+4)
        // lineArtDrawingBuffer.line(x, y+5, lastX, lastY+5)
        // lineArtDrawingBuffer.line(x, y+6, lastX, lastY+6)
        
        // lineArtDrawingBuffer.line(x - randoShift, y - randoShift, lastX + randoShift, lastY + randoShift)
      }
      lastX = x
      lastY = y
      yNoise += 30
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function arousingThunderTOP() {

  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 20; yInit <= yLoopEnd; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    // let thunderLineThickness = floor(random(1, 8))  // Replace with static integer if constant thickness desired
    xLoopStepCounter = 0
    lineGray = 250 + noise(random(5)) * 5
    lineAlpha = 40 + noise(random(5)) * 200
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(1, 3)
    xLoopEnd = 600
    lineSpacing = random(8, 32)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 16; x <= xLoopEnd + 16; x += step) {
      // randoShift = random(0, 0.5) * noise(random(40))
      smallestStep = floor(random(10, 14))
      largestStep = smallestStep + floor(random(8, 10))
      step = floor(random(smallestStep, largestStep))
      y = yInit + noise(yNoise) * 48
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.2, 0.4)
        xShift = x * (noise(random(50)) * xShiftVariance)
        x += xShift + random(-2, 6)
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        xLoopEnd += xShift * 0.2
      } else {
      	let thunderLineThickness = floor(random(1, 12))
      	for(let z = 0; z <= thunderLineThickness; z += 0.5) {
           lineArtDrawingBuffer.line(x, y + z, lastX, lastY + z)
      	}
      }
      lastX = x
      lastY = y
      yNoise += 30
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function penetratingWindBOTTOM() {
  lineArtDrawingBuffer.strokeCap(ROUND)

  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 20; yInit <= yLoopEnd - 50; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    lineGray = 8 + noise(random(5)) * 22
    lineAlpha = 210 + noise(random(5)) * 30
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(3, 12)
    xLoopEnd = 600
    lineSpacing = 5 + random(0, 4)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd; x += step) {
      // randoShift = random(0.75, 1.5)
      smallestStep = floor(random(7, 8))
      largestStep = smallestStep + floor(random(3, 4))
      step = floor(random(smallestStep, largestStep))
      // step = 12
      y = yInit + noise(yNoise) * random(75, 85)
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.05, 0.2)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        xLoopEnd += xShift
      } else {
        lineArtDrawingBuffer.line(x, y, lastX, lastY)
        // lineArtDrawingBuffer.line(x - randoShift, y + randoShift, lastX + randoShift, lastY - randoShift)
        // lineArtDrawingBuffer.point(x - randoShift, y - randoShift)
      }
      lastX = x + random(-1,1)
      lastY = y
      yNoise += random(0.08, 0.12)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

// NOTE: Revision of original keepingStillMountaimTOP 022021
function penetratingWindTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 8; yInit <= yLoopEnd + 8; yInit += lineSpacing) {
    let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 250 + noise(random(5)) * 5
    lineAlpha = 205 + noise(random(5)) * 50
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(4, 16)
    lineSpacing = random(14, 48)
    xLoopEnd = 600  // This needs to be redefined each loop to reset it to baseline.
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 16; x <= xLoopEnd + 12; x += step) {
      smallestStep = random(0.25, 1)
      largestStep = smallestStep + random(0.5, 1)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * 10) + noise(random(25)) * 0.2 // OLD:  yInit + (sin(rad) * 12) - 2 + noise(yNoise) * 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.05, 0.1)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift + (noise(random(5)) * xShiftVariance * 16)
      } else {
        // randoShift = 24
        lineArtDrawingBuffer.line(x, y, lastX, lastY)
      }
      lastX = x - random(0.3, 1.2)
      lastY = y
      angle += random(-120, 56)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function abysmalWaterBOTTOM() {
  lineArtDrawingBuffer.strokeCap(SQUARE)

  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart + 8; yInit <= yLoopEnd - 8; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    lineGray = 8 + noise(random(5)) * 24
    lineAlpha = 120 + noise(random(5)) * 80
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(0.5, 16)
    xLoopEnd = 600
    lineSpacing = 0.5 + random(0, 2)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd; x += step) {
      randoShift = random(0.75, 1.5)
      smallestStep = floor(random(7, 9))
      largestStep = smallestStep + floor(random(1, 2))
      step = floor(random(smallestStep, largestStep))
      y = yInit + noise(yNoise) * 0.5
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.05, 0.2)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        xLoopEnd += xShift
      } else {
        // lineArtDrawingBuffer.line(x, y, lastX, lastY)
        lineArtDrawingBuffer.line(x - randoShift, y + randoShift, lastX + randoShift, lastY - randoShift)
        // lineArtDrawingBuffer.point(x - randoShift, y - randoShift)
      }
      lastX = x  // + random(1,2)
      lastY = y
      yNoise += 60
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function abysmalWaterTOP() {
  let yNoise = random(25)  //  I thought of removing this, but setting the value before the loops might be a good thing?

  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 15; yInit  <= yLoopEnd + 15; yInit += lineSpacing) {
    let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 240 + noise(random(5)) * 15
    lineAlpha = 10 + noise(random(5)) * 20
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(0.25, 0.6)
    lineSpacing = random(1, 2)
    xLoopEnd = 600
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart - 15; x <= xLoopEnd + 15; x += step) {
      smallestStep = random(0.15, 0.5) // random(1, 1.1)
      largestStep = random(4, 6) // smallestStep + random(0.2, 0.3)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * 30) * random(1, 1.5) // + noise(yNoise) * 4 
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.15, 0.35)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift
      } else {
        shiftX = random(3.5, 3.7) // random(4,8)
        shiftY = random(15.3, 15.5) // random(22, 26) 
        lineArtDrawingBuffer.line(x + shiftX, y + shiftY, lastX, lastY)
      }
      lastX = x - random(4, 8)
      lastY = y + random(1, 5)
      angle +=  random(-60, 80)  // random(-14, 47)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)  // EXPERIMENTAL
  lineArtDrawingBuffer = createGraphics(650, 650)  // EXPERIMENTAL
}

function clingingFireBOTTOM() {
  lineArtDrawingBuffer.strokeCap(ROUND)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart + 20; yInit  <= yLoopEnd - 10; yInit += lineSpacing) {
  	let lastX
    let lastY
    xLoopStepCounter = 0
    lineWeight = random(0.5, 2)
    lineSpacing = random(2, 10)
    xLoopEnd = 600
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd - 48; x += step) {
      smallestStep = random(0.25, 1)
      largestStep = smallestStep + random(0, 1.5)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * random(12, 16)) - 2 + noise(random(5))  // Alternate:  let y = yInit + (sin(rad) * random(0.5, 0.525)) + 4
      lineGray = 4 + noise(random(5)) * 16
      lineAlpha = 40 + noise(random(5)) * 300
      lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(-0.25, 0.45)  // Alternative:  (-0.05, 0.4)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift // + (noise(random(5)) * xShiftVariance)
      } else {
        shiftX = random(40, 42)
        shiftY = random(-2, 2) 
        lineArtDrawingBuffer.line(x + shiftX, y + shiftY, lastX - random(-2, 2), lastY - random(-2, 2))
      }
      lastX = x + random(-2, 2)
      lastY = y
      angle += random(-300, 563)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function clingingFireTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  
  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 20 ; yInit <= yLoopEnd + 6; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    xLoopStart = 45 + random(-6, 6)
    xLoopEnd = 610
    lineWeight = random(1, 1.25)
    lineSpacing = random(16, 24)
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd; x += step) {
      // randoShift = random(0.75, 1.5)
      // smallestStep = floor(random(7, 8))
      // largestStep = smallestStep + floor(random(3, 4))
      // step = floor(random(smallestStep, largestStep))

      step = random(0, 36)
      let rad = radians(angle)
      y = yInit + (sin(rad) * 0.5) * 3
      lineArtDrawingBuffer.strokeWeight(lineWeight)
        let randomGapAmount = floor(random(2, 7))
     		if (xLoopStepCounter % randomGapAmount == 0) {
      			lineGray = 245 + random(-5, 5) + noise(random(5)) * 10
        		lineAlpha = 20 + noise(random(5)) * 140
      		} else {
      			lineGray = 255
        		lineAlpha = 0
      		}
      		lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
        	lineArtDrawingBuffer.line(x, y - random(0, 10), lastX, lastY - random(-15, 0))
      // lineArtDrawingBuffer.line(x, y, lastX, lastY)
      lastX = x + random(0, 4) // random(5.9, 6.2) // + random(-1,1)
      lastY = y + random(1, 3)
      angle += random(-160, 363)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function keepingStillMountainBOTTOM() {
  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart + 20; yInit <= yLoopEnd - 0; yInit += lineSpacing) {
    let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 2 + noise(random(5)) * 6
    lineAlpha = 140 + noise(random(5)) * 80
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(54, 73)
    let spacingFactor = [0.7, 0.8, 0.95, 0.95, 1, 1, 1, 1, 1, 1.05, 1.15]
    let randomSpacingFactor = int(random(10))
    lineSpacing = lineWeight * spacingFactor[randomSpacingFactor]
    xLoopEnd = 600
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend
    lineArtDrawingBuffer.push()
    bufferRotationValue = 0
    // This IF statement is an attempt to keep this wobbly drawing within certain margins (containment)
    if (bufferRotationValue < -0.015) {
      bufferRotationValue = random(0.0005 ,0.001)
    } else if (bufferRotationValue >= -0.015 && bufferRotationValue < 0.015) {
      bufferRotationValue = random(-0.0005, 0.001)
    } else if (bufferRotationValue >= 0.015) {
      bufferRotationValue = random(-0.0005, -0.001)
    }

    lineArtDrawingBuffer.rotate(bufferRotationValue)

    // Inner loop draws the lines
    for (let x = xLoopStart; x <= xLoopEnd; x += step) {
      smallestStep = random(0.2, 0.4)
      largestStep = smallestStep + random(0.25, 0.5)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * random(0.35, 0.365)) + 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      // The "if" part of this if-else statement merely randomly shifts the start and end of each composite line
      // The "else" part draws the constituent lines that form each composite line
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(-0.075, 0.075)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        lineArtDrawingBuffer.line(x, y, x, y)
        xLoopEnd += xShift
      } else {
      	lineArtDrawingBuffer.line(x, y, lastX, lastY)     
      }
      lastX = x - 0.45
      lastY = y
      angle += random(-20, 16)
      xLoopStepCounter += 1
    }
  }
  // draw four white rectangles to "clean" the top and bottom edges
  lineArtDrawingBuffer.rectMode(CENTER)
  lineArtDrawingBuffer.strokeWeight(0)
  lineArtDrawingBuffer.fill(255)
  lineArtDrawingBuffer.rect(325, 25, 656, 56)
  lineArtDrawingBuffer.rect(325, 625, 656, 56)

  lineArtTempArray.push(lineArtDrawingBuffer)
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function keepingStillMountainTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  lineSpacing = 24

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 30; yInit <= yLoopEnd + 30; yInit += lineSpacing) {
    let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 245 + noise(random(5)) * 10
    let alphaArray = [5, 5, 10, 10, 10, 10, 10, 15, 15, 35, 50, 80]
    let randomInteger = int(random(11))
    lineAlpha = alphaArray[randomInteger] // 5 + noise(random(5)) * 115
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(26, 40)
    lineSpacing = lineWeight * 1.4 // random(8, 24)
    xLoopEnd = 600  // This needs to be redefined each loop to reset it to baseline.
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend
    lineArtDrawingBuffer.push()
    bufferRotationValue = 0
    // This IF statement is an attempt to keep this wobbly drawing within certain margins (containment)
    if (bufferRotationValue < -0.015) {
      bufferRotationValue = random(0.001 ,0.002)
    } else if (bufferRotationValue >= -0.015 && bufferRotationValue < 0.015) {
      bufferRotationValue = random(-0.001, 0.002)
    } else if (bufferRotationValue >= 0.015) {
      bufferRotationValue = random(-0.001, -0.002)
    }

    lineArtDrawingBuffer.rotate(bufferRotationValue)

    // Inner loop draws the lines
    for (let x = xLoopStart - 20; x <= xLoopEnd + 20; x += step) {
      smallestStep = random(0.05, 0.45)
      largestStep = smallestStep + random(0.25, 0.75)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * random(0.05, 0.25)) // OLD:  yInit + (sin(rad) * 12) - 2 + noise(yNoise) * 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(0.05, 0.1)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift + (noise(random(5)) * xShiftVariance * 16)
      } else {
        // randoShift = 24
        lineArtDrawingBuffer.line(x, y, lastX, lastY)
      }
      lastX = x - 0.75
      lastY = y + 1.25
      angle += random(-20, 16)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function joyousLakeBOTTOM() {
  lineArtDrawingBuffer.strokeCap(SQUARE)

  // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart + 12; yInit  <= yLoopEnd - 28; yInit += lineSpacing) {
  	let lastX
    let lastY
    xLoopStepCounter = 0
    lineGray = 8 + noise(random(5)) * 20
    lineAlpha = 90 + noise(random(5)) * 140
    lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(2, 2.5)
    lineSpacing = random(2, 40)
    xLoopEnd = 600
    // lineSpacing = (lineSpacing * 0.9) + 0.25  // This code makes the lines closer together as they descend

    // Inner loop draws the lines
    for (let x = xLoopStart + 6; x <= xLoopEnd - 16; x += step) {
      smallestStep = random(0.5, 1)
      largestStep = smallestStep + random(0, 0.5)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * 12) - 2 + noise(random(5)) * 4  // Alternate:  let y = yInit + (sin(rad) * random(0.5, 0.525)) + 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(-0.25, 0.45)  // Alternative:  (-0.05, 0.4)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift // + (noise(random(5)) * xShiftVariance)
      } else {
        shiftX = 8
        shiftY = 32 
        lineArtDrawingBuffer.line(x + shiftX, y + shiftY, lastX, lastY)
      }
      lastX = x
      lastY = y
      angle += random(-60, 140)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}

function joyousLakeTOP() {
  lineArtDrawingBuffer.strokeCap(SQUARE)
  let modAmount
  // lineSpacing = 24
  // lineArtDrawingBuffer.push()
  // lineArtDrawingBuffer.translate(650,0)
  // lineArtDrawingBuffer.rotate(radians(90))

  // // Outer loop creates the "block" of lines
  for (let yInit = yLoopStart - 32; yInit <= yLoopEnd + 10; yInit += lineSpacing) {
    let lastX
    let lastY
    let yNoise = random(25)
    xLoopStepCounter = 0
    lineGray = 250 + noise(random(5)) * 5
    // lineAlpha = 5 + noise(random(5)) * 205
    // lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
    lineWeight = random(1, 2)
    xLoopEnd = 600
    lineSpacing = floor(random(-8, 18))
    // lineSpacing = (lineSpacing * 0.94) + random(0.25, 0.75)  // This code makes the lines closer together as they descend
    modAmount = floor(random(24, 48))

    // Inner loop draws the lines
    for (let x = xLoopStart - 16; x <= xLoopEnd + 16; x += step) {
      lineAlpha = 55 + noise(random(5)) * 200
      lineArtDrawingBuffer.stroke(lineGray, lineAlpha)
      smallestStep = random(0.5, 1)
      largestStep = smallestStep + random(0, 0.5)
      step = random(smallestStep, largestStep)
      let rad = radians(angle)
      let y = yInit + (sin(rad) * 16) - 2 + noise(random(5)) * 4  // Alternate:  let y = yInit + (sin(rad) * random(0.5, 0.525)) + 4
      lineArtDrawingBuffer.strokeWeight(lineWeight)
      if (xLoopStepCounter == 0) {
        xShiftVariance = random(-0.25, 0.45)  // Alternative:  (-0.05, 0.4)
        xShift = x * (noise(random(5)) * xShiftVariance)
        x += xShift
        xLoopEnd += xShift // + (noise(random(5)) * xShiftVariance)
      } else if (xLoopStepCounter % modAmount == 0) {
        // shiftX = 0.5
        shiftAmount = random(1, 1.25)
        lineArtDrawingBuffer.line(x, y, lastX, lastY) // lineArtDrawingBuffer.line(x + shiftX, y + shiftY, lastX, lastY)
        lineArtDrawingBuffer.line(x + shiftAmount, y - shiftAmount, lastX + shiftAmount, lastY + shiftAmount)
      } else {
        // Nothing happens here. Just. Nothing.
      }
      lastX = x + random(-2, 4)
      lastY = y + random(-6, 2)
      angle += random(-60, 140)
      xLoopStepCounter += 1
    }
  }
  lineArtTempArray.push(lineArtDrawingBuffer)
  // lineArtDrawingBuffer.pop()
  lineArtDrawingBuffer = createGraphics(650, 650)
}