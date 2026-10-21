// =====================================
// p5.js 選擇題測驗系統
// 中文：Noto Serif TC
// 英文與數字：Playfair Display
//
// 動畫功能：
// 答對：正確選項上下小跳
// 答錯：選錯選項左右小晃
// =====================================

const chineseFont = "Noto Serif TC";
const englishFont = "Playfair Display";

const quizQuestions = [
  {
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    options: [
      "createCanvas()",
      "makeCanvas()",
      "canvasCreate()",
      "setCanvas()"
    ],
    answer: 0
  },
  {
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",
    options: [
      "start()",
      "setup()",
      "begin()",
      "init()"
    ],
    answer: 1
  },
  {
    question: "在 p5.js 中，哪一個函式會不斷重複執行？",
    options: [
      "repeat()",
      "looping()",
      "draw()",
      "run()"
    ],
    answer: 2
  },
  {
    question: "下列哪一個指令可以設定背景顏色？",
    options: [
      "background()",
      "colorBackground()",
      "setBackground()",
      "bgColor()"
    ],
    answer: 0
  },
  {
    question: "下列哪一個指令可以繪製圓形？",
    options: [
      "circle()",
      "round()",
      "drawCircle()",
      "ellipseCircle()"
    ],
    answer: 0
  }
];

let currentQuestionIndex = 0;
let correctCount = 0;
let selectedOptionIndex = -1;
let hasAnswered = false;
let quizFinished = false;
let hoveredOptionIndex = -1;
let ignoreMouseUntil = 0;
let answerAnimationStart = 0;

const colors = {
  background: "#f8f5f0",
  card: "#fffdf9",
  text: "#332c2c",
  secondaryText: "#756b66",
  primary: "#9b6b58",
  primaryHover: "#815343",
  correct: "#dcebd8",
  correctText: "#3d6840",
  wrong: "#f4dddd",
  wrongText: "#9a4848",
  border: "#d6c8bd",
  white: "#ffffff"
};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  canvas.elt.style.touchAction = "none";

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  smooth();
}

function draw() {
  background(colors.background);

  if (quizFinished) {
    drawResultScreen();
  } else {
    drawQuestionScreen();
  }
}

function drawQuestionScreen() {
  const layout = getQuizLayout();
  const currentQuestion = quizQuestions[currentQuestionIndex];

  drawHeader(layout);
  drawQuestionCard(layout, currentQuestion);
  drawOptions(layout, currentQuestion);

  if (hasAnswered) {
    drawFeedback(layout, currentQuestion);
    drawNextButton(layout);
  }
}

function drawHeader(layout) {
  drawMixedText(
    "p5.js 選擇題測驗",
    width / 2,
    layout.titleY,
    {
      size: layout.titleSize,
      color: colors.text,
      align: CENTER
    }
  );

  drawMixedText(
    `第 ${currentQuestionIndex + 1} 題／共 ${quizQuestions.length} 題`,
    width / 2,
    layout.progressY,
    {
      size: layout.progressSize,
      color: colors.secondaryText,
      align: CENTER
    }
  );

  const progressWidth = layout.contentWidth;
  const progressHeight = 8;
  const progressRatio =
    (currentQuestionIndex + 1) / quizQuestions.length;

  fill("#e5ddd5");
  noStroke();

  rect(
    width / 2,
    layout.progressBarY,
    progressWidth,
    progressHeight,
    5
  );

  fill(colors.primary);

  rect(
    width / 2 -
      progressWidth / 2 +
      progressWidth * progressRatio / 2,
    layout.progressBarY,
    progressWidth * progressRatio,
    progressHeight,
    5
  );
}

function drawQuestionCard(layout, currentQuestion) {
  fill(colors.card);
  stroke(colors.border);
  strokeWeight(1);

  rect(
    width / 2,
    layout.questionCardY,
    layout.contentWidth,
    layout.questionCardHeight,
    16
  );

  drawMixedText(
    currentQuestion.question,
    width / 2,
    layout.questionCardY,
    {
      size: layout.questionSize,
      color: colors.text,
      maxWidth: layout.contentWidth - 40,
      lineHeight: layout.questionSize * 1.5,
      align: CENTER
    }
  );
}

function drawOptions(layout, currentQuestion) {
  for (let i = 0; i < currentQuestion.options.length; i++) {
    const baseY =
      layout.optionStartY +
      i * (layout.optionHeight + layout.optionGap);

    const animationOffset =
      getOptionAnimationOffset(i, currentQuestion);

    const optionX =
      width / 2 + animationOffset.x;

    const optionY =
      baseY + animationOffset.y;

    const isSelected = selectedOptionIndex === i;
    const isCorrect = currentQuestion.answer === i;

    let optionColor = colors.card;
    let optionTextColor = colors.text;
    let borderColor = colors.border;

    if (hasAnswered && isCorrect) {
      optionColor = colors.correct;
      optionTextColor = colors.correctText;
      borderColor = colors.correctText;
    } else if (hasAnswered && isSelected && !isCorrect) {
      optionColor = colors.wrong;
      optionTextColor = colors.wrongText;
      borderColor = colors.wrongText;
    } else if (!hasAnswered && hoveredOptionIndex === i) {
      optionColor = "#f2e8e1";
      borderColor = colors.primary;
    }

    fill(optionColor);
    stroke(borderColor);
    strokeWeight(2);

    rect(
      optionX,
      optionY,
      layout.optionWidth,
      layout.optionHeight,
      12
    );

    drawMixedText(
      `${String.fromCharCode(65 + i)}. ${currentQuestion.options[i]}`,
      optionX,
      optionY,
      {
        size: layout.optionTextSize,
        color: optionTextColor,
        maxWidth: layout.optionWidth - 35,
        align: CENTER
      }
    );
  }
}

function getOptionAnimationOffset(optionIndex, currentQuestion) {
  if (!hasAnswered || answerAnimationStart === 0) {
    return {
      x: 0,
      y: 0
    };
  }

  const elapsed = millis() - answerAnimationStart;
  const duration = 1100;

  if (elapsed < 0 || elapsed > duration) {
    return {
      x: 0,
      y: 0
    };
  }

  const progress = elapsed / duration;
  const fade = 1 - progress;
  const wave = sin(progress * PI * 5);

  const isCorrect =
    optionIndex === currentQuestion.answer;

  const isSelectedWrong =
    optionIndex === selectedOptionIndex &&
    selectedOptionIndex !== currentQuestion.answer;

  if (isCorrect) {
    return {
      x: 0,
      y: wave * 8 * fade
    };
  }

  if (isSelectedWrong) {
    return {
      x: wave * 8 * fade,
      y: 0
    };
  }

  return {
    x: 0,
    y: 0
  };
}

function drawFeedback(layout, currentQuestion) {
  const isCorrect =
    selectedOptionIndex === currentQuestion.answer;

  const message = isCorrect
    ? "答對了！"
    : `答錯了，正確答案是 ${String.fromCharCode(
        65 + currentQuestion.answer
      )}。`;

  drawMixedText(
    message,
    width / 2,
    layout.feedbackY,
    {
      size: layout.feedbackSize,
      color: isCorrect
        ? colors.correctText
        : colors.wrongText,
      align: CENTER
    }
  );
}

function drawNextButton(layout) {
  const isLastQuestion =
    currentQuestionIndex === quizQuestions.length - 1;

  const buttonText = isLastQuestion
    ? "查看結果"
    : "下一題";

  const isHovered = pointInside(
    mouseX,
    mouseY,
    layout.nextButtonX,
    layout.nextButtonY,
    layout.nextButtonWidth,
    layout.nextButtonHeight
  );

  fill(isHovered ? colors.primaryHover : colors.primary);
  noStroke();

  rect(
    layout.nextButtonX,
    layout.nextButtonY,
    layout.nextButtonWidth,
    layout.nextButtonHeight,
    12
  );

  drawMixedText(
    buttonText,
    layout.nextButtonX,
    layout.nextButtonY,
    {
      size: layout.buttonTextSize,
      color: colors.white,
      align: CENTER
    }
  );
}

function drawResultScreen() {
  const layout = getResultLayout();

  const percentage = Math.round(
    correctCount / quizQuestions.length * 100
  );

  fill(colors.card);
  stroke(colors.border);
  strokeWeight(1);

  rect(
    width / 2,
    height / 2,
    layout.cardWidth,
    layout.cardHeight,
    20
  );

  drawMixedText(
    "測驗完成！",
    width / 2,
    layout.titleY,
    {
      size: layout.titleSize,
      color: colors.text,
      align: CENTER
    }
  );

  drawMixedText(
    `答對 ${correctCount}／${quizQuestions.length} 題`,
    width / 2,
    layout.scoreY,
    {
      size: layout.scoreSize,
      color: colors.primary,
      align: CENTER
    }
  );

  drawMixedText(
    `正確率 ${percentage}%`,
    width / 2,
    layout.percentageY,
    {
      size: layout.percentageSize,
      color: colors.secondaryText,
      align: CENTER
    }
  );

  const isHovered = pointInside(
    mouseX,
    mouseY,
    layout.restartButtonX,
    layout.restartButtonY,
    layout.restartButtonWidth,
    layout.restartButtonHeight
  );

  fill(isHovered ? colors.primaryHover : colors.primary);
  noStroke();

  rect(
    layout.restartButtonX,
    layout.restartButtonY,
    layout.restartButtonWidth,
    layout.restartButtonHeight,
    12
  );

  drawMixedText(
    "重新開始",
    layout.restartButtonX,
    layout.restartButtonY,
    {
      size: layout.buttonTextSize,
      color: colors.white,
      align: CENTER
    }
  );
}

function getQuizLayout() {
  const isSmallScreen = width < 600;
  const contentWidth = min(width - 32, 720);
  const optionWidth = min(width - 32, 620);

  const titleSize = isSmallScreen ? 25 : 34;
  const progressSize = isSmallScreen ? 15 : 18;
  const questionSize = isSmallScreen ? 19 : 25;
  const optionTextSize = isSmallScreen ? 17 : 21;

  const optionHeight = isSmallScreen ? 58 : 64;
  const optionGap = isSmallScreen ? 10 : 14;
  const questionCardHeight = isSmallScreen ? 125 : 145;

  const titleY = isSmallScreen ? 38 : 48;
  const progressY = isSmallScreen ? 78 : 91;
  const progressBarY = isSmallScreen ? 103 : 118;
  const questionCardY = isSmallScreen ? 178 : 195;

  const optionStartY =
    questionCardY +
    questionCardHeight / 2 +
    48;

  const nextButtonY = min(
    height - 42,
    optionStartY +
      4 * (optionHeight + optionGap) +
      70
  );

  return {
    contentWidth,
    optionWidth,
    titleY,
    progressY,
    progressBarY,
    questionCardY,
    questionCardHeight,
    optionStartY,
    optionHeight,
    optionGap,
    titleSize,
    progressSize,
    questionSize,
    optionTextSize,
    feedbackY: nextButtonY - 66,
    feedbackSize: isSmallScreen ? 18 : 22,
    buttonTextSize: isSmallScreen ? 17 : 20,
    nextButtonX: width / 2,
    nextButtonY,
    nextButtonWidth: isSmallScreen ? 150 : 180,
    nextButtonHeight: isSmallScreen ? 46 : 52
  };
}

function getResultLayout() {
  const isSmallScreen = width < 600;

  return {
    cardWidth: min(width - 32, 560),
    cardHeight: min(height - 40, 440),
    titleY: height / 2 - 130,
    scoreY: height / 2 - 35,
    percentageY: height / 2 + 35,
    titleSize: isSmallScreen ? 29 : 38,
    scoreSize: isSmallScreen ? 25 : 32,
    percentageSize: isSmallScreen ? 20 : 24,
    buttonTextSize: isSmallScreen ? 17 : 20,
    restartButtonX: width / 2,
    restartButtonY: height / 2 + 125,
    restartButtonWidth: isSmallScreen ? 150 : 190,
    restartButtonHeight: isSmallScreen ? 46 : 54
  };
}

function mousePressed() {
  if (millis() < ignoreMouseUntil) {
    return false;
  }

  handlePointer(mouseX, mouseY);
  return false;
}

function touchStarted() {
  if (touches.length > 0) {
    handlePointer(touches[0].x, touches[0].y);
    ignoreMouseUntil = millis() + 500;
  }

  return false;
}

function mouseMoved() {
  hoveredOptionIndex = -1;

  if (quizFinished || hasAnswered) {
    return;
  }

  const layout = getQuizLayout();

  for (let i = 0; i < 4; i++) {
    const optionY =
      layout.optionStartY +
      i * (layout.optionHeight + layout.optionGap);

    if (
      pointInside(
        mouseX,
        mouseY,
        width / 2,
        optionY,
        layout.optionWidth,
        layout.optionHeight
      )
    ) {
      hoveredOptionIndex = i;
      break;
    }
  }
}

function handlePointer(pointerX, pointerY) {
  if (quizFinished) {
    const layout = getResultLayout();

    if (
      pointInside(
        pointerX,
        pointerY,
        layout.restartButtonX,
        layout.restartButtonY,
        layout.restartButtonWidth,
        layout.restartButtonHeight
      )
    ) {
      resetQuiz();
    }

    return;
  }

  const layout = getQuizLayout();

  if (!hasAnswered) {
    for (let i = 0; i < 4; i++) {
      const optionY =
        layout.optionStartY +
        i * (layout.optionHeight + layout.optionGap);

      if (
        pointInside(
          pointerX,
          pointerY,
          width / 2,
          optionY,
          layout.optionWidth,
          layout.optionHeight
        )
      ) {
        selectedOptionIndex = i;
        hasAnswered = true;
        answerAnimationStart = millis();

        if (
          selectedOptionIndex ===
          quizQuestions[currentQuestionIndex].answer
        ) {
          correctCount++;
        }

        return;
      }
    }
  }

  if (hasAnswered) {
    if (
      pointInside(
        pointerX,
        pointerY,
        layout.nextButtonX,
        layout.nextButtonY,
        layout.nextButtonWidth,
        layout.nextButtonHeight
      )
    ) {
      goToNextQuestion();
    }
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    selectedOptionIndex = -1;
    hasAnswered = false;
    hoveredOptionIndex = -1;
    answerAnimationStart = 0;
  } else {
    quizFinished = true;
  }
}

function resetQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  selectedOptionIndex = -1;
  hasAnswered = false;
  quizFinished = false;
  hoveredOptionIndex = -1;
  answerAnimationStart = 0;
}

function pointInside(
  pointX,
  pointY,
  centerX,
  centerY,
  boxWidth,
  boxHeight
) {
  return (
    pointX >= centerX - boxWidth / 2 &&
    pointX <= centerX + boxWidth / 2 &&
    pointY >= centerY - boxHeight / 2 &&
    pointY <= centerY + boxHeight / 2
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function isChineseCharacter(character) {
  return /[\u3400-\u4dbf\u4e00-\u9fff]/.test(character);
}

function splitMixedSegments(content) {
  const segments = [];
  let currentContent = "";
  let currentFont = "";

  for (const character of String(content)) {
    const nextFont = isChineseCharacter(character)
      ? chineseFont
      : englishFont;

    if (
      currentContent !== "" &&
      currentFont !== nextFont
    ) {
      segments.push({
        content: currentContent,
        font: currentFont
      });

      currentContent = "";
    }

    currentContent += character;
    currentFont = nextFont;
  }

  if (currentContent !== "") {
    segments.push({
      content: currentContent,
      font: currentFont
    });
  }

  return segments;
}

function measureMixedText(content, size) {
  textSize(size);

  let totalWidth = 0;
  const segments = splitMixedSegments(content);

  for (const segment of segments) {
    textFont(segment.font);
    totalWidth += textWidth(segment.content);
  }

  return totalWidth;
}

function wrapMixedText(content, maxWidth, size) {
  const lines = [];
  const paragraphs = String(content).split("\n");

  for (const paragraph of paragraphs) {
    let currentLine = "";

    for (const character of paragraph) {
      const testLine = currentLine + character;

      if (
        currentLine !== "" &&
        measureMixedText(testLine, size) > maxWidth
      ) {
        lines.push(currentLine);
        currentLine = character;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine !== "") {
      lines.push(currentLine);
    }
  }

  return lines.length > 0 ? lines : [""];
}

function drawMixedText(content, x, y, settings = {}) {
  const size = settings.size || 24;
  const color = settings.color || colors.text;
  const alignMode = settings.align || CENTER;
  const lineHeight = settings.lineHeight || size * 1.5;
  const maxWidth = settings.maxWidth || Infinity;

  const lines =
    maxWidth === Infinity
      ? String(content).split("\n")
      : wrapMixedText(content, maxWidth, size);

  fill(color);
  noStroke();
  textSize(size);
  textAlign(LEFT, CENTER);

  const totalHeight =
    (lines.length - 1) * lineHeight;

  const firstLineY =
    y - totalHeight / 2;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineWidth = measureMixedText(line, size);

    let startX = x - lineWidth / 2;

    if (alignMode === LEFT) {
      startX = x;
    } else if (alignMode === RIGHT) {
      startX = x - lineWidth;
    }

    const segments = splitMixedSegments(line);
    let currentX = startX;

    for (const segment of segments) {
      textFont(segment.font);

      window.text(
        segment.content,
        currentX,
        firstLineY + lineIndex * lineHeight
      );

      currentX += textWidth(segment.content);
    }
  }

  textAlign(CENTER, CENTER);
}