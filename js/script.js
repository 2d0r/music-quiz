const submitButton = document.getElementById('submit-button');
const answersSection = document.getElementById('answers-section');
const tutorialSection = document.getElementById('tutorial-section');
const resultsSection = document.getElementById('results-section');
const heading = document.getElementById('heading');
let questionCount = 0;
let data = {};
let questionObject = {};
let score = 0;
let correctAnswerNum = null;

document.addEventListener('DOMContentLoaded', () => {

    // Handle click on the submitButton
    submitButton.addEventListener('click', () => {
        if (submitButton.classList.contains('disabled')) {
            return;
        }
        if (questionCount === 0 || submitButton.innerText === 'Start') {
            startQuiz();
        } else if (questionCount === 10) {
            finishQuiz();
        } else if (questionCount === 11) {
            restartQuiz();
        } else {
            nextQuestion();
        }
        // Reset red UI ever time submit button is clicked
        clearRedUi();
    });

    // Handle selecting an answer
    for (let i = 1; i <= 4; i++) {
        const selectedAnswer = document.getElementById(`answer-${i}`);
        selectedAnswer.addEventListener('click', () => {
            // Check that button is not disabled (which is the case when an answer was already selected)
            if (!selectedAnswer.classList.contains('disabled')) {
                if (i === correctAnswerNum) {
                    selectedAnswer.classList.add('correct', 'selected');
                    score += 1;
                } else {
                    selectedAnswer.classList.add('incorrect', 'selected');
                    document.getElementById(`answer-${correctAnswerNum}`).classList.add('correct');
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
});

const fetchQuestionsFromTriviaAPI = async () => {
    try {
        const result = await fetch('https://opentdb.com/api.php?amount=10&category=12&type=multiple');
        const json = await result.json();
        return json;
    } catch (error) {
        // Handle failing to fetch data
    }
}

// Function to start quiz, from the tutorial page
const startQuiz = async () => {
    // Fetch questions from Trivia API
    data = await fetchQuestionsFromTriviaAPI();
    submitButton.innerText = 'Next';
    // Hide the tutorial
    tutorialSection.classList.add('hidden');
    // Show the first question
    answersSection.classList.remove('hidden');
    // Populate question
    nextQuestion();
}

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
}

// Function to populate the next question
const nextQuestion = () => {
    // Get question object from data
    const questionObject = data.results[questionCount];
    questionCount += 1;

    // Update heading with question text (function learnt from chatGPT)
    heading.innerText = questionCount + '. ' + decodeHtmlEntities(questionObject.question);

    // Populate answers, randomising the placement of the correct answer
    correctAnswerNum = Math.floor(Math.random() * 4) + 1;
    let incorrectAnswers = questionObject['incorrect_answers'];
    for (let i = 1; i <= 4; i++) {
        const answerButton = document.getElementById(`answer-${i}`);
        // Reset answer button status
        answerButton.classList.remove('correct', 'incorrect', 'selected');
        if ( i === correctAnswerNum ) {
            answerButton.innerText = decodeHtmlEntities(questionObject['correct_answer']);
        } else {
            answerButton.innerText = decodeHtmlEntities(incorrectAnswers.shift());
        }
    }
    // Re-enable all answer buttons
    activateAllAnswerButtons();
    // Disable submit button until user selects an answer
    submitButton.classList.add('disabled');
    // Change submit button to finish on last question
    if (questionCount === 10) {
        submitButton.innerText = 'Finish';
    }
}

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
}


// UTILITY FUNCTIONS

// Decode html entities present in data (function learnt from chatGPT)
const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(str, 'text/html').body.textContent;
    return decoded;
}

const deactivateAllAnswerButtons = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`answer-${i}`).classList.add('disabled');
    }
}

const activateAllAnswerButtons = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`answer-${i}`).classList.remove('disabled');
    }
}

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
}

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
}