// 最小完整 p5.js CSV 測驗
// question.csv 與本檔案必須放在同一個資料夾。

const CSV_FILE = "question.csv";
const QUIZ_SIZE = 5;
const OPTION_KEYS = ["optionA", "optionB", "optionC", "optionD"];

let questionTable = null;
let allQuestions = [];
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedIndex = -1;
let answered = false;
let finished = false;
let csvStatus = "loading";
let csvError = "";

const colors = {
  background: "#f6f2ec",
  card: "#fffdf9",
  text: "#2f2925",
  muted: "#756b63",
  border: "#d8cbc0",
  primary: "#93634f",
  primaryDark: "#744a3a",
  correct: "#dcebd9",
  correctText: "#35643b",
  wrong: "#f4dddd",
  wrongText: "#9b3e3e",
  white: "#ffffff"
};

function preload() {
  // 依需求使用 p5.js loadTable 讀取本機 CSV。
  questionTable = loadTable(
    "question.csv",
    "csv",
    "header",
    csvLoaded,
    csvFailed
  );
}

function csvLoaded(table) {
  allQuestions = [];

  for (const row of table.rows) {
    const question = row.getString("question").trim();
    const options = OPTION_KEYS.map(function (key) {
      return row.getString(key).trim();
    });
    const answer = Number(row.getString("answer").trim());

    if (
      question !== "" &&
      options.every(function (option) { return option !== ""; }) &&
      Number.isInteger(answer) &&
      answer >= 0 &&
      answer < options.length
    ) {
      allQuestions.push({
        question: question,
        options: options,
        answer: answer
      });
    }
  }

  if (allQuestions.length < QUIZ_SIZE) {
    csvStatus = "error";
    csvError = "CSV 題目不足 5 題，請檢查 question.csv 的內容。";
    return;
  }

  if (allQuestions.length !== 15) {
    csvStatus = "error";
    csvError = "CSV 目前讀到 " + allQuestions.length + " 題；本專案要求正好 15 題。";
    return;
  }

  csvStatus = "success";
  startQuiz();
}

function csvFailed(error) {
  csvStatus = "error";
  csvError = "讀取 question.csv 失敗。請確認檔案和 index.html、sketch.js 在同一個資料夾。";
  console.error("question.csv 載入失敗：", error);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("app");
  canvas.elt.setAttribute("aria-label", "CSV 選擇題測驗畫布");
  canvas.elt.style.touchAction = "manipulation";
  textFont("Noto Serif TC");
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noStroke();

  const bootStatus = document.getElementById("boot-status");
  if (bootStatus) {
    bootStatus.style.display = "none";
  }
}

function draw() {
  background(colors.background);

  if (csvStatus === "loading") {
    drawStatus("正在讀取 question.csv……", colors.text);
    return;
  }

  if (csvStatus === "error") {
    drawErrorScreen();
    return;
  }

  if (finished) {
    drawResultScreen();
  } else {
    drawQuizScreen();
  }
}

function startQuiz() {
  quizQuestions = shuffle(allQuestions).slice(0, QUIZ_SIZE);
  currentIndex = 0;
  score = 0;
  selectedIndex = -1;
  answered = false;
  finished = false;
}

function shuffle(items) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = floor(random(i + 1));
    const temporary = result[i];
    result[i] = result[j];
    result[j] = temporary;
  }
  return result;
}

function drawStatus(message, color) {
  textFont("Noto Serif TC");
  fill(color);
  textSize(width < 600 ? 20 : 28);
  text(message, width / 2, height / 2);
}

function drawErrorScreen() {
  const size = width < 600 ? 21 : 30;
  fill(colors.wrongText);
  textSize(size);
  text("題庫載入失敗", width / 2, height / 2 - 70);

  fill(colors.text);
  textSize(width < 600 ? 16 : 20);
  text(csvError, width / 2, height / 2, min(width - 40, 720));

  fill(colors.muted);
  textSize(width < 600 ? 14 : 17);
  text("請用 VS Code Live Server 重新開啟 index.html。", width / 2, height / 2 + 80);
}

function drawQuizScreen() {
  const layout = getLayout();
  const current = quizQuestions[currentIndex];

  drawHeader(layout);
  drawQuestion(layout, current);
  drawOptions(layout, current);

  if (answered) {
    const isCorrect = selectedIndex === current.answer;
    fill(isCorrect ? colors.correctText : colors.wrongText);
    textSize(layout.feedbackSize);
    text(isCorrect ? "答對了！" : "答錯了，請看正確答案。", width / 2, layout.feedbackY);
    drawButton(layout, layout.buttonY, currentIndex === QUIZ_SIZE - 1 ? "查看結果" : "下一題");
  }
}

function drawHeader(layout) {
  fill(colors.text);
  textSize(layout.titleSize);
  text("CSV 選擇題測驗", width / 2, layout.titleY);

  fill(colors.muted);
  textSize(layout.infoSize);
  text("第 " + (currentIndex + 1) + " 題／共 " + QUIZ_SIZE + " 題", width / 2, layout.infoY);

  fill("#e3d9d0");
  rect(width / 2, layout.progressY, layout.contentWidth, 8, 4);
  fill(colors.primary);
  rect(
    width / 2 - layout.contentWidth / 2 + layout.contentWidth * ((currentIndex + 1) / QUIZ_SIZE) / 2,
    layout.progressY,
    layout.contentWidth * ((currentIndex + 1) / QUIZ_SIZE),
    8,
    4
  );
}

function drawQuestion(layout, current) {
  fill(colors.card);
  stroke(colors.border);
  strokeWeight(1);
  rect(width / 2, layout.questionY, layout.contentWidth, layout.questionHeight, 14);
  noStroke();

  fill(colors.text);
  textSize(layout.questionSize);
  drawWrappedText(current.question, width / 2, layout.questionY, layout.contentWidth - 36, layout.questionLineHeight);
}

function drawOptions(layout, current) {
  for (let i = 0; i < current.options.length; i += 1) {
    const y = layout.optionStartY + i * (layout.optionHeight + layout.optionGap);
    const selected = selectedIndex === i;
    const correct = current.answer === i;

    let fillColor = colors.card;
    let borderColor = colors.border;
    let textColor = colors.text;

    if (answered && correct) {
      fillColor = colors.correct;
      borderColor = colors.correctText;
      textColor = colors.correctText;
    } else if (answered && selected) {
      fillColor = colors.wrong;
      borderColor = colors.wrongText;
      textColor = colors.wrongText;
    }

    fill(fillColor);
    stroke(borderColor);
    strokeWeight(2);
    rect(width / 2, y, layout.optionWidth, layout.optionHeight, 10);
    noStroke();

    fill(textColor);
    textSize(layout.optionSize);
    text(String.fromCharCode(65 + i) + ". " + current.options[i], width / 2, y, layout.optionWidth - 28, layout.optionHeight - 8);
  }
}

function drawButton(layout, y, label) {
  const inside = isInside(mouseX, mouseY, width / 2, y, layout.buttonWidth, layout.buttonHeight);
  fill(inside ? colors.primaryDark : colors.primary);
  rect(width / 2, y, layout.buttonWidth, layout.buttonHeight, 10);
  fill(colors.white);
  textSize(layout.buttonSize);
  text(label, width / 2, y);
}

function drawResultScreen() {
  const layout = getResultLayout();
  fill(colors.card);
  stroke(colors.border);
  strokeWeight(1);
  rect(width / 2, height / 2, layout.cardWidth, layout.cardHeight, 16);
  noStroke();

  fill(colors.text);
  textSize(layout.titleSize);
  text("測驗完成！", width / 2, height / 2 - 105);

  fill(colors.primary);
  textSize(layout.scoreSize);
  text("答對 " + score + "／" + QUIZ_SIZE + " 題", width / 2, height / 2 - 25);

  fill(colors.muted);
  textSize(layout.rateSize);
  text("正確率 " + round(score / QUIZ_SIZE * 100) + "%", width / 2, height / 2 + 35);

  drawButton(layout, height / 2 + 115, "重新抽取 5 題");
}

function getLayout() {
  const small = width < 600;
  const contentWidth = min(width - 28, 720);
  const optionWidth = min(width - 28, 620);
  const optionHeight = small ? 52 : 58;
  const optionGap = small ? 9 : 12;
  const questionY = small ? 155 : 180;
  const questionHeight = small ? 96 : 112;
  const optionStartY = questionY + questionHeight / 2 + 42;
  const lastOptionY = optionStartY + 3 * (optionHeight + optionGap);
  const buttonY = min(height - 38, lastOptionY + optionHeight / 2 + 70);

  return {
    contentWidth: contentWidth,
    optionWidth: optionWidth,
    questionY: questionY,
    questionHeight: questionHeight,
    optionStartY: optionStartY,
    optionHeight: optionHeight,
    optionGap: optionGap,
    titleY: small ? 32 : 45,
    infoY: small ? 64 : 82,
    progressY: small ? 88 : 105,
    titleSize: small ? 24 : 32,
    infoSize: small ? 14 : 17,
    questionSize: small ? 17 : 22,
    questionLineHeight: small ? 25 : 31,
    optionSize: small ? 15 : 18,
    feedbackY: buttonY - 40,
    feedbackSize: small ? 16 : 19,
    buttonY: buttonY,
    buttonWidth: small ? 160 : 190,
    buttonHeight: small ? 42 : 48,
    buttonSize: small ? 15 : 18
  };
}

function getResultLayout() {
  const small = width < 600;
  return {
    cardWidth: min(width - 28, 560),
    cardHeight: min(height - 32, 380),
    titleSize: small ? 28 : 38,
    scoreSize: small ? 24 : 31,
    rateSize: small ? 19 : 23,
    buttonWidth: small ? 160 : 190,
    buttonHeight: small ? 42 : 48,
    buttonSize: small ? 15 : 18
  };
}

function drawWrappedText(message, x, y, maxWidth, lineHeight) {
  const words = Array.from(String(message));
  const lines = [];
  let line = "";

  for (const character of words) {
    const candidate = line + character;
    if (line !== "" && textWidth(candidate) > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line = candidate;
    }
  }
  if (line !== "") {
    lines.push(line);
  }

  const firstY = y - ((lines.length - 1) * lineHeight) / 2;
  for (let i = 0; i < lines.length; i += 1) {
    text(lines[i], x, firstY + i * lineHeight);
  }
}

function mousePressed() {
  handlePointer(mouseX, mouseY);
  return false;
}

function touchStarted() {
  if (touches.length > 0) {
    handlePointer(touches[0].x, touches[0].y);
  }
  return false;
}

function handlePointer(x, y) {
  if (csvStatus !== "success") {
    return;
  }

  if (finished) {
    const layout = getResultLayout();
    if (isInside(x, y, width / 2, height / 2 + 115, layout.buttonWidth, layout.buttonHeight)) {
      startQuiz();
    }
    return;
  }

  const layout = getLayout();

  if (!answered) {
    for (let i = 0; i < OPTION_KEYS.length; i += 1) {
      const optionY = layout.optionStartY + i * (layout.optionHeight + layout.optionGap);
      if (isInside(x, y, width / 2, optionY, layout.optionWidth, layout.optionHeight)) {
        selectedIndex = i;
        answered = true;
        if (selectedIndex === quizQuestions[currentIndex].answer) {
          score += 1;
        }
        return;
      }
    }
    return;
  }

  if (isInside(x, y, width / 2, layout.buttonY, layout.buttonWidth, layout.buttonHeight)) {
    if (currentIndex < QUIZ_SIZE - 1) {
      currentIndex += 1;
      selectedIndex = -1;
      answered = false;
    } else {
      finished = true;
    }
  }
}

function isInside(x, y, centerX, centerY, boxWidth, boxHeight) {
  return (
    x >= centerX - boxWidth / 2 &&
    x <= centerX + boxWidth / 2 &&
    y >= centerY - boxHeight / 2 &&
    y <= centerY + boxHeight / 2
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
