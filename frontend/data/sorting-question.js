// data structure containing the exercises data
const sortingData = {
  "Bubble Sort": [
    {
      // Exercise 1
      title: "Bubble Sort 1",
      instruction:
        "Implement a Python function called bubble_sort_swaps_1 that sorts a list of integers using the bubble sort algorithm. The function should return a tuple containing the sorted list and the number of swaps made during the sorting process. Fill in the missing part of the code below to achieve this.",
      questions: [
        `def bubble_sort_swaps_1(arr: list[int]) -> tuple[list[int], int]:
          n = len(arr)
          swap_count = 0
          for i in range(n):
              for j in range(0, n-i-1):
                  if arr[j] > arr[j+1]]:
                      arr[j], arr[j+1] = arr[j+1], arr[j]
                      swap_count += 1
          ______ arr, swap_count`,
      ],
      answer: "return",
    },
    // Exercise 2
    {
      title: "Bubble Sort 2",
      instruction: `Complete the code snippet below. After sorting the array 'arr1' using the function 'bubble_sort_swaps_1', print the original array, the sorted array, and the number of swaps made during the sorting process. Fill in the blank with the appropriate function.`,
      questions: [
        `arr1 = [5, 3, 8, 4, 2]
        sorted_arr1, swaps1 = bubble_sort_swaps_1(arr1.copy())
        print(f"Original array: {arr1}")
        ______(f"Sorted array: {sorted_arr1}, Number of swaps: {swaps1}")`,
      ],
      answer: "print",
    }, // Exercise 3
    {
      title: "Bubble Sort 3",
      instruction: `Modify the provided Python function 'bubble_sort_swaps_3' to correctly implement the bubble sort algorithm. Fill in the missing part of the code to achieve this.`,
      questions: [
        `def bubble_sort_swaps_3(arr: list[int]) -> tuple[list[int], int]:
          swap_count = 0
          swapped = True
          while swapped:
              swapped = False
              for i in range(len(arr) - 1):
                  if ______[i] > arr[i + 1]:
                      arr[i], arr[i + 1] = arr[i + 1], arr[i]
                      swap_count += 1
                      swapped = True
          return arr, swap_count`,
      ],
      answer: "arr",
    },
    // Exercise 4
    {
      title: "Bubble Sort 4",
      instruction: `Complete the function 'bubble_sort_swaps_5' below. The function should sort a list of integers using the bubble sort algorithm and return a tuple containing the sorted list and the number of swaps made during the sorting process. Fill in the blank with the appropriate operator.`,
      questions: [
        `def bubble_sort_swaps_5(arr: list[int]) -> tuple[list[int], int]:
        n = len(arr)
        swap_count = 0
        for i in range(n):
            for j in range(1, n-i):
                if arr[j-1] > arr[j]:
                    arr[j-1], arr[j] = arr[j], arr[j-1]
                    swap_count ______ 1
        return arr, swap_count`,
      ],
      answer: "+=",
    },
    // Exercise 5
    {
      title: "Bubble Sort 5",
      instruction: `Identify and fix the issue in the provided Python function 'bubble_sort_swaps_3'. Fill in the missing part of the code to resolve the problem.`,
      questions: [
        `def bubble_sort_swaps_3(arr: list[int]) -> tuple[list[int], int]:
          swap_count = 0
          swapped = True
          while swapped:
              swapped = False
              for i in range(len(arr) - 1):
                  if arr[i] > arr[i + 1]:
                      arr[i], arr[i + 1] = arr[i + 1], arr[i]
                      swap_count += 1
                      ______ = True
          return arr, swap_count`,
      ],
      answer: "swapped",
    },
  ],
  "Merge Sort": [
    // Exercise 1
    {
      title: "Merge Sort 1",
      instruction:
        "Complete the provided code snippet to ensure correct merging of two sorted arrays in the Merge Sort algorithm. Maintain the sorted order while merging the arrays.",
      questions: [
        `while i < len(left) and j < len(right):
            if left[i] ______ right[j]:  
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
      result.extend(left[i:])
      result.extend(right[j:])
      return result`,
      ],
      answer: "<=",
    },
    // exercise 2
    {
      title: "Merge Sort 2",
      instruction:
        "Fill in the code below to merge two sorted arrays accurately within the Merge Sort algorithm. Ensure elements are arranged correctly during the merging process.",
      questions: [
        `while i < len(left) and j < len(right):
          if left[i] <= right[j]: 
              result.append(left[i])
              i += 1
          ______:
              result.append(right[j])
              j += 1
          result.extend(left[i:])
          result.extend(right[j:])
          return result`,
      ],
      answer: "else",
    },
    // exercise 3
    {
      title: "Merge Sort 3",
      instruction:
        "Implement the missing condition in the code snippet to merge two sorted arrays seamlessly within the Merge Sort algorithm. Preserve the sorted order while merging.",
      questions: [
        `______ i < len(left) and j < len(right):
              if left[i] <= right[j]: 
                  result.append(left[i])
                  i += 1
              else:
                  result.append(right[j])
                  j += 1
          result.extend(left[i:])
          result.extend(right[j:])
          return result`,
      ],
      answer: "while",
    },
    // exercise 4
    {
      title: "Merge Sort 4",
      instruction:
        "Ensure proper merging of two sorted arrays by completing the code snippet provided. Arrange elements correctly and merge them without missing any element.",
      questions: [
        `while i < len(left) and j < len(right):
              if left[i] <= right[j]: 
                  result.append(left[i])
                  i += 1
              else:
                  result.append(right[j])
                  j ______ 1
          result.extend(left[i:])
          result.extend(right[j:])
          return result`,
      ],
      answer: "+=",
    },
    // Exercise 5
    {
      title: "Merge Sort 5",
      instruction:
        "Complete the code below to merge two sorted arrays within the Merge Sort algorithm. Analyze the code to determine the appropriate statement to complete the process.",
      questions: [
        `while i < len(left) and j < len(right):
          if left[i] <= right[j]: 
              result.append(left[i])
              i += 1
          else:
              result.append(right[j])
              j += 1
          result.extend(left[i:])
          result.extend(right[j:])
          ______ result`,
      ],
      answer: "return",
    },
  ],
  "Selection Sort": [
    // Exercise 1
    {
      title: "Selection Sort 1",
      instruction:
        "In the provided code snippet, identify and fill in the blank to correctly update the index of the minimum element in the array during each iteration of the Selection Sort algorithm.",
      questions: [
        `n = len(arr)
          for i in range(n):
              min_idx = i
              for j in range(i+1, n):
                  if arr[j] < arr[______]:
                      min_idx = j
              arr[i], arr[min_idx] = arr[min_idx], arr[i]
          return arr`,
      ],
      answer: "min_idx",
    },
    // exercise 2
    {
      title: "Selection Sort 2",
      instruction:
        "Complete the code below to ensure the correct identification of the index of the minimum element in the array during each iteration of the Selection Sort algorithm.",
      questions: [
        `n = len(arr)
          for i in range(n):
              min_idx = i
              for j in range(i+1, n):
                  if arr[j] < arr[min_idx]:
                      min_idx = ______
              arr[i], arr[min_idx] = arr[min_idx], arr[i]
          return arr`,
      ],
      answer: "j",
    },
    // exercise 3
    {
      title: "Selection Sort 3",
      instruction:
        "Fill in the missing part of the code snippet to iterate over the array and find the index of the minimum element in each iteration of the Selection Sort algorithm.",
      questions: [
        `n = len(arr)
        for i in ______(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        return arr`,
      ],
      answer: "range",
    },
    // exercise 4
    {
      title: "Selection Sort 4",
      instruction:
        "Complete the code snippet provided to initialize the index of the minimum element in the array during each iteration of the Selection Sort algorithm.",
      questions: [
        `n = len(arr)
        for i in range(n):
            min_idx = ______
            for j in range(i+1, n):
                if arr[j] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        return arr`,
      ],
      answer: "i",
    },
    // Exercise 5
    {
      title: "Selection Sort 5",
      instruction:
        "In the code provided, determine and fill in the blank to compare elements in the array and determine the index of the minimum element during each iteration of the Selection Sort algorithm",
      questions: [
        `n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i+1, n):
                if arr[______] < arr[min_idx]:
                    min_idx = j
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
        return arr`,
      ],
      answer: "j",
    },
  ],
  "Insertion Sort": [
    // Exercise 1
    {
      title: "Insertion Sort 1",
      instruction:
        "Complete the code below to perform Insertion Sort on the provided array. Analyze the code to determine what should replace the blank space.",
      questions: [
        `for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and key < arr[j]:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = ______
        return arr`,
      ],
      answer: "key",
    },
    // exercise 2
    {
      title: "Insertion Sort 2",
      instruction:
        "Fill in the blank in the code snippet below to correctly adjust the index 'j' during each iteration of Insertion Sort.",
      questions: [
        `for i in range(1, len(arr)):
          key = arr[i]
          j = i - ______
          while j >= 0 and key < arr[j]:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
        return arr`,
      ],
      answer: "1",
    },
    // exercise 3
    {
      title: "Insertion Sort 3",
      instruction:
        "In the provided code snippet, identify and fill in the blank to ensure the correct condition for the while loop in Insertion Sort.",
      questions: [
        `for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          ______ j >= 0 and key < arr[j]:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
        return arr`,
      ],
      answer: "while",
    },
    // exercise 4
    {
      title: "Insertion Sort 4",
      instruction:
        "Complete the code snippet provided to ensure proper placement of the 'key' element in the array during each iteration of Insertion Sort.",
      questions: [
        `for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and key < arr[j]:
              arr[______] = arr[j]
              j -= 1
          arr[j + 1] = key
        return arr`,
      ],
      answer: "j + 1",
    },
    // Exercise 5
    {
      title: "Insertion Sort 5",
      instruction:
        "Analyze the code provided and fill in the blank to decrement the index 'j' correctly during each iteration of Insertion Sort.",
      questions: [
        `for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and key < arr[j]:
              arr[j + 1] = arr[j]
              j ______ 1
          arr[j + 1] = key
        return arr`,
      ],
      answer: "-=",
    },
  ],
};
// export the file to the main script
export default sortingData;
