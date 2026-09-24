// Striver's 180 — Arrays (12) + Hashing (5)
export default {

  // ── Arrays › Linear Scan ────────────────────────────────────────────────────

  'majority-element-i': {
    difficulty: 'Easy',
    statement: 'Given an array of n integers, return the element that appears more than n/2 times. You may assume such an element always exists.',
    intuition: "Boyer–Moore voting: keep a candidate and a counter. A matching element adds a vote and a different element cancels one. When the counter hits 0, the next element becomes the new candidate. Because the majority element outnumbers all the others combined, it can never be fully cancelled out, so it is the candidate left at the end.",
    time: 'O(n) — single pass',
    space: 'O(1) — candidate + counter',
    code: `public class MajorityElement {
    public static int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }

    public static void main(String[] args) {
        System.out.println(majorityElement(new int[]{3, 2, 3}));             // 3
        System.out.println(majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2})); // 2
        System.out.println(majorityElement(new int[]{7}));                   // 7
    }
}`,
  },

  "kadane's-algorithm": {
    difficulty: 'Medium',
    statement: 'Given an integer array (it may contain negatives), find the contiguous non-empty subarray with the largest sum and return that sum.',
    intuition: "At each index, decide whether to extend the best subarray ending at the previous index or start fresh at this element: cur = max(x, cur + x). A running prefix with a negative sum can only drag later sums down, so it gets dropped. Track the best cur seen. Starting from nums[0] (not 0) handles all-negative arrays correctly.",
    time: 'O(n) — single pass',
    space: 'O(1)',
    code: `public class KadanesAlgorithm {
    public static int maxSubArray(int[] nums) {
        int best = nums[0], cur = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
        System.out.println(maxSubArray(new int[]{-3, -1, -2}));                    // -1
        System.out.println(maxSubArray(new int[]{5, 4, -1, 7, 8}));                // 23
    }
}`,
  },

  'majority-element-ii': {
    difficulty: 'Medium',
    statement: 'Given an integer array of size n, return all elements that appear more than ⌊n/3⌋ times (there can be at most two such elements).',
    intuition: "Extended Boyer–Moore: at most two values can exceed n/3, so keep two candidates with two counters. A match adds a vote to its candidate. An empty slot takes the new value. Anything else cancels one vote from both, which removes three distinct values at once. The survivors are only candidates, so a second pass counts them and keeps the ones that really exceed n/3.",
    time: 'O(n) — two passes',
    space: 'O(1) — excluding the output',
    code: `import java.util.*;

public class MajorityElementII {
    public static List<Integer> majorityElement(int[] nums) {
        int c1 = 0, c2 = 1, n1 = 0, n2 = 0;          // distinct placeholders
        for (int x : nums) {
            if (x == c1) n1++;
            else if (x == c2) n2++;
            else if (n1 == 0) { c1 = x; n1 = 1; }
            else if (n2 == 0) { c2 = x; n2 = 1; }
            else { n1--; n2--; }
        }
        n1 = 0; n2 = 0;
        for (int x : nums) {
            if (x == c1) n1++;
            else if (x == c2) n2++;
        }
        List<Integer> res = new ArrayList<>();
        if (n1 > nums.length / 3) res.add(c1);
        if (n2 > nums.length / 3) res.add(c2);
        Collections.sort(res);
        return res;
    }

    public static void main(String[] args) {
        System.out.println(majorityElement(new int[]{3, 2, 3}));                // [3]
        System.out.println(majorityElement(new int[]{1, 2}));                   // [1, 2]
        System.out.println(majorityElement(new int[]{1, 1, 1, 3, 3, 2, 2, 2})); // [1, 2]
    }
}`,
  },

  'maximum-product-subarray-in-an-array': {
    difficulty: 'Medium',
    statement: 'Given an integer array, find the contiguous non-empty subarray with the largest product and return that product.',
    intuition: "A negative number flips the biggest product into the smallest and the smallest into the biggest. So track both the max and the min product ending at each index. When the current number is negative, swap them before extending. A zero resets both, because max(x, ...) and min(x, ...) restart the subarray at the next element.",
    time: 'O(n) — single pass',
    space: 'O(1)',
    code: `public class MaxProductSubarray {
    public static int maxProduct(int[] nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            if (x < 0) { int t = hi; hi = lo; lo = t; }
            hi = Math.max(x, hi * x);
            lo = Math.min(x, lo * x);
            best = Math.max(best, hi);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxProduct(new int[]{2, 3, -2, 4}));    // 6
        System.out.println(maxProduct(new int[]{-2, 0, -1}));      // 0
        System.out.println(maxProduct(new int[]{-2, 3, -4}));      // 24
    }
}`,
  },

  // ── Arrays › Two Pointers ───────────────────────────────────────────────────

  "sort-an-array-of-0's-1's-and-2's": {
    difficulty: 'Medium',
    statement: 'Given an array containing only 0s, 1s and 2s, sort it in place in a single pass without using a library sort (the Dutch National Flag problem).',
    intuition: "Keep three regions: [0, low) holds 0s, [low, mid) holds 1s, and (high, end] holds 2s. Look at nums[mid]. A 0 is swapped into the low region and both low and mid advance. A 1 is already in place, so only mid advances. A 2 is swapped to the high end and high shrinks, but mid stays because the swapped-in value hasn't been looked at yet.",
    time: 'O(n) — one pass',
    space: 'O(1) — in place',
    code: `import java.util.*;

public class SortColors {
    public static void sortColors(int[] a) {
        int low = 0, mid = 0, high = a.length - 1;
        while (mid <= high) {
            if (a[mid] == 0)      swap(a, low++, mid++);
            else if (a[mid] == 1) mid++;
            else                  swap(a, mid, high--);
        }
    }
    private static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0};
        sortColors(a);
        System.out.println(Arrays.toString(a)); // [0, 0, 1, 1, 2, 2]
        int[] b = {2, 0, 1};
        sortColors(b);
        System.out.println(Arrays.toString(b)); // [0, 1, 2]
    }
}`,
  },

  '3-sum': {
    difficulty: 'Medium',
    statement: 'Given an integer array, return all unique triplets [a, b, c] (from distinct indices) such that a + b + c = 0. The result must not contain duplicate triplets.',
    intuition: "Sort the array, then fix the first element i and solve two-sum on the rest with two pointers. If the sum is too small move left right, if it is too big move right left, and on a hit record it and move both. Duplicates are avoided by skipping equal values: skip a repeated nums[i], and after a hit skip repeated left/right values. Once nums[i] > 0 no triplet can sum to 0, so stop.",
    time: 'O(n²) — n fixed elements × O(n) two-pointer scan',
    space: 'O(1) extra besides the sort and output',
    code: `import java.util.*;

public class ThreeSum {
    public static List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2 && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                }
            }
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1, 0, 1, 2, -1, -4})); // [[-1, -1, 2], [-1, 0, 1]]
        System.out.println(threeSum(new int[]{0, 0, 0, 0}));          // [[0, 0, 0]]
        System.out.println(threeSum(new int[]{0, 1, 1}));             // []
    }
}`,
  },

  'next-permutation': {
    difficulty: 'Medium',
    statement: 'Rearrange an array of integers into the next lexicographically greater permutation, in place. If it is already the largest permutation, rearrange it into the smallest (ascending order).',
    intuition: "Scan from the right for the first index i where a[i] < a[i+1]. Everything after i is in descending order, so that suffix is already at its largest. To get the next permutation, bump a[i] up by the smallest possible amount: swap it with the rightmost element of the suffix that is greater than it. Then reverse the suffix so it becomes ascending (its smallest arrangement). If no such i exists, the whole array is descending, so reverse all of it.",
    time: 'O(n)',
    space: 'O(1) — in place',
    code: `import java.util.*;

public class NextPermutation {
    public static void nextPermutation(int[] a) {
        int i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i >= 0) {
            int j = a.length - 1;
            while (a[j] <= a[i]) j--;
            swap(a, i, j);
        }
        for (int l = i + 1, r = a.length - 1; l < r; l++, r--) swap(a, l, r);
    }
    private static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        int[] a = {1, 2, 3};    nextPermutation(a); System.out.println(Arrays.toString(a)); // [1, 3, 2]
        int[] b = {3, 2, 1};    nextPermutation(b); System.out.println(Arrays.toString(b)); // [1, 2, 3]
        int[] c = {1, 3, 5, 4, 2}; nextPermutation(c); System.out.println(Arrays.toString(c)); // [1, 4, 2, 3, 5]
    }
}`,
  },

  '4-sum': {
    difficulty: 'Medium',
    statement: 'Given an integer array and a target, return all unique quadruplets [a, b, c, d] from distinct indices whose sum equals the target.',
    intuition: "This is 3-Sum with one more fixed index. Sort, fix i and j with two nested loops, and use two pointers for the remaining pair. Skip duplicate values at every level so each quadruplet appears once. Add the numbers as a long, because four ints can overflow.",
    time: 'O(n³) — n² fixed pairs × O(n) scan',
    space: 'O(1) extra besides the sort and output',
    code: `import java.util.*;

public class FourSum {
    public static List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;
        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                int l = j + 1, r = n - 1;
                while (l < r) {
                    long sum = (long) nums[i] + nums[j] + nums[l] + nums[r];
                    if (sum < target) l++;
                    else if (sum > target) r--;
                    else {
                        res.add(Arrays.asList(nums[i], nums[j], nums[l], nums[r]));
                        while (l < r && nums[l] == nums[l + 1]) l++;
                        while (l < r && nums[r] == nums[r - 1]) r--;
                        l++; r--;
                    }
                }
            }
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(fourSum(new int[]{1, 0, -1, 0, -2, 2}, 0)); // [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
        System.out.println(fourSum(new int[]{2, 2, 2, 2, 2}, 8));      // [[2, 2, 2, 2]]
    }
}`,
  },

  'merge-two-sorted-arrays-without-extra-space': {
    difficulty: 'Easy',
    statement: 'Given two sorted arrays nums1 and nums2, merge them into one sorted array stored in nums1, in place. nums1 has length m + n: its first m slots hold its elements and the last n slots are 0s as spare room. nums2 has length n.',
    intuition: "Merging from the front would overwrite nums1 values that haven't been placed yet. Merge from the back instead: fill nums1 from index m + n − 1 downwards, each time writing the larger of the two current tails. The write index is always at or past the unread part of nums1, so nothing is lost. When nums2 is used up, the rest of nums1 is already in place. (A harder variant keeps the two arrays separate with no spare room. That one uses the gap method from Shell sort in O((n+m) log(n+m)).)",
    time: 'O(m + n) — one pass from the back',
    space: 'O(1)',
    code: `import java.util.*;

public class MergeSortedArrays {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else                               nums1[k--] = nums2[j--];
        }
    }

    public static void main(String[] args) {
        int[] a = {-5, -2, 4, 5, 0, 0, 0};
        merge(a, 4, new int[]{-3, 1, 8}, 3);
        System.out.println(Arrays.toString(a)); // [-5, -3, -2, 1, 4, 5, 8]
        int[] b = {0, 2, 7, 8, 0, 0, 0};
        merge(b, 4, new int[]{-7, -3, -1}, 3);
        System.out.println(Arrays.toString(b)); // [-7, -3, -1, 0, 2, 7, 8]
        int[] c = {1, 0};
        merge(c, 1, new int[]{0}, 1);
        System.out.println(Arrays.toString(c)); // [0, 1]
    }
}`,
  },

  'trapping-rainwater': {
    difficulty: 'Hard',
    statement: 'Given n non-negative integers representing an elevation map where each bar has width 1, compute how much rain water can be trapped between the bars.',
    intuition: "Water above bar i is min(maxLeft, maxRight) − height[i]. Two pointers get this without prefix arrays. Keep leftMax and rightMax and always move the side with the smaller height. If height[l] <= height[r], a right wall at least as tall as height[l] exists, so water at l is limited only by leftMax. Add leftMax − height[l] and move l forward. The right side is symmetric.",
    time: 'O(n) — one pass with two pointers',
    space: 'O(1)',
    code: `public class TrappingRainWater {
    public static int trap(int[] h) {
        int l = 0, r = h.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (h[l] <= h[r]) {
                leftMax = Math.max(leftMax, h[l]);
                water += leftMax - h[l++];
            } else {
                rightMax = Math.max(rightMax, h[r]);
                water += rightMax - h[r--];
            }
        }
        return water;
    }

    public static void main(String[] args) {
        System.out.println(trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1})); // 6
        System.out.println(trap(new int[]{4, 2, 0, 3, 2, 5}));                   // 9
        System.out.println(trap(new int[]{1, 2, 3}));                            // 0
    }
}`,
  },

  // ── Arrays › Divide and Conquer ─────────────────────────────────────────────

  'count-inversions': {
    difficulty: 'Medium',
    statement: 'Given an array, count the inversions: pairs (i, j) with i < j and a[i] > a[j].',
    intuition: "Piggy-back on merge sort. When merging two sorted halves, if left[i] > right[j], then every element from left[i] to the end of the left half is also greater than right[j]. That adds (mid − i + 1) inversions in one step. Sum these counts across all merges. Every inversion is counted exactly once, at the merge where its two elements first meet.",
    time: 'O(n log n) — merge sort',
    space: 'O(n) — merge buffer',
    code: `public class CountInversions {
    public static long countInversions(int[] a) {
        return sort(a.clone(), new int[a.length], 0, a.length - 1);
    }
    private static long sort(int[] a, int[] tmp, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = (lo + hi) / 2;
        long cnt = sort(a, tmp, lo, mid) + sort(a, tmp, mid + 1, hi);
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else { cnt += mid - i + 1; tmp[k++] = a[j++]; }
        }
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi)  tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
        return cnt;
    }

    public static void main(String[] args) {
        System.out.println(countInversions(new int[]{2, 4, 1, 3, 5})); // 3
        System.out.println(countInversions(new int[]{5, 4, 3, 2, 1})); // 10
        System.out.println(countInversions(new int[]{1, 2, 3}));       // 0
    }
}`,
  },

  'reverse-pairs': {
    difficulty: 'Hard',
    statement: 'Given an integer array, return the number of reverse pairs: pairs (i, j) with i < j and nums[i] > 2 · nums[j].',
    intuition: "Same idea as counting inversions, but the counting condition (a > 2b) is different from the merging condition (a > b). So count in a separate step before merging. Both halves are sorted, so for each i in the left half, move a pointer j through the right half while nums[i] > 2·nums[j]. j never moves backwards, so counting is linear per merge. Then merge normally. Use long for 2·nums[j] to avoid overflow.",
    time: 'O(n log n)',
    space: 'O(n) — merge buffer',
    code: `public class ReversePairs {
    public static int reversePairs(int[] nums) {
        return sort(nums.clone(), new int[nums.length], 0, nums.length - 1);
    }
    private static int sort(int[] a, int[] tmp, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = (lo + hi) / 2;
        int cnt = sort(a, tmp, lo, mid) + sort(a, tmp, mid + 1, hi);
        for (int i = lo, j = mid + 1; i <= mid; i++) {
            while (j <= hi && a[i] > 2L * a[j]) j++;
            cnt += j - (mid + 1);
        }
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi)  tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo + 1);
        return cnt;
    }

    public static void main(String[] args) {
        System.out.println(reversePairs(new int[]{1, 3, 2, 3, 1}));    // 2
        System.out.println(reversePairs(new int[]{2, 4, 3, 5, 1}));    // 3
        System.out.println(reversePairs(new int[]{2147483647, 2147483647, 2147483647})); // 0
    }
}`,
  },

  // ── Hashing › Hashing & Prefix Sums ─────────────────────────────────────────

  'two-sum': {
    difficulty: 'Easy',
    statement: 'Given an integer array and a target, return the indices of the two numbers that add up to the target. Exactly one solution exists and the same element may not be used twice.',
    intuition: "Walk the array once with a HashMap from value to index. For each x, the partner it needs is target − x. If the partner has already been seen, return both indices. Otherwise store x. Checking before inserting stops an element from pairing with itself.",
    time: 'O(n) — one pass with O(1) map lookups',
    space: 'O(n) — the map',
    code: `import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));      // [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6)));         // [0, 1]
    }
}`,
  },

  'longest-consecutive-sequence-in-an-array': {
    difficulty: 'Medium',
    statement: 'Given an unsorted integer array, return the length of the longest run of consecutive integers (e.g. 1, 2, 3, 4) that can be formed from its elements, in O(n) time.',
    intuition: "Put everything in a HashSet. A number x starts a sequence only if x − 1 is not in the set. From each start, count upward x+1, x+2, … while they exist. Each number is visited at most twice: once in the outer loop and once while counting up from its sequence's start. That keeps the total linear.",
    time: 'O(n) — each element is visited a constant number of times',
    space: 'O(n) — the set',
    code: `import java.util.*;

public class LongestConsecutiveSequence {
    public static int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue;          // not a sequence start
            int len = 1;
            while (set.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));          // 4
        System.out.println(longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));  // 9
        System.out.println(longestConsecutive(new int[]{}));                             // 0
    }
}`,
  },

  'longest-subarray-with-sum-k': {
    difficulty: 'Medium',
    statement: 'Given an integer array (which may contain negatives and zeros) and an integer k, return the length of the longest contiguous subarray whose sum equals k.',
    intuition: "Let prefix be the running sum up to index i. A subarray (j, i] sums to k exactly when prefix[j] = prefix − k. Store the first index at which each prefix sum appears. Keeping the earliest index gives the longest subarray, so never overwrite an entry. Seed the map with {0: −1} so subarrays starting at index 0 are counted. If every number is positive, a sliding window also works in O(1) space, but the prefix map handles negatives too.",
    time: 'O(n)',
    space: 'O(n) — map of prefix sums',
    code: `import java.util.*;

public class LongestSubarraySumK {
    public static int longestSubarray(int[] nums, int k) {
        Map<Long, Integer> first = new HashMap<>();
        first.put(0L, -1);
        long prefix = 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            prefix += nums[i];
            Integer j = first.get(prefix - k);
            if (j != null) best = Math.max(best, i - j);
            first.putIfAbsent(prefix, i);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestSubarray(new int[]{10, 5, 2, 7, 1, 9}, 15));  // 4
        System.out.println(longestSubarray(new int[]{-3, 2, 1}, 6));            // 0
        System.out.println(longestSubarray(new int[]{1, -1, 5, -2, 3}, 3));     // 4
    }
}`,
  },

  'count-subarrays-with-given-sum': {
    difficulty: 'Medium',
    statement: 'Given an integer array and an integer k, return the number of contiguous subarrays whose sum equals k.',
    intuition: "A subarray ending at i sums to k when some earlier prefix sum equals prefix − k. Keep a HashMap from each prefix sum to how many times it has appeared. At each index, add count[prefix − k] to the answer, then record the current prefix. Seed with {0: 1} for subarrays starting at index 0. This works with negative numbers, where a sliding window does not.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class CountSubarraysSumK {
    public static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);
        int prefix = 0, res = 0;
        for (int x : nums) {
            prefix += x;
            res += count.getOrDefault(prefix - k, 0);
            count.merge(prefix, 1, Integer::sum);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{1, 1, 1}, 2));          // 2
        System.out.println(subarraySum(new int[]{1, 2, 3}, 3));          // 2
        System.out.println(subarraySum(new int[]{3, 4, 7, 2, -3, 1, 4, 2}, 7)); // 4
    }
}`,
  },

  'count-subarrays-with-given-xor-k': {
    difficulty: 'Medium',
    statement: 'Given an integer array and an integer k, count the contiguous subarrays whose bitwise XOR equals k.',
    intuition: "Same pattern as counting subarrays with sum k, with XOR in place of addition. If px is the prefix XOR up to i, a subarray (j, i] has XOR k exactly when prefixXor[j] = px ^ k, because XOR undoes itself. Keep a frequency map of prefix XORs seeded with {0: 1} and add freq[px ^ k] at each step.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class CountSubarraysXorK {
    public static int subarraysWithXor(int[] a, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int px = 0, res = 0;
        for (int x : a) {
            px ^= x;
            res += freq.getOrDefault(px ^ k, 0);
            freq.merge(px, 1, Integer::sum);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(subarraysWithXor(new int[]{4, 2, 2, 6, 4}, 6));  // 4
        System.out.println(subarraysWithXor(new int[]{5, 6, 7, 8, 9}, 5));  // 2
        System.out.println(subarraysWithXor(new int[]{1, 2, 3}, 0));        // 1
    }
}`,
  },
};
