import {
    submitButton, heading,
    tutorialSection, answersSection, resultsSection,
    LONG_QUESTION_LENGTH, MAX_QUESTION_NUM,
} from './constants.js';
import { fetchQuestionsFromTriviaAPI } from './api.js';
import { activateAllAnswerButtons } from './uiManagement.js';
import { decodeHtmlEntities, shuffle } from './utils.js';

// Function to start quiz, from the tutorial page
export const startQuiz = async (difficulty) => {
    // Fetch questions from Trivia API
    const data = await fetchQuestionsFromTriviaAPI(difficulty);
    // Update submit button
    submitButton.innerText = 'Next';
    // Hide the tutorial
    tutorialSection.classList.add('hidden');
    // Show the first question
    answersSection.classList.remove('hidden');
    return data;
};

// Function to finish last quiz question and view final score
export const finishQuiz = (score) => {
    // Update heading for results
    heading.innerText = score < MAX_QUESTION_NUM / 2 ? 'Oh... you only scored'
        : score <= MAX_QUESTION_NUM * 8/10 ? 'Not bad! You scored'
        : 'Wow! You scored a whopping';
    // Hide answers section, display results section
    answersSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    // Display score
    document.getElementById('score').innerText = score + ` point${score > 1 ? 's' : ''}`;
    document.getElementById('score-details').innerText = `out of ${MAX_QUESTION_NUM}`;
    // Update submit button
    submitButton.innerText = 'Restart quiz';
};

// Function to populate the next question
export const nextQuestion = (data, questionCount) => {
    // Get question object from data
    const questionObject = data.results[questionCount];

    // Update heading with question text (function learnt from chatGPT)
    const questionText = decodeHtmlEntities(questionObject.question);
    heading.innerText = (questionCount + 1) + '. ' + questionText;
    if (questionText.length > LONG_QUESTION_LENGTH) {
        document.getElementById('heading').classList.add('shrink');
    }

    // Populate answer buttons, randomising the placement of the correct answer
    // Shuffle answers
    let answers = shuffle([...questionObject.incorrect_answers, questionObject.correct_answer]);
    let correctAnswerIdx = -1;
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
    if (questionCount === MAX_QUESTION_NUM - 1) {
        submitButton.innerText = 'Finish';
    }
    return correctAnswerIdx;
};

// Function to restart quiz, from score page
export const restartQuiz = () => {
    // Populate content to display the tutorial
    submitButton.innerText = 'Start';
    heading.innerText = 'How to play';
    resultsSection.classList.add('hidden');
    tutorialSection.classList.remove('hidden');
};