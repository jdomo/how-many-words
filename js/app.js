console.log(directory.length); //157068 words between 3-9 characters

//GAME ELEMENTS - v1

//1) string of random letters (9) (SCRAMBLE)

      //make 'alphabet' reference object (arrays in object?)
          //consonants: bcdfghlmnprstvwy / jqxzk (21)
          //vowels: aeiou (5)

      const alphabet = {
        vowels: ['a','e', 'i', 'o', 'u'],
        regCons: ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y'],
        hardCons: ['j', 'q', 'x', 'z'],
      }

      
      let scramble = [];

      //need ratio of 5:4 consonants:vowels
          //two loops - one array of 4 vowels, one of 5 consonants
            //vowel array conditions
              //if consonant array includes 'q', make vowels array include 'u'
      
      function makeScramble() {
        //get random vowels
        const randVowels = [];
        for (let i = 0; i < 4; i += 1) {
          randVowels.push(alphabet.vowels[Math.floor(Math.random() * alphabet.vowels.length)]);
        }
        //get random consonants
        const randCons = [];
        for (let i = 0; i < 5; i += 1) {
          randCons.push(alphabet.regCons[Math.floor(Math.random() * alphabet.regCons.length)]);
        }
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
            const scramble = [];
            for (let i = 0; i < 9; i += 1) {
              let randChar = array[Math.floor(Math.random() * array.length)];
              scramble.push(randChar);
              array.splice(array.indexOf(randChar), 1);
              // console.log(randVowelsAndCons);
            }
            return scramble;
          }
            //for loop, <= 9 times

              //make SCRAMBLECOPY of SCRAMBLE
              //make NEWARRAY w/ 9 empty spots - new Array(9).fill('');

              //get RANDOMINDX from 0-8 - Math.floor(Math.random() * 9);

              //if NEWARRAY[RANDOMINDX] is not an empty string, place last character of SCRAMBLECOPY at first blank element in NEWARRAY

              //if NEWARRAY[RANDOMINDX] === '', make it equal to SCRAMBLECOPY[SCRAMBLECOPY.length - 1]
                  //pop off last character of SCRAMBLECOPY

              //repeat til loop terminates

              //set SCRAMBLE equal to NEWARRAY
              
//2) unordered list of words used in current round
    //create/append empty ul with id 'used-words'

//3) round clock (2 minutes?)

    //this.timer = 120; (2 minutes)
    //setInterval to decrement timer every 1000ms
    //when clock finished, reset round

//4) user input box or form for word guesses

      //on submit, grab input and check four conditions
          //const WORD = inputEl.value

      //1- is WORD.length >= 3?

      //2- is WORD already in 'words used'?
          //if true, show 'word already used' in 'invis div'
          //if false, proceed to next condition

      //3- are the letters used valid choices?
          //initialize TEMP with SCRAMBLE
          //loop through WORD, letter by letter (use WORD.length as iteration count)
            //if letter is included in scramble, splice out of TEMP
            //if not, show 'invalid letter choice' in 'invis div'
              //repeat WORD.length times - if no falsy return, proceed to next condition

      //4- is it a word / is it in the directory?
          //directory.includes(word)
          //if true, show 'success' in invisible div
              //append word to 'words used'
              //add a point to round total
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