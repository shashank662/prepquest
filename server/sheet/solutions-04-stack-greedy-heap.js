// Striver's 180 — Stack and Queues (14) + Greedy Algorithms (8) + Heaps (5)
export default {

  // ── Stack and Queues › Monotonic Stack / Queue ──────────────────────────────

  'next-greater-element': {
    difficulty: 'Medium',
    statement: 'Given an array, return for each element its next greater element: the nearest element to its right that is strictly larger. Use −1 when there is none.',
    intuition: "Scan from right to left while keeping a stack of candidates in decreasing order from bottom to top. For arr[i], pop every value ≤ arr[i]: they are hidden behind arr[i] and can never be the answer for anything further left. Whatever remains on top is the next greater element. Then push arr[i]. Each element is pushed and popped at most once.",
    time: 'O(n) — amortised, each index pushed/popped once',
    space: 'O(n) — the stack',
    code: `import java.util.*;

public class NextGreaterElement {
    public static int[] nextGreater(int[] arr) {
        int n = arr.length;
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && st.peek() <= arr[i]) st.pop();
            res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(arr[i]);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{1, 3, 2, 4})));      // [3, 4, 4, -1]
        System.out.println(Arrays.toString(nextGreater(new int[]{6, 8, 0, 1, 3})));   // [8, -1, 1, 3, -1]
        System.out.println(Arrays.toString(nextGreater(new int[]{5, 5, 5})));         // [-1, -1, -1]
    }
}`,
  },

  'next-greater-element---2': {
    difficulty: 'Medium',
    statement: 'Given a circular array (the element after the last one is the first), return the next greater element for every element, searching clockwise. Use −1 when none exists.',
    intuition: "Handle the wrap-around by pretending the array is written out twice. Run the usual right-to-left monotonic stack over indices 2n − 1 down to 0, reading arr[i % n]. The first pass (i ≥ n) only fills the stack with the elements that come 'after the wrap'. The second pass (i < n) records answers.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class NextGreaterElementII {
    public static int[] nextGreaterCircular(int[] arr) {
        int n = arr.length;
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 2 * n - 1; i >= 0; i--) {
            int x = arr[i % n];
            while (!st.isEmpty() && st.peek() <= x) st.pop();
            if (i < n) res[i] = st.isEmpty() ? -1 : st.peek();
            st.push(x);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreaterCircular(new int[]{3, 10, 4, 2, 1, 2, 6, 1, 7, 2, 9}))); // [10, -1, 6, 6, 2, 6, 7, 7, 9, 9, 10]
        System.out.println(Arrays.toString(nextGreaterCircular(new int[]{1, 2, 1})));                          // [2, -1, 2]
    }
}`,
  },

  'stock-span-problem': {
    difficulty: 'Medium',
    statement: "Given daily stock prices, compute each day's span: the number of consecutive days ending today (including today) on which the price was less than or equal to today's price.",
    intuition: "The span is the distance back to the previous strictly greater price, so this is 'previous greater element'. Keep a stack of indices whose prices are decreasing. For day i, pop indices with price ≤ arr[i], since they are covered by today. The span is i − (index now on top), or i + 1 if the stack is empty.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class StockSpan {
    public static int[] stockSpan(int[] arr) {
        int[] span = new int[arr.length];
        Deque<Integer> st = new ArrayDeque<>();               // indices, prices decreasing
        for (int i = 0; i < arr.length; i++) {
            while (!st.isEmpty() && arr[st.peek()] <= arr[i]) st.pop();
            span[i] = st.isEmpty() ? i + 1 : i - st.peek();
            st.push(i);
        }
        return span;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(stockSpan(new int[]{120, 100, 60, 80, 90, 110, 115}))); // [1, 1, 1, 2, 3, 5, 6]
        System.out.println(Arrays.toString(stockSpan(new int[]{100, 80, 60, 70, 60, 75, 85})));    // [1, 1, 1, 2, 1, 4, 6]
    }
}`,
  },

  'sum-of-subarray-minimums': {
    difficulty: 'Medium',
    statement: 'Given an integer array, return the sum of min(subarray) over every contiguous subarray, modulo 10⁹ + 7.',
    intuition: "Count how many subarrays each arr[i] is the minimum of. With left = the distance to the previous smaller element and right = the distance to the next smaller-or-equal element, arr[i] is the minimum of left × right subarrays. Making one side strict and the other non-strict means equal values are counted once. Two monotonic-stack passes give all the distances.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class SumOfSubarrayMinimums {
    public static int sumSubarrayMins(int[] arr) {
        final long MOD = 1_000_000_007L;
        int n = arr.length;
        int[] left = new int[n], right = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {                         // previous strictly smaller
            while (!st.isEmpty() && arr[st.peek()] >= arr[i]) st.pop();
            left[i] = st.isEmpty() ? i + 1 : i - st.peek();
            st.push(i);
        }
        st.clear();
        for (int i = n - 1; i >= 0; i--) {                    // next smaller or equal
            while (!st.isEmpty() && arr[st.peek()] > arr[i]) st.pop();
            right[i] = st.isEmpty() ? n - i : st.peek() - i;
            st.push(i);
        }
        long sum = 0;
        for (int i = 0; i < n; i++) sum = (sum + (long) arr[i] * left[i] % MOD * right[i]) % MOD;
        return (int) sum;
    }

    public static void main(String[] args) {
        System.out.println(sumSubarrayMins(new int[]{3, 1, 2, 5}));         // 18
        System.out.println(sumSubarrayMins(new int[]{11, 81, 94, 43, 3}));  // 444
        System.out.println(sumSubarrayMins(new int[]{2, 2}));               // 6
    }
}`,
  },

  'sum-of-subarray-ranges': {
    difficulty: 'Medium',
    statement: 'The range of a subarray is its largest element minus its smallest. Given an integer array, return the sum of the ranges of all its subarrays.',
    intuition: "Σ(max − min) = Σmax − Σmin, and each sum is the contribution counting from Sum of Subarray Minimums. For Σmin, arr[i] contributes arr[i] × left × right, with distances to the previous smaller and the next smaller-or-equal element. For Σmax, do the same with the comparisons flipped. Four monotonic-stack passes, no modulo needed (use long).",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class SumOfSubarrayRanges {
    public static long subArrayRanges(int[] nums) {
        return contribution(nums, true) - contribution(nums, false);
    }
    // sum over all subarrays of max (isMax) or min (!isMax)
    private static long contribution(int[] a, boolean isMax) {
        int n = a.length;
        long total = 0;
        int[] left = new int[n], right = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && (isMax ? a[st.peek()] <= a[i] : a[st.peek()] >= a[i])) st.pop();
            left[i] = st.isEmpty() ? i + 1 : i - st.peek();
            st.push(i);
        }
        st.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && (isMax ? a[st.peek()] < a[i] : a[st.peek()] > a[i])) st.pop();
            right[i] = st.isEmpty() ? n - i : st.peek() - i;
            st.push(i);
        }
        for (int i = 0; i < n; i++) total += (long) a[i] * left[i] * right[i];
        return total;
    }

    public static void main(String[] args) {
        System.out.println(subArrayRanges(new int[]{1, 2, 3}));          // 4
        System.out.println(subArrayRanges(new int[]{1, 3, 3}));          // 4
        System.out.println(subArrayRanges(new int[]{4, -2, -3, 4, 1}));  // 59
    }
}`,
  },

  'remove-k-digits': {
    difficulty: 'Medium',
    statement: 'Given a non-negative integer as a string and an integer k, remove exactly k digits so the remaining number is as small as possible. Return it without leading zeros ("0" if nothing is left).',
    intuition: "Digits further left matter more, so whenever a digit is followed by a smaller one, removing the bigger digit helps. Keep a stack whose digits increase from bottom to top. For each new digit, pop larger digits while you still have removals left. If removals remain at the end, the stack is non-decreasing, so drop digits from the end. Finally strip leading zeros.",
    time: 'O(n)',
    space: 'O(n)',
    code: `public class RemoveKDigits {
    public static String removeKdigits(String num, int k) {
        StringBuilder st = new StringBuilder();              // used as a stack
        for (char c : num.toCharArray()) {
            while (k > 0 && st.length() > 0 && st.charAt(st.length() - 1) > c) {
                st.deleteCharAt(st.length() - 1);
                k--;
            }
            st.append(c);
        }
        st.setLength(Math.max(0, st.length() - k));          // remaining removals from the end
        int i = 0;
        while (i < st.length() - 1 && st.charAt(i) == '0') i++;
        String res = st.substring(i);
        return res.isEmpty() ? "0" : res;
    }

    public static void main(String[] args) {
        System.out.println(removeKdigits("541892", 2));  // 1892
        System.out.println(removeKdigits("1432219", 3)); // 1219
        System.out.println(removeKdigits("10200", 1));   // 200
        System.out.println(removeKdigits("10", 2));      // 0
    }
}`,
  },

  'sliding-window-maximum': {
    difficulty: 'Hard',
    statement: 'Given an array and a window size k that slides from left to right one step at a time, return the maximum of each window.',
    intuition: "Keep a deque of indices whose values decrease from front to back, so the front is always the current window's maximum. For each new index: drop the front if it has slid out of the window, and pop from the back every value ≤ the new one, since the new element outlives them and is at least as big. Then push the new index. Once the first full window is formed, record arr[front] at every step.",
    time: 'O(n) — each index enters and leaves the deque once',
    space: 'O(k)',
    code: `import java.util.*;

public class SlidingWindowMaximum {
    public static int[] maxSlidingWindow(int[] arr, int k) {
        int n = arr.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && arr[dq.peekLast()] <= arr[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = arr[dq.peekFirst()];
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{4, 0, -1, 3, 5, 3, 6, 8}, 3)));  // [4, 3, 5, 5, 6, 8]
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3))); // [3, 3, 5, 5, 6, 7]
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{9}, 1)));                        // [9]
    }
}`,
  },

  'largest-rectangle-in-a-histogram': {
    difficulty: 'Hard',
    statement: 'Given bar heights of a histogram (each bar has width 1), return the area of the largest rectangle that fits inside it.',
    intuition: "The best rectangle using bar i at full height extends left and right until a shorter bar appears on each side. Keep a stack of indices with increasing heights. When a shorter bar arrives at i, pop index j: its right limit is i, and its left limit is the new top of the stack. The area is h[j] × (i − top − 1). A sentinel height of 0 at the end flushes the stack.",
    time: 'O(n) — one pass',
    space: 'O(n)',
    code: `import java.util.*;

public class LargestRectangleHistogram {
    public static int largestRectangleArea(int[] h) {
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = (i == h.length) ? 0 : h[i];           // sentinel flushes the stack
            while (!st.isEmpty() && h[st.peek()] >= cur) {
                int height = h[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3})); // 10
        System.out.println(largestRectangleArea(new int[]{2, 4}));             // 4
        System.out.println(largestRectangleArea(new int[]{3, 3, 3}));          // 9
    }
}`,
  },

  'maximum-rectangles': {
    difficulty: 'Hard',
    statement: 'Given an m × n binary matrix, return the area of the largest rectangle containing only 1s.',
    intuition: "Treat each row as the floor of a histogram. heights[c] is the number of consecutive 1s ending at this row in column c, and it resets to 0 on a 0. Then every row is a Largest Rectangle in Histogram problem solved with the monotonic stack. The answer is the best area over all rows.",
    time: 'O(m · n)',
    space: 'O(n)',
    code: `import java.util.*;

public class MaximalRectangle {
    public static int maximalRectangle(int[][] matrix) {
        int n = matrix[0].length, best = 0;
        int[] heights = new int[n];
        for (int[] row : matrix) {
            for (int c = 0; c < n; c++) heights[c] = row[c] == 1 ? heights[c] + 1 : 0;
            best = Math.max(best, largestInHistogram(heights));
        }
        return best;
    }
    private static int largestInHistogram(int[] h) {
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = (i == h.length) ? 0 : h[i];
            while (!st.isEmpty() && h[st.peek()] >= cur) {
                int height = h[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 0, 1, 0, 0}, {1, 0, 1, 1, 1}, {1, 1, 1, 1, 1}, {1, 0, 0, 1, 0}};
        System.out.println(maximalRectangle(m));                          // 6
        System.out.println(maximalRectangle(new int[][]{{0}}));           // 0
        System.out.println(maximalRectangle(new int[][]{{1, 1}, {1, 1}})); // 4
    }
}`,
  },

  // ── Stack and Queues › Data Structure Design ────────────────────────────────

  'implement-min-stack': {
    difficulty: 'Medium',
    statement: 'Design a stack that supports push, pop, top and getMin (the current minimum), all in O(1) time.',
    intuition: "Store each entry as a pair (value, minimum at the time of the push). The new entry's minimum is min(val, previous top's minimum). Popping an entry brings back the older minimum automatically, because it is stored in the entry below. getMin just reads the top pair.",
    time: 'O(1) per operation',
    space: 'O(n)',
    code: `import java.util.*;

public class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();     // {value, minSoFar}

    public void push(int val) {
        int min = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, min});
    }
    public void pop()    { st.pop(); }
    public int top()     { return st.peek()[0]; }
    public int getMin()  { return st.peek()[1]; }

    public static void main(String[] args) {
        MinStack s = new MinStack();
        s.push(-2); s.push(0); s.push(-3);
        System.out.println(s.getMin()); // -3
        s.pop();
        System.out.println(s.top());    // 0
        System.out.println(s.getMin()); // -2
    }
}`,
  },

  'asteroid-collision': {
    difficulty: 'Medium',
    statement: 'Asteroids move in a row: the absolute value is the size, the sign is the direction (positive = right, negative = left), and all move at the same speed. When two meet, the smaller explodes (both explode if they are equal). Return the state after all collisions.',
    intuition: "Only a right-mover followed by a left-mover can collide. Keep a stack of survivors. For a negative asteroid, while the top is a smaller positive, that positive explodes, so pop it. If the top is an equal positive, both die. If the top is a bigger positive, the new one dies. If none of these stopped it, push it. Positive asteroids are always pushed.",
    time: 'O(n) — each asteroid pushed/popped once',
    space: 'O(n)',
    code: `import java.util.*;

public class AsteroidCollision {
    public static int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> st = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !st.isEmpty() && st.peek() > 0) {
                if (st.peek() < -a) st.pop();                    // top explodes, keep checking
                else {
                    if (st.peek() == -a) st.pop();               // both explode
                    alive = false;
                }
            }
            if (alive) st.push(a);
        }
        int[] res = new int[st.size()];
        for (int i = res.length - 1; i >= 0; i--) res[i] = st.pop();
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(asteroidCollision(new int[]{1, 2, 3, -4, -2}))); // [-4, -2]
        System.out.println(Arrays.toString(asteroidCollision(new int[]{5, 10, -5})));       // [5, 10]
        System.out.println(Arrays.toString(asteroidCollision(new int[]{8, -8})));           // []
        System.out.println(Arrays.toString(asteroidCollision(new int[]{-2, -1, 1, 2})));    // [-2, -1, 1, 2]
    }
}`,
  },

  'celebrity-problem': {
    difficulty: 'Medium',
    statement: 'At a party of n people, M[i][j] = 1 means person i knows person j. A celebrity is known by everyone else and knows no one. Return the celebrity\'s index, or −1 if there is none.',
    intuition: "Each question 'does a know b?' rules someone out. If yes, a can't be the celebrity. If no, b can't be. Start with two pointers at both ends and eliminate one person per comparison until one candidate is left. That takes n − 1 checks. Then confirm the candidate with one more linear pass: they must know nobody, and everybody must know them.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class CelebrityProblem {
    public static int celebrity(int[][] M) {
        int a = 0, b = M.length - 1;
        while (a < b) {
            if (M[a][b] == 1) a++;       // a knows b: a is not the celebrity
            else b--;                    // a doesn't know b: b is not the celebrity
        }
        for (int i = 0; i < M.length; i++) {
            if (i == a) continue;
            if (M[a][i] == 1 || M[i][a] == 0) return -1;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(celebrity(new int[][]{{0, 1, 1, 0}, {0, 0, 0, 0}, {1, 1, 0, 0}, {0, 1, 1, 0}})); // 1
        System.out.println(celebrity(new int[][]{{0, 1}, {1, 0}}));                                         // -1
    }
}`,
  },

  'lru-cache': {
    difficulty: 'Medium',
    statement: 'Design a Least Recently Used cache with a fixed capacity supporting get(key) (−1 if absent) and put(key, value), both in O(1). When full, put evicts the least recently used key.',
    intuition: "A HashMap finds a node in O(1). A doubly linked list keeps the keys in recency order and can move or remove a node in O(1). Most recent sits right after the head sentinel and least recent right before the tail sentinel. get moves the node to the front. put updates it (and moves it) or inserts a new node, evicting tail.prev when over capacity.",
    time: 'O(1) per operation',
    space: 'O(capacity)',
    code: `import java.util.*;

public class LRUCache {
    private static class Node { int key, val; Node prev, next; Node(int k, int v) { key = k; val = v; } }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }
    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        unlink(n); addFront(n);
        return n.val;
    }
    public void put(int key, int value) {
        Node n = map.get(key);
        if (n != null) { n.val = value; unlink(n); addFront(n); return; }
        if (map.size() == capacity) { Node lru = tail.prev; unlink(lru); map.remove(lru.key); }
        n = new Node(key, value);
        map.put(key, n);
        addFront(n);
    }
    private void unlink(Node n)   { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    public static void main(String[] args) {
        LRUCache c = new LRUCache(2);
        c.put(1, 1); c.put(2, 2);
        System.out.println(c.get(1)); // 1
        c.put(3, 3);                  // evicts 2
        System.out.println(c.get(2)); // -1
        c.put(4, 4);                  // evicts 1
        System.out.println(c.get(1)); // -1
        System.out.println(c.get(3)); // 3
        System.out.println(c.get(4)); // 4
    }
}`,
  },

  'lfu-cache': {
    difficulty: 'Hard',
    statement: 'Design a Least Frequently Used cache with a fixed capacity supporting get and put in O(1). When full, evict the key with the lowest use count; among ties, evict the least recently used.',
    intuition: "Keep three things: key → (value, frequency), frequency → keys in recency order (a LinkedHashSet), and minFreq. Touching a key moves it from set f to set f + 1. If set f was the minFreq set and is now empty, minFreq goes up by one. Eviction takes the oldest key in the minFreq set. A new key always has frequency 1, so minFreq resets to 1.",
    time: 'O(1) per operation',
    space: 'O(capacity)',
    code: `import java.util.*;

public class LFUCache {
    private final int capacity;
    private int minFreq = 0;
    private final Map<Integer, int[]> entries = new HashMap<>();                 // key -> {value, freq}
    private final Map<Integer, LinkedHashSet<Integer>> byFreq = new HashMap<>();  // freq -> keys (LRU order)

    public LFUCache(int capacity) { this.capacity = capacity; }

    public int get(int key) {
        int[] e = entries.get(key);
        if (e == null) return -1;
        touch(key, e);
        return e[0];
    }
    public void put(int key, int value) {
        if (capacity <= 0) return;
        int[] e = entries.get(key);
        if (e != null) { e[0] = value; touch(key, e); return; }
        if (entries.size() == capacity) {
            Iterator<Integer> it = byFreq.get(minFreq).iterator();
            int evict = it.next();
            it.remove();
            entries.remove(evict);
        }
        entries.put(key, new int[]{value, 1});
        byFreq.computeIfAbsent(1, f -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
    private void touch(int key, int[] e) {
        int f = e[1];
        byFreq.get(f).remove(key);
        if (f == minFreq && byFreq.get(f).isEmpty()) minFreq++;
        e[1] = f + 1;
        byFreq.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(key);
    }

    public static void main(String[] args) {
        LFUCache c = new LFUCache(2);
        c.put(1, 1); c.put(2, 2);
        System.out.println(c.get(1)); // 1
        c.put(3, 3);                  // evicts 2 (freq 1)
        System.out.println(c.get(2)); // -1
        System.out.println(c.get(3)); // 3
        c.put(4, 4);                  // 1 and 3 both freq 2; 1 is least recent -> evicted
        System.out.println(c.get(1)); // -1
        System.out.println(c.get(3)); // 3
        System.out.println(c.get(4)); // 4
    }
}`,
  },

  // ── Greedy Algorithms › Greedy ──────────────────────────────────────────────

  'jump-game---i': {
    difficulty: 'Medium',
    statement: 'Each element of nums is the maximum jump length from that position. Starting at index 0, return true if you can reach the last index.',
    intuition: "Track `reach`, the farthest index reachable so far. Walk i from left to right. If i > reach, index i can't be reached and nor can anything after it, so return false. Otherwise update reach = max(reach, i + nums[i]). Reaching the end of the loop means the last index is reachable.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class JumpGame {
    public static boolean canJump(int[] nums) {
        int reach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) return false;
            reach = Math.max(reach, i + nums[i]);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2, 3, 1, 1, 4})); // true
        System.out.println(canJump(new int[]{3, 2, 1, 0, 4})); // false
        System.out.println(canJump(new int[]{0}));             // true
    }
}`,
  },

  'valid-paranthesis-checker': {
    difficulty: 'Medium',
    statement: "Given a string of '(', ')' and '*', where '*' can act as '(', ')' or an empty string, return true if some choice for the stars makes the string a valid parenthesis sequence.",
    intuition: "Don't try every choice for each star. Track the range of possible open-bracket counts [lo, hi]. '(' increases both ends, ')' decreases both, and '*' decreases lo and increases hi. If hi goes negative, even treating every star as '(' can't fix it, so return false. Clamp lo at 0, since a negative count is never a real option. The string is valid if lo is 0 at the end.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class ValidParenthesisString {
    public static boolean checkValidString(String s) {
        int lo = 0, hi = 0;
        for (char c : s.toCharArray()) {
            if (c == '(')      { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else               { lo--; hi++; }
            if (hi < 0) return false;
            lo = Math.max(lo, 0);
        }
        return lo == 0;
    }

    public static void main(String[] args) {
        System.out.println(checkValidString("(*))"));  // true
        System.out.println(checkValidString("*(()"));  // false
        System.out.println(checkValidString("(*)"));   // true
        System.out.println(checkValidString(")*("));   // false
    }
}`,
  },

  'candy': {
    difficulty: 'Hard',
    statement: 'Children stand in a line with ratings. Every child gets at least one candy, and a child with a higher rating than a neighbour must get more candies than that neighbour. Return the minimum total number of candies.',
    intuition: "Deal with each neighbour constraint in its own pass. Left to right: if ratings[i] > ratings[i−1], give candy[i] = candy[i−1] + 1, otherwise 1. Right to left: if ratings[i] > ratings[i+1], raise candy[i] to at least candy[i+1] + 1. Taking the max keeps the left rule satisfied too, and each value is the smallest that satisfies both.",
    time: 'O(n) — two passes',
    space: 'O(n)',
    code: `import java.util.*;

public class Candy {
    public static int candy(int[] ratings) {
        int n = ratings.length;
        int[] c = new int[n];
        Arrays.fill(c, 1);
        for (int i = 1; i < n; i++)
            if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
        for (int i = n - 2; i >= 0; i--)
            if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
        int total = 0;
        for (int x : c) total += x;
        return total;
    }

    public static void main(String[] args) {
        System.out.println(candy(new int[]{1, 0, 5}));          // 5
        System.out.println(candy(new int[]{1, 2, 2}));          // 4
        System.out.println(candy(new int[]{1, 3, 4, 5, 2}));    // 11
    }
}`,
  },

  // ── Greedy Algorithms › Intervals & Scheduling ──────────────────────────────

  'n-meetings-in-one-room': {
    difficulty: 'Easy',
    statement: 'Given start and end times of N meetings and a single room, return the maximum number of meetings that can be held. A meeting can only start strictly after the previous one ends.',
    intuition: "Classic activity selection: always take the meeting that finishes earliest among those that fit. Finishing early leaves the most room for the rest, and an exchange argument shows this is never worse than any other choice. Sort by end time and take a meeting whenever its start is after the last chosen end.",
    time: 'O(n log n) — sorting',
    space: 'O(n) — index array',
    code: `import java.util.*;

public class NMeetings {
    public static int maxMeetings(int[] start, int[] end) {
        Integer[] idx = new Integer[start.length];
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> end[a] - end[b]);
        int count = 0, lastEnd = Integer.MIN_VALUE;
        for (int i : idx) {
            if (start[i] > lastEnd) { count++; lastEnd = end[i]; }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(maxMeetings(new int[]{1, 3, 0, 5, 8, 5}, new int[]{2, 4, 6, 7, 9, 9})); // 4
        System.out.println(maxMeetings(new int[]{10, 12, 20}, new int[]{20, 25, 30}));             // 1
    }
}`,
  },

  'insert-interval': {
    difficulty: 'Medium',
    statement: 'Given non-overlapping intervals sorted by start, and a new interval, insert it and merge where needed so the result is still sorted and non-overlapping.',
    intuition: "Three phases in a single pass. (1) Copy every interval that ends before the new one starts. (2) Merge every interval that overlaps the new one, meaning its start ≤ the new end, by stretching the new interval to cover it. Then add the merged interval. (3) Copy the rest unchanged.",
    time: 'O(n)',
    space: 'O(n) — the output',
    code: `import java.util.*;

public class InsertInterval {
    public static int[][] insert(int[][] intervals, int[] add) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        int s = add[0], e = add[1];
        while (i < n && intervals[i][1] < s) res.add(intervals[i++]);
        while (i < n && intervals[i][0] <= e) {
            s = Math.min(s, intervals[i][0]);
            e = Math.max(e, intervals[i][1]);
            i++;
        }
        res.add(new int[]{s, e});
        while (i < n) res.add(intervals[i++]);
        return res.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(insert(new int[][]{{1, 3}, {6, 9}}, new int[]{2, 5})));                          // [[1, 5], [6, 9]]
        System.out.println(Arrays.deepToString(insert(new int[][]{{1, 2}, {3, 5}, {6, 7}, {8, 10}, {12, 16}}, new int[]{4, 8}))); // [[1, 2], [3, 10], [12, 16]]
        System.out.println(Arrays.deepToString(insert(new int[][]{}, new int[]{5, 7})));                                        // [[5, 7]]
    }
}`,
  },

  'non-overlapping-intervals': {
    difficulty: 'Medium',
    statement: 'Given a list of intervals, return the minimum number to remove so the rest do not overlap. Intervals that only touch at an endpoint (e.g. [1,2] and [2,3]) do not overlap.',
    intuition: "Removing the fewest intervals is the same as keeping the most, which is the activity-selection problem again. Sort by end, keep an interval whenever its start ≥ the last kept end, and remove the others. Keeping the interval that ends earliest always leaves the most room for the rest.",
    time: 'O(n log n)',
    space: 'O(1) besides sorting',
    code: `import java.util.*;

public class NonOverlappingIntervals {
    public static int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int removed = 0, lastEnd = Integer.MIN_VALUE;
        for (int[] iv : intervals) {
            if (iv[0] >= lastEnd) lastEnd = iv[1];
            else removed++;
        }
        return removed;
    }

    public static void main(String[] args) {
        System.out.println(eraseOverlapIntervals(new int[][]{{1, 2}, {2, 3}, {3, 4}, {1, 3}})); // 1
        System.out.println(eraseOverlapIntervals(new int[][]{{1, 2}, {1, 2}, {1, 2}}));         // 2
        System.out.println(eraseOverlapIntervals(new int[][]{{1, 2}, {2, 3}}));                 // 0
    }
}`,
  },

  'minimum-number-of-platforms-required-for-a-railway': {
    difficulty: 'Medium',
    statement: 'Given arrival and departure times of trains at a station, return the minimum number of platforms needed so no train waits. A platform cannot be used for a departure and an arrival at the same instant.',
    intuition: "What matters is the largest number of trains present at the same moment. Sort the arrivals and departures separately and sweep through time with two pointers. If the next arrival is ≤ the next departure, a train arrives before one leaves (a tie counts as a clash), so the count goes up. Otherwise a train leaves and the count goes down. The peak count is the answer.",
    time: 'O(n log n)',
    space: 'O(1) besides sorting',
    code: `import java.util.*;

public class MinimumPlatforms {
    public static int findPlatform(int[] arr, int[] dep) {
        arr = arr.clone(); dep = dep.clone();
        Arrays.sort(arr); Arrays.sort(dep);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < arr.length) {
            if (arr[i] <= dep[j]) { cur++; i++; best = Math.max(best, cur); }
            else                  { cur--; j++; }
        }
        return best;
    }

    public static void main(String[] args) {
        int[] arr = {900, 940, 950, 1100, 1500, 1800}, dep = {910, 1200, 1120, 1130, 1900, 2000};
        System.out.println(findPlatform(arr, dep));                                             // 3
        System.out.println(findPlatform(new int[]{900, 1100, 1235}, new int[]{1000, 1200, 1240})); // 1
    }
}`,
  },

  'job-sequencing-problem': {
    difficulty: 'Medium',
    statement: 'Each job has an id, a deadline and a profit, and takes one unit of time. Only one job runs at a time, and profit counts only if the job finishes by its deadline. Return [number of jobs done, maximum total profit].',
    intuition: "Look at jobs from highest profit to lowest. Schedule each one in the latest free time slot at or before its deadline. Using the latest slot keeps earlier slots free for jobs with tighter deadlines. If no slot is free, skip the job. A boolean array of slots up to the maximum deadline is enough. A DSU of 'next free slot' makes the slot search almost O(1).",
    time: 'O(n log n + n · D) for max deadline D',
    space: 'O(D)',
    code: `import java.util.*;

public class JobSequencing {
    // jobs[i] = {id, deadline, profit}
    public static int[] jobScheduling(int[][] jobs) {
        int[][] js = jobs.clone();
        Arrays.sort(js, (a, b) -> b[2] - a[2]);
        int maxD = 0;
        for (int[] j : js) maxD = Math.max(maxD, j[1]);
        boolean[] used = new boolean[maxD + 1];
        int count = 0, profit = 0;
        for (int[] j : js) {
            for (int t = j[1]; t >= 1; t--) {
                if (!used[t]) { used[t] = true; count++; profit += j[2]; break; }
            }
        }
        return new int[]{count, profit};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(jobScheduling(new int[][]{{1, 4, 20}, {2, 1, 10}, {3, 1, 40}, {4, 1, 30}})));            // [2, 60]
        System.out.println(Arrays.toString(jobScheduling(new int[][]{{1, 2, 100}, {2, 1, 19}, {3, 2, 27}, {4, 1, 25}, {5, 1, 15}}))); // [2, 127]
    }
}`,
  },

  // ── Heaps › Heap / Priority Queue ───────────────────────────────────────────

  'heapify-algorithm': {
    difficulty: 'Easy',
    statement: 'Given an array that is a valid min-heap, set nums[ind] = val and restore the min-heap property in place.',
    intuition: "Changing one key can only break the heap along one path. If the new value is smaller than its parent, it may need to move up: swap with the parent while it is smaller (sift up). If it is larger than a child, it may need to move down: swap with the smaller child while that child is smaller (sift down). Only one of the two will actually move it.",
    time: 'O(log n) — one root-to-leaf path',
    space: 'O(1)',
    code: `import java.util.*;

public class HeapifyAlgorithm {
    public static void heapify(int[] nums, int ind, int val) {
        nums[ind] = val;
        siftUp(nums, ind);
        siftDown(nums, ind, nums.length);
    }
    static void siftUp(int[] a, int i) {
        while (i > 0 && a[(i - 1) / 2] > a[i]) {
            swap(a, i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
    }
    static void siftDown(int[] a, int i, int n) {
        while (true) {
            int l = 2 * i + 1, r = l + 1, small = i;
            if (l < n && a[l] < a[small]) small = l;
            if (r < n && a[r] < a[small]) small = r;
            if (small == i) return;
            swap(a, i, small);
            i = small;
        }
    }
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        int[] a = {1, 4, 5, 5, 7, 6};
        heapify(a, 5, 2);
        System.out.println(Arrays.toString(a)); // [1, 4, 2, 5, 7, 5]
        int[] b = {2, 4, 3, 6, 5, 7, 8, 7};
        heapify(b, 0, 7);
        System.out.println(Arrays.toString(b)); // [3, 4, 7, 6, 5, 7, 8, 7]
    }
}`,
  },

  'build-heap-from-a-given-array': {
    difficulty: 'Easy',
    statement: 'Convert an array of integers into a min-heap in place.',
    intuition: "Leaves are already valid one-element heaps. Sift down every internal node, starting from the last one (n/2 − 1) and moving back to the root. When node i is processed, both of its subtrees are already heaps, so sifting i down fixes the whole subtree rooted at i. Most nodes sit near the bottom and move only a little, so the total work is O(n), not O(n log n).",
    time: 'O(n) — the sum of subtree heights',
    space: 'O(1)',
    code: `import java.util.*;

public class BuildHeap {
    public static void buildMinHeap(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) siftDown(a, i, a.length);
    }
    static void siftDown(int[] a, int i, int n) {
        while (true) {
            int l = 2 * i + 1, r = l + 1, small = i;
            if (l < n && a[l] < a[small]) small = l;
            if (r < n && a[r] < a[small]) small = r;
            if (small == i) return;
            int t = a[i]; a[i] = a[small]; a[small] = t;
            i = small;
        }
    }

    public static void main(String[] args) {
        int[] a = {6, 5, 2, 7, 1, 7};
        buildMinHeap(a);
        System.out.println(Arrays.toString(a)); // [1, 5, 2, 7, 6, 7]
        int[] b = {3, 2, 1};
        buildMinHeap(b);
        System.out.println(Arrays.toString(b)); // [1, 2, 3]
    }
}`,
  },

  'implement-min-heap': {
    difficulty: 'Medium',
    statement: 'Implement a min-heap supporting insert(x), getMin(), extractMin(), heapSize(), isEmpty() and changeKey(ind, val) (set the element at array index ind to val).',
    intuition: "Store the complete binary tree in an array: the children of i are at 2i + 1 and 2i + 2, and its parent is at (i − 1)/2. insert appends and sifts up. extractMin moves the last element to the root and sifts down. changeKey writes the value and sifts in whichever direction is needed. Every change touches only one root-to-leaf path.",
    time: 'O(log n) insert / extractMin / changeKey, O(1) getMin',
    space: 'O(n)',
    code: `import java.util.*;

public class MinHeap {
    private int[] a = new int[4];
    private int size = 0;

    public void insert(int x) {
        if (size == a.length) a = Arrays.copyOf(a, size * 2);
        a[size] = x;
        siftUp(size++);
    }
    public int getMin()      { return a[0]; }
    public int heapSize()    { return size; }
    public boolean isEmpty() { return size == 0; }
    public int extractMin() {
        int min = a[0];
        a[0] = a[--size];
        siftDown(0);
        return min;
    }
    public void changeKey(int ind, int val) {
        a[ind] = val;
        siftUp(ind);
        siftDown(ind);
    }
    private void siftUp(int i) {
        while (i > 0 && a[(i - 1) / 2] > a[i]) { swap(i, (i - 1) / 2); i = (i - 1) / 2; }
    }
    private void siftDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = l + 1, small = i;
            if (l < size && a[l] < a[small]) small = l;
            if (r < size && a[r] < a[small]) small = r;
            if (small == i) return;
            swap(i, small);
            i = small;
        }
    }
    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        MinHeap h = new MinHeap();
        h.insert(5); h.insert(3); h.insert(8); h.insert(1);     // array: [1, 3, 8, 5]
        System.out.println(h.getMin());      // 1
        System.out.println(h.extractMin());  // 1
        System.out.println(h.getMin());      // 3
        h.changeKey(2, 0);                   // array was [3, 5, 8] -> 8 becomes 0
        System.out.println(h.getMin());      // 0
        System.out.println(h.heapSize());    // 3
        System.out.println(h.isEmpty());     // false
    }
}`,
  },

  'k-th-largest-element-in-an-array': {
    difficulty: 'Medium',
    statement: 'Given an integer array and k, return the k-th largest element (in sorted order, not the k-th distinct).',
    intuition: "Keep a min-heap of size k holding the k largest values seen so far. For each number, add it, and if the heap grows past k, remove the smallest. At the end the heap's root is the smallest of the k largest, which is the k-th largest. (Quickselect gives O(n) on average but has an O(n²) worst case.)",
    time: 'O(n log k)',
    space: 'O(k)',
    code: `import java.util.*;

public class KthLargest {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{1, 2, 3, 4, 5}, 2));                // 4
        System.out.println(findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));             // 5
        System.out.println(findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4));    // 4
    }
}`,
  },

  'find-median-from-data-stream': {
    difficulty: 'Hard',
    statement: 'Design a MedianFinder with addNum(num), which adds a number from a stream, and findMedian(), which returns the median of all numbers added so far.',
    intuition: "Split the numbers into two halves: a max-heap `low` for the smaller half and a min-heap `high` for the larger half. Keep low the same size as high or one bigger. To add a number, push it into low, move low's max into high (this keeps every value in low ≤ every value in high), and move one back if high got bigger. The median is low's top, or the average of the two tops when the sizes are equal.",
    time: 'O(log n) addNum, O(1) findMedian',
    space: 'O(n)',
    code: `import java.util.*;

public class MedianFinder {
    private final PriorityQueue<Integer> low  = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (high.size() > low.size()) low.offer(high.poll());
    }
    public double findMedian() {
        return low.size() > high.size() ? low.peek() : (low.peek() + (double) high.peek()) / 2.0;
    }

    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        mf.addNum(1); mf.addNum(2);
        System.out.println(mf.findMedian()); // 1.5
        mf.addNum(3);
        System.out.println(mf.findMedian()); // 2.0
        mf.addNum(-5); mf.addNum(10);
        System.out.println(mf.findMedian()); // 2.0
    }
}`,
  },
};
