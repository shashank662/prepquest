export const batch3 = [
  // ─── Sorting (9) ────────────────────────────────────────────────────────────
  {
    topic: 'Sorting',
    title: 'Merge Sort',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/merge-sort/',
    statement: 'Implement Merge Sort to sort an array in ascending order. Constraints: 1 <= N <= 10^5; values fit in int.',
    intuition: 'Divide the array in half recursively until each sub-array has one element, then merge pairs of sorted sub-arrays. The merge step scans both halves with two pointers, always picking the smaller element. Stable and guaranteed O(N log N) in all cases.',
    time_complexity: 'O(N log N) — log N levels of division, each with O(N) merge.',
    space_complexity: 'O(N) — temporary array for merging.',
    code: `import java.util.Arrays;

public class MergeSort {
    static void mergeSort(int[] arr, int lo, int hi) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(arr, lo, mid);
        mergeSort(arr, mid + 1, hi);
        merge(arr, lo, mid, hi);
    }

    static void merge(int[] arr, int lo, int mid, int hi) {
        int[] tmp = Arrays.copyOfRange(arr, lo, hi + 1);
        int i = 0, j = mid - lo + 1, k = lo;
        int leftEnd = mid - lo, rightEnd = hi - lo;
        while (i <= leftEnd && j <= rightEnd) {
            if (tmp[i] <= tmp[j]) arr[k++] = tmp[i++];
            else arr[k++] = tmp[j++];
        }
        while (i <= leftEnd) arr[k++] = tmp[i++];
        while (j <= rightEnd) arr[k++] = tmp[j++];
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a)); // [3, 9, 10, 27, 38, 43, 82]

        int[] b = {5, 1, 4, 2, 8};
        mergeSort(b, 0, b.length - 1);
        System.out.println(Arrays.toString(b)); // [1, 2, 4, 5, 8]

        int[] c = {1};
        mergeSort(c, 0, 0);
        System.out.println(Arrays.toString(c)); // [1]
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Quick Sort',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/quick-sort/',
    statement: 'Implement Quick Sort using the last element as pivot. Sort the array in-place in ascending order. Constraints: 1 <= N <= 10^5.',
    intuition: 'Pick the last element as pivot. Partition: scan left to right, and whenever we find an element <= pivot, swap it into the left region (tracked by index i). After scanning, place the pivot at i+1. Recurse on left and right sub-arrays. Average case O(N log N) but O(N²) worst case on sorted input.',
    time_complexity: 'O(N log N) average, O(N²) worst case.',
    space_complexity: 'O(log N) average stack space for recursion.',
    code: `import java.util.Arrays;

public class QuickSort {
    static void quickSort(int[] arr, int lo, int hi) {
        if (lo < hi) {
            int pi = partition(arr, lo, hi);
            quickSort(arr, lo, pi - 1);
            quickSort(arr, pi + 1, hi);
        }
    }

    static int partition(int[] arr, int lo, int hi) {
        int pivot = arr[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (arr[j] <= pivot) {
                i++;
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
        }
        int tmp = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = tmp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] a = {10, 7, 8, 9, 1, 5};
        quickSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a)); // [1, 5, 7, 8, 9, 10]

        int[] b = {64, 25, 12, 22, 11};
        quickSort(b, 0, b.length - 1);
        System.out.println(Arrays.toString(b)); // [11, 12, 22, 25, 64]
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Count Inversions in an Array',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/counting-inversions/',
    statement: 'Given an array of N integers, count the number of inversions. A pair (i, j) is an inversion if i < j and arr[i] > arr[j]. Constraints: 1 <= N <= 5*10^4; values fit in int.',
    intuition: 'Augment Merge Sort. During the merge step, whenever we pick an element from the right sub-array before elements in the left sub-array, all remaining elements in the left sub-array form inversions with it. Add (mid - i + 1) to the count at each such pick.',
    time_complexity: 'O(N log N) — merge sort with O(1) extra work per comparison.',
    space_complexity: 'O(N) — temporary merge array.',
    code: `import java.util.Arrays;

public class CountInversions {
    static long mergeCount(int[] arr, int lo, int hi) {
        if (lo >= hi) return 0;
        int mid = lo + (hi - lo) / 2;
        long count = mergeCount(arr, lo, mid) + mergeCount(arr, mid + 1, hi);
        int[] tmp = Arrays.copyOfRange(arr, lo, hi + 1);
        int i = 0, j = mid - lo + 1, k = lo;
        int leftEnd = mid - lo, rightEnd = hi - lo;
        while (i <= leftEnd && j <= rightEnd) {
            if (tmp[i] <= tmp[j]) arr[k++] = tmp[i++];
            else {
                count += (leftEnd - i + 1); // all remaining left elements form inversions
                arr[k++] = tmp[j++];
            }
        }
        while (i <= leftEnd) arr[k++] = tmp[i++];
        while (j <= rightEnd) arr[k++] = tmp[j++];
        return count;
    }

    public static void main(String[] args) {
        System.out.println(mergeCount(new int[]{2,4,1,3,5}, 0, 4)); // 3
        System.out.println(mergeCount(new int[]{5,4,3,2,1}, 0, 4)); // 10
        System.out.println(mergeCount(new int[]{1,2,3,4,5}, 0, 4)); // 0
        System.out.println(mergeCount(new int[]{1,20,6,4,5}, 0, 4)); // 5
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Sort an Array of 0s, 1s and 2s (Dutch National Flag)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/',
    statement: 'Given an array containing only 0s, 1s, and 2s, sort it in-place in one pass without using extra space or built-in sort. Constraints: 1 <= N <= 10^6.',
    intuition: 'Dutch National Flag algorithm: maintain three pointers lo, mid, hi. lo tracks the boundary of 0s, hi tracks 2s, mid is the current element. If arr[mid]=0 swap with lo and advance both; if 2 swap with hi and advance hi back; if 1 just advance mid. Continue until mid > hi.',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1) — in-place.',
    code: `import java.util.Arrays;

public class DutchNationalFlag {
    static void sort012(int[] arr) {
        int lo = 0, mid = 0, hi = arr.length - 1;
        while (mid <= hi) {
            if (arr[mid] == 0) {
                int tmp = arr[lo]; arr[lo] = arr[mid]; arr[mid] = tmp;
                lo++; mid++;
            } else if (arr[mid] == 1) {
                mid++;
            } else {
                int tmp = arr[hi]; arr[hi] = arr[mid]; arr[mid] = tmp;
                hi--;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {0,1,2,0,1,2,1};
        sort012(a);
        System.out.println(Arrays.toString(a)); // [0, 0, 1, 1, 1, 2, 2]

        int[] b = {2,0,1};
        sort012(b);
        System.out.println(Arrays.toString(b)); // [0, 1, 2]

        int[] c = {0,0,0};
        sort012(c);
        System.out.println(Arrays.toString(c)); // [0, 0, 0]
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Find the Median of Two Sorted Arrays',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/median-of-two-sorted-arrays/',
    statement: 'Given two sorted arrays of sizes M and N, find the median of the combined sorted array. Constraints: 0 <= M, N <= 10^6; M + N >= 1.',
    intuition: 'Binary search on the partition of the smaller array. Partition so that the left halves together contain exactly (M+N+1)/2 elements. A valid partition satisfies maxLeftA <= minRightB and maxLeftB <= minRightA. The median is then determined by the boundary values. This is the classic O(log(min(M,N))) approach.',
    time_complexity: 'O(log(min(M, N))) — binary search on smaller array.',
    space_complexity: 'O(1).',
    code: `public class MedianTwoSorted {
    static double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length;
        int lo = 0, hi = m, half = (m + n + 1) / 2;
        while (lo <= hi) {
            int p1 = lo + (hi - lo) / 2;
            int p2 = half - p1;
            int maxLA = (p1 == 0) ? Integer.MIN_VALUE : a[p1 - 1];
            int minRA = (p1 == m) ? Integer.MAX_VALUE : a[p1];
            int maxLB = (p2 == 0) ? Integer.MIN_VALUE : b[p2 - 1];
            int minRB = (p2 == n) ? Integer.MAX_VALUE : b[p2];
            if (maxLA <= minRB && maxLB <= minRA) {
                if ((m + n) % 2 == 1) return Math.max(maxLA, maxLB);
                return (Math.max(maxLA, maxLB) + Math.min(minRA, minRB)) / 2.0;
            } else if (maxLA > minRB) hi = p1 - 1;
            else lo = p1 + 1;
        }
        throw new IllegalArgumentException("Arrays not sorted");
    }

    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1,3}, new int[]{2}));     // 2.0
        System.out.println(findMedianSortedArrays(new int[]{1,2}, new int[]{3,4}));   // 2.5
        System.out.println(findMedianSortedArrays(new int[]{0,0}, new int[]{0,0}));   // 0.0
        System.out.println(findMedianSortedArrays(new int[]{}, new int[]{1}));        // 1.0
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Meeting Rooms II — Minimum Rooms Required',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/minimum-number-meeting-rooms-required/',
    statement: 'Given N meeting intervals [start, end], find the minimum number of meeting rooms required so no two meetings in the same room overlap. Constraints: 1 <= N <= 10^5; 0 <= start < end <= 10^6.',
    intuition: 'Sort start times and end times separately. Use two pointers: if the next meeting starts before the earliest ending meeting finishes, we need a new room (rooms++). Otherwise, the earliest room frees up (advance end pointer). This greedy pass finds the maximum overlap at any point.',
    time_complexity: 'O(N log N) — sorting dominates.',
    space_complexity: 'O(N) — two separate sorted arrays.',
    code: `import java.util.Arrays;

public class MeetingRooms {
    static int minRooms(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
        Arrays.sort(starts);
        Arrays.sort(ends);
        int rooms = 0, endPtr = 0;
        for (int i = 0; i < n; i++) {
            if (starts[i] < ends[endPtr]) rooms++;
            else endPtr++;
        }
        return rooms;
    }

    public static void main(String[] args) {
        System.out.println(minRooms(new int[][]{{0,30},{5,10},{15,20}})); // 2
        System.out.println(minRooms(new int[][]{{7,10},{2,4}}));           // 1
        System.out.println(minRooms(new int[][]{{1,5},{2,6},{3,7}}));      // 3
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Chocolate Distribution Problem',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/chocolate-distribution-problem/',
    statement: 'Given an array of N chocolate packet sizes and M students, distribute M packets to M students such that the difference between the maximum and minimum chocolates given is minimized. Each student gets exactly one packet. Constraints: M <= N.',
    intuition: 'Sort the array. The answer is the minimum (arr[i+M-1] - arr[i]) over all valid windows of size M. After sorting, the smallest range of M consecutive elements gives the tightest spread.',
    time_complexity: 'O(N log N) — dominated by sorting.',
    space_complexity: 'O(1) — excluding sort overhead.',
    code: `import java.util.Arrays;

public class ChocolateDistribution {
    static int minDiff(int[] arr, int m) {
        if (m == 0 || arr.length == 0) return 0;
        Arrays.sort(arr);
        int minDiff = Integer.MAX_VALUE;
        for (int i = 0; i + m - 1 < arr.length; i++)
            minDiff = Math.min(minDiff, arr[i + m - 1] - arr[i]);
        return minDiff;
    }

    public static void main(String[] args) {
        System.out.println(minDiff(new int[]{3,4,1,9,56,7,9,12}, 5)); // 6  (1,3,4,7,9 -> 9-3=6? or 3,4,7,9,9 -> 6)
        System.out.println(minDiff(new int[]{7,3,2,4,9,12,56}, 3));   // 2  (2,3,4 -> 2)
        System.out.println(minDiff(new int[]{3,4,1,9,56,7,9,12}, 5)); // 6
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Radix Sort',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/radix-sort/',
    statement: 'Implement Radix Sort for a non-negative integer array. Sort in-place (or with minimal extra space). Constraints: all values non-negative; 1 <= N <= 10^5.',
    intuition: 'Sort digit by digit from least significant to most significant using a stable counting sort at each digit position. Because counting sort is stable, the relative order from previous digit sorts is preserved. With base 10 and max D digits, this runs in O(D*N).',
    time_complexity: 'O(D * N) where D = number of digits in max element. For bounded integers D is constant → O(N).',
    space_complexity: 'O(N + 10) — output array plus 10-bucket count array.',
    code: `import java.util.Arrays;

public class RadixSort {
    static void countSort(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10];
        for (int v : arr) count[(v / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[--count[digit]] = arr[i];
        }
        System.arraycopy(output, 0, arr, 0, n);
    }

    static void radixSort(int[] arr) {
        int max = Arrays.stream(arr).max().orElse(0);
        for (int exp = 1; max / exp > 0; exp *= 10)
            countSort(arr, exp);
    }

    public static void main(String[] args) {
        int[] a = {170, 45, 75, 90, 802, 24, 2, 66};
        radixSort(a);
        System.out.println(Arrays.toString(a)); // [2, 24, 45, 66, 75, 90, 170, 802]

        int[] b = {3, 6, 8, 10, 17, 2, 13};
        radixSort(b);
        System.out.println(Arrays.toString(b)); // [2, 3, 6, 8, 10, 13, 17]
    }
}`
  },
  {
    topic: 'Sorting',
    title: 'Minimum Swaps to Sort an Array',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/minimum-number-swaps-required-sort-array/',
    statement: 'Given an array of N distinct integers, find the minimum number of swaps required to sort it. Constraints: 1 <= N <= 10^5; all elements distinct.',
    intuition: 'Model as a graph: each element should be at its sorted position. Find cycles in the permutation graph. Each cycle of length L requires L-1 swaps to fix. Total swaps = sum of (cycleLength - 1) across all cycles. Use a sorted copy to map values to their target positions.',
    time_complexity: 'O(N log N) — sorting to get target positions.',
    space_complexity: 'O(N) — visited array and index map.',
    code: `import java.util.*;

public class MinSwapsToSort {
    static int minSwaps(int[] arr) {
        int n = arr.length;
        int[][] indexed = new int[n][2];
        for (int i = 0; i < n; i++) { indexed[i][0] = arr[i]; indexed[i][1] = i; }
        Arrays.sort(indexed, (a, b) -> a[0] - b[0]);
        boolean[] visited = new boolean[n];
        int swaps = 0;
        for (int i = 0; i < n; i++) {
            if (visited[i] || indexed[i][1] == i) { visited[i] = true; continue; }
            int cycleLen = 0, j = i;
            while (!visited[j]) { visited[j] = true; j = indexed[j][1]; cycleLen++; }
            swaps += (cycleLen - 1);
        }
        return swaps;
    }

    public static void main(String[] args) {
        System.out.println(minSwaps(new int[]{4, 3, 2, 1})); // 2
        System.out.println(minSwaps(new int[]{1, 5, 4, 3, 2})); // 2
        System.out.println(minSwaps(new int[]{1, 2, 3, 4, 5})); // 0
    }
}`
  },

  // ─── Stack (5) ──────────────────────────────────────────────────────────────
  {
    topic: 'Stack',
    title: 'Balanced Parentheses',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/',
    statement: 'Given a string of parentheses (, ), {, }, [, ], check whether it is balanced. Every opening bracket must be closed by the same type in the correct order. Constraints: 1 <= |s| <= 10^5.',
    intuition: 'Use a stack. For each opening bracket, push it. For each closing bracket, check if the stack top is the matching opener — if yes pop, if no (or empty) it\'s unbalanced. At the end, the stack must be empty for the string to be balanced.',
    time_complexity: 'O(N) — one pass through the string.',
    space_complexity: 'O(N) — worst case all openers on the stack.',
    code: `import java.util.Deque;
import java.util.ArrayDeque;

public class BalancedParentheses {
    static boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isBalanced("()[]{}"));   // true
        System.out.println(isBalanced("([{}])"));   // true
        System.out.println(isBalanced("(]"));       // false
        System.out.println(isBalanced("([)]"));     // false
        System.out.println(isBalanced("{[]}"));     // true
        System.out.println(isBalanced(""));         // true
    }
}`
  },
  {
    topic: 'Stack',
    title: 'Next Greater Element',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/next-greater-element/',
    statement: 'For each element in an array, find the next greater element to its right. If none exists, output -1. Constraints: 1 <= N <= 10^5; values fit in int.',
    intuition: 'Process from right to left using a stack of "candidates." For each element, pop the stack while the top is <= current element (they can\'t be the answer for current). The next greater is the new top (or -1 if empty). Push current element onto the stack.',
    time_complexity: 'O(N) — each element pushed and popped at most once.',
    space_complexity: 'O(N) — stack and output array.',
    code: `import java.util.*;

public class NextGreaterElement {
    static int[] nextGreater(int[] arr) {
        int n = arr.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // stores values
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= arr[i]) stack.pop();
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(arr[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{4,5,2,25}))); // [5, 25, 25, -1]
        System.out.println(Arrays.toString(nextGreater(new int[]{13,7,6,12}))); // [-1, 12, 12, -1]
        System.out.println(Arrays.toString(nextGreater(new int[]{1,2,3,4,5}))); // [2, 3, 4, 5, -1]
    }
}`
  },
  {
    topic: 'Stack',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/largest-rectangle-under-histogram/',
    statement: 'Given an array heights[] representing the heights of histogram bars (each of width 1), find the area of the largest rectangle that can be formed. Constraints: 1 <= N <= 10^5; 0 <= heights[i] <= 10^4.',
    intuition: 'Use a monotonically increasing stack of indices. For each bar, while the stack top has height > current bar, pop it and calculate the area it can form: height = heights[popped], width = current index - new stack top - 1 (or current index if stack empty). Track the max area.',
    time_complexity: 'O(N) — each bar pushed and popped at most once.',
    space_complexity: 'O(N) — the stack.',
    code: `import java.util.Deque;
import java.util.ArrayDeque;

public class LargestRectangleHistogram {
    static int largestRectangle(int[] heights) {
        int n = heights.length, maxArea = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }

    public static void main(String[] args) {
        System.out.println(largestRectangle(new int[]{2,1,5,6,2,3})); // 10
        System.out.println(largestRectangle(new int[]{2,4}));          // 4
        System.out.println(largestRectangle(new int[]{6,2,5,4,5,1,6})); // 12
        System.out.println(largestRectangle(new int[]{1,1,1,1,1}));   // 5
    }
}`
  },
  {
    topic: 'Stack',
    title: 'Stock Span Problem',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/the-stock-span-problem/',
    statement: 'Given the daily prices of a stock, compute the span for each day. The span on day i is the maximum number of consecutive days (ending at day i) where the price is <= price[i]. Constraints: 1 <= N <= 10^5.',
    intuition: 'Use a stack of indices. For each day i, pop while the stack top\'s price is <= price[i]. The span = i - stack.top (or i+1 if empty). Push i. This way, the stack maintains indices of previous "barrier" days where prices were higher.',
    time_complexity: 'O(N) — each index pushed/popped at most once.',
    space_complexity: 'O(N) — stack.',
    code: `import java.util.*;

public class StockSpan {
    static int[] stockSpan(int[] prices) {
        int n = prices.length;
        int[] span = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // indices
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && prices[stack.peek()] <= prices[i]) stack.pop();
            span[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
            stack.push(i);
        }
        return span;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(stockSpan(new int[]{100,80,60,70,60,75,85}))); // [1, 1, 1, 2, 1, 4, 6]
        System.out.println(Arrays.toString(stockSpan(new int[]{10,4,5,90,120,80})));       // [1, 1, 2, 4, 5, 1]
    }
}`
  },
  {
    topic: 'Stack',
    title: 'Implement a Queue using Stacks',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/queue-using-stacks/',
    statement: 'Implement a FIFO queue using only two stacks. Support enqueue(x) and dequeue() operations. Amortize dequeue to O(1).',
    intuition: 'Keep two stacks: inbox (for enqueues) and outbox (for dequeues). On dequeue, if outbox is empty, pour all of inbox into outbox (reversing order). Now outbox.pop() gives the oldest element. Each element moves from inbox to outbox at most once, so amortized O(1) per dequeue.',
    time_complexity: 'O(1) amortized per operation.',
    space_complexity: 'O(N) — two stacks hold N elements total.',
    code: `import java.util.Deque;
import java.util.ArrayDeque;

public class QueueUsingStacks {
    Deque<Integer> inbox = new ArrayDeque<>();
    Deque<Integer> outbox = new ArrayDeque<>();

    void enqueue(int x) { inbox.push(x); }

    int dequeue() {
        if (outbox.isEmpty()) {
            while (!inbox.isEmpty()) outbox.push(inbox.pop());
        }
        if (outbox.isEmpty()) throw new RuntimeException("Queue is empty");
        return outbox.pop();
    }

    boolean isEmpty() { return inbox.isEmpty() && outbox.isEmpty(); }

    public static void main(String[] args) {
        QueueUsingStacks q = new QueueUsingStacks();
        q.enqueue(1); q.enqueue(2); q.enqueue(3);
        System.out.println(q.dequeue()); // 1
        System.out.println(q.dequeue()); // 2
        q.enqueue(4);
        System.out.println(q.dequeue()); // 3
        System.out.println(q.dequeue()); // 4
        System.out.println(q.isEmpty()); // true
    }
}`
  },

  // ─── Queue (5) ──────────────────────────────────────────────────────────────
  {
    topic: 'Queue',
    title: 'Implement a Stack using Queues',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/implement-stack-using-queue/',
    statement: 'Implement a LIFO stack using only one or two queues. Support push(x), pop(), and top() operations. Make push() O(N) and pop() O(1).',
    intuition: 'Use a single queue. On push(x), enqueue x then rotate all previously enqueued elements to the back by dequeue+enqueue N-1 times. Now x is at the front — the next pop() will return it immediately. This mirrors stack LIFO behavior with queue primitives.',
    time_complexity: 'O(N) push, O(1) pop and top.',
    space_complexity: 'O(N) — one queue holding all elements.',
    code: `import java.util.LinkedList;
import java.util.Queue;

public class StackUsingQueue {
    Queue<Integer> q = new LinkedList<>();

    void push(int x) {
        q.add(x);
        int size = q.size();
        while (size-- > 1) q.add(q.poll()); // rotate x to front
    }

    int pop() { return q.poll(); }

    int top() { return q.peek(); }

    boolean isEmpty() { return q.isEmpty(); }

    public static void main(String[] args) {
        StackUsingQueue s = new StackUsingQueue();
        s.push(1); s.push(2); s.push(3);
        System.out.println(s.top());  // 3
        System.out.println(s.pop());  // 3
        System.out.println(s.pop());  // 2
        s.push(4);
        System.out.println(s.pop());  // 4
        System.out.println(s.pop());  // 1
        System.out.println(s.isEmpty()); // true
    }
}`
  },
  {
    topic: 'Queue',
    title: 'First Negative Number in Every Window of Size K',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/first-negative-integer-every-window-size-k/',
    statement: 'Given an array and a window size K, for each window of size K, find the first negative number. If no negative exists in a window, output 0. Constraints: 1 <= K <= N <= 10^5.',
    intuition: 'Use a deque (double-ended queue) of indices of negative numbers. Slide the window: add the new element\'s index if it\'s negative. Remove front indices that are outside the window. The front of the deque is the first negative in the current window.',
    time_complexity: 'O(N) — each element processed at most twice.',
    space_complexity: 'O(K) — deque holds at most K indices.',
    code: `import java.util.*;

public class FirstNegativeWindow {
    static long[] firstNegative(long[] arr, int k) {
        int n = arr.length;
        long[] result = new long[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();
        // Fill first window
        for (int i = 0; i < k; i++) if (arr[i] < 0) deque.addLast(i);
        for (int i = k; i <= n; i++) {
            result[i - k] = deque.isEmpty() ? 0 : arr[deque.peekFirst()];
            if (i < n) {
                if (arr[i] < 0) deque.addLast(i);
                if (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(firstNegative(new long[]{-8,-5,-3,2,6,-5,-1,-1,-1,-3}, 2)));
        // [-8, -5, -3, 0, -5, -5, -1, -1, -1]
        System.out.println(Arrays.toString(firstNegative(new long[]{12,-1,-7,8,-15,30,16,28}, 3)));
        // [-1, -1, -7, -15, -15, 0]
    }
}`
  },
  {
    topic: 'Queue',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/sliding-window-maximum-maximum-of-all-subarrays-of-size-k/',
    statement: 'Given an array and integer K, find the maximum in each sliding window of size K. Return the array of maximums. Constraints: 1 <= K <= N <= 10^5; values fit in int.',
    intuition: 'Use a monotonic deque (decreasing from front to back) of indices. For each new element, pop from the back while the back element is <= new element (it can never be the max). Pop from the front when the index falls outside the window. The front is always the current window maximum.',
    time_complexity: 'O(N) — each element pushed and popped at most once.',
    space_complexity: 'O(K) — deque holds at most K elements.',
    code: `import java.util.*;

public class SlidingWindowMax {
    static int[] maxSlidingWindow(int[] arr, int k) {
        int n = arr.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // stores indices
        for (int i = 0; i < n; i++) {
            // Remove indices outside window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) deque.pollFirst();
            // Remove smaller elements from back
            while (!deque.isEmpty() && arr[deque.peekLast()] <= arr[i]) deque.pollLast();
            deque.addLast(i);
            if (i >= k - 1) result[i - k + 1] = arr[deque.peekFirst()];
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));
        // [3, 3, 5, 5, 6, 7]
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1}, 1)));
        // [1]
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{9,11}, 2)));
        // [11]
    }
}`
  },
  {
    topic: 'Queue',
    title: 'Generate Binary Numbers from 1 to N using Queue',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/interesting-method-generate-binary-numbers-1-n/',
    statement: 'Given N, generate all binary representations of numbers from 1 to N as strings. Constraints: 1 <= N <= 10^6.',
    intuition: 'Start a queue with "1". For each dequeued string s, it represents the current number. Append "0" and "1" to s to get the next two numbers\' binary representations and enqueue them. Process N times. This BFS-like generation builds binary numbers level by level.',
    time_complexity: 'O(N log N) — each of N numbers has O(log N) digits.',
    space_complexity: 'O(N) — queue holds up to N+1 strings at a time.',
    code: `import java.util.*;

public class BinaryNumbersQueue {
    static String[] generateBinary(int n) {
        String[] result = new String[n];
        Queue<String> queue = new LinkedList<>();
        queue.add("1");
        for (int i = 0; i < n; i++) {
            result[i] = queue.poll();
            queue.add(result[i] + "0");
            queue.add(result[i] + "1");
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(generateBinary(5)));
        // [1, 10, 11, 100, 101]
        System.out.println(Arrays.toString(generateBinary(10)));
        // [1, 10, 11, 100, 101, 110, 111, 1000, 1001, 1010]
    }
}`
  },
  {
    topic: 'Queue',
    title: 'Circular Tour (Petrol Pump Problem)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-a-tour-that-visits-all-stations/',
    statement: 'Given N petrol pumps on a circular route, each with petrol[i] available and distance[i] to the next pump (consuming distance[i] units), find the starting pump index from which you can complete the full circle. Guaranteed one solution exists. Constraints: 1 <= N <= 10^5.',
    intuition: 'Track cumulative surplus (petrol - distance). If at any point it goes negative, the starting point cannot be any pump visited so far — reset start to the next pump and reset the current sum. Separately track total surplus. If total >= 0, a solution exists (guaranteed by the problem).',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1).',
    code: `public class CircularTour {
    static int[] petrol, distance;

    static int findStart(int[] p, int[] d) {
        int n = p.length, start = 0, curr = 0, total = 0;
        for (int i = 0; i < n; i++) {
            int diff = p[i] - d[i];
            curr += diff;
            total += diff;
            if (curr < 0) { start = i + 1; curr = 0; }
        }
        return (total >= 0) ? start : -1;
    }

    public static void main(String[] args) {
        System.out.println(findStart(new int[]{4,6,7,4}, new int[]{6,5,3,5})); // 1
        // Start at 1: 6-5=1, +7-3=5, +4-5=4, +4-6=2 >= 0, complete circle

        System.out.println(findStart(new int[]{6,3,7}, new int[]{4,6,3})); // 2
        // Start at 2: 7-3=4, +6-4=6, +3-6=3 >= 0

        System.out.println(findStart(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2})); // 3
    }
}`
  }
];
