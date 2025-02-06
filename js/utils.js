// Decode html entities present in data (function learnt from chatGPT)
export const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(str, 'text/html').body.textContent;
    return decoded;
};

// Function to shuffle array (Fisher Yates)
// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
export const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 