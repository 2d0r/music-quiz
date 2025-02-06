import { MAX_QUESTION_NUM } from './constants.js';

export const fetchQuestionsFromTriviaAPI = async (difficulty) => {
    const difficultyUrlParam = difficulty === 'mixed' ? '' : `&difficulty=${difficulty}`;
    try {
        // Fetch based on selected difficulty using url parameter
        const result = await fetch(`https://opentdb.com/api.php?amount=${MAX_QUESTION_NUM}&category=12&type=multiple${difficultyUrlParam}`);
        const json = await result.json();
        return json;
    } catch (error) {
        // Handling data fetch error
        alert('Failed to fetch questions from Open Trivia Database. Refresh and try again');
        console.error('Failed to fetch data with Trivia API', error);
    }
};

export const MIN_FETCH_INTERVAL = 5000; //ms