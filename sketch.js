// ============================================================================
// 唯一需要設定的 Google Sheets 題庫網址
// 請先在 Google Sheets 使用「檔案 > 共用 > 發布到網路」，選擇 CSV，
// 然後只替換「你的試算表ID」與 gid；不要改動其他程式碼。
// CSV 欄位固定為：question,optionA,optionB,optionC,optionD,answer
// ============================================================================
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/你的試算表ID/export?format=csv&gid=0";

const REQUIRED_COLUMNS = [
  `question`,
  `optionA`,
  `optionB`,
  `optionC`,
  `optionD`,
  `answer`
];

const CHINESE_FONT = `Noto Serif TC`;
const ENGLISH_FONT = `Playfair Display`;
const OPTION_COUNT = 4;
const QUESTIONS_PER_QUIZ = 5;
const PLACEHOLDER_URL = `https://docs.google.com/spreadsheets/d/你的試算表ID/export?format=csv&gid=0`;

let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let selectedOptionIndex = -1;
let hasAnswered = false;
let quizFinished = false;
let hoveredOptionIndex = -1;
let answerAnimationStart = 0;
let ignoreMouseUntil = 0;

let appState = `loading`;
let statusTitle = `正在讀取題庫`;
let statusMessage = `正在從 Google Sheets 讀取公開發布的 CSV……`;
let statusDetails = ``;

const colors = {
  background: `#f8f5f0`,
  card: `#fffdf9`,
  text: `#332c2c`,
  secondaryText: `#756b66`,
  primary: `#9b6b58`,
  primaryHover: `#815343`,
  correct: `#dcebd8`,
  correctText: `#3d6840`,
  wrong: `#f4dddd`,
  wrongText: `#9a4848`,
  border: `#d6c8bd`,
  white: `#ffffff`,
  error: `#a94442`,
  muted: `#eee8e2`
};

function preload() {
  if (!isGoogleSheetUrlConfigured()) {
    appState = `error`;
    statusTitle = https://docs.google.com/spreadsheets/d/e/2PACX-1vR8NBqIXryeWfGZYBq8OPr2tRxSndyV_TJ5o9-1ehdVy5UB84QhKR2wJSY-yfURGXYGIiXLAbgJ48j9/pub?gid=1525533229&single=true&output=csv`;
    statusMessage = `請先在 sketch.js 最上方替換試算表 ID 與 gid。`;
    statusDetails = `Google 試算表也必須先使用「檔案 > 共用 > 發布到網路」，並選擇 CSV 格式。`;
    return;
  }

  loadTable(
    GOOGLE_SHEET_CSV_URL,
    "csv",
    "header",
    handleTableLoaded,
    handleTableLoadFailed
  );
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.touchAction = `none`;
  canvas.elt.setAttribute(`aria-label`, `Google Sheets 題庫測驗畫布`);

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  smooth();
}

function draw() {
  background(colors.background);

  if (appState === `loading`) {
    drawLoadingScreen();
    return;
  }

  if (appState === `error`) {
    drawErrorScreen();
    return;
  }

  if (quizFinished) {
    drawResultScreen();
    return;
  }

  drawQuestionScreen();
}

function isGoogleSheetUrlConfigured() {
  const url = String(GOOGLE_SHEET_CSV_URL).trim();
  return url !== `` && url !== PLACEHOLDER_URL && !url.includes(`你的試算表ID`);
}

function handleTableLoaded(table) {
  const columnResult = validateColumns(table);

  if (!columnResult.valid) {
    setErrorState(
      `CSV 欄位錯誤`,
      columnResult.message,
      `請確認第一列完全是：question,optionA,optionB,optionC,optionD,answer`
    );
    return;
  }

  const parsedResult = parseQuestionRows(table);

  if (!parsedResult.valid) {
    setErrorState(
      `CSV 題庫內容錯誤`,
      parsedResult.message,
      `每一列都需要完整題目、四個選項，以及 0、1、2 或 3 的 answer。`
    );
    return;
  }

  if (parsedResult.questions.length < QUESTIONS_PER_QUIZ) {
    setErrorState(
      `題目數量不足`,
      `目前只有 ${parsedResult.questions.length} 題，至少需要 ${QUESTIONS_PER_QUIZ} 題才能抽題。`,
      `請在 Google Sheets 增加題目後重新整理網頁。`
    );
    return;
  }

  allQuestions = parsedResult.questions;
  appState = `ready`;
  statusTitle = ``;
  statusMessage = ``;
  statusDetails = ``;
  startNewQuiz();
}

function handleTableLoadFailed(error) {
  console.error(`Google Sheets CSV 讀取失敗：`, error);
  setErrorState(
    `Google Sheets 題庫讀取失敗`,
    `無法讀取公開發布的 CSV。請確認試算表已發布到網路、網址中的 ID 與 gid 正確，且網路可以連線。`,
    `程式使用 p5.js loadTable() 直接讀取 Google Sheets 公開 CSV，沒有使用 fetch。`
  );
}

function setErrorState(title, message, details) {
  appState = `error`;
  statusTitle = title;
  statusMessage = message;
  statusDetails = details;
}

function validateColumns(table) {
  const actualColumns = Array.isArray(table.columns)
    ? table.columns.map((column) => String(column).trim().replace(/^\uFEFF/, ``))
    : [];

  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !actualColumns.includes(column)
  );
  const extraColumns = actualColumns.filter(
    (column) => !REQUIRED_COLUMNS.includes(column)
  );

  if (missingColumns.length > 0) {
    return {
      valid: false,
      message: `缺少欄位：${missingColumns.join(`、`)}。`
    };
  }

  if (extraColumns.length > 0) {
    return {
      valid: false,
      message: `發現非固定欄位：${extraColumns.join(`、`)}。`
    };
  }

  if (actualColumns.length !== REQUIRED_COLUMNS.length) {
    return {
      valid: false,
      message: `CSV 必須剛好包含 ${REQUIRED_COLUMNS.length} 個固定欄位。`
    };
  }

  return { valid: true, message: `` };
}

function parseQuestionRows(table) {
  const questions = [];
  const invalidRows = [];

  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    const row = table.rows[rowIndex];
    const question = getCellValue(row, `question`);
    const options = [
      getCellValue(row, `optionA`),
      getCellValue(row, `optionB`),
      getCellValue(row, `optionC`),
      getCellValue(row, `optionD`)
    ];
    const answerValue = getCellValue(row, `answer`);
    const answer = parseAnswer(answerValue);

    const rowIsValid = question !== `` &&
      options.every((option) => option !== ``) &&
      Number.isInteger(answer) &&
      answer >= 0 &&
      answer < OPTION_COUNT;

    if (!rowIsValid) {
      invalidRows.push(rowIndex + 2);
      continue;
    }

    questions.push({
      question,
      options,
      answer
    });
  }

  if (invalidRows.length > 0) {
    const preview = invalidRows.slice(0, 8).join(`、`);
    const suffix = invalidRows.length > 8 ? `……` : ``;
    return {
      valid: false,
      questions,
      message: `第 ${preview}${suffix} 列資料不完整或 answer 無效。`
    };
  }

  return {
    valid: true,
    questions,
    message: ``
  };
}

function getCellValue(row, columnName) {
  return String(row.getString(columnName) ?? ``).trim();
}

function parseAnswer(value) {
  const normalized = String(value).trim();

  if (/^[0-3]$/.test(normalized)) {
    return Number(normalized);
  }

  const letterAnswers = { A: 0, B: 1, C: 2, D: 3 };
  const upper = normalized.toUpperCase();
  return Object.prototype.hasOwnProperty.call(letterAnswers, upper)
    ? letterAnswers[upper]
    : -1;
}

function startNewQuiz() {
  quizQuestions = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_QUIZ);
  currentQuestionIndex = 0;
  correctCount = 0;
  selectedOptionIndex = -1;
  hasAnswered = false;
  quizFinished = false;
  hoveredOptionIndex = -1;
  answerAnimationStart = 0;
}

function shuffleArray(items) {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = floor(random(index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function drawLoadingScreen() {
  const layout = getMessageLayout();
  drawPanel(layout.panelX, layout.panelY, layout.panelWidth, layout.panelHeight);
  drawMixedText(`正在讀取 Google Sheets 題庫……`, width / 2, height / 2, {
    size: layout.bodySize,
    color: colors.text,
    maxWidth: layout.panelWidth - 48,
    align: CENTER
  });
}

function drawErrorScreen() {
  const layout = getMessageLayout(true);
  drawPanel(layout.panelX, layout.panelY, layout.panelWidth, layout.panelHeight);

  drawMixedText(statusTitle, width / 2, layout.titleY, {
    size: layout.titleSize,
    color: colors.error,
    maxWidth: layout.panelWidth - 48,
    lineHeight: layout.titleSize * 1.45,
    align: CENTER
  });

  drawMixedText(statusMessage, width / 2, layout.messageY, {
    size: layout.bodySize,
    color: colors.text,
    maxWidth: layout.panelWidth - 48,
    lineHeight: layout.bodySize * 1.6,
    align: CENTER
  });

  drawMixedText(statusDetails, width / 2, layout.detailsY, {
    size: layout.detailsSize,
    color: colors.secondaryText,
    maxWidth: layout.panelWidth - 48,
    lineHeight: layout.detailsSize * 1.6,
    align: CENTER
  });
}

function drawPanel(panelX, panelY, panelWidth, panelHeight) {
  fill(colors.card);
  stroke(colors.border);
  strokeWeight(1);
  rect(panelX, panelY, panelWidth, panelHeight, 20);
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
  drawMixedText(`Google Sheets 選擇題測驗`, width / 2, layout.titleY, {
    size: layout.titleSize,
    color: colors.text,
    align: CENTER
  });

  drawMixedText(`第 ${currentQuestionIndex + 1} 題／共 ${QUESTIONS_PER_QUIZ} 題`, width / 2, layout.progressY, {
    size: layout.progressSize,
    color: colors.secondaryText,
    align: CENTER
  });

  const progressRatio = (currentQuestionIndex + 1) / QUESTIONS_PER_QUIZ;
  fill(colors.muted);
  noStroke();
  rect(width / 2, layout.progressBarY, layout.contentWidth, 8, 5);

  fill(colors.primary);
  rect(
    width / 2 - layout.contentWidth / 2 + layout.contentWidth * progressRatio / 2,
    layout.progressBarY,
    layout.contentWidth * progressRatio,
    8,
    5
  );
}

function drawQuestionCard(layout, currentQuestion) {
  drawPanel(width / 2, layout.questionCardY, layout.contentWidth, layout.questionCardHeight);
  drawMixedText(currentQuestion.question, width / 2, layout.questionCardY, {
    size: layout.questionSize,
    color: colors.text,
    maxWidth: layout.contentWidth - layout.cardPadding * 2,
    lineHeight: layout.questionLineHeight,
    align: CENTER
  });
}

function drawOptions(layout, currentQuestion) {
  for (let optionIndex = 0; optionIndex < OPTION_COUNT; optionIndex += 1) {
    const baseY = layout.optionStartY + optionIndex * (layout.optionHeight + layout.optionGap);
    const offset = getOptionAnimationOffset(optionIndex, currentQuestion);
    const optionX = width / 2 + offset.x;
    const optionY = baseY + offset.y;
    const isCorrect = currentQuestion.answer === optionIndex;
    const isSelected = selectedOptionIndex === optionIndex;

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
    } else if (!hasAnswered && hoveredOptionIndex === optionIndex) {
      optionColor = `#f2e8e1`;
      borderColor = colors.primary;
    }

    fill(optionColor);
    stroke(borderColor);
    strokeWeight(2);
    rect(optionX, optionY, layout.optionWidth, layout.optionHeight, 12);

    drawMixedText(`${String.fromCharCode(65 + optionIndex)}. ${currentQuestion.options[optionIndex]}`, optionX, optionY, {
      size: layout.optionTextSize,
      color: optionTextColor,
      maxWidth: layout.optionWidth - 36,
      lineHeight: layout.optionTextLineHeight,
      align: CENTER
    });
  }
}

function getOptionAnimationOffset(optionIndex, currentQuestion) {
  if (!hasAnswered || answerAnimationStart === 0) {
    return { x: 0, y: 0 };
  }

  const elapsed = millis() - answerAnimationStart;
  const duration = 1000;

  if (elapsed < 0 || elapsed > duration) {
    return { x: 0, y: 0 };
  }

  const progress = elapsed / duration;
  const fade = 1 - progress;
  const wave = sin(progress * PI * 6);

  if (optionIndex === currentQuestion.answer) {
    return { x: 0, y: wave * 8 * fade };
  }

  if (optionIndex === selectedOptionIndex) {
    return { x: wave * 8 * fade, y: 0 };
  }

  return { x: 0, y: 0 };
}

function drawFeedback(layout, currentQuestion) {
  const isCorrect = selectedOptionIndex === currentQuestion.answer;
  const correctLetter = String.fromCharCode(65 + currentQuestion.answer);
  const message = isCorrect ? `答對了！` : `答錯了，正確答案是 ${correctLetter}。`;

  drawMixedText(message, width / 2, layout.feedbackY, {
    size: layout.feedbackSize,
    color: isCorrect ? colors.correctText : colors.wrongText,
    maxWidth: layout.contentWidth,
    align: CENTER
  });
}

function drawNextButton(layout) {
  const isLastQuestion = currentQuestionIndex === QUESTIONS_PER_QUIZ - 1;
  const buttonText = isLastQuestion ? `查看結果` : `下一題`;
  const isHovered = pointInside(mouseX, mouseY, layout.nextButtonX, layout.nextButtonY, layout.nextButtonWidth, layout.nextButtonHeight);

  fill(isHovered ? colors.primaryHover : colors.primary);
  noStroke();
  rect(layout.nextButtonX, layout.nextButtonY, layout.nextButtonWidth, layout.nextButtonHeight, 12);

  drawMixedText(buttonText, layout.nextButtonX, layout.nextButtonY, {
    size: layout.buttonTextSize,
    color: colors.white,
    align: CENTER
  });
}

function drawResultScreen() {
  const layout = getResultLayout();
  const percentage = Math.round((correctCount / QUESTIONS_PER_QUIZ) * 100);

  drawPanel(width / 2, height / 2, layout.cardWidth, layout.cardHeight);

  drawMixedText(`測驗完成！`, width / 2, layout.titleY, {
    size: layout.titleSize,
    color: colors.text,
    align: CENTER
  });

  drawMixedText(`答對 ${correctCount}／${QUESTIONS_PER_QUIZ} 題`, width / 2, layout.scoreY, {
    size: layout.scoreSize,
    color: colors.primary,
    align: CENTER
  });

  drawMixedText(`正確率 ${percentage}%`, width / 2, layout.percentageY, {
    size: layout.percentageSize,
    color: colors.secondaryText,
    align: CENTER
  });

  const isHovered = pointInside(mouseX, mouseY, layout.restartButtonX, layout.restartButtonY, layout.restartButtonWidth, layout.restartButtonHeight);
  fill(isHovered ? colors.primaryHover : colors.primary);
  noStroke();
  rect(layout.restartButtonX, layout.restartButtonY, layout.restartButtonWidth, layout.restartButtonHeight, 12);

  drawMixedText(`重新抽題`, layout.restartButtonX, layout.restartButtonY, {
    size: layout.buttonTextSize,
    color: colors.white,
    align: CENTER
  });
}

function getQuizLayout() {
  const isSmallScreen = width < 600;
  const contentWidth = min(width - 32, 720);
  const optionWidth = min(width - 32, 640);
  const optionHeight = isSmallScreen ? 56 : 64;
  const optionGap = isSmallScreen ? 9 : 13;
  const questionCardHeight = isSmallScreen ? 128 : 148;
  const questionCardY = isSmallScreen ? 178 : 196;
  const optionStartY = questionCardY + questionCardHeight / 2 + 44;
  const optionBlockHeight = OPTION_COUNT * optionHeight + (OPTION_COUNT - 1) * optionGap;
  const buttonY = min(height - (isSmallScreen ? 34 : 42), optionStartY + optionBlockHeight + (isSmallScreen ? 100 : 110));

  return {
    contentWidth,
    optionWidth,
    optionHeight,
    optionGap,
    questionCardHeight,
    questionCardY,
    optionStartY,
    titleY: isSmallScreen ? 34 : 44,
    progressY: isSmallScreen ? 70 : 84,
    progressBarY: isSmallScreen ? 96 : 111,
    titleSize: isSmallScreen ? 23 : 32,
    progressSize: isSmallScreen ? 14 : 17,
    questionSize: isSmallScreen ? 18 : 24,
    questionLineHeight: isSmallScreen ? 28 : 36,
    optionTextSize: isSmallScreen ? 16 : 20,
    optionTextLineHeight: isSmallScreen ? 23 : 29,
    cardPadding: isSmallScreen ? 16 : 28,
    feedbackY: buttonY - (isSmallScreen ? 58 : 70),
    feedbackSize: isSmallScreen ? 17 : 21,
    buttonTextSize: isSmallScreen ? 16 : 19,
    nextButtonX: width / 2,
    nextButtonY: buttonY,
    nextButtonWidth: isSmallScreen ? 146 : 178,
    nextButtonHeight: isSmallScreen ? 44 : 50
  };
}

function getResultLayout() {
  const isSmallScreen = width < 600;
  return {
    cardWidth: min(width - 32, 560),
    cardHeight: min(height - 40, 430),
    titleY: height / 2 - 125,
    scoreY: height / 2 - 32,
    percentageY: height / 2 + 38,
    titleSize: isSmallScreen ? 28 : 37,
    scoreSize: isSmallScreen ? 24 : 31,
    percentageSize: isSmallScreen ? 19 : 23,
    buttonTextSize: isSmallScreen ? 16 : 19,
    restartButtonX: width / 2,
    restartButtonY: height / 2 + 125,
    restartButtonWidth: isSmallScreen ? 146 : 184,
    restartButtonHeight: isSmallScreen ? 44 : 50
  };
}

function getMessageLayout(isError = false) {
  const isSmallScreen = width < 600;
  const panelWidth = min(width - 32, 650);
  const panelHeight = isError ? min(height - 40, 470) : 230;
  const panelY = height / 2;

  return {
    panelX: width / 2,
    panelY,
    panelWidth,
    panelHeight,
    titleY: panelY - (isSmallScreen ? 145 : 150),
    messageY: panelY - (isSmallScreen ? 42 : 45),
    detailsY: panelY + (isSmallScreen ? 86 : 92),
    titleSize: isSmallScreen ? 25 : 34,
    bodySize: isSmallScreen ? 18 : 24,
    detailsSize: isSmallScreen ? 14 : 17
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

  if (appState !== `ready` || quizFinished || hasAnswered) {
    return;
  }

  const layout = getQuizLayout();
  for (let optionIndex = 0; optionIndex < OPTION_COUNT; optionIndex += 1) {
    const optionY = layout.optionStartY + optionIndex * (layout.optionHeight + layout.optionGap);
    if (pointInside(mouseX, mouseY, width / 2, optionY, layout.optionWidth, layout.optionHeight)) {
      hoveredOptionIndex = optionIndex;
      break;
    }
  }
}

function handlePointer(pointerX, pointerY) {
  if (appState !== `ready`) {
    return;
  }

  if (quizFinished) {
    const layout = getResultLayout();
    if (pointInside(pointerX, pointerY, layout.restartButtonX, layout.restartButtonY, layout.restartButtonWidth, layout.restartButtonHeight)) {
      startNewQuiz();
    }
    return;
  }

  const layout = getQuizLayout();

  if (!hasAnswered) {
    for (let optionIndex = 0; optionIndex < OPTION_COUNT; optionIndex += 1) {
      const optionY = layout.optionStartY + optionIndex * (layout.optionHeight + layout.optionGap);
      if (pointInside(pointerX, pointerY, width / 2, optionY, layout.optionWidth, layout.optionHeight)) {
        selectedOptionIndex = optionIndex;
        hasAnswered = true;
        answerAnimationStart = millis();

        if (selectedOptionIndex === quizQuestions[currentQuestionIndex].answer) {
          correctCount += 1;
        }
        return;
      }
    }
  }

  if (hasAnswered && pointInside(pointerX, pointerY, layout.nextButtonX, layout.nextButtonY, layout.nextButtonWidth, layout.nextButtonHeight)) {
    goToNextQuestion();
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < QUESTIONS_PER_QUIZ - 1) {
    currentQuestionIndex += 1;
    selectedOptionIndex = -1;
    hasAnswered = false;
    hoveredOptionIndex = -1;
    answerAnimationStart = 0;
  } else {
    quizFinished = true;
  }
}

function pointInside(pointX, pointY, centerX, centerY, boxWidth, boxHeight) {
  return pointX >= centerX - boxWidth / 2 &&
    pointX <= centerX + boxWidth / 2 &&
    pointY >= centerY - boxHeight / 2 &&
    pointY <= centerY + boxHeight / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function isChineseCharacter(character) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f]/.test(character);
}

function splitMixedSegments(content) {
  const segments = [];
  let currentContent = ``;
  let currentFont = ``;

  for (const character of String(content)) {
    const nextFont = isChineseCharacter(character) ? CHINESE_FONT : ENGLISH_FONT;

    if (currentContent !== `` && currentFont !== nextFont) {
      segments.push({ content: currentContent, font: currentFont });
      currentContent = ``;
    }

    currentContent += character;
    currentFont = nextFont;
  }

  if (currentContent !== ``) {
    segments.push({ content: currentContent, font: currentFont });
  }

  return segments;
}

function measureMixedText(content, size) {
  textSize(size);
  let totalWidth = 0;

  for (const segment of splitMixedSegments(content)) {
    textFont(segment.font);
    totalWidth += textWidth(segment.content);
  }

  return totalWidth;
}

function wrapMixedText(content, maxWidth, size) {
  const lines = [];
  const paragraphs = String(content).split(`\n`);

  for (const paragraph of paragraphs) {
    let currentLine = ``;

    for (const character of paragraph) {
      const testLine = currentLine + character;
      if (currentLine !== `` && measureMixedText(testLine, size) > maxWidth) {
        lines.push(currentLine);
        currentLine = character;
      } else {
        currentLine = testLine;
      }
    }

    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [``];
}

function drawMixedText(content, x, y, settings = {}) {
  const size = settings.size || 24;
  const color = settings.color || colors.text;
  const alignMode = settings.align || CENTER;
  const lineHeight = settings.lineHeight || size * 1.5;
  const maxWidth = settings.maxWidth || Infinity;
  const lines = maxWidth === Infinity
    ? String(content).split(`\n`)
    : wrapMixedText(content, maxWidth, size);

  fill(color);
  noStroke();
  textSize(size);
  textAlign(LEFT, CENTER);

  const totalHeight = (lines.length - 1) * lineHeight;
  const firstLineY = y - totalHeight / 2;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const lineWidth = measureMixedText(line, size);
    let startX = x - lineWidth / 2;

    if (alignMode === LEFT) {
      startX = x;
    } else if (alignMode === RIGHT) {
      startX = x - lineWidth;
    }

    let currentX = startX;
    for (const segment of splitMixedSegments(line)) {
      textFont(segment.font);
      window.text(segment.content, currentX, firstLineY + lineIndex * lineHeight);
      currentX += textWidth(segment.content);
    }
  }

  textAlign(CENTER, CENTER);
}
