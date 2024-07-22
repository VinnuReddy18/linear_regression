var data = [];
var slope = 1;
var intercept = 0;
var userSlope, userIntercept;
var userCost = 0;
var xSlider, ySlider;
var selectingStart = false;
var selectingEnd = false;
var startPoint, endPoint;
var score = 0;

function setup() {
  createCanvas(400, 400);
  createSliders();
}

function createSliders() {
  xSlider = createSlider(-100, 100, 0);
  xSlider.position(20, height + 20);
  ySlider = createSlider(-100, 100, 0);
  ySlider.position(20, height + 50);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (data.length < 15) {
      var x = map(mouseX, 0, width, 0, 1);
      var y = map(mouseY, 0, height, 1, 0);
      var point = createVector(x, y);
      data.push(point);

      linearRegression();
      calculateUserCost();
    } else {
      if (!selectingStart && !selectingEnd) {
        startPoint = createVector(map(mouseX, 0, width, 0, 1), map(mouseY, 0, height, 1, 0));
        selectingStart = true;
      } else if (selectingStart && !selectingEnd) {
        endPoint = createVector(map(mouseX, 0, width, 0, 1), map(mouseY, 0, height, 1, 0));
        selectingEnd = true;

        userSlope = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
        userIntercept = endPoint.y - userSlope * endPoint.x;

        score = calculateScore();
      }
    }
  }
}

function linearRegression() {
  var xSum = 0;
  var ySum = 0;
  for (var i = 0; i < data.length; i++) {
    xSum += data[i].x;
    ySum += data[i].y;
  }

  var xMean = xSum / data.length;
  var yMean = ySum / data.length;

  var num = 0;
  var den = 0;
  for (var i = 0; i < data.length; i++) {
    var x = data[i].x;
    var y = data[i].y;
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) * (x - xMean);
  }

  slope = num / den;
  intercept = yMean - slope * xMean;
}

function calculateUserCost() {
  if (userSlope && userIntercept) {
    userCost = 0;
    for (var i = 0; i < data.length; i++) {
      var x = data[i].x;
      var y = data[i].y;
      var predictedY = userSlope * x + userIntercept;
      userCost += abs(y - predictedY);
    }
    userCost /= data.length;
  }
}

function drawLine() {
  var x1 = 0;
  var y1 = slope * x1 + intercept;
  var x2 = 1;
  var y2 = slope * x2 + intercept;

  x1 = map(x1, 0, 1, 0, width);
  y1 = map(y1, 0, 1, height, 0);
  x2 = map(x2, 0, 1, 0, width);
  y2 = map(y2, 0, 1, height, 0);

  stroke(0, 255, 0);
  line(x1, y1, x2, y2);
}

function calculateScore() {
  if (userSlope && userIntercept) {
    var totalError = 0;
    for (var i = 0; i < data.length; i++) {
      var x = data[i].x;
      var y = data[i].y;
      var predictedY = userSlope * x + userIntercept;
      totalError += abs(y - predictedY);
    }
    var averageError = totalError / data.length;
    var score = map(averageError, 0, 1, 100, 0);
    return score;
  } else {
    return 0;
  }
}

function draw() {
  background(51);

  var offsetX = xSlider.value() / width;
  var offsetY = ySlider.value() / height;
  slope = 1 + offsetX;
  intercept = offsetY;

  for (var i = 0; i < data.length; i++) {
    var x = map(data[i].x, 0, 1, 0, width);
    var y = map(data[i].y, 0, 1, height, 0);

    var yLine = slope * data[i].x + intercept;

    var cost = abs(data[i].y - yLine);

    var colorValue = map(cost, 0, 1, 0, 255);

    if (cost > 0.5) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }

    ellipse(x, y, 8, 8);
  }

  drawLine();

  if (userSlope && userIntercept) {
    stroke(0, 0, 255);
    var x1 = 0;
    var y1 = userSlope * x1 + userIntercept;
    var x2 = 1;
    var y2 = userSlope * x2 + userIntercept;
    x1 = map(x1, 0, 1, 0, width);
    y1 = map(y1, 0, 1, height, 0);
    x2 = map(x2, 0, 1, 0, width);
    y2 = map(y2, 0, 1, height, 0);
    line(x1, y1, x2, y2);

    textSize(16);
    fill(255);
    text("User's Cost: " + userCost.toFixed(2), 10, 40);
  }

  if (score > 0) {
    textSize(16);
    fill(255);
    text("Score: " + score.toFixed(2), 10, 60);
  }

  if (data.length >= 15 && !selectingStart && !selectingEnd) {
    textSize(16);
    fill(255);
    text("Select start and end points for your line.", 10, 20);
  }

  fill(255);
  text("X Offset", xSlider.x * 2 + xSlider.width, xSlider.y + 10);
  text("Y Offset", ySlider.x * 2 + ySlider.width, ySlider.y + 10);
}
