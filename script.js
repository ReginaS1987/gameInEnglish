//  ===========  Глобальные переменные  ===========
let score = 0;
let timeLeft = 60;
let timerInterval;
let currentQuiz = null; // Хранит данные текущей викторины (например, 'vegetableShop')
let questionIndex = 0; // Индекс текущего вопроса в массиве questions
let currentScreen = "main-menu"; // Текущий отображаемый экран
let draggedElement = null; // Для Drag-and-Drop: элемент, который сейчас перетаскивается
let correctDropZone = null; // Для Drag-and-Drop: правильная зона для текущего слова
let wordsInDropZones = {}; // Для Drag-and-Drop: {dropZoneId: wordElement}

//  ===========  DOM Элементы  ===========
const scoreValueElement = document.getElementById("score-value");
const timeLeftElement = document.getElementById("time-left");
const ingredientBasketElement = document.querySelector(".ingredient-basket"); // Пока не используется, но может пригодиться
const mainMenuScreen = document.getElementById("main-menu");
const mapScreen = document.getElementById("map-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const quizTitleElement = document.getElementById("quiz-title");
const questionTextElement = document.getElementById("question-text");
const helperDialogElement = document.getElementById("helper-dialog");

//  Контейнеры для разных типов вопросов
const answerOptionsContainer = document.getElementById("answer-options-container");
const dragAndDropContainer = document.getElementById("drag-and-drop-container");
const wordBlockContainer = document.querySelector(".word-block-wrapper");
const dropZoneContainer = document.querySelector(".drop-zone-wrapper");
const dragAndDropImageElement = document.getElementById("drag-and-drop-image"); // Элемент для изображения в D&D
const vocabularyImageElement = document.getElementById("vocabulary-image"); // Элемент для изображения в Vocabulary

const dialogueContainer = document.getElementById("dialogue-container");
const dialogueCharacterElement = document.getElementById("dialogue-character");
const dialogueTextElement = document.getElementById("dialogue-text");
const dialogueChoicesElement = document.getElementById("dialogue-choices");

//  Кнопки управления
const startGameButton = document.getElementById("start-game-button");
const restartButton = document.getElementById("restart-button");

//  Элементы результатов
const finalScoreElement = document.getElementById("final-score");

//  ===========  Данные Викторин  ===========
const quizzes = {
  vegetableShop: {
    title: "Овощная Лавка",
    questions: [
      {
        type: "grammar", // there is/are
        question: "There ____  carrots in the basket.",
        answers: ["is", "are"],
        correctAnswer: "are",
        helper: "Use 'are' for plural number. ",
      },
      {
        type: "grammar", // some/any
        question: "Is there ____ tomatoes on the table?",
        answers: ["some", "any"],
        correctAnswer: "any",
        helper: "Use 'any' in negatives and questions. ",
      },
      {
        type: "vocabulary", // food/vegetable
        question: "What is this?",
        image: "images/icons/tomato.png",
        answers: ["Tomato", "Apple", "Cake", "Milk"],
        correctAnswer: "Tomato",
        helper: "Guess what's in the photo! ",
      },
      {
        type: "drag-and-drop", // Составление предложения
        text: "Составьте предложение:", // Используется в questionTextElement
        words: ["tomatoes", "are", "the", "There", "on", "some", "table."],
        correctOrder: ["There", "are", "some", "tomatoes", "on", "the", "table."],
        helper: "Помоги собрать правильное предложение!",
      },
    ],
  },
  fruitGarden: {
    title: "Фруктовый Сад",
    questions: [
      {
        type: "grammar", // a/an
        question: "I'd like ____ apple, please.",
        answers: ["a", "an"],
        correctAnswer: "an",
        helper: "We use 'an' with words that begin with a,e,i,o,u, and the silent letter h. ",
      },
      {
        type: "vocabulary", // fruit
        question: "Is this a fruit or a vegetable?",
        image: "images/icons/apple.png",
        answers: ["Fruit", "Vegetable"],
        correctAnswer: "Fruit",
      },
      {
        type: "dialogue", // I'd like...
        dialogueText: "Chef Helper: Oh, you look hungry! What would you like to eat?",
        characterImage: "images/characters/chef.png",
        choices: ["I'd like an apple.", "There is an apple.", "Shall we have an apple?"],
        correctAnswer: "I'd like an apple.",
        helper: "Выбери, как вежливо попросить еду.",
      },
    ],
  },
  sweetBakery: {
    title: "Пекарня Сладостей",
    questions: [
      {
        type: "grammar", // some/any
        question: "Shall we have ____ cake?",
        answers: ["some", "any"],
        correctAnswer: "some",
        helper: "Use the phrases Shall we? to make suggestions. ",
      },
      {
        type: "grammar", // some/any
        question: "How about ____ tea ?",
        answers: ["some", "any"],
        correctAnswer: "some",
        helper: "Use the phrases How about? to make suggestions. ",
      },
      {
        type: "vocabulary", // junk food
        question: "What is this?",
        image: "images/icons/cookie.png",
        answers: ["Cookie", "Broccoli", "Carrot", "Orange"],
        correctAnswer: "Cookie",
        helper: "Guess, what's in the photo!",
      },
      {
        type: "grammar", // there is/are
        question: "There ____ many cookies in the jar.",
        answers: ["is", "are"],
        correctAnswer: "are",
        helper: "Use 'are' for plural number. ",
      },
    ],
  },
  picantesKitchen: {
    title: "Кухня Профессора Пиканте",
    questions: [
      {
        type: "grammar", // Negative sentence
        question: "There ____ any healthy food here.",
        answers: ["is not", "are not"],
        correctAnswer: "is not",
        helper: " 'food' is uncountable here, so 'is not.",
      },
      {
        type: "vocabulary", // Junk food vs Healthy
        question: "Which one is junk food?",
        image: "images/icons/burger.png",
        answers: ["Burger", "Apple", "Carrot", "Broccoli"],
        correctAnswer: "Burger",
        helper: "Burger - is a junk food!",
      },
      {
        type: "dialogue", // Asking for food
        dialogueText: "Professor Picante: Hmm, I feel like eating something sweet and fast!",
        characterImage: "images/characters/chef.png",
        choices: ["Shall we have a burger?", "I'd like a burger.", "Is there a burger?"],
        correctAnswer: "I'd like a burger.",
        helper: "Как Профессор Пиканте может выразить свое желание?",
      },
      {
        type: "drag-and-drop", // Составление предложения
        text: "Составьте предложение:", // Используется в questionTextElement
        words: ["about", "for", "How", "sausages", "eggs", "and", "breakfast? "],
        correctOrder: ["How", "about", "sausages", "and", "eggs", "for", "breakfast? "],
        helper: "Помоги собрать правильное предложение!",
      },
    ],
  },
};

//  ===========  Функции управления экранами  ===========
function showScreen(screenId) {
  console.log(`DEBUG: Showing screen: ${screenId}`);
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => screen.classList.remove("active"));

  const screenToShow = document.getElementById(screenId);
  if (screenToShow) {
    screenToShow.classList.add("active");
    currentScreen = screenId;
  } else {
    console.error("ERROR: Screen not found for ID:", screenId);
  }
}

//  ===========  Функции управления игрой  ===========
function startGame() {
  console.log("DEBUG: Starting new game...");
  score = 0; // Сбрасываем счет
  timeLeft = 60; // Сбрасываем время
  questionIndex = 0; // Сбрасываем индекс вопроса
  currentQuiz = null; // Сбрасываем текущую викторину

  updateScore(); // Обновляем счет на экране
  updateTimer(); // Обновляем отображение времени
  showScreen("map-screen"); // Переходим на экран карты
  clearTimeout(timerInterval); // Останавливаем предыдущий таймер, если он был запущен
}

function startQuiz(quizName) {
  console.log(`DEBUG: Starting quiz: ${quizName}`);
  if (!quizzes[quizName]) {
    console.error(`ERROR: Quiz "${quizName}" not found.`);
    return;
  }
  currentQuiz = quizzes[quizName];
  questionIndex = 0; // Начинаем с первого вопроса
  showScreen("quiz-screen");
  quizTitleElement.textContent = currentQuiz.title;
  helperDialogElement.textContent = ""; // Очищаем подсказку при старте викторины

  startTimer(); // Запускаем таймер для этой викторины
  showQuestion(); // Показываем первый вопрос
}

//  ===========  Обработка вопросов  ===========

function showQuestion() {
  console.log(`DEBUG: Entering showQuestion for index ${questionIndex}`); // <-- Добавлено
  // Скрыть все возможные контейнеры вопросов перед показом нового
  answerOptionsContainer.style.display = "none";
  dragAndDropContainer.style.display = "none";
  dialogueContainer.style.display = "none";
  vocabularyImageElement.style.display = "none"; // Hide vocabulary image by default

  // Очистить предыдущие элементы внутри контейнеров
  answerOptionsContainer.innerHTML = "";
  wordBlockContainer.innerHTML = "";
  dropZoneContainer.innerHTML = "";
  dialogueChoicesElement.innerHTML = "";
  // Удаляем эту строку, т.к. мы будем управлять display у самого элемента
  // dragAndDropImageElement.style.display = "none";

  if (!currentQuiz || questionIndex >= currentQuiz.questions.length) {
    console.warn("DEBUG: No more questions or quiz not loaded. Moving to results.");
    endQuiz(); // Завершаем викторину, если вопросов больше нет
    return;
  }

  const questionData = currentQuiz.questions[questionIndex];
  console.log(`DEBUG: Current question type: ${questionData.type}, Image: ${questionData.image}`); // <-- Добавлено
  questionTextElement.textContent = questionData.text || questionData.question; // Отображаем текст вопроса или общий текст
  helperDialogElement.textContent = questionData.helper || ""; // Отображаем подсказку

  // Обработка разных типов вопросов
  switch (questionData.type) {
    case "grammar":
    case "vocabulary":
      console.log("DEBUG: Calling showGrammarVocabularyQuestion"); // <-- Добавлено
      showGrammarVocabularyQuestion(questionData);
      break;
    case "drag-and-drop":
      console.log("DEBUG: Calling showDragAndDropQuestion"); // <-- Добавлено
      showDragAndDropQuestion(questionData);
      break;
    case "dialogue":
      console.log("DEBUG: Calling showDialogueQuestion"); // <-- Добавлено
      showDialogueQuestion(questionData);
      break;
    default:
      console.error("ERROR: Unknown question type:", questionData.type);
      moveToNextQuestion(); // Пропускаем неизвестный тип вопроса
  }
}

function showGrammarVocabularyQuestion(questionData) {
  console.log("DEBUG: Entering showGrammarVocabularyQuestion"); // <-- Добавлено
  console.log(`DEBUG: Image path for vocab: ${questionData.image}`); // <-- Добавлено

  // Показываем контейнер с кнопками и скрываем drag-and-drop
  answerOptionsContainer.style.display = "flex";
  dragAndDropContainer.style.display = "none";

  // Устанавливаем источник изображения и показываем/скрываем его в зависимости от наличия
  if (questionData.image) {
    vocabularyImageElement.src = questionData.image;
    vocabularyImageElement.style.display = "block"; // Show image for vocabulary
    console.log(
      `DEBUG: Set src for vocab: ${vocabularyImageElement.src}, display: ${vocabularyImageElement.style.display}`
    ); // <-- Добавлено
  } else {
    vocabularyImageElement.style.display = "none";
    console.log("DEBUG: Hiding image for vocab (no image path)"); // <-- Добавлено
  }

  // Очищаем кнопки ответов, чтобы не дублировались
  answerOptionsContainer.innerHTML = "";

  // Создаем кнопки ответов
  questionData.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("btn-answer");
    button.textContent = answer;

    // Слушатель для клика по кнопке ответа
    button.addEventListener("click", handleAnswerClick);

    answerOptionsContainer.appendChild(button);
  });
}

function showDialogueQuestion(questionData) {
  console.log("DEBUG: Showing Dialogue question.");
  dialogueContainer.style.display = "flex"; // Отображаем контейнер диалога

  // Устанавливаем данные персонажа и диалога
  dialogueCharacterElement.src = questionData.characterImage || "images/characters/chef_helper.png"; // Изображение по умолчанию
  dialogueTextElement.textContent = questionData.dialogueText;

  // Создаем кнопки выбора для диалога
  questionData.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.classList.add("btn-answer"); // Используем тот же стиль, что и для ответов
    button.textContent = choice;

    // Слушатель для клика по варианту диалога
    button.addEventListener("click", handleAnswerClick);

    dialogueChoicesElement.appendChild(button);
  });
}

//  ===========  Функции для Drag-and-Drop  ===========

function showDragAndDropQuestion(questionData) {
  console.log("DEBUG: Entering showDragAndDropQuestion"); // <-- Добавлено
  console.log(`DEBUG: Image path for D&D: ${questionData.image}`); // <-- Добавлено

  // Скрываем контейнер с кнопками и показываем drag-and-drop
  answerOptionsContainer.style.display = "none";
  dragAndDropContainer.style.display = "flex"; // Важно: делаем flex, чтобы элементы внутри отображались

  // Устанавливаем источник изображения и показываем/скрываем его в зависимости от наличия
  if (questionData.image) {
    dragAndDropImageElement.src = questionData.image;
    dragAndDropImageElement.style.display = "block";
    console.log(
      `DEBUG: Set src for D&D: ${dragAndDropImageElement.src}, display: ${dragAndDropImageElement.style.display}`
    ); // <-- Добавлено
  } else {
    dragAndDropImageElement.style.display = "none";
    console.log("DEBUG: Hiding image for D&D (no image path)"); // <-- Добавлено
  }
  // Очищаем содержимое контейнера drag-and-drop
  wordBlockContainer.innerHTML = "";
  dropZoneContainer.innerHTML = "";
  // Создаем draggable слова
  questionData.words.forEach((word, index) => {
    const wordBlock = document.createElement("div");
    wordBlock.classList.add("word-block");
    wordBlock.textContent = word;
    wordBlock.draggable = true; // Делаем элемент перетаскиваемым
    wordBlock.dataset.index = index; // Запоминаем исходный индекс слова

    // Слушатель для начала перетаскивания
    wordBlock.addEventListener("dragstart", handleDragStart);
    wordBlock.addEventListener("dragend", handleDragEnd); // Важно для очистки стилей

    wordBlockContainer.appendChild(wordBlock);
  });

  // Создаем зоны для сброса
  for (let i = 0; i < questionData.correctOrder.length; i++) {
    const dropZone = document.createElement("div");
    dropZone.classList.add("drop-zone");
    dropZone.dataset.index = i; // Запоминаем ожидаемый индекс слова
    dropZone.id = `drop-zone-${i}`; // Уникальный ID для каждой зоны
    dropZone.textContent = `[${i + 1}]`; // Визуальная подсказка для зон

    // Слушатели для зон сброса
    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave); // Для удаления класса drag-over
    dropZone.addEventListener("drop", handleDrop);

    dropZoneContainer.appendChild(dropZone);
  }
  // Сохраняем ссылку на правильную зону для этого вопроса
  correctDropZone = questionData.correctOrder;
  wordsInDropZones = {}; // Очищаем массив занятых зон
}

function handleDragStart(event) {
  console.log("DEBUG: Drag start");
  draggedElement = event.target;
  // Добавляем класс для визуального эффекта перетаскивания
  draggedElement.classList.add("dragging");
  // Передаем данные для перетаскивания (текст слова)
  event.dataTransfer.setData("text/plain", draggedElement.textContent);
  event.dataTransfer.setData("originalIndex", draggedElement.dataset.index);
  // Делаем контейнер со словами немного прозрачным, чтобы видеть, что перетаскиваем
  wordBlockContainer.style.opacity = "0.5";
}

function handleDragEnd() {
  console.log("DEBUG: Drag end");
  // Удаляем класс визуального эффекта
  if (draggedElement) {
    draggedElement.classList.remove("dragging");
  }
  // Восстанавливаем нормальную прозрачность контейнера со словами
  wordBlockContainer.style.opacity = "1";
  draggedElement = null; // Обнуляем ссылку на перетаскиваемый элемент
}

function handleDragOver(event) {
  event.preventDefault(); // Обязательно для drop
  const targetDropZone = event.target.closest(".drop-zone"); // Находим ближайшую зону

  if (targetDropZone && !targetDropZone.classList.contains("filled")) {
    targetDropZone.classList.add("drag-over"); // Подсвечиваем зону
  }
}

function handleDragLeave(event) {
  const targetDropZone = event.target.closest(".drop-zone");
  if (targetDropZone) {
    targetDropZone.classList.remove("drag-over"); // Убираем подсветку
  }
}

function handleDrop(event) {
  event.preventDefault();
  const targetDropZone = event.target.closest(".drop-zone");

  if (targetDropZone && !targetDropZone.classList.contains("filled") && draggedElement) {
    console.log(`DEBUG: Dropped ${draggedElement.textContent} into ${targetDropZone.id}`);
    targetDropZone.classList.remove("drag-over");
    targetDropZone.classList.add("filled"); // Помечаем зону как занятую
    targetDropZone.textContent = draggedElement.textContent; // Помещаем текст слова в зону
    targetDropZone.style.color = draggedElement.style.color; // Копируем цвет текста слова

    // Сохраняем, какое слово оказалось в какой зоне
    wordsInDropZones[targetDropZone.id] = draggedElement.textContent;

    // Скрываем перетаскиваемое слово
    draggedElement.style.display = "none";

    // Проверяем, все ли слова на месте
    checkDragAndDropCompletion();
  }
}

function checkDragAndDropCompletion() {
  // Проверяем, заполнены ли все зоны
  const allZonesFilled = document.querySelectorAll(".drop-zone.filled").length === correctDropZone.length;

  if (allZonesFilled) {
    console.log("DEBUG: All drop zones are filled. Checking answer...");
    let isCorrect = true;
    // Сравниваем слова в зонах с правильным порядком
    for (let i = 0; i < correctDropZone.length; i++) {
      const zoneId = `drop-zone-${i}`;
      const droppedWord = wordsInDropZones[zoneId];
      const expectedWord = correctDropZone[i];

      if (droppedWord !== expectedWord) {
        isCorrect = false;
        // Помечаем неправильные зоны
        const zoneElement = document.getElementById(zoneId);
        zoneElement.classList.add("incorrect-drop");
        console.log(`DEBUG: Mismatch at index ${i}. Expected "${expectedWord}", got "${droppedWord}".`);
      } else {
        // Помечаем правильные зоны
        const zoneElement = document.getElementById(zoneId);
        zoneElement.classList.add("correct-drop");
      }
    }

    if (isCorrect) {
      console.log("DEBUG: Drag-and-Drop answer is CORRECT!");
      score += 10; // Добавляем очки
      helperDialogElement.textContent = "Правильно!";
      // Отключаем все дальнейшие действия с D&D элементами
      disableDragAndDropInteraction();
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500); // Задержка перед переходом к следующему вопросу
    } else {
      console.log("DEBUG: Drag-and-Drop answer is INCORRECT.");
      helperDialogElement.textContent = `Неверно. Попробуй еще раз или нажми "Далее".`;
      // Возможно, стоит дать пользователю возможность сбросить и попробовать снова,
      // или просто перейти дальше. Пока просто позволяем перейти дальше.
      // Для повторного перетаскивания нужно будет сбросить все:
      // setTimeout(resetDragAndDrop, 2000); // Пример сброса
      setTimeout(() => {
        moveToNextQuestion(); // Или сразу переходим дальше
      }, 2000);
    }
  }
}

function disableDragAndDropInteraction() {
  // Удаляем слушатели с перетаскиваемых элементов и зон
  document.querySelectorAll(".word-block").forEach((el) => {
    el.removeEventListener("dragstart", handleDragStart);
    el.removeEventListener("dragend", handleDragEnd);
    el.draggable = false; // Делаем неперетаскиваемым
  });
  document.querySelectorAll(".drop-zone").forEach((el) => {
    el.removeEventListener("dragover", handleDragOver);
    el.removeEventListener("dragleave", handleDragLeave);
    el.removeEventListener("drop", handleDrop);
  });
}

//  ===========  Обработка кликов по ответам (для грамматики, лексики, диалога)  ===========
function handleAnswerClick(event) {
  console.log("DEBUG: Answer clicked");
  const clickedButton = event.target;
  const questionData = currentQuiz.questions[questionIndex];
  const isCorrect = clickedButton.textContent === questionData.correctAnswer;
  if (isCorrect) {
    console.log("DEBUG: Correct answer, adding 10 points!");
    score += 10;
    console.log(`DEBUG: Score before updateScore(): ${score}`); // Добавляем отладочное сообщение
    updateScore();
    clickedButton.classList.add("correct");
    helperDialogElement.textContent = "Правильно!";
    disableAnswerButtons(); // Отключаем кнопки после ответа
    setTimeout(() => {
      moveToNextQuestion();
    }, 1000); // Переходим к следующему вопросу через 1 секунду
  } else {
    clickedButton.classList.add("incorrect");
    helperDialogElement.textContent = `Неверно. Правильный ответ: ${questionData.correctAnswer}`;
    // Подсвечиваем правильный ответ
    highlightCorrectAnswer(questionData.correctAnswer, clickedButton.parentNode);
    disableAnswerButtons(); // Отключаем кнопки после ответа
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000); // Переходим через 2 секунды
  }
}

function highlightCorrectAnswer(correctAnswer, parentContainer) {
  const buttons = parentContainer.querySelectorAll(".btn-answer");
  buttons.forEach((btn) => {
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    }
  });
}

function disableAnswerButtons() {
  const buttons = document.querySelectorAll(".btn-answer");
  buttons.forEach((btn) => {
    btn.removeEventListener("click", handleAnswerClick); // Убираем слушатель
    btn.style.cursor = "not-allowed"; // Делаем кнопки некликабельными
  });
}

//  ===========  Управление таймером  ===========
function startTimer() {
  console.log("DEBUG: Timer started.");
  clearInterval(timerInterval); // Очищаем предыдущий интервал, если есть
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endTimer();
      endQuiz(); // Завершаем игру при истечении времени
    }
  }, 1000); // Обновляем каждую секунду
}

function endTimer() {
  console.log("DEBUG: Timer ended.");
  clearInterval(timerInterval); // Останавливаем таймер
  timeLeftElement.textContent = "0"; // Устанавливаем 0, если время вышло
}

function updateTimer() {
  // console.log(`DEBUG: Time left: ${timeLeft}`); // Частое логирование может засорять консоль
  timeLeftElement.textContent = timeLeft < 10 ? `0${timeLeft}` : timeLeft; // Добавляем ведущий ноль, если нужно
}

//  ===========  Обновление счета и других элементов HUD  ===========
function updateScore() {
  console.log(`DEBUG: Score updated to ${score}`);
  scoreValueElement.textContent = score;
}

//  ===========  Переход к следующему вопросу или завершение викторины  ===========
function moveToNextQuestion() {
  questionIndex++;
  console.log(`DEBUG: Moving to next question index: ${questionIndex}`);
  if (currentQuiz && questionIndex < currentQuiz.questions.length) {
    showQuestion(); // Показываем следующий вопрос
  } else {
    endQuiz(); // Завершаем викторину, если вопросов больше нет
  }
}

function endQuiz() {
  console.log("DEBUG: Quiz ended.");
  endTimer(); // Останавливаем таймер
  stopDragAndDropListeners(); // Убираем слушатели D&D

  // Обновляем финальный счет
  finalScoreElement.textContent = score;
  // Отображаем экран результатов
  showScreen("result-screen");
}

//  ===========  Инициализация игры и обработчики событий  ===========

// Обработчик события клика по элементу локации на карте
document.querySelectorAll(".location").forEach((location) => {
  location.addEventListener("click", () => {
    const locationName = location.dataset.location;
    console.log(`DEBUG: Location clicked: ${locationName}`);
    startQuiz(locationName); // Начинаем викторину для выбранной локации
  });
});

// Обработчик события клика по кнопке "Начать Игру"
startGameButton.addEventListener("click", () => {
  console.log("DEBUG: 'Start Game' button clicked.");
  startGame();
});

// Обработчик события клика по кнопке "Сыграть Снова"
restartButton.addEventListener("click", () => {
  console.log("DEBUG: 'Restart Game' button clicked.");
  startGame(); // Начинаем игру заново
});

// --- Инициализация при загрузке страницы ---
// Убедимся, что начальный экран - это главное меню
console.log("DEBUG: Initializing application.");
showScreen("main-menu");

// Изначально обновляем счет при запуске игры
updateScore();
//  ===========  Вспомогательные функции для очистки и управления  ===========

function stopDragAndDropListeners() {
  // Удаляем слушатели с draggable элементов
  document.querySelectorAll(".word-block").forEach((el) => {
    el.removeEventListener("dragstart", handleDragStart);
    el.removeEventListener("dragend", handleDragEnd);
  });
  // Удаляем слушатели с drop-зон
  document.querySelectorAll(".drop-zone").forEach((el) => {
    el.removeEventListener("dragover", handleDragOver);
    el.removeEventListener("dragleave", handleDragLeave);
    el.removeEventListener("drop", handleDrop);
  });
  console.log("DEBUG: Drag and Drop listeners stopped.");
}
