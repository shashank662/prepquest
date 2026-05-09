export const batch6 = [
  // ─── Heap & Hash (13) ────────────────────────────────────────────────────────
  {
    topic: 'Heap & Hash',
    title: 'Find K Largest Elements',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/k-largestor-smallest-elements-in-an-array/',
    statement: 'Given an array of N integers and K, find the K largest elements in descending order. Constraints: 1 <= K <= N <= 10^5.',
    intuition: 'Use a min-heap of size K. Iterate through the array: if heap size < K, push. Otherwise, if current element > heap top, pop and push. After processing all elements, the heap contains the K largest. Extract them in reverse order for descending output.',
    time_complexity: 'O(N log K) — each insertion/extraction from heap of size K.',
    space_complexity: 'O(K) — the heap.',
    code: `import java.util.*;

public class KLargestElements {
    static int[] kLargest(int[] arr, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int x : arr) {
            minHeap.offer(x);
            if (minHeap.size() > k) minHeap.poll();
        }
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) result[i] = minHeap.poll();
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(kLargest(new int[]{1,23,12,9,30,2,50}, 3))); // [50, 30, 23]
        System.out.println(Arrays.toString(kLargest(new int[]{11,3,2,1,15,5,4,45,88,96,50,45}, 3))); // [96, 88, 50]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/kth-largest-element-in-a-stream/',
    statement: 'Design a class that finds the Kth largest element in a stream. Initialize with K and an initial array. Implement add(val) which adds val to the stream and returns the Kth largest element. Constraints: 1 <= K; 1 <= N + number of add() calls <= 10^4.',
    intuition: 'Maintain a min-heap of size K. The Kth largest is always the heap top (smallest among top K). On each add: push the new value, then pop if size > K. The heap invariant ensures the minimum of the top K is at the top.',
    time_complexity: 'O(N log K) initialization; O(log K) per add().',
    space_complexity: 'O(K) — heap size bounded.',
    code: `import java.util.PriorityQueue;

public class KthLargestStream {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    int k;

    KthLargestStream(int k, int[] nums) {
        this.k = k;
        for (int n : nums) add(n);
    }

    int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) minHeap.poll();
        return minHeap.peek();
    }

    public static void main(String[] args) {
        KthLargestStream kls = new KthLargestStream(3, new int[]{4,5,8,2});
        System.out.println(kls.add(3));  // 4  (sorted: 8,5,4,3,2)
        System.out.println(kls.add(5));  // 5  (sorted: 8,5,5,4,3,2)
        System.out.println(kls.add(10)); // 5  (sorted: 10,8,5,5,4,3,2)
        System.out.println(kls.add(9));  // 8
        System.out.println(kls.add(4));  // 8
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-k-numbers-occurrences-given-array/',
    statement: 'Given an integer array, return the K most frequent elements. Output order doesn\'t matter. Constraints: 1 <= K <= number of unique elements; 1 <= N <= 10^5.',
    intuition: 'Count frequencies with a HashMap. Use a min-heap of (frequency, element) of size K. For each unique element: if heap size < K push; else if its frequency > heap top\'s frequency, replace. At the end, extract all K elements. Alternatively, use bucket sort on frequencies for O(N).',
    time_complexity: 'O(N log K) — heap approach.',
    space_complexity: 'O(N) — frequency map plus heap.',
    code: `import java.util.*;

public class TopKFrequent {
    static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);
        // min-heap on frequency
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            pq.offer(new int[]{e.getKey(), e.getValue()});
            if (pq.size() > k) pq.poll();
        }
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) result[i] = pq.poll()[0];
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topKFrequent(new int[]{1,1,1,2,2,3}, 2))); // [1, 2]
        System.out.println(Arrays.toString(topKFrequent(new int[]{1}, 1)));            // [1]
        System.out.println(Arrays.toString(topKFrequent(new int[]{4,1,2,2,3,3,3}, 2))); // [3, 2]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Merge K Sorted Arrays',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/merge-k-sorted-arrays/',
    statement: 'Given K sorted arrays each of size N, merge them all into a single sorted array. Constraints: 1 <= K, N <= 500.',
    intuition: 'Use a min-heap seeded with the first element of each array (along with its array index and element index). Repeatedly extract the minimum, add it to the result, and push the next element from the same array if it exists. Each extraction is O(log K).',
    time_complexity: 'O(N*K*log K) — N*K elements, each with O(log K) heap operation.',
    space_complexity: 'O(K) — heap holds at most K elements.',
    code: `import java.util.*;

public class MergeKArrays {
    static int[] mergeKArrays(int[][] arrays) {
        // min-heap: {value, arrayIndex, elementIndex}
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        int total = 0;
        for (int i = 0; i < arrays.length; i++) {
            if (arrays[i].length > 0) { pq.offer(new int[]{arrays[i][0], i, 0}); total += arrays[i].length; }
        }
        int[] result = new int[total];
        int idx = 0;
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            result[idx++] = cur[0];
            int ai = cur[1], ei = cur[2] + 1;
            if (ei < arrays[ai].length) pq.offer(new int[]{arrays[ai][ei], ai, ei});
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(mergeKArrays(new int[][]{{1,3,5,7},{2,4,6,8},{0,9,10,11}})));
        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        System.out.println(Arrays.toString(mergeKArrays(new int[][]{{1,5},{2,6},{3,7},{4,8}})));
        // [1, 2, 3, 4, 5, 6, 7, 8]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/median-of-stream-of-integers-running-integers/',
    statement: 'Design a data structure that supports adding integers from a data stream and querying the median of all integers added so far. Constraints: -10^5 <= value <= 10^5; up to 5*10^4 addNum calls.',
    intuition: 'Maintain two heaps: a max-heap for the lower half and a min-heap for the upper half. Always keep |maxHeap.size() - minHeap.size()| <= 1 and every element in maxHeap <= every element in minHeap. Median is the top of the larger heap, or the average of both tops if sizes are equal.',
    time_complexity: 'O(log N) per addNum; O(1) findMedian.',
    space_complexity: 'O(N) — both heaps together hold all elements.',
    code: `import java.util.PriorityQueue;
import java.util.Collections;

public class MedianFinder {
    PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    PriorityQueue<Integer> upper = new PriorityQueue<>(); // min-heap

    void addNum(int num) {
        lower.offer(num);
        upper.offer(lower.poll()); // balance: push max of lower into upper
        if (lower.size() < upper.size()) lower.offer(upper.poll());
    }

    double findMedian() {
        if (lower.size() > upper.size()) return lower.peek();
        return (lower.peek() + upper.peek()) / 2.0;
    }

    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        mf.addNum(1); mf.addNum(2);
        System.out.println(mf.findMedian()); // 1.5
        mf.addNum(3);
        System.out.println(mf.findMedian()); // 2.0
        mf.addNum(4);
        System.out.println(mf.findMedian()); // 2.5
        mf.addNum(5);
        System.out.println(mf.findMedian()); // 3.0
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Rearrange Characters so No Two Adjacent are Same',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/rearrange-characters-so-that-no-two-adjacent-are-same/',
    statement: 'Given a string, rearrange its characters so no two adjacent characters are the same. Return the rearranged string, or empty string if not possible. Constraints: 1 <= |s| <= 500; lowercase letters.',
    intuition: 'Use a max-heap on character frequencies. Always place the most frequent character that isn\'t the same as the last placed character. If the top is the same as the last character, swap with the second element. If impossible (most frequent > ceil(n/2)), return empty.',
    time_complexity: 'O(N log 26) = O(N) — heap of at most 26 characters.',
    space_complexity: 'O(N) — output string.',
    code: `import java.util.*;

public class RearrangeCharacters {
    static String rearrange(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[1] - a[1]); // max-heap
        for (int i = 0; i < 26; i++) if (freq[i] > 0) pq.offer(new int[]{i, freq[i]});
        StringBuilder sb = new StringBuilder();
        int[] prev = {-1, 0};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            sb.append((char)('a' + cur[0]));
            if (prev[1] > 0) pq.offer(prev);
            cur[1]--;
            prev = cur;
        }
        return (sb.length() == s.length()) ? sb.toString() : "";
    }

    public static void main(String[] args) {
        System.out.println(rearrange("aaabc")); // "abaca" or similar (no two 'a' adjacent)
        System.out.println(rearrange("aa"));    // "" (impossible)
        System.out.println(rearrange("aab"));   // "aba"
        System.out.println(rearrange("aaab"));  // "" (impossible: 3 a's in 4 chars, ceil(4/2)=2)

        String result = rearrange("aaabc");
        boolean valid = true;
        for (int i = 1; i < result.length(); i++)
            if (result.charAt(i) == result.charAt(i-1)) { valid = false; break; }
        System.out.println("Valid: " + valid);
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Subarray with Zero Sum',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/find-if-there-is-a-subarray-with-0-sum/',
    statement: 'Given an array of integers (can be negative), check whether a subarray with zero sum exists. Return true if yes. Constraints: 1 <= N <= 10^4; elements fit in int.',
    intuition: 'Compute prefix sums. If the same prefix sum appears twice (or equals 0), the subarray between those two positions sums to zero. Use a HashSet to track seen prefix sums. Start with 0 in the set (handles subarrays starting from index 0).',
    time_complexity: 'O(N) — single pass with HashSet.',
    space_complexity: 'O(N) — HashSet of prefix sums.',
    code: `import java.util.HashSet;

public class SubarrayZeroSum {
    static boolean hasZeroSum(int[] arr) {
        HashSet<Integer> seen = new HashSet<>();
        seen.add(0);
        int prefix = 0;
        for (int x : arr) {
            prefix += x;
            if (seen.contains(prefix)) return true;
            seen.add(prefix);
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasZeroSum(new int[]{4, 2, -3, 1, 6}));    // true  (2,-3,1)
        System.out.println(hasZeroSum(new int[]{4, 2, 0, 1, 6}));     // true  (single 0)
        System.out.println(hasZeroSum(new int[]{-3, 2, 3, 1, 6}));    // false
        System.out.println(hasZeroSum(new int[]{1, 4, -2, -2, 5, -4, 3})); // true
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Longest Subarray with Equal 0s and 1s',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/largest-subarray-with-equal-number-of-0s-and-1s/',
    statement: 'Given a binary array (contains only 0s and 1s), find the length of the longest subarray with equal numbers of 0s and 1s. Constraints: 1 <= N <= 10^5.',
    intuition: 'Replace 0s with -1s. Now the problem becomes: find the longest subarray with sum 0. Use prefix sums: the first time a prefix sum S is seen, store its index. The next time S is seen at index i, the subarray between (firstIndex+1, i) has sum 0. Track the maximum length.',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(N) — HashMap of prefix sum → first index.',
    code: `import java.util.HashMap;

public class LongestEqual01 {
    static int longestSubarray(int[] arr) {
        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, -1); // prefix sum 0 at index -1 (before array)
        int prefix = 0, maxLen = 0;
        for (int i = 0; i < arr.length; i++) {
            prefix += (arr[i] == 0) ? -1 : 1;
            if (map.containsKey(prefix)) maxLen = Math.max(maxLen, i - map.get(prefix));
            else map.put(prefix, i);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(longestSubarray(new int[]{1,0,1,1,1,0,0})); // 6
        System.out.println(longestSubarray(new int[]{0,0,1,1,0}));     // 4
        System.out.println(longestSubarray(new int[]{0,1,0,1}));       // 4
        System.out.println(longestSubarray(new int[]{1,1,1,1}));       // 0
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Count Distinct Elements in Every Window',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/count-distinct-elements-in-every-window-of-size-k/',
    statement: 'Given an array of N integers and a window size K, find the number of distinct elements in each window of size K. Output an array of (N - K + 1) counts. Constraints: K <= N <= 10^5.',
    intuition: 'Use a HashMap of element → frequency. Add the first K elements to the map. For each subsequent window, slide: add the new element (increment frequency), remove the outgoing element (decrement, delete if frequency hits 0). The map size at each step is the distinct count.',
    time_complexity: 'O(N) — each element added and removed at most once.',
    space_complexity: 'O(K) — map holds at most K elements.',
    code: `import java.util.*;

public class DistinctInWindow {
    static int[] countDistinct(int[] arr, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        int[] result = new int[arr.length - k + 1];
        // Fill first window
        for (int i = 0; i < k; i++) freq.merge(arr[i], 1, Integer::sum);
        result[0] = freq.size();
        for (int i = k; i < arr.length; i++) {
            // Add new element
            freq.merge(arr[i], 1, Integer::sum);
            // Remove outgoing element
            int out = arr[i - k];
            freq.merge(out, -1, Integer::sum);
            if (freq.get(out) == 0) freq.remove(out);
            result[i - k + 1] = freq.size();
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(countDistinct(new int[]{1,2,1,3,4,2,3}, 4)));
        // [3, 4, 4, 3]
        System.out.println(Arrays.toString(countDistinct(new int[]{1,1,1,1,1}, 3)));
        // [1, 1, 1]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/given-a-sequence-of-words-print-all-anagrams-together/',
    statement: 'Given an array of strings, group anagrams together. Each group should contain all strings that are anagrams of each other. Output order of groups doesn\'t matter. Constraints: 1 <= N <= 10^4; word length <= 100; lowercase letters.',
    intuition: 'Sort each word\'s characters to form a canonical key — all anagrams of the same set of characters will have the same sorted key. Use a HashMap from sorted key to list of original words. This avoids comparing every pair of strings.',
    time_complexity: 'O(N * L * log L) — sorting each word of length L.',
    space_complexity: 'O(N * L) — HashMap storage.',
    code: `import java.util.*;

public class GroupAnagrams {
    static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ch = s.toCharArray();
            Arrays.sort(ch);
            String key = new String(ch);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        List<List<String>> result = groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"});
        result.forEach(g -> { Collections.sort(g); System.out.println(g); });
        // [ate, eat, tea], [nat, tan], [bat]

        System.out.println(groupAnagrams(new String[]{""}));         // [[]]
        System.out.println(groupAnagrams(new String[]{"a"}));        // [[a]]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/longest-consecutive-subsequence/',
    statement: 'Given an unsorted array of integers, find the length of the longest consecutive sequence. Constraints: 0 <= N <= 10^5; values fit in int. Expected O(N).',
    intuition: 'Put all elements in a HashSet. For each element, only start counting if element-1 is NOT in the set (it\'s the start of a sequence). Then count upward while next consecutive is in the set. This ensures each sequence is counted exactly once from its start.',
    time_complexity: 'O(N) — each element checked at most twice (start check + sequence scan).',
    space_complexity: 'O(N) — HashSet.',
    code: `import java.util.HashSet;
import java.util.Set;

public class LongestConsecutive {
    static int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) set.add(n);
        int max = 0;
        for (int n : set) {
            if (!set.contains(n - 1)) { // start of a sequence
                int len = 1;
                while (set.contains(n + len)) len++;
                max = Math.max(max, len);
            }
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100,4,200,1,3,2})); // 4 (1,2,3,4)
        System.out.println(longestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1})); // 9 (0-8)
        System.out.println(longestConsecutive(new int[]{})); // 0
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'Two Sum',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/two-sum/',
    statement: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to target. Exactly one solution exists. Do not use the same element twice. Constraints: 2 <= N <= 10^4; values fit in int.',
    intuition: 'Use a HashMap from value to index. For each element, check if target - element is in the map. If yes, return both indices. If no, store the current element and its index. Single pass, O(N).',
    time_complexity: 'O(N) — one pass through the array.',
    space_complexity: 'O(N) — HashMap.',
    code: `import java.util.*;

public class TwoSum {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[]{map.get(complement), i};
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No solution");
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9))); // [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3,2,4}, 6)));     // [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3,3}, 6)));       // [0, 1]
    }
}`
  },
  {
    topic: 'Heap & Hash',
    title: 'LRU Cache',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/lru-cache-implementation/',
    statement: 'Implement an LRU (Least Recently Used) cache with get(key) and put(key, value) operations, both in O(1). The cache has a fixed capacity; when full, it evicts the least recently used item before inserting. Constraints: 1 <= capacity <= 3000; 0 <= key, value <= 10^4.',
    intuition: 'Combine a HashMap (O(1) lookup) with a doubly linked list (O(1) insertion and deletion). The list maintains access order — recently used at front, LRU at back. On get: move node to front. On put: if key exists update and move to front; if new, add to front and evict from back if over capacity.',
    time_complexity: 'O(1) for both get and put.',
    space_complexity: 'O(capacity) — map and list together hold at most capacity entries.',
    code: `import java.util.*;

public class LRUCache {
    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    Map<Integer, Node> map;
    Node head, tail; // sentinels
    int capacity;

    LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node(0, 0); tail = new Node(0, 0);
        head.next = tail; tail.prev = head;
    }

    void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }

    void addFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key); remove(n); addFront(n);
        return n.val;
    }

    void put(int key, int value) {
        if (map.containsKey(key)) { remove(map.get(key)); }
        else if (map.size() == capacity) { map.remove(tail.prev.key); remove(tail.prev); }
        Node n = new Node(key, value);
        addFront(n); map.put(key, n);
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1); cache.put(2, 2);
        System.out.println(cache.get(1));    // 1
        cache.put(3, 3);                     // evicts key 2
        System.out.println(cache.get(2));    // -1 (evicted)
        cache.put(4, 4);                     // evicts key 1
        System.out.println(cache.get(1));    // -1 (evicted)
        System.out.println(cache.get(3));    // 3
        System.out.println(cache.get(4));    // 4
    }
}`
  },

  // ─── Bit Magic (8) ───────────────────────────────────────────────────────────
  {
    topic: 'Bit Magic',
    title: 'Find the One Non-Repeating Element',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/find-the-number-occurring-odd-number-of-times/',
    statement: 'Given an array where every element appears twice except for one, find that single element. Constraints: 1 <= N <= 10^7; values fit in int. Solve in O(N) time and O(1) space.',
    intuition: 'XOR all elements together. XOR of a number with itself is 0 (a ^ a = 0); XOR with 0 is identity (a ^ 0 = a). Since all paired elements cancel out, the XOR of the entire array leaves only the single element.',
    time_complexity: 'O(N) — single pass XOR.',
    space_complexity: 'O(1) — one variable.',
    code: `public class SingleElement {
    static int findSingle(int[] arr) {
        int result = 0;
        for (int x : arr) result ^= x;
        return result;
    }

    public static void main(String[] args) {
        System.out.println(findSingle(new int[]{2, 3, 5, 4, 5, 3, 4})); // 2
        System.out.println(findSingle(new int[]{15, 18, 16, 18, 16, 15, 89})); // 89
        System.out.println(findSingle(new int[]{1})); // 1
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Count Set Bits in an Integer',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/count-set-bits-in-an-integer/',
    statement: 'Given a non-negative integer N, count the number of 1-bits (set bits) in its binary representation. Constraints: 0 <= N <= 10^9.',
    intuition: 'Brian Kernighan\'s trick: n & (n-1) clears the lowest set bit. Repeat until n = 0, counting iterations. Alternatively, use Integer.bitCount(), but the trick is the intended insight. Each operation removes exactly one set bit, so the loop runs popcount(n) times.',
    time_complexity: 'O(set bits count) — at most 32 iterations.',
    space_complexity: 'O(1).',
    code: `public class CountSetBits {
    static int countBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1); // clears lowest set bit
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countBits(0));         // 0
        System.out.println(countBits(1));         // 1
        System.out.println(countBits(7));         // 3  (111)
        System.out.println(countBits(128));       // 1  (10000000)
        System.out.println(countBits(255));       // 8  (11111111)
        System.out.println(countBits(1000000000)); // Java bitCount for verify:
        System.out.println(Integer.bitCount(1000000000)); // same
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Power of Two Check',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/program-to-find-whether-a-no-is-power-of-two/',
    statement: 'Given a positive integer N, determine if it is a power of two. Constraints: 1 <= N <= 2^31 - 1.',
    intuition: 'A power of two has exactly one set bit. The trick: n & (n-1) equals 0 if and only if n has exactly one set bit — because subtracting 1 flips all bits from the lowest set bit downward, and AND-ing clears all those bits (including the only set bit). Also check n > 0.',
    time_complexity: 'O(1) — single bitwise operation.',
    space_complexity: 'O(1).',
    code: `public class PowerOfTwo {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(1));    // true   (2^0)
        System.out.println(isPowerOfTwo(16));   // true   (2^4)
        System.out.println(isPowerOfTwo(3));    // false
        System.out.println(isPowerOfTwo(6));    // false
        System.out.println(isPowerOfTwo(1024)); // true   (2^10)
        System.out.println(isPowerOfTwo(0));    // false
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Two Non-Repeating Elements',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-two-non-repeating-elements-in-an-array-of-repeating-elements/',
    statement: 'Given an array where every element appears twice except two, find those two non-repeating elements. Constraints: 1 <= N <= 10^7; values fit in int.',
    intuition: 'XOR all elements to get XOR of the two unique numbers (x ^ y). Since x != y, at least one bit differs — find any set bit (use rightmost: diff & -diff). This bit distinguishes x from y. Partition all elements by this bit and XOR each partition — each gives one unique number.',
    time_complexity: 'O(N) — two passes.',
    space_complexity: 'O(1).',
    code: `public class TwoNonRepeating {
    static int[] findTwo(int[] arr) {
        int xorAll = 0;
        for (int x : arr) xorAll ^= x;
        int diff = xorAll & (-xorAll); // rightmost set bit
        int a = 0, b = 0;
        for (int x : arr) {
            if ((x & diff) != 0) a ^= x;
            else b ^= x;
        }
        return new int[]{a, b};
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(findTwo(new int[]{2,3,7,9,11,2,3,11}))); // [7, 9] (or [9, 7])
        System.out.println(java.util.Arrays.toString(findTwo(new int[]{1,2,3,2,1,4}))); // [3, 4]
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Reverse Bits of a 32-bit Integer',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/write-an-efficient-c-program-to-reverse-bits-of-a-number/',
    statement: 'Reverse the bits of a given 32-bit unsigned integer and return the result. Constraints: input is a 32-bit unsigned integer.',
    intuition: 'Iterate 32 times. Each iteration: shift result left by 1, take the LSB of n (n & 1) and OR it into result, then shift n right by 1. This processes bits from LSB to MSB of input while building the reversed result from MSB to LSB.',
    time_complexity: 'O(32) = O(1).',
    space_complexity: 'O(1).',
    code: `public class ReverseBits {
    static int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        // 43261596 = 00000010100101000001111010011100 -> reversed -> 964176192
        int n = 43261596;
        System.out.println(Integer.toBinaryString(n));          // 10100101000001111010011100
        System.out.println(reverseBits(n));                     // 964176192
        System.out.println(Integer.toBinaryString(Integer.reverse(n))); // verify

        // 0 -> 0
        System.out.println(reverseBits(0)); // 0
        // -1 (all 1s) -> -1
        System.out.println(reverseBits(-1)); // -1
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Number of Bits to Flip to Convert A to B',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/count-number-of-bits-to-be-flipped-to-convert-a-to-b/',
    statement: 'Given two integers A and B, find the number of bits that must be flipped to convert A to B. Constraints: 0 <= A, B <= 10^9.',
    intuition: 'XOR of A and B gives a number where each 1-bit represents a position where A and B differ. Count the number of 1-bits in (A XOR B) using Brian Kernighan\'s bit-clearing trick.',
    time_complexity: 'O(different bits count) — at most 32.',
    space_complexity: 'O(1).',
    code: `public class BitsToFlip {
    static int countFlips(int a, int b) {
        int xor = a ^ b;
        int count = 0;
        while (xor != 0) { xor &= (xor - 1); count++; }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countFlips(10, 20));  // 4  (1010 vs 10100 -> xor = 11110)
        System.out.println(countFlips(0, 255));  // 8
        System.out.println(countFlips(7, 10));   // 3  (0111 vs 1010 -> xor = 1101)
        System.out.println(countFlips(1, 1));    // 0
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Find the Missing Number',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/find-the-missing-number/',
    statement: 'Given an array of N-1 distinct integers in the range [1, N], find the one missing number. Constraints: 1 <= N <= 10^6.',
    intuition: 'XOR all numbers from 1 to N and XOR all array elements. XOR of two copies of the same number cancels; the missing number is never XORed twice, so it remains. Alternatively, use sum formula: N*(N+1)/2 minus the array sum. XOR is preferred to avoid overflow.',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1).',
    code: `public class MissingNumber {
    static int findMissing(int[] arr, int n) {
        int xor = 0;
        for (int i = 1; i <= n; i++) xor ^= i;
        for (int x : arr) xor ^= x;
        return xor;
    }

    // Alternative: sum formula
    static int findMissingSum(int[] arr, int n) {
        long expected = (long) n * (n + 1) / 2;
        long actual = 0;
        for (int x : arr) actual += x;
        return (int)(expected - actual);
    }

    public static void main(String[] args) {
        System.out.println(findMissing(new int[]{1,2,4,6,3,7,8}, 8));     // 5
        System.out.println(findMissing(new int[]{1,2,3,5}, 5));            // 4
        System.out.println(findMissingSum(new int[]{1,2,4,6,3,7,8}, 8));  // 5
    }
}`
  },
  {
    topic: 'Bit Magic',
    title: 'Swap All Odd and Even Bits',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/swap-all-odd-and-even-bits/',
    statement: 'Given a positive integer N, swap its odd and even bit positions (bit 0 with bit 1, bit 2 with bit 3, etc.) and return the result. Constraints: 1 <= N <= 10^9.',
    intuition: 'Extract even bits: n & 0xAAAAAAAA (mask for odd positions — bits 1,3,5,...), extract odd bits: n & 0x55555555 (bits 0,2,4,...). Shift even bits right by 1, shift odd bits left by 1, then OR them together. The hex constants alternate 1s and 0s in binary.',
    time_complexity: 'O(1) — constant bit operations.',
    space_complexity: 'O(1).',
    code: `public class SwapOddEvenBits {
    static int swapBits(int n) {
        // 0xAAAAAAAA = 10101010... (even positions in 0-indexed = odd bit positions)
        // 0x55555555 = 01010101... (odd positions in 0-indexed = even bit positions)
        int evenBits = n & 0xAAAAAAAA; // bits at positions 1,3,5,...
        int oddBits  = n & 0x55555555; // bits at positions 0,2,4,...
        return (evenBits >>> 1) | (oddBits << 1);
    }

    public static void main(String[] args) {
        // 23 = 10111, swap: 1->0,0->1,1->1 => 01011+1=? Let's compute:
        // 23 = 00010111, even bits (at odd positions): bit1=1,bit3=0,bit5=0 -> 00000010 = 2
        // odd bits (at even positions): bit0=1,bit2=1,bit4=1 -> 00010101 = 21
        // result = (2>>1)|(21<<1) = 1 | 42 = 43 = 00101011
        System.out.println(swapBits(23));  // 43
        System.out.println(Integer.toBinaryString(23));  // 10111
        System.out.println(Integer.toBinaryString(43));  // 101011

        System.out.println(swapBits(2));   // 1
        System.out.println(swapBits(3));   // 3  (11 -> 11, symmetric)
    }
}`
  }
];
