const submitButton = document.getElementById('submit-button');
const answersSection = document.getElementById('answers-section');
const tutorialSection = document.getElementById('tutorial-section');
const resultsSection = document.getElementById('results-section');
const heading = document.getElementById('heading');

let questionCount = 0;
let data = {};
let score = 0;
let correctAnswerIdx = null;
let difficulty = 'mixed';

document.addEventListener('DOMContentLoaded', () => {

    // Making sure more than 5 seconds passed since the last data fetch
    // Trivia API is limited at 1 fetch every 5 seconds
    const msSinceLastFetch = new Date() - Date.parse(localStorage.getItem('fetchTime'));
    if (msSinceLastFetch <= 5000) {
        // Disable submit button and display 'loading' while fetching data
        submitButton.classList.add('disabled');
        submitButton.innerText = 'Loading...';
        setTimeout(() => {
            // Enable submit button once the data was fetched
            submitButton.classList.remove('disabled');
            submitButton.innerText = 'Start';
        }, 5500 - msSinceLastFetch);
    }

    // Handle click on the submitButton
    submitButton.addEventListener('click', () => {
        // Don't do anything if button has the class disabled
        if (submitButton.classList.contains('disabled')) {
            return;
        }
        if (questionCount === 0 || submitButton.innerText === 'Start') {
            // Start quiz if questions count hasn't started
            startQuiz();
        } else if (questionCount === 10) {
            // Finish quiz if question count is at the last question
            finishQuiz();
        } else if (questionCount > 10) {
            // Restart quiz if question count is bigger than the last question
            restartQuiz();
        } else {
            // Otherwise, go to next question
            nextQuestion();
        }
        // Reset red UI ever time submit button is clicked
        clearRedUi();
    });

    // Handle selecting an answer
    for (let i = 0; i <= 3; i++) {
        const selectedAnswer = document.getElementById(`answer-${i}`);
        selectedAnswer.addEventListener('click', () => {
            // Check that button is not disabled (which is the case when an answer was already selected)
            if (!selectedAnswer.classList.contains('disabled')) {
                if (i === correctAnswerIdx) {
                    selectedAnswer.classList.add('correct', 'selected');
                    score += 1;
                } else {
                    selectedAnswer.classList.add('incorrect', 'selected');
                    document.getElementById(`answer-${correctAnswerIdx}`).classList.add('correct');
                    // Make more elements of the UI red to signal the wrong answer
                    makeUiRed();
                }
                // Deactivate all other answer buttons, so a second answer can't be selected
                deactivateAllAnswerButtons();
                // Activate submitButton to navigate to the next question
                submitButton.classList.remove('disabled');
            }
        });
    }

    // Handle selecting difficulty
    for(let i = 0; i <= 3; i++) {
        const difficultyOption = document.getElementById(`difficulty-${i}`);
        difficultyOption.addEventListener('click', () => {
            difficultyOption.classList.add('selected');
            // Deselect all other difficulties
            deselectOtherDifficultyOptions(i);
            // Save selected difficulty
            difficulty = difficultyOption.textContent.toLowerCase();
        });
    }
});

const fetchQuestionsFromTriviaAPI = async (difficulty) => {
    const difficultyUrlParam = difficulty === 'mixed' ? '' : `&difficulty=${difficulty}`;
    try {
        // Fetch based on selected difficulty using url parameter
        const result = await fetch(`https://opentdb.com/api.php?amount=10&category=12&type=multiple${difficultyUrlParam}`);
        const json = await result.json();
        return json;
    } catch (error) {
        // Handling data fetch error
        alert('Failed to fetch questions from Open Trivia Database. Refresh and try again');
        console.error('Failed to fetch data with Trivia API', error);
    }
};

// Function to start quiz, from the tutorial page
const startQuiz = async () => {
    // Record time right before fetch (to handle the limitation of 1 request every 5 seconds)
    localStorage.setItem('fetchTime', new Date());
    // Fetch questions from Trivia API
    data = await fetchQuestionsFromTriviaAPI(difficulty);
    submitButton.innerText = 'Next';
    // Hide the tutorial
    tutorialSection.classList.add('hidden');
    // Show the first question
    answersSection.classList.remove('hidden');
    // Populate question
    nextQuestion();
};

// Function to finish last quiz question and view final score
const finishQuiz = () => {
    // Update heading to results
    heading.innerText = 'You scored';
    // Hide answers section, display results section
    answersSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    // Display score
    document.getElementById('score').innerText = score + ` point${score > 1 ? 's' : ''}`;
    // Update submit button
    submitButton.innerText = 'Restart quiz';
    // Increase question count
    questionCount += 1;
};

// Function to populate the next question
const nextQuestion = () => {
    // Get question object from data
    const questionObject = data.results[questionCount];
    questionCount += 1;

    // Update heading with question text (function learnt from chatGPT)
    const questionText = decodeHtmlEntities(questionObject.question);
    heading.innerText = questionCount + '. ' + questionText;
    if (questionText.length > 80) {
        document.getElementById('heading').classList.add('shrink');
    }

    // Populate answer buttons, randomising the placement of the correct answer
    // Shuffle answers
    let answers = shuffle([...questionObject.incorrect_answers, questionObject.correct_answer]);
    for (let i = 0; i <= 3; i++) {
        const answerButton = document.getElementById(`answer-${i}`);
        // Reset answer button status
        answerButton.classList.remove('correct', 'incorrect', 'selected');
        // Save correct answer index
        if (answers[i] === questionObject.correct_answer) {
            correctAnswerIdx = i;
        }
        // Hide button if there are fewer than 4 answers provided
        if (!answers[i]) {
            answerButton.hidden = 'true';
        }
        // Populate text on button
        answerButton.innerText = decodeHtmlEntities(answers[i]);
    }
    // Re-enable all answer buttons
    activateAllAnswerButtons();
    // Disable submit button until user selects an answer
    submitButton.classList.add('disabled');
    // Change submit button to finish on last question
    if (questionCount === 10) {
        submitButton.innerText = 'Finish';
    }
};

// Function to restart quiz, from score page
const restartQuiz = () => {
    // Reset question count and score
    questionCount = 0;
    score = 0;
    // Populate content to display the tutorial
    submitButton.innerText = 'Start';
    heading.innerText = 'How to play';
    resultsSection.classList.add('hidden');
    tutorialSection.classList.remove('hidden');
};


// UTILITY FUNCTIONS

// Decode html entities present in data (function learnt from chatGPT)
const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(str, 'text/html').body.textContent;
    return decoded;
};

// Function to deactivate all answer buttons
const deactivateAllAnswerButtons = () => {
    for (let i = 0; i <= 3; i++) {
        document.getElementById(`answer-${i}`).classList.add('disabled');
    }
};

// Function to activate all answer buttons
const activateAllAnswerButtons = () => {
    for (let i = 0; i <= 3; i++) {
        document.getElementById(`answer-${i}`).classList.remove('disabled');
    }
};

// Function to make UI elements red to signal wrong answer
const makeUiRed = () => {
    // Make main's border red
    document.getElementById('main').classList.add('red');
    // Make note symbols red
    const symbols = document.getElementsByClassName('symbol');
    for (let symbol of symbols) {
        symbol.src = 'assets/images/musicquiz-red.png';
    }
    // Make quiz title red
    const titles = document.getElementsByClassName('title');
    for (let title of titles) {
        title.classList.add('red');
    }
};

// Function to clear red UI elements when moving to a new question
const clearRedUi = () => {
    document.getElementById('main').classList.remove('red');
    // Revert note symbols to green
    const symbols = document.getElementsByClassName('symbol');
    for (let symbol of symbols) {
        symbol.src = 'assets/images/musicquiz-green.png';
    }
    // Revert quiz title
    const titles = document.getElementsByClassName('title');
    for (let title of titles) {
        title.classList.remove('red');
    }
};

// Function to deselect other difficulty options when selecting one
const deselectOtherDifficultyOptions = (selectedDifficultyIdx) => {
    for (let i = 0; i <= 3; i++) {
        if (i !== selectedDifficultyIdx) {
            document.getElementById(`difficulty-${i}`).classList.remove('selected');
        }
    }
};

// Function to shuffle array (Fisher Yates)
// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 