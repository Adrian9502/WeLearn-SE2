// data structure containing the exercises data
const binaryData = {
  Addition: [
    // Exercise 1
    {
      title: "Addition 1",
      instruction:
        "Add binary numbers by aligning them, adding each column right to left, tracking carry-overs, writing down results for each column, and carrying over any excess to the next left column until all bits are added.",
      questions: [
        `Add the binary numbers 1011 and 1101 from right to left, carrying over any values as needed.

            1011 + 1101 = ______`,
      ],
      answer: "11000",
    },
    // Exercise 2
    {
      title: "Addition 2",
      instruction:
        "Add binary numbers by aligning them and adding each column from right to left, noting carry-overs, and continuing until all bits are added.",
      questions: [
        `Add the binary numbers 1001 and 0011, starting from the rightmost bits and moving left, carrying over any overflow.

            1001 + 0011 = ______`,
      ],
      answer: "1100",
    },
    // Exercise 3
    {
      title: "Addition 3",
      instruction:
        "Add binary numbers by aligning them, adding each column from right to left, noting any carry-over, and continuing until all bits are added.",
      questions: [
        `Add the binary numbers 1110 and 0111 by adding each corresponding bit from right to left, carrying over any overflow to the next bit position.

            1110 + 0111 = ______`,
      ],
      answer: "10101",
    },
    // Exercise 4
    {
      title: "Addition 4",
      instruction:
        "Add binary numbers by aligning them, adding each column right to left, tracking carry-overs, and continuing until all bits are added.",
      questions: [
        `Add 1100 and 0101 by starting from the right, adding each pair, carrying over as necessary, and moving left.

            1100 + 0101 = ______`,
      ],
      answer: "10001",
    },
    // Exercise 5
    {
      title: "Addition 5",
      instruction:
        "Align binary numbers by their least significant bit, add each column from right to left, track carry-over, and continue until all bits are added.",
      questions: [
        `Add the binary numbers 10101 and 01101 by adding each corresponding bit from right to left, carrying over any overflow to the next bit position.

            10101 + 01101 = ______`,
      ],
      answer: "100010",
    },
    // Exercise 6
    {
      title: "Addition 6",
      instruction:
        "Align binary numbers by their least significant bit, add each column from right to left, track carry-overs, and continue until all bits are added.",
      questions: [
        `To add the binary numbers 11010 and 10011, start from the rightmost bits, add each corresponding pair, carrying over any overflow as needed, then continue towards the leftmost bits.
              
            11010 + 10011 = ______`,
      ],
      answer: "101101",
    },
    // Exercise 7
    {
      title: "Addition 7",
      instruction:
        "Add binary numbers by aligning them, adding each column right to left, tracking carry-overs, writing down results for each column, and carrying over any excess to the next left column until all bits are added.",
      questions: [
        `Align the numbers vertically, add each column starting from the rightmost (least significant) bit, carrying over any overflow to the next column if necessary.
        
            11111 + 00001 = ______`,
      ],
      answer: "100000",
    },
    // Exercise 8
    {
      title: "Addition 8",
      instruction:
        "To add two binary numbers, align them by their least significant bit and add each column from right to left, keeping track of any carry-over. Write down the resulting bit for each column and carry over any excess to the next left column, continuing until all bits are added.",
      questions: [
        `To add the binary numbers 10110 and 01100, start from the rightmost bits, add each corresponding pair, carrying over any overflow as needed, then continue towards the leftmost bits.
        
            10110 + 01100 = ______`,
      ],
      answer: "100010",
    },
    // Exercise 9
    {
      title: "Addition 9",
      instruction:
        "To add two binary numbers, align them by their least significant bit and add each column from right to left, keeping track of any carry-over. Write down the resulting bit for each column and carry over any excess to the next left column, continuing until all bits are added.",
      questions: [
        `Add 10011 and 10010 by starting from the right, adding each pair, carrying over as needed, and moving left.
        
            10011 + 10010 = ______`,
      ],
      answer: "100101",
    },
    // Exercise 10
    {
      title: "Addition 10",
      instruction:
        "To add two binary numbers, align them by their least significant bit and add each column from right to left, keeping track of any carry-over. Write down the resulting bit for each column and carry over any excess to the next left column, continuing until all bits are added.",
      questions: [
        `Add 11101 and 01010 by starting from the right, adding each pair, carrying over as needed, and moving left.
        
            11101 + 01010 = ______`,
      ],
      answer: "100111",
    },
  ],
  Subtraction: [
    // Exercise 1
    {
      title: "Subtraction 1",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 1011 from 1101 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            1101 - 1011 = ______`,
      ],
      answer: "0010",
    },
    // Exercise 2
    {
      title: "Subtraction 2",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 0011 from 1001 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            1001 - 0011 = ______`,
      ],
      answer: "0110",
    },
    // Exercise 3
    {
      title: "Subtraction 3",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 0111 from 1110 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.

            1110 - 0111 = ______`,
      ],
      answer: "0111",
    },
    // Exercise 4
    {
      title: "Subtraction 4",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 0101 from 1100 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            1100 - 0101 = ______`,
      ],
      answer: "0111",
    },
    // Exercise 5
    {
      title: "Subtraction 5",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 01101 from 10101 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            10101 - 01101 = ______`,
      ],
      answer: "01000",
    },
    // Exercise 6
    {
      title: "Subtraction 6",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 10011 from 11010 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            11010 - 10011 = ______`,
      ],
      answer: "00111",
    },
    // Exercise 7
    {
      title: "Subtraction 7",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 00001 from 11111 by starting from the right, borrowing if necessary, and subtracting each corresponding pair until the leftmost bit.
        
            11111 - 00001 = ______`,
      ],
      answer: "11110",
    },
    // Exercise 8
    {
      title: "Subtraction 8",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 01100 from 10110 by starting from the right, subtracting each corresponding pair, and borrowing if needed from the higher bit. Continue until the leftmost bit.
        
            10110 - 01100 = ______`,
      ],
      answer: "01010",
    },
    // Exercise 9
    {
      title: "Subtraction 9",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `To subtract the binary number 01010 from 11101, commence from the rightmost bits, subtracting each corresponding pair, borrowing if necessary from the higher bit, until the leftmost bit is reached.
        
            10011 - 10010 = ______`,
      ],
      answer: "00001",
    },
    // Exercise 10
    {
      title: "Subtraction 10",
      instruction:
        "To subtract two binary numbers, align them by their least significant bit and subtract each column from right to left, borrowing from the next left column if necessary. Write down the resulting bit for each column, adjusting for any borrows, and continue until all bits are processed.",
      questions: [
        `Subtract 01010 from 11101 by starting from the rightmost bits, subtracting each pair and borrowing as needed, until reaching the leftmost bit.
        
            11101 - 01010 = ______`,
      ],
      answer: "10011",
    },
  ],
  Alphabet: [
    // Exercise 1 - A
    {
      title: "Alphabet 1",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter A? (Missing: 100000_)
        
          Letter A = ______ in binary!`,
      ],
      answer: "1000001",
    },
    // exercise 2 - B
    {
      title: "Alphabet 2",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter B? (Missing: 10000__)
        
          Letter B = ______ in binary!`,
      ],
      answer: "1000010",
    },
    // exercise 3 - C
    {
      title: "Alphabet 3",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter C? (Missing: 1__0011)
        
          Letter C = ______ in binary!`,
      ],
      answer: "1000011",
    },
    // exercise 4 - D
    {
      title: "Alphabet 4",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter D? (Missing: __00100)
        
          Letter D = ______ in binary!`,
      ],
      answer: "1000001",
    },
    // Exercise 5 - E
    {
      title: "Alphabet 5",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter E? (Missing: 10__101)
        
          Letter E = ______ in binary!`,
      ],
      answer: "1000101",
    },
    // Exercise 6 - F
    {
      title: "Alphabet 6",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter F? (Missing: 1000__0)
            
              Letter F = ______ in binary!`,
      ],
      answer: "1000110",
    },
    // Exercise 7 - G
    {
      title: "Alphabet 7",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter G? (Missing: 1__0111)
            
              Letter G = ______ in binary!`,
      ],
      answer: "1000111",
    },
    // Exercise 8 - H
    {
      title: "Alphabet 8",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter H? (Missing: 1001___)
            
              Letter H = ______ in binary!`,
      ],
      answer: "1001000",
    },
    // Exercise 9 - I
    {
      title: "Alphabet 9",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter I? (Missing: 1001___)
            
              Letter I = ______ in binary!`,
      ],
      answer: "1001001",
    },
    // Exercise 10 - j
    {
      title: "Alphabet 10",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter J? (Missing: 100__10)
            
              Letter J = ______ in binary!`,
      ],
      answer: "1001010",
    },
    // Exercise 11 - K
    {
      title: "Alphabet 11",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter K? (Missing: 10___11)
            
              Letter K = ______ in binary!`,
      ],
      answer: "1001011",
    },
    // Exercise 12 - l
    {
      title: "Alphabet 12",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter L? (Missing: ___1100)
            
              Letter L = ______ in binary!`,
      ],
      answer: "1001100",
    },
    // Exercise 13 - M
    {
      title: "Alphabet 13",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter M? (Missing: 1___101)
            
              Letter M = ______ in binary!`,
      ],
      answer: "1001101",
    },
    // Exercise 14 - N
    {
      title: "Alphabet 14",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter N? (Missing: 100___0)
            
              Letter N = ______ in binary!`,
      ],
      answer: "1001110",
    },
    // Exercise 15 - O
    {
      title: "Alphabet 15",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter O? (Missing: 10011__)
            
              Letter O = ______ in binary!`,
      ],
      answer: "1001111",
    },
    // Exercise 16 - P
    {
      title: "Alphabet 16",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter P? (Missing: ___0000)
            
              Letter P = ______ in binary!`,
      ],
      answer: "1010000",
    },
    // Exercise 17 - Q
    {
      title: "Alphabet 17",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter Q? (Missing: 1010__1)
            
              Letter Q = ______ in binary!`,
      ],
      answer: "1010001",
    },
    // Exercise 18 - R
    {
      title: "Alphabet 18",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter R? (Missing: 10___10)
            
              Letter R = ______ in binary!`,
      ],
      answer: "1010010",
    },
    // Exercise 19 - S
    {
      title: "Alphabet 19",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter S? (Missing: 10100__)
            
              Letter S = ______ in binary!`,
      ],
      answer: "1010011",
    },
    // Exercise 20 - T
    {
      title: "Alphabet 20",
      instruction:
        "Match each letter with its corresponding binary representation. Enter the binary representation for each letter in the input box provided.",
      questions: [
        `What is the binary representation of the letter T? (Missing: 1010___)
            
              Letter T = ______ in binary!`,
      ],
      answer: "1010100",
    },
  ],
};
// export the file to the main script
export default binaryData;
