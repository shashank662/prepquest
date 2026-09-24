// Striver's 180 — Recursion and Backtracking (10) + Linked List (16)
export default {

  // ── Recursion and Backtracking › Subsets & Combinations ─────────────────────

  'power-set': {
    difficulty: 'Medium',
    statement: 'Given an array of distinct integers, return all possible subsets (the power set). The result must not contain duplicate subsets.',
    intuition: "Backtracking over start indices: every call records the current path as one subset, then tries adding each remaining element nums[i] for i ≥ start, recurses from i + 1, and undoes the choice. Because we only look forward, each subset is built exactly once, 2ⁿ in total.",
    time: 'O(n · 2ⁿ) — 2ⁿ subsets, each copied in O(n)',
    space: 'O(n) recursion depth (excluding output)',
    code: `import java.util.*;

public class PowerSet {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        build(nums, 0, new ArrayList<>(), res);
        return res;
    }
    private static void build(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            build(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3})); // [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
        System.out.println(subsets(new int[]{0}));       // [[], [0]]
    }
}`,
  },

  'generate-parentheses': {
    difficulty: 'Medium',
    statement: 'Given n, generate every combination of n pairs of well-formed (balanced) parentheses.',
    intuition: "Build the string one character at a time and only make moves that can still lead to a valid answer: add '(' while fewer than n are open, and add ')' only while it would close an open one (close < open). Every leaf at length 2n is then valid, so there is no wasted work filtering bad strings.",
    time: 'O(4ⁿ / √n) — the n-th Catalan number of results',
    space: 'O(n) recursion depth',
    code: `import java.util.*;

public class GenerateParentheses {
    public static List<String> generate(int n) {
        List<String> res = new ArrayList<>();
        build(new StringBuilder(), 0, 0, n, res);
        return res;
    }
    private static void build(StringBuilder sb, int open, int close, int n, List<String> res) {
        if (sb.length() == 2 * n) { res.add(sb.toString()); return; }
        if (open < n)     { sb.append('('); build(sb, open + 1, close, n, res); sb.deleteCharAt(sb.length() - 1); }
        if (close < open) { sb.append(')'); build(sb, open, close + 1, n, res); sb.deleteCharAt(sb.length() - 1); }
    }

    public static void main(String[] args) {
        System.out.println(generate(3)); // [((())), (()()), (())(), ()(()), ()()()]
        System.out.println(generate(1)); // [()]
    }
}`,
  },

  'letter-combinations-of-a-phone-number': {
    difficulty: 'Medium',
    statement: 'Given a string of digits 2–9, return all letter combinations the number could represent on a phone keypad (2 → abc, 3 → def, … 9 → wxyz). Return an empty list for an empty input.',
    intuition: "Each digit is one level of the recursion tree and each letter it maps to is a branch. Walk the digits left to right, append each possible letter, recurse to the next digit, then remove the letter. When the path has one letter per digit, record it.",
    time: 'O(4ⁿ · n) — up to 4 letters per digit',
    space: 'O(n) recursion depth',
    code: `import java.util.*;

public class LetterCombinations {
    private static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    public static List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (!digits.isEmpty()) build(digits, 0, new StringBuilder(), res);
        return res;
    }
    private static void build(String d, int i, StringBuilder sb, List<String> res) {
        if (i == d.length()) { res.add(sb.toString()); return; }
        for (char c : KEYS[d.charAt(i) - '0'].toCharArray()) {
            sb.append(c);
            build(d, i + 1, sb, res);
            sb.deleteCharAt(sb.length() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(letterCombinations("23")); // [ad, ae, af, bd, be, bf, cd, ce, cf]
        System.out.println(letterCombinations(""));   // []
        System.out.println(letterCombinations("7"));  // [p, q, r, s]
    }
}`,
  },

  'combination-sum': {
    difficulty: 'Medium',
    statement: 'Given distinct positive candidates and a target, return all unique combinations whose sum equals the target. A candidate may be used any number of times.',
    intuition: "Backtrack with a start index so that combinations are built in non-decreasing index order, which prevents [2,3] and [3,2] from both appearing. After choosing candidates[i], recurse with the same i because it can be reused. With the candidates sorted, stop the loop as soon as a candidate exceeds the remaining target.",
    time: 'O(2^(target/min)) in the worst case',
    space: 'O(target/min) recursion depth',
    code: `import java.util.*;

public class CombinationSum {
    public static List<List<Integer>> combinationSum(int[] cands, int target) {
        Arrays.sort(cands);
        List<List<Integer>> res = new ArrayList<>();
        build(cands, 0, target, new ArrayList<>(), res);
        return res;
    }
    private static void build(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length && c[i] <= remain; i++) {
            path.add(c[i]);
            build(c, i, remain - c[i], path, res);     // i, not i + 1: reuse allowed
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2, 3, 6, 7}, 7)); // [[2, 2, 3], [7]]
        System.out.println(combinationSum(new int[]{2, 3, 5}, 8));    // [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
        System.out.println(combinationSum(new int[]{2}, 1));          // []
    }
}`,
  },

  'combination-sum-ii': {
    difficulty: 'Medium',
    statement: 'Given candidates (which may contain duplicates) and a target, return all unique combinations that sum to the target, where each candidate is used at most once.',
    intuition: "Sort first. Recurse with i + 1 since each element can be used only once. Duplicates are skipped at the same depth: if i > start and c[i] == c[i−1], choosing c[i] here would repeat a branch already explored with c[i−1]. Picking equal values at different depths is still allowed, so [1,1,6] survives.",
    time: 'O(2ⁿ · n)',
    space: 'O(n) recursion depth',
    code: `import java.util.*;

public class CombinationSumII {
    public static List<List<Integer>> combinationSum2(int[] c, int target) {
        Arrays.sort(c);
        List<List<Integer>> res = new ArrayList<>();
        build(c, 0, target, new ArrayList<>(), res);
        return res;
    }
    private static void build(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length && c[i] <= remain; i++) {
            if (i > start && c[i] == c[i - 1]) continue;   // same value at same depth
            path.add(c[i]);
            build(c, i + 1, remain - c[i], path, res);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(combinationSum2(new int[]{10, 1, 2, 7, 6, 1, 5}, 8)); // [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
        System.out.println(combinationSum2(new int[]{2, 5, 2, 1, 2}, 5));        // [[1, 2, 2], [5]]
    }
}`,
  },

  'subsets-ii': {
    difficulty: 'Medium',
    statement: 'Given an integer array that may contain duplicates, return all possible subsets without duplicate subsets.',
    intuition: "This is Power Set plus the duplicate-skip rule from Combination Sum II. Sort the array. At each depth, skip nums[i] when it equals nums[i−1] and i > start, because that value has already started a branch at this level. Record every path as a subset.",
    time: 'O(n · 2ⁿ)',
    space: 'O(n) recursion depth',
    code: `import java.util.*;

public class SubsetsII {
    public static List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        build(nums, 0, new ArrayList<>(), res);
        return res;
    }
    private static void build(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.add(nums[i]);
            build(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(subsetsWithDup(new int[]{1, 2, 2})); // [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
        System.out.println(subsetsWithDup(new int[]{0}));       // [[], [0]]
    }
}`,
  },

  'palindrome-partitioning': {
    difficulty: 'Medium',
    statement: 'Given a string s, split it into substrings so that every substring is a palindrome. Return all such partitions.',
    intuition: "From position start, try every end index. If s[start..end] is a palindrome, take it as the next piece and recurse from end + 1. When start reaches the end of the string, the current list of pieces is one valid partition. A two-pointer palindrome check is enough at this size.",
    time: 'O(n · 2ⁿ) — up to 2ⁿ⁻¹ partitions, O(n) palindrome checks',
    space: 'O(n) recursion depth',
    code: `import java.util.*;

public class PalindromePartitioning {
    public static List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        build(s, 0, new ArrayList<>(), res);
        return res;
    }
    private static void build(String s, int start, List<String> path, List<List<String>> res) {
        if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
        for (int end = start; end < s.length(); end++) {
            if (!isPal(s, start, end)) continue;
            path.add(s.substring(start, end + 1));
            build(s, end + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
    private static boolean isPal(String s, int i, int j) {
        while (i < j) if (s.charAt(i++) != s.charAt(j--)) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(partition("aab")); // [[a, a, b], [aa, b]]
        System.out.println(partition("a"));   // [[a]]
    }
}`,
  },

  // ── Recursion and Backtracking › Backtracking ───────────────────────────────

  'word-search': {
    difficulty: 'Medium',
    statement: 'Given an m × n grid of letters and a word, return true if the word can be formed from letters of sequentially adjacent cells (up/down/left/right), without reusing a cell.',
    intuition: "Try every cell as a starting point and DFS while the letters match. To mark a cell as used on the current path, overwrite it with '#' and restore it on the way back. This is the backtracking step, and it avoids a separate visited array. Return as soon as the whole word has been matched.",
    time: 'O(m · n · 3^L) — every start, then ≤ 3 new directions per letter',
    space: 'O(L) recursion depth',
    code: `public class WordSearch {
    public static boolean exist(char[][] b, String word) {
        for (int r = 0; r < b.length; r++)
            for (int c = 0; c < b[0].length; c++)
                if (dfs(b, word, 0, r, c)) return true;
        return false;
    }
    private static boolean dfs(char[][] b, String w, int i, int r, int c) {
        if (i == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
        char saved = b[r][c];
        b[r][c] = '#';
        boolean found = dfs(b, w, i + 1, r + 1, c) || dfs(b, w, i + 1, r - 1, c)
                     || dfs(b, w, i + 1, r, c + 1) || dfs(b, w, i + 1, r, c - 1);
        b[r][c] = saved;
        return found;
    }

    public static void main(String[] args) {
        char[][] b = {{'A', 'B', 'C', 'E'}, {'S', 'F', 'C', 'S'}, {'A', 'D', 'E', 'E'}};
        System.out.println(exist(b, "ABCCED")); // true
        System.out.println(exist(b, "SEE"));    // true
        System.out.println(exist(b, "ABCB"));   // false
    }
}`,
  },

  'n-queen': {
    difficulty: 'Hard',
    statement: 'Place n queens on an n × n chessboard so that no two attack each other. Return all distinct board configurations (as rows of "Q" and ".").',
    intuition: "Place one queen per row. For each row, try every column that isn't attacked. A cell (r, c) is attacked if its column, its main diagonal (r − c), or its anti-diagonal (r + c) is already taken. Three boolean arrays make that check O(1). Mark them on the way down and clear them on the way back. When row n is reached, a full board has been built.",
    time: 'O(n!) — the row-by-row pruning bounds the branching',
    space: 'O(n) — column/diagonal flags + recursion',
    code: `import java.util.*;

public class NQueens {
    public static List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        int[] colOf = new int[n];
        place(0, n, colOf, new boolean[n], new boolean[2 * n], new boolean[2 * n], res);
        return res;
    }
    private static void place(int r, int n, int[] colOf, boolean[] cols, boolean[] d1, boolean[] d2,
                              List<List<String>> res) {
        if (r == n) { res.add(render(colOf)); return; }
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;
            cols[c] = d1[r - c + n] = d2[r + c] = true;
            colOf[r] = c;
            place(r + 1, n, colOf, cols, d1, d2, res);
            cols[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
    private static List<String> render(int[] colOf) {
        List<String> board = new ArrayList<>();
        for (int c : colOf) {
            char[] row = new char[colOf.length];
            Arrays.fill(row, '.');
            row[c] = 'Q';
            board.add(new String(row));
        }
        return board;
    }

    public static void main(String[] args) {
        System.out.println(solveNQueens(4));        // [[.Q.., ...Q, Q..., ..Q.], [..Q., Q..., ...Q, .Q..]]
        System.out.println(solveNQueens(8).size()); // 92
    }
}`,
  },

  'sudoko-solver': {
    difficulty: 'Hard',
    statement: "Fill a 9 × 9 Sudoku board in place, where '.' marks an empty cell, so that each row, column and 3 × 3 box contains the digits 1–9 exactly once. The puzzle has exactly one solution.",
    intuition: "Find the next empty cell and try the digits 1–9. Keep bitmasks of the digits already used in each row, column and box so a digit's validity is an O(1) check. Place a valid digit, recurse, and undo it if the recursion fails. The first time every cell is filled, the board is solved.",
    time: 'O(9^e) worst case for e empty cells — pruning makes real puzzles fast',
    space: 'O(e) recursion depth',
    code: `public class SudokuSolver {
    private static int[] rows = new int[9], cols = new int[9], boxes = new int[9];

    public static void solveSudoku(char[][] b) {
        rows = new int[9]; cols = new int[9]; boxes = new int[9];
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                if (b[r][c] != '.') mark(r, c, b[r][c] - '1', true);
        solve(b, 0);
    }
    private static boolean solve(char[][] b, int cell) {
        if (cell == 81) return true;
        int r = cell / 9, c = cell % 9;
        if (b[r][c] != '.') return solve(b, cell + 1);
        int box = (r / 3) * 3 + c / 3;
        for (int d = 0; d < 9; d++) {
            int bit = 1 << d;
            if ((rows[r] & bit) != 0 || (cols[c] & bit) != 0 || (boxes[box] & bit) != 0) continue;
            mark(r, c, d, true);
            b[r][c] = (char) ('1' + d);
            if (solve(b, cell + 1)) return true;
            b[r][c] = '.';
            mark(r, c, d, false);
        }
        return false;
    }
    private static void mark(int r, int c, int d, boolean on) {
        int bit = 1 << d, box = (r / 3) * 3 + c / 3;
        if (on) { rows[r] |= bit; cols[c] |= bit; boxes[box] |= bit; }
        else    { rows[r] &= ~bit; cols[c] &= ~bit; boxes[box] &= ~bit; }
    }

    public static void main(String[] args) {
        String[] puzzle = {"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1",
                           "7...2...6", ".6....28.", "...419..5", "....8..79"};
        char[][] b = new char[9][];
        for (int i = 0; i < 9; i++) b[i] = puzzle[i].toCharArray();
        solveSudoku(b);
        System.out.println(new String(b[0])); // 534678912
        System.out.println(new String(b[4])); // 426853791
        System.out.println(new String(b[8])); // 345286179
    }
}`,
  },

  // ── Linked List › Fast & Slow Pointers ──────────────────────────────────────

  'find-middle-of-linked-list': {
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, return its middle node. If there are two middle nodes, return the second one.',
    intuition: "Tortoise and hare: slow moves one step and fast moves two. When fast runs off the end, slow has covered half the distance and sits on the middle. With an even length, the loop condition (fast != null && fast.next != null) leaves slow on the second middle.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class MiddleOfLinkedList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }

    public static void main(String[] args) {
        System.out.println(middleNode(build(1, 2, 3, 4, 5)).val);    // 3
        System.out.println(middleNode(build(1, 2, 3, 4, 5, 6)).val); // 4
        System.out.println(middleNode(build(9)).val);                // 9
    }
}`,
  },

  'find-the-intersection-point-of-y-ll': {
    difficulty: 'Easy',
    statement: 'Given the heads of two singly linked lists that may merge into a Y shape, return the node where they intersect, or null if they never meet.',
    intuition: "Walk pointer a through list A and then list B, and pointer b through list B and then list A. Both travel lenA + lenB nodes in total, so they reach the shared tail at the same moment and meet at the intersection. If there is no intersection, they both reach null together. There is no need to compute the lengths.",
    time: 'O(m + n)',
    space: 'O(1)',
    code: `public class IntersectionOfLists {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }
        return a;
    }

    public static void main(String[] args) {
        ListNode common = new ListNode(8);
        common.next = new ListNode(4);
        common.next.next = new ListNode(5);
        ListNode a = new ListNode(4); a.next = new ListNode(1); a.next.next = common;
        ListNode b = new ListNode(5); b.next = new ListNode(6); b.next.next = new ListNode(1); b.next.next.next = common;
        System.out.println(getIntersectionNode(a, b).val);                  // 8
        System.out.println(getIntersectionNode(new ListNode(1), new ListNode(2))); // null
    }
}`,
  },

  'check-if-ll-is-palindrome-or-not': {
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, return true if its values read the same forwards and backwards, using O(1) extra space.',
    intuition: "Find the middle with slow and fast pointers, then reverse the second half in place. Walk the first half and the reversed second half side by side and compare values. Reversing the second half back afterwards restores the input, which is good practice because the caller still owns the list.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class PalindromeLinkedList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode second = reverse(slow), p = head, q = second;
        boolean ok = true;
        while (q != null) {
            if (p.val != q.val) { ok = false; break; }
            p = p.next; q = q.next;
        }
        reverse(second);                                   // restore the list
        return ok;
    }
    private static ListNode reverse(ListNode h) {
        ListNode prev = null;
        while (h != null) { ListNode nx = h.next; h.next = prev; prev = h; h = nx; }
        return prev;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome(build(1, 2, 2, 1)));    // true
        System.out.println(isPalindrome(build(1, 2, 3, 2, 1))); // true
        System.out.println(isPalindrome(build(1, 2)));          // false
    }
}`,
  },

  'detect-a-loop-in-ll': {
    difficulty: 'Easy',
    statement: 'Given the head of a linked list, return true if the list contains a cycle.',
    intuition: "Floyd's cycle detection: slow moves one node per step and fast moves two. With no cycle, fast reaches null. With a cycle, both pointers end up going round the loop, and fast gains one node on slow each step, so it catches slow within one lap.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class DetectCycle {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        ListNode a = new ListNode(3), b = new ListNode(2), c = new ListNode(0), d = new ListNode(-4);
        a.next = b; b.next = c; c.next = d; d.next = b;          // cycle back to node 2
        System.out.println(hasCycle(a));                         // true
        ListNode e = new ListNode(1); e.next = new ListNode(2);
        System.out.println(hasCycle(e));                         // false
    }
}`,
  },

  'remove-nth-node-from-the-back-of-the-ll': {
    difficulty: 'Medium',
    statement: 'Given the head of a linked list, remove the n-th node from the end and return the head, in one pass.',
    intuition: "Start two pointers at a dummy node placed before head. Move fast n + 1 steps ahead, then move both until fast is null. slow is now just before the node to delete, so set slow.next = slow.next.next. The dummy handles the case where the head itself is removed.",
    time: 'O(L) — one pass',
    space: 'O(1)',
    code: `public class RemoveNthFromEnd {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode slow = dummy, fast = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { slow = slow.next; fast = fast.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(removeNthFromEnd(build(1, 2, 3, 4, 5), 2))); // [1, 2, 3, 5]
        System.out.println(str(removeNthFromEnd(build(1), 1)));             // []
        System.out.println(str(removeNthFromEnd(build(1, 2), 2)));          // [2]
    }
}`,
  },

  'find-the-starting-point-in-ll': {
    difficulty: 'Medium',
    statement: 'Given the head of a linked list, return the node where a cycle begins, or null if there is no cycle.',
    intuition: "Run Floyd's algorithm until slow and fast meet. Let the distance from head to the cycle start be a, and from the start to the meeting point be b. Because fast moved twice as far, a is congruent to (cycle length − b), so a is exactly the distance from the meeting point forward to the start. Reset one pointer to head, move both one step at a time, and they meet at the cycle start.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class CycleStart {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                for (slow = head; slow != fast; slow = slow.next) fast = fast.next;
                return slow;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        ListNode a = new ListNode(3), b = new ListNode(2), c = new ListNode(0), d = new ListNode(-4);
        a.next = b; b.next = c; c.next = d; d.next = b;
        System.out.println(detectCycle(a).val);           // 2
        ListNode e = new ListNode(1); e.next = e;
        System.out.println(detectCycle(e).val);           // 1
        System.out.println(detectCycle(new ListNode(7))); // null
    }
}`,
  },

  'length-of-loop-in-ll': {
    difficulty: 'Easy',
    statement: 'Given the head of a linked list, return the number of nodes in its cycle, or 0 if there is no cycle.',
    intuition: "Use Floyd's algorithm to find a meeting point, which is guaranteed to be inside the loop. From there, walk around the loop with one pointer, counting steps until it returns to the meeting node. That count is the loop length.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class LoopLength {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static int lengthOfLoop(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                int len = 1;
                for (ListNode p = slow.next; p != slow; p = p.next) len++;
                return len;
            }
        }
        return 0;
    }

    public static void main(String[] args) {
        ListNode[] n = new ListNode[5];
        for (int i = 0; i < 5; i++) n[i] = new ListNode(i + 1);
        for (int i = 0; i < 4; i++) n[i].next = n[i + 1];
        n[4].next = n[1];                                   // loop 2 -> 3 -> 4 -> 5 -> 2
        System.out.println(lengthOfLoop(n[0]));             // 4
        ListNode s = new ListNode(1); s.next = s;
        System.out.println(lengthOfLoop(s));                // 1
        System.out.println(lengthOfLoop(new ListNode(1)));  // 0
    }
}`,
  },

  // ── Linked List › Reversal & Rewiring ───────────────────────────────────────

  'reverse-a-ll': {
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, reverse the list and return the new head.',
    intuition: "Walk the list with prev (initially null) and cur. For each node, save cur.next, point cur.next back to prev, then move prev and cur one step forward. When cur becomes null, prev is the old tail, which is the new head.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class ReverseLinkedList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(reverseList(build(1, 2, 3, 4, 5)))); // [5, 4, 3, 2, 1]
        System.out.println(str(reverseList(build(1, 2))));          // [2, 1]
        System.out.println(str(reverseList(null)));                 // []
    }
}`,
  },

  'merge-sorted-lists-': {
    difficulty: 'Easy',
    statement: 'Merge two sorted linked lists into one sorted list by splicing their nodes together, and return its head.',
    intuition: "Use a dummy head and a tail pointer. Repeatedly attach the smaller of the two front nodes and advance in that list. When one list runs out, attach the rest of the other list in one step, since it is already sorted. No new nodes are created.",
    time: 'O(m + n)',
    space: 'O(1)',
    code: `public class MergeTwoSortedLists {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else                { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(merge(build(1, 2, 4), build(1, 3, 4)))); // [1, 1, 2, 3, 4, 4]
        System.out.println(str(merge(null, build(0))));                 // [0]
    }
}`,
  },

  "sort-a-ll-of-0's-1's-and-2's": {
    difficulty: 'Medium',
    statement: 'Given a linked list whose values are only 0, 1 or 2, sort it by rearranging the links (not by overwriting values) in a single pass.',
    intuition: "Keep three sub-lists (zeros, ones, twos), each with its own dummy head and tail. Walk the list once and append each node to the matching sub-list. Then join them: zeros.tail → ones.head, or twos.head if there are no 1s, and ones.tail → twos.head. End the list with null. It's stable, O(1) space, and one pass.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class SortList012 {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode sort012(ListNode head) {
        ListNode zD = new ListNode(0), oD = new ListNode(0), tD = new ListNode(0);
        ListNode z = zD, o = oD, t = tD;
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (cur.val == 0)      z = z.next = cur;
            else if (cur.val == 1) o = o.next = cur;
            else                   t = t.next = cur;
        }
        z.next = (oD.next != null) ? oD.next : tD.next;
        o.next = tD.next;
        t.next = null;
        return zD.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(sort012(build(1, 2, 2, 1, 2, 0, 2, 2)))); // [0, 1, 1, 2, 2, 2, 2, 2]
        System.out.println(str(sort012(build(2, 0, 2))));                // [0, 2, 2]
    }
}`,
  },

  'add-two-numbers-in-ll': {
    difficulty: 'Medium',
    statement: 'Two non-negative numbers are stored as linked lists with their digits in reverse order (ones digit first). Return their sum as a linked list in the same format.',
    intuition: "Because the ones digit comes first, this is grade-school addition from the right. Walk both lists together and add the two digits plus the carry. The new node holds sum % 10 and the carry becomes sum / 10. Keep going while either list has nodes or carry is non-zero, so a final carry becomes its own node.",
    time: 'O(max(m, n))',
    space: 'O(1) extra besides the output list',
    code: `public class AddTwoNumbers {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        int carry = 0;
        while (a != null || b != null || carry != 0) {
            int sum = carry;
            if (a != null) { sum += a.val; a = a.next; }
            if (b != null) { sum += b.val; b = b.next; }
            tail = tail.next = new ListNode(sum % 10);
            carry = sum / 10;
        }
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(addTwoNumbers(build(2, 4, 3), build(5, 6, 4))));       // [7, 0, 8]
        System.out.println(str(addTwoNumbers(build(9, 9, 9, 9), build(9, 9))));       // [8, 9, 0, 0, 1]
        System.out.println(str(addTwoNumbers(build(0), build(0))));                   // [0]
    }
}`,
  },

  'rotate-a-ll': {
    difficulty: 'Medium',
    statement: 'Given the head of a linked list, rotate the list to the right by k places.',
    intuition: "Find the length n and the tail in one pass. Rotating by k is the same as rotating by k % n. Link the tail to the head to make a ring, walk n − k % n steps from the old tail to reach the new tail, then cut the ring after it. The node after the new tail becomes the new head.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class RotateList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) return head;
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) { tail = tail.next; n++; }
        k %= n;
        if (k == 0) return head;
        tail.next = head;                                 // make it a ring
        for (int i = 0; i < n - k; i++) tail = tail.next; // new tail
        ListNode newHead = tail.next;
        tail.next = null;
        return newHead;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(rotateRight(build(1, 2, 3, 4, 5), 2))); // [4, 5, 1, 2, 3]
        System.out.println(str(rotateRight(build(0, 1, 2), 4)));       // [2, 0, 1]
        System.out.println(str(rotateRight(build(1, 2), 2)));          // [1, 2]
    }
}`,
  },

  'sort-ll': {
    difficulty: 'Medium',
    statement: 'Sort a linked list in ascending order in O(n log n) time.',
    intuition: "Merge sort suits linked lists: splitting needs no random access, and merging needs no extra array. Find the middle with slow and fast pointers (starting fast one node ahead so a 2-node list splits evenly), cut the list there, sort each half recursively, and merge the two sorted halves.",
    time: 'O(n log n)',
    space: 'O(log n) — recursion depth',
    code: `public class SortLinkedList {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode right = slow.next;
        slow.next = null;
        return merge(sortList(head), sortList(right));
    }
    private static ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), t = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = (a != null) ? a : b;
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(sortList(build(4, 2, 1, 3))));      // [1, 2, 3, 4]
        System.out.println(str(sortList(build(-1, 5, 3, 4, 0)))); // [-1, 0, 3, 4, 5]
    }
}`,
  },

  'clone-a-ll-with-random-and-next-pointer': {
    difficulty: 'Medium',
    statement: 'Each node of a linked list has a next pointer and a random pointer (to any node or null). Return a deep copy of the list.',
    intuition: "Interleaving trick with O(1) extra space. (1) Insert each copy right after its original: A → A' → B → B'. (2) Set each copy's random: A'.random = A.random.next, because the copy of any node is the node right after it. (3) Unweave the two lists, restoring the originals' next pointers and linking the copies together.",
    time: 'O(n) — three passes',
    space: 'O(1) extra besides the copy',
    code: `public class CopyRandomList {
    static class Node { int val; Node next, random; Node(int v) { val = v; } }

    public static Node copyRandomList(Node head) {
        for (Node cur = head; cur != null; cur = cur.next.next) {
            Node copy = new Node(cur.val);
            copy.next = cur.next;
            cur.next = copy;
        }
        for (Node cur = head; cur != null; cur = cur.next.next)
            if (cur.random != null) cur.next.random = cur.random.next;
        Node dummy = new Node(0), tail = dummy;
        for (Node cur = head; cur != null; cur = cur.next) {
            tail = tail.next = cur.next;
            cur.next = cur.next.next;
        }
        return dummy.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next)
            sb.append("[").append(h.val).append(",").append(h.random == null ? "null" : String.valueOf(h.random.val))
              .append("]").append(h.next != null ? " " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        Node a = new Node(7), b = new Node(13), c = new Node(11), d = new Node(10), e = new Node(1);
        a.next = b; b.next = c; c.next = d; d.next = e;
        b.random = a; c.random = e; d.random = c; e.random = a;
        Node copy = copyRandomList(a);
        System.out.println(str(copy));   // [[7,null] [13,7] [11,1] [10,11] [1,7]]
        System.out.println(copy != a && copy.next.random != a); // true
        System.out.println(str(a));      // [[7,null] [13,7] [11,1] [10,11] [1,7]]
    }
}`,
  },

  'reverse-ll-in-group-of-given-size-k': {
    difficulty: 'Hard',
    statement: 'Given a linked list and k, reverse the nodes k at a time and return the modified list. Leftover nodes at the end (fewer than k) stay in their original order.',
    intuition: "Walk group by group, keeping groupPrev, the node just before the current group (a dummy at first). Check that k more nodes exist. If not, stop. Reverse those k nodes the usual way, with the node after the group as the starting 'prev' so the reversed group links straight to the rest. Then connect groupPrev to the new group head, and the old group head (now its tail) becomes the next groupPrev.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class ReverseKGroup {
    static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

    public static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) {
                ListNode nx = cur.next;
                cur.next = prev;
                prev = cur;
                cur = nx;
            }
            ListNode oldHead = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = oldHead;
        }
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int v : vals) t = t.next = new ListNode(v);
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        for (; h != null; h = h.next) sb.append(h.val).append(h.next != null ? ", " : "");
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(reverseKGroup(build(1, 2, 3, 4, 5), 2))); // [2, 1, 4, 3, 5]
        System.out.println(str(reverseKGroup(build(1, 2, 3, 4, 5), 3))); // [3, 2, 1, 4, 5]
        System.out.println(str(reverseKGroup(build(1, 2, 3), 1)));       // [1, 2, 3]
    }
}`,
  },

  'flattening-of-ll': {
    difficulty: 'Medium',
    statement: 'Each node of a linked list has a next pointer (to the next list along the top) and a child pointer (down a sorted sub-list). Every vertical sub-list is sorted. Flatten everything into one sorted list linked through child pointers. This is closely related to "Merge k Sorted Lists".',
    intuition: "Merge the vertical lists one at a time, starting from the right. Recursively flatten head.next, which gives one sorted child-linked list, then merge head's own vertical list into it just like merging two sorted lists. A min-heap over all heads would also work in O(N log k).",
    time: 'O(N · k) for N total nodes and k vertical lists',
    space: 'O(k) — recursion depth',
    code: `public class FlattenLinkedList {
    static class Node { int val; Node next, child; Node(int v) { val = v; } }

    public static Node flatten(Node head) {
        if (head == null || head.next == null) return head;
        Node rest = flatten(head.next);
        head.next = null;
        return merge(head, rest);
    }
    private static Node merge(Node a, Node b) {
        Node dummy = new Node(0), t = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.child = a; a = a.child; } else { t.child = b; b = b.child; }
            t = t.child;
            t.next = null;
        }
        t.child = (a != null) ? a : b;
        return dummy.child;
    }

    static Node column(int... vals) {
        Node dummy = new Node(0), t = dummy;
        for (int v : vals) t = t.child = new Node(v);
        return dummy.child;
    }

    public static void main(String[] args) {
        Node h = column(5, 7, 8, 30);
        h.next = column(10, 20);
        h.next.next = column(19, 22, 50);
        h.next.next.next = column(28, 35, 40, 45);
        StringBuilder sb = new StringBuilder();
        for (Node p = flatten(h); p != null; p = p.child) sb.append(p.val).append(p.child != null ? " " : "");
        System.out.println(sb); // 5 7 8 10 19 20 22 28 30 35 40 45 50
    }
}`,
  },
};
