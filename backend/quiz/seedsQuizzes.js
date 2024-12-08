const { connectDB } = require("../db");
const Quiz = require("../models/quizModel");
require("dotenv").config();
const mongoose = require("mongoose");

const bubbleSortData = [
  // Easy (1-10)
  {
    title: "Bubble Sort 1",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct variable for swapping array elements.",
    questions: `def bubble_sort(arr: list[int]):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = ______, arr[j]
    return arr`,
    answer: "arr[j+1]",
  },
  {
    title: "Bubble Sort 2",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct range end value for the inner loop.",
    questions: `def bubble_sort(arr: list[int]):
    n = len(arr)
    for i in range(n):
        for j in range(0, ______):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    answer: "n-i-1",
  },
  {
    title: "Bubble Sort 3",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct expression to get the array length.",
    questions: `def bubble_sort(arr: list[int]):
    n = ______
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    answer: "len(arr)",
  },
  {
    title: "Bubble Sort 4",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct variable to increment the swap counter.",
    questions: `def bubble_sort_swaps(arr: list[int]) -> tuple[list[int], int]:
    n = len(arr)
    swap_count = 0
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                ______ += 1
    return arr, swap_count`,
    answer: "swap_count",
  },
  {
    title: "Bubble Sort 5",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct array element to compare.",
    questions: `def bubble_sort_swaps(arr: list[int]) -> tuple[list[int], int]:
    n = len(arr)
    swap_count = 0
    for i in range(n):
        for j in range(0, n-i-1):
            if ______ > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swap_count += 1
    return arr, swap_count`,
    answer: "arr[j]",
  },
  {
    title: "Bubble Sort 6",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct starting index for the inner loop range.",
    questions: `def bubble_sort_swaps(arr: list[int]) -> tuple[list[int], int]:
    n = len(arr)
    swap_count = 0
    for i in range(n):
        for j in range(____, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swap_count += 1
    return arr, swap_count`,
    answer: "0",
  },
  {
    title: "Bubble Sort 7",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct return type annotation for the tuple.",
    questions: `def bubble_sort_swaps(arr: list[int]) -> _______[list[int], int]:
    n = len(arr)
    swap_count = 0
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swap_count += 1
    return arr, swap_count`,
    answer: "tuple",
  },
  {
    title: "Bubble Sort 8",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct return statement for the sorted array.",
    questions: `def bubble_sort_swaps(arr: list[int]) -> tuple[list[int], int]:
    n = len(arr)
    swap_count = 0
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swap_count += 1
    _________, swap_count`,
    answer: "return arr",
  },
  {
    title: "Bubble Sort 9",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct parameter name and type annotation.",
    questions: `def bubble_sort(____: list[int]):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    answer: "arr",
  },
  {
    title: "Bubble Sort 10",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct comparison operator for swapping elements.",
    questions: `def bubble_sort(arr: list[int]):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] ___ arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    answer: ">",
  },
  // Medium Difficulty (11-20)
  {
    title: "Bubble Sort 11",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct boolean value for initializing the swapped flag.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      swapped = ______
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
              swapped = True
      if not swapped:
          break
  return arr`,
    answer: "False",
  },
  {
    title: "Bubble Sort 12",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct boolean value to set when a swap occurs.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      swapped = False
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
              swapped = _____
      if not swapped:
          break
  return arr`,
    answer: "True",
  },
  {
    title: "Bubble Sort 13",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct variable to check if any swaps occurred in the pass.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      swapped = False
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
              swapped = True
      if not _________:
          break
  return arr`,
    answer: "swapped",
  },
  {
    title: "Bubble Sort 14",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct variable name to track if a swap occurred.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      swapped = False
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
              ________ = True
      if not swapped:
          break
  return arr`,
    answer: "swapped",
  },
  {
    title: "Bubble Sort 15",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct array index for the swap operation.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      swapped = False
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], ______ = arr[j+1], arr[j]
              swapped = True
      if not swapped:
          break
  return arr`,
    answer: "arr[j+1]",
  },
  {
    title: "Bubble Sort 16",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct expression to get the array length.",
    questions: `def bubble_sort(arr: list[int]):
  n = ______
  for i in range(n):
      for j in range(1, n-i):
          if arr[j-1] > arr[j]:
              arr[j-1], arr[j-1] = arr[j], arr[j-1]`,
    answer: "len(arr)",
  },
  {
    title: "Bubble Sort 17",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct range end value for the inner loop.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(1, _____):
          if arr[j-1] > arr[j]:
              arr[j-1], arr[j-1] = arr[j], arr[j-1]`,
    answer: "n-i",
  },
  {
    title: "Bubble Sort 18",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct starting value for the inner loop range.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(_____, n-i):
          if arr[j-1] > arr[j]:
              arr[j-1], arr[j-1] = arr[j], arr[j-1]`,
    answer: "1",
  },
  {
    title: "Bubble Sort 19",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct variable name for array length.",
    questions: `def bubble_sort(arr: list[int]):
  _____ = len(arr)
  for i in range(n):
      for j in range(1, n-i):
          if arr[j-1] > arr[j]:
              arr[j-1], arr[j-1] = arr[j], arr[j-1]`,
    answer: "n",
  },
  {
    title: "Bubble Sort 20",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct assignment operator for swapping elements.",
    questions: `def bubble_sort(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(1, n-i):
          if arr[j-1] > arr[j]:
              arr[j-1], arr[j-1] _____ arr[j], arr[j-1]`,
    answer: "=",
  },
  // Hard Difficulty (21-30)
  {
    title: "Bubble Sort 21",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct condition for descending order sort.",
    questions: `def bubble_sort_desc(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(0, n-i-1):
         ______________:
              arr[j], arr[j+1] = arr[j+1], arr[j]`,
    answer: "if arr[j] < arr[j+1]",
  },
  {
    title: "Bubble Sort 22",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct values for swapping elements in descending order.",
    questions: `def bubble_sort_desc(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] < arr[j+1]:
              arr[j], arr[j+1] = __________`,
    answer: "arr[j+1], arr[j]",
  },
  {
    title: "Bubble Sort 23",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct outer loop structure for descending sort.",
    questions: `def bubble_sort_desc(arr: list[int]):
  n = len(arr)
  ____________:
      for j in range(0, n-i-1):
          if arr[j] < arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]`,
    answer: "for i in range(n)",
  },
  {
    title: "Bubble Sort 24",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct assignment for swapping elements in descending order.",
    questions: `def bubble_sort_desc(arr: list[int]):
  n = len(arr)
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] < arr[j+1]:
             ___________ = arr[j+1], arr[j]`,
    answer: "arr[j], arr[j+1]",
  },
  {
    title: "Bubble Sort 25",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct inner loop structure for descending sort.",
    questions: `def bubble_sort_desc(arr: list[int]):
  n = len(arr)
  for i in range(n):
     ________________:
          if arr[j] < arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]`,
    answer: "for j in range(0, n-i-1)",
  },
  {
    title: "Bubble Sort 26",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct parameter type annotation for descending sort.",
    questions: `def bubble_sort_desc(_______):
  n = len(arr)
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] < arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]`,
    answer: "arr: list[int]",
  },
  {
    title: "Bubble Sort 27",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct statement to increment the swap counter.",
    questions: `def bubble_sort_with_count(arr: list[int]) -> int:
  n = len(arr)
  count = 0
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
      ____________
  return count`,
    answer: "count += 1",
  },
  {
    title: "Bubble Sort 28",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct initialization of the swap counter.",
    questions: `def bubble_sort_with_count(arr: list[int]) -> int:
  n = len(arr)
  ________
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
      count += 1
  return count`,
    answer: "count = 0",
  },
  {
    title: "Bubble Sort 29",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct inner loop structure for counting swaps.",
    questions: `def bubble_sort_with_count(arr: list[int]) -> int:
  n = len(arr)
  count = 0
  for i in range(n):
      ____________________:
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
      count += 1
  return count`,
    answer: "for j in range(0, n-i-1)",
  },
  {
    title: "Bubble Sort 30",
    type: "Bubble Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct function signature including parameter and return type annotations.",
    questions: `def bubble_sort_with_count(_________________):
  n = len(arr)
  count = 0
  for i in range(n):
      for j in range(0, n-i-1):
          if arr[j] > arr[j+1]:
              arr[j], arr[j+1] = arr[j+1], arr[j]
      count += 1
  return count`,
    answer: "arr: list[int]) -> int",
  },
];
const mergeSortData = [
  // merge sort 1 to 10 - medium
  {
    title: "Merge Sort 1",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct function call to merge the sorted subarrays.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid]
        merge_sort(left)
        merge_sort(right)
        ___________`,
    answer: "merge(arr, left, right)",
  },
  {
    title: "Merge Sort 2",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct increment operation for the right array index.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i+= 1
        k += 1
    while j < len(right):
        arr[k] = right[j]
        ______`,
    answer: "j += 1",
  },
  {
    title: "Merge Sort 3",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct parameter for the recursive merge sort call.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(______)
        merge_sort(right)
        merge(arr, left, right)`,
    answer: "left",
  },
  {
    title: "Merge Sort 4",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct index for splitting the array into left half.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:___]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        merge(arr, left, right)`,
    answer: "mid",
  },
  {
    title: "Merge Sort 5",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct loop keyword for processing remaining elements in the left array.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    _______ i < len(left):
        arr[k] = left[i]; i+= 1
        k += 1
    while j < len(right):
        arr[k] = right[j]
        j += 1`,
    answer: "while",
  },
  {
    title: "Merge Sort 6",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct length check for the right array in the merge loop.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < _______:
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i+= 1
        k += 1
    while j < len(right):
        arr[k] = right[j]
        j += 1`,
    answer: "len(right)",
  },
  {
    title: "Merge Sort 7",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct array parameter for the merge function call.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        merge(_____, left, right)`,
    answer: "arr",
  },
  {
    title: "Merge Sort 8",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct variable name for calculating the middle index.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        _____ = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        merge(arr, left, right)`,
    answer: "mid",
  },
  {
    title: "Merge Sort 9",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct conditional keyword to check if array needs sorting.",
    questions: `def merge_sort(arr: list[int]):
    ____ len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        merge(arr, left, right)`,
    answer: "if",
  },
  {
    title: "Merge Sort 10",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Fill in the blank with the correct recursive function call for the right subarray.",
    questions: `def merge_sort(arr: list[int]):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        _________(right)
        merge(arr, left, right)`,
    answer: "merge_sort",
  },
  // merge sort 11 to 20 - medium
  {
    title: "Merge Sort 11",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct array slice to complete the merging of remaining elements from the right array.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    arr[k:] = left[i:] or _______`,
    answer: "right[j:]",
  },
  {
    title: "Merge Sort 12",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct array element access to compare the current element from the left array.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < len(right):
        if ______ <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    arr[k:] = left[i:] or right[j:]`,
    answer: "left[i]",
  },
  {
    title: "Merge Sort 13",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct array assignment to place the smaller element in the merged array.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            ________ = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    arr[k:] = left[i:] or right[j:]`,
    answer: "arr[k]",
  },
  {
    title: "Merge Sort 14",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Fill in the blank with the correct length check for the right array in the while loop condition.",
    questions: `def merge(arr: list[int], left: list[int], right: list[int]):
    i = j = k = 0
    while i < len(left) and j < ______:
        if left[i] <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    arr[k:] = left[i:] or right[j:]`,
    answer: "len(right)",
  },
  {
    title: "Merge Sort 15",
    instructions:
      "Correct the syntax by replacing the blank with the proper increment operation for the variable k.",
    questions: `
      def merge(arr: list[int], left: list[int], right: list[int]):
          i = j = k = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  arr[k] = left[i]
                  i += 1
              else:
                  arr[k] = right[j]
                  j += 1
              k ______ 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: " += ",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  {
    title: "Merge Sort 16",
    instructions:
      "Fill in the blank with the appropriate parameter name for the first list to be merged.",
    questions: `
      def merge(arr: list[int], _____: list[int], right: list[int]):
          i = j = k = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  arr[k] = left[i]
                  i += 1
              else:
                  arr[k] = right[j]
                  j += 1
              k += 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: "left",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  {
    title: "Merge Sort 17",
    instructions:
      "Fill in the blank with the appropriate comparison operator to check if i is within the bounds of the left array.",
    questions: `
      def merge(arr: list[int], left: list[int], right: list[int]):
          i = j = k = 0
          while i ____ len(left) and j < len(right):
              if left[i] <= right[j]:
                  arr[k] = left[i]
                  i += 1
              else:
                  arr[k] = right[j]
                  j += 1
              k += 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: "<",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  {
    title: "Merge Sort 18",
    instructions:
      "Fill in the blank with the appropriate comparison operator to compare the elements from left and right arrays.",
    questions: `
      def merge(arr: list[int], left: list[int], right: list[int]):
          i = j = k = 0
          while i < len(left) and j < len(right):
              if left[i] _____ right[j]:
                  arr[k] = left[i]
                  i += 1
              else:
                  arr[k] = right[j]
                  j += 1
              k += 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: "<=",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  {
    title: "Merge Sort 19",
    instructions:
      "Fill in the blank with the correct variable name to initialize the variable k in the merge function.",
    questions: `
      def merge(arr: list[int], left: list[int], right: list[int]):
          i = j = k = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  arr[k] = left[i]
                  i += 1
              ______:
                  arr[k] = right[j]
                  j += 1
              k += 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: "else",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  {
    title: "Merge Sort 20",
    instructions:
      "Fill in the blank with the correct variable name representing the first half of the array, typically left.",
    questions: `
      def merge(arr: list[int], left: list[int], right: list[int]):
          i = j = _____ = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  arr[k] = left[i]
                  i += 1
              else:
                  arr[k] = right[j]
                  j += 1
              k += 1
          arr[k:] = left[i:] or right[j:]
    `,
    answer: "k",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
  },
  // merge sort 21 to 30 - hard
  {
    title: "Merge Sort 21",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Fill in the blank with the correct line of code to create the left half of the array.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          _____________
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "left = arr[:mid]",
  },
  {
    title: "Merge Sort 22",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Initialize the variables for tracking array indices during the merge process.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        _______________
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "i = j = k = 0",
  },
  {
    title: "Merge Sort 23",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Call the merge function to combine the sorted left and right subarrays.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          _______________

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "merge(arr, left, right)",
  },
  {
    title: "Merge Sort 24",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "When the right subarray is selected, add the current element from the right subarray to the merged array.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                _____________
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "arr[k] = right[j]",
  },
  {
    title: "Merge Sort 25",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Complete the merge function signature by adding the parameters.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(__________):
      i = j = k = 0
      while i < len(left) and j < len(right):
          if merge_sort_strings(right):
              arr[k] = left[i]
              i += 1
          else:
              arr[k] = right[j]
              j += 1
          k += 1
      arr[k:] = left[i] <= right[j]`,
    answer: "arr, left, right",
  },
  {
    title: "Merge Sort 26",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Increment the merged array index after processing an element.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
      i = j = k = 0
      while i < len(left) and j < len(right):
          if merge_sort_strings(right):
              arr[k] = left[i]
              i += 1
          else:
              arr[k] = right[j]
              j += 1
          ___________
      arr[k:] = left[i] <= right[j]`,
    answer: "k+=1",
  },
  {
    title: "Merge Sort 27",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the base condition to check if the array needs sorting.",
    questions: `
    def merge_sort_strings(arr: list[str]):
    _______________:
      mid = len(arr) // 2
      left = arr[:mid]
      right = arr[mid:]
      merge_sort_strings(left)
      merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "if len(arr) > 1",
  },
  {
    title: "Merge Sort 28",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "When the left subarray is selected, add the current element from the left subarray to the merged array.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                ____________
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "arr[k] = left[i]",
  },
  {
    title: "Merge Sort 29",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Increment the left subarray index after selecting an element from it.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                __________
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        arr[k:] = left[i] <= right[j]`,
    answer: "i += 1",
  },
  {
    title: "Merge Sort 30",
    type: "Merge Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Handle the remaining elements in the subarrays after the main comparison loop.",
    questions: `
    def merge_sort_strings(arr: list[str]):
      if len(arr) > 1:
          mid = len(arr) // 2
          left = arr[:mid]
          right = arr[mid:]
          merge_sort_strings(left)
          merge(arr, left, right)

    def merge(arr, left, right):
        i = j = k = 0
        while i < len(left) and j < len(right):
            if merge_sort_strings(right):
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
      _________________________`,
    answer: "arr[k:] = left[i] <= right[j]",
  },
];
const selectionSortData = [
  // selection sort 1 to 10 - easy
  {
    title: "Selection Sort 1",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Specify the correct type annotation for the input array parameter.",
    questions: `
    def selection_sort(arr: ______):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "list[int]",
  },
  {
    title: "Selection Sort 2",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Initialize the variable to track the index of the minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        _______ = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "min_idx",
  },
  {
    title: "Selection Sort 3",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Swap the current element with the minimum element found.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
          if arr[j] < arr[min_idx]:
              min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "arr[i]",
  },
  {
    title: "Selection Sort 4",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Use the correct method to iterate through the array length.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in _____(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "range",
  },
  {
    title: "Selection Sort 5",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Complete the swap operation with the correct array index.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
            min_idx = j
        arr[i], arr[min_idx] = _______, arr[i]`,
    answer: "arr[min_idx]",
  },
  {
    title: "Selection Sort 6",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the correct keyword to define the function.",
    questions: `
    ____ selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
          min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "def",
  },
  {
    title: "Selection Sort 7",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Initialize the minimum index with the current iteration index.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
          if arr[j] < arr[min_idx]:
              min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "i",
  },
  {
    title: "Selection Sort 8",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Specify the starting index for the inner loop that finds the minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "i+1",
  },
  {
    title: "Selection Sort 9",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the correct loop keyword to iterate through the array.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "for",
  },
  {
    title: "Selection Sort 10",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions:
      "Specify the array length to control the outer loop iterations.",
    questions: `
    def selection_sort(arr: list[int]):
      n = len(arr)
      for i in range(____):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
    arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "n",
  },
  // selection sort 11 to 20 - medium
  {
    title: "Selection Sort 11",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Add the correct method to iterate through the remaining elements of the array.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in ______(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "range",
  },
  {
    title: "Selection Sort 12",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Complete the comparison condition to find the minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if ___________:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "arr[j] < arr[min_idx]",
  },
  {
    title: "Selection Sort 13",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Initialize the minimum index variable for the current iteration.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            ____________
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "min_idx = i",
  },
  {
    title: "Selection Sort 14",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Initialize the variable to store the length of the array.",
    questions: `
    def selection_sort(arr: list[int]):
        __________
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "n = len(arr)",
  },
  {
    title: "Selection Sort 15",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Update the minimum index when a smaller element is found.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    ____________
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "min_idx = j",
  },
  {
    title: "Selection Sort 16",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Add the comparison operator to check if the minimum index has changed.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx ____ i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "!=",
  },
  {
    title: "Selection Sort 17",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Complete the swap operation for the current element and minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = __________`,
    answer: "arr[min_idx], arr[i]",
  },
  {
    title: "Selection Sort 18",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Specify the range for the inner loop to search for the minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(_________):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "i+1, n",
  },
  {
    title: "Selection Sort 19",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Complete the condition to compare the current element with the minimum element.",
    questions: `
    def selection_sort(arr: list[int]):
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                ________ < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "if arr[j]",
  },
  {
    title: "Selection Sort 20",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Add the function parameter with type annotation.",
    questions: `
    def selection_sort__________:
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "(arr: list[int])",
  },
  // selection sort 21 to 30 - hard
  {
    title: "Selection Sort 21",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Complete the code to update the maximum index in descending order sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            max_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] > arr[max_idx]:
                    __________
            arr[i], arr[max_idx] = arr[max_idx], arr[i]`,
    answer: "max_idx = j",
  },
  {
    title: "Selection Sort 22",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Add the comparison condition for descending order selection sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            max_idx = i
            for j in range(i+1, len(arr)):
                ___________________
                    max_idx = j
            arr[i], arr[max_idx] = arr[max_idx], arr[i]`,
    answer: "if arr[j] > arr[max_idx]:",
  },
  {
    title: "Selection Sort 23",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Complete the swap operation in descending order sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            max_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] > arr[max_idx]:
                    max_idx = j
            arr[i], arr[max_idx] = __________________`,
    answer: "arr[max_idx], arr[i]",
  },
  {
    title: "Selection Sort 24",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Add the left side of the swap assignment in descending order sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            max_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] > arr[max_idx]:
                    max_idx = j
            __________________ = arr[max_idx], arr[i]`,
    answer: "arr[i], arr[max_idx]",
  },
  {
    title: "Selection Sort 25",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Complete the inner loop definition for descending order sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            max_idx = i
           _____________:
                if arr[j] > arr[max_idx]:
                    max_idx = j
            arr[i], arr[max_idx] = arr[max_idx], arr[i]`,
    answer: "for j in range(i+1, len(arr))",
  },
  {
    title: "Selection Sort 26",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Initialize the maximum index variable in descending order sort.",
    questions: `
    def selection_sort_desc(arr: list[int]):
        for i in range(len(arr)):
            ____________
            for j in range(i+1, len(arr)):
                if arr[j] > arr[max_idx]:
                    max_idx = j
            arr[i], arr[max_idx] = arr[max_idx], arr[i]`,
    answer: "max_idx = i",
  },
  {
    title: "Selection Sort 27",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Add the function parameter with type annotation for descending sort.",
    questions: `
    def selection_sort_desc(__________):
        for i in range(len(arr)):
            max_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] > arr[max_idx]:
                    max_idx = j
            arr[i], arr[max_idx] = arr[max_idx], arr[i]`,
    answer: "arr: list[int]",
  },
  {
    title: "Selection Sort 28",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Complete the return statement to get k smallest elements.",
    questions: `
    def selection_sort_k_smallest(arr: list[int], k: int) -> list[int]:
        for i in range(k):
            min_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        _______________`,
    answer: "return arr[:k]",
  },
  {
    title: "Selection Sort 29",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the loop to sort only k smallest elements.",
    questions: `
    def selection_sort_k_smallest(arr: list[int], k: int) -> list[int]:
       _______________:
            min_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        return arr[:k]`,
    answer: "for i in range(k)",
  },
  {
    title: "Selection Sort 30",
    type: "Selection Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Add the return type annotation for k smallest elements function.",
    questions: `
    def selection_sort_k_smallest(arr: list[int], k: int) -> __________:
        for i in range(k):
            min_idx = i
            for j in range(i+1, len(arr)):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        return arr[:k]`,
    answer: "list[int]",
  },
];
const insertionSortData = [
  // insertion sort 1 to 10 - easy
  {
    title: "Insertion Sort 1",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Complete the comparison with the current key value.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > ____:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "key",
  },
  {
    title: "Insertion Sort 2",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the array length to determine the loop range.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, _______):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "len(arr)",
  },
  {
    title: "Insertion Sort 3",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Store the current element as the key for comparison.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = ______
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "arr[i]",
  },
  {
    title: "Insertion Sort 4",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the loop keyword for comparing and shifting elements.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            ______ j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "while",
  },
  {
    title: "Insertion Sort 5",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the parameter name for the input array.",
    questions: `
    def insertion_sort(_____: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "arr",
  },
  {
    title: "Insertion Sort 6",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Initialize the index for comparing with previous elements.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = ______
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "i - 1",
  },
  {
    title: "Insertion Sort 7",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Specify the starting index for the outer loop.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(______, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "1",
  },
  {
    title: "Insertion Sort 8",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the logical operator to combine conditions.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 ______ arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "and",
  },
  {
    title: "Insertion Sort 9",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Complete the array index for shifting elements.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[______] = arr[j]
                j -= 1
            arr[j + 1] = key`,
    answer: "j + 1",
  },
  {
    title: "Insertion Sort 10",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Easy",
    instructions: "Add the decrement operator to move to the previous element.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j _____ 1
            arr[j + 1] = key`,
    answer: "-=",
  },
  // insertion sort 11 to 20 - medium
  {
    title: "Insertion Sort 11",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Add the decrement operation for the index variable.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                ________
            arr[j+1] = key`,
    answer: "j -= 1",
  },
  {
    title: "Insertion Sort 12",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Initialize the key variable with the current element.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            ___________
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "key = arr[i]",
  },
  {
    title: "Insertion Sort 13",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Complete the range parameters for the outer loop.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range___________:
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "(1, len(arr))",
  },
  {
    title: "Insertion Sort 14",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Initialize the index for comparing with previous elements.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            _________
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "j = i - 1",
  },
  {
    title: "Insertion Sort 15",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Add the condition to check if the index is valid.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while ______ and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "j >= 0",
  },
  {
    title: "Insertion Sort 16",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Complete the assignment to place the key in its correct position.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            _______________`,
    answer: "arr[j+1] = key",
  },
  {
    title: "Insertion Sort 17",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Add the comparison condition for the while loop.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and ________:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "arr[j] > key",
  },
  {
    title: "Insertion Sort 18",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions: "Complete the for loop declaration.",
    questions: `
    def insertion_sort(arr: list[int]):
        ____________(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "for i in range",
  },
  {
    title: "Insertion Sort 19",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Add the logical operator to combine the while loop conditions.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 _____ arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] = key`,
    answer: "and",
  },
  {
    title: "Insertion Sort 20",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Medium",
    instructions:
      "Add the assignment operator to update the array with the key value.",
    questions: `
    def insertion_sort(arr: list[int]):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j+1] ________ key`,
    answer: "=",
  },
  // insertion sort 21 to 30 - hard
  {
    title: "Insertion Sort 21",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Initialize the sorted linked list pointer.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        ______________
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "sorted_list = None",
  },
  {
    title: "Insertion Sort 22",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Complete the while loop condition for traversing the sorted portion.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                _______________ and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "while temp.next",
  },
  {
    title: "Insertion Sort 23",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the main loop condition for traversing the input list.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        ___________:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "while head",
  },
  {
    title: "Insertion Sort 24",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Complete the return statement for the sorted linked list.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        _______________`,
    answer: "return sorted_list",
  },
  {
    title: "Insertion Sort 25",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions:
      "Add the line to update the next pointer when inserting at the beginning.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                _________________
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "current.next = sorted_list",
  },
  {
    title: "Insertion Sort 26",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Initialize the next pointer in the Node class.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            ______________

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "self.next = None",
  },
  {
    title: "Insertion Sort 27",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the line to move to the next node in the input list.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            _______________
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "head = head.next",
  },
  {
    title: "Insertion Sort 28",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the function parameter with type annotation.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(________________) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "head: Node",
  },
  {
    title: "Insertion Sort 29",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Add the line to update the sorted list pointer.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= sorted_list.data:
                current.next = sorted_list
                __________________
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "sorted_list = current",
  },
  {
    title: "Insertion Sort 30",
    type: "Insertion Sort",
    category: "Sorting Algorithms",
    difficulty: "Hard",
    instructions: "Complete the comparison with the sorted list's data.",
    questions: `
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def insertion_sort_linked_list(head: Node) -> Node:
        sorted_list = None
        while head:
            current = head
            head = head.next
            if not sorted_list or current.data <= _____________:
                current.next = sorted_list
                sorted_list = current
            else:
                temp = sorted_list
                while temp.next and temp.next.data < current.data:
                    temp = temp.next
                current.next = temp.next
                temp.next = current
        return sorted_list`,
    answer: "sorted_list.data",
  },
];
const binaryAdditionQuizData = [
  // Easy Difficulty (1-10)
  {
    title: "Addition 1",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "1010 + 1100",
    answer: "10110",
  },
  {
    title: "Addition 2",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "1001 + 0110",
    answer: "1111",
  },
  {
    title: "Addition 3",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "1111 + 0001",
    answer: "10000",
  },
  {
    title: "Addition 4",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "10101 + 01010",
    answer: "11111",
  },
  {
    title: "Addition 5",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "10010 + 00101",
    answer: "10111",
  },
  {
    title: "Addition 6",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "1100 + 1011",
    answer: "10111",
  },
  {
    title: "Addition 7",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "11100 + 10010",
    answer: "101110",
  },
  {
    title: "Addition 8",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "10110 + 00111",
    answer: "11101",
  },
  {
    title: "Addition 9",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "01010 + 10101",
    answer: "11111",
  },
  {
    title: "Addition 10",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Add the following binary numbers, carrying over 1 when the sum in a column exceeds 1.",
    questions: "11111 + 00010",
    answer: "100001",
  },

  // Medium Difficulty (11-20)
  {
    title: "Addition 11",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "100011 + 101010",
    answer: "1001101",
  },
  {
    title: "Addition 12",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "1110001 + 0001110",
    answer: "1111111",
  },
  {
    title: "Addition 13",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "1011010 + 0110011",
    answer: "10011001",
  },
  {
    title: "Addition 14",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "110110 + 101101",
    answer: "1100011",
  },
  {
    title: "Addition 15",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "1111111 + 0000001",
    answer: "10000000",
  },
  {
    title: "Addition 16",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "10101110 + 11010001",
    answer: "101111111",
  },
  {
    title: "Addition 17",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "10010101 + 01101010",
    answer: "11111111",
  },
  {
    title: "Addition 18",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "10101010 + 01010101",
    answer: "11111111",
  },
  {
    title: "Addition 19",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "11001100 + 00110011",
    answer: "11111111",
  },
  {
    title: "Addition 20",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Add the following binary numbers, carefully tracking multiple carry operations.",
    questions: "11111111 + 00000001",
    answer: "100000000",
  },

  // Hard Difficulty (21-30)
  {
    title: "Addition 21",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "10101010101 + 11111100001",
    answer: "110101110110",
  },
  {
    title: "Addition 22",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "111100000011 + 000111110000",
    answer: "1000011110011",
  },
  {
    title: "Addition 23",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "110101010110 + 101010101101",
    answer: "1100000000011",
  },
  {
    title: "Addition 24",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "111111111111 + 000000000001",
    answer: "1000000000000",
  },
  {
    title: "Addition 25",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "1010101010101 + 0101010101010",
    answer: "1111111111111",
  },
  {
    title: "Addition 26",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "1001100110011 + 0110011001100",
    answer: "1111111111111",
  },
  {
    title: "Addition 27",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "10101011110110 + 01010100011001",
    answer: "11111111111111",
  },
  {
    title: "Addition 28",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "11111100001111 + 00000011110000",
    answer: "100000000000111",
  },
  {
    title: "Addition 29",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "10110110110101 + 01001001001011",
    answer: "11111111111110",
  },
  {
    title: "Addition 30",
    type: "Addition",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Add the following long binary numbers, managing multiple carries across many columns.",
    questions: "111110000011111 + 000001111100000",
    answer: "1000000000001111",
  },
];
const binarySubtractionQuizData = [
  // Easy Difficulty (1-10)
  {
    title: "Subtraction 1",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "1101 − 1010",
    answer: "0011",
  },
  {
    title: "Subtraction 2",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "1011 - 0110",
    answer: "0101",
  },
  {
    title: "Subtraction 3",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "1110 - 1001",
    answer: "0101",
  },
  {
    title: "Subtraction 4",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "10101 - 10010",
    answer: "00011",
  },
  {
    title: "Subtraction 5",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "11010 - 01010",
    answer: "10000",
  },
  {
    title: "Subtraction 6",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "10110 - 00101",
    answer: "10001",
  },
  {
    title: "Subtraction 7",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "11111 - 1110",
    answer: "10001",
  },
  {
    title: "Subtraction 8",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "11000 - 10101",
    answer: "00011",
  },
  {
    title: "Subtraction 9",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "10101 - 10000",
    answer: "00001",
  },
  {
    title: "Subtraction 10",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Subtract the following binary numbers, borrowing 1 when needed.",
    questions: "11111 - 10101",
    answer: "01010",
  },

  // Medium Difficulty (11-20)
  {
    title: "Subtraction 11",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "1010101 − 1000100",
    answer: "0001111",
  },
  {
    title: "Subtraction 12",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "1111111 − 1010101",
    answer: "0101010",
  },
  {
    title: "Subtraction 13",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "1101101 − 0110011",
    answer: "0111010",
  },
  {
    title: "Subtraction 14",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "10110111 − 01101100",
    answer: "01001011",
  },
  {
    title: "Subtraction 15",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "10011101 − 01010111",
    answer: "01000110",
  },
  {
    title: "Subtraction 16",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "11111110 − 01111101",
    answer: "10000011",
  },
  {
    title: "Subtraction 17",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "10111111 − 10000001",
    answer: "00111110",
  },
  {
    title: "Subtraction 18",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "11010101 − 01010110",
    answer: "10000011",
  },
  {
    title: "Subtraction 19",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "10101010 − 01101101",
    answer: "00111101",
  },
  {
    title: "Subtraction 20",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Subtract the following binary numbers, carefully managing multiple borrows.",
    questions: "11111001 − 01101010",
    answer: "10001111",
  },

  // Hard Difficulty (21-30)
  {
    title: "Subtraction 21",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "11111111111 − 10101010101",
    answer: "01010101010",
  },
  {
    title: "Subtraction 22",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "111111110001 − 101010100011",
    answer: "010101001110",
  },
  {
    title: "Subtraction 23",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "111000011101 − 110101101110",
    answer: "000010101111",
  },
  {
    title: "Subtraction 24",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "111110101011 − 101010101010",
    answer: "010100000001",
  },
  {
    title: "Subtraction 25",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "1101111001101 − 1010101001001",
    answer: "0011010000100",
  },
  {
    title: "Subtraction 26",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "11110000011111 − 01111000011111",
    answer: "01111000000000",
  },
  {
    title: "Subtraction 27",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "11111100001111 − 00000011110000",
    answer: "11111000011111",
  },
  {
    title: "Subtraction 28",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "11111111110000 − 11110000001111",
    answer: "00001111100001",
  },
  {
    title: "Subtraction 29",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "10101010110110 − 01010100010101",
    answer: "01010110100001",
  },
  {
    title: "Subtraction 30",
    type: "Subtraction",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Subtract the following long binary numbers, managing multiple borrows across many columns.",
    questions: "11111111111111 − 01111111111111",
    answer: "10000000000000",
  },
];
const alphabetBinaryData = [
  // Easy Difficulty (1-20)
  {
    title: "Alphabet 1",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000001 + 00000001",
    answer: "B",
  },
  {
    title: "Alphabet 2",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000011 + 00000010",
    answer: "E",
  },
  {
    title: "Alphabet 3",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001000 + 00000001",
    answer: "I",
  },
  {
    title: "Alphabet 4",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001100 + 00000010",
    answer: "N",
  },
  {
    title: "Alphabet 5",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010000 + 00000001",
    answer: "Q",
  },
  {
    title: "Alphabet 6",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000100 + 00000001",
    answer: "E",
  },
  {
    title: "Alphabet 7",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010011 + 00000001",
    answer: "T",
  },
  {
    title: "Alphabet 8",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001111 + 00000001",
    answer: "P",
  },
  {
    title: "Alphabet 9",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010110 + 00000001",
    answer: "W",
  },
  {
    title: "Alphabet 10",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001001 + 00000001",
    answer: "J",
  },
  {
    title: "Alphabet 11",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000110 − 00000001",
    answer: "E",
  },
  {
    title: "Alphabet 12",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001000 − 00000010",
    answer: "F",
  },
  {
    title: "Alphabet 13",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001110 − 00000001",
    answer: "M",
  },
  {
    title: "Alphabet 14",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010010 − 00000001",
    answer: "Q",
  },
  {
    title: "Alphabet 15",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011000 − 00000001",
    answer: "W",
  },
  {
    title: "Alphabet 16",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001101 − 00000001",
    answer: "L",
  },
  {
    title: "Alphabet 17",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010100 − 00000001",
    answer: "O",
  },
  {
    title: "Alphabet 18",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011010 − 00000010",
    answer: "X",
  },
  {
    title: "Alphabet 19",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010001 − 00000010",
    answer: "O",
  },
  {
    title: "Alphabet 20",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Easy",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010101 − 00000001",
    answer: "T",
  },

  // Medium Difficulty (21-40)
  {
    title: "Alphabet 21",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011001 − 00001000",
    answer: "U",
  },
  {
    title: "Alphabet 22",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010001 − 00000011",
    answer: "N",
  },
  {
    title: "Alphabet 23",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001111 − 00000010",
    answer: "M",
  },
  {
    title: "Alphabet 24",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010100 − 00000010",
    answer: "R",
  },
  {
    title: "Alphabet 25",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011000 − 00000101",
    answer: "U",
  },
  {
    title: "Alphabet 26",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001010 − 00000011",
    answer: "I",
  },
  {
    title: "Alphabet 27",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001110 − 00000100",
    answer: "L",
  },
  {
    title: "Alphabet 28",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010101 − 00000101",
    answer: "Y",
  },
  {
    title: "Alphabet 29",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011010 − 00000100",
    answer: "X",
  },
  {
    title: "Alphabet 30",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010111 − 00000010",
    answer: "U",
  },
  {
    title: "Alphabet 31",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001000 + 00000111",
    answer: "O",
  },
  {
    title: "Alphabet 32",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000011 + 00001001",
    answer: "L",
  },
  {
    title: "Alphabet 33",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010100 + 00000011",
    answer: "W",
  },
  {
    title: "Alphabet 34",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010110 + 00000010",
    answer: "X",
  },
  {
    title: "Alphabet 35",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001101 + 00000010",
    answer: "O",
  },
  {
    title: "Alphabet 36",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000111 + 00000101",
    answer: "J",
  },
  {
    title: "Alphabet 37",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001100 + 00000011",
    answer: "O",
  },
  {
    title: "Alphabet 38",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010101 + 00000010",
    answer: "W",
  },
  {
    title: "Alphabet 39",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010010 + 00000001",
    answer: "S",
  },
  {
    title: "Alphabet 40",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Medium",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001001 + 00000011",
    answer: "K",
  },
  // Hard Difficulty (41-60)
  {
    title: "Alphabet 41",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000001 + 000000001110",
    answer: "H",
  },
  {
    title: "Alphabet 42",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000010 + 000000010100",
    answer: "N",
  },
  {
    title: "Alphabet 43",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000011 + 000000100011",
    answer: "V",
  },
  {
    title: "Alphabet 44",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01000100 + 000000110100",
    answer: "X",
  },
  {
    title: "Alphabet 45",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001001 + 000000100000",
    answer: "Q",
  },
  {
    title: "Alphabet 46",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001110 + 000000010111",
    answer: "Q",
  },
  {
    title: "Alphabet 47",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001101 + 000000011100",
    answer: "X",
  },
  {
    title: "Alphabet 48",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010110 + 000000001101",
    answer: "Z",
  },
  {
    title: "Alphabet 49",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001100 + 000000010011",
    answer: "W",
  },
  {
    title: "Alphabet 50",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01001010 + 000000011101",
    answer: "Y",
  },
  {
    title: "Alphabet 51",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011101 − 000001001100",
    answer: "M",
  },
  {
    title: "Alphabet 52",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010100 − 000000110000",
    answer: "P",
  },
  {
    title: "Alphabet 53",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011111 − 000000101110",
    answer: "U",
  },
  {
    title: "Alphabet 54",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011010 − 000000011100",
    answer: "V",
  },
  {
    title: "Alphabet 55",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010101 − 000000001100",
    answer: "Q",
  },
  {
    title: "Alphabet 56",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011000 − 000000101101",
    answer: "U",
  },
  {
    title: "Alphabet 57",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011001 − 000000011101",
    answer: "P",
  },
  {
    title: "Alphabet 58",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01011010 − 000000101101",
    answer: "U",
  },
  {
    title: "Alphabet 59",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010001 − 000000010100",
    answer: "M",
  },
  {
    title: "Alphabet 60",
    type: "Alphabet",
    category: "Binary Operations",
    difficulty: "Hard",
    instructions:
      "Perform the binary operation and convert the result to its corresponding ASCII alphabetic character (A-Z).",
    questions: "01010111 − 000000011010",
    answer: "Q",
  },
];

const seedQuizzes = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    // Drop the existing collection and indexes
    try {
      await mongoose.connection.collection("quizzes").drop();
      console.log("Dropped existing collection");
    } catch (err) {
      console.log("Collection might not exist, continuing...");
    }

    // Clear existing data
    await Quiz.deleteMany({});
    console.log("Cleared existing quiz data");

    // Modify the addQuizIds function to generate quizIds
    const addQuizIds = (dataArray, startId) => {
      return dataArray.map((quiz, index) => {
        const sequentialId = startId + index + 1;
        return {
          ...quiz,
          quizId: `QZ${String(sequentialId).padStart(4, "0")}`,
        };
      });
    };

    const allQuizData = [
      ...addQuizIds(bubbleSortData, 600),
      ...addQuizIds(mergeSortData, 500),
      ...addQuizIds(selectionSortData, 400),
      ...addQuizIds(insertionSortData, 300),
      ...addQuizIds(binaryAdditionQuizData, 200),
      ...addQuizIds(binarySubtractionQuizData, 100),
      ...addQuizIds(alphabetBinaryData, 0),
    ];

    // Insert all data
    const insertedQuizzes = await Quiz.insertMany(allQuizData, {
      ordered: false,
      rawResult: true, // This helps capture more details about the insertion
    });

    console.log(`Inserted ${insertedQuizzes.insertedCount} quiz documents`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    process.exit();
  }
};

seedQuizzes();
