---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：415730802　　姓名：邱安妤

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習1截圖]![image]
### 答對的畫面
![20261008 1](https://hackmd.io/_uploads/rJKXqhNoMe.gif)

### 答錯的畫面(https://hackmd.io/_uploads/HkWHD34sMe.png)

### 第一次問 AI

```tex!
使用p5.js撰寫一個選擇題網頁測驗系統 我已經產生一個p5.js專案 請把程式碼撰寫到sketch.js檔案內 每條指令都需要加上中文註解 測驗系統題目設定為五題 測驗題目的內容為程式設計p5.js簡易指令練習測驗 系統採用全螢幕畫布 使用者答錯時 系統會在正確答案選項上加上 bde0fe 背景顏色 該選項要上下跳動 答錯的選項採用ffc8dd 背景顏色 選項左右移動 選擇題選項共有四個選項 當五題結束以後 需要顯示答對的題數 每次顯示一個題目 需要有下一題的按鈕
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
// 宣告五題測驗資料，每一題都有題目、四個選項與正確答案索引
const quizQuestions = [
  {
    // 設定第一題題目
    question: "在 p5.js 中，哪一個指令可以建立畫布？",

    // 設定第一題的四個選項
    options: [
      "createCanvas()",
      "makeCanvas()",
      "canvasCreate()",
      "setCanvas()"
    ],

    // 設定正確答案為第一個選項
    answer: 0
  },

  {
    // 設定第二題題目
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",

    // 設定第二題的四個選項
    options: [
      "start()",
      "setup()",
      "begin()",
      "init()"
    ],

    // 設定正確答案為第二個選項
    answer: 1
  },

  {
    // 設定第三題題目
    question: "在 p5.js 中，哪一個函式會不斷重複執行？",

    // 設定第三題的四個選項
    options: [
      "repeat()",
      "looping()",
      "draw()",
      "run()"
    ],

    // 設定正確答案為第三個選項
    answer: 2
  },

  {
    // 設定第四題題目
    question: "下列哪一個指令可以設定背景顏色？",

    // 設定第四題的四個選項
    options: [
      "background()",
      "colorBackground()",
      "setBackground()",
      "bgColor()"
    ],

    // 設定正確答案為第一個選項
    answer: 0
  },

  {
    // 設定第五題題目
    question: "下列哪一個指令可以繪製圓形？",

    // 設定第五題的四個選項
    options: [
      "circle()",
      "round()",
      "drawCircle()",
      "ellipseCircle()"
    ],

    // 設定正確答案為第一個選項
    answer: 0
  }
];

// 宣告目前顯示的題目索引
let currentQuestionIndex = 0;

// 宣告使用者答對的題數
let correctCount = 0;

// 宣告使用者是否已經回答目前題目
let hasAnswered = false;

// 宣告使用者選擇的選項索引
let selectedOptionIndex = -1;

// 宣告測驗是否已經結束
let quizFinished = false;

// 宣告選項按鈕的起始垂直位置
let optionStartY = 0;

// 宣告選項按鈕的寬度
let optionWidth = 0;

// 宣告選項按鈕的高度
let optionHeight = 0;

// 宣告選項按鈕之間的垂直間距
let optionGap = 0;

// 宣告下一題按鈕的位置與大小
let nextButtonX = 0;
let nextButtonY = 0;
let nextButtonWidth = 0;
let nextButtonHeight = 0;

// 宣告重新開始按鈕的位置與大小
let restartButtonX = 0;
let restartButtonY = 0;
let restartButtonWidth = 0;
let restartButtonHeight = 0;

// 宣告畫布的主要背景顏色
const pageBackgroundColor = "#f8f9fa";

// 宣告主要文字顏色
const mainTextColor = "#343a40";

// 宣告按鈕的主要顏色
const buttonColor = "#a2d2ff";

// 宣告按鈕滑過時的顏色
const buttonHoverColor = "#8ecae6";

// 宣告正確答案的背景顏色
const correctAnswerColor = "#bde0fe";

// 宣告錯誤答案的背景顏色
const wrongAnswerColor = "#ffc8dd";

// 宣告一般選項的背景顏色
const normalOptionColor = "#ffffff";

// 宣告選項邊框的顏色
const optionBorderColor = "#adb5bd";

// p5.js 程式開始時執行一次的函式
function setup() {
  // 建立符合視窗寬度與高度的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字使用置中對齊
  textAlign(CENTER, CENTER);

  // 設定矩形繪製模式為由中心點開始
  rectMode(CENTER);

  // 設定文字使用平滑顯示
  textFont("sans-serif");

  // 設定初始介面尺寸
  updateLayout();
}

// p5.js 每一幀都會執行的函式
function draw() {
  // 設定整個畫布的背景顏色
  background(pageBackgroundColor);

  // 判斷測驗是否已經結束
  if (quizFinished) {
    // 顯示測驗結果畫面
    drawResultScreen();
  } else {
    // 顯示題目畫面
    drawQuizScreen();
  }
}

// 設定題目畫面
function drawQuizScreen() {
  // 取得目前題目的資料
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // 設定標題文字大小
  textSize(getResponsiveTextSize(32));

  // 設定標題文字顏色
  fill(mainTextColor);

  // 秀出測驗標題
  text("p5.js 簡易指令練習測驗", width / 2, height * 0.09);

  // 設定題數文字大小
  textSize(getResponsiveTextSize(20));

  // 設定題數文字顏色
  fill("#6c757d");

  // 顯示目前題數與總題數
  text(
    "第 " + (currentQuestionIndex + 1) + " 題／共 " + quizQuestions.length + " 題",
    width / 2,
    height * 0.16
  );

  // 設定題目文字大小
  textSize(getResponsiveTextSize(25));

  // 設定題目文字顏色
  fill(mainTextColor);

  // 設定題目的最大寬度
  const questionMaxWidth = width * 0.85;

  // 顯示題目文字
  drawWrappedCenteredText(
    currentQuestion.question,
    width / 2,
    height * 0.26,
    questionMaxWidth,
    getResponsiveTextSize(25) * 1.5
  );

  // 逐一繪製四個選項
  for (let i = 0; i < currentQuestion.options.length; i++) {
    // 繪製第 i 個選項
    drawOption(i, currentQuestion.options[i]);
  }

  // 判斷使用者是否已經回答
  if (hasAnswered) {
    // 繪製答案提示文字
    drawAnswerMessage();

    // 繪製下一題按鈕
    drawNextButton();
  }
}

// 繪製單一選項按鈕
function drawOption(optionIndex, optionText) {
  // 計算選項按鈕的基本位置
  const baseX = width / 2;
  const baseY = optionStartY + optionIndex * (optionHeight + optionGap);

  // 宣告選項動畫位移量
  let animationOffsetX = 0;
  let animationOffsetY = 0;

  // 判斷是否已經回答，而且目前選項是錯誤選項
  if (
    hasAnswered &&
    selectedOptionIndex !== quizQuestions[currentQuestionIndex].answer &&
    optionIndex === selectedOptionIndex
  ) {
    // 設定錯誤選項左右晃動
    animationOffsetX = sin(frameCount * 0.25) * 12;
  }

  // 判斷是否已經回答，而且目前選項是正確答案
  if (
    hasAnswered &&
    selectedOptionIndex !== quizQuestions[currentQuestionIndex].answer &&
    optionIndex === quizQuestions[currentQuestionIndex].answer
  ) {
    // 設定正確答案上下跳動
    animationOffsetY = sin(frameCount * 0.25) * 12;
  }

  // 計算套用動畫後的選項 X 座標
  const optionX = baseX + animationOffsetX;

  // 計算套用動畫後的選項 Y 座標
  const optionY = baseY + animationOffsetY;

  // 設定選項預設背景顏色
  let optionColor = normalOptionColor;

  // 判斷使用者是否已經回答
  if (hasAnswered) {
    // 判斷使用者是否答錯
    if (selectedOptionIndex !== quizQuestions[currentQuestionIndex].answer) {
      // 判斷目前選項是否為正確答案
      if (optionIndex === quizQuestions[currentQuestionIndex].answer) {
        // 將正確答案設定為淡藍色
        optionColor = correctAnswerColor;
      }

      // 判斷目前選項是否為使用者選錯的選項
      if (optionIndex === selectedOptionIndex) {
        // 將錯誤答案設定為淡粉色
        optionColor = wrongAnswerColor;
      }
    }

    // 判斷使用者答對
    if (selectedOptionIndex === quizQuestions[currentQuestionIndex].answer) {
      // 將使用者答對的選項設定為淡藍色
      if (optionIndex === selectedOptionIndex) {
        optionColor = correctAnswerColor;
      }
    }
  }

  // 設定選項填滿顏色
  fill(optionColor);

  // 設定選項邊框顏色
  stroke(optionBorderColor);

  // 設定選項邊框粗細
  strokeWeight(2);

  // 繪製選項按鈕
  rect(optionX, optionY, optionWidth, optionHeight, 12);

  // 設定選項文字顏色
  fill(mainTextColor);

  // 設定選項文字大小
  textSize(getResponsiveTextSize(21));

  // 顯示選項文字
  text(optionText, optionX, optionY);
}

// 繪製答案提示文字
function drawAnswerMessage() {
  // 取得目前題目資料
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // 判斷使用者是否答對
  if (selectedOptionIndex === currentQuestion.answer) {
    // 設定答對提示文字顏色
    fill("#2a9d8f");

    // 設定答對提示文字大小
    textSize(getResponsiveTextSize(22));

    // 顯示答對訊息
    text("答對了！", width / 2, height * 0.81);
  } else {
    // 設定答錯提示文字顏色
    fill("#e76f51");

    // 設定答錯提示文字大小
    textSize(getResponsiveTextSize(22));

    // 顯示答錯訊息
    text(
      "答錯了，正確答案是：" + currentQuestion.options[currentQuestion.answer],
      width / 2,
      height * 0.81
    );
  }
}

// 繪製下一題按鈕
function drawNextButton() {
  // 判斷滑鼠是否位於下一題按鈕上
  const isHovering = isPointInsideButton(
    mouseX,
    mouseY,
    nextButtonX,
    nextButtonY,
    nextButtonWidth,
    nextButtonHeight
  );

  // 根據滑鼠位置設定按鈕顏色
  if (isHovering) {
    // 設定滑過時的按鈕顏色
    fill(buttonHoverColor);
  } else {
    // 設定一般按鈕顏色
    fill(buttonColor);
  }

  // 設定按鈕邊框顏色
  stroke("#6c757d");

  // 設定按鈕邊框粗細
  strokeWeight(2);

  // 繪製下一題按鈕
  rect(
    nextButtonX,
    nextButtonY,
    nextButtonWidth,
    nextButtonHeight,
    12
  );

  // 設定按鈕文字顏色
  fill(mainTextColor);

  // 設定按鈕文字大小
  textSize(getResponsiveTextSize(20));

  // 顯示下一題文字
  text("下一題", nextButtonX, nextButtonY);
}

// 繪製測驗結果畫面
function drawResultScreen() {
  // 設定結果標題文字顏色
  fill(mainTextColor);

  // 設定結果標題文字大小
  textSize(getResponsiveTextSize(38));

  // 顯示測驗完成文字
  text("測驗完成！", width / 2, height * 0.28);

  // 設定分數文字顏色
  fill("#457b9d");

  // 設定分數文字大小
  textSize(getResponsiveTextSize(32));

  // 顯示答對題數
  text(
    "你答對了 " + correctCount + "／" + quizQuestions.length + " 題",
    width / 2,
    height * 0.43
  );

  // 根據分數顯示不同鼓勵文字
  let resultMessage = "";

  // 判斷答對五題
  if (correctCount === quizQuestions.length) {
    // 設定滿分訊息
    resultMessage = "太棒了，你全部答對了！";
  } else if (correctCount >= 3) {
    // 設定中高分訊息
    resultMessage = "表現很好，繼續加油！";
  } else {
    // 設定一般訊息
    resultMessage = "再練習幾次，你一定會進步！";
  }

  // 設定鼓勵文字顏色
  fill("#6c757d");

  // 設定鼓勵文字大小
  textSize(getResponsiveTextSize(23));

  // 顯示鼓勵文字
  text(resultMessage, width / 2, height * 0.54);

  // 繪製重新開始按鈕
  drawRestartButton();
}

// 繪製重新開始按鈕
function drawRestartButton() {
  // 判斷滑鼠是否位於重新開始按鈕上
  const isHovering = isPointInsideButton(
    mouseX,
    mouseY,
    restartButtonX,
    restartButtonY,
    restartButtonWidth,
    restartButtonHeight
  );

  // 根據滑鼠位置設定按鈕顏色
  if (isHovering) {
    // 設定滑過時的按鈕顏色
    fill(buttonHoverColor);
  } else {
    // 設定一般按鈕顏色
    fill(buttonColor);
  }

  // 設定按鈕邊框顏色
  stroke("#6c757d");

  // 設定按鈕邊框粗細
  strokeWeight(2);

  // 繪製重新開始按鈕
  rect(
    restartButtonX,
    restartButtonY,
    restartButtonWidth,
    restartButtonHeight,
    12
  );

  // 設定重新開始文字顏色
  fill(mainTextColor);

  // 設定重新開始文字大小
  textSize(getResponsiveTextSize(20));

  // 顯示重新開始文字
  text("重新開始", restartButtonX, restartButtonY);
}

// 處理滑鼠按下事件
function mousePressed() {
  // 處理使用者點擊
  handlePointerClick(mouseX, mouseY);

  // 回傳 false，避免瀏覽器執行預設行為
  return false;
}

// 處理觸控開始事件
function touchStarted() {
  // 判斷是否存在觸控座標
  if (touches.length > 0) {
    // 取得第一個觸控點的 X 座標
    const touchX = touches[0].x;

    // 取得第一個觸控點的 Y 座標
    const touchY = touches[0].y;

    // 處理觸控點擊
    handlePointerClick(touchX, touchY);
  }

  // 回傳 false，避免瀏覽器執行預設行為
  return false;
}

// 統一處理滑鼠與觸控點擊
function handlePointerClick(pointerX, pointerY) {
  // 判斷測驗是否已經結束
  if (quizFinished) {
    // 判斷是否點擊重新開始按鈕
    if (
      isPointInsideButton(
        pointerX,
        pointerY,
        restartButtonX,
        restartButtonY,
        restartButtonWidth,
        restartButtonHeight
      )
    ) {
      // 重新開始測驗
      resetQuiz();
    }

    // 結束結果畫面的點擊處理
    return;
  }

  // 判斷使用者是否已經回答
  if (!hasAnswered) {
    // 逐一檢查四個選項
    for (let i = 0; i < quizQuestions[currentQuestionIndex].options.length; i++) {
      // 計算目前選項的 X 座標
      const optionX = width / 2;

      // 計算目前選項的 Y 座標
      const optionY = optionStartY + i * (optionHeight + optionGap);

      // 判斷點擊位置是否在目前選項內
      if (
        isPointInsideButton(
          pointerX,
          pointerY,
          optionX,
          optionY,
          optionWidth,
          optionHeight
        )
      ) {
        // 記錄使用者選擇的選項
        selectedOptionIndex = i;

        // 設定目前題目已經回答
        hasAnswered = true;

        // 判斷使用者是否答對
        if (selectedOptionIndex === quizQuestions[currentQuestionIndex].answer) {
          // 增加答對題數
          correctCount++;
        }

        // 結束選項檢查
        break;
      }
    }

    // 結束尚未回答時的點擊處理
    return;
  }

  // 判斷是否點擊下一題按鈕
  if (
    isPointInsideButton(
      pointerX,
      pointerY,
      nextButtonX,
      nextButtonY,
      nextButtonWidth,
      nextButtonHeight
    )
  ) {
    // 進入下一題
    goToNextQuestion();
  }
}

// 進入下一題
function goToNextQuestion() {
  // 判斷是否還有下一題
  if (currentQuestionIndex < quizQuestions.length - 1) {
    // 將題目索引加一
    currentQuestionIndex++;

    // 將回答狀態重設為尚未回答
    hasAnswered = false;

    // 將選項索引重設
    selectedOptionIndex = -1;
  } else {
    // 將測驗狀態設定為完成
    quizFinished = true;
  }
}

// 重新開始整份測驗
function resetQuiz() {
  // 將目前題目索引重設為第一題
  currentQuestionIndex = 0;

  // 將答對題數重設為零
  correctCount = 0;

  // 將回答狀態重設為尚未回答
  hasAnswered = false;

  // 將選擇的選項索引重設
  selectedOptionIndex = -1;

  // 將測驗完成狀態重設為尚未完成
  quizFinished = false;
}

// 判斷點擊位置是否位於指定按鈕範圍內
function isPointInsideButton(
  pointX,
  pointY,
  buttonCenterX,
  buttonCenterY,
  buttonWidth,
  buttonHeight
) {
  // 計算按鈕的左側邊界
  const leftBoundary = buttonCenterX - buttonWidth / 2;

  // 計算按鈕的右側邊界
  const rightBoundary = buttonCenterX + buttonWidth / 2;

  // 計算按鈕的上側邊界
  const topBoundary = buttonCenterY - buttonHeight / 2;

  // 計算按鈕的下側邊界
  const bottomBoundary = buttonCenterY + buttonHeight / 2;

  // 回傳點擊位置是否在按鈕範圍內
  return (
    pointX >= leftBoundary &&
    pointX <= rightBoundary &&
    pointY >= topBoundary &&
    pointY <= bottomBoundary
  );
}

// 讓文字依照指定寬度自動換行並置中
function drawWrappedCenteredText(
  content,
  centerX,
  startY,
  maxWidth,
  lineHeight
) {
  // 將文字拆成單一字元陣列
  const characters = content.split("");

  // 宣告用來儲存每一行文字的陣列
  const lines = [];

  // 宣告目前正在組合的文字
  let currentLine = "";

  // 逐字檢查文字寬度
  for (let i = 0; i < characters.length; i++) {
    // 將目前字元加入目前行
    const testLine = currentLine + characters[i];

    // 判斷加入字元後是否超過最大寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 將目前行加入文字行陣列
      lines.push(currentLine);

      // 將目前字元作為新的一行開頭
      currentLine = characters[i];
    } else {
      // 將測試文字設定為目前行
      currentLine = testLine;
    }
  }

  // 判斷是否還有尚未加入的文字
  if (currentLine.length > 0) {
    // 將最後一行加入文字行陣列
    lines.push(currentLine);
  }

  // 計算整段文字的總高度
  const totalHeight = lines.length * lineHeight;

  // 逐行繪製文字
  for (let i = 0; i < lines.length; i++) {
    // 計算目前文字行的垂直位置
    const lineY = startY - totalHeight / 2 + lineHeight / 2 + i * lineHeight;

    // 繪製目前文字行
    text(lines[i], centerX, lineY);
  }
}

// 根據畫面大小取得適合的文字大小
function getResponsiveTextSize(baseSize) {
  // 取得畫面寬度與高度中較小的數值
  const shortestSide = min(width, height);

  // 根據畫面大小縮放文字
  const scaleFactor = constrain(shortestSide / 700, 0.75, 1.25);

  // 回傳縮放後的文字大小
  return baseSize * scaleFactor;
}

// 根據視窗大小重新計算介面配置
function updateLayout() {
  // 設定選項按鈕寬度
  optionWidth = min(width * 0.82, 700);

  // 設定選項按鈕高度
  optionHeight = constrain(height * 0.075, 48, 70);

  // 設定選項按鈕間距
  optionGap = constrain(height * 0.018, 10, 18);

  // 設定選項按鈕起始位置
  optionStartY = height * 0.39;

  // 設定下一題按鈕寬度
  nextButtonWidth = min(width * 0.35, 220);

  // 設定下一題按鈕高度
  nextButtonHeight = constrain(height * 0.07, 48, 64);

  // 設定下一題按鈕 X 座標
  nextButtonX = width / 2;

  // 設定下一題按鈕 Y 座標
  nextButtonY = height * 0.9;

  // 設定重新開始按鈕寬度
  restartButtonWidth = min(width * 0.38, 240);

  // 設定重新開始按鈕高度
  restartButtonHeight = constrain(height * 0.07, 48, 64);

  // 設定重新開始按鈕 X 座標
  restartButtonX = width / 2;

  // 設定重新開始按鈕 Y 座標
  restartButtonY = height * 0.68;
}

// 視窗尺寸改變時執行的函式
function windowResized() {
  // 將畫布調整為新的視窗寬度與高度
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算介面配置
  updateLayout();
}

```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習2截圖]
![20261008 2](https://hackmd.io/_uploads/SkGwxTEsMe.gif)
### 第一次問 AI

```tex!
網頁設定為響應式網頁  讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
```

### 第二次問 AI

```tex!
sketch.js:207 Uncaught (in promise) TypeError: canvas.style is not a function
    at setup (sketch.js:207:10)
    at _setup (p5.min.js:2:465993)
    at _runIfPreloadsAreDone (p5.min.js:2:465046)
    at g._decrementPreload (p5.min.js:2:465251)
    at g.<anonymous> (p5.sound.min.js:2:98292) 幫我解決這個問題
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
// ==============================
// p5.js 響應式選擇題測驗系統
// ==============================

// 儲存五道測驗題目
const quizQuestions = [
  // 第一題
  {
    // 設定題目內容
    question: "在 p5.js 中，哪一個指令可以建立畫布？",

    // 設定四個選項
    options: [
      "createCanvas()",
      "makeCanvas()",
      "canvasCreate()",
      "setCanvas()"
    ],

    // 設定正確答案索引
    answer: 0
  },

  // 第二題
  {
    // 設定題目內容
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",

    // 設定四個選項
    options: [
      "start()",
      "setup()",
      "begin()",
      "init()"
    ],

    // 設定正確答案索引
    answer: 1
  },

  // 第三題
  {
    // 設定題目內容
    question: "在 p5.js 中，哪一個函式會不斷重複執行？",

    // 設定四個選項
    options: [
      "repeat()",
      "looping()",
      "draw()",
      "run()"
    ],

    // 設定正確答案索引
    answer: 2
  },

  // 第四題
  {
    // 設定題目內容
    question: "下列哪一個指令可以設定背景顏色？",

    // 設定四個選項
    options: [
      "background()",
      "colorBackground()",
      "setBackground()",
      "bgColor()"
    ],

    // 設定正確答案索引
    answer: 0
  },

  // 第五題
  {
    // 設定題目內容
    question: "下列哪一個指令可以繪製圓形？",

    // 設定四個選項
    options: [
      "circle()",
      "round()",
      "drawCircle()",
      "ellipseCircle()"
    ],

    // 設定正確答案索引
    answer: 0
  }
];

// 宣告目前題目索引
let currentQuestionIndex = 0;

// 宣告答對題數
let correctCount = 0;

// 宣告是否已經回答
let hasAnswered = false;

// 宣告使用者選擇的選項索引
let selectedOptionIndex = -1;

// 宣告測驗是否完成
let quizFinished = false;

// 宣告程式是否已完成初始化
let quizReady = false;

// 宣告觸控後暫時忽略滑鼠事件的時間
let ignoreMouseUntil = 0;

// 宣告響應式版面資料
const quizLayout = {
  // 宣告頁面內距
  padding: 20,

  // 宣告內容最大寬度
  contentWidth: 700,

  // 宣告標題 Y 座標
  titleY: 50,

  // 宣告題數 Y 座標
  progressY: 90,

  // 宣告題目 Y 座標
  questionY: 145,

  // 宣告選項起始 Y 座標
  optionStartY: 240,

  // 宣告選項寬度
  optionWidth: 400,

  // 宣告選項高度
  optionHeight: 55,

  // 宣告選項間距
  optionGap: 12,

  // 宣告答案提示 Y 座標
  feedbackY: 650,

  // 宣告下一題按鈕 X 座標
  nextButtonX: 0,

  // 宣告下一題按鈕 Y 座標
  nextButtonY: 0,

  // 宣告下一題按鈕寬度
  nextButtonWidth: 190,

  // 宣告下一題按鈕高度
  nextButtonHeight: 52,

  // 宣告重新開始按鈕 X 座標
  restartButtonX: 0,

  // 宣告重新開始按鈕 Y 座標
  restartButtonY: 0,

  // 宣告重新開始按鈕寬度
  restartButtonWidth: 210,

  // 宣告重新開始按鈕高度
  restartButtonHeight: 52
};

// 設定背景顏色
const pageBackgroundColor = "#f8f9fa";

// 設定主要文字顏色
const mainTextColor = "#343a40";

// 設定按鈕顏色
const buttonColor = "#a2d2ff";

// 設定按鈕滑過時顏色
const buttonHoverColor = "#8ecae6";

// 設定正確答案背景顏色
const correctAnswerColor = "#bde0fe";

// 設定錯誤答案背景顏色
const wrongAnswerColor = "#ffc8dd";

// 設定一般選項背景顏色
const normalOptionColor = "#ffffff";

// 設定邊框顏色
const borderColor = "#adb5bd";

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器視窗的全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 將矩形繪製模式設定為中心對齊
  rectMode(CENTER);

  // 將文字設定為水平與垂直置中
  textAlign(CENTER, CENTER);

  // 設定字體
  textFont("sans-serif");

  // 啟用平滑效果
  smooth();

  // 取得畫布 HTML 元素
  const canvasElement = document.querySelector("canvas");

  // 確認畫布元素存在
  if (canvasElement !== null) {
    // 使用原生 CSS 設定觸控行為
    canvasElement.style.touchAction = "none";
  }

  // 設定程式已完成初始化
  quizReady = true;

  // 更新響應式版面
  quizUpdateLayout();
}

// p5.js 每一幀執行一次
function draw() {
  // 設定畫布背景
  background(pageBackgroundColor);

  // 如果尚未初始化，停止繪製
  if (!quizReady) {
    // 結束目前畫面
    return;
  }

  // 判斷測驗是否完成
  if (quizFinished) {
    // 顯示結果畫面
    quizDrawResultScreen();
  } else {
    // 顯示題目畫面
    quizDrawQuestionScreen();
  }
}

// 繪製題目畫面
function quizDrawQuestionScreen() {
  // 取得目前題目
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // 設定標題文字大小
  textSize(quizTextSize(30));

  // 設定文字顏色
  fill(mainTextColor);

  // 顯示測驗標題
  text("p5.js 簡易指令練習測驗", width / 2, quizLayout.titleY);

  // 設定進度文字大小
  textSize(quizTextSize(17));

  // 設定進度文字顏色
  fill("#6c757d");

  // 顯示題數
  text(
    "第 " +
      (currentQuestionIndex + 1) +
      " 題／共 " +
      quizQuestions.length +
      " 題",
    width / 2,
    quizLayout.progressY
  );

  // 設定題目文字大小
  textSize(quizTextSize(21));

  // 設定題目文字顏色
  fill(mainTextColor);

  // 顯示題目文字
  quizDrawWrappedText(
    currentQuestion.question,
    width / 2,
    quizLayout.questionY,
    quizLayout.contentWidth,
    quizTextSize(21) * 1.4
  );

  // 逐一繪製四個選項
  for (let i = 0; i < currentQuestion.options.length; i++) {
    // 繪製目前選項
    quizDrawOption(i, currentQuestion.options[i]);
  }

  // 判斷使用者是否已回答
  if (hasAnswered) {
    // 顯示答案提示
    quizDrawAnswerMessage();

    // 顯示下一題按鈕
    quizDrawNextButton();
  }
}

// 繪製單一選項
function quizDrawOption(optionIndex, optionText) {
  // 取得正確答案索引
  const correctAnswerIndex =
    quizQuestions[currentQuestionIndex].answer;

  // 計算選項 X 座標
  const baseX = width / 2;

  // 計算選項 Y 座標
  const baseY =
    quizLayout.optionStartY +
    optionIndex *
      (quizLayout.optionHeight + quizLayout.optionGap);

  // 設定水平動畫位移
  let offsetX = 0;

  // 設定垂直動畫位移
  let offsetY = 0;

  // 判斷使用者是否答錯
  const isWrong =
    hasAnswered &&
    selectedOptionIndex !== correctAnswerIndex;

  // 讓答錯選項左右移動
  if (isWrong && optionIndex === selectedOptionIndex) {
    // 使用 sin 函式產生水平動畫
    offsetX = sin(frameCount * 0.25) * quizSize(10);
  }

  // 讓正確答案上下跳動
  if (isWrong && optionIndex === correctAnswerIndex) {
    // 使用 sin 函式產生垂直動畫
    offsetY = sin(frameCount * 0.25) * quizSize(10);
  }

  // 計算動畫後的 X 座標
  const optionX = baseX + offsetX;

  // 計算動畫後的 Y 座標
  const optionY = baseY + offsetY;

  // 設定選項預設顏色
  let optionColor = normalOptionColor;

  // 判斷使用者是否已回答
  if (hasAnswered) {
    // 判斷使用者是否答錯
    if (selectedOptionIndex !== correctAnswerIndex) {
      // 將正確答案設定為淡藍色
      if (optionIndex === correctAnswerIndex) {
        optionColor = correctAnswerColor;
      }

      // 將錯誤選項設定為淡粉色
      if (optionIndex === selectedOptionIndex) {
        optionColor = wrongAnswerColor;
      }
    }

    // 判斷使用者是否答對
    if (selectedOptionIndex === correctAnswerIndex) {
      // 將答對選項設定為淡藍色
      if (optionIndex === selectedOptionIndex) {
        optionColor = correctAnswerColor;
      }
    }
  }

  // 設定選項背景顏色
  fill(optionColor);

  // 設定選項邊框顏色
  stroke(borderColor);

  // 設定邊框粗細
  strokeWeight(2);

  // 繪製選項按鈕
  rect(
    optionX,
    optionY,
    quizLayout.optionWidth,
    quizLayout.optionHeight,
    quizSize(10)
  );

  // 設定選項文字顏色
  fill(mainTextColor);

  // 顯示選項文字
  quizDrawAutoFitText(
    optionText,
    optionX,
    optionY,
    quizLayout.optionWidth * 0.88,
    quizLayout.optionHeight * 0.75
  );
}

// 顯示答案訊息
function quizDrawAnswerMessage() {
  // 取得目前題目
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // 判斷是否答對
  if (selectedOptionIndex === currentQuestion.answer) {
    // 設定答對文字顏色
    fill("#2a9d8f");

    // 設定答對文字大小
    textSize(quizTextSize(20));

    // 顯示答對文字
    text("答對了！", width / 2, quizLayout.feedbackY);
  } else {
    // 設定答錯文字顏色
    fill("#e76f51");

    // 設定答錯文字大小
    textSize(quizTextSize(17));

    // 顯示答錯文字
    quizDrawWrappedText(
      "答錯了，正確答案是：" +
        currentQuestion.options[currentQuestion.answer],
      width / 2,
      quizLayout.feedbackY,
      quizLayout.contentWidth,
      quizTextSize(17) * 1.3
    );
  }
}

// 繪製下一題按鈕
function quizDrawNextButton() {
  // 判斷滑鼠是否位於按鈕內
  const isHovering = quizPointInside(
    mouseX,
    mouseY,
    quizLayout.nextButtonX,
    quizLayout.nextButtonY,
    quizLayout.nextButtonWidth,
    quizLayout.nextButtonHeight
  );

  // 設定按鈕顏色
  fill(isHovering ? buttonHoverColor : buttonColor);

  // 設定邊框顏色
  stroke("#6c757d");

  // 設定邊框粗細
  strokeWeight(2);

  // 繪製按鈕
  rect(
    quizLayout.nextButtonX,
    quizLayout.nextButtonY,
    quizLayout.nextButtonWidth,
    quizLayout.nextButtonHeight,
    quizSize(10)
  );

  // 設定按鈕文字顏色
  fill(mainTextColor);

  // 設定文字大小
  textSize(quizTextSize(18));

  // 顯示按鈕文字
  text(
    currentQuestionIndex === quizQuestions.length - 1
      ? "查看結果"
      : "下一題",
    quizLayout.nextButtonX,
    quizLayout.nextButtonY
  );
}

// 繪製結果畫面
function quizDrawResultScreen() {
  // 設定標題顏色
  fill(mainTextColor);

  // 設定標題大小
  textSize(quizTextSize(34));

  // 顯示測驗完成
  text("測驗完成！", width / 2, height * 0.27);

  // 設定分數顏色
  fill("#457b9d");

  // 設定分數大小
  textSize(quizTextSize(28));

  // 顯示分數
  text(
    "你答對了 " +
      correctCount +
      "／" +
      quizQuestions.length +
      " 題",
    width / 2,
    height * 0.42
  );

  // 宣告結果訊息
  let resultMessage = "";

  // 判斷答對題數
  if (correctCount === quizQuestions.length) {
    // 設定滿分訊息
    resultMessage = "太棒了，你全部答對了！";
  } else if (correctCount >= 3) {
    // 設定中高分訊息
    resultMessage = "表現很好，繼續加油！";
  } else {
    // 設定鼓勵訊息
    resultMessage = "再練習幾次，你一定會進步！";
  }

  // 設定結果文字顏色
  fill("#6c757d");

  // 設定結果文字大小
  textSize(quizTextSize(20));

  // 顯示結果訊息
  text(resultMessage, width / 2, height * 0.54);

  // 顯示重新開始按鈕
  quizDrawRestartButton();
}

// 繪製重新開始按鈕
function quizDrawRestartButton() {
  // 判斷滑鼠是否在按鈕內
  const isHovering = quizPointInside(
    mouseX,
    mouseY,
    quizLayout.restartButtonX,
    quizLayout.restartButtonY,
    quizLayout.restartButtonWidth,
    quizLayout.restartButtonHeight
  );

  // 設定按鈕顏色
  fill(isHovering ? buttonHoverColor : buttonColor);

  // 設定邊框顏色
  stroke("#6c757d");

  // 設定邊框粗細
  strokeWeight(2);

  // 繪製重新開始按鈕
  rect(
    quizLayout.restartButtonX,
    quizLayout.restartButtonY,
    quizLayout.restartButtonWidth,
    quizLayout.restartButtonHeight,
    quizSize(10)
  );

  // 設定文字顏色
  fill(mainTextColor);

  // 設定文字大小
  textSize(quizTextSize(18));

  // 顯示重新開始文字
  text(
    "重新開始",
    quizLayout.restartButtonX,
    quizLayout.restartButtonY
  );
}

// 處理滑鼠點擊
function mousePressed() {
  // 判斷是否需要忽略滑鼠事件
  if (millis() < ignoreMouseUntil) {
    // 阻止預設行為
    return false;
  }

  // 處理滑鼠點擊
  quizProcessPointer(mouseX, mouseY);

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控點擊
function touchStarted() {
  // 判斷是否有觸控點
  if (touches.length > 0) {
    // 處理第一個觸控點
    quizProcessPointer(touches[0].x, touches[0].y);

    // 設定短時間內忽略滑鼠事件
    ignoreMouseUntil = millis() + 500;
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理滑鼠或觸控點擊
function quizProcessPointer(pointerX, pointerY) {
  // 判斷測驗是否結束
  if (quizFinished) {
    // 判斷是否點擊重新開始
    if (
      quizPointInside(
        pointerX,
        pointerY,
        quizLayout.restartButtonX,
        quizLayout.restartButtonY,
        quizLayout.restartButtonWidth,
        quizLayout.restartButtonHeight
      )
    ) {
      // 重新開始測驗
      quizReset();
    }

    // 結束點擊處理
    return;
  }

  // 判斷是否尚未回答
  if (!hasAnswered) {
    // 逐一檢查每個選項
    for (
      let i = 0;
      i < quizQuestions[currentQuestionIndex].options.length;
      i++
    ) {
      // 計算選項 X 座標
      const optionX = width / 2;

      // 計算選項 Y 座標
      const optionY =
        quizLayout.optionStartY +
        i *
          (quizLayout.optionHeight +
            quizLayout.optionGap);

      // 判斷點擊是否在選項內
      if (
        quizPointInside(
          pointerX,
          pointerY,
          optionX,
          optionY,
          quizLayout.optionWidth,
          quizLayout.optionHeight
        )
      ) {
        // 記錄使用者選擇
        selectedOptionIndex = i;

        // 設定已經回答
        hasAnswered = true;

        // 判斷是否答對
        if (
          selectedOptionIndex ===
          quizQuestions[currentQuestionIndex].answer
        ) {
          // 答對題數加一
          correctCount++;
        }

        // 停止檢查其他選項
        break;
      }
    }

    // 結束尚未回答處理
    return;
  }

  // 判斷是否點擊下一題按鈕
  if (
    quizPointInside(
      pointerX,
      pointerY,
      quizLayout.nextButtonX,
      quizLayout.nextButtonY,
      quizLayout.nextButtonWidth,
      quizLayout.nextButtonHeight
    )
  ) {
    // 進入下一題
    quizGoToNextQuestion();
  }
}

// 進入下一題
function quizGoToNextQuestion() {
  // 判斷是否仍有下一題
  if (currentQuestionIndex < quizQuestions.length - 1) {
    // 題目索引加一
    currentQuestionIndex++;

    // 重設回答狀態
    hasAnswered = false;

    // 重設選項索引
    selectedOptionIndex = -1;

    // 更新版面
    quizUpdateLayout();
  } else {
    // 設定測驗完成
    quizFinished = true;
  }
}

// 重設測驗
function quizReset() {
  // 回到第一題
  currentQuestionIndex = 0;

  // 將分數歸零
  correctCount = 0;

  // 設定尚未回答
  hasAnswered = false;

  // 清除選項索引
  selectedOptionIndex = -1;

  // 設定測驗尚未完成
  quizFinished = false;

  // 更新版面
  quizUpdateLayout();
}

// 判斷座標是否在指定區域內
function quizPointInside(
  pointX,
  pointY,
  centerX,
  centerY,
  boxWidth,
  boxHeight
) {
  // 計算左邊界
  const left = centerX - boxWidth / 2;

  // 計算右邊界
  const right = centerX + boxWidth / 2;

  // 計算上邊界
  const top = centerY - boxHeight / 2;

  // 計算下邊界
  const bottom = centerY + boxHeight / 2;

  // 回傳是否位於範圍內
  return (
    pointX >= left &&
    pointX <= right &&
    pointY >= top &&
    pointY <= bottom
  );
}

// 將文字分割成多行
function quizWrapText(content, maxWidth) {
  // 將文字拆成單一字元
  const characters = content.split("");

  // 建立文字行陣列
  const lines = [];

  // 宣告目前文字行
  let currentLine = "";

  // 逐字處理文字
  for (let i = 0; i < characters.length; i++) {
    // 建立測試文字行
    const testLine = currentLine + characters[i];

    // 判斷是否超過最大寬度
    if (
      textWidth(testLine) > maxWidth &&
      currentLine.length > 0
    ) {
      // 儲存目前文字行
      lines.push(currentLine);

      // 開始新的文字行
      currentLine = characters[i];
    } else {
      // 更新目前文字行
      currentLine = testLine;
    }
  }

  // 儲存最後一行
  if (currentLine.length > 0) {
    // 將最後一行加入陣列
    lines.push(currentLine);
  }

  // 回傳文字行
  return lines;
}

// 繪製自動換行文字
function quizDrawWrappedText(
  content,
  centerX,
  centerY,
  maxWidth,
  lineHeight
) {
  // 將文字分成多行
  const lines = quizWrapText(content, maxWidth);

  // 計算文字總高度
  const totalHeight = lines.length * lineHeight;

  // 逐行顯示文字
  for (let i = 0; i < lines.length; i++) {
    // 計算目前文字行的 Y 座標
    const lineY =
      centerY -
      totalHeight / 2 +
      lineHeight / 2 +
      i * lineHeight;

    // 繪製目前文字行
    text(lines[i], centerX, lineY);
  }
}

// 繪製自動縮放文字
function quizDrawAutoFitText(
  content,
  centerX,
  centerY,
  maxWidth,
  maxHeight
) {
  // 設定文字初始大小
  let currentSize = quizTextSize(19);

  // 套用文字大小
  textSize(currentSize);

  // 文字太寬時縮小
  while (
    textWidth(content) > maxWidth &&
    currentSize > 12
  ) {
    // 縮小文字
    currentSize--;

    // 套用新的文字大小
    textSize(currentSize);
  }

  // 判斷文字是否能直接顯示
  if (textWidth(content) <= maxWidth) {
    // 顯示單行文字
    text(content, centerX, centerY);

    // 結束函式
    return;
  }

  // 顯示自動換行文字
  quizDrawWrappedText(
    content,
    centerX,
    centerY,
    maxWidth,
    currentSize * 1.2
  );
}

// 取得響應式文字大小
function quizTextSize(baseSize) {
  // 取得畫布較短的一邊
  const shortestSide = min(width, height);

  // 計算縮放比例
  const scale = constrain(
    shortestSide / 700,
    0.72,
    1.15
  );

  // 回傳調整後文字大小
  return baseSize * scale;
}

// 取得響應式尺寸
function quizSize(baseSize) {
  // 取得畫布較短的一邊
  const shortestSide = min(width, height);

  // 計算縮放比例
  const scale = constrain(
    shortestSide / 700,
    0.72,
    1.15
  );

  // 回傳調整後尺寸
  return baseSize * scale;
}

// 更新響應式版面
function quizUpdateLayout() {
  // 取得畫布寬度
  const screenWidth = max(width, 1);

  // 取得畫布高度
  const screenHeight = max(height, 1);

  // 判斷是否為小螢幕
  const isSmallScreen =
    screenWidth <= 600 ||
    screenHeight <= 600;

  // 判斷是否為手機橫向
  const isLandscape =
    screenWidth > screenHeight;

  // 設定頁面內距
  quizLayout.padding = isSmallScreen ? 12 : 24;

  // 設定內容最大寬度
  quizLayout.contentWidth = min(
    screenWidth - quizLayout.padding * 2,
    700
  );

  // 設定標題位置
  quizLayout.titleY = screenHeight * 0.075;

  // 設定題數位置
  quizLayout.progressY = screenHeight * 0.14;

  // 設定題目位置
  quizLayout.questionY = screenHeight * 0.23;

  // 設定選項寬度
  quizLayout.optionWidth = quizLayout.contentWidth;

  // 設定選項間距
  quizLayout.optionGap =
    isLandscape && isSmallScreen ? 6 : 10;

  // 設定選項高度
  if (isLandscape && isSmallScreen) {
    // 手機橫向使用較矮選項
    quizLayout.optionHeight = constrain(
      screenHeight * 0.10,
      34,
      46
    );
  } else {
    // 一般畫面使用標準選項高度
    quizLayout.optionHeight = constrain(
      screenHeight * 0.065,
      42,
      60
    );
  }

  // 計算四個選項的總高度
  const totalOptionsHeight =
    quizLayout.optionHeight * 4 +
    quizLayout.optionGap * 3;

  // 設定選項起始位置
  quizLayout.optionStartY =
    screenHeight * 0.43 -
    totalOptionsHeight / 2;

  // 設定答題提示位置
  quizLayout.feedbackY = screenHeight * 0.80;

  // 設定下一題按鈕大小
  quizLayout.nextButtonWidth = min(
    quizLayout.contentWidth,
    isSmallScreen ? 180 : 220
  );

  // 設定下一題按鈕高度
  quizLayout.nextButtonHeight = constrain(
    screenHeight * 0.07,
    40,
    58
  );

  // 設定下一題按鈕位置
  quizLayout.nextButtonX = screenWidth / 2;

  // 將下一題按鈕放在底部
  quizLayout.nextButtonY =
    screenHeight -
    quizLayout.nextButtonHeight * 0.8;

  // 設定重新開始按鈕大小
  quizLayout.restartButtonWidth = min(
    quizLayout.contentWidth,
    isSmallScreen ? 190 : 230
  );

  // 設定重新開始按鈕高度
  quizLayout.restartButtonHeight = constrain(
    screenHeight * 0.07,
    40,
    58
  );

  // 設定重新開始按鈕位置
  quizLayout.restartButtonX = screenWidth / 2;

  // 設定重新開始按鈕位置
  quizLayout.restartButtonY = screenHeight * 0.70;

  // 判斷畫面高度是否過小
  if (screenHeight < 480) {
    // 將標題往上移動
    quizLayout.titleY = screenHeight * 0.06;

    // 將題數文字往上移動
    quizLayout.progressY = screenHeight * 0.12;

    // 將題目往上移動
    quizLayout.questionY = screenHeight * 0.20;

    // 將選項往上移動
    quizLayout.optionStartY =
      screenHeight * 0.40 -
      totalOptionsHeight / 2;

    // 將答題提示往上移動
    quizLayout.feedbackY = screenHeight * 0.77;

    // 將下一題按鈕靠近底部
    quizLayout.nextButtonY =
      screenHeight -
      quizLayout.nextButtonHeight * 0.65;
  }
}

// 視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算響應式版面
  quizUpdateLayout();
}

```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
