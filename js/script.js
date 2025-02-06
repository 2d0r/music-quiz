import { submitButton, MAX_QUESTION_NUM, resultsSection } from './constants.js';
import { MIN_FETCH_INTERVAL } from './api.js';
import { 
    deactivateAllAnswerButtons, deselectOtherDifficultyOptions,
    makeUiRed, clearRedUi,
    populateUI,  
} from './uiManagement.js';
import { startQuiz, finishQuiz, restartQuiz, nextQuestion } from './quizManagement.js';

let data = {};
let questionCount = 0;
let score = 0;
let correctAnswerIdx = null;
let difficulty = 'mixed';

document.addEventListener('DOMContentLoaded', () => {

    populateUI();

    // Making sure more than 5 seconds passed since the last data fetch
    // Trivia API is limited at 1 fetch every 5 seconds
    const msSinceLastFetch = new Date() - Date.parse(localStorage.getItem('fetchTime'));
    if (msSinceLastFetch <= MIN_FETCH_INTERVAL) {
        // Disable submit button and display 'loading' while fetching data
        submitButton.classList.add('disabled');
        submitButton.innerText = 'Loading...';
        setTimeout(() => {
            // Enable submit button once the data was fetched
            submitButton.classList.remove('disabled');
            submitButton.innerText = 'Start';
        }, MIN_FETCH_INTERVAL - msSinceLastFetch + 500);
    }

    // Handle click on the submitButton
    submitButton.addEventListener('click', async () => {
        // Don't do anything if button has the class disabled
        if (submitButton.classList.contains('disabled')) {
            return;
        }
        if (questionCount === 0 || submitButton.innerText === 'Start') {
            // Start quiz if questions count hasn't started
            data = await startQuiz(difficulty);
            // Populate question
            correctAnswerIdx = nextQuestion(data, questionCount);
            questionCount += 1;
        } else if (questionCount === MAX_QUESTION_NUM) {
            // Finish quiz if question count is at the last question
            finishQuiz(score);
            questionCount += 1;
        } else if (!resultsSection.classList.contains('hidden')) {
            // Restart quiz once results are displayed
            restartQuiz();
            // Reset question count and score
            score = 0;
            questionCount = 0;
        } else {
            // Otherwise, go to next question
            correctAnswerIdx = nextQuestion(data, questionCount);
            questionCount += 1;
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