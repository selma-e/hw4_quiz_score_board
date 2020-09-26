var rootDiv = document.getElementById("root");

var header = document.createElement("header");

var nav = document.createElement("nav");
nav.classList.add("nav");

var highScoreLink = document.createElement("a");
highScoreLink.classList.add("nav-link");
highScoreLink.href = "#";
highScoreLink.textContent = "View Highscores";
highScoreLink.addEventListener("click", function(event) {
  event.preventDefault();
  clearInterval(timeHandle);
  renderHighScores();
})

var timerSpan = document.createElement("span");
timerSpan.classList.add("nav-link", "ml-auto");
timerSpan.textContent = "Time: 0"

nav.append(highScoreLink, timerSpan);

header.append(nav);

var main = document.createElement("main");
var content = document.createElement("div");
content.classList.add("container", "my-3");
main.append(content);
rootDiv.append(header, main);

var maxTime = 60;
var timePenalty = 10;
var timeRemaining = 0;

var currentQuestion = 0;
var questions = [
  {prompt:"Question 1", answers: ["a", "b", "c", "d"], correct: 1},
  {prompt:"Question 2", answers: ["a", "b", "c", "d"], correct: 2},
  {prompt:"Question 3", answers: ["a", "b", "c", "d"], correct: 0}
];

var score = 0;

var timeHandle;

function setTime(seconds) {
  timeRemaining = seconds;
  timerSpan.textContent = "Time: " + timeRemaining;
}

function startTimer(){
  clearInterval(timeHandle);
  setTime(maxTime);
  timeHandle = setInterval(function() {
    setTime(timeRemaining-1);
    if (timeRemaining <= 0) {
      setTime(0);
      clearInterval(timeHandle);
      renderEndScreen();
    }
  }, 1000);
}

function getHighscores() {
  var highscoresStr = localStorage.getItem("highscores");
  if (!highscoresStr) {
    return [];
  } else {
    return JSON.parse(highscoresStr);
  }
}

function addScore(scoreData) {
  var highscores = getHighscores();
  highscores.push(scoreData);
  highscores = highscores.sort(function(a, b) {
    return b.score - a.score;
  });
  highscores.splice(10);
  localStorage.setItem("highscores", JSON.stringify(highscores));
}

function renderStartScreen() {
  content.innerHTML = "";
  var startButton = document.createElement("button");
  startButton.classList.add("btn", "btn-secondary");
  startButton.textContent = "Start Quiz";
  startButton.addEventListener("click", function() {
    currentQuestion = 0;
    score = 0;
    renderQuestion();
    startTimer();
  })
  content.append(startButton);
}

function renderQuestion(prevOutcome) {
  content.innerHTML = "";
  var question = questions[currentQuestion];
  var questionDiv = document.createElement("div");
  var questionPrompt = document.createElement("h1");
  questionPrompt.textContent = question.prompt;
  var answerList = document.createElement("ul");
  for (let i = 0; i < question.answers.length; i++) {
    var li = document.createElement("li");
    li.textContent = i + ". " + question.answers[i];
    li.addEventListener("click", function() {
      var outcome;
      if (question.correct === i) {
        score++;
        outcome = "correct";
      } else {
        setTime(timeRemaining - timePenalty);
        outcome = "incorrect";
      }
      currentQuestion++;
      if (currentQuestion < questions.length) {
        renderQuestion(outcome);
      } else {
        clearInterval(timeHandle);
        renderEndScreen(outcome);
      }
    });
    answerList.append(li);
  }
  questionDiv.append(questionPrompt, answerList);
  content.append(questionDiv);
  if (prevOutcome != null) {
    renderQuestionOutcome(prevOutcome);
  }
}

function renderEndScreen(prevOutcome) {
  content.innerHTML = "";

  var scoreSpan = document.createElement("span");
  scoreSpan.textContent = "Score: " + score;

  var form = document.createElement("form");

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    var initials = initialsInput.value.trim();
    if (initials === "") {
      alert("Please enter your initals");
      return;
    }
    addScore({
      initals: initials,
      score: score
    });
    renderHighScores();
  })

  var formGroup = document.createElement("div");
  formGroup.classList.add("form-group");

  var initialsInputLabel = document.createElement("label");
  initialsInputLabel.htmlFor = "initals-input";
  initialsInputLabel.textContent = "Enter your initials:";

  var inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");
  var initialsInput = document.createElement("input");
  initialsInput.id = "initals-input";
  initialsInput.classList.add("form-control");
  initialsInput.setAttribute('aria-describedby', 'save-button');

  var inputGroupAppend = document.createElement("div");
  inputGroupAppend.classList.add("input-group-append");
  var saveButton = document.createElement("button");
  saveButton.id = 'save-button';
  saveButton.classList.add("btn", "btn-outline-secondary");
  saveButton.type = "submit";
  saveButton.textContent = "Save";
  inputGroupAppend.append(saveButton);

  inputGroup.append(initialsInput, inputGroupAppend);
  formGroup.append(initialsInputLabel, inputGroup);
  form.append(formGroup);
  content.append(scoreSpan, form);
  renderQuestionOutcome(prevOutcome);
}

function renderQuestionOutcome(outcome) {
  var hr = document.createElement("hr");
  var resultSpan = document.createElement("span");
  resultSpan.textContent = outcome;
  content.append(hr, resultSpan);
  setTimeout(function() {
    hr.style = "display: none;";
    resultSpan.style = "display: none;";
  }, 2000);
}

function renderHighScores() {
  content.innerHTML = "";

  var highscores = getHighscores();
  var highscoreList = document.createElement("ul");
  highscoreList.classList.add("list-group");
  for (let i = 0; i < highscores.length; i++) {
    var li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = highscores[i].initals + " - " + highscores[i].score;
    highscoreList.append(li);
  }
  var backButton = document.createElement("button");
  backButton.classList.add("btn", "btn-secondary");
  backButton.textContent = "Back";
  backButton.addEventListener("click", function(event) {
    event.preventDefault();
    renderStartScreen();
  });
  var clearHighscoresButton = document.createElement("button");
  clearHighscoresButton.classList.add("btn", "btn-secondary");
  clearHighscoresButton.textContent = "Clear Highscores";
  clearHighscoresButton.addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("highscores");
    renderHighScores();
  });
  content.append(highscoreList, backButton, clearHighscoresButton);
}

renderStartScreen();