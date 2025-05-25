export const questions = [
    {
        questionId: 1,
        title: 'Two Sum',
        shortDescription: 'Find two numbers that add up to target',
        detailedDescription:
            'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input will have exactly one solution, and the same element may not be used twice.',
        difficulty: 'easy',
        leetcodeLink: 'https://leetcode.com/problems/two-sum/',
        solved: true,
        tags: ['Array', 'Hash Table'],
        supportedLangugages: [
            'python',
            'javascript',
            'java',
            'c++',
            'c#',
            'go',
        ],
        editorial: {
            reference: 'https://leetcode.com/problems/two-sum/editorial/',
            description:
                'Use a hash map to store value-to-index mappings and check for complement at each step.',
            images: [
                'https://assets.leetcode.com/uploads/2020/11/04/two_sum.jpg',
            ],
        },
        testCases: [
            { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
            { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
        ],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        frequency: '80%',
        acceptanceRate: 45.5,
        notes: 'Classic hash map problem',
    },
    {
        questionId: 2,
        title: 'Longest Substring Without Repeating Characters',
        shortDescription:
            'Find length of the longest substring without repeating characters',
        detailedDescription:
            'Given a string s, find the length of the longest substring without repeating characters using the sliding window technique.',
        difficulty: 'medium',
        leetcodeLink:
            'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        solved: false,
        tags: ['String', 'Sliding Window', 'Hash Table'],
        supportedLangugages: [
            'python',
            'javascript',
            'java',
            'c++',
            'c#',
            'go',
        ],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-substring-without-repeating-characters/editorial/',
            description:
                'Use a sliding window with a set to track characters. Update max length on each iteration.',
            images: [
                'https://assets.leetcode.com/uploads/2018/12/14/longest3optimized.png',
            ],
        },
        testCases: [
            { input: 's = "abcabcbb"', output: '3' },
            { input: 's = "bbbbb"', output: '1' },
        ],
        companies: ['Amazon', 'Facebook', 'Google'],
        frequency: '75%',
        acceptanceRate: 35.0,
        notes: 'Sliding window edge cases are tricky',
    },
    {
        questionId: 3,
        title: 'Valid Parentheses',
        shortDescription: 'Check if parentheses are valid using stack',
        detailedDescription:
            'Given a string s containing just the characters (), {}, and [], determine if the input string is valid. An input string is valid if: Open brackets are closed by the same type of brackets, and Open brackets are closed in the correct order.',
        difficulty: 'easy',
        leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/',
        solved: true,
        tags: ['Stack', 'String'],
        supportedLangugages: [
            'python',
            'javascript',
            'java',
            'c++',
            'c#',
            'go',
        ],
        editorial: {
            reference:
                'https://leetcode.com/problems/valid-parentheses/editorial/',
            description:
                'Use a stack to push opening brackets and match them with closing ones.',
            images: [
                'https://assets.leetcode.com/uploads/2021/03/27/validparentheses.png',
            ],
        },
        testCases: [
            { input: 's = "()"', output: 'true' },
            { input: 's = "(]"', output: 'false' },
        ],
        companies: ['Amazon', 'Adobe', 'Bloomberg'],
        frequency: '70%',
        acceptanceRate: 42.1,
        notes: 'Be careful with unmatched opening brackets',
    },
    {
        questionId: 4,
        title: 'Merge Two Sorted Lists',
        shortDescription: 'Merge two sorted linked lists into one',
        detailedDescription:
            'You are given the heads of two sorted linked lists. Merge the two lists in a sorted manner and return the head of the merged list.',
        difficulty: 'easy',
        leetcodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        solved: false,
        tags: ['Linked List', 'Recursion'],
        supportedLangugages: [
            'python',
            'javascript',
            'java',
            'c++',
            'c#',
            'go',
        ],
        editorial: {
            reference:
                'https://leetcode.com/problems/merge-two-sorted-lists/editorial/',
            description:
                'Use recursion or iterative pointers to merge nodes one by one.',
            images: [
                'https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg',
            ],
        },
        testCases: [
            { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
            { input: 'l1 = [], l2 = [0]', output: '[0]' },
        ],
        companies: ['Google', 'Microsoft', 'Apple'],
        frequency: '65%',
        acceptanceRate: 60.2,
        notes: 'Great intro to linked list merging',
    },
    {
        questionId: 5,
        title: 'Binary Tree Level Order Traversal',
        shortDescription: 'Return level order traversal of binary tree',
        detailedDescription:
            'Given the root of a binary tree, return the level order traversal of its nodes’ values (i.e., from left to right, level by level).',
        difficulty: 'medium',
        leetcodeLink:
            'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        solved: false,
        tags: ['Tree', 'Breadth-First Search', 'Queue'],
        supportedLangugages: [
            'python',
            'javascript',
            'java',
            'c++',
            'c#',
            'go',
        ],
        editorial: {
            reference:
                'https://leetcode.com/problems/binary-tree-level-order-traversal/editorial/',
            description:
                'Use a queue and traverse each level while keeping track of nodes per level.',
            images: [
                'https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg',
            ],
        },
        testCases: [
            {
                input: 'root = [3,9,20,null,null,15,7]',
                output: '[[3],[9,20],[15,7]]',
            },
            { input: 'root = [1]', output: '[[1]]' },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '60%',
        acceptanceRate: 54.4,
        notes: 'Classic BFS problem on trees',
    },
];
