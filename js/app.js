//ELEMENT SELECTION (GLOBAL)
const beginBtn = document.querySelector('#begin-btn');  
const nextRoundBtn = document.querySelector('#nextround-btn');
const reArrangeBtn = document.querySelector('#rearrange-btn');
const submitBtn = document.querySelector('#submit-btn'); 
const versaDiv = document.querySelector('#versa-div');
const wordInput = document.querySelector('#word-input');
const round = document.querySelector('#round'); 
const roundScore = document.querySelector('#round-score');
const totalScore = document.querySelector('#total-score');
const hiRoundScore = document.querySelector('#hi-round-score');
const currWordCount = document.querySelector('#curr-word-count');
const wordsUsed = document.querySelector('#words-used');
const yourScramble = document.querySelector('#scramble');
const timeLeft = document.querySelector('#time-left');
const msgPara = document.querySelector('#msg');

//EVENT LISTENERS (GLOBAL)
beginBtn.addEventListener('click', () => {
  if (game.time === 120) {
    game.nextRound();
    beginBtn.classList.add('hide');
  }
})

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  yourScramble.innerText = game.stringify(game.scramble);
  game.wordGuess = wordInput.value.toLowerCase();
  wordInput.value = '';
  game.checkWordGuess(game.wordGuess);
});

reArrangeBtn.addEventListener('click', () => {
  if (game.scramble.length) {
    wordInput.value = '';
    const rearranged = game.scrambleThis(game.scramble);
    game.scramble = rearranged;
    yourScramble.innerText = game.stringify(game.scramble);
  }
})

nextRoundBtn.addEventListener('click', () => {
  if (game.time === 0) {
    game.nextRound();
    nextRoundBtn.classList.add('hide');
    submitBtn.classList.remove('invisible');
    wordInput.classList.remove('invisible');
  }
});

    ////Live update - Scramble display
wordInput.addEventListener('input', () => {
  yourScramble.innerText = game.stringify(game.scramble);
  game.scrambleDisplay = [...game.scramble];
  const inputArray = wordInput.value.split('');
  inputArray.forEach(item => {
    if (game.scrambleDisplay.includes(item)) {
      game.scrambleDisplay.splice(game.scrambleDisplay.indexOf(item), 1);
      yourScramble.innerText = game.stringify(game.scrambleDisplay);
    }
  })
});

//GAME OBJECT
const game = {
  time: 120,
  round: 0,
  roundScore: 0,
  totalScore: 0,
  hiRoundScore: 0,
  
  scramble: [],
  scrambleCopy: [],
  scrambleDisplay: [],

  wordGuess: null,
  wordsUsed: [],

  alphabet: {
    vowels: ['a','e', 'i', 'o', 'u'],
    regCons: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y'],
    hardCons: ['j', 'q', 'x', 'z'],
  },

  //HELPER FUNCTIONS
  scrambleThis(array) {
    const tempScramble = [];
    for (let i = 0; i < 9; i += 1) {
      let randChar = this.randomLetter(array);
      tempScramble.push(randChar);
      array.splice(array.indexOf(randChar), 1);
    }
    return tempScramble;
  },

  randomLetter(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  stringify(arr) {
    let str = '';
    arr.forEach(item => {
      str += `${item} `;
    });
    return str.toUpperCase();
  },

  appendWord(word) {
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = word;
    ul.append(li);
  },

  emptyWordsUsed() {
    while (document.querySelector('#words-used li')) {
      let liToRemove = document.querySelector('#words-used li');
      liToRemove.remove();
    }
  },

  tradeClass(el, activeClass, timeOut = 0, desiredClass = activeClass) {
    el.classList.remove(activeClass);
    setTimeout(() => el.classList.add(desiredClass), timeOut);
  },

  displayMsg(text) {
    if (text === 'nice!') {
      this.tradeClass(msgPara, "red", '', "green");
      this.tradeClass(msgPara, "green", 1500, "red");
    }
    msgPara.innerText = text;
    this.tradeClass(msgPara, "no-opacity", 1200);
  },

  //MAIN GAME FUNCTIONS
  setTimer() {
    this.time = 120;
    timeLeft.style.color = "#14ad1c";
    const timer = setInterval(() => {
      if (this.time <= 30) timeLeft.style.color = "#FF0000";
      this.time -= 1;
      timeLeft.innerText = this.time;
      if (this.time === 0) {
        clearInterval(timer);
        this.checkHiRoundScore();
        submitBtn.classList.add('invisible');
        wordInput.classList.add('invisible');
        nextRoundBtn.classList.remove('hide');
      }
    }, 1000)
  },
  
  makeScramble() {
    const randVowels = [];
    const randCons = [];
    let hardConIncluded = false;  
    //get random vowels
    for (let i = 0; i < 4; i += 1) {
      randVowels.push(this.randomLetter(this.alphabet.vowels));
      //include common digraphs if possible 'er', 'on', 'an'
      if (randVowels.includes('e') && !randCons.includes('r')) randCons.push('r');
      if ((randVowels.includes('o') || randVowels.includes('a')) && !randCons.includes('n')) randCons.push('n');
    }
    
    //get length of randCons at this stage for static reference in next loop
    const randConslength = randCons.length;

    //fill remainder of randCons array
    for (let i = 0; i < (5 - (randConslength)); i += 1) {
      //variable to serve as probability for inclusion of certain letters
      let letterChance = Math.random();

      //2.5 percent chance of a difficult consonant (hardCons) (z,x,q,j) being included
      if (letterChance < 0.025 && !hardConIncluded) {
        //inserted at second index so it doesn't get shifted or popped off
        randCons[1] = (this.randomLetter(this.alphabet.hardCons));
        //no more than 1 hardCon per scramble
        hardConIncluded = true;
        //must include a 'u' if 'q' is included
        if (randCons.includes('q')) {
          randVowels.push('u');
          randVowels.shift();
        }
      }

      //20% chance of forced 'e' inclusion
      if (!randVowels.includes('e') && letterChance < 0.2) {
        randVowels.push('e');
        randVowels.shift();
      }

      //if no hard consonant included, push a regular consonant
      
      //if 't' present, 50% chance of including an 'h' ('th' - common digraph)
      if (randCons.includes('t') && !randCons.includes('h') && letterChance < 0.5) {
        randCons.push('h');
        randCons.shift();
      }
      randCons.push(this.randomLetter(this.alphabet.regCons));
    }

    //concatenate random vowel and consonant arrays
    const randVowelsAndCons = randVowels.concat(randCons);
    //randomize combo array and assign to game's scramble property
    return this.scrambleThis(randVowelsAndCons);
  },

  checkWordGuess(word) {
    //1- is WORD.length >= 3?
    if (word.length < 3 || word.length > 9) {
      if (word.length < 3) this.displayMsg('use at least 3 characters');
      return false;
    }
    //2- is WORD already in 'words used'?
    if (this.wordsUsed.includes(word)) {
      this.displayMsg('word already used');
      return false;
    }
    //3- are the letters used valid choices i.e. present in scramble?
    this.scrambleCopy = [...this.scramble];
    for (let i = 0; i < word.length; i += 1) {
      if (!(this.scrambleCopy.includes(word[i]))) {
        this.displayMsg(`invalid letter choice(s)`);
        return false;
      } 
      this.scrambleCopy.splice(this.scrambleCopy.indexOf(word[i]), 1);
    }
    //4- is it a word / is it in the directory?
    if (!(directory.includes(word))) {
      this.displayMsg('word is not in dictionary');
      return false;
    }
    this.wordsUsed.push(word);
    this.appendWord(word);
    this.roundScore += 1;
    roundScore.innerText = `Round Score: ${this.roundScore}`;
    currWordCount.innerText = this.roundScore;
    this.displayMsg('nice!');
  },

  checkHiRoundScore() {
    if (this.roundScore > this.hiRoundScore) {
      this.hiRoundScore = this.roundScore;
    }
    hiRoundScore.innerText = `Most Words: ${this.hiRoundScore}`;
  },

  nextRound() {
    this.round += 1;
    this.totalScore += this.roundScore;
    this.roundScore = 0;
    this.wordsUsed = [];
    this.scramble = this.makeScramble();
    
    round.innerText = `Round: ${this.round}`;
    totalScore.innerText = `Total Score: ${this.totalScore}`;
    roundScore.innerText = `Round Score: ${this.roundScore}`;
    currWordCount.innerText = this.roundScore;
    yourScramble.innerText = game.stringify(this.scramble);
    this.scrambleDisplay = [...this.scramble];
    this.emptyWordsUsed();
    this.setTimer();
  },
}