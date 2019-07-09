// console.log(directory.length); //157068 words between 3-9 characters

//GAME ELEMENTS - v1

//1) string of random letters (9) (SCRAMBLE)

      //make 'alphabet' reference object (arrays in object?)
          //consonants: bcdfghlmnprstvwy / jqxzk (21)
          //vowels: aeiou (5)

      const alphabet = {
        vowels: ['a','e', 'i', 'o', 'u'],
        //'n' not included in regCons - will be included automatically with presence of 'o' or 'a'
        regCons: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'p', 'r', 's', 't', 'v', 'w', 'y'],
        hardCons: ['j', 'q', 'x', 'z'],
      }

      
      let scramble = [];
      
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

          //if no 'e' in random vowels array, 70% chance of forced inclusion (approx. 70% of english words contain an 'e')
      
      function makeScramble() {
        const randVowels = [];
        const randCons = [];
        let hardConIncluded = false;  
        //get random vowels
        for (let i = 0; i < 4; i += 1) {
          randVowels.push(randomLetter(alphabet.vowels));
          //include common digraphs if possible 'er', 'on', 'an'
          if (randVowels.includes('e') && !randCons.includes('r')) randCons.push('r');
          if ((randVowels.includes('o') || randVowels.includes('a')) && !randCons.includes('n')) randCons.push('n');
        }
        
        console.log(`${randVowels} <--- randVowels`)
        //get length of randCons at this stage for static reference in next loop
        const randConslength = randCons.length;

        //fill remainder of randCons array
        for (let i = 0; i <= (5 - (randConslength)); i += 1) {
          //variable to serve as probability for inclusion of certain letters
          let letterChance = Math.random();

          //2.5 percent chance of a difficult consonant (hardCons) (z,x,q,j) being included
          if (letterChance < 0.025 && !hardConIncluded) {
            randCons.push(randomLetter(alphabet.hardCons));
            console.log('hardCon included');
            hardConIncluded = true;
            //must include a 'u' if 'q' is included
            if (randCons.includes('q')) {
              randVowels.push('u');
              randVowels.shift();
            }
            //start loop again so that randCons.length isn't > 5
            continue;
          }

          //70% chance of forced 'e' inclusion
          if (!randVowels.includes('e') && letterChance < 0.7) {
            randVowels.push('e');
            randVowels.shift();
          }

          //if no hard consonant included, push a regular consonant
          randCons.push(randomLetter(alphabet.regCons));

          //if 't' present, 50% chance of including an 'h' ('th' - common digraph)
          if (randCons.includes('t') && !randCons.includes('h') && letterChance < 0.5) {
            randCons.push('h');
            randCons.shift();
            console.log(`randCons length is ${randCons.length}`)
          }
        }
        console.log(`${randCons} <--- randCons`)        
        //concatenate random vowel and consonant arrays
        const randVowelsAndCons = randVowels.concat(randCons);
        //randomize combo array and save to global scramble array
        scramble = scrambleThis(randVowelsAndCons);
        console.log(scramble);
      }
            //consonant array conditions
              //don't include more than one j,q,x,z,k?

            //concatenate the two arrays which makes our SCRAMBLE array
        
      //1b) rearrange button - use scramble function

          //scramble function
          function scrambleThis(array) {
            const tempScramble = [];
            for (let i = 0; i < 9; i += 1) {
              let randChar = randomLetter(array);
              tempScramble.push(randChar);
              array.splice(array.indexOf(randChar), 1);
            }
            return tempScramble;
          }

          //random letter function
          function randomLetter(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
          }


              
//2) unordered list of words used in current round
    //create/append empty ul with id 'used-words'

//3) round clock (2 minutes?)

    //this.timer = 120; (2 minutes)
    //setInterval to decrement timer every 1000ms
    //when clock finished, reset round

//4) user input box or form for word guesses

      //on submit, grab input and check four conditions
          //const WORD = inputEl.value

      const wordsUsed = [];
      let roundScore = 0;
      const submitBtn = document.querySelector('#submit-btn');
      const wordInput = document.querySelector('#word-input');
      let wordGuess;

      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        wordGuess = wordInput.value;
        wordInput.value = '';
        console.log(`word guessed is ${wordGuess}`);
        checkWordGuess(wordGuess);
      });

      function checkWordGuess(word) {
        //1- is WORD.length >= 3?
        if (word.length < 3 || word.length > 9) {
          console.log('invalid word length');
          return false;
        }
        //2- is WORD already in 'words used'?
        if (wordsUsed.includes(word)) {
          console.log('word already used');
          return false;
        }
        //3- are the letters used valid choices?
        const scrambleCopy = [...scramble];
        for (let i = 0; i < word.length; i += 1) {
          if (!(scrambleCopy.includes(word[i]))) {
            console.log('invalid letter choice: ${word[i]}');
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
        wordsUsed.push(word);
        appendWord(word);
        roundScore += 1;
        console.log(`success! words used: ${wordsUsed}, round score: ${roundScore}`);
      }

      function appendWord(word) {
        const ul = document.querySelector('ul');
        const li = document.createElement('li');
        li.innerText = word;
        ul.append(li);
      }

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