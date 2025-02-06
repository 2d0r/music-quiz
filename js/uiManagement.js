// Function to deactivate all answer buttons
export const deactivateAllAnswerButtons = () => {
    for (let i = 0; i <= 3; i++) {
        document.getElementById(`answer-${i}`).classList.add('disabled');
    }
};

// Function to activate all answer buttons
export const activateAllAnswerButtons = () => {
    for (let i = 0; i <= 3; i++) {
        document.getElementById(`answer-${i}`).classList.remove('disabled');
    }
};

// Function to make UI elements red to signal wrong answer
export const makeUiRed = () => {
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
export const clearRedUi = () => {
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
export const deselectOtherDifficultyOptions = (selectedDifficultyIdx) => {
    for (let i = 0; i <= 3; i++) {
        if (i !== selectedDifficultyIdx) {
            document.getElementById(`difficulty-${i}`).classList.remove('selected');
        }
    }
};