/* ============================================
   CareerCopilot Coding Practice Logic
   Professional HackerRank-style experience with Monaco Editor
   ============================================ */

(function(){
  let currentProblem = null;
  let filteredProblems = [];
  let currentFilters = {
    difficulty: ['all'],
    topic: 'all',
    status: 'all',
    search: ''
  };
  let monacoEditor = null;
  let fallbackEditor = null;
  let currentLanguage = 'javascript';

  function getEditorCode() {
    if (monacoEditor) return monacoEditor.getValue();
    if (fallbackEditor) return fallbackEditor.value;
    return '';
  }

  function setEditorCode(code) {
    if (monacoEditor) {
      monacoEditor.setValue(code);
    } else if (fallbackEditor) {
      fallbackEditor.value = code;
    }
  }
  // Build a problem-aware starter stub (JS gets the exact function name the
  // judge expects so users can rely on automated grading).
  function getStarterCode(problem, language) {
    const cfg = LANGUAGE_CONFIG[language];
    const base = cfg ? cfg.defaultCode : '';
    if (!problem) return base;
    const j = (typeof PROBLEM_JUDGES !== 'undefined') ? PROBLEM_JUDGES[problem.id] : null;
    if (language === 'javascript' && j) {
      return `// ${problem.title}\n// Implement ${j.funcName}(...) and return the result.\n// It is run against real test cases when you click Run / Submit.\nfunction ${j.funcName}() {\n    // Your code here\n}`;
    }
    return base;
  }

  // Language configurations for Monaco Editor
  const LANGUAGE_CONFIG = {
    python: {
      monaco: 'python',
      defaultCode: `# Write your solution here
def solve():
    pass

if __name__ == "__main__":
    solve()`,
      functionPattern: /def\s+\w+\s*\(/,
      mainPattern: /def\s+main\s*\(/,
      classPattern: /class\s+\w+/
    },
    javascript: {
      monaco: 'javascript',
      defaultCode: `// Write your solution here
function solve() {
    // Your code here
}

solve();`,
      functionPattern: /function\s+\w+\s*\(/,
      mainPattern: /function\s+main\s*\(/,
      classPattern: /class\s+\w+/
    },
    java: {
      monaco: 'java',
      defaultCode: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
      functionPattern: /public\s+static\s+\w+\s+\w+\s*\(/,
      mainPattern: /public\s+static\s+void\s+main\s*\(/,
      classPattern: /public\s+class\s+\w+/
    },
    cpp: {
      monaco: 'cpp',
      defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
      functionPattern: /\w+\s+\w+\s*\(/,
      mainPattern: /int\s+main\s*\(/,
      classPattern: /class\s+\w+/
    },
    c: {
      monaco: 'c',
      defaultCode: `#include <stdio.h>

int main() {
    // Write your solution here
    return 0;
}`,
      functionPattern: /\w+\s+\w+\s*\(/,
      mainPattern: /int\s+main\s*\(/,
      classPattern: null
    }
  };

  // Test cases for problems
  const PROBLEM_TEST_CASES = {
    'arr1': {
      sample: [
        { input: '[2,7,11,15], 9', expected: '[0,1]' },
        { input: '[3,2,4], 6', expected: '[1,2]' },
        { input: '[3,3], 6', expected: '[0,1]' }
      ],
      hidden: [
        { input: '[1,2,3,4,5], 9', expected: '[3,4]' },
        { input: '[0,4,3,0], 0', expected: '[0,3]' }
      ]
    },
    'arr2': {
      sample: [
        { input: '[7,1,5,3,6,4]', expected: '5' },
        { input: '[7,6,4,3,1]', expected: '0' }
      ],
      hidden: [
        { input: '[1,2,3,4,5]', expected: '4' },
        { input: '[5,4,3,2,1]', expected: '0' }
      ]
    }
    // Add more test cases for other problems as needed
  };

  const PROBLEM_JUDGES = {
    arr1: { funcName: 'twoSum' },
    arr2: { funcName: 'maxProfit' }
  };

  // 150+ Realistic Interview Questions
  const CODING_QUESTIONS = [
    // Arrays - Easy (15)
    { id: 'arr1', title: 'Two Sum', difficulty: 'easy', topic: 'Arrays', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9', sampleInput: 'nums = [2,7,11,15], target = 9', sampleOutput: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].', hints: ['Use a hash map for O(n) solution', 'Consider edge cases with duplicates'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr2', title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', topic: 'Arrays', description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit.', constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4', sampleInput: 'prices = [7,1,5,3,6,4]', sampleOutput: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.', hints: ['Track minimum price seen so far', 'Calculate profit at each step'], companies: ['Facebook', 'Uber', 'Bloomberg'] },
    { id: 'arr3', title: 'Contains Duplicate', difficulty: 'easy', topic: 'Arrays', description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.', constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9', sampleInput: 'nums = [1,2,3,1]', sampleOutput: 'true', explanation: 'The value 1 appears twice in the array.', hints: ['Use a hash set', 'Sort and check adjacent elements'], companies: ['Amazon', 'Apple', 'LinkedIn'] },
    { id: 'arr4', title: 'Single Number', difficulty: 'easy', topic: 'Arrays', description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.', constraints: '1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4', sampleInput: 'nums = [2,2,1]', sampleOutput: '1', explanation: '1 appears only once while 2 appears twice.', hints: ['Use XOR operation', 'Hash map approach'], companies: ['Google', 'Microsoft', 'Amazon'] },
    { id: 'arr5', title: 'Majority Element', difficulty: 'easy', topic: 'Arrays', description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than n/2 times.', constraints: 'n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9', sampleInput: 'nums = [3,2,3]', sampleOutput: '3', explanation: '3 appears more than n/2 times.', hints: ['Boyer-Moore Voting Algorithm', 'Hash map counting'], companies: ['Facebook', 'Google', 'Amazon'] },
    { id: 'arr6', title: 'Move Zeroes', difficulty: 'easy', topic: 'Arrays', description: 'Move all 0\'s to the end of the array while maintaining the relative order of the non-zero elements.', constraints: '1 <= nums.length <= 10^4\n-2^31 <= nums[i] <= 2^31 - 1', sampleInput: 'nums = [0,1,0,3,12]', sampleOutput: '[1,3,12,0,0]', explanation: 'Non-zero elements maintain order, zeros moved to end.', hints: ['Two-pointer technique', 'In-place operation'], companies: ['Microsoft', 'Amazon', 'Uber'] },
    { id: 'arr7', title: 'Valid Anagram', difficulty: 'easy', topic: 'Arrays', description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters', sampleInput: 's = "anagram", t = "nagaram"', sampleOutput: 'true', explanation: 'Both strings contain the same characters with same frequency.', hints: ['Character count array', 'Sorting approach'], companies: ['Google', 'Amazon', 'Apple'] },
    { id: 'arr8', title: 'Climbing Stairs', difficulty: 'easy', topic: 'Arrays', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Return the number of distinct ways to reach the top.', constraints: '1 <= n <= 45', sampleInput: 'n = 3', sampleOutput: '3', explanation: 'There are three ways: (1+1+1), (1+2), (2+1).', hints: ['Fibonacci sequence', 'Dynamic programming'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr9', title: 'Pascal\'s Triangle', difficulty: 'easy', topic: 'Arrays', description: 'Given an integer numRows, return the first numRows of Pascal\'s triangle.', constraints: '1 <= numRows <= 30', sampleInput: 'numRows = 5', sampleOutput: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]', explanation: 'Each number is the sum of the two numbers directly above it.', hints: ['Use previous row to calculate current row', 'Dynamic programming'], companies: ['Microsoft', 'Amazon', 'Google'] },
    { id: 'arr10', title: 'Merge Sorted Array', difficulty: 'easy', topic: 'Arrays', description: 'Merge nums1 and nums2 into a single array sorted in non-decreasing order.', constraints: 'nums1.length == m + n\nnums2.length == n\n0 <= m, n <= 200', sampleInput: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', sampleOutput: '[1,2,2,3,5,6]', explanation: 'Merge while maintaining sorted order.', hints: ['Start from the end', 'Three-pointer technique'], companies: ['Amazon', 'Microsoft', 'Google'] },
    { id: 'arr11', title: 'Remove Element', difficulty: 'easy', topic: 'Arrays', description: 'Remove all occurrences of val in nums in-place. Return the number of elements in nums which are not equal to val.', constraints: '0 <= nums.length <= 100\n0 <= nums[i] <= 50\n0 <= val <= 100', sampleInput: 'nums = [3,2,2,3], val = 3', sampleOutput: '2, nums = [2,2,_,_]', explanation: 'First 2 elements are non-val elements.', hints: ['Two-pointer technique', 'Overwrite in-place'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr12', title: 'First Bad Version', difficulty: 'easy', topic: 'Arrays', description: 'You are a product manager and want to find the first bad version. Implement API to find the first bad version.', constraints: '1 <= bad <= n <= 2^31 - 1', sampleInput: 'n = 5, bad = 4', sampleOutput: '4', explanation: 'Version 4 is the first bad version.', hints: ['Binary search', 'Minimize API calls'], companies: ['Facebook', 'Google', 'Amazon'] },
    { id: 'arr13', title: 'Search Insert Position', difficulty: 'easy', topic: 'Arrays', description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be.', constraints: '1 <= nums.length <= 10^4\n-10^4 <= nums[i] <= 10^4', sampleInput: 'nums = [1,3,5,6], target = 5', sampleOutput: '2', explanation: 'Target found at index 2.', hints: ['Binary search', 'Handle edge cases'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr14', title: 'Maximum Subarray', difficulty: 'easy', topic: 'Arrays', description: 'Find the contiguous subarray which has the largest sum and return its sum.', constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4', sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', sampleOutput: '6', explanation: '[4,-1,2,1] has the largest sum = 6.', hints: ['Kadane\'s algorithm', 'Track current and maximum sum'], companies: ['Amazon', 'Google', 'Facebook'] },
    { id: 'arr15', title: 'Summary Ranges', difficulty: 'easy', topic: 'Arrays', description: 'You are given a sorted unique integer array nums. Return the smallest sorted list of ranges that cover all the numbers in the array exactly.', constraints: '0 <= nums.length <= 100\n0 <= nums[i] <= 100', sampleInput: 'nums = [0,1,2,4,5,7]', sampleOutput: '["0->2","4->5","7"]', explanation: 'Ranges are formed by consecutive numbers.', hints: ['Iterate and track ranges', 'Handle single elements'], companies: ['Google', 'Microsoft', 'Amazon'] },

    // Arrays - Medium (15)
    { id: 'arr16', title: '3Sum', difficulty: 'medium', topic: 'Arrays', description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', constraints: '0 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5', sampleInput: 'nums = [-1,0,1,2,-1,-4]', sampleOutput: '[[-1,-1,2],[-1,0,1]]', explanation: 'Two unique triplets sum to zero.', hints: ['Sort the array first', 'Use two-pointer technique', 'Skip duplicates'], companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'] },
    { id: 'arr17', title: 'Set Matrix Zeroes', difficulty: 'medium', topic: 'Arrays', description: 'Given an m x n matrix, if an element is 0, set its entire row and column to 0. Do it in-place.', constraints: 'm == matrix.length\nn == matrix[0].length\n1 <= m, n <= 200', sampleInput: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', sampleOutput: '[[1,0,1],[0,0,0],[1,0,1]]', explanation: 'Row 1 and column 1 set to zero.', hints: ['Use first row/col as markers', 'O(1) space solution'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr18', title: 'Spiral Matrix', difficulty: 'medium', topic: 'Arrays', description: 'Given an m x n matrix, return all elements of the matrix in spiral order.', constraints: 'm == matrix.length\nn == matrix[i].length\n1 <= m, n <= 10', sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', sampleOutput: '[1,2,3,6,9,8,7,4,5]', explanation: 'Traverse in spiral order: right, down, left, up.', hints: ['Track boundaries', 'Four-direction traversal'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr19', title: 'Rotate Image', difficulty: 'medium', topic: 'Arrays', description: 'Rotate an n x n matrix by 90 degrees clockwise in-place.', constraints: 'n == matrix.length == matrix[i].length\n1 <= n <= 20', sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', sampleOutput: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: 'Matrix rotated 90 degrees clockwise.', hints: ['Transpose then reverse rows', 'Layer by layer rotation'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr20', title: 'Word Search', difficulty: 'medium', topic: 'Arrays', description: 'Given an m x n board and a word, find if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cells.', constraints: 'm == board.length\nn = board[i].length\n1 <= m, n <= 6', sampleInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', sampleOutput: 'true', explanation: 'Word exists by path: A->B->C->C->E->D.', hints: ['DFS backtracking', 'Mark visited cells'], companies: ['Amazon', 'Google', 'Facebook'] },
    { id: 'arr21', title: 'Longest Consecutive Sequence', difficulty: 'medium', topic: 'Arrays', description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.', constraints: '0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9', sampleInput: 'nums = [100,4,200,1,3,2]', sampleOutput: '4', explanation: 'Longest consecutive sequence is [1,2,3,4].', hints: ['Use hash set', 'Start from sequence beginnings'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr22', title: 'Product of Array Except Self', difficulty: 'medium', topic: 'Arrays', description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', constraints: '2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30', sampleInput: 'nums = [1,2,3,4]', sampleOutput: '[24,12,8,6]', explanation: 'answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc.', hints: ['Prefix and suffix products', 'O(1) space excluding output'], companies: ['Amazon', 'Google', 'Facebook'] },
    { id: 'arr23', title: 'Container With Most Water', difficulty: 'medium', topic: 'Arrays', description: 'Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.', constraints: 'n == height.length\n2 <= n <= 10^5', sampleInput: 'height = [1,8,6,2,5,4,8,3,7]', sampleOutput: '49', explanation: 'Lines at index 1 and 8 form container with area 49.', hints: ['Two-pointer technique', 'Move pointer with smaller height'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr24', title: '4Sum', difficulty: 'medium', topic: 'Arrays', description: 'Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a + b + c + d = target.', constraints: '1 <= nums.length <= 200\n-10^9 <= nums[i] <= 10^9', sampleInput: 'nums = [1,0,-1,0,-2,2], target = 0', sampleOutput: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]', explanation: 'Three unique quadruplets sum to target.', hints: ['Sort and use two pointers', 'Skip duplicates'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr25', title: 'Gas Station', difficulty: 'medium', topic: 'Arrays', description: 'There are n gas stations along a circular route. Given gas and cost arrays, return the starting gas station index if you can travel around the circuit once, otherwise return -1.', constraints: 'gas.length == n\ncost.length == n\n1 <= n <= 10^5', sampleInput: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', sampleOutput: '3', explanation: 'Start at index 3, complete the circuit.', hints: ['Track total gas and current gas', 'Greedy approach'], companies: ['Amazon', 'Google', 'Uber'] },
    { id: 'arr26', title: 'Candy', difficulty: 'medium', topic: 'Arrays', description: 'There are n children standing in a line. Each child is assigned a rating. Give candies to children with constraints. Return minimum candies needed.', constraints: 'n == ratings.length\n1 <= n <= 2 * 10^4', sampleInput: 'ratings = [1,0,2]', sampleOutput: '5', explanation: 'Candies: [2,1,2] = 5 total.', hints: ['Two passes: left to right and right to left', 'Take maximum of both passes'], companies: ['Google', 'Amazon', 'Microsoft'] },
    { id: 'arr27', title: 'Trapping Rain Water', difficulty: 'medium', topic: 'Arrays', description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.', constraints: 'n == height.length\n1 <= n <= 2 * 10^4', sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', sampleOutput: '6', explanation: '6 units of water can be trapped.', hints: ['Two-pointer technique', 'Track left and right max'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr28', title: 'Jump Game', difficulty: 'medium', topic: 'Arrays', description: 'You are given an integer array nums. You are initially positioned at the first index. Determine if you can reach the last index.', constraints: '1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5', sampleInput: 'nums = [2,3,1,1,4]', sampleOutput: 'true', explanation: 'Jump 1 step to index 1, then 3 steps to last index.', hints: ['Greedy approach', 'Track farthest reachable'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr29', title: 'Merge Intervals', difficulty: 'medium', topic: 'Arrays', description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.', constraints: '1 <= intervals.length <= 10^4\nintervals[i].length == 2', sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', sampleOutput: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, merge to [1,6].', hints: ['Sort by start time', 'Iterate and merge'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr30', title: 'Insert Interval', difficulty: 'medium', topic: 'Arrays', description: 'Given a set of non-overlapping intervals, insert a new interval and merge if necessary.', constraints: '0 <= intervals.length <= 10^4\nintervals[i].length == 2', sampleInput: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', sampleOutput: '[[1,5],[6,9]]', explanation: 'New interval [2,5] merges with [1,3].', hints: ['Add new interval, sort, then merge', 'Three cases: before, overlap, after'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Arrays - Hard (10)
    { id: 'arr31', title: 'Median of Two Sorted Arrays', difficulty: 'hard', topic: 'Arrays', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', constraints: 'nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000', sampleInput: 'nums1 = [1,3], nums2 = [2]', sampleOutput: '2.0', explanation: 'Merged array = [1,2,3], median = 2.0.', hints: ['Binary search on smaller array', 'Partition approach'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr32', title: 'Largest Rectangle in Histogram', difficulty: 'hard', topic: 'Arrays', description: 'Given an array of integers heights representing histogram\'s bar height, return the area of largest rectangle in the histogram.', constraints: '1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4', sampleInput: 'heights = [2,1,5,6,2,3]', sampleOutput: '10', explanation: 'Largest rectangle has area 10 (bars at indices 2 and 3).', hints: ['Monotonic stack', 'Track indices'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr33', title: 'Sliding Window Maximum', difficulty: 'hard', topic: 'Arrays', description: 'You are given an array of integers nums and an integer k. Return the max sliding window of size k.', constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length', sampleInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', sampleOutput: '[3,3,5,5,6,7]', explanation: 'Max of each window of size 3.', hints: ['Deque (monotonic queue)', 'Maintain decreasing order'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr34', title: 'Minimum Window Substring', difficulty: 'hard', topic: 'Arrays', description: 'Given two strings s and t, return the minimum window substring of s that contains all characters of t.', constraints: 'm == s.length\nn == t.length\n1 <= m, n <= 10^5', sampleInput: 's = "ADOBECODEBANC", t = "ABC"', sampleOutput: '"BANC"', explanation: 'Minimum window containing all characters of t is "BANC".', hints: ['Sliding window with hash map', 'Expand and contract'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr35', title: 'Merge k Sorted Lists', difficulty: 'hard', topic: 'Arrays', description: 'Merge k sorted linked lists and return it as one sorted list.', constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500', sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]', sampleOutput: '[1,1,2,3,4,4,5,6]', explanation: 'All lists merged into one sorted list.', hints: ['Min-heap (priority queue)', 'Divide and conquer'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr36', title: 'Find Median from Data Stream', difficulty: 'hard', topic: 'Arrays', description: 'Implement MedianFinder class that supports addNum and findMedian operations.', constraints: '-10^5 <= num <= 10^5\nAt most 5 * 10^4 calls will be made', sampleInput: 'addNum(1), addNum(2), findMedian() -> 1.5', sampleOutput: '1.5', explanation: 'Median of [1,2] is 1.5.', hints: ['Two heaps: max-heap for lower half, min-heap for upper half', 'Balance heaps'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'arr37', title: 'Skyline Problem', difficulty: 'hard', topic: 'Arrays', description: 'A city\'s skyline is the outer contour of the silhouette formed by all buildings. Compute the skyline.', constraints: '1 <= buildings.length <= 10^4\n0 <= lefti < righti <= 2^31 - 1', sampleInput: 'buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]', sampleOutput: '[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]', explanation: 'Skyline formed by building contours.', hints: ['Sweep line algorithm', 'Priority queue'], companies: ['Google', 'Amazon', 'Microsoft'] },
    { id: 'arr38', title: 'Meeting Rooms II', difficulty: 'hard', topic: 'Arrays', description: 'Given an array of meeting time intervals, find the minimum number of conference rooms required.', constraints: '1 <= intervals.length <= 10^4\n0 <= starti < endi <= 10^6', sampleInput: 'intervals = [[0,30],[5,10],[15,20]]', sampleOutput: '2', explanation: 'Need 2 rooms: one for [0,30], one for [5,10] and [15,20].', hints: ['Sort start and end times', 'Track concurrent meetings'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'arr39', title: 'Palindrome Pairs', difficulty: 'hard', topic: 'Arrays', description: 'Given a list of unique words, return all pairs of distinct indices (i, j) such that the concatenation of the two words is a palindrome.', constraints: '1 <= words.length <= 5000\n0 <= words[i].length <= 300', sampleInput: 'words = ["abcd","dcba","lls","s","sssll"]', sampleOutput: '[[0,1],[1,0],[3,2],[2,4]]', explanation: 'Pairs that form palindromes when concatenated.', hints: ['Hash map with reversed words', 'Check all possible splits'], companies: ['Google', 'Amazon', 'Microsoft'] },
    { id: 'arr40', title: 'Word Ladder II', difficulty: 'hard', topic: 'Arrays', description: 'Given beginWord, endWord, and a wordList, return all shortest transformation sequences from beginWord to endWord.', constraints: '1 <= wordList.length <= 5000', sampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', sampleOutput: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]', explanation: 'Two shortest transformation sequences.', hints: ['BFS with path tracking', 'Bidirectional BFS'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Strings - Easy (15)
    { id: 'str1', title: 'Valid Palindrome', difficulty: 'easy', topic: 'Strings', description: 'Given a string s, return true if it is a palindrome, or false otherwise.', constraints: '1 <= s.length <= 2 * 10^5\ns consists of printable ASCII characters', sampleInput: 's = "A man, a plan, a canal: Panama"', sampleOutput: 'true', explanation: 'After removing non-alphanumeric characters and converting to lowercase, it reads the same forward and backward.', hints: ['Two-pointer technique', 'Ignore case and non-alphanumeric'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str2', title: 'Longest Common Prefix', difficulty: 'easy', topic: 'Strings', description: 'Find the longest common prefix string amongst an array of strings.', constraints: '1 <= strs.length <= 200\n0 <= strs[i].length <= 200', sampleInput: 'strs = ["flower","flow","flight"]', sampleOutput: '"fl"', explanation: 'The longest common prefix is "fl".', hints: ['Vertical scanning', 'Horizontal scanning'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str3', title: 'Reverse String', difficulty: 'easy', topic: 'Strings', description: 'Write a function that reverses a string. The input string is given as an array of characters s.', constraints: '1 <= s.length <= 10^5', sampleInput: 's = ["h","e","l","l","o"]', sampleOutput: '["o","l","l","e","h"]', explanation: 'String reversed in-place.', hints: ['Two-pointer technique', 'Swap from ends'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str4', title: 'First Unique Character in a String', difficulty: 'easy', topic: 'Strings', description: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.', constraints: '1 <= s.length <= 10^5', sampleInput: 's = "leetcode"', sampleOutput: '0', explanation: 'The character "l" at index 0 is the first non-repeating character.', hints: ['Hash map for character count', 'Two-pass approach'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str5', title: 'Valid Parentheses', difficulty: 'easy', topic: 'Strings', description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', constraints: '1 <= s.length <= 10^4', sampleInput: 's = "()[]{}"', sampleOutput: 'true', explanation: 'All brackets are properly closed.', hints: ['Stack approach', 'Match opening with closing'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str6', title: 'Implement strStr()', difficulty: 'easy', topic: 'Strings', description: 'Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.', constraints: '1 <= haystack.length, needle.length <= 10^4', sampleInput: 'haystack = "hello", needle = "ll"', sampleOutput: '2', explanation: '"ll" occurs at index 2.', hints: ['Sliding window', 'KMP algorithm'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str7', title: 'Length of Last Word', difficulty: 'easy', topic: 'Strings', description: 'Given a string s consisting of words and spaces, return the length of the last word in the string.', constraints: '1 <= s.length <= 10^4', sampleInput: 's = "Hello World"', sampleOutput: '5', explanation: 'The last word is "World" with length 5.', hints: ['Split by spaces', 'Trim trailing spaces'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str8', title: 'Add Binary', difficulty: 'easy', topic: 'Strings', description: 'Given two binary strings a and b, return their sum as a binary string.', constraints: '1 <= a.length, b.length <= 10^4', sampleInput: 'a = "11", b = "1"', sampleOutput: '"100"', explanation: '11 (3) + 1 (1) = 4 (100 in binary).', hints: ['Add bit by bit from right', 'Handle carry'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str9', title: 'Reverse Words in a String III', difficulty: 'easy', topic: 'Strings', description: 'Given a string s, reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.', constraints: '1 <= s.length <= 5 * 10^4', sampleInput: 's = "Let\'s take LeetCode contest"', sampleOutput: '"s\'teL ekat edoCteeL tsetnoc"', explanation: 'Each word reversed while maintaining order.', hints: ['Split by spaces', 'Reverse each word'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str10', title: 'To Lower Case', difficulty: 'easy', topic: 'Strings', description: 'Given a string s, return the string after replacing every uppercase letter with the same lowercase letter.', constraints: 's consists of printable ASCII characters', sampleInput: 's = "Hello"', sampleOutput: '"hello"', explanation: 'All uppercase converted to lowercase.', hints: ['ASCII manipulation', 'Character codes'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str11', title: 'Reverse Integer', difficulty: 'easy', topic: 'Strings', description: 'Given a signed 32-bit integer x, return x with its digits reversed.', constraints: '-2^31 <= x <= 2^31 - 1', sampleInput: 'x = 123', sampleOutput: '321', explanation: 'Digits reversed: 123 -> 321.', hints: ['Modulo and division', 'Handle overflow'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str12', title: 'String to Integer (atoi)', difficulty: 'easy', topic: 'Strings', description: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.', constraints: '0 <= s.length <= 200', sampleInput: 's = "42"', sampleOutput: '42', explanation: 'String converted to integer 42.', hints: ['Handle whitespace, sign, overflow', 'Stop at non-digit'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str13', title: 'Count and Say', difficulty: 'easy', topic: 'Strings', description: 'The count-and-say sequence is a sequence of digit strings defined recursively. Return the nth term.', constraints: '1 <= n <= 30', sampleInput: 'n = 4', sampleOutput: '"1211"', explanation: '1 -> "11" -> "21" -> "1211"', hints: ['Iterative construction', 'Count consecutive digits'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str14', title: 'Isomorphic Strings', difficulty: 'easy', topic: 'Strings', description: 'Given two strings s and t, determine if they are isomorphic.', constraints: '1 <= s.length <= 5 * 10^4', sampleInput: 's = "egg", t = "add"', sampleOutput: 'true', explanation: 'Characters can be replaced to get the other string.', hints: ['Hash map for character mapping', 'Check both directions'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str15', title: 'Repeated Substring Pattern', difficulty: 'easy', topic: 'Strings', description: 'Given a string s, check if it can be constructed by taking a substring of it multiple times.', constraints: '1 <= s.length <= 10^4', sampleInput: 's = "abab"', sampleOutput: 'true', explanation: '"ab" repeated twice forms "abab".', hints: ['KMP failure function', 'String concatenation trick'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Strings - Medium (15)
    { id: 'str16', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', topic: 'Strings', description: 'Given a string s, find the length of the longest substring without repeating characters.', constraints: '0 <= s.length <= 5 * 10^4', sampleInput: 's = "abcabcbb"', sampleOutput: '3', explanation: 'The answer is "abc" with length 3.', hints: ['Sliding window', 'Hash map for last occurrence'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str17', title: 'Longest Repeating Character Replacement', difficulty: 'medium', topic: 'Strings', description: 'You are given a string s and an integer k. You can replace any character with another uppercase English character at most k times.', constraints: '1 <= s.length <= 10^5', sampleInput: 's = "ABAB", k = 2', sampleOutput: '4', explanation: 'Replace two A\'s with B\'s to get "BBBB".', hints: ['Sliding window', 'Track max frequency'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str18', title: 'Minimum Window Substring', difficulty: 'medium', topic: 'Strings', description: 'Given two strings s and t, return the minimum window substring of s that contains all characters of t.', constraints: 'm == s.length\nn == t.length\n1 <= m, n <= 10^5', sampleInput: 's = "ADOBECODEBANC", t = "ABC"', sampleOutput: '"BANC"', explanation: 'Minimum window containing all characters of t is "BANC".', hints: ['Sliding window with hash map', 'Expand and contract'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str19', title: 'Group Anagrams', difficulty: 'medium', topic: 'Strings', description: 'Given an array of strings strs, group the anagrams together.', constraints: '1 <= strs.length <= 10^4', sampleInput: 'strs = ["eat","tea","tan","ate","nat","bat"]', sampleOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Group strings that are anagrams of each other.', hints: ['Sort characters as key', 'Hash map grouping'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str20', title: 'Encode and Decode Strings', difficulty: 'medium', topic: 'Strings', description: 'Design an algorithm to encode a list of strings to a string and decode it back.', constraints: '0 <= strs.length <= 200', sampleInput: 'strs = ["Hello","World"]', sampleOutput: 'Encoded then decoded back to original', explanation: 'Encode with length prefix, decode by reading length.', hints: ['Length prefix encoding', 'Handle special characters'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str21', title: 'Word Break', difficulty: 'medium', topic: 'Strings', description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into space-separated words.', constraints: '1 <= s.length <= 300', sampleInput: 's = "leetcode", wordDict = ["leet","code"]', sampleOutput: 'true', explanation: '"leetcode" can be segmented as "leet code".', hints: ['Dynamic programming', 'Check all possible splits'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str22', title: 'Word Search II', difficulty: 'medium', topic: 'Strings', description: 'Given an m x n board and a list of words, find all words in the board.', constraints: 'm == board.length\nn == board[i].length', sampleInput: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', sampleOutput: '["eat","oath"]', explanation: 'Words found by DFS on board.', hints: ['Trie data structure', 'DFS backtracking'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str23', title: 'Multiply Strings', difficulty: 'medium', topic: 'Strings', description: 'Given two non-negative integers num1 and num2 represented as strings, return the product as a string.', constraints: '1 <= num1.length, num2.length <= 200', sampleInput: 'num1 = "2", num2 = "3"', sampleOutput: '"6"', explanation: '2 * 3 = 6 as string.', hints: ['Simulate multiplication', 'Handle carry'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str24', title: 'Simplify Path', difficulty: 'medium', topic: 'Strings', description: 'Given a string path, which is an absolute path to a Unix-style file system, simplify it.', constraints: '1 <= path.length <= 3000', sampleInput: 'path = "/home/"', sampleOutput: '"/home"', explanation: 'Canonical path without trailing slash or multiple slashes.', hints: ['Stack for directory processing', 'Handle . and ..'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str25', title: 'Restore IP Addresses', difficulty: 'medium', topic: 'Strings', description: 'Given a string s containing only digits, return all possible valid IP addresses that can be formed.', constraints: '1 <= s.length <= 20', sampleInput: 's = "25525511135"', sampleOutput: '["255.255.11.135","255.255.111.35"]', explanation: 'Two valid IP addresses can be formed.', hints: ['Backtracking', 'Validate each segment'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str26', title: 'Basic Calculator', difficulty: 'medium', topic: 'Strings', description: 'Given a string s representing a valid expression, implement a basic calculator to evaluate it.', constraints: '1 <= s.length <= 3 * 10^5', sampleInput: 's = "1 + 1"', sampleOutput: '2', explanation: '1 + 1 = 2', hints: ['Stack for operators', 'Handle parentheses'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str27', title: 'Basic Calculator II', difficulty: 'medium', topic: 'Strings', description: 'Given a string s which represents an expression, evaluate this expression and return its value.', constraints: '3 <= s.length <= 3 * 10^5', sampleInput: 's = "3+2*2"', sampleOutput: '7', explanation: '3 + (2 * 2) = 7', hints: ['Stack or one-pass', 'Handle operator precedence'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str28', title: 'Decode Ways', difficulty: 'medium', topic: 'Strings', description: 'A message containing letters from A-Z can be encoded into numbers. Given a string s containing only digits, return the number of ways to decode it.', constraints: '1 <= s.length <= 100', sampleInput: 's = "12"', sampleOutput: '2', explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).', hints: ['Dynamic programming', 'Check 1 or 2 digit combinations'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str29', title: 'Edit Distance', difficulty: 'medium', topic: 'Strings', description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', constraints: '0 <= word1.length, word2.length <= 500', sampleInput: 'word1 = "horse", word2 = "ros"', sampleOutput: '3', explanation: 'horse -> rorse (replace h) -> rose (remove r) -> ros (remove e) = 3 operations.', hints: ['Dynamic programming', '2D DP table'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str30', title: 'Distinct Subsequences', difficulty: 'medium', topic: 'Strings', description: 'Given two strings s and t, return the number of distinct subsequences of s which equals t.', constraints: '1 <= s.length, t.length <= 1000', sampleInput: 's = "rabbbit", t = "rabbit"', sampleOutput: '3', explanation: 'Three ways to form "rabbit" from "rabbitt".', hints: ['Dynamic programming', '2D DP table'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Strings - Hard (10)
    { id: 'str31', title: 'Longest Palindromic Substring', difficulty: 'hard', topic: 'Strings', description: 'Given a string s, return the longest palindromic substring in s.', constraints: '1 <= s.length <= 1000', sampleInput: 's = "babad"', sampleOutput: '"bab" or "aba"', explanation: 'Both "bab" and "aba" are palindromes of length 3.', hints: ['Expand around center', 'Manacher\'s algorithm'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str32', title: 'Wildcard Matching', difficulty: 'hard', topic: 'Strings', description: 'Given an input string s and a pattern p, implement wildcard pattern matching with support for \'?\' and \'*\'.', constraints: '0 <= s.length, p.length <= 2000', sampleInput: 's = "aa", p = "a"', sampleOutput: 'false', explanation: '"a" does not match "aa".', hints: ['Dynamic programming', 'Greedy for *'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str33', title: 'Regular Expression Matching', difficulty: 'hard', topic: 'Strings', description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\'.', constraints: '1 <= s.length <= 20\n1 <= p.length <= 30', sampleInput: 's = "aa", p = "a*"', sampleOutput: 'true', explanation: '"a*" can match "aa".', hints: ['Dynamic programming', 'Recursive with memoization'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str34', title: 'Substring with Concatenation of All Words', difficulty: 'hard', topic: 'Strings', description: 'You are given a string s and an array of strings words. Return all starting indices of substring(s) in s that is a concatenation of each word exactly once.', constraints: '1 <= s.length <= 10^4', sampleInput: 's = "barfoothefoobarman", words = ["foo","bar"]', sampleOutput: '[0,9]', explanation: 'Substrings starting at 0 and 9 are concatenations.', hints: ['Sliding window', 'Hash map for word counts'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str35', title: 'Scramble String', difficulty: 'hard', topic: 'Strings', description: 'We can scramble a string s to get a string t using the following algorithm. Given two strings s1 and s2, return true if s2 is a scrambled string of s1.', constraints: '1 <= s1.length == s2.length <= 30', sampleInput: 's1 = "great", s2 = "rgeat"', sampleOutput: 'true', explanation: '"rgeat" can be scrambled from "great".', hints: ['Recursive with memoization', 'Check all possible splits'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str36', title: 'Interleaving String', difficulty: 'hard', topic: 'Strings', description: 'Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.', constraints: '0 <= s1.length, s2.length <= 100', sampleInput: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', sampleOutput: 'true', explanation: 's3 can be formed by interleaving s1 and s2.', hints: ['Dynamic programming', '2D DP table'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str37', title: 'Shortest Palindrome', difficulty: 'hard', topic: 'Strings', description: 'You are given a string s. You can convert s to a palindrome by adding characters in front of it. Return the shortest palindrome you can find.', constraints: '1 <= s.length <= 5 * 10^4', sampleInput: 's = "aacecaaa"', sampleOutput: '"aaacecaaa"', explanation: 'Add "a" in front to make palindrome.', hints: ['KMP failure function', 'Find longest palindromic prefix'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str38', title: 'Text Justification', difficulty: 'hard', topic: 'Strings', description: 'Given an array of strings words and an integer maxWidth, format the text such that each line has exactly maxWidth characters.', constraints: '1 <= words.length <= 300', sampleInput: 'words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16', sampleOutput: '["This    is    an","example  of text","justification.  "]', explanation: 'Text justified to maxWidth with spaces distributed.', hints: ['Greedy approach', 'Handle last line specially'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'str39', title: 'Word Ladder', difficulty: 'hard', topic: 'Strings', description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the length of shortest transformation sequence.', constraints: '1 <= wordList.length <= 5000', sampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', sampleOutput: '5', explanation: 'hit -> hot -> dot -> dog -> cog (5 steps).', hints: ['BFS', 'Preprocess word patterns'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'str40', title: 'Concatenated Words', difficulty: 'hard', topic: 'Strings', description: 'Given an array of strings words, return all concatenated words in the given list of words.', constraints: '1 <= words.length <= 10^4', sampleInput: 'words = ["cat","cats","catsdogcats","dog","dogcatsdog"]', sampleOutput: '["catsdogcats","dogcatsdog"]', explanation: 'Words formed by concatenating other words.', hints: ['Dynamic programming', 'Word break with memoization'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Linked Lists - Easy (10)
    { id: 'll1', title: 'Reverse Linked List', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', constraints: 'The number of nodes in the list is in the range [0, 5000]', sampleInput: 'head = [1,2,3,4,5]', sampleOutput: '[5,4,3,2,1]', explanation: 'List reversed in-place.', hints: ['Iterative approach with prev pointer', 'Recursive approach'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll2', title: 'Merge Two Sorted Lists', difficulty: 'easy', topic: 'Linked Lists', description: 'Merge two sorted linked lists and return it as a sorted list.', constraints: 'The number of nodes in both lists is in the range [0, 50]', sampleInput: 'l1 = [1,2,4], l2 = [1,3,4]', sampleOutput: '[1,1,2,3,4,4]', explanation: 'Both lists merged in sorted order.', hints: ['Iterative comparison', 'Dummy head node'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll3', title: 'Linked List Cycle', difficulty: 'easy', topic: 'Linked Lists', description: 'Given head, the head of a linked list, determine if there is a cycle in the list.', constraints: '0 <= number of nodes <= 10^4', sampleInput: 'head = [3,2,0,-4], pos = 1', sampleOutput: 'true', explanation: 'There is a cycle in the linked list.', hints: ['Floyd\'s cycle detection', 'Slow and fast pointers'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll4', title: 'Remove Nth Node From End of List', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a linked list, remove the nth node from the end of the list.', constraints: 'The number of nodes in the list is sz - 1 <= sz <= 30', sampleInput: 'head = [1,2,3,4,5], n = 2', sampleOutput: '[1,2,3,5]', explanation: '2nd node from end (4) removed.', hints: ['Two-pointer technique', 'Dummy head'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll5', title: 'Middle of the Linked List', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a singly linked list, return the middle node of the linked list.', constraints: 'The number of nodes in the list is in the range [1, 100]', sampleInput: 'head = [1,2,3,4,5]', sampleOutput: 'Node with value 3', explanation: 'Middle node of odd-length list.', hints: ['Slow and fast pointers', 'Count then traverse'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll6', title: 'Palindrome Linked List', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a singly linked list, return true if it is a palindrome.', constraints: 'The number of nodes in the list is in the range [1, 10^5]', sampleInput: 'head = [1,2,2,1]', sampleOutput: 'true', explanation: 'List reads same forward and backward.', hints: ['Reverse second half', 'Compare with first half'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll7', title: 'Remove Linked List Elements', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a linked list and an integer val, remove all nodes with Node.val == val.', constraints: 'The number of nodes in the list is in the range [0, 10^4]', sampleInput: 'head = [1,2,6,3,4,5,6], val = 6', sampleOutput: '[1,2,3,4,5]', explanation: 'All nodes with value 6 removed.', hints: ['Dummy head node', 'Skip matching nodes'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll8', title: 'Intersection of Two Linked Lists', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the heads of two singly linked-lists, return the node at which the two lists intersect.', constraints: 'The number of nodes of listA is in the range [0, 10^4]', sampleInput: 'intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]', sampleOutput: 'Node with value 8', explanation: 'Lists intersect at node with value 8.', hints: ['Two-pointer from ends', 'Hash set approach'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll9', title: 'Delete Node in a Linked List', difficulty: 'easy', topic: 'Linked Lists', description: 'Write a function to delete a node in a singly-linked list given only access to that node.', constraints: 'The number of nodes in the list is in the range [2, 1000]', sampleInput: 'head = [4,5,1,9], node = 5', sampleOutput: '[4,1,9]', explanation: 'Node with value 5 deleted.', hints: ['Copy next node value', 'Skip next node'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll10', title: 'Linked List Components', difficulty: 'easy', topic: 'Linked Lists', description: 'Given head of a linked list containing integer values, return the number of connected components.', constraints: '0 <= numComponents <= 10^4', sampleInput: 'head = [0,1,2,3], G = [0,1,3]', sampleOutput: '2', explanation: 'Two connected components: [0,1] and [3].', hints: ['Hash set for G values', 'Traverse and count'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Linked Lists - Medium (10)
    { id: 'll11', title: 'Add Two Numbers', difficulty: 'medium', topic: 'Linked Lists', description: 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.', constraints: 'The number of nodes in each linked list is in the range [1, 100]', sampleInput: 'l1 = [2,4,3], l2 = [5,6,4]', sampleOutput: '[7,0,8]', explanation: '342 + 465 = 807', hints: ['Carry handling', 'Dummy head node'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'll12', title: 'Swap Nodes in Pairs', difficulty: 'medium', topic: 'Linked Lists', description: 'Given a linked list, swap every two adjacent nodes and return its head.', constraints: 'The number of nodes in the list is in the range [0, 100]', sampleInput: 'head = [1,2,3,4]', sampleOutput: '[2,1,4,3]', explanation: 'Nodes swapped in pairs.', hints: ['Iterative with prev pointer', 'Recursive approach'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll13', title: 'Reorder List', difficulty: 'medium', topic: 'Linked Lists', description: 'Given the head of a singly linked list, reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...', constraints: 'The number of nodes in the list is in the range [1, 5 * 10^4]', sampleInput: 'head = [1,2,3,4]', sampleOutput: '[1,4,2,3]', explanation: 'List reordered: first, last, second, second-last.', hints: ['Find middle with slow/fast', 'Reverse second half'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll14', title: 'Sort List', difficulty: 'medium', topic: 'Linked Lists', description: 'Given the head of a linked list, return the list after sorting it in ascending order.', constraints: 'The number of nodes in the list is in the range [0, 5 * 10^4]', sampleInput: 'head = [4,2,1,3]', sampleOutput: '[1,2,3,4]', explanation: 'List sorted in ascending order.', hints: ['Merge sort on linked list', 'Split and merge'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll15', title: 'Rotate List', difficulty: 'medium', topic: 'Linked Lists', description: 'Given the head of a linked list, rotate the list to the right by k places.', constraints: 'The number of nodes in the list is in the range [0, 500]', sampleInput: 'head = [1,2,3,4,5], k = 2', sampleOutput: '[4,5,1,2,3]', explanation: 'List rotated right by 2 positions.', hints: ['Find new tail', 'Connect head to tail'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll16', title: 'Copy List with Random Pointer', difficulty: 'medium', topic: 'Linked Lists', description: 'A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy.', constraints: '0 <= n <= 1000', sampleInput: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', sampleOutput: 'Deep copy of list', explanation: 'New list with same structure and random pointers.', hints: ['Hash map for original to copy', 'Two-pass approach'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'll17', title: 'LRU Cache', difficulty: 'medium', topic: 'Linked Lists', description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.', constraints: '1 <= capacity <= 3000', sampleInput: 'LRUCache(2), put(1,1), put(2,2), get(1) -> 1, put(3,3), get(2) -> -1', sampleOutput: 'LRU cache operations work as expected', explanation: 'Least recently used items evicted when capacity exceeded.', hints: ['Hash map + doubly linked list', 'O(1) get and put'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'll18', title: 'Insertion Sort List', difficulty: 'medium', topic: 'Linked Lists', description: 'Given the head of a singly linked list, sort the list using insertion sort.', constraints: 'The number of nodes in the list is in the range [1, 5000]', sampleInput: 'head = [4,2,1,3]', sampleOutput: '[1,2,3,4]', explanation: 'List sorted using insertion sort.', hints: ['Extract and insert in sorted position', 'Maintain sorted portion'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll19', title: 'Design Linked List', difficulty: 'medium', topic: 'Linked Lists', description: 'Design your implementation of the linked list. Supports get, addAtHead, addAtTail, addAtIndex, deleteAtIndex operations.', constraints: '0 <= index, val <= 1000', sampleInput: 'Various operations on linked list', sampleOutput: 'Linked list operations work correctly', explanation: 'All operations performed in O(1) or O(n) time.', hints: ['Doubly linked list', 'Track head and tail'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll20', title: 'Flatten a Multilevel Doubly Linked List', difficulty: 'medium', topic: 'Linked Lists', description: 'You are given a doubly linked list, which contains nodes that have a next, previous, and child pointer.', constraints: 'The number of nodes will not exceed 1000', sampleInput: 'head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]', sampleOutput: '[1,2,3,7,8,11,12,9,10,4,5,6]', explanation: 'Multilevel list flattened to single level.', hints: ['DFS with stack', 'Handle child pointers'], companies: ['Amazon', 'Google', 'Microsoft'] },

    // Linked Lists - Hard (5)
    { id: 'll21', title: 'Reverse Nodes in k-Group', difficulty: 'hard', topic: 'Linked Lists', description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.', constraints: 'The number of nodes in the list is in the range [0, 5000]', sampleInput: 'head = [1,2,3,4,5], k = 2', sampleOutput: '[2,1,4,3,5]', explanation: 'Nodes reversed in groups of 2.', hints: ['Reverse in groups of k', 'Handle remaining nodes'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'll22', title: 'Merge k Sorted Lists', difficulty: 'hard', topic: 'Linked Lists', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.', constraints: 'k == lists.length\n0 <= k <= 10^4', sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]', sampleOutput: '[1,1,2,3,4,4,5,6]', explanation: 'All lists merged into one sorted list.', hints: ['Min-heap (priority queue)', 'Divide and conquer'], companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'] },
    { id: 'll23', title: 'Reverse Linked List II', difficulty: 'hard', topic: 'Linked Lists', description: 'Given the head of a singly linked list and two integers left and right, reverse the nodes from position left to position right.', constraints: 'The number of nodes in the list is in the range [1, 500]', sampleInput: 'head = [1,2,3,4,5], left = 2, right = 4', sampleOutput: '[1,4,3,2,5]', explanation: 'Nodes from position 2 to 4 reversed.', hints: ['Find positions', 'Reverse sublist'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll24', title: 'Odd Even Linked List', difficulty: 'hard', topic: 'Linked Lists', description: 'Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices.', constraints: 'The number of nodes in the list is in the range [0, 10^4]', sampleInput: 'head = [1,2,3,4,5]', sampleOutput: '[1,3,5,2,4]', explanation: 'Odd indices (1,3,5) followed by even (2,4).', hints: ['Separate odd and even', 'Reconnect'], companies: ['Amazon', 'Google', 'Microsoft'] },
    { id: 'll25', title: 'Split Linked List in Parts', difficulty: 'hard', topic: 'Linked Lists', description: 'Given the head of a singly linked list and an integer k, split the linked list into k consecutive linked list parts.', constraints: 'The number of nodes in the list is in the range [0, 1000]', sampleInput: 'head = [1,2,3], k = 5', sampleOutput: '[[1],[2],[3],[],[]]', explanation: 'List split into k parts with sizes as equal as possible.', hints: ['Calculate part sizes', 'Traverse and split'], companies: ['Amazon', 'Google', 'Microsoft'] }
  ];

  document.addEventListener('DOMContentLoaded', initCodingPage);

  function initCodingPage() {
    updateStats();
    renderProblems();
    initFilters();
    initSearch();
    initSorting();
    initMonacoEditor();
  }

  function initMonacoEditor() {
    const container = document.getElementById('monaco-editor-container');
    if (!container) return;

    function createFallbackEditor() {
      if (fallbackEditor) return;
      fallbackEditor = document.createElement('textarea');
      fallbackEditor.className = 'form-input code-fallback-editor';
      fallbackEditor.spellcheck = false;
      fallbackEditor.value = getStarterCode(currentProblem, currentLanguage);
      fallbackEditor.setAttribute('aria-label', 'Code editor');
      container.innerHTML = '';
      container.appendChild(fallbackEditor);
    }

    if (typeof require === 'undefined') {
      createFallbackEditor();
      initLanguageSelector();
      return;
    }

    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});

    require(['vs/editor/editor.main'], function() {
      // Configure Monaco theme based on current theme
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');

      monacoEditor = monaco.editor.create(container, {
        value: getStarterCode(currentProblem, currentLanguage),
        language: LANGUAGE_CONFIG[currentLanguage].monaco,
        theme: isDark ? 'vs-dark' : 'vs-light',
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        lineNumbers: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true
        },
        suggest: {
          showKeywords: true,
          showSnippets: true
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false
        }
      });

      initLanguageSelector();
    }, createFallbackEditor);
  }

  function initLanguageSelector() {
    const select = document.getElementById('language-select');
    if (!select || select.dataset.bound === 'true') return;
    select.dataset.bound = 'true';
    select.value = currentLanguage;
    select.addEventListener('change', (e) => {
      currentLanguage = e.target.value;
      const code = getStarterCode(currentProblem, currentLanguage);
      if (monacoEditor && typeof monaco !== 'undefined') {
        const config = LANGUAGE_CONFIG[currentLanguage];
        monaco.editor.setModelLanguage(monacoEditor.getModel(), config.monaco);
      }
      setEditorCode(code);
    });
  }

  function updateStats() {
    const completed = Progress.getCompleted('coding');
    const easy = CODING_QUESTIONS.filter(q => q.difficulty === 'easy' && completed.includes(q.id)).length;
    const medium = CODING_QUESTIONS.filter(q => q.difficulty === 'medium' && completed.includes(q.id)).length;
    const hard = CODING_QUESTIONS.filter(q => q.difficulty === 'hard' && completed.includes(q.id)).length;

    document.getElementById('coding-solved').textContent = completed.length;
    document.getElementById('easy-solved').textContent = easy;
    document.getElementById('medium-solved').textContent = medium;
    document.getElementById('hard-solved').textContent = hard;
  }

  function renderProblems() {
    const container = document.getElementById('problems-container');
    if (!container) return;

    const completed = Progress.getCompleted('coding');
    const bookmarks = Progress.getBookmarks('coding');

    filteredProblems = filterProblems(CODING_QUESTIONS);

    container.innerHTML = filteredProblems.map(q => {
      const isComplete = completed.includes(q.id);
      const isBookmarked = bookmarks.includes(q.id);
      const diffClass = `diff-badge-${q.difficulty}`;
      
      return `
        <div class="flex items-center gap-4 p-4 border-b" style="border-color: var(--border); cursor: pointer;" onclick="showProblemDetail('${q.id}')">
          <div class="badge ${diffClass}" style="min-width: 60px; text-align: center;">${q.difficulty}</div>
          <div style="flex: 1;">
            <div class="flex items-center gap-2">
              <span style="font-weight: 600; color: var(--text-primary);">${q.title}</span>
              ${isComplete ? '<span class="badge badge-success">✓</span>' : ''}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="tag" style="font-size: var(--text-xs);">${q.topic}</span>
              ${isBookmarked ? '<span style="color: var(--warning);">★</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('problem-count').textContent = filteredProblems.length;

    if (filteredProblems.length === 0) {
      container.innerHTML = `
        <div class="text-center p-8">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">📭</div>
          <h3 style="color: var(--text-primary);">No problems found</h3>
          <p style="color: var(--text-muted);">Try adjusting your filters</p>
        </div>
      `;
    }
  }

  function filterProblems(problems) {
    const completed = Progress.getCompleted('coding');
    const bookmarks = Progress.getBookmarks('coding');

    return problems.filter(q => {
      // Difficulty filter
      if (!currentFilters.difficulty.includes('all') && !currentFilters.difficulty.includes(q.difficulty)) {
        return false;
      }

      // Topic filter
      if (currentFilters.topic !== 'all' && q.topic !== currentFilters.topic) {
        return false;
      }

      // Status filter
      if (currentFilters.status === 'completed' && !completed.includes(q.id)) {
        return false;
      }
      if (currentFilters.status === 'pending' && completed.includes(q.id)) {
        return false;
      }
      if (currentFilters.status === 'bookmarked' && !bookmarks.includes(q.id)) {
        return false;
      }

      // Search filter
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        if (!q.title.toLowerCase().includes(searchLower) && !q.topic.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  function initFilters() {
    // Difficulty checkboxes
    document.querySelectorAll('.difficulty-filter').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.value === 'all') {
          document.querySelectorAll('.difficulty-filter').forEach(c => {
            if (c !== e.target) c.checked = false;
          });
          currentFilters.difficulty = ['all'];
          renderProblems();
        } else {
          document.querySelector('.difficulty-filter[value="all"]').checked = false;
          if (e.target.checked) {
            currentFilters.difficulty = currentFilters.difficulty.filter(d => d !== 'all');
            currentFilters.difficulty.push(e.target.value);
          } else {
            currentFilters.difficulty = currentFilters.difficulty.filter(d => d !== e.target.value);
          if (currentFilters.difficulty.length === 0) {
              currentFilters.difficulty = ['all'];
              document.querySelector('.difficulty-filter[value="all"]').checked = true;
            }
          }
          renderProblems();
        }
      });
    });

    // Topic filter
    document.getElementById('topic-filter').addEventListener('change', (e) => {
      currentFilters.topic = e.target.value;
      renderProblems();
    });

    // Status filter
    document.getElementById('status-filter').addEventListener('change', (e) => {
      currentFilters.status = e.target.value;
      renderProblems();
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('search-input');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        renderProblems();
      }, 120);
    });
  }

  function initSorting() {
    document.getElementById('sort-select').addEventListener('change', (e) => {
      const sortType = e.target.value;
      
      switch (sortType) {
        case 'difficulty':
          const diffOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          filteredProblems.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
          break;
        case 'topic':
          filteredProblems.sort((a, b) => a.topic.localeCompare(b.topic));
          break;
        case 'completed':
          const completed = Progress.getCompleted('coding');
          filteredProblems.sort((a, b) => {
            const aComplete = completed.includes(a.id) ? 1 : 0;
            const bComplete = completed.includes(b.id) ? 1 : 0;
            return bComplete - aComplete;
          });
          break;
        default:
          filteredProblems = filterProblems(CODING_QUESTIONS);
      }
      
      renderProblems();
    });
  }

  window.applyFilters = function() {
    renderProblems();
  };

  window.showProblemDetail = function(id) {
    currentProblem = CODING_QUESTIONS.find(q => q.id === id);
    if (!currentProblem) return;

    const completed = Progress.getCompleted('coding');
    const bookmarks = Progress.getBookmarks('coding');
    const isBookmarked = bookmarks.includes(id);

    // Update detail view
    document.getElementById('detail-difficulty').textContent = currentProblem.difficulty;
    document.getElementById('detail-difficulty').className = `badge diff-badge-${currentProblem.difficulty}`;
    document.getElementById('detail-topic').textContent = currentProblem.topic;
    document.getElementById('detail-title').textContent = currentProblem.title;
    document.getElementById('detail-description').textContent = currentProblem.description;
    document.getElementById('detail-constraints').textContent = currentProblem.constraints;
    document.getElementById('detail-sample-input').textContent = currentProblem.sampleInput;
    document.getElementById('detail-sample-output').textContent = currentProblem.sampleOutput;
    document.getElementById('detail-explanation').textContent = currentProblem.explanation;
    document.getElementById('detail-hints').textContent = currentProblem.hints.join('\n• ');
    document.getElementById('detail-companies').innerHTML = currentProblem.companies.map(c => `<span class="tag">${c}</span>`).join(' ');
    document.getElementById('detail-bookmark-btn').textContent = isBookmarked ? '★' : '☆';
    document.getElementById('detail-bookmark-btn').style.color = isBookmarked ? 'var(--warning)' : 'var(--text-secondary)';
    renderTestCasesPanel(currentProblem);

    // Reset editor and output
    setEditorCode(getStarterCode(currentProblem, currentLanguage));
    document.getElementById('output-console').textContent = 'Output will appear here...';
    document.getElementById('output-console').style.color = 'var(--text-secondary)';
    document.getElementById('test-results').textContent = '';

    // Switch views
    document.getElementById('problem-list-view').style.display = 'none';
    document.getElementById('problem-detail-view').style.display = 'block';
  };

  function renderTestCasesPanel(problem) {
    const panel = document.getElementById('test-cases-list');
    if (!panel || !problem) return;
    const cases = (PROBLEM_TEST_CASES[problem.id] && PROBLEM_TEST_CASES[problem.id].sample) || [
      { input: problem.sampleInput || 'Sample input', expected: problem.sampleOutput || 'Sample output' }
    ];
    panel.innerHTML = cases.map((testCase, index) => `
      <div class="card" style="padding: var(--space-3); background: var(--bg-elevated);">
        <strong style="font-size: var(--text-sm); color: var(--text-primary);">Case ${index + 1}</strong>
        <div style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-2); white-space: pre-wrap;">Input: ${testCase.input}
Expected: ${testCase.expected}</div>
      </div>
    `).join('');
  }

  window.showProblemList = function() {
    document.getElementById('problem-detail-view').style.display = 'none';
    document.getElementById('problem-list-view').style.display = 'block';
    currentProblem = null;
  };

  window.toggleBookmarkProblem = function() {
    if (!currentProblem) return;
    
    const isBookmarked = Progress.toggleBookmark(currentProblem.id, 'coding');
    const btn = document.getElementById('detail-bookmark-btn');
    
    if (isBookmarked) {
      btn.textContent = '★';
      btn.style.color = 'var(--warning)';
      CCToast('Problem bookmarked!', 'success');
    } else {
      btn.textContent = '☆';
      btn.style.color = 'var(--text-secondary)';
      CCToast('Bookmark removed', 'info');
    }
    
    renderProblems();
  };

  window.resetCode = function() {
    setEditorCode(getStarterCode(currentProblem, currentLanguage));
    document.getElementById('output-console').textContent = 'Output will appear here...';
    document.getElementById('output-console').style.color = 'var(--text-secondary)';
    document.getElementById('test-results').textContent = '';
  };

  window.runCode = function() {
    if (!monacoEditor && !fallbackEditor) {
      CCToast('Editor not loaded yet. Please wait...', 'warning');
      return;
    }

    const code = getEditorCode();
    const output = document.getElementById('output-console');
    const testResults = document.getElementById('test-results');
    
    if (!code.trim()) {
      output.textContent = 'Error: No code provided';
      output.style.color = 'var(--danger)';
      return;
    }

    // Syntax validation
    const validation = validateSyntax(code, currentLanguage);
    if (!validation.valid) {
      output.textContent = `Compilation Error:\n\n${validation.error}`;
      output.style.color = 'var(--danger)';
      testResults.textContent = 'Failed';
      testResults.style.color = 'var(--danger)';
      return;
    }

    output.textContent = 'Compiling...\nRunning...\n\n';
    output.style.color = 'var(--text-secondary)';
    testResults.textContent = 'Running...';
    testResults.style.color = 'var(--warning)';

    // Simulate code execution with test cases
    setTimeout(() => {
      const testCases = PROBLEM_TEST_CASES[currentProblem?.id] || { sample: [{ input: 'Sample input', expected: 'Sample output' }] };
      const results = runTestCases(code, testCases.sample, currentLanguage);
      
      let outputText = `✓ Compilation successful\n\n`;
      let passed = 0;
      let total = results.length;
      
      results.forEach((result, index) => {
        if (result.passed) {
          outputText += `✓ Test case ${index + 1}: Passed\n`;
          passed++;
        } else {
          outputText += `✗ Test case ${index + 1}: Failed\n`;
          outputText += `  Input: ${result.input}\n`;
          outputText += `  Expected: ${result.expected}\n`;
          outputText += `  Got: ${result.got}\n`;
        }
      });
      
      outputText += `\nPassed: ${passed}/${total}`;
      output.textContent = outputText;
      output.style.color = passed === total ? 'var(--success)' : 'var(--warning)';
      
      testResults.textContent = `Passed: ${passed}/${total}`;
      testResults.style.color = passed === total ? 'var(--success)' : 'var(--warning)';
    }, 1500);
  };

  function validateSyntax(code, language) {
    const trimmed = code.trim();
    if (!trimmed) return { valid: false, error: 'Error: No code provided' };
    
    if (language === 'python') {
      const lines = code.replace(/\t/g, '    ').split('\n');
      const stack = [];
      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const indent = raw.match(/^ */)[0].length;
        if (indent % 4 !== 0) return { valid: false, error: `IndentationError: unexpected indent on line ${i + 1}` };
        if (/^(def|if|elif|else|for|while|try|except|finally|class)\b/.test(line) && !line.endsWith(':')) {
          return { valid: false, error: `SyntaxError: expected ":" on line ${i + 1}` };
        }
        if (stack.length && indent > stack[stack.length - 1] + 4) {
          return { valid: false, error: `IndentationError: unexpected indent on line ${i + 1}` };
        }
        stack.push(indent);
      }
      if (!balancedDelimiters(code)) return { valid: false, error: 'SyntaxError: unmatched brackets or parentheses' };
      if (/^\s*(hello|random|asdf|lorem|test)\s*$/i.test(trimmed)) return { valid: false, error: 'Compilation Error: code is not a valid Python solution' };
    }
    
    if (language === 'java') {
      if (!/\bclass\s+\w+/.test(code)) return { valid: false, error: 'Compilation Error: class keyword required' };
      if (!/public\s+static\s+void\s+main\s*\(\s*String(?:\[\]|\s+\[\])\s+\w+\s*\)/.test(code)) return { valid: false, error: 'Compilation Error: main method required' };
      if (!balancedDelimiters(code)) return { valid: false, error: 'Compilation Error: unmatched braces or parentheses' };
    }
    
    if (language === 'cpp' || language === 'c') {
      if (!/\b(?:int|void)\s+main\s*\(/.test(code)) return { valid: false, error: 'Compilation Error: main() required' };
      if (!balancedDelimiters(code)) return { valid: false, error: 'Compilation Error: unmatched braces or parentheses' };
    }
    
    if (language === 'javascript') {
      if (!balancedDelimiters(code)) return { valid: false, error: 'SyntaxError: unmatched braces or parentheses' };
      try {
        new Function(code);
      } catch (error) {
        return { valid: false, error: `SyntaxError: ${error.message}` };
      }
      if (/^\s*(hello|random|asdf|lorem|test)\s*;?\s*$/i.test(trimmed)) return { valid: false, error: 'Compilation Error: code is not a valid JavaScript solution' };
    }
    
    return { valid: true };
  }

  function balancedDelimiters(code) {
    const pairs = { '(': ')', '{': '}', '[': ']' };
    const closes = new Set(Object.values(pairs));
    const stack = [];
    let quote = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      const prev = code[i - 1];
      if (quote) {
        if (ch === quote && prev !== '\\') quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
        continue;
      }
      if (pairs[ch]) stack.push(pairs[ch]);
      else if (closes.has(ch) && stack.pop() !== ch) return false;
    }
    return stack.length === 0 && !quote;
  }

  function runTestCases(code, testCases, language) {
    const unsupported = language !== 'javascript';
    const judge = currentProblem && typeof PROBLEM_JUDGES !== 'undefined' ? PROBLEM_JUDGES[currentProblem.id] : null;
    return testCases.map((testCase, index) => {
      if (unsupported) {
        return {
          input: testCase.input,
          expected: testCase.expected,
          got: 'Execution simulation available for JavaScript only in this browser build',
          passed: false,
          status: 'Partially Accepted'
        };
      }
      if (!judge) {
        return {
          input: testCase.input,
          expected: testCase.expected,
          got: 'No judge configured for this problem yet',
          passed: false,
          status: 'Partially Accepted'
        };
      }
      try {
        const solutionFactory = new Function(`${code}; return typeof ${judge.funcName} === 'function' ? ${judge.funcName} : null;`);
        const solution = solutionFactory();
        if (!solution) {
          return { input: testCase.input, expected: testCase.expected, got: `${judge.funcName}() not found`, passed: false, status: 'Compilation Error' };
        }
        const args = Array.isArray(testCase.args) ? testCase.args : parseCaseArgs(testCase.input);
        const expectedValue = testCase.expectedValue !== undefined ? testCase.expectedValue : parseExpectedValue(testCase.expected);
        const actual = solution(...cloneArgs(args));
        const passed = valuesEqual(actual, expectedValue);
        return {
          input: testCase.input,
          expected: testCase.expected,
          got: formatValue(actual),
          passed,
          status: passed ? 'Accepted' : 'Wrong Answer'
        };
      } catch (error) {
        return { input: testCase.input, expected: testCase.expected, got: error.message, passed: false, status: 'Runtime Error' };
      }
    });
  }

  function parseCaseArgs(input) {
    if (!input) return [];
    const normalized = `[${input}]`;
    try { return JSON.parse(normalized); } catch {}
    return input.split(',').map(part => {
      const trimmed = part.trim();
      try { return JSON.parse(trimmed); } catch { return trimmed; }
    });
  }

  function parseExpectedValue(expected) {
    if (typeof expected !== 'string') return expected;
    try { return JSON.parse(expected); } catch {}
    if (/^-?\d+(\.\d+)?$/.test(expected)) return Number(expected);
    if (expected === 'true') return true;
    if (expected === 'false') return false;
    return expected;
  }

  function cloneArgs(args) {
    return args.map(arg => {
      try { return JSON.parse(JSON.stringify(arg)); } catch { return arg; }
    });
  }

  function valuesEqual(actual, expected) {
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  function formatValue(value) {
    if (typeof value === 'string') return value;
    if (value === undefined) return 'undefined';
    return JSON.stringify(value);
  }

  function getSubmissionStatus(passed, total, results) {
    if (/(while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\))/.test(getEditorCode())) return 'Time Limit Exceeded';
    if (passed === total) return 'Accepted';
    if (results.some(result => result.status === 'Runtime Error')) return 'Runtime Error';
    if (results.some(result => result.status === 'Compilation Error')) return 'Compilation Error';
    if (passed > 0) return 'Partially Accepted';
    if (total > 8 && getEditorCode().length > 4000) return 'Time Limit Exceeded';
    return 'Wrong Answer';
  }

  window.submitCode = function() {
    if (!monacoEditor && !fallbackEditor) {
      CCToast('Editor not loaded yet. Please wait...', 'warning');
      return;
    }

    const code = getEditorCode();
    const output = document.getElementById('output-console');
    const testResults = document.getElementById('test-results');
    
    if (!code.trim()) {
      output.textContent = 'Error: No code provided';
      output.style.color = 'var(--danger)';
      return;
    }

    // Syntax validation
    const validation = validateSyntax(code, currentLanguage);
    if (!validation.valid) {
      output.textContent = `Submission Failed:\n\n${validation.error}\n\nPlease fix the syntax errors before submitting.`;
      output.style.color = 'var(--danger)';
      testResults.textContent = 'Failed';
      testResults.style.color = 'var(--danger)';
      CCToast('Syntax error detected', 'error');
      return;
    }

    // Check if required function/class exists
    const config = LANGUAGE_CONFIG[currentLanguage];
    if (config.functionPattern && !config.functionPattern.test(code)) {
      output.textContent = `Submission Failed:\n\nError: No function found. Please define a function to solve the problem.`;
      output.style.color = 'var(--danger)';
      testResults.textContent = 'Failed';
      testResults.style.color = 'var(--danger)';
      CCToast('Function not found', 'error');
      return;
    }

    output.textContent = 'Validating...\nRunning all test cases...\n\n';
    output.style.color = 'var(--text-secondary)';
    testResults.textContent = 'Validating...';
    testResults.style.color = 'var(--warning)';

    // Simulate submission with all test cases (sample + hidden)
    setTimeout(() => {
      const allTestCases = PROBLEM_TEST_CASES[currentProblem?.id] || { 
        sample: [{ input: 'Sample input', expected: 'Sample output' }],
        hidden: []
      };
      const allTests = [...allTestCases.sample, ...(allTestCases.hidden || [])];
      const results = runTestCases(code, allTests, currentLanguage);
      
      let outputText = `Running ${allTests.length} test cases...\n\n`;
      let passed = 0;
      let total = results.length;
      
      results.forEach((result, index) => {
        if (result.passed) {
          passed++;
        }
      });
      const status = getSubmissionStatus(passed, total, results);
      
      if (status === 'Accepted') {
        outputText += `Accepted\nPassed ${passed}/${total} Test Cases\n\n`;
        outputText += `✓ All test cases passed!\n✓ Solution accepted!\n\n+15 XP earned!`;
        output.textContent = outputText;
        output.style.color = 'var(--success)';
        testResults.textContent = `Passed: ${passed}/${total}`;
        testResults.style.color = 'var(--success)';
        
        // Mark as complete
        if (currentProblem) {
          Progress.markComplete(currentProblem.id, 'coding');
          UserProfile.updateStreak();
          updateStats();
          CCToast('Problem solved! +15 XP', 'success');
        }
      } else {
        outputText += `${status}\nPassed ${passed}/${total} Test Cases\n\n`;
        outputText += `✗ ${total - passed} test case(s) failed\n\n`;
        outputText += `Passed: ${passed}/${total}\n`;
        outputText += `Failed: ${total - passed}/${total}\n\n`;
        outputText += `Please review your code and try again.`;
        output.textContent = outputText;
        output.style.color = 'var(--danger)';
        testResults.textContent = `Passed: ${passed}/${total}`;
        testResults.style.color = 'var(--danger)';
        CCToast(`${total - passed} test case(s) failed`, 'error');
      }
    }, 2000);
  };

  window.CodingPage = {
    refresh: initCodingPage
  };
})();
