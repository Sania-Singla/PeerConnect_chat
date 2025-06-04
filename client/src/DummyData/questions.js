const arrayQuestions = [
    {
        questionId: 'qa001',
        title: 'Two Sum',
        shortDescription: 'Find two numbers that add up to a target value.',
        detailedDescription: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to the target. Each input will have exactly one solution, and you may not use the same element twice.`,
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists',
        ],
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/two-sum/',
        },
        solved: true,
        tags: ['Array', 'Hash Table'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++', 'c#', 'go'],
        editorial: {
            reference: 'https://leetcode.com/problems/two-sum/solution/',
            description: `The "Two Sum" problem is a classic algorithmic challenge that tests your ability to efficiently search for pairs within an array.`,
            videos: [
                {
                    title: 'Two Sum - Leetcode 1 - HashMap - Python',
                    url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
                    description:
                        'A comprehensive walkthrough using Python and hash maps.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
            { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
        ],
        discussions: [
            {
                id: 1,
                user: 'coder123',
                content:
                    'Has anyone tried solving this with a sliding window approach?',
                timestamp: '3 hours ago',
                replies: 5,
            },
            {
                id: 2,
                user: 'algo_expert',
                content:
                    'The hash map solution is optimal for this problem. O(n) time and space complexity.',
                timestamp: '1 day ago',
                replies: 12,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '45 ms',
                memory: '14.2 MB',
                status: 'Accepted',
                timestamp: '2 hours ago',
            },
            {
                id: 2,
                language: 'JavaScript',
                runtime: '68 ms',
                memory: '15.1 MB',
                status: 'Accepted',
                timestamp: '1 day ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i`,
                explanation:
                    'Utilizes a hash map to achieve O(n) time complexity.',
            },
            {
                id:2,
                language: 'JavaScript',
                code: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n}`,
                explanation: 'Employs ES6 Map for efficient lookups.',
            },
        ],
        companies: [
            'Google',
            'Amazon',
            'Microsoft',
            'Apple',
            'Meta',
            'Netflix',
            'Adobe',
            'Uber',
            'Airbnb',
            'Tesla',
        ],
        frequency: '80%',
        acceptanceRate: 45.5,
        notes: 'A classic problem to test understanding of hash tables.',
    },
    {
        questionId: 'qa002',
        title: 'Maximum Subarray Sum',
        shortDescription: 'Find the contiguous subarray with the largest sum.',
        detailedDescription: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.`,
        constraints: [
            '1 <= nums.length <= 10^5',
            '-10^4 <= nums[i] <= 10^4',
            'Must solve in O(n) time',
            'Subarray must be contiguous',
        ],
        difficulty: 'medium',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/challenges/maxsubarray/problem',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Kadane’s Algorithm', 'Array'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/',
            description: `Kadane's Algorithm is a classic technique used to find the maximum sum subarray in linear time.`,
            videos: [
                {
                    title: "Kadane's Algorithm | Maximum Subarray Sum",
                    url: 'https://www.youtube.com/watch?v=AHZpyENo7k4',
                    description: "Detailed explanation of Kadane's Algorithm.",
                },
            ],
        },
        testCases: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
            { input: 'nums = [1]', output: '1' },
        ],
        discussions: [
            {
                id: 1,
                user: 'dp_wizard',
                content:
                    'Kadane is magical. Anyone tried extending this to find actual subarray indices?',
                timestamp: '6 hours ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '1.2 sec',
                memory: '39 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def maxSubArray(nums):\n    max_sum = current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum`,
                explanation:
                    'Implements Kadane’s Algorithm for efficient computation.',
            },
        ],
        companies: ['Amazon', 'Facebook', 'Adobe'],
        frequency: '73%',
        acceptanceRate: 51.3,
        notes: 'A fundamental problem for understanding dynamic programming.',
    },
    {
        questionId: 'qa003',
        title: 'Majority Element',
        shortDescription:
            'Find the element that appears more than half the time in the array.',
        detailedDescription: `Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the array is non-empty and the majority element always exists.`,
        constraints: [
            'n == nums.length',
            '1 <= n <= 5 * 10^4',
            '-10^9 <= nums[i] <= 10^9',
            'Majority element always exists',
        ],
        difficulty: 'easy',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/majority-element-1587115620/1',
        },
        solved: true,
        tags: ['Array', 'Hashing', 'Boyer-Moore'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++', 'c#'],
        editorial: {
            reference:
                'https://leetcode.com/problems/majority-element/solution/',
            description: `The Boyer-Moore Voting Algorithm efficiently finds the majority element in one pass.`,
            videos: [
                {
                    title: 'Majority Element | Boyer-Moore Voting Algorithm',
                    url: 'https://www.youtube.com/watch?v=7pnhv842keE',
                    description: 'Detailed explanation of the algorithm.',
                },
            ],
        },
        testCases: [
            { input: '[3,2,3]', output: '3' },
            { input: '[2,2,1,1,1,2,2]', output: '2' },
        ],
        discussions: [
            {
                id: 1,
                user: 'algoFan',
                content: 'Boyer-Moore is so elegant for this problem!',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '64 ms',
                memory: '37 MB',
                status: 'Accepted',
                timestamp: '5 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def majorityElement(nums):\n    count = 0\n    candidate = None\n    for num in nums:\n        if count == 0:\n            candidate = num\n        count += (1 if num == candidate else -1)\n    return candidate`,
                explanation:
                    'Implements Boyer-Moore Voting Algorithm for O(n) time and O(1) space.',
            },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '75%',
        acceptanceRate: 55.6,
        notes: 'Key problem for understanding optimal frequency counting.',
    },
    {
        questionId: 'qa004',
        title: 'Merge Intervals',
        shortDescription: 'Merge all overlapping intervals.',
        detailedDescription: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        constraints: [
            '1 <= intervals.length <= 10^4',
            'intervals[i].length == 2',
            '0 <= start_i <= end_i <= 10^4',
            'Must solve in O(n log n) time',
        ],
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/merge-intervals/',
        },
        solved: false,
        tags: ['Array', 'Sorting', 'Intervals'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/merge-intervals/solution/',
            description: `Sort the intervals and then merge overlapping ones in a single pass.`,
            videos: [
                {
                    title: 'Merge Intervals - Leetcode 56',
                    url: 'https://www.youtube.com/watch?v=44H3cEC2fFM',
                    description: 'Detailed explanation of interval merging.',
                },
            ],
        },
        testCases: [
            {
                input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
                output: '[[1,6],[8,10],[15,18]]',
            },
            { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
        ],
        discussions: [
            {
                id: 1,
                user: 'intervalFan',
                content:
                    'What about intervals with same start but different end?',
                timestamp: '2 days ago',
                replies: 7,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '60 ms',
                memory: '16 MB',
                status: 'Accepted',
                timestamp: '1 day ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged`,
                explanation:
                    'Sorts and merges intervals efficiently in one pass.',
            },
        ],
        companies: ['Google', 'Microsoft', 'Uber'],
        frequency: '70%',
        acceptanceRate: 44.0,
        notes: 'A critical problem for understanding interval merging.',
    },
    {
        questionId: 'qa005',
        title: 'Product of Array Except Self',
        shortDescription:
            'Return an array output where output[i] is the product of all elements except nums[i].',
        detailedDescription: `Given an array nums of n integers where n > 1, return an array output such that output[i] is equal to the product of all the elements of nums except nums[i].`,
        constraints: [
            '2 <= nums.length <= 10^5',
            '-30 <= nums[i] <= 30',
            'Must solve without division',
            'Must solve in O(n) time',
            'Space complexity must be O(1) (excluding output array)',
        ],
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/product-of-array-except-self/',
        },
        solved: false,
        tags: ['Array', 'Prefix Sum', 'Math'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/product-of-array-except-self/solution/',
            description: `Uses prefix and suffix product arrays to calculate the result without division.`,
            videos: [
                {
                    title: 'Product of Array Except Self - Leetcode 238',
                    url: 'https://www.youtube.com/watch?v=bNvIQI2wAjk',
                    description:
                        'Stepwise explanation of prefix/suffix approach.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
            { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
        ],
        discussions: [
            {
                id: 1,
                user: 'spaceSaver',
                content: 'Why is negation trick safe in this problem?',
                timestamp: '1 day ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '35 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '8 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def findDuplicates(nums):\n    res = []\n    for num in nums:\n        if nums[abs(num) - 1] < 0:\n            res.append(abs(num))\n        else:\n            nums[abs(num) - 1] *= -1\n    return res`,
                explanation:
                    'Uses negation of elements as visited markers to find duplicates.',
            },
        ],
        companies: ['Apple', 'Amazon', 'Google'],
        frequency: '68%',
        acceptanceRate: 50.2,
        notes: 'Crucial for understanding prefix/suffix patterns.',
    },
    {
        questionId: 'qa006',
        title: 'Find All Duplicates in an Array',
        shortDescription: 'Find all elements that appear twice in an array.',
        detailedDescription: `Given an array of integers where 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once. Find all elements that appear twice in this array without extra space and in O(n) time.

Constraints:
- Use constant extra space.
- Modify the input array if necessary.
- The solution should be efficient for large input sizes.

This problem helps improve your understanding of array indexing, in-place algorithms, and clever use of constraints.

Commonly used in detecting duplicate data and memory optimization scenarios.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
        },
        solved: false,
        tags: ['Array', 'In-place', 'Indexing'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/find-all-duplicates-in-an-array/solution/',
            description: `Mark visited positions by negating values at indices to track duplicates without extra space.`,
            videos: [
                {
                    title: 'Find All Duplicates in an Array - Leetcode 442 - In-place Marking',
                    url: 'https://www.youtube.com/watch?v=H9bfqozjoqs',
                    description:
                        'In-depth explanation of in-place duplicate detection.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [4,3,2,7,8,2,3,1]', output: '[2,3]' },
            { input: 'nums = [1,1,2]', output: '[1]' },
        ],
        discussions: [
            {
                id: 1,
                user: 'spaceSaver',
                content: 'Why is negation trick safe in this problem?',
                timestamp: '1 day ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '35 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '8 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def findDuplicates(nums):\n    res = []\n    for num in nums:\n        if nums[abs(num) - 1] < 0:\n            res.append(abs(num))\n        else:\n            nums[abs(num) - 1] *= -1\n    return res`,
                explanation:
                    'Uses negation of elements as visited markers to find duplicates.',
            },
        ],
        companies: ['Microsoft', 'Google', 'Facebook'],
        frequency: '65%',
        acceptanceRate: 55.1,
        notes: 'Great for learning in-place algorithms and array manipulations.',
    },
    {
        questionId: 'qa007',
        title: 'Longest Consecutive Sequence',
        shortDescription:
            'Find the length of the longest consecutive elements sequence.',
        detailedDescription: `Given an unsorted array of integers, find the length of the longest consecutive elements sequence.

Constraints:
- The algorithm should run in O(n) time.
- Use O(n) extra space is allowed.
- Elements can be negative, zero, or positive.
- No sorting allowed to maintain time complexity.

This problem strengthens your skills in hashing, set operations, and efficient sequence detection.

Commonly used in problems requiring detection of continuous sequences within unordered data.`,
        difficulty: 'hard',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/longest-consecutive-subsequence2449/1',
        },
        solved: false,
        tags: ['Array', 'HashSet', 'Sequence'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-consecutive-sequence/solution/',
            description: `Use a hash set to store all elements. For each element, check if it is the start of a sequence (no smaller consecutive number). Then count the length of that sequence.`,
            videos: [
                {
                    title: 'Longest Consecutive Sequence - Leetcode 128 - HashSet Approach',
                    url: 'https://www.youtube.com/watch?v=P6RZZMu_maU',
                    description:
                        'Detailed explanation of the hash set approach.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [100,4,200,1,3,2]', output: '4' },
            { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
        ],
        discussions: [
            {
                id: 1,
                user: 'sequenceSeeker',
                content: 'Why is sorting not allowed for O(n) solution?',
                timestamp: '4 days ago',
                replies: 10,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'C++',
                runtime: '80 ms',
                memory: '25 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def longestConsecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            length = 1\n            while num + length in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest`,
                explanation:
                    'Detects starts of sequences and counts consecutive numbers efficiently.',
            },
        ],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: '58%',
        acceptanceRate: 44.3,
        notes: 'Crucial for understanding hashing and sequence detection in arrays.',
    },
    {
        questionId: 'qa008',
        title: 'Minimum Size Subarray Sum',
        shortDescription:
            'Find the minimal length of a contiguous subarray of which the sum ≥ target.',
        detailedDescription: `Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray [numsl, numsl+1, ..., numsr-1, numsr] of which the sum is at least target. If there is no such subarray, return 0 instead.

Constraints:
- Array contains positive integers only.
- Aim for an O(n) time complexity solution.
- Use sliding window technique to solve efficiently.

This problem emphasizes the sliding window approach for optimized array traversal.

Typical in scenarios involving threshold detection and continuous sum problems.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        },
        solved: false,
        tags: ['Array', 'Sliding Window', 'Two Pointers'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/minimum-size-subarray-sum/solution/',
            description: `Use two pointers to maintain a sliding window and shrink it while sum is ≥ target.`,
            videos: [
                {
                    title: 'Minimum Size Subarray Sum - Leetcode 209 - Sliding Window',
                    url: 'https://www.youtube.com/watch?v=MK-NZ4hN7rs',
                    description:
                        'Explains sliding window technique step by step.',
                },
            ],
        },
        testCases: [
            { input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2' },
            { input: 'target = 4, nums = [1,4,4]', output: '1' },
        ],
        discussions: [
            {
                id: 1,
                user: 'windowWatcher',
                content:
                    'How to optimize the sliding window when sum exceeds target?',
                timestamp: '6 days ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '60 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '9 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def minSubArrayLen(target, nums):\n    left = 0\n    total = 0\n    min_length = float('inf')\n    for right in range(len(nums)):\n        total += nums[right]\n        while total >= target:\n            min_length = min(min_length, right - left + 1)\n            total -= nums[left]\n            left += 1\n    return 0 if min_length == float('inf') else min_length`,
                explanation:
                    'Sliding window expands right and shrinks left to find minimal subarray length.',
            },
        ],
        companies: ['Microsoft', 'Amazon', 'Google'],
        frequency: '60%',
        acceptanceRate: 42.7,
        notes: 'Mastering sliding window technique is key for efficient array problems.',
    },
    {
        questionId: 'qa009',
        title: 'Find All Numbers Disappeared in an Array',
        shortDescription:
            'Find all elements of [1, n] inclusive that do not appear in the array.',
        detailedDescription: `Given an array of integers where 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once. Find all the elements of [1, n] inclusive that do not appear in this array.

Constraints:
- Solve in O(n) time complexity.
- Use O(1) extra space (excluding the output array).
- Modifying the input array is allowed.

This problem tests your ability to use indexing and marking techniques to track presence efficiently without extra memory.

Commonly used in problems involving missing elements detection within a known range.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
        },
        solved: false,
        tags: ['Array', 'Indexing', 'In-Place Modification'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/solution/',
            description: `Iterate through the array and mark elements as negative at the index corresponding to each value to indicate presence.`,
            videos: [
                {
                    title: 'Find All Numbers Disappeared in an Array - Leetcode 448',
                    url: 'https://www.youtube.com/watch?v=3p8bzGa4KSE',
                    description:
                        'In-place marking approach to find missing numbers.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [4,3,2,7,8,2,3,1]', output: '[5,6]' },
            { input: 'nums = [1,1]', output: '[2]' },
        ],
        discussions: [
            {
                id: 1,
                user: 'indexMaster',
                content: 'How does marking negative help track presence?',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '50 ms',
                memory: '39 MB',
                status: 'Accepted',
                timestamp: '5 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def findDisappearedNumbers(nums):\n    for num in nums:\n        index = abs(num) - 1\n        if nums[index] > 0:\n            nums[index] = -nums[index]\n    return [i + 1 for i in range(len(nums)) if nums[i] > 0]`,
                explanation:
                    'Marks indices negative to denote presence; positive indices correspond to missing numbers.',
            },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '55%',
        acceptanceRate: 60.1,
        notes: 'In-place marking is a clever way to solve missing elements without extra space.',
    },
    {
        questionId: 'q010',
        title: 'Maximum Product Subarray',
        shortDescription:
            'Find the contiguous subarray with the maximum product.',
        detailedDescription: `Given an integer array nums, find the contiguous subarray within an array (containing at least one number) which has the largest product.

Constraints:
- The array can contain positive, negative, and zero elements.
- The solution must run in O(n) time.
- Handle the effect of negative numbers flipping max and min products.

This problem challenges you to think about dynamic programming and maintaining two variables (max and min product so far).

Often encountered in optimization problems involving contiguous segments.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/maximum-product-subarray/',
        },
        solved: false,
        tags: ['Array', 'Dynamic Programming', "Kadane's Algorithm"],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/maximum-product-subarray/solution/',
            description: `Track both max and min products up to current index to handle negative numbers.`,
            videos: [
                {
                    title: 'Maximum Product Subarray - Leetcode 152 - DP Approach',
                    url: 'https://www.youtube.com/watch?v=vtJvbRlHq3I',
                    description:
                        'Dynamic programming solution keeping track of max/min products.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [2,3,-2,4]', output: '6' },
            { input: 'nums = [-2,0,-1]', output: '0' },
        ],
        discussions: [
            {
                id: 1,
                user: 'dpPro',
                content: 'Why do we track minimum product along with maximum?',
                timestamp: '7 days ago',
                replies: 8,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '68 ms',
                memory: '14 MB',
                status: 'Accepted',
                timestamp: '11 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def maxProduct(nums):\n    max_so_far = min_so_far = result = nums[0]\n    for num in nums[1:]:\n        if num < 0:\n            max_so_far, min_so_far = min_so_far, max_so_far\n        max_so_far = max(num, max_so_far * num)\n        min_so_far = min(num, min_so_far * num)\n        result = max(result, max_so_far)\n    return result`,
                explanation:
                    'Swaps max and min when a negative number appears to track potential max product.',
            },
        ],
        companies: ['Microsoft', 'Apple', 'Amazon'],
        frequency: '62%',
        acceptanceRate: 38.9,
        notes: 'Essential for mastering dynamic programming on arrays, especially with negative values.',
    },
];

const stringQuestions = [
    {
        questionId: 'qs001',
        title: 'Longest Substring Without Repeating Characters',
        shortDescription:
            'Find the length of the longest substring without repeating characters.',
        detailedDescription:
            'Given a string `s`, find the length of the longest substring without repeating characters.\n\nThis problem emphasizes the sliding window technique and efficient use of hash maps to track characters. The solution requires optimizing for linear time complexity while handling all possible character cases.',
        constraints: [
            '0 <= s.length <= 5 * 10^4',
            '`s` consists of English letters, digits, symbols, and spaces.',
        ],
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        },
        solved: false,
        tags: ['HashMap', 'Sliding Window', 'String'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/',
            description:
                'Uses a sliding window with a hash map to track the last index of characters.',
            videos: [
                {
                    title: 'Longest Substring Without Repeating Characters - Leetcode 3 - Sliding Window - Python',
                    url: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
                    description:
                        'Visual explanation of sliding window for substring problem.',
                },
            ],
        },
        testCases: [
            { input: 's = "abcabcbb"', output: '3' },
            { input: 's = "bbbbb"', output: '1' },
            { input: 's = "pwwkew"', output: '3' },
        ],
        discussions: [
            {
                id: 1,
                user: 'windowWizard',
                content: 'Can we solve this without extra space?',
                timestamp: '1 day ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '55 ms',
                memory: '14.7 MB',
                status: 'Accepted',
                timestamp: '20 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def lengthOfLongestSubstring(s):\n    char_index = {}\n    left = 0\n    max_length = 0\n    for right, char in enumerate(s):\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1\n        char_index[char] = right\n        max_length = max(max_length, right - left + 1)\n    return max_length',
                explanation:
                    'Tracks last seen indices and adjusts window boundaries to avoid duplicates.',
            },
        ],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: '80%',
        acceptanceRate: 33.5,
        notes: 'Excellent for mastering sliding window technique and string handling.',
    },
    {
        questionId: 'qs002',
        title: 'Valid Parentheses',
        shortDescription: 'Check if a string of parentheses is valid.',
        detailedDescription:
            "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nA string is valid if:\n- Open brackets are closed by the same type of brackets.\n- Open brackets are closed in the correct order.\n\nThis problem tests stack usage and understanding of matching pairs in strings.",
        constraints: [
            '1 <= s.length <= 10^4',
            "`s` consists of parentheses only: '()[]{}'.",
        ],
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/valid-parentheses/',
        },
        solved: false,
        tags: ['Stack', 'String'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/valid-parentheses/solution/',
            description:
                'Utilizes a stack data structure to push opening brackets and match them with closing brackets.',
            videos: [
                {
                    title: 'Valid Parentheses - Leetcode 20 - Stack - Python',
                    url: 'https://www.youtube.com/watch?v=WTzjTskDFMg',
                    description:
                        'Step-by-step stack-based solution for valid parentheses problem.',
                },
            ],
        },
        testCases: [
            { input: 's = "()"', output: 'true' },
            { input: 's = "()[]{}"', output: 'true' },
            { input: 's = "(]"', output: 'false' },
        ],
        discussions: [
            {
                id: 1,
                user: 'stackMaster',
                content: 'Can this be done without a stack?',
                timestamp: '5 hours ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '40 ms',
                memory: '14.5 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else \'#\'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack',
                explanation:
                    'Stack tracks opening brackets and matches with closing brackets.',
            },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '75%',
        acceptanceRate: 38.2,
        notes: 'Key problem to master stack operations and string parsing.',
    },
    {
        questionId: 'qs003',
        title: 'Valid Anagram',
        shortDescription: 'Check if two strings are anagrams of each other.',
        detailedDescription:
            'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. The solution should efficiently compare character frequencies.',
        constraints: [
            '1 <= s.length, t.length <= 5 * 10^4',
            '`s` and `t` consist of lowercase English letters.',
        ],
        difficulty: 'easy',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/anagram-1587115620/1',
        },
        solved: false,
        tags: ['String', 'Hash Table', 'Sorting'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/valid-anagram/solution/',
            description:
                'Two primary solutions: using a hashmap to count character frequencies or sorting both strings.',
            videos: [
                {
                    title: 'Valid Anagram - Leetcode 242 - Simple Explanation',
                    url: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
                    description:
                        'Comparison using both hashmap and sorting methods.',
                },
            ],
        },
        testCases: [
            { input: 's = "anagram", t = "nagaram"', output: 'true' },
            { input: 's = "rat", t = "car"', output: 'false' },
        ],
        discussions: [
            {
                id: 1,
                user: 'stringCoder',
                content:
                    "What's the best time-efficient method for longer strings?",
                timestamp: '5 days ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '64 ms',
                memory: '40 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import Counter\n\ndef isAnagram(s, t):\n    return Counter(s) == Counter(t)',
                explanation:
                    "Uses Python's Counter class to count character frequencies and compare.",
            },
        ],
        companies: ['Facebook', 'Amazon', 'Google'],
        frequency: '64%',
        acceptanceRate: 52.3,
        notes: 'Practice with hash maps and frequency patterns is vital here.',
    },
    {
        questionId: 'qs004',
        title: 'Longest Substring Without Repeating Characters',
        shortDescription:
            'Find the length of the longest substring without repeating characters.',
        detailedDescription:
            'Given a string `s`, find the length of the longest substring without repeating characters.\n\nThis problem requires an efficient O(n) time solution using the sliding window technique. The challenge lies in managing dynamic window boundaries while tracking character occurrences.',
        constraints: [
            '0 <= s.length <= 5 * 10^4',
            '`s` consists of printable ASCII characters.',
        ],
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        },
        solved: false,
        tags: ['String', 'Sliding Window', 'Hash Table'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/',
            description:
                'Uses a sliding window with a hash map to track characters and window bounds.',
            videos: [
                {
                    title: 'Longest Substring Without Repeating Characters - Leetcode 3',
                    url: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
                    description:
                        'Explains sliding window with dry run examples.',
                },
            ],
        },
        testCases: [
            { input: 's = "abcabcbb"', output: '3' },
            { input: 's = "bbbbb"', output: '1' },
            { input: 's = "pwwkew"', output: '3' },
        ],
        discussions: [
            {
                id: 2,
                user: 'windowWalker',
                content: 'Why do we need a hash map and not just two pointers?',
                timestamp: '1 week ago',
                replies: 7,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '70 ms',
                memory: '14.2 MB',
                status: 'Accepted',
                timestamp: '8 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def lengthOfLongestSubstring(s):\n    char_index = {}\n    left = max_len = 0\n    for right in range(len(s)):\n        if s[right] in char_index and char_index[s[right]] >= left:\n            left = char_index[s[right]] + 1\n        char_index[s[right]] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
                explanation:
                    'Keeps track of last seen index to avoid repeating characters in the window.',
            },
        ],
        companies: ['Amazon', 'Google', 'Microsoft'],
        frequency: '71%',
        acceptanceRate: 35.9,
        notes: 'A must-practice for sliding window mastery on strings.',
    },
    {
        questionId: 'qs005',
        title: 'Longest Palindromic Substring',
        shortDescription:
            'Find the longest palindromic substring in a given string.',
        detailedDescription:
            'Given a string `s`, return the longest palindromic substring in `s`.\n\nA palindrome reads the same forward and backward. The solution requires efficient handling of both odd and even length palindromes through center expansion or dynamic programming.',
        constraints: [
            '1 <= s.length <= 1000',
            '`s` consists of only digits and English letters.',
        ],
        difficulty: 'medium',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/contests/security-challenge/challenges/largest-palindromic-substring/',
        },
        solved: false,
        tags: ['String', 'Dynamic Programming', 'Two Pointers'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-palindromic-substring/solution/',
            description:
                'Explains both expand-around-center and DP approaches with complexity trade-offs.',
            videos: [
                {
                    title: 'Longest Palindromic Substring - Expand Around Center - Leetcode 5',
                    url: 'https://www.youtube.com/watch?v=XYQecbcd6_c',
                    description:
                        'Covers both expand and DP approaches with visualization.',
                },
            ],
        },
        testCases: [
            { input: 's = "babad"', output: '"bab"' },
            { input: 's = "cbbd"', output: '"bb"' },
            { input: 's = "a"', output: '"a"' },
        ],
        discussions: [
            {
                id: 3,
                user: 'palindromeMaster',
                content:
                    'Is expand-around-center always better than DP for this?',
                timestamp: '2 days ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '92 ms',
                memory: '13.6 MB',
                status: 'Accepted',
                timestamp: '6 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: "def longestPalindrome(s):\n    res = ''\n    for i in range(len(s)):\n        tmp = expand(s, i, i)\n        if len(tmp) > len(res): res = tmp\n        tmp = expand(s, i, i+1)\n        if len(tmp) > len(res): res = tmp\n    return res\n\ndef expand(s, l, r):\n    while l >= 0 and r < len(s) and s[l] == s[r]:\n        l -= 1\n        r += 1\n    return s[l+1:r]",
                explanation:
                    'Expands around every center and checks odd/even length palindromes.',
            },
        ],
        companies: ['Amazon', 'Adobe', 'Uber'],
        frequency: '66%',
        acceptanceRate: 31.4,
        notes: 'Crucial to understand both expand-around-center and dynamic programming techniques.',
    },
    {
        questionId: 'qs006',
        title: 'Group Anagrams',
        shortDescription:
            'Group strings that are anagrams of each other into lists.',
        detailedDescription: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

Two strings are anagrams if they contain the same characters in any order.

Constraints:
- All inputs are lowercase.
- Aim for O(n * k log k) where k is average string length.

This problem builds on frequency analysis and hash maps, and is foundational for categorizing strings using signatures (e.g., sorted or character frequency vectors).`,
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/print-anagrams-together/1',
        },
        solved: false,
        tags: ['String', 'Hash Table', 'Sorting'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/group-anagrams/solution/',
            description:
                'Shows sorted string and counting hash approaches to form group signatures.',
            videos: [
                {
                    title: 'Group Anagrams - Leetcode 49 - Hashmap & Sorting',
                    url: 'https://www.youtube.com/watch?v=vzdNOK2oB2E',
                    description:
                        'Elegant breakdown of how to group anagrams using sorting or hashing.',
                },
            ],
        },
        testCases: [
            {
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
            },
            { input: 'strs = [""]', output: '[[""]]' },
            { input: 'strs = ["a"]', output: '[["a"]]' },
        ],
        discussions: [
            {
                id: 4,
                user: 'groupie',
                content:
                    'Is there a faster way than sorting the strings for each comparison?',
                timestamp: '4 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '89 ms',
                memory: '47.3 MB',
                status: 'Accepted',
                timestamp: '9 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `from collections import defaultdict\n\ndef groupAnagrams(strs):\n    anagrams = defaultdict(list)\n    for word in strs:\n        key = ''.join(sorted(word))\n        anagrams[key].append(word)\n    return list(anagrams.values())`,
                explanation:
                    'Uses sorted strings as keys to group anagrams efficiently.',
            },
        ],
        companies: ['Google', 'Amazon', 'Facebook'],
        frequency: '74%',
        acceptanceRate: 55.1,
        notes: 'Excellent for mastering grouping logic and hash table implementation.',
    },
    {
        questionId: 'qs007',
        title: 'Implement strStr()',
        shortDescription:
            'Find the index of the first occurrence of a substring in a string.',
        detailedDescription: `Implement strStr(). Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

Constraints:
- Return 0 when needle is an empty string.
- Avoid using built-in find/index functions for interviews.
- Optional challenge: use the KMP (Knuth-Morris-Pratt) algorithm.

This is a classical substring search problem that introduces prefix matching and sliding windows.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
        },
        solved: false,
        tags: ['String', 'Two Pointers', 'KMP', 'Sliding Window'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/solution/',
            description: 'Shows both naive sliding and KMP-based solutions.',
            videos: [
                {
                    title: 'Implement strStr() - Leetcode 28 - KMP Algorithm Explained',
                    url: 'https://www.youtube.com/watch?v=JoF0Z7nVSrA',
                    description:
                        'Explains prefix table and matching using KMP for advanced understanding.',
                },
            ],
        },
        testCases: [
            { input: 'haystack = "hello", needle = "ll"', output: '2' },
            { input: 'haystack = "aaaaa", needle = "bba"', output: '-1' },
            { input: 'haystack = "abc", needle = ""', output: '0' },
        ],
        discussions: [
            {
                id: 6,
                user: 'stringSeeker',
                content: 'What’s the intuition behind prefix table in KMP?',
                timestamp: '6 hours ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '56 ms',
                memory: '41.2 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def strStr(haystack, needle):\n    if not needle:\n        return 0\n    for i in range(len(haystack) - len(needle) + 1):\n        if haystack[i:i+len(needle)] == needle:\n            return i\n    return -1`,
                explanation:
                    'Naive window-based comparison, effective for small strings.',
            },
        ],
        companies: ['Google', 'Apple', 'Adobe'],
        frequency: '63%',
        acceptanceRate: 49.9,
        notes: 'Good stepping stone for substring search algorithms like Rabin-Karp and KMP.',
    },
    {
        questionId: 'qs008',
        title: 'Longest Common Prefix',
        shortDescription:
            'Find the longest common prefix string amongst an array of strings.',
        detailedDescription: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

Constraints:
- All given strings are in lowercase.
- Handle edge cases where array is empty or has only one string.

This problem emphasizes comparison techniques, prefix validation, and edge handling in string arrays.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/longest-common-prefix/',
        },
        solved: false,
        tags: ['String', 'Vertical Scanning', 'Horizontal Scanning'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-common-prefix/solution/',
            description:
                'Explores vertical and horizontal scanning approaches.',
            videos: [
                {
                    title: 'Longest Common Prefix - Leetcode 14 - Step by Step Explanation',
                    url: 'https://www.youtube.com/watch?v=BlWJYQk5nU0',
                    description:
                        'Visualizes multiple strategies with edge case handling.',
                },
            ],
        },
        testCases: [
            { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
            { input: 'strs = ["dog","racecar","car"]', output: '""' },
        ],
        discussions: [
            {
                id: 7,
                user: 'prefixQueen',
                content: 'Is vertical scanning more efficient than sorting?',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '36 ms',
                memory: '13.9 MB',
                status: 'Accepted',
                timestamp: '9 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def longestCommonPrefix(strs):\n    if not strs:\n        return ""\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return ""\n    return prefix`,
                explanation:
                    'Uses horizontal scanning by reducing the prefix based on mismatches.',
            },
        ],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: '66%',
        acceptanceRate: 55.6,
        notes: 'Frequent interview question to test string iteration and comparison logic.',
    },

    {
        questionId: 'qs009',
        title: 'String to Integer (atoi)',
        shortDescription:
            'Implement the atoi function which converts a string to an integer following specific rules.',
        detailedDescription: `Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer according to the following rules:
1. Read in and ignore any leading whitespace.
2. Check for an optional '+' or '-' sign.
3. Read digits until a non-digit is found.
4. Clamp the result to fit in a 32-bit signed integer range [-2^31, 2^31 - 1].

Constraints:
- Must handle edge cases like empty string, only symbols, and overflow.

This tests parsing logic, edge case handling, and control over data types.`,
        difficulty: 'medium',
        platform: {
            name: 'codechef',
            link: 'https://www.codechef.com/practice/course/pandas/IAPAUJ/problems/LHZKML01',
        },
        solved: false,
        tags: ['String', 'Parsing'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/string-to-integer-atoi/solution/',
            description: 'Details out parsing state logic and overflow checks.',
            videos: [
                {
                    title: 'String to Integer (atoi) - Leetcode 8 - Parsing Problem',
                    url: 'https://www.youtube.com/watch?v=4wuwLswWZ1o',
                    description:
                        'Shows how to build the atoi function from scratch handling all cases.',
                },
            ],
        },
        testCases: [
            { input: 's = "42"', output: '42' },
            { input: 's = "   -42"', output: '-42' },
            { input: 's = "4193 with words"', output: '4193' },
        ],
        discussions: [
            {
                id: 10,
                user: 'atoiWorrier',
                content:
                    'Should we use regex here or go character by character?',
                timestamp: '3 days ago',
                replies: 7,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '32 ms',
                memory: '14.1 MB',
                status: 'Accepted',
                timestamp: '11 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def myAtoi(s):\n    s = s.strip()\n    if not s:\n        return 0\n    sign, i, res = 1, 0, 0\n    if s[0] in ['+', '-']:\n        if s[0] == '-': sign = -1\n        i += 1\n    while i < len(s) and s[i].isdigit():\n        res = res * 10 + int(s[i])\n        i += 1\n    res *= sign\n    return max(min(res, 2**31 - 1), -2**31)`,
                explanation:
                    'Handles whitespace, optional sign, digit parsing, and 32-bit range bounds.',
            },
        ],
        companies: ['Google', 'Facebook', 'Microsoft'],
        frequency: '63%',
        acceptanceRate: 46.2,
        notes: 'Important parsing problem with emphasis on edge case resilience.',
    },
];

const dPQuestions = [
    {
        questionId: 'qdp001',
        title: 'Longest Palindromic Subsequence',
        shortDescription:
            'Find the length of the longest palindromic subsequence in a given string.',
        detailedDescription: `Given a string s, find the length of the longest subsequence of s that is a palindrome.  
A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

This problem tests your understanding of dynamic programming on strings, specifically on how to break down overlapping subproblems related to subsequences.

Constraints:  
- 1 <= s.length <= 1000  
- s consists only of lowercase English letters.`,

        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/longest-palindromic-subsequence/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'String', 'Palindrome', 'Subsequence'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/longest-palindromic-subsequence/solution/',
            description: `Use a 2D DP table where dp[i][j] represents the length of the longest palindromic subsequence in s[i..j].  
If characters at i and j match, dp[i][j] = dp[i+1][j-1] + 2; else dp[i][j] = max(dp[i+1][j], dp[i][j-1]).`,

            videos: [
                {
                    title: 'Longest Palindromic Subsequence - LeetCode Explanation',
                    url: 'https://www.youtube.com/watch?v=NPZn9jBrX8U',
                    description: 'Step-by-step DP solution with visualization.',
                },
            ],
        },
        testCases: [
            { input: 's = "bbbab"', output: '4' },
            { input: 's = "cbbd"', output: '2' },
        ],
        discussions: [
            {
                id: 21,
                user: 'dpMaster',
                content:
                    'How to optimize space complexity from O(n^2) to O(n)?',
                timestamp: '1 day ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 9,
                language: 'JavaScript',
                runtime: '72 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `
function longestPalindromeSubseq(s) {
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    for (let i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (let j = i + 1; j < n; j++) {
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
}
            `,
                explanation:
                    'Build the DP table from the bottom up, comparing characters and combining results.',
            },
        ],
        companies: ['Amazon', 'Google', 'Facebook'],
        frequency: '62%',
        acceptanceRate: 54.1,
        notes: 'Classic DP problem focusing on subsequences and palindromes; good for understanding 2D DP arrays.',
    },
    {
        questionId: 'qdp002',
        title: 'Coin Change',
        shortDescription:
            'Find the fewest number of coins needed to make a given amount.',
        detailedDescription: `Given different denominations of coins and a total amount, find the fewest number of coins that you need to make up that amount.  
    If that amount of money cannot be made up by any combination of the coins, return -1.

Constraints:  
- 1 <= coins.length <= 12  
- 0 <= amount <= 10^4

This problem tests bottom-up DP for solving minimum coin change problems.`,

        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/coin-change/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Greedy', 'Memoization'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/coin-change/solution/',
            description: `DP approach: For each amount, compute minimum coins by checking all coins smaller than current amount.`,

            videos: [
                {
                    title: 'Coin Change - LeetCode Solution',
                    url: 'https://www.youtube.com/watch?v=Y0ZqKpToTic',
                    description:
                        'Step-by-step dynamic programming explanation.',
                },
            ],
        },
        testCases: [
            { input: 'coins = [1, 2, 5], amount = 11', output: '3' },
            { input: 'coins = [2], amount = 3', output: '-1' },
        ],
        discussions: [
            {
                id: 2,
                user: 'coinExpert',
                content: 'How to optimize this for large amount values?',
                timestamp: '3 days ago',
                replies: 2,
            },
        ],
        submissions: [
            {
                id: 2,
                language: 'JavaScript',
                runtime: '68 ms',
                memory: '42 MB',
                status: 'Accepted',
                timestamp: '1 day ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `
function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for(let i = 1; i <= amount; i++) {
        for(let coin of coins) {
            if(coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}
            `,
                explanation:
                    'Bottom-up DP filling array with minimum coins required for all amounts up to target.',
            },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '68%',
        acceptanceRate: 40.7,
        notes: 'Fundamental DP problem useful for optimization techniques.',
    },
    {
        questionId: 'qdp003',
        title: 'Maximum Subarray',
        shortDescription: 'Find the contiguous subarray with the largest sum.',
        detailedDescription: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Constraints:  
- 1 <= nums.length <= 10^5  
- -10^4 <= nums[i] <= 10^4

Tests understanding of Kadane’s algorithm, a classic DP approach to maximum subarray problems.`,

        difficulty: 'easy',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/challenges/maxsubarray/problem',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Array', 'Greedy'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/maximum-subarray/solution/',
            description: `Maintain current max subarray sum ending at each position and update global max.`,

            videos: [
                {
                    title: 'Maximum Subarray - Kadane’s Algorithm',
                    url: 'https://www.youtube.com/watch?v=86CQq3pKSUw',
                    description: 'Clear explanation of Kadane’s algorithm.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
            { input: 'nums = [1]', output: '1' },
        ],
        discussions: [
            {
                id: 3,
                user: 'arrayPro',
                content: 'Can this be done in O(n) without extra space?',
                timestamp: '7 days ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 3,
                language: 'JavaScript',
                runtime: '60 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `
function maxSubArray(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];
    for(let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}
            `,
                explanation:
                    'Track max subarray ending at each element and update global max.',
            },
        ],
        companies: ['Microsoft', 'Google', 'Apple'],
        frequency: '80%',
        acceptanceRate: 53.4,
        notes: 'Classic problem demonstrating the power of DP with O(n) time complexity.',
    },
    {
        questionId: 'qdp004',
        title: 'Edit Distance',
        shortDescription:
            'Calculate the minimum number of operations to convert one string into another.',
        detailedDescription: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.  
Operations allowed: insert a character, delete a character, replace a character.

Constraints:  
- 0 <= word1.length, word2.length <= 500

This is a standard DP problem on strings testing transformation operations.`,

        difficulty: 'hard',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/contests/cse-830-homework-3/challenges/edit-distance/problem/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'String'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/edit-distance/solution/',
            description: `DP approach: dp[i][j] represents minimum operations to convert first i chars of word1 to first j chars of word2.`,

            videos: [
                {
                    title: 'Edit Distance - LeetCode Explanation',
                    url: 'https://www.youtube.com/watch?v=we8kS4cP1NA',
                    description:
                        'Detailed explanation of DP states and transitions.',
                },
            ],
        },
        testCases: [
            { input: 'word1 = "horse", word2 = "ros"', output: '3' },
            { input: 'word1 = "intention", word2 = "execution"', output: '5' },
        ],
        discussions: [
            {
                id: 4,
                user: 'stringMaster',
                content: 'How to optimize space complexity for this problem?',
                timestamp: '1 week ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 4,
                language: 'JavaScript',
                runtime: '110 ms',
                memory: '45 MB',
                status: 'Accepted',
                timestamp: '6 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `
function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for(let i = 0; i <= m; i++) dp[i][0] = i;
    for(let j = 0; j <= n; j++) dp[0][j] = j;

    for(let i = 1; i <= m; i++) {
        for(let j = 1; j <= n; j++) {
            if(word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j],    // delete
                                        dp[i][j - 1],    // insert
                                        dp[i - 1][j - 1] // replace
                                       );
            }
        }
    }
    return dp[m][n];
}
            `,
                explanation:
                    'DP table tracks minimum operations for all prefixes of both strings.',
            },
        ],
        companies: ['Google', 'Amazon', 'Facebook'],
        frequency: '60%',
        acceptanceRate: 36.8,
        notes: 'Complex DP with 2D state space, fundamental for string transformation problems.',
    },
    {
        questionId: 'qdp005',
        title: 'Minimum Path Sum in a Grid',
        shortDescription:
            'Find the path from top-left to bottom-right in a grid with the minimum sum of numbers.',
        detailedDescription: `Given a m x n grid filled with non-negative numbers, find a path from top-left to bottom-right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.

Constraints:
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 200
- 0 <= grid[i][j] <= 100

This problem tests your ability to implement dynamic programming on a 2D grid.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/minimum-path-sum/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Matrix'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/minimum-path-sum/solution/',
            description: `Use a 2D DP array where dp[i][j] represents the minimum path sum to reach cell (i,j).`,
            videos: [
                {
                    title: 'Minimum Path Sum - LeetCode',
                    url: 'https://www.youtube.com/watch?v=twC3xJvL1gI',
                    description:
                        'Explains the DP approach to solve the minimum path sum problem.',
                },
            ],
        },
        testCases: [
            { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7' },
            { input: 'grid = [[1,2,3],[4,5,6]]', output: '12' },
        ],
        discussions: [
            {
                id: 1,
                user: 'dpLearner',
                content:
                    'Can this problem be solved using recursion with memoization?',
                timestamp: '3 days ago',
                replies: 2,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '80 ms',
                memory: '39 MB',
                status: 'Accepted',
                timestamp: '2 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
}`,
                explanation:
                    'Dynamic programming approach that builds up the solution by calculating the minimum path sum to each cell.',
            },
        ],
        companies: ['Amazon', 'Google', 'Microsoft'],
        frequency: '65%',
        acceptanceRate: 55.4,
        notes: 'A classic DP problem that helps in understanding grid-based dynamic programming.',
    },
    {
        questionId: 'qdp007',
        title: 'Unique Paths',
        shortDescription:
            'Count the number of unique paths from top-left to bottom-right in a grid.',
        detailedDescription: `A robot is located at the top-left corner of a m x n grid. The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid. How many possible unique paths are there?

Constraints:
- 1 <= m, n <= 100

This problem tests combinatorial dynamic programming on a grid.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/unique-paths/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Combinatorics'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/unique-paths/solution/',
            description: `Use a 2D DP array where dp[i][j] represents the number of unique paths to reach cell (i,j).`,
            videos: [
                {
                    title: 'Unique Paths - LeetCode',
                    url: 'https://www.youtube.com/watch?v=IlEsdxuD4lY',
                    description:
                        'Explains the DP approach to count unique paths in a grid.',
                },
            ],
        },
        testCases: [
            { input: 'm = 3, n = 7', output: '28' },
            { input: 'm = 3, n = 2', output: '3' },
        ],
        discussions: [
            {
                id: 2,
                user: 'combinatoricsFan',
                content:
                    'Is there a mathematical formula to solve this without DP?',
                timestamp: '5 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 2,
                language: 'JavaScript',
                runtime: '72 ms',
                memory: '38 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}`,
                explanation:
                    'Dynamic programming approach that calculates the number of unique paths to each cell by summing the paths from the top and left cells.',
            },
        ],
        companies: ['Google', 'Facebook', 'Apple'],
        frequency: '70%',
        acceptanceRate: 60.2,
        notes: 'A fundamental DP problem that introduces grid traversal concepts.',
    },
    {
        questionId: 'qdp011',
        title: 'Coin Change II',
        shortDescription:
            'Count number of combinations that make up an amount using given coins',
        detailedDescription: `Given an array of coins and an integer amount, return the number of combinations that make up that amount. You may assume an infinite number of each coin.

Constraints:
- 1 <= coins.length <= 300
- 1 <= coins[i] <= 5000
- 0 <= amount <= 5000

This problem tests your understanding of unbounded knapsack DP approach.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/coin-change-ii/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Unbounded Knapsack'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/coin-change-ii/solution/',
            description: `Use a DP array where dp[i] represents the number of combinations to make amount i.`,
            videos: [
                {
                    title: 'Coin Change II - LeetCode',
                    url: 'https://www.youtube.com/watch?v=Mjy4hd2xgrs',
                    description:
                        'Explains the DP approach to count combinations',
                },
            ],
        },
        testCases: [
            { input: 'amount = 5, coins = [1,2,5]', output: '4' },
            { input: 'amount = 3, coins = [2]', output: '0' },
        ],
        discussions: [
            {
                id: 1,
                user: 'coinMaster',
                content: 'Why does the order of loops matter in this problem?',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '120 ms',
                memory: '14.2 MB',
                status: 'Accepted',
                timestamp: '5 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]`,
                explanation:
                    'DP approach where outer loop is over coins to avoid counting permutations',
            },
        ],
        companies: ['Goldman Sachs', 'JPMorgan', 'Bloomberg'],
        frequency: '58%',
        acceptanceRate: 52.1,
        notes: 'Key difference from Coin Change I is we count combinations not permutations',
    },
    {
        questionId: 'qdp012',
        title: 'Target Sum',
        shortDescription:
            'Count number of ways to assign +/- to get target sum',
        detailedDescription: `Given an array of integers and a target sum, count the number of ways to assign '+' or '-' to each integer to reach the target sum.

Constraints:
- 1 <= nums.length <= 20
- 0 <= nums[i] <= 1000
- -1000 <= target <= 1000

This problem can be converted to a subset sum problem with DP.`,
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/target-sum-1626326450/1',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Subset Sum'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/target-sum/solution/',
            description: `Convert to subset sum problem: find subsets where sum = (target + total)/2`,
            videos: [
                {
                    title: 'Target Sum - LeetCode',
                    url: 'https://www.youtube.com/watch?v=Hw6Ygp3JBYw',
                    description:
                        'Shows the mathematical conversion to subset sum',
                },
            ],
        },
        testCases: [
            { input: 'nums = [1,1,1,1,1], target = 3', output: '5' },
            { input: 'nums = [1], target = 1', output: '1' },
        ],
        discussions: [
            {
                id: 1,
                user: 'mathWizard',
                content:
                    'How does the subset sum conversion work mathematically?',
                timestamp: '1 day ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '15 ms',
                memory: '42.3 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Java',
                code: `public int findTargetSumWays(int[] nums, int target) {
    int sum = 0;
    for (int num : nums) sum += num;
    if (Math.abs(target) > sum || (sum + target) % 2 != 0) return 0;
    int s = (sum + target) / 2;
    int[] dp = new int[s + 1];
    dp[0] = 1;
    for (int num : nums) {
        for (int i = s; i >= num; i--) {
            dp[i] += dp[i - num];
        }
    }
    return dp[s];
}`,
                explanation:
                    'Convert to subset sum problem and use 1D DP array',
            },
        ],
        companies: ['Facebook', 'Amazon', 'Adobe'],
        frequency: '62%',
        acceptanceRate: 46.3,
        notes: 'Important to handle edge cases where target is impossible',
    },
    {
        questionId: 'qdp013',
        title: 'Partition Equal Subset Sum',
        shortDescription:
            'Can the array be partitioned into two subsets with equal sums?',
        detailedDescription: `Given a non-empty array containing only positive integers, determine if it can be partitioned into two subsets with equal sums.

Constraints:
- 1 <= nums.length <= 200
- 1 <= nums[i] <= 100

This is a classic subset sum problem that tests your ability to optimize space in DP.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/partition-equal-subset-sum/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Subset Sum'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/partition-equal-subset-sum/solution/',
            description: `First check if total sum is even, then find subset that sums to half of total`,
            videos: [
                {
                    title: 'Partition Equal Subset Sum - LeetCode',
                    url: 'https://www.youtube.com/watch?v=IsvocB5BJhw',
                    description:
                        'Detailed explanation of the subset sum approach',
                },
            ],
        },
        testCases: [
            { input: 'nums = [1,5,11,5]', output: 'true' },
            { input: 'nums = [1,2,3,5]', output: 'false' },
        ],
        discussions: [
            {
                id: 1,
                user: 'partitionExpert',
                content: 'Why does the DP array need to be filled backwards?',
                timestamp: '4 days ago',
                replies: 2,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'C++',
                runtime: '120 ms',
                memory: '11.8 MB',
                status: 'Accepted',
                timestamp: '6 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'C++',
                code: `bool canPartition(vector<int>& nums) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % 2 != 0) return false;
    int target = sum / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    return dp[target];
}`,
                explanation:
                    'Optimized space using 1D boolean array filled backwards',
            },
        ],
        companies: ['Microsoft', 'Apple', 'Uber'],
        frequency: '67%',
        acceptanceRate: 44.2,
        notes: 'Similar to knapsack problem but with boolean outcomes',
    },
    {
        questionId: 'qdp014',
        title: 'Perfect Squares',
        shortDescription:
            'Find the least number of perfect square numbers that sum to n',
        detailedDescription: `Given a positive integer n, find the least number of perfect square numbers (1, 4, 9, 16, ...) which sum to n.

Constraints:
- 1 <= n <= 10⁴

This problem demonstrates DP with mathematical optimization (can also use Lagrange's theorem).`,
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'hhttps://www.geeksforgeeks.org/problems/get-minimum-squares0538/1',
        },
        solved: false,
        tags: ['Dynamic Programming', 'Math'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/perfect-squares/solution/',
            description: `DP approach where dp[i] = min(dp[i], dp[i - j*j] + 1) for all j*j <= i`,
            videos: [
                {
                    title: 'Perfect Squares - LeetCode',
                    url: 'https://www.youtube.com/watch?v=HLZLwjzIVGo',
                    description: 'Shows both DP and mathematical approaches',
                },
            ],
        },
        testCases: [
            { input: 'n = 12', output: '3' },
            { input: 'n = 13', output: '2' },
        ],
        discussions: [
            {
                id: 1,
                user: 'mathGeek',
                content:
                    'How does the mathematical approach compare to DP in performance?',
                timestamp: '3 days ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '150 ms',
                memory: '44.5 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'JavaScript',
                code: `var numSquares = function(n) {
    const dp = Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        }
    }
    return dp[n];
}`,
                explanation:
                    'DP solution building up from 1 to n, checking all possible squares',
            },
        ],
        companies: ['Google', 'Adobe', 'Salesforce'],
        frequency: '59%',
        acceptanceRate: 49.7,
        notes: 'Can also be solved using BFS for better performance on large n',
    },
    {
        questionId: 'qdp015',
        title: 'Decode Ways',
        shortDescription:
            'Count how many ways a digit string can be decoded to letters (A=1, B=2,...Z=26)',
        detailedDescription: `Given a string s containing only digits, return the number of ways to decode it to letters (A=1 to Z=26).

Constraints:
- 1 <= s.length <= 100
- s contains only digits and may contain leading zeros (which are invalid)

This problem tests edge case handling in DP with string inputs.`,
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/decode-ways/',
        },
        solved: false,
        tags: ['Dynamic Programming', 'String'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/decode-ways/solution/',
            description: `DP approach where dp[i] depends on valid single-digit (s[i]) and two-digit (s[i-1:i]) interpretations`,
            videos: [
                {
                    title: 'Decode Ways - LeetCode',
                    url: 'https://www.youtube.com/watch?v=6aEyTjOwlJU',
                    description:
                        'Detailed walkthrough of DP approach with edge cases',
                },
            ],
        },
        testCases: [
            { input: 's = "12"', output: '2' },
            { input: 's = "226"', output: '3' },
            { input: 's = "06"', output: '0' },
        ],
        discussions: [
            {
                id: 1,
                user: 'stringDecoder',
                content: 'How to handle leading zeros in this problem?',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '32 ms',
                memory: '13.9 MB',
                status: 'Accepted',
                timestamp: '1 hour ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def numDecodings(s):
    if not s or s[0] == '0':
        return 0
    n = len(s)
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1
    for i in range(2, n + 1):
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    return dp[n]`,
                explanation:
                    'DP solution handling single-digit and two-digit cases separately',
            },
        ],
        companies: ['Facebook', 'Amazon', 'Apple'],
        frequency: '63%',
        acceptanceRate: 27.8,
        notes: 'Pay special attention to edge cases with zeros',
    },
];

const graphQuestions = [
    {
        questionId: 'qgr001',
        title: 'Graph Valid Tree',
        shortDescription:
            'Determine if given edges form a valid tree with n nodes.',
        detailedDescription:
            'You are given `n` nodes labeled from 0 to n-1 and a list of undirected edges (each edge is a pair of nodes). Check if these edges form a valid tree.\n\nA valid tree is a connected graph with no cycles.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/graph-valid-tree/',
        },
        tags: ['Graph', 'Union Find', 'DFS', 'BFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/graph-valid-tree/solution/',
            description:
                'Check if the graph is connected and contains no cycles using DFS or Union Find.',
            videos: [
                {
                    title: 'Graph Valid Tree - Leetcode 261',
                    url: 'https://www.youtube.com/watch?v=4YjLHkN0u8s',
                    description:
                        'Union Find and DFS methods to validate tree structure.',
                },
            ],
        },
        testCases: [
            {
                input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]',
                output: 'true',
            },
            {
                input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]',
                output: 'false',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def validTree(n, edges):\n    if len(edges) != n - 1:\n        return False\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    def union(a, b):\n        rootA, rootB = find(a), find(b)\n        if rootA == rootB:\n            return False\n        parent[rootB] = rootA\n        return True\n    for a, b in edges:\n        if not union(a, b):\n            return False\n    return True',
                explanation:
                    'Using Union Find to detect cycles and ensure connectivity.',
            },
        ],
        companies: ['Google', 'Facebook'],
        frequency: '70%',
        acceptanceRate: 49.8,
        notes: 'Fundamental graph problem introducing cycle detection and connectivity.',
    },
    {
        questionId: 'qgr002',
        title: 'Number of Islands',
        shortDescription: 'Count distinct islands in a 2D grid.',
        detailedDescription:
            "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nThis problem is a classic application of DFS/BFS on grid graphs.",
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/number-of-islands/',
        },
        tags: ['Graph', 'DFS', 'BFS', 'Grid'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/number-of-islands/solution/',
            description: 'DFS or BFS to explore connected components on grid.',
            videos: [
                {
                    title: 'Number of Islands - Leetcode 200',
                    url: 'https://www.youtube.com/watch?v=4bPzt0sK7fg',
                    description: 'DFS approach to count islands.',
                },
            ],
        },
        testCases: [
            {
                input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
                output: '3',
            },
            {
                input: '[["1","1","1"],["0","1","0"],["1","1","1"]]',
                output: '1',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: "def numIslands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':\n            return\n        grid[r][c] = '0'\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count",
                explanation:
                    'Perform DFS to sink connected lands and count islands.',
            },
        ],
        companies: ['Amazon', 'Microsoft'],
        frequency: '85%',
        acceptanceRate: 53.4,
        notes: 'Excellent introduction to graph traversal on grid representations.',
    },
    {
        questionId: 'qgr003',
        title: 'Course Schedule',
        shortDescription:
            'Determine if all courses can be finished given prerequisites.',
        detailedDescription:
            'There are `numCourses` labeled from 0 to numCourses-1. You are given prerequisites as pairs [a, b] meaning to take course `a` you must have finished course `b`.\n\nDetermine if it is possible to finish all courses.\n\nThis problem boils down to detecting cycles in a directed graph.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/course-schedule/',
        },
        tags: ['Graph', 'Topological Sort', 'DFS', 'Cycle Detection'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/course-schedule/solution/',
            description:
                "Detect cycles using DFS or use Kahn's algorithm for topological sorting.",
            videos: [
                {
                    title: 'Course Schedule - Leetcode 207',
                    url: 'https://www.youtube.com/watch?v=EgI5nU8J0s8',
                    description:
                        'Cycle detection and topological sort explanation.',
                },
            ],
        },
        testCases: [
            {
                input: 'numCourses = 2, prerequisites = [[1,0]]',
                output: 'true',
            },
            {
                input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
                output: 'false',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import defaultdict\n\ndef canFinish(numCourses, prerequisites):\n    graph = defaultdict(list)\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n    visited = [0] * numCourses  # 0=unvisited,1=visiting,2=visited\n    def dfs(course):\n        if visited[course] == 1:\n            return False\n        if visited[course] == 2:\n            return True\n        visited[course] = 1\n        for neighbor in graph[course]:\n            if not dfs(neighbor):\n                return False\n        visited[course] = 2\n        return True\n    for c in range(numCourses):\n        if not dfs(c):\n            return False\n    return True',
                explanation:
                    'DFS cycle detection to verify if schedule is possible.',
            },
        ],
        companies: ['Google', 'Facebook', 'Amazon'],
        frequency: '90%',
        acceptanceRate: 47.2,
        notes: 'Fundamental problem involving directed graphs and cycle detection.',
    },
    {
        questionId: 'qgr004',
        title: 'Minimum Spanning Tree (Kruskal’s Algorithm)',
        shortDescription:
            'Find the minimum spanning tree of a weighted undirected graph.',
        detailedDescription:
            "Given an undirected weighted graph, find a subset of the edges that forms a tree including every vertex, where the total weight is minimized.\n\nUse Kruskal's algorithm to achieve this efficiently with a Union Find data structure.",
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1',
        },
        tags: ['Graph', 'Union Find', 'Greedy', 'MST'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://en.wikipedia.org/wiki/Kruskal%27s_algorithm',
            description:
                'Sort edges by weight and use Union Find to pick edges without cycles.',
            videos: [
                {
                    title: 'Kruskal’s Algorithm',
                    url: 'https://www.youtube.com/watch?v=71UQH7Pr9kU',
                    description:
                        "Step-by-step explanation of Kruskal's MST algorithm.",
                },
            ],
        },
        testCases: [
            {
                input: 'vertices = 4, edges = [[0,1,1],[0,2,4],[1,2,2],[1,3,6],[2,3,3]]',
                output: '6',
            },
            {
                input: 'vertices = 3, edges = [[0,1,10],[1,2,5],[0,2,100]]',
                output: '15',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def kruskalMST(vertices, edges):\n    parent = list(range(vertices))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    def union(a, b):\n        rootA, rootB = find(a), find(b)\n        if rootA == rootB:\n            return False\n        parent[rootB] = rootA\n        return True\n    edges.sort(key=lambda x: x[2])\n    mst_weight = 0\n    for u, v, w in edges:\n        if union(u, v):\n            mst_weight += w\n    return mst_weight',
                explanation:
                    'Use Union Find to avoid cycles while picking smallest edges.',
            },
        ],
        companies: ['Amazon', 'Microsoft'],
        frequency: '60%',
        acceptanceRate: 50.1,
        notes: 'Key greedy algorithm for weighted graph connectivity.',
    },
    {
        questionId: 'qgr005',
        title: 'Clone Graph',
        shortDescription: 'Clone a connected undirected graph.',
        detailedDescription:
            'Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node contains a value and a list of its neighbors.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/clone-graph/',
        },
        tags: ['Graph', 'DFS', 'BFS', 'Hashing'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/clone-graph/solution/',
            description:
                'Use DFS or BFS with a hashmap to clone each node exactly once.',
            videos: [
                {
                    title: 'Clone Graph - Leetcode 133',
                    url: 'https://www.youtube.com/watch?v=nfXANhH6Fbw',
                    description: 'DFS and BFS cloning approaches.',
                },
            ],
        },
        testCases: [
            {
                input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
                output: 'A deep copy graph identical to input',
            },
            {
                input: 'adjList = [[]]',
                output: 'A deep copy graph with single node and no neighbors',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def cloneGraph(node):\n    if not node:\n        return None\n    visited = {}\n    def dfs(n):\n        if n in visited:\n            return visited[n]\n        copy = Node(n.val)\n        visited[n] = copy\n        for neighbor in n.neighbors:\n            copy.neighbors.append(dfs(neighbor))\n        return copy\n    return dfs(node)',
                explanation: 'DFS clone with hashmap tracks cloned nodes.',
            },
        ],
        companies: ['Google', 'Facebook'],
        frequency: '70%',
        acceptanceRate: 43.1,
        notes: 'Good practice of graph traversal and handling references.',
    },
    {
        questionId: 'qgr006',
        title: 'Shortest Path in Binary Matrix',
        shortDescription:
            'Find shortest clear path from top-left to bottom-right in a binary matrix.',
        detailedDescription:
            'Given an n x n binary matrix grid, return the length of the shortest clear path from top-left (0,0) to bottom-right (n-1,n-1).\n\nA clear path consists only of cells with value 0, moving in 8 directions (horizontal, vertical, diagonal). Return -1 if no such path exists.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
        },
        tags: ['Graph', 'BFS', 'Grid', 'Shortest Path'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/shortest-path-in-binary-matrix/solution/',
            description:
                'BFS to explore all 8 directions with a queue, track visited cells.',
            videos: [
                {
                    title: 'Shortest Path in Binary Matrix - Leetcode 1091',
                    url: 'https://www.youtube.com/watch?v=s0jAj7rFvT8',
                    description: 'BFS approach for shortest path.',
                },
            ],
        },
        testCases: [
            { input: '[[0,1],[1,0]]', output: '2' },
            { input: '[[0,0,0],[1,1,0],[1,1,0]]', output: '4' },
            { input: '[[1,0,0],[1,1,0],[1,1,0]]', output: '-1' },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import deque\n\ndef shortestPathBinaryMatrix(grid):\n    n = len(grid)\n    if grid[0][0] or grid[n-1][n-1]:\n        return -1\n    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]\n    queue = deque([(0,0,1)])\n    visited = set((0,0))\n    while queue:\n        r, c, dist = queue.popleft()\n        if r == c == n-1:\n            return dist\n        for dr, dc in directions:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr,nc) not in visited:\n                visited.add((nr,nc))\n                queue.append((nr,nc, dist + 1))\n    return -1',
                explanation:
                    'Classic BFS shortest path in grid with diagonal moves.',
            },
        ],
        companies: ['Amazon', 'Microsoft'],
        frequency: '65%',
        acceptanceRate: 37.9,
        notes: 'Great BFS application with 8-directional movement.',
    },
    {
        questionId: 'qgr007',
        title: 'Detect Cycle in Undirected Graph',
        shortDescription: 'Check if an undirected graph contains any cycle.',
        detailedDescription:
            'Given an undirected graph, determine if it contains any cycle. Return true if a cycle is found, false otherwise.\n\nYou can use DFS with parent tracking or Union Find.',
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1',
        },
        tags: ['Graph', 'DFS', 'Union Find', 'Cycle Detection'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://www.geeksforgeeks.org/detect-cycle-undirected-graph/',
            description:
                'Use DFS or Union Find to detect cycles in undirected graphs.',
            videos: [
                {
                    title: 'Detect Cycle in Undirected Graph',
                    url: 'https://www.youtube.com/watch?v=V6mKVRU1evU',
                    description: 'DFS and Union Find cycle detection.',
                },
            ],
        },
        testCases: [
            { input: 'V = 3, edges = [[0,1],[1,2],[0,2]]', output: 'true' },
            { input: 'V = 4, edges = [[0,1],[1,2],[2,3]]', output: 'false' },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def isCycle(V, adj):\n    visited = [False] * V\n    def dfs(v, parent):\n        visited[v] = True\n        for neighbor in adj[v]:\n            if not visited[neighbor]:\n                if dfs(neighbor, v):\n                    return True\n            elif neighbor != parent:\n                return True\n        return False\n    for i in range(V):\n        if not visited[i]:\n            if dfs(i, -1):\n                return True\n    return False',
                explanation:
                    'DFS with parent tracking to detect back edges indicating cycles.',
            },
        ],
        companies: ['Amazon', 'Microsoft', 'Google'],
        frequency: '75%',
        acceptanceRate: 54.5,
        notes: 'Core graph problem focusing on cycle detection in undirected graphs.',
    },
    {
        questionId: 'qgr008',
        title: 'Number of Connected Components in an Undirected Graph',
        shortDescription: 'Count connected components in an undirected graph.',
        detailedDescription:
            'Given `n` nodes labeled 0 to n-1 and a list of edges, count the number of connected components in the undirected graph.\n\nUse DFS or Union Find to find connected sets.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
        },
        tags: ['Graph', 'DFS', 'Union Find'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/solution/',
            description: 'Union Find or DFS to count connected components.',
            videos: [
                {
                    title: 'Number of Connected Components - Leetcode 323',
                    url: 'https://www.youtube.com/watch?v=ID00PMy0-vE',
                    description: 'Union Find method explanation.',
                },
            ],
        },
        testCases: [
            { input: 'n=5, edges=[[0,1],[1,2],[3,4]]', output: '2' },
            { input: 'n=5, edges=[[0,1],[1,2],[2,3],[3,4]]', output: '1' },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def countComponents(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    def union(a, b):\n        rootA, rootB = find(a), find(b)\n        if rootA != rootB:\n            parent[rootB] = rootA\n            return True\n        return False\n    count = n\n    for a, b in edges:\n        if union(a,b):\n            count -= 1\n    return count',
                explanation:
                    'Union Find to merge components and count remaining sets.',
            },
        ],
        companies: ['Google', 'Facebook'],
        frequency: '60%',
        acceptanceRate: 48.9,
        notes: 'Union Find applications to cluster graph nodes.',
    },
    {
        questionId: 'qgr010',
        title: 'Alien Dictionary',
        shortDescription:
            'Find the order of characters in an alien language from a sorted dictionary.',
        detailedDescription:
            'Given a sorted dictionary of an alien language, find the order of characters in the language.\n\nReturn a string representing the characters in lex order or an empty string if no valid order exists.',
        difficulty: 'hard',
        platform: {
            name: 'gfg',
            link: 'https://practice.geeksforgeeks.org/problems/alien-dictionary/1',
        },
        tags: ['Graph', 'Topological Sort', 'DFS', 'BFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://www.geeksforgeeks.org/alphabetical-order-in-an-alien-language/',
            description:
                'Build graph edges from adjacent words, then do topological sort.',
            videos: [
                {
                    title: 'Alien Dictionary - GFG',
                    url: 'https://www.youtube.com/watch?v=Q8kXpB2fd4A',
                    description: 'Topological sort and graph construction.',
                },
            ],
        },
        testCases: [
            {
                input: 'words = ["baa", "abcd", "abca", "cab", "cad"]',
                output: '"bdac"',
            },
            { input: 'words = ["caa", "aaa", "aab"]', output: '"cab"' },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import defaultdict, deque\n\ndef alienOrder(words):\n    graph = defaultdict(set)\n    indegree = {c:0 for word in words for c in word}\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i+1]\n        minLen = min(len(w1), len(w2))\n        for j in range(minLen):\n            if w1[j] != w2[j]:\n                if w2[j] not in graph[w1[j]]:\n                    graph[w1[j]].add(w2[j])\n                    indegree[w2[j]] += 1\n                break\n        else:\n            if len(w2) < len(w1):\n                return ""\n    queue = deque([c for c in indegree if indegree[c] == 0])\n    order = []\n    while queue:\n        c = queue.popleft()\n        order.append(c)\n        for nei in graph[c]:\n            indegree[nei] -= 1\n            if indegree[nei] == 0:\n                queue.append(nei)\n    return "" if len(order) != len(indegree) else "".join(order)',
                explanation:
                    'Build directed graph from adjacent words and run topological sort.',
            },
        ],
        companies: ['Amazon', 'Facebook'],
        frequency: '50%',
        acceptanceRate: 36.7,
        notes: 'Topological ordering with string input, challenging graph problem.',
    },
    {
        questionId: 'qgr010',
        title: 'Alien Dictionary',
        shortDescription:
            'Find the order of characters in an alien language from a sorted dictionary.',
        detailedDescription:
            'Given a sorted dictionary of an alien language, find the order of characters in the language.\n\nReturn a string representing the characters in lex order or an empty string if no valid order exists.',
        difficulty: 'hard',
        platform: {
            name: 'gfg',
            link: 'https://practice.geeksforgeeks.org/problems/alien-dictionary/1',
        },
        tags: ['Graph', 'Topological Sort', 'DFS', 'BFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://www.geeksforgeeks.org/alphabetical-order-in-an-alien-language/',
            description:
                'Build graph edges from adjacent words, then do topological sort.',
            videos: [
                {
                    title: 'Alien Dictionary - GFG',
                    url: 'https://www.youtube.com/watch?v=Q8kXpB2fd4A',
                    description: 'Topological sort and graph construction.',
                },
            ],
        },
        testCases: [
            {
                input: 'words = ["baa", "abcd", "abca", "cab", "cad"]',
                output: '"bdac"',
            },
            { input: 'words = ["caa", "aaa", "aab"]', output: '"cab"' },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import defaultdict, deque\n\ndef alienOrder(words):\n    graph = defaultdict(set)\n    indegree = {c:0 for word in words for c in word}\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i+1]\n        minLen = min(len(w1), len(w2))\n        for j in range(minLen):\n            if w1[j] != w2[j]:\n                if w2[j] not in graph[w1[j]]:\n                    graph[w1[j]].add(w2[j])\n                    indegree[w2[j]] += 1\n                break\n        else:\n            if len(w2) < len(w1):\n                return ""\n    queue = deque([c for c in indegree if indegree[c] == 0])\n    order = []\n    while queue:\n        c = queue.popleft()\n        order.append(c)\n        for nei in graph[c]:\n            indegree[nei] -= 1\n            if indegree[nei] == 0:\n                queue.append(nei)\n    return "" if len(order) != len(indegree) else "".join(order)',
                explanation:
                    'Build directed graph from adjacent words and run topological sort.',
            },
        ],
        companies: ['Amazon', 'Facebook'],
        frequency: '50%',
        acceptanceRate: 36.7,
        notes: 'Topological ordering with string input, challenging graph problem.',
    },
];

const binaryTreeQuestions = [
    {
        questionId: 'qbt001',
        title: 'Maximum Depth of Binary Tree',
        shortDescription:
            'Find the maximum depth (or height) of a binary tree.',
        detailedDescription: `Given the root of a binary tree, return its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

This tests your understanding of tree traversal, recursion, and base cases.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        },
        solved: false,
        tags: ['Binary Tree', 'DFS', 'Recursion'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/maximum-depth-of-binary-tree/solution/',
            description:
                'Demonstrates a simple recursive depth-first traversal.',
            videos: [
                {
                    title: 'Maximum Depth of Binary Tree - Leetcode 104',
                    url: 'https://www.youtube.com/watch?v=hTM3phVI6YQ',
                    description: 'Recursive and iterative BFS explanations.',
                },
            ],
        },
        testCases: [
            { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
            { input: 'root = [1,null,2]', output: '2' },
        ],
        discussions: [
            {
                id: 1,
                user: 'treeExplorer',
                content: 'What’s the benefit of DFS vs BFS here?',
                timestamp: '5 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '40 ms',
                memory: '16.3 MB',
                status: 'Accepted',
                timestamp: '8 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
                explanation:
                    'Traverses each subtree and computes max depth recursively.',
            },
        ],
        companies: ['Amazon', 'Facebook', 'Google'],
        frequency: '73%',
        acceptanceRate: 67.8,
        notes: 'Great for understanding recursive base and recursive steps.',
    },
    {
        questionId: 'qbt002',
        title: 'Invert Binary Tree',
        shortDescription: 'Invert (mirror) a binary tree.',
        detailedDescription: `Given the root of a binary tree, invert the tree and return its root.

This involves swapping the left and right children of all nodes in the tree.

This is a classic example of using recursion or a queue for tree manipulation.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/invert-binary-tree/',
        },
        solved: false,
        tags: ['Binary Tree', 'Recursion', 'BFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/invert-binary-tree/solution/',
            description: 'Illustrates both recursive and iterative methods.',
            videos: [
                {
                    title: 'Invert Binary Tree - Leetcode 226',
                    url: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY',
                    description: 'Step-by-step recursion explained visually.',
                },
            ],
        },
        testCases: [
            { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
            { input: 'root = [2,1,3]', output: '[2,3,1]' },
        ],
        discussions: [
            {
                id: 2,
                user: 'mirrorMe',
                content: 'How is recursion more natural here than BFS?',
                timestamp: '2 days ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '32 ms',
                memory: '14.1 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def invertTree(root):\n    if not root:\n        return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
                explanation:
                    'Recursive swapping of left and right nodes at each level.',
            },
        ],
        companies: ['Google', 'Apple', 'Bloomberg'],
        frequency: '70%',
        acceptanceRate: 72.1,
        notes: 'Classic interview problem to test understanding of recursion in trees.',
    },
    {
        questionId: 'qbt003',
        title: 'Diameter of Binary Tree',
        shortDescription:
            'Find the longest path between any two nodes in a binary tree.',
        detailedDescription: `The diameter of a binary tree is the length of the longest path between any two nodes in a tree. The path may or may not pass through the root.

This problem is useful for practicing DFS and recursive height calculations.

Time complexity should be O(n) where n is the number of nodes.`,
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1',
        },
        solved: false,
        tags: ['Binary Tree', 'DFS', 'Recursion'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/diameter-of-binary-tree/solution/',
            description:
                'Shows how to use post-order traversal to track diameter and height.',
            videos: [
                {
                    title: 'Diameter of Binary Tree - Leetcode 543',
                    url: 'https://www.youtube.com/watch?v=Rezetez59Nk',
                    description:
                        'Walkthrough with tree drawing and recursive function.',
                },
            ],
        },
        testCases: [
            { input: 'root = [1,2,3,4,5]', output: '3' },
            { input: 'root = [1,2]', output: '1' },
        ],
        discussions: [
            {
                id: 3,
                user: 'dfsLearner',
                content: 'Why is post-order traversal used here?',
                timestamp: '4 days ago',
                replies: 6,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '50 ms',
                memory: '16.1 MB',
                status: 'Accepted',
                timestamp: '7 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def diameterOfBinaryTree(root):\n    diameter = 0\n    def height(node):\n        nonlocal diameter\n        if not node:\n            return 0\n        left, right = height(node.left), height(node.right)\n        diameter = max(diameter, left + right)\n        return 1 + max(left, right)\n    height(root)\n    return diameter`,
                explanation:
                    'Height helps calculate longest path between any two nodes.',
            },
        ],
        companies: ['Google', 'Microsoft', 'Amazon'],
        frequency: '65%',
        acceptanceRate: 46.4,
        notes: 'Understanding of tree height helps tackle this and related problems.',
    },
    {
        questionId: 'qbt004',
        title: 'Symmetric Tree',
        shortDescription: 'Check if a binary tree is a mirror of itself.',
        detailedDescription: `Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

The approach usually involves comparing the left and right subtrees recursively or using a queue iteratively.

Tests your ability to mirror logic and tree traversal with symmetry in mind.`,
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/symmetric-tree/',
        },
        solved: false,
        tags: ['Binary Tree', 'DFS', 'BFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/symmetric-tree/solution/',
            description: 'Both recursive and iterative comparisons explained.',
            videos: [
                {
                    title: 'Symmetric Tree - Leetcode 101',
                    url: 'https://www.youtube.com/watch?v=nKggNAiEpBE',
                    description:
                        'Easy to follow recursion and iterative symmetry check.',
                },
            ],
        },
        testCases: [
            { input: 'root = [1,2,2,3,4,4,3]', output: 'true' },
            { input: 'root = [1,2,2,null,3,null,3]', output: 'false' },
        ],
        discussions: [
            {
                id: 4,
                user: 'symmetryFan',
                content: 'How would you handle an iterative BFS approach?',
                timestamp: '6 hours ago',
                replies: 2,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '39 ms',
                memory: '14.5 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: `def isSymmetric(root):\n    def isMirror(t1, t2):\n        if not t1 and not t2:\n            return True\n        if not t1 or not t2:\n            return False\n        return t1.val == t2.val and \\\n               isMirror(t1.left, t2.right) and \\\n               isMirror(t1.right, t2.left)\n    return isMirror(root, root)`,
                explanation:
                    'Recursively compare mirrored nodes on both sides.',
            },
        ],
        companies: ['Google', 'LinkedIn', 'Adobe'],
        frequency: '71%',
        acceptanceRate: 56.7,
        notes: 'Popular tree symmetry check with multiple approaches.',
    },
    {
        questionId: 'qbt005',
        title: 'Path Sum',
        shortDescription:
            'Check if the tree has a root-to-leaf path with a given sum.',
        detailedDescription:
            'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.\n\nIntroduces the concept of tracking cumulative sum along recursive paths.',
        difficulty: 'easy',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/challenges/tree-path-sum/problem',
        },
        solved: false,
        tags: ['Binary Tree', 'DFS', 'Backtracking'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference: 'https://leetcode.com/problems/path-sum/solution/',
            description: 'Recursive DFS method with leaf condition check.',
            videos: [
                {
                    title: 'Path Sum - Leetcode 112',
                    url: 'https://www.youtube.com/watch?v=3B-2g7YpRBM',
                    description: 'Step-by-step explanation and dry run.',
                },
            ],
        },
        testCases: [
            {
                input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22',
                output: 'true',
            },
            { input: 'root = [1,2,3], targetSum = 5', output: 'false' },
        ],
        discussions: [
            {
                id: 7,
                user: 'sumSeeker',
                content: 'How to find all such paths instead of just one?',
                timestamp: '8 hours ago',
                replies: 4,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '40 ms',
                memory: '15.2 MB',
                status: 'Accepted',
                timestamp: '6 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def hasPathSum(root, targetSum):\n    if not root:\n        return False\n    if not root.left and not root.right:\n        return targetSum == root.val\n    return hasPathSum(root.left, targetSum - root.val) or hasPathSum(root.right, targetSum - root.val)',
                explanation:
                    'DFS subtracts value from target sum until leaf is reached.',
            },
        ],
        companies: ['Amazon', 'Bloomberg'],
        frequency: '79%',
        acceptanceRate: 51.3,
        notes: 'Expands on recursion with base case checks.',
    },
    {
        questionId: 'qbt006',
        title: 'Binary Tree Right Side View',
        shortDescription:
            'Return the values of the nodes visible from the right side.',
        detailedDescription:
            'Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.\n\nAn interesting variation of level-order traversal.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/binary-tree-right-side-view/',
        },
        solved: false,
        tags: ['Binary Tree', 'BFS', 'DFS'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/binary-tree-right-side-view/solution/',
            description: 'Uses BFS with tracking rightmost node per level.',
            videos: [
                {
                    title: 'Right Side View of Binary Tree - Leetcode 199',
                    url: 'https://www.youtube.com/watch?v=d4zLyf32e8I',
                    description:
                        'Simple BFS level-by-level traversal with rightmost capture.',
                },
            ],
        },
        testCases: [
            { input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]' },
            { input: 'root = [1,null,3]', output: '[1,3]' },
        ],
        discussions: [
            {
                id: 6,
                user: 'viewMaster',
                content: 'Could DFS be used here as well?',
                timestamp: '3 days ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '45 ms',
                memory: '14.3 MB',
                status: 'Accepted',
                timestamp: '7 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def rightSideView(root):\n    if not root:\n        return []\n    result = []\n    queue = [root]\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.pop(0)\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level[-1])\n    return result',
                explanation: 'Tracks last node in each level of BFS.',
            },
        ],
        companies: ['Amazon', 'Microsoft'],
        frequency: '67%',
        acceptanceRate: 58.4,
        notes: 'Great way to practice level-wise traversal and view-based logic.',
    },
    {
        questionId: 'qbt007',
        title: 'Convert Sorted Array to Binary Search Tree',
        shortDescription: 'Convert a sorted array into a height-balanced BST.',
        detailedDescription:
            'Given an integer array where elements are sorted in ascending order, convert it to a height-balanced binary search tree (BST).\n\nReinforces binary tree construction from array structures while maintaining balance.',
        difficulty: 'easy',
        platform: {
            name: 'hackerrank',
            link: 'https://www.hackerrank.com/challenges/sorted-array-to-binary-search-tree/problem',
        },
        solved: false,
        tags: ['Binary Tree', 'Recursion', 'Binary Search Tree'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/solution/',
            description:
                'Recursive mid-point division for balance preservation.',
            videos: [
                {
                    title: 'Convert Sorted Array to BST - Leetcode 108',
                    url: 'https://www.youtube.com/watch?v=9sw8RRsBw6s',
                    description: 'Step-by-step tree creation explanation.',
                },
            ],
        },
        testCases: [
            { input: 'nums = [-10,-3,0,5,9]', output: '[0,-3,9,-10,null,5]' },
            { input: 'nums = [1,3]', output: '[1,null,3]' },
        ],
        discussions: [
            {
                id: 7,
                user: 'balancedBST',
                content: 'Why is mid always chosen as root?',
                timestamp: '2 hours ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '55 ms',
                memory: '15.7 MB',
                status: 'Accepted',
                timestamp: '9 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def sortedArrayToBST(nums):\n    if not nums:\n        return None\n    mid = len(nums) // 2\n    root = TreeNode(nums[mid])\n    root.left = sortedArrayToBST(nums[:mid])\n    root.right = sortedArrayToBST(nums[mid+1:])\n    return root',
                explanation:
                    'Uses middle element recursively to maintain balance.',
            },
        ],
        companies: ['Amazon', 'LinkedIn'],
        frequency: '69%',
        acceptanceRate: 65.3,
        notes: 'Great for visualizing recursion and tree balance maintenance.',
    },
    {
        questionId: 'qbt008',
        title: 'Flatten Binary Tree to Linked List',
        shortDescription:
            'Flatten a binary tree into a linked list in-place following preorder traversal.',
        detailedDescription:
            'Given the root of a binary tree, flatten it into a linked list in-place. The linked list should use the right pointers to point to the next node in preorder traversal, and all left pointers should be null.\n\nTests tree manipulation and pointer reassignments.',
        difficulty: 'medium',
        platform: {
            name: 'gfg',
            link: 'https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1',
        },
        solved: false,
        tags: ['Binary Tree', 'DFS', 'In-place'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/solution/',
            description:
                'Uses recursion or iterative approach to rearrange pointers in preorder.',
            videos: [
                {
                    title: 'Flatten Binary Tree to Linked List - Leetcode 114',
                    url: 'https://www.youtube.com/watch?v=HhRlL7BXpFk',
                    description: 'In-place pointer rearrangement.',
                },
            ],
        },
        testCases: [
            {
                input: 'root = [1,2,5,3,4,null,6]',
                output: '[1,null,2,null,3,null,4,null,5,null,6]',
            },
            { input: 'root = []', output: '[]' },
        ],
        discussions: [
            {
                id: 11,
                user: 'pointerPro',
                content: 'How to do this without extra space?',
                timestamp: '6 hours ago',
                replies: 5,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Python',
                runtime: '50 ms',
                memory: '16 MB',
                status: 'Accepted',
                timestamp: '1 hour ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def flatten(root):\n    if not root:\n        return\n    flatten(root.left)\n    flatten(root.right)\n    temp = root.right\n    root.right = root.left\n    root.left = None\n    current = root\n    while current.right:\n        current = current.right\n    current.right = temp',
                explanation: 'Recursive postorder rearrangement of pointers.',
            },
        ],
        companies: ['Apple', 'Microsoft'],
        frequency: '70%',
        acceptanceRate: 57.6,
        notes: 'A classic in-place transformation problem that tests pointer manipulation skills.',
    },
    {
        questionId: 'qbt009',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        shortDescription:
            'Find the lowest common ancestor (LCA) of two nodes in a BST.',
        detailedDescription:
            'Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST. The LCA is defined as the lowest node in the tree that has both nodes as descendants.\n\nLeverages BST properties to efficiently find the LCA.',
        difficulty: 'easy',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
        },
        solved: false,
        tags: ['Binary Search Tree', 'Tree', 'Recursion'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/solution/',
            description:
                'Uses BST ordering to find LCA without full traversal.',
            videos: [
                {
                    title: 'LCA in BST - Leetcode 235',
                    url: 'https://www.youtube.com/watch?v=13m9ZCB8gjw',
                    description: 'BST-based efficient LCA search.',
                },
            ],
        },
        testCases: [
            {
                input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p=2, q=8',
                output: '6',
            },
            {
                input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p=2, q=4',
                output: '2',
            },
        ],
        discussions: [
            {
                id: 12,
                user: 'bstGuru',
                content: 'Can this be done iteratively?',
                timestamp: '2 days ago',
                replies: 3,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'Java',
                runtime: '30 ms',
                memory: '40 MB',
                status: 'Accepted',
                timestamp: '3 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'def lowestCommonAncestor(root, p, q):\n    while root:\n        if p.val > root.val and q.val > root.val:\n            root = root.right\n        elif p.val < root.val and q.val < root.val:\n            root = root.left\n        else:\n            return root',
                explanation:
                    'Traverse down the tree using BST properties to find the split point.',
            },
        ],
        companies: ['Google', 'Amazon', 'Microsoft'],
        frequency: '85%',
        acceptanceRate: 62.1,
        notes: 'Excellent practice for exploiting BST properties to solve ancestor queries efficiently.',
    },
    {
        questionId: 'qbt010',
        title: 'Binary Tree Level Order Traversal',
        shortDescription:
            'Return the level order traversal of a binary tree (breadth-first traversal).',
        detailedDescription:
            'Given a binary tree, return its nodes’ values level by level from left to right.\n\nThis problem helps understand BFS using queues on tree structures.',
        difficulty: 'medium',
        platform: {
            name: 'leetcode',
            link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        },
        solved: false,
        tags: ['Binary Tree', 'BFS', 'Queue'],
        supportedLanguages: ['python', 'javascript', 'java', 'c++'],
        editorial: {
            reference:
                'https://leetcode.com/problems/binary-tree-level-order-traversal/solution/',
            description:
                'Typical BFS approach using a queue to traverse level by level.',
            videos: [
                {
                    title: 'Binary Tree Level Order Traversal - Leetcode 102',
                    url: 'https://www.youtube.com/watch?v=Zh3YxF1CTfw',
                    description: 'Queue-based BFS level traversal.',
                },
            ],
        },
        testCases: [
            {
                input: 'root = [3,9,20,null,null,15,7]',
                output: '[[3],[9,20],[15,7]]',
            },
            { input: 'root = [1]', output: '[[1]]' },
        ],
        discussions: [
            {
                id: 10,
                user: 'levelExplorer',
                content: 'What if we want to reverse level order?',
                timestamp: '3 days ago',
                replies: 6,
            },
        ],
        submissions: [
            {
                id: 1,
                language: 'JavaScript',
                runtime: '60 ms',
                memory: '41 MB',
                status: 'Accepted',
                timestamp: '4 hours ago',
            },
        ],
        solutions: [
            {
                id:1,
                language: 'Python',
                code: 'from collections import deque\n\ndef levelOrder(root):\n    if not root:\n        return []\n    queue = deque([root])\n    result = []\n    while queue:\n        level_size = len(queue)\n        level_nodes = []\n        for _ in range(level_size):\n            node = queue.popleft()\n            level_nodes.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level_nodes)\n    return result',
                explanation: 'BFS queue traversal to collect nodes level-wise.',
            },
        ],
        companies: ['Facebook', 'Google', 'Amazon'],
        frequency: '82%',
        acceptanceRate: 64.9,
        notes: 'BFS is critical for many tree and graph problems.',
    },
];

export const questionsByTopics = {
    t001: arrayQuestions,
    t002: stringQuestions,
    t003: dPQuestions,
    t004: graphQuestions,
    t005: binaryTreeQuestions,
};
