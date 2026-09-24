// Striver's 180 — Tries (5) + Strings (4) + Bit Manipulation (4) + Mathematics (1)
export default {

  // ── Tries › Trie ────────────────────────────────────────────────────────────

  'trie-implementation-and-advanced-operations': {
    difficulty: 'Medium',
    statement: 'Implement a trie supporting insert(word), countWordsEqualTo(word), countWordsStartingWith(prefix) and erase(word) (remove one occurrence of a word that is present). Words are lowercase.',
    intuition: "Give each node two counters: `prefix`, how many inserted words pass through it, and `end`, how many words end at it. insert walks the path, creating nodes as needed and incrementing prefix on each node and end on the last. countWordsEqualTo reads end at the word's last node. countWordsStartingWith reads prefix at the prefix's last node. erase walks the same path decrementing, so nothing needs to be deleted.",
    time: 'O(L) per operation for a word of length L',
    space: 'O(total characters inserted)',
    code: `public class Trie {
    private static class Node { Node[] next = new Node[26]; int prefix, end; }
    private final Node root = new Node();

    public void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();
            cur = cur.next[c - 'a'];
            cur.prefix++;
        }
        cur.end++;
    }
    public int countWordsEqualTo(String word) {
        Node n = walk(word);
        return n == null ? 0 : n.end;
    }
    public int countWordsStartingWith(String prefix) {
        Node n = walk(prefix);
        return n == null ? 0 : n.prefix;
    }
    public void erase(String word) {                        // word is guaranteed to be present
        Node cur = root;
        for (char c : word.toCharArray()) {
            cur = cur.next[c - 'a'];
            cur.prefix--;
        }
        cur.end--;
    }
    private Node walk(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            cur = cur.next[c - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }

    public static void main(String[] args) {
        Trie t = new Trie();
        t.insert("apple");
        System.out.println(t.countWordsEqualTo("apple"));    // 1
        t.insert("app");
        System.out.println(t.countWordsStartingWith("app")); // 2
        t.erase("apple");
        System.out.println(t.countWordsStartingWith("app")); // 1
        System.out.println(t.countWordsEqualTo("apple"));    // 0
    }
}`,
  },

  'longest-word-with-all-prefixes': {
    difficulty: 'Medium',
    statement: 'A word is "complete" if every one of its prefixes is also in the list. Return the longest complete word, choosing the lexicographically smallest on ties, or "None" if there is none.',
    intuition: "Put every word into a trie and mark the node where each word ends. A word is complete exactly when every node along its path is marked as a word end. Check each word by walking its path, which takes O(L), and keep the best one: longer wins, and for equal length the lexicographically smaller wins.",
    time: 'O(total characters)',
    space: 'O(total characters)',
    code: `public class CompleteString {
    private static class Node { Node[] next = new Node[26]; boolean end; }

    public static String completeString(String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char c : w.toCharArray()) {
                if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();
                cur = cur.next[c - 'a'];
            }
            cur.end = true;
        }
        String best = "";
        for (String w : words) {
            if (!allPrefixesPresent(root, w)) continue;
            if (w.length() > best.length() || (w.length() == best.length() && w.compareTo(best) < 0)) best = w;
        }
        return best.isEmpty() ? "None" : best;
    }
    private static boolean allPrefixesPresent(Node root, String w) {
        Node cur = root;
        for (char c : w.toCharArray()) {
            cur = cur.next[c - 'a'];
            if (!cur.end) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(completeString(new String[]{"n", "ni", "nin", "ninj", "ninja", "nil"}));  // ninja
        System.out.println(completeString(new String[]{"ab", "bc"}));                                // None
        System.out.println(completeString(new String[]{"a", "b", "ab", "ba"}));                      // ab
    }
}`,
  },

  'number-of-distinct-substrings-in-a-string': {
    difficulty: 'Medium',
    statement: 'Return the number of distinct substrings of a string, counting the empty substring.',
    intuition: "Every substring is a prefix of some suffix. Insert every suffix s[i..] into a trie. Each new node created corresponds to exactly one substring not seen before, the path from the root to that node. So the answer is the number of nodes created, plus 1 for the empty string. (A suffix array or suffix automaton can do this faster for very long strings.)",
    time: 'O(n²)',
    space: 'O(n²) — trie nodes in the worst case',
    code: `public class DistinctSubstrings {
    private static class Node { Node[] next = new Node[26]; }

    public static int countDistinctSubstrings(String s) {
        Node root = new Node();
        int created = 0;
        for (int i = 0; i < s.length(); i++) {
            Node cur = root;
            for (int j = i; j < s.length(); j++) {
                int c = s.charAt(j) - 'a';
                if (cur.next[c] == null) { cur.next[c] = new Node(); created++; }
                cur = cur.next[c];
            }
        }
        return created + 1;                                     // + the empty substring
    }

    public static void main(String[] args) {
        System.out.println(countDistinctSubstrings("aba")); // 6
        System.out.println(countDistinctSubstrings("abc")); // 7
        System.out.println(countDistinctSubstrings("aaa")); // 4
    }
}`,
  },

  'maximum-xor-of-two-numbers-in-an-array': {
    difficulty: 'Medium',
    statement: 'Given an array of non-negative integers, return the maximum value of nums[i] XOR nums[j].',
    intuition: "Put every number into a binary trie, one level per bit from bit 30 down to bit 0. To find the best partner for x, walk the trie from the top bit and prefer the opposite bit at each level, which makes that XOR bit 1. Fall back to the same bit when the opposite doesn't exist. Greedy works because a higher bit is worth more than all lower bits combined.",
    time: 'O(n · 31)',
    space: 'O(n · 31)',
    code: `public class MaxXorPair {
    private static class Node { Node[] child = new Node[2]; }

    public static int findMaximumXOR(int[] nums) {
        Node root = new Node();
        for (int x : nums) insert(root, x);
        int best = 0;
        for (int x : nums) best = Math.max(best, maxXor(root, x));
        return best;
    }
    static void insert(Node root, int x) {
        Node cur = root;
        for (int b = 30; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (cur.child[bit] == null) cur.child[bit] = new Node();
            cur = cur.child[bit];
        }
    }
    static int maxXor(Node root, int x) {
        Node cur = root;
        int res = 0;
        for (int b = 30; b >= 0; b--) {
            int want = ((x >> b) & 1) ^ 1;
            if (cur.child[want] != null) { res |= 1 << b; cur = cur.child[want]; }
            else cur = cur.child[want ^ 1];
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(findMaximumXOR(new int[]{3, 9, 10, 5, 1}));      // 15
        System.out.println(findMaximumXOR(new int[]{3, 10, 5, 25, 2, 8}));  // 28
        System.out.println(findMaximumXOR(new int[]{7}));                   // 0
    }
}`,
  },

  'maximum-xor-with-an-element-from-an-array': {
    difficulty: 'Hard',
    statement: 'Given non-negative nums and queries [x, m], answer each query with the maximum x XOR nums[j] over elements nums[j] ≤ m, or −1 if no element is ≤ m.',
    intuition: "Answer the queries offline. Sort nums, and sort the queries by m while remembering their original positions. Go through the queries in increasing m, inserting every num ≤ m into a binary trie before answering. The trie then holds exactly the allowed elements, and the usual greedy walk (prefer the opposite bit) gives the best XOR. An empty trie means −1.",
    time: 'O((n + q) · 31 + n log n + q log q)',
    space: 'O(n · 31)',
    code: `import java.util.*;

public class MaxXorWithLimit {
    private static class Node { Node[] child = new Node[2]; }

    public static int[] maximizeXor(int[] nums, int[][] queries) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        Integer[] order = new Integer[queries.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(queries[a][1], queries[b][1]));

        Node root = new Node();
        int[] ans = new int[queries.length];
        int j = 0;
        for (int qi : order) {
            int x = queries[qi][0], m = queries[qi][1];
            while (j < sorted.length && sorted[j] <= m) insert(root, sorted[j++]);
            ans[qi] = (j == 0) ? -1 : maxXor(root, x);
        }
        return ans;
    }
    static void insert(Node root, int x) {
        Node cur = root;
        for (int b = 30; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (cur.child[bit] == null) cur.child[bit] = new Node();
            cur = cur.child[bit];
        }
    }
    static int maxXor(Node root, int x) {
        Node cur = root;
        int res = 0;
        for (int b = 30; b >= 0; b--) {
            int want = ((x >> b) & 1) ^ 1;
            if (cur.child[want] != null) { res |= 1 << b; cur = cur.child[want]; }
            else cur = cur.child[want ^ 1];
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maximizeXor(new int[]{4, 9, 2, 5, 0, 1}, new int[][]{{3, 0}, {3, 10}, {7, 5}, {7, 9}}))); // [3, 10, 7, 14]
        System.out.println(Arrays.toString(maximizeXor(new int[]{0, 1, 2, 3, 4}, new int[][]{{3, 1}, {1, 3}, {5, 6}})));           // [3, 3, 7]
        System.out.println(Arrays.toString(maximizeXor(new int[]{5}, new int[][]{{1, 2}})));                                       // [-1]
    }
}`,
  },

  // ── Strings › String Matching ───────────────────────────────────────────────

  'rabin-karp-algorithm': {
    difficulty: 'Medium',
    statement: 'Using the Rabin–Karp algorithm, return the starting indices of all occurrences of pattern in text (an empty list if there are none).',
    intuition: "Hash the pattern, then slide a window of the same length across the text with a rolling hash. To move one step, remove the outgoing character's contribution (multiplied by base^(m−1)), multiply by the base and add the incoming character, all modulo a large prime. Each step is O(1). Equal hashes might be a collision, so confirm with a direct comparison before reporting an index.",
    time: 'O(n + m) expected; O(n · m) worst case with many collisions',
    space: 'O(1) besides the output',
    code: `import java.util.*;

public class RabinKarp {
    public static List<Integer> search(String text, String pat) {
        final long MOD = 1_000_000_007L, BASE = 131;
        int n = text.length(), m = pat.length();
        List<Integer> res = new ArrayList<>();
        if (m == 0 || m > n) return res;
        long hp = 0, ht = 0, pow = 1;                           // pow = BASE^(m-1)
        for (int i = 0; i < m; i++) {
            hp = (hp * BASE + pat.charAt(i)) % MOD;
            ht = (ht * BASE + text.charAt(i)) % MOD;
            if (i > 0) pow = pow * BASE % MOD;
        }
        for (int i = 0; ; i++) {
            if (hp == ht && text.regionMatches(i, pat, 0, m)) res.add(i);
            if (i + m == n) break;
            ht = (ht - text.charAt(i) * pow % MOD + MOD) % MOD;  // drop left char
            ht = (ht * BASE + text.charAt(i + m)) % MOD;        // add right char
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(search("ababcabcababc", "abc")); // [2, 5, 10]
        System.out.println(search("aaaaa", "aa"));          // [0, 1, 2, 3]
        System.out.println(search("abc", "d"));             // []
    }
}`,
  },

  'z-function': {
    difficulty: 'Medium',
    statement: 'Using the Z-function, return the 0-based starting indices of all occurrences of pattern in text.',
    intuition: "z[i] is the length of the longest substring starting at i that is also a prefix of the string. Build s = pattern + '#' + text, where the separator stops a match running past the pattern. Positions with z[i] == |pattern| are matches. The algorithm keeps the rightmost matching window [l, r) and starts each z[i] inside it from min(r − i, z[i − l]), so the total work is linear.",
    time: 'O(n + m)',
    space: 'O(n + m)',
    code: `import java.util.*;

public class ZFunction {
    public static List<Integer> search(String text, String pat) {
        String s = pat + "#" + text;
        int[] z = zArray(s);
        List<Integer> res = new ArrayList<>();
        for (int i = pat.length() + 1; i < s.length(); i++)
            if (z[i] == pat.length()) res.add(i - pat.length() - 1);
        return res;
    }
    static int[] zArray(String s) {
        int n = s.length();
        int[] z = new int[n];
        for (int i = 1, l = 0, r = 0; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }

    public static void main(String[] args) {
        System.out.println(search("xyzabxyzabxyz", "xyz")); // [0, 5, 10]
        System.out.println(search("aaaa", "aa"));           // [0, 1, 2]
        System.out.println(search("abc", "abcd"));          // []
    }
}`,
  },

  'kmp-algorithm-or-lps-array': {
    difficulty: 'Medium',
    statement: 'Using the Knuth–Morris–Pratt algorithm, return in ascending order the 0-based starting indices of all occurrences of pattern in text.',
    intuition: "The LPS array stores, for each prefix of the pattern, the length of its longest proper prefix that is also a suffix. When a mismatch happens after matching j characters, the last lps[j − 1] characters already match the start of the pattern, so jump j back to lps[j − 1] instead of starting over. The text pointer never moves backwards, which makes it linear. After a full match, record it and continue from lps[m − 1] so overlapping matches are found.",
    time: 'O(n + m)',
    space: 'O(m)',
    code: `import java.util.*;

public class KMP {
    public static List<Integer> search(String text, String pat) {
        int[] lps = lps(pat);
        List<Integer> res = new ArrayList<>();
        for (int i = 0, j = 0; i < text.length(); i++) {
            while (j > 0 && text.charAt(i) != pat.charAt(j)) j = lps[j - 1];
            if (text.charAt(i) == pat.charAt(j)) j++;
            if (j == pat.length()) { res.add(i - j + 1); j = lps[j - 1]; }
        }
        return res;
    }
    static int[] lps(String p) {
        int[] lps = new int[p.length()];
        for (int i = 1, len = 0; i < p.length(); i++) {
            while (len > 0 && p.charAt(i) != p.charAt(len)) len = lps[len - 1];
            if (p.charAt(i) == p.charAt(len)) len++;
            lps[i] = len;
        }
        return lps;
    }

    public static void main(String[] args) {
        System.out.println(search("abracadabra", "abra"));        // [0, 7]
        System.out.println(search("aaaa", "aa"));                 // [0, 1, 2]
        System.out.println(Arrays.toString(lps("aabaaab")));      // [0, 1, 0, 1, 2, 2, 3]
    }
}`,
  },

  'shortest-palindrome': {
    difficulty: 'Hard',
    statement: 'Turn a string into a palindrome by adding characters only at its front, and return the shortest palindrome you can make.',
    intuition: "Only the part after the longest palindromic prefix of s needs mirroring. Reverse that remainder and put it in front. To find the longest palindromic prefix in linear time, build t = s + '#' + reverse(s) and compute its KMP LPS array. The last LPS value is the longest prefix of s that is also a suffix of reverse(s), which is exactly the longest palindromic prefix.",
    time: 'O(n)',
    space: 'O(n)',
    code: `public class ShortestPalindrome {
    public static String shortestPalindrome(String s) {
        String rev = new StringBuilder(s).reverse().toString();
        String t = s + "#" + rev;
        int[] lps = new int[t.length()];
        for (int i = 1, len = 0; i < t.length(); i++) {
            while (len > 0 && t.charAt(i) != t.charAt(len)) len = lps[len - 1];
            if (t.charAt(i) == t.charAt(len)) len++;
            lps[i] = len;
        }
        int palPrefix = lps[t.length() - 1];
        return rev.substring(0, s.length() - palPrefix) + s;
    }

    public static void main(String[] args) {
        System.out.println(shortestPalindrome("aacecaaa")); // aaacecaaa
        System.out.println(shortestPalindrome("abcd"));     // dcbabcd
        System.out.println(shortestPalindrome("racecar"));  // racecar
    }
}`,
  },

  // ── Bit Manipulation › Bit Manipulation ─────────────────────────────────────

  'power-set-bit-manipulation': {
    difficulty: 'Medium',
    statement: 'Given an array of unique integers, return all its subsets using bit manipulation.',
    intuition: "Each subset of n elements matches one n-bit number: bit i is set exactly when nums[i] is included. So count mask from 0 to 2ⁿ − 1 and, for each mask, collect the elements whose bits are set, checked with (mask >> i) & 1. This lists every subset exactly once with no recursion.",
    time: 'O(n · 2ⁿ)',
    space: 'O(1) besides the output',
    code: `import java.util.*;

public class PowerSetBitmask {
    public static List<List<Integer>> powerSet(int[] nums) {
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++)
                if (((mask >> i) & 1) == 1) subset.add(nums[i]);
            res.add(subset);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(powerSet(new int[]{1, 2, 3})); // [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
        System.out.println(powerSet(new int[]{7}));       // [[], [7]]
    }
}`,
  },

  'single-number---ii': {
    difficulty: 'Medium',
    statement: 'Every element of an array appears three times except one, which appears once. Find that element in linear time and constant space.',
    intuition: "Count each bit position modulo 3. Bits from the triples add up to multiples of 3, so the leftover bits belong to the single number. The two masks `ones` and `twos` do this counting for all 32 positions at once: ones = (ones ^ x) & ~twos and twos = (twos ^ x) & ~ones. A bit seen once goes into ones, a second time moves it to twos, and a third time clears both. What's left in ones is the answer.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class SingleNumberII {
    public static int singleNumber(int[] nums) {
        int ones = 0, twos = 0;
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }

    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{2, 2, 2, 3}));                        // 3
        System.out.println(singleNumber(new int[]{0, 1, 0, 1, 0, 1, 99}));              // 99
        System.out.println(singleNumber(new int[]{-2, -2, 1, 1, 4, 1, 4, 4, -4, -2}));  // -4
    }
}`,
  },

  'single-number---iii': {
    difficulty: 'Medium',
    statement: 'Every element appears twice except two, which appear once each. Return those two in ascending order, in linear time and constant space.',
    intuition: "XOR everything to get x = a ^ b, which is non-zero because a ≠ b. Any set bit of x is a position where a and b differ. Take the lowest one, x & −x. Splitting all the numbers on that bit puts a and b in different groups, and every duplicated pair together in one group. XOR each group to get a and b.",
    time: 'O(n)',
    space: 'O(1)',
    code: `import java.util.*;

public class SingleNumberIII {
    public static int[] singleNumber(int[] nums) {
        int x = 0;
        for (int v : nums) x ^= v;
        int low = x & -x;                                       // a bit where the two differ
        int a = 0, b = 0;
        for (int v : nums) {
            if ((v & low) != 0) a ^= v; else b ^= v;
        }
        return a < b ? new int[]{a, b} : new int[]{b, a};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(singleNumber(new int[]{1, 2, 1, 3, 5, 2}))); // [3, 5]
        System.out.println(Arrays.toString(singleNumber(new int[]{-1, 0})));            // [-1, 0]
        System.out.println(Arrays.toString(singleNumber(new int[]{4, 7, 4, 9})));       // [7, 9]
    }
}`,
  },

  'find-the-repeating-and-missing-number': {
    difficulty: 'Medium',
    statement: 'An array of size n should hold 1 … n exactly once, but one value A appears twice and one value B is missing. Return [A, B] without modifying the array.',
    intuition: "Compare the array with 1 … n using two equations. Sums: S − n(n+1)/2 = A − B. Sums of squares: S₂ − n(n+1)(2n+1)/6 = A² − B² = (A − B)(A + B). Dividing the second by the first gives A + B, and then A and B follow. Use long, because the squares overflow int. (An XOR-partition method gives the same result without large numbers.)",
    time: 'O(n)',
    space: 'O(1)',
    code: `import java.util.*;

public class RepeatingAndMissing {
    public static int[] findMissingRepeatingNumbers(int[] nums) {
        long n = nums.length, s = 0, s2 = 0;
        for (int x : nums) { s += x; s2 += (long) x * x; }
        long diff = s - n * (n + 1) / 2;                          // A - B
        long sumSqDiff = s2 - n * (n + 1) * (2 * n + 1) / 6;      // A^2 - B^2
        long sum = sumSqDiff / diff;                              // A + B
        long a = (diff + sum) / 2, b = a - diff;
        return new int[]{(int) a, (int) b};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(findMissingRepeatingNumbers(new int[]{3, 5, 4, 1, 1})));        // [1, 2]
        System.out.println(Arrays.toString(findMissingRepeatingNumbers(new int[]{1, 2, 3, 6, 7, 5, 7})));  // [7, 4]
        System.out.println(Arrays.toString(findMissingRepeatingNumbers(new int[]{2, 2})));                 // [2, 1]
    }
}`,
  },

  // ── Mathematics › Number Theory ─────────────────────────────────────────────

  'print-all-primes-till-n': {
    difficulty: 'Easy',
    statement: 'Given n, return every prime number from 2 up to and including n.',
    intuition: "Sieve of Eratosthenes: start by assuming every number from 2 upwards is prime. For each p that is still marked prime with p² ≤ n, cross out its multiples starting at p², since smaller multiples were already crossed out by smaller primes. Whatever remains marked is prime. This is much faster than testing each number on its own.",
    time: 'O(n log log n)',
    space: 'O(n)',
    code: `import java.util.*;

public class SieveOfEratosthenes {
    public static List<Integer> primesUpTo(int n) {
        boolean[] composite = new boolean[n + 1];
        List<Integer> primes = new ArrayList<>();
        for (int p = 2; p <= n; p++) {
            if (composite[p]) continue;
            primes.add(p);
            for (long m = (long) p * p; m <= n; m += p) composite[(int) m] = true;
        }
        return primes;
    }

    public static void main(String[] args) {
        System.out.println(primesUpTo(7));   // [2, 3, 5, 7]
        System.out.println(primesUpTo(30));  // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
        System.out.println(primesUpTo(1));   // []
    }
}`,
  },
};
