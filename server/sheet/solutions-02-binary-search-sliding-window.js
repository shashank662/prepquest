// Striver's 180 — Binary Search (13) + Sliding Window and Two Pointers (9)
export default {

  // ── Binary Search › Binary Search ───────────────────────────────────────────

  'find-peak-element': {
    difficulty: 'Medium',
    statement: 'A peak element is strictly greater than its neighbours; treat nums[-1] and nums[n] as −∞. Given an array with no two adjacent elements equal, return the index of any peak in O(log n).',
    intuition: "Compare nums[mid] with nums[mid + 1]. If the next value is bigger, the array is going uphill to the right. Following the climb must reach a peak, at the latest at the right edge because of the −∞ boundary. So a peak exists in (mid, hi]. Otherwise mid itself or something to its left is a peak. Every step halves the range.",
    time: 'O(log n)',
    space: 'O(1)',
    code: `public class FindPeakElement {
    public static int findPeakElement(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        System.out.println(findPeakElement(new int[]{1, 2, 3, 1}));          // 2
        System.out.println(findPeakElement(new int[]{1, 2, 1, 3, 5, 6, 4})); // 5
        System.out.println(findPeakElement(new int[]{5, 4, 3}));             // 0
    }
}`,
  },

  'find-minimum-in-rotated-sorted-array': {
    difficulty: 'Medium',
    statement: 'A sorted array of unique integers has been rotated at an unknown pivot (e.g. [3,4,5,1,2]). Return its minimum element in O(log n).',
    intuition: "Compare nums[mid] to nums[hi]. If nums[mid] > nums[hi], the drop (and so the minimum) lies strictly to the right of mid. Otherwise mid..hi is sorted, and the minimum is mid or somewhere to its left, so shrink hi to mid. The loop ends with lo pointing at the minimum.",
    time: 'O(log n)',
    space: 'O(1)',
    code: `public class FindMinRotated {
    public static int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }

    public static void main(String[] args) {
        System.out.println(findMin(new int[]{3, 4, 5, 1, 2}));       // 1
        System.out.println(findMin(new int[]{4, 5, 6, 7, 0, 1, 2})); // 0
        System.out.println(findMin(new int[]{11, 13, 15, 17}));      // 11
    }
}`,
  },

  'search-in-rotated-sorted-array-2': {
    difficulty: 'Medium',
    statement: 'A sorted array that may contain duplicates has been rotated at an unknown pivot. Return true if target is in the array, otherwise false.',
    intuition: "At least one half around mid is always sorted. Check whether target falls inside that sorted half's range to decide which half to keep. Duplicates add one problem: if nums[lo] == nums[mid] == nums[hi], you can't tell which half is sorted. In that case shrink both ends by one and try again. That case can make the worst case O(n), for example [1,1,1,1,0,1,1].",
    time: 'O(log n) on average, O(n) worst case with many duplicates',
    space: 'O(1)',
    code: `public class SearchRotatedII {
    public static boolean search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) return true;
            if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }
            if (nums[lo] <= nums[mid]) {                       // left half sorted
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                           // right half sorted
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{2, 5, 6, 0, 0, 1, 2}, 0));    // true
        System.out.println(search(new int[]{2, 5, 6, 0, 0, 1, 2}, 3));    // false
        System.out.println(search(new int[]{1, 0, 1, 1, 1}, 0));          // true
    }
}`,
  },

  'single-element-in-sorted-array': {
    difficulty: 'Medium',
    statement: 'In a sorted array every element appears exactly twice except one, which appears once. Find that element in O(log n) time and O(1) space.',
    intuition: "Before the single element, each pair starts at an even index: (0,1), (2,3), … After it, pairs start at odd indices. Make mid even (subtract 1 if it is odd) and compare nums[mid] with nums[mid + 1]. If they are equal, the pairing is still intact, so the single element is to the right: lo = mid + 2. Otherwise it is at mid or to the left: hi = mid.",
    time: 'O(log n)',
    space: 'O(1)',
    code: `public class SingleElementSorted {
    public static int singleNonDuplicate(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (mid % 2 == 1) mid--;
            if (nums[mid] == nums[mid + 1]) lo = mid + 2;
            else hi = mid;
        }
        return nums[lo];
    }

    public static void main(String[] args) {
        System.out.println(singleNonDuplicate(new int[]{1, 1, 2, 3, 3, 4, 4, 8, 8})); // 2
        System.out.println(singleNonDuplicate(new int[]{3, 3, 7, 7, 10, 11, 11}));    // 10
        System.out.println(singleNonDuplicate(new int[]{5}));                          // 5
    }
}`,
  },

  'search-in-2d-matrix-ii': {
    difficulty: 'Medium',
    statement: 'Each row of an m × n matrix is sorted left to right and each column is sorted top to bottom. Return whether target exists in the matrix.',
    intuition: "Start at the top-right corner. Every value to its left is smaller and every value below it is larger, so each comparison removes a whole row or column. If the cell is bigger than target, move left. If smaller, move down. If equal, you've found it. At most m + n steps are taken.",
    time: 'O(m + n)',
    space: 'O(1)',
    code: `public class SearchMatrixII {
    public static boolean searchMatrix(int[][] m, int target) {
        int r = 0, c = m[0].length - 1;
        while (r < m.length && c >= 0) {
            if (m[r][c] == target) return true;
            if (m[r][c] > target) c--;
            else r++;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] m = {
            {1, 4, 7, 11, 15},
            {2, 5, 8, 12, 19},
            {3, 6, 9, 16, 22},
            {10, 13, 14, 17, 24},
            {18, 21, 23, 26, 30}
        };
        System.out.println(searchMatrix(m, 5));  // true
        System.out.println(searchMatrix(m, 20)); // false
        System.out.println(searchMatrix(m, 30)); // true
    }
}`,
  },

  'find-peak-element-ii': {
    difficulty: 'Medium',
    statement: 'In an m × n grid where no two adjacent cells are equal, a peak is strictly greater than its four neighbours (the border counts as −1). Return the position [row, col] of any peak in O(m log n) or O(n log m).',
    intuition: "Binary search on columns. For the middle column, find the row holding its maximum. That cell already beats its up and down neighbours. Now compare it with its left and right neighbours. If the right one is bigger, a peak exists in the right half, by the same uphill argument as 1D peak finding. If the left one is bigger, go left. Otherwise this cell is a peak.",
    time: 'O(m log n) — m to scan a column, log n columns',
    space: 'O(1)',
    code: `import java.util.*;

public class FindPeakGrid {
    public static int[] findPeakGrid(int[][] g) {
        int lo = 0, hi = g[0].length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1, row = 0;
            for (int r = 1; r < g.length; r++) if (g[r][mid] > g[row][mid]) row = r;
            int left  = mid > 0 ? g[row][mid - 1] : -1;
            int right = mid < g[0].length - 1 ? g[row][mid + 1] : -1;
            if (g[row][mid] > left && g[row][mid] > right) return new int[]{row, mid};
            if (right > g[row][mid]) lo = mid + 1;
            else hi = mid - 1;
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(findPeakGrid(new int[][]{{1, 4}, {3, 2}})));                     // [1, 0]
        System.out.println(Arrays.toString(findPeakGrid(new int[][]{{10, 20, 15}, {21, 30, 14}, {7, 16, 32}}))); // [1, 1]
    }
}`,
  },

  // ── Binary Search › Search on Answer ────────────────────────────────────────

  'find-nth-root-of-a-number': {
    difficulty: 'Easy',
    statement: 'Given two integers n and m, return the integer x such that xⁿ = m. If m has no integer nth root, return −1.',
    intuition: "x^n only grows as x grows, so binary search x in [1, m]. The only trap is overflow: computing mid^n directly can overflow a long. Multiply step by step and stop as soon as the product passes m. The helper returns whether mid^n is less than, equal to, or greater than m.",
    time: 'O(n · log m)',
    space: 'O(1)',
    code: `public class NthRoot {
    public static int nthRoot(int n, int m) {
        int lo = 1, hi = m;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            int cmp = compare(mid, n, m);
            if (cmp == 0) return mid;
            if (cmp < 0) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
    // -1 if x^n < m, 0 if equal, 1 if greater (stops early to avoid overflow)
    private static int compare(long x, int n, int m) {
        long p = 1;
        for (int i = 0; i < n; i++) {
            p *= x;
            if (p > m) return 1;
        }
        return p == m ? 0 : -1;
    }

    public static void main(String[] args) {
        System.out.println(nthRoot(3, 27));  // 3
        System.out.println(nthRoot(4, 69));  // -1
        System.out.println(nthRoot(2, 1));   // 1
    }
}`,
  },

  'koko-eating-bananas': {
    difficulty: 'Medium',
    statement: 'Koko has n piles of bananas and h hours. Each hour she picks one pile and eats k bananas from it (or the whole pile if it has fewer). Return the minimum integer speed k that lets her finish all piles within h hours.',
    intuition: "The hours needed, Σ ceil(pile / k), only goes down as k goes up. So feasibility is monotonic and we can binary search the answer between 1 and max(pile). For each candidate k, add up the hours. If they fit in h, try a smaller k, otherwise a larger one. ceil(a / b) is (a + b − 1) / b, and the total is summed in a long.",
    time: 'O(n · log max(pile))',
    space: 'O(1)',
    code: `public class KokoBananas {
    public static int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int k = (lo + hi) >>> 1;
            long hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) hi = k;
            else lo = k + 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        System.out.println(minEatingSpeed(new int[]{3, 6, 7, 11}, 8));        // 4
        System.out.println(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5));  // 30
        System.out.println(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 6));  // 23
    }
}`,
  },

  'aggressive-cows': {
    difficulty: 'Hard',
    statement: 'Given stall positions and k cows, place the cows in stalls so that the minimum distance between any two cows is as large as possible. Return that largest possible minimum distance.',
    intuition: "If a minimum gap d can be achieved, every smaller gap can be too. That makes feasibility monotonic, so binary search the largest workable d. To test d, sort the stalls and place cows greedily: put the first cow in the first stall, then each next cow in the first stall at least d away from the last one. d works if k cows get placed.",
    time: 'O(n log n + n · log(max − min))',
    space: 'O(1) besides sorting',
    code: `import java.util.*;

public class AggressiveCows {
    public static int maxMinDistance(int[] stalls, int k) {
        Arrays.sort(stalls);
        int lo = 1, hi = stalls[stalls.length - 1] - stalls[0], ans = 0;
        while (lo <= hi) {
            int d = (lo + hi) >>> 1;
            if (canPlace(stalls, k, d)) { ans = d; lo = d + 1; }
            else hi = d - 1;
        }
        return ans;
    }
    private static boolean canPlace(int[] s, int k, int d) {
        int placed = 1, last = s[0];
        for (int i = 1; i < s.length && placed < k; i++)
            if (s[i] - last >= d) { placed++; last = s[i]; }
        return placed >= k;
    }

    public static void main(String[] args) {
        System.out.println(maxMinDistance(new int[]{0, 3, 4, 7, 10, 9}, 4)); // 3
        System.out.println(maxMinDistance(new int[]{1, 2, 4, 8, 9}, 3));     // 3
        System.out.println(maxMinDistance(new int[]{1, 2, 3}, 2));           // 2
    }
}`,
  },

  'book-allocation-problem': {
    difficulty: 'Hard',
    statement: 'Given the page counts of n books in order and m students, give each student a contiguous block of at least one book so that every book is allocated. Minimise the maximum pages any student gets and return that value (−1 if m > n). This is the same problem as "Split Array Largest Sum".',
    intuition: "Binary search the answer: the smallest page limit L that lets the books be split into ≤ m blocks. L lies between max(pages), since a single book can't be split, and sum(pages). To test L, fill each student greedily and start a new student when adding the next book would exceed L. If that uses ≤ m students, L works, and so does any bigger L.",
    time: 'O(n · log(sum))',
    space: 'O(1)',
    code: `public class BookAllocation {
    public static int allocate(int[] pages, int m) {
        if (m > pages.length) return -1;
        int lo = 0, hi = 0;
        for (int p : pages) { lo = Math.max(lo, p); hi += p; }
        while (lo < hi) {
            int limit = (lo + hi) >>> 1;
            if (studentsNeeded(pages, limit) <= m) hi = limit;
            else lo = limit + 1;
        }
        return lo;
    }
    private static int studentsNeeded(int[] pages, int limit) {
        int students = 1, load = 0;
        for (int p : pages) {
            if (load + p > limit) { students++; load = 0; }
            load += p;
        }
        return students;
    }

    public static void main(String[] args) {
        System.out.println(allocate(new int[]{12, 34, 67, 90}, 2));         // 113
        System.out.println(allocate(new int[]{25, 46, 28, 49, 24}, 4));     // 71
        System.out.println(allocate(new int[]{7, 2, 5, 10, 8}, 2));         // 18
    }
}`,
  },

  'matrix-median': {
    difficulty: 'Medium',
    statement: 'Given an R × C matrix where every row is sorted and R·C is odd, return the median of all its elements, using less than O(R·C) time.',
    intuition: "Binary search on the value, not on positions. For a candidate x, count how many elements are ≤ x by running an upper-bound binary search on each row. The median is the smallest x with more than (R·C)/2 elements ≤ it. The search range is the smallest first-column value to the largest last-column value.",
    time: 'O(R · log C · log(max − min))',
    space: 'O(1)',
    code: `public class MatrixMedian {
    public static int median(int[][] m) {
        int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
        for (int[] row : m) { lo = Math.min(lo, row[0]); hi = Math.max(hi, row[row.length - 1]); }
        int need = m.length * m[0].length / 2;
        while (lo < hi) {
            int x = lo + (hi - lo) / 2;
            int cnt = 0;
            for (int[] row : m) cnt += upperBound(row, x);
            if (cnt <= need) lo = x + 1;
            else hi = x;
        }
        return lo;
    }
    // number of elements <= x in a sorted row
    private static int upperBound(int[] row, int x) {
        int lo = 0, hi = row.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (row[mid] <= x) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        System.out.println(median(new int[][]{{1, 3, 5}, {2, 6, 9}, {3, 6, 9}})); // 5
        System.out.println(median(new int[][]{{1}, {2}, {3}}));                   // 2
        System.out.println(median(new int[][]{{1, 1, 3, 3, 3}}));                 // 3
    }
}`,
  },

  // ── Binary Search › Partition Search ────────────────────────────────────────

  'kth-element-of-2-sorted-arrays': {
    difficulty: 'Hard',
    statement: 'Given two sorted arrays a and b and an integer k (1-based), return the element that would be at position k if both arrays were merged into one sorted array.',
    intuition: "Take cut elements from a and k − cut from b; these form the first k merged elements. The partition is valid when a[cut−1] ≤ b[k−cut] and b[k−cut−1] ≤ a[cut]. When it's valid, the kth element is the larger of the two left-side maxima. Binary search cut over the smaller array, clamped to [max(0, k − |b|), min(k, |a|)]. Use ±∞ for elements beyond the ends.",
    time: 'O(log min(n, m))',
    space: 'O(1)',
    code: `public class KthOfTwoSorted {
    public static int kthElement(int[] a, int[] b, int k) {
        if (a.length > b.length) return kthElement(b, a, k);
        int lo = Math.max(0, k - b.length), hi = Math.min(k, a.length);
        while (lo <= hi) {
            int cutA = (lo + hi) >>> 1, cutB = k - cutA;
            int l1 = cutA == 0 ? Integer.MIN_VALUE : a[cutA - 1];
            int l2 = cutB == 0 ? Integer.MIN_VALUE : b[cutB - 1];
            int r1 = cutA == a.length ? Integer.MAX_VALUE : a[cutA];
            int r2 = cutB == b.length ? Integer.MAX_VALUE : b[cutB];
            if (l1 <= r2 && l2 <= r1) return Math.max(l1, l2);
            if (l1 > r2) hi = cutA - 1;
            else lo = cutA + 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(kthElement(new int[]{2, 3, 6, 7, 9}, new int[]{1, 4, 8, 10}, 5));        // 6
        System.out.println(kthElement(new int[]{100, 112, 256, 349, 770}, new int[]{72, 86, 113, 119, 265, 445, 892}, 7)); // 256
        System.out.println(kthElement(new int[]{1}, new int[]{2, 3}, 1));                          // 1
    }
}`,
  },

  'median-of-2-sorted-arrays': {
    difficulty: 'Hard',
    statement: 'Given two sorted arrays of sizes m and n, return the median of the combined data in O(log(min(m, n))) time.',
    intuition: "Split both arrays into a left and a right part so the left parts together hold half the elements: cutA + cutB = (m + n + 1) / 2. The split is right when every left element is ≤ every right element, which means maxLeftA ≤ minRightB and maxLeftB ≤ minRightA. Binary search cutA over the smaller array. If the total length is odd, the median is max(left maxima). If even, it's the average of max(left) and min(right).",
    time: 'O(log min(m, n))',
    space: 'O(1)',
    code: `public class MedianTwoSorted {
    public static double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length, half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int cutA = (lo + hi) >>> 1, cutB = half - cutA;
            int l1 = cutA == 0 ? Integer.MIN_VALUE : a[cutA - 1];
            int l2 = cutB == 0 ? Integer.MIN_VALUE : b[cutB - 1];
            int r1 = cutA == m ? Integer.MAX_VALUE : a[cutA];
            int r2 = cutB == n ? Integer.MAX_VALUE : b[cutB];
            if (l1 <= r2 && l2 <= r1) {
                if ((m + n) % 2 == 1) return Math.max(l1, l2);
                return (Math.max(l1, l2) + (double) Math.min(r1, r2)) / 2.0;
            }
            if (l1 > r2) hi = cutA - 1;
            else lo = cutA + 1;
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1, 3}, new int[]{2}));        // 2.0
        System.out.println(findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4}));     // 2.5
        System.out.println(findMedianSortedArrays(new int[]{}, new int[]{7}));            // 7.0
    }
}`,
  },

  // ── Sliding Window and Two Pointers › Sliding Window ────────────────────────

  'longest-substring-without-repeating-characters': {
    difficulty: 'Medium',
    statement: 'Given a string s, return the length of the longest substring that contains no repeated characters.',
    intuition: "Keep a window [l, r] with no repeated characters, and remember the last index where each character appeared. When s[r] was already seen inside the window, jump l to just past that earlier occurrence. l only moves forward, which is why the max(...) is needed. The window length r − l + 1 after each step is a candidate answer.",
    time: 'O(n)',
    space: 'O(σ) — one slot per character (256 here)',
    code: `import java.util.*;

public class LongestUniqueSubstring {
    public static int lengthOfLongestSubstring(String s) {
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int best = 0, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            l = Math.max(l, last[c] + 1);
            last[c] = r;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // 1
        System.out.println(lengthOfLongestSubstring("pwwkew"));   // 3
        System.out.println(lengthOfLongestSubstring("abba"));     // 2
    }
}`,
  },

  'maximum-points-you-can-obtain-from-cards-': {
    difficulty: 'Medium',
    statement: 'Cards are in a row with point values. In one move you take a card from either the left end or the right end. After exactly k moves, return the maximum total points you can have.',
    intuition: "Any valid pick is some i cards from the left plus k − i from the right, for i from 0 to k. Start with all k from the left. Then, one step at a time, give back the innermost left card and take one more from the right end, updating the sum in O(1). The best of these k + 1 sums is the answer. Equivalently, you are minimising the middle window of n − k cards that you leave behind.",
    time: 'O(k)',
    space: 'O(1)',
    code: `public class MaxPointsFromCards {
    public static int maxScore(int[] cards, int k) {
        int sum = 0, n = cards.length;
        for (int i = 0; i < k; i++) sum += cards[i];
        int best = sum;
        for (int i = 1; i <= k; i++) {
            sum += cards[n - i] - cards[k - i];
            best = Math.max(best, sum);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxScore(new int[]{1, 2, 3, 4, 5, 6, 1}, 3));  // 12
        System.out.println(maxScore(new int[]{2, 2, 2}, 2));              // 4
        System.out.println(maxScore(new int[]{9, 7, 7, 9, 7, 7, 9}, 7));  // 55
    }
}`,
  },

  'max-consecutive-ones-iii': {
    difficulty: 'Medium',
    statement: 'Given a binary array and an integer k, return the maximum number of consecutive 1s you can get if you may flip at most k 0s to 1.',
    intuition: "This asks for the longest window containing at most k zeros. Grow r and count the zeros. When zeros exceeds k, move l forward by one. Because the window is shifted rather than shrunk, its size never goes down, so the final size r − l is the best length seen. This saves a max() on every step.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class MaxConsecutiveOnesIII {
    public static int longestOnes(int[] nums, int k) {
        int l = 0, r = 0, zeros = 0;
        for (; r < nums.length; r++) {
            if (nums[r] == 0) zeros++;
            if (zeros > k) {                // slide instead of shrink
                if (nums[l] == 0) zeros--;
                l++;
            }
        }
        return r - l;
    }

    public static void main(String[] args) {
        System.out.println(longestOnes(new int[]{1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0}, 2));                   // 6
        System.out.println(longestOnes(new int[]{0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1}, 3)); // 10
        System.out.println(longestOnes(new int[]{0, 0, 0}, 0));                                           // 0
    }
}`,
  },

  'longest-repeating-character-replacement': {
    difficulty: 'Medium',
    statement: 'Given an uppercase string s and an integer k, you may change at most k characters to any other uppercase letter. Return the length of the longest substring of identical letters you can get.',
    intuition: "A window can be made uniform if its length minus the count of its most frequent letter is ≤ k. Grow r and track maxFreq, the highest letter count seen in any window. If the window becomes invalid, slide l forward by one. maxFreq never needs to go down: only a larger maxFreq can produce a longer answer, so a stale value is harmless.",
    time: 'O(n)',
    space: 'O(26)',
    code: `public class CharacterReplacement {
    public static int characterReplacement(String s, int k) {
        int[] cnt = new int[26];
        int l = 0, maxFreq = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            maxFreq = Math.max(maxFreq, ++cnt[s.charAt(r) - 'A']);
            while (r - l + 1 - maxFreq > k) cnt[s.charAt(l++) - 'A']--;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(characterReplacement("ABAB", 2));     // 4
        System.out.println(characterReplacement("AABABBA", 1));  // 4
        System.out.println(characterReplacement("AAAA", 0));     // 4
    }
}`,
  },

  'longest-substring-with-at-most-k-distinct-characters': {
    difficulty: 'Medium',
    statement: 'Given a string s and an integer k, return the length of the longest substring that contains at most k distinct characters.',
    intuition: "Sliding window with a frequency map. Add s[r]. While the map holds more than k distinct keys, remove s[l] and move l forward, deleting keys whose count drops to zero. The window is then valid, so compare its length with the best so far.",
    time: 'O(n)',
    space: 'O(k) — at most k + 1 keys in the map',
    code: `import java.util.*;

public class AtMostKDistinct {
    public static int longest(String s, int k) {
        Map<Character, Integer> freq = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            freq.merge(s.charAt(r), 1, Integer::sum);
            while (freq.size() > k) {
                char c = s.charAt(l++);
                if (freq.merge(c, -1, Integer::sum) == 0) freq.remove(c);
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longest("eceba", 2));     // 3
        System.out.println(longest("aa", 1));        // 2
        System.out.println(longest("aaabbccd", 2));  // 5
        System.out.println(longest("abc", 0));       // 0
    }
}`,
  },

  'minimum-window-substring-': {
    difficulty: 'Hard',
    statement: 'Given strings s and t, return the shortest substring of s that contains every character of t, including duplicates. Return "" if there is none.',
    intuition: "Count what t needs, and track `missing`, the number of characters still required. Grow r: if s[r] was still needed, decrement missing. When missing hits 0 the window is valid, so shrink from the left while it stays valid, recording the smallest window. Then drop one needed character to make it invalid again. Using a single `need` array, where negative means surplus, keeps each step O(1).",
    time: 'O(|s| + |t|)',
    space: 'O(σ) — 128-entry count array',
    code: `public class MinimumWindowSubstring {
    public static String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), l = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) missing--;
            while (missing == 0) {
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
                if (++need[s.charAt(l++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // BANC
        System.out.println(minWindow("a", "a"));               // a
        System.out.println("[" + minWindow("a", "aa") + "]");  // []
    }
}`,
  },

  // ── Sliding Window and Two Pointers › Counting Windows ──────────────────────

  'number-of-substrings-containing-all-three-characters': {
    difficulty: 'Medium',
    statement: "Given a string of only 'a', 'b' and 'c', return the number of substrings that contain at least one of each character.",
    intuition: "For each right end r, a substring s[i..r] is valid when i ≤ the smallest of the last positions of 'a', 'b' and 'c'. So the number of valid substrings ending at r is min(lastA, lastB, lastC) + 1, or 0 if some letter hasn't appeared yet. Add this up for every r.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class SubstringsWithAllThree {
    public static int numberOfSubstrings(String s) {
        int[] last = {-1, -1, -1};
        int res = 0;
        for (int r = 0; r < s.length(); r++) {
            last[s.charAt(r) - 'a'] = r;
            res += Math.min(last[0], Math.min(last[1], last[2])) + 1;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(numberOfSubstrings("abcabc")); // 10
        System.out.println(numberOfSubstrings("aaacb"));  // 3
        System.out.println(numberOfSubstrings("abc"));    // 1
    }
}`,
  },

  'binary-subarrays-with-sum': {
    difficulty: 'Medium',
    statement: 'Given a binary array and an integer goal, return the number of non-empty contiguous subarrays whose sum equals goal.',
    intuition: "Counting windows with sum exactly goal is awkward, but counting windows with sum at most goal is easy. For each r, shrink l until the sum is ≤ goal, then every start from l to r is valid, adding r − l + 1. Then exactly(goal) = atMost(goal) − atMost(goal − 1). Return 0 when goal is negative.",
    time: 'O(n) — two linear passes',
    space: 'O(1)',
    code: `public class BinarySubarraysWithSum {
    public static int numSubarraysWithSum(int[] nums, int goal) {
        return atMost(nums, goal) - atMost(nums, goal - 1);
    }
    private static int atMost(int[] nums, int goal) {
        if (goal < 0) return 0;
        int l = 0, sum = 0, res = 0;
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r];
            while (sum > goal) sum -= nums[l++];
            res += r - l + 1;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(numSubarraysWithSum(new int[]{1, 0, 1, 0, 1}, 2)); // 4
        System.out.println(numSubarraysWithSum(new int[]{0, 0, 0, 0, 0}, 0)); // 15
        System.out.println(numSubarraysWithSum(new int[]{1, 1, 1}, 4));       // 0
    }
}`,
  },

  'count-number-of-nice-subarrays': {
    difficulty: 'Medium',
    statement: 'A subarray is "nice" if it contains exactly k odd numbers. Given an integer array and k, return the number of nice subarrays.',
    intuition: "Replace every number with 1 if it is odd and 0 if even, and this becomes Binary Subarrays With Sum = k. Use the same trick: exactly(k) = atMost(k) − atMost(k − 1), where atMost counts windows with at most k odd numbers using a shrinking sliding window.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class NiceSubarrays {
    public static int numberOfSubarrays(int[] nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }
    private static int atMost(int[] nums, int k) {
        if (k < 0) return 0;
        int l = 0, odd = 0, res = 0;
        for (int r = 0; r < nums.length; r++) {
            odd += nums[r] & 1;
            while (odd > k) odd -= nums[l++] & 1;
            res += r - l + 1;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(numberOfSubarrays(new int[]{1, 1, 2, 1, 1}, 3));                    // 2
        System.out.println(numberOfSubarrays(new int[]{2, 4, 6}, 1));                          // 0
        System.out.println(numberOfSubarrays(new int[]{2, 2, 2, 1, 2, 2, 1, 2, 2, 2}, 2));     // 16
    }
}`,
  },
};
