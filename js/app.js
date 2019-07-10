//ELEMENT SELECTION (GLOBAL)

const beginBtn = document.querySelector('#begin-btn');  
const submitBtn = document.querySelector('#submit-btn'); 
const wordInput = document.querySelector('#word-input'); 
const roundScore = document.querySelector('#round-score');
const totalScore = document.querySelector('#total-score');
const yourScramble = document.querySelector('#scramble');
const timeLeft = document.querySelector('#time-left');

//EVENT LISTENERS (GLOBAL)

beginBtn.addEventListener('click', () => {
  if (game.time === 120) {
    game.setTimer();
    game.makeScramble();
    yourScramble.innerText = game.scramble;
  }
})

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  game.wordGuess = wordInput.value;
  wordInput.value = '';
  console.log(`word guessed is ${game.wordGuess}`);
  game.checkWordGuess(game.wordGuess);
});

//GAME OBJECT
const game = {
  time: 120,
  roundScore: 0,
  totalScore: 0,

  alphabet: {
    vowels: ['a','e', 'i', 'o', 'u'],
    regCons: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y'],
    hardCons: ['j', 'q', 'x', 'z'],
  },
  scramble: [],

  wordGuess: null,
  wordsUsed: [],

  setTimer() {
    const timer = setInterval(() => {
      this.time -= 1;
      timeLeft.innerText = this.time;
      if (this.time === 0) {
        clearInterval(timer);
        this.time = 120;
        this.round += 1;
        this.totalScore += this.roundScore;
        this.roundScore = 0;
        this.scramble = [];
      }
    }, 1000)
  },

  //HELPER FUNCTIONS ----

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

  appendWord(word) {
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = word;
    ul.append(li);
  },

  //END OF HELPER FUNCTIONS ----

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
        randCons[1] = (randomLetter(this.alphabet.hardCons)); //inserted at second index so it doesn't get shifted or popped off
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
    //randomize combo array and save to global scramble array
    this.scramble = this.scrambleThis(randVowelsAndCons);
  },

  checkWordGuess(word) {
    //1- is WORD.length >= 3?
    if (word.length < 3 || word.length > 9) {
      console.log('invalid word length');
      return false;
    }
    //2- is WORD already in 'words used'?
    if (this.wordsUsed.includes(word)) {
      console.log('word already used');
      return false;
    }
    //3- are the letters used valid choices i.e. present in scramble?
    const scrambleCopy = [...this.scramble];
    for (let i = 0; i < word.length; i += 1) {
      if (!(scrambleCopy.includes(word[i]))) {
        console.log(`invalid letter choice: ${word[i]}`);
        return false;
      } 
      scrambleCopy.splice(scrambleCopy.indexOf(word[i]), 1);
      console.log(`valid letter, letters left: ${scrambleCopy}`);
    }
    //4- is it a word / is it in the directory?
    if (!(directory.includes(word))) {
      console.log('word is not in dictionary');
      return false;
    }
    this.wordsUsed.push(word);
    this.appendWord(word);
    this.roundScore += 1;
    console.log(`success! words used: ${this.wordsUsed}, round score: ${this.roundScore}`);
  },
}

//------------------------------

//GAME ELEMENTS - v1
//1) string of random letters (9) (SCRAMBLE)

      //make 'alphabet' reference object (arrays in object?)
          //consonants: bcdfghlmnprstvwy / jqxzk (21)
          //vowels: aeiou (5)

      // const alphabet = {
      //   vowels: ['a','e', 'i', 'o', 'u'],
      //   //'n' not included in regCons - will be included automatically with presence of 'o' or 'a'
      //   regCons: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y'],
      //   hardCons: ['j', 'q', 'x', 'z'],
      // }

      
      // let scramble = [];
      
      //CRAZY SCRAMBLE-MAKING FUNCTION

        //need ratio of 5:4 consonants:vowels
            //two loops - one array of 4 vowels, one of 5 consonants

        //letter array conditions - make longer words more probable
          //digraph rules for 'en', 'an', 'th' (most common two-letter combos)
            //if consonant array includes 'q', make vowels array include 'u'
            //if vowel array includes 'e' or 'a', make consonant array include an 'n'
            //if consonant array includes 't', 50% chance it also includes an 'h'

          //2.5% chance of difficult consonant inclusion (q,z,x,j)
            //if 'q' gets included, must also include 'u' (very few english words with only a 'q')

          //if no 'e' in random vowels array, 20% chance of forced inclusion (approx. 70% of english words contain an 'e' -- chance adjusted to reflect this)
        
      //1b) rearrange button - use scramble function
              
//2) unordered list of words used in current round
    //create/append empty ul with id 'used-words'

//3) round clock (2 minutes?) //game

    //this.timer = 120; (2 minutes)
    //setInterval to decrement timer every 1000ms
    //when clock finished, reset round

//4) user input box or form for word guesses

      //on submit, grab input and check four conditions
          //const WORD = inputEl.value

          //2 if true, show 'word already used' in 'invis div'
          //if false, proceed to next condition

          //3 initialize TEMP with SCRAMBLE as value
          //loop through WORD, letter by letter (use WORD.length as iteration count)
            //if letter is included in scramble, splice out of TEMP
            //if not, show 'invalid letter choice' in 'invis div'
              //repeat WORD.length times - if no falsy return, proceed to next condition

          //4 directory.includes(word)
          //if true, show 'success' in invisible div
              //append word to 'words used' - use a function
              //add a point to round score
                  //extra feature: points for word length? length score?

          //if false, show 'invalid word' in 'invis div'

//5) invisible div with user feedback
      //>> 'not a word'/'success'
      //>> 'don't repeat letters/invalid character used'

//6) round total

//7) game total

//8) round reset logic

      //>> add round total to game total
        //>> reset round total

      //>> make new SCRAMBLE

      //reset round clock


//write functions outside of game object
//call inside game object

//score, etc. inside game object

//what needs to reset every round?