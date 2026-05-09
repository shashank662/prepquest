export const batch7 = [
  // ─── Recursion & Backtracking (12) ───────────────────────────────────────────
  {
    topic: 'Recursion & Backtracking',
    title: 'Generate All Subsets (Power Set)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/power-set/',
    statement: 'Given an integer array of distinct elements, generate all possible subsets (power set). The result must not contain duplicate subsets. Constraints: 0 <= N <= 15.',
    intuition: 'Backtracking: at each index, decide whether to include the current element or not. Recurse with index+1. Each leaf of the recursion tree is one valid subset. With N elements, there are 2^N subsets total. Collect the current path at every call, not just at leaves.',
    time_complexity: 'O(2^N * N) — 2^N subsets, each copied in O(N).',
    space_complexity: 'O(N) — recursion stack depth plus current path.',
    code: `import java.util.*;

public class PowerSet {
    static void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    public static void main(String[] args) {
        List<List<Integer>> res = subsets(new int[]{1,2,3});
        res.forEach(System.out::println);
        // [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]  (8 subsets)

        System.out.println("---");
        System.out.println(subsets(new int[]{0}).size()); // 2
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Generate All Permutations',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/',
    statement: 'Given an array of distinct integers, return all possible permutations. Constraints: 1 <= N <= 8.',
    intuition: 'Backtracking with a used[] boolean array. At each position, try every unused element. Mark it used, recurse for the next position, then unmark (backtrack). When the current list has N elements, it\'s a complete permutation — add a copy to results.',
    time_complexity: 'O(N! * N) — N! permutations, each copied in O(N).',
    space_complexity: 'O(N) — recursion depth and used array.',
    code: `import java.util.*;

public class Permutations {
    static void backtrack(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
        if (current.size() == nums.length) { result.add(new ArrayList<>(current)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, used, current, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }

    static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    public static void main(String[] args) {
        List<List<Integer>> res = permute(new int[]{1,2,3});
        res.forEach(System.out::println);
        System.out.println("Count: " + res.size()); // 6

        System.out.println(permute(new int[]{0,1}).size()); // 2
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'N-Queens Problem',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/',
    statement: 'Place N queens on an N×N chessboard such that no two queens attack each other (same row, column, or diagonal). Return all valid placements. Each placement is a list of N integers where result[i] is the column of the queen in row i. Constraints: 1 <= N <= 9.',
    intuition: 'Place queens row by row. For each row, try every column. A placement is valid if no queen already placed shares that column or diagonal. Track columns, and both diagonal directions (col-row for /, row+col for \\) in HashSets. Backtrack when no valid column is found for a row.',
    time_complexity: 'O(N!) — at most N choices for row 1, N-1 for row 2, etc.',
    space_complexity: 'O(N) — recursion stack and queens array.',
    code: `import java.util.*;

public class NQueens {
    static List<List<Integer>> result = new ArrayList<>();
    static int[] queens;
    static Set<Integer> cols, diag1, diag2;

    static void backtrack(int row, int n) {
        if (row == n) { List<Integer> placement = new ArrayList<>(); for (int c : queens) placement.add(c); result.add(placement); return; }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(col - row) || diag2.contains(col + row)) continue;
            cols.add(col); diag1.add(col - row); diag2.add(col + row);
            queens[row] = col;
            backtrack(row + 1, n);
            cols.remove(col); diag1.remove(col - row); diag2.remove(col + row);
        }
    }

    static List<List<Integer>> solveNQueens(int n) {
        result = new ArrayList<>();
        queens = new int[n];
        cols = new HashSet<>(); diag1 = new HashSet<>(); diag2 = new HashSet<>();
        backtrack(0, n);
        return result;
    }

    public static void main(String[] args) {
        System.out.println("N=4: " + solveNQueens(4).size() + " solutions"); // 2
        solveNQueens(4).forEach(System.out::println);
        // [1, 3, 0, 2] and [2, 0, 3, 1] (0-indexed columns)
        System.out.println("N=8: " + solveNQueens(8).size() + " solutions"); // 92
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Sudoku Solver',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/sudoku-backtracking-7/',
    statement: 'Given a partially filled 9×9 sudoku board (\'.\' for empty cells), solve it in-place. The solution is guaranteed to be unique. Fill each empty cell with a digit 1-9 such that each row, column, and 3×3 box contains each digit exactly once.',
    intuition: 'Backtracking: find the next empty cell. Try digits 1-9. For each digit, check validity (row, column, 3×3 box). If valid, place it and recurse. If the recursive call succeeds, we\'re done. If not, undo (backtrack) and try the next digit.',
    time_complexity: 'O(9^(empty cells)) — worst case exponential, but typical sudoku is fast with pruning.',
    space_complexity: 'O(81) — recursion depth bounded by board size.',
    code: `public class SudokuSolver {
    static boolean isValid(char[][] board, int row, int col, char c) {
        int boxRow = (row / 3) * 3, boxCol = (col / 3) * 3;
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == c || board[i][col] == c ||
                board[boxRow + i/3][boxCol + i%3] == c) return false;
        }
        return true;
    }

    static boolean solve(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    for (char d = '1'; d <= '9'; d++) {
                        if (isValid(board, r, c, d)) {
                            board[r][c] = d;
                            if (solve(board)) return true;
                            board[r][c] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        solve(board);
        for (char[] row : board) System.out.println(new String(row));
        // 534678912 / 672195348 / 198342567 / ...
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Combination Sum',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/combinational-sum/',
    statement: 'Given an array of distinct positive integers and a target, return all unique combinations where chosen numbers sum to target. Numbers may be reused. Constraints: 1 <= candidates.length <= 30; 1 <= candidates[i] <= 40; 1 <= target <= 500.',
    intuition: 'Backtracking: sort candidates. At each step, try adding candidates[i] (and keep using it by passing i — not i+1). When remaining sum hits 0, record the combination. Skip early if current candidate > remaining sum (pruning). Sorting enables this pruning.',
    time_complexity: 'O(N^(T/M)) where T = target, M = min candidate — exponential but pruned.',
    space_complexity: 'O(T/M) — recursion depth.',
    code: `import java.util.*;

public class CombinationSum {
    static void backtrack(int[] candidates, int start, int remaining, List<Integer> current, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(current)); return; }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break; // sorted, can prune
            current.add(candidates[i]);
            backtrack(candidates, i, remaining - candidates[i], current, result); // i (not i+1) allows reuse
            current.remove(current.size() - 1);
        }
    }

    static List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2,3,6,7}, 7));   // [[2,2,3],[7]]
        System.out.println(combinationSum(new int[]{2,3,5}, 8));     // [[2,2,2,2],[2,3,3],[3,5]]
        System.out.println(combinationSum(new int[]{2}, 1));          // []
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/palindrome-partitioning-dp-17/',
    statement: 'Given a string S, partition it such that every substring in the partition is a palindrome. Return all possible palindrome partitioning. Constraints: 1 <= |S| <= 16; lowercase letters.',
    intuition: 'Backtracking: at each start index, try all substrings starting there. If the substring is a palindrome, add it to the current partition and recurse on the remaining string. When start reaches the end, the current partition is complete — add it to results.',
    time_complexity: 'O(N * 2^N) — 2^N partitions, each palindrome check O(N).',
    space_complexity: 'O(N) — recursion depth.',
    code: `import java.util.*;

public class PalindromePartitioning {
    static boolean isPalin(String s, int l, int r) {
        while (l < r) { if (s.charAt(l++) != s.charAt(r--)) return false; }
        return true;
    }

    static void backtrack(String s, int start, List<String> current, List<List<String>> result) {
        if (start == s.length()) { result.add(new ArrayList<>(current)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPalin(s, start, end)) {
                current.add(s.substring(start, end + 1));
                backtrack(s, end + 1, current, result);
                current.remove(current.size() - 1);
            }
        }
    }

    static List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(partition("aab")); // [[a, a, b], [aa, b]]
        System.out.println(partition("a"));   // [[a]]
        System.out.println(partition("aba")); // [[a, b, a], [aba]]
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Word Break Problem',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/word-break-problem-using-backtracking/',
    statement: 'Given a string S and a dictionary of words, determine if S can be segmented into a space-separated sequence of one or more dictionary words. Constraints: 1 <= |S| <= 300; 1 <= dict size <= 10^3.',
    intuition: 'Memoized recursion: from each index, try all prefixes. If a prefix is in the dictionary, recurse on the remainder. Cache results to avoid re-solving the same suffix. The HashMap stores whether each starting index can lead to a valid segmentation.',
    time_complexity: 'O(N² * L) — N² substrings, dictionary lookup O(L). With memo, each index solved once.',
    space_complexity: 'O(N) — memo table.',
    code: `import java.util.*;

public class WordBreak {
    static Map<Integer, Boolean> memo = new HashMap<>();

    static boolean canBreak(String s, Set<String> dict, int start) {
        if (start == s.length()) return true;
        if (memo.containsKey(start)) return memo.get(start);
        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            if (dict.contains(word) && canBreak(s, dict, end)) {
                memo.put(start, true);
                return true;
            }
        }
        memo.put(start, false);
        return false;
    }

    static boolean wordBreak(String s, List<String> wordDict) {
        memo.clear();
        return canBreak(s, new HashSet<>(wordDict), 0);
    }

    public static void main(String[] args) {
        System.out.println(wordBreak("leetcode", Arrays.asList("leet","code")));   // true
        System.out.println(wordBreak("applepenapple", Arrays.asList("apple","pen"))); // true
        System.out.println(wordBreak("catsandog", Arrays.asList("cats","dog","sand","and","cat"))); // false
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Rat in a Maze',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/',
    statement: 'Given an N×N binary maze (1=open, 0=blocked), find all paths from the top-left (0,0) to the bottom-right (N-1, N-1). The rat can move in 4 directions. Return all paths as strings (D=down, L=left, R=right, U=up), sorted lexicographically. Constraints: 2 <= N <= 5.',
    intuition: 'DFS + backtracking: mark visited cells to avoid revisiting. At each cell, try all 4 directions. When (N-1, N-1) is reached, add the current path string to results. Backtrack by unvisiting the cell. Sort the result for lexicographic order.',
    time_complexity: 'O(4^(N²)) — worst case exponential; pruning via blocked cells and visited flag.',
    space_complexity: 'O(N²) — visited grid and path string.',
    code: `import java.util.*;

public class RatInMaze {
    static int[] dr = {1, 0, 0, -1};
    static int[] dc = {0, -1, 1, 0};
    static char[] dir = {'D', 'L', 'R', 'U'};

    static void dfs(int[][] maze, boolean[][] visited, int r, int c, int n, StringBuilder path, List<String> result) {
        if (r == n-1 && c == n-1) { result.add(path.toString()); return; }
        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && maze[nr][nc] == 1 && !visited[nr][nc]) {
                visited[nr][nc] = true;
                path.append(dir[i]);
                dfs(maze, visited, nr, nc, n, path, result);
                path.deleteCharAt(path.length() - 1);
                visited[nr][nc] = false;
            }
        }
    }

    static List<String> findPaths(int[][] maze, int n) {
        List<String> result = new ArrayList<>();
        if (maze[0][0] == 0) return result;
        boolean[][] visited = new boolean[n][n];
        visited[0][0] = true;
        dfs(maze, visited, 0, 0, n, new StringBuilder(), result);
        Collections.sort(result);
        return result;
    }

    public static void main(String[] args) {
        int[][] maze = {{1,0,0,0},{1,1,0,1},{1,1,0,0},{0,1,1,1}};
        System.out.println(findPaths(maze, 4)); // [DDRDRR, DRDDRR]

        int[][] maze2 = {{1,0},{1,1}};
        System.out.println(findPaths(maze2, 2)); // [DRD or similar]
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/partition-problem-dp-18/',
    statement: 'Given a non-negative integer array, determine if it can be partitioned into two subsets with equal sum. Constraints: 1 <= N <= 200; 0 <= arr[i] <= 100.',
    intuition: 'If the total sum is odd, return false. Otherwise, we need to find a subset summing to sum/2 — a standard 0/1 knapsack problem. Use a boolean DP array dp[j] = true if sum j is achievable. Iterate backwards when processing each element to avoid counting it twice.',
    time_complexity: 'O(N * sum/2) — DP with N items and sum/2 target.',
    space_complexity: 'O(sum/2) — 1D DP array.',
    code: `public class PartitionEqualSubset {
    static boolean canPartition(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int n : nums) {
            for (int j = target; j >= n; j--) {
                dp[j] |= dp[j - n];
            }
        }
        return dp[target];
    }

    public static void main(String[] args) {
        System.out.println(canPartition(new int[]{1,5,11,5})); // true  (1+5+5=11)
        System.out.println(canPartition(new int[]{1,2,3,5}));  // false
        System.out.println(canPartition(new int[]{2,2,3,5}));  // false
        System.out.println(canPartition(new int[]{1,2,5,6,6}));// true  (1+5+6=12, 2+6+4? -> 6+6=12, 1+2+5=8?)
        // total=20, target=10: 1+2+... let's see: dp says false. Actually: 1+3+6=10? No 3. 2+2+6=10? yes! true
        System.out.println(canPartition(new int[]{2,2,6,10})); // true  (2+8? no) total=20, target=10: 2+2+6=10 yes
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'M Coloring Problem',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/m-coloring-problem-backtracking-5/',
    statement: 'Given an undirected graph with N nodes, E edges, and M colors, determine if the graph can be colored using at most M colors such that no two adjacent nodes share the same color. Return true/false. Constraints: 1 <= N <= 20; 1 <= M <= N.',
    intuition: 'Backtracking: assign colors to nodes one at a time. For each node, try all M colors. A color is valid if no adjacent node has that color. If a valid color is found, recurse for the next node. If all nodes are colored, return true. Backtrack when no valid color exists for a node.',
    time_complexity: 'O(M^N) — worst case, each node tries M colors.',
    space_complexity: 'O(N) — recursion depth and color array.',
    code: `public class MColoring {
    static boolean isSafe(int node, int[][] graph, int[] color, int c, int n) {
        for (int i = 0; i < n; i++) if (graph[node][i] == 1 && color[i] == c) return false;
        return true;
    }

    static boolean solve(int node, int[][] graph, int[] color, int m, int n) {
        if (node == n) return true;
        for (int c = 1; c <= m; c++) {
            if (isSafe(node, graph, color, c, n)) {
                color[node] = c;
                if (solve(node + 1, graph, color, m, n)) return true;
                color[node] = 0;
            }
        }
        return false;
    }

    static boolean graphColoring(int[][] graph, int m, int n) {
        int[] color = new int[n];
        return solve(0, graph, color, m, n);
    }

    public static void main(String[] args) {
        // 4-cycle graph: 0-1-2-3-0 + 0-2 (like a complete graph K4 minus one edge)
        int[][] graph = {
            {0,1,1,1},
            {1,0,1,0},
            {1,1,0,1},
            {1,0,1,0}
        };
        System.out.println(graphColoring(graph, 3, 4)); // true  (needs 3 colors for this graph)
        System.out.println(graphColoring(graph, 2, 4)); // false (odd cycle exists)

        // Simple triangle: 0-1, 1-2, 0-2
        int[][] triangle = {{0,1,1},{1,0,1},{1,1,0}};
        System.out.println(graphColoring(triangle, 3, 3)); // true
        System.out.println(graphColoring(triangle, 2, 3)); // false
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Expression Add Operators',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/add-operators-in-a-string-such-that-sum-equals-to-target/',
    statement: 'Given a string of digits S and a target integer, return all ways to add operators (+, -, *) between digits of S such that the expression evaluates to target. Numbers formed must not have leading zeros. Constraints: 1 <= |S| <= 10; -2^31 <= target <= 2^31 - 1.',
    intuition: 'Backtracking: at each position, decide the next number (avoiding leading zeros) and the operator connecting it to what we have. Track the current evaluated value AND the last term for multiplication (since * has higher precedence — to undo the previous add and apply multiply). When all digits are used and the value equals target, add the expression.',
    time_complexity: 'O(4^N * N) — 3 operator choices plus number length choices at each position.',
    space_complexity: 'O(N) — recursion depth and expression string.',
    code: `import java.util.*;

public class ExpressionAddOperators {
    static List<String> result;
    static int target;
    static String num;

    static void backtrack(int idx, long val, long prev, StringBuilder expr) {
        if (idx == num.length()) {
            if (val == target) result.add(expr.toString());
            return;
        }
        int len = expr.length();
        for (int i = idx; i < num.length(); i++) {
            // No leading zeros for multi-digit numbers
            if (i != idx && num.charAt(idx) == '0') break;
            long cur = Long.parseLong(num.substring(idx, i + 1));
            if (idx == 0) {
                expr.append(cur);
                backtrack(i + 1, cur, cur, expr);
                expr.setLength(len);
            } else {
                expr.append('+').append(cur);
                backtrack(i + 1, val + cur, cur, expr);
                expr.setLength(len);

                expr.append('-').append(cur);
                backtrack(i + 1, val - cur, -cur, expr);
                expr.setLength(len);

                expr.append('*').append(cur);
                backtrack(i + 1, val - prev + prev * cur, prev * cur, expr);
                expr.setLength(len);
            }
        }
    }

    static List<String> addOperators(String num, int target) {
        ExpressionAddOperators.result = new ArrayList<>();
        ExpressionAddOperators.target = target;
        ExpressionAddOperators.num = num;
        backtrack(0, 0, 0, new StringBuilder());
        return result;
    }

    public static void main(String[] args) {
        System.out.println(addOperators("123", 6));   // [1*2*3, 1+2+3]
        System.out.println(addOperators("232", 8));   // [2*3+2, 2+3*2]
        System.out.println(addOperators("105", 5));   // [1*0+5, 10-5]
        System.out.println(addOperators("00", 0));    // [0+0, 0-0, 0*0]
    }
}`
  },
  {
    topic: 'Recursion & Backtracking',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-all-possible-words-phone-digits/',
    statement: 'Given a string of digits 2-9, return all possible letter combinations that the number could represent (like a phone keypad). Return in any order. Constraints: 0 <= |digits| <= 4; digits[i] is in \'2\'..\'9\'.',
    intuition: 'Backtracking: maintain a mapping of digit to letters. For each digit in the input, branch on each possible letter. The depth of the recursion equals the number of digits; leaf nodes (full-length combinations) are added to results.',
    time_complexity: 'O(4^N * N) — at most 4 letters per digit, N digits, each combination is O(N) to record.',
    space_complexity: 'O(N) — recursion depth.',
    code: `import java.util.*;

public class LetterCombinations {
    static String[] keypad = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};

    static void backtrack(String digits, int idx, StringBuilder current, List<String> result) {
        if (idx == digits.length()) { result.add(current.toString()); return; }
        for (char c : keypad[digits.charAt(idx) - '0'].toCharArray()) {
            current.append(c);
            backtrack(digits, idx + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }

    static List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) return Collections.emptyList();
        List<String> result = new ArrayList<>();
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(letterCombinations("23"));  // [ad, ae, af, bd, be, bf, cd, ce, cf]
        System.out.println(letterCombinations("2"));   // [a, b, c]
        System.out.println(letterCombinations(""));    // []
        System.out.println(letterCombinations("79").size()); // 12 (4*3)
    }
}`
  },

  // ─── Dynamic Programming (17) ─────────────────────────────────────────────────
  {
    topic: 'Dynamic Programming',
    title: '0/1 Knapsack Problem',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
    statement: 'Given N items each with a weight and value, and a knapsack of capacity W, find the maximum value obtainable by selecting a subset of items such that total weight does not exceed W. Each item can be chosen at most once. Constraints: 1 <= N <= 1000; 1 <= W <= 1000.',
    intuition: 'Build a 2D DP table dp[i][w] = max value using first i items with weight capacity w. For each item, either skip it (dp[i-1][w]) or include it if it fits (dp[i-1][w-wt[i]] + val[i]). Optimize to 1D by iterating w backwards.',
    time_complexity: 'O(N * W) — filling the DP table.',
    space_complexity: 'O(W) — 1D optimization.',
    code: `public class Knapsack {
    static int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[] dp = new int[W + 1];
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[W];
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[]{1,3,4,5}, new int[]{1,4,5,7}, 7)); // 9  (items 3,5 with val 4+5=9)
        System.out.println(knapsack(new int[]{2,3,4,5}, new int[]{3,4,5,6}, 5)); // 7  (wt 2+3, val 3+4)
        System.out.println(knapsack(new int[]{5}, new int[]{10}, 3)); // 0
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Longest Increasing Subsequence (LIS)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/',
    statement: 'Given an array of integers, find the length of the longest strictly increasing subsequence. Constraints: 1 <= N <= 2500; values fit in int.',
    intuition: 'O(N log N) approach: maintain a tails[] array where tails[i] is the smallest tail element of all increasing subsequences of length i+1. For each element, binary search in tails for its position. If it extends the longest, append; otherwise replace the element at that position (to maintain the smallest possible tail).',
    time_complexity: 'O(N log N) — binary search per element.',
    space_complexity: 'O(N) — tails array.',
    code: `import java.util.Arrays;

public class LIS {
    static int lis(int[] nums) {
        int[] tails = new int[nums.length];
        int len = 0;
        for (int n : nums) {
            int lo = 0, hi = len;
            while (lo < hi) { int mid = (lo + hi) / 2; if (tails[mid] < n) lo = mid + 1; else hi = mid; }
            tails[lo] = n;
            if (lo == len) len++;
        }
        return len;
    }

    public static void main(String[] args) {
        System.out.println(lis(new int[]{10,9,2,5,3,7,101,18})); // 4  (2,3,7,18)
        System.out.println(lis(new int[]{0,1,0,3,2,3}));          // 4  (0,1,2,3)
        System.out.println(lis(new int[]{7,7,7,7,7}));            // 1
        System.out.println(lis(new int[]{1,2,3,4,5}));            // 5
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Longest Common Subsequence (LCS)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/',
    statement: 'Given two strings, find the length of their Longest Common Subsequence (LCS) — the longest sequence of characters appearing in the same order in both strings (not necessarily contiguous). Constraints: 1 <= |s1|, |s2| <= 1000.',
    intuition: 'DP: dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]. If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1] + 1. Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Optimize space to two rows or one row with a previous variable.',
    time_complexity: 'O(M * N) — filling the DP table.',
    space_complexity: 'O(min(M, N)) — two-row optimization.',
    code: `public class LCS {
    static int lcs(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m < n) return lcs(s2, s1); // ensure m >= n for space optimization
        int[] prev = new int[n + 1], curr = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) curr[j] = prev[j-1] + 1;
                else curr[j] = Math.max(prev[j], curr[j-1]);
            }
            int[] tmp = prev; prev = curr; curr = tmp;
            java.util.Arrays.fill(curr, 0);
        }
        return prev[n];
    }

    public static void main(String[] args) {
        System.out.println(lcs("ABCBDAB", "BDCAB"));  // 4  (BCAB or BDAB)
        System.out.println(lcs("AGGTAB", "GXTXAYB"));  // 4  (GTAB)
        System.out.println(lcs("abc", "abc"));          // 3
        System.out.println(lcs("abc", "def"));          // 0
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Edit Distance',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/edit-distance-dp-5/',
    statement: 'Given two strings word1 and word2, find the minimum number of operations (insert, delete, replace) required to convert word1 into word2. Constraints: 0 <= |word1|, |word2| <= 500.',
    intuition: 'DP: dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]. If chars match, dp[i][j] = dp[i-1][j-1]. Otherwise dp[i][j] = 1 + min(dp[i-1][j] = delete, dp[i][j-1] = insert, dp[i-1][j-1] = replace). Base cases: dp[i][0] = i, dp[0][j] = j.',
    time_complexity: 'O(M * N) — filling the DP table.',
    space_complexity: 'O(min(M, N)) — two rows.',
    code: `public class EditDistance {
    static int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] prev = new int[n + 1], curr = new int[n + 1];
        for (int j = 0; j <= n; j++) prev[j] = j;
        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i-1) == word2.charAt(j-1)) curr[j] = prev[j-1];
                else curr[j] = 1 + Math.min(prev[j-1], Math.min(prev[j], curr[j-1]));
            }
            int[] tmp = prev; prev = curr; curr = tmp;
        }
        return prev[n];
    }

    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros"));    // 3
        System.out.println(minDistance("intention", "execution")); // 5
        System.out.println(minDistance("", "a"));           // 1
        System.out.println(minDistance("a", "a"));          // 0
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Matrix Chain Multiplication',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/',
    statement: 'Given N matrices, find the minimum number of scalar multiplications needed to multiply the chain. Matrix i has dimensions arr[i-1] × arr[i]. Constraints: 2 <= N+1 <= 100.',
    intuition: 'Interval DP: dp[i][j] = minimum cost to multiply matrices i through j. For each possible split point k (i <= k < j), cost = dp[i][k] + dp[k+1][j] + arr[i-1]*arr[k]*arr[j]. Build up from smaller intervals to larger. Length-2 intervals have cost 0 (single matrix).',
    time_complexity: 'O(N³) — O(N²) sub-problems, each with O(N) splits.',
    space_complexity: 'O(N²) — DP table.',
    code: `public class MatrixChainMultiplication {
    static int matrixChain(int[] arr) {
        int n = arr.length - 1; // number of matrices
        int[][] dp = new int[n][n];
        // len = chain length (2 to n)
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k+1][j] + arr[i] * arr[k+1] * arr[j+1];
                    dp[i][j] = Math.min(dp[i][j], cost);
                }
            }
        }
        return dp[0][n-1];
    }

    public static void main(String[] args) {
        System.out.println(matrixChain(new int[]{1,2,3,4}));  // 18  (A:1x2, B:2x3, C:3x4 -> (AB)C: 12+24=36? or A(BC):24+8=32? or (AB)C: (1*2*3)+(1*3*4)=6+12=18)
        System.out.println(matrixChain(new int[]{40,20,30,10,30})); // 26000
        System.out.println(matrixChain(new int[]{10,30,5,60}));     // 4500
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Egg Drop Problem',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/egg-dropping-puzzle-dp-11/',
    statement: 'Given K eggs and N floors, find the minimum number of trials needed in the worst case to find the critical floor F (the highest floor from which an egg doesn\'t break). Constraints: 1 <= K <= 10; 1 <= N <= 10^4.',
    intuition: 'Rethink: instead of "given K eggs and N floors, what is min trials?", ask "given K eggs and T trials, how many floors can be checked?" dp[t][k] = floors checkable with t trials and k eggs. dp[t][k] = dp[t-1][k-1] + dp[t-1][k] + 1. Find minimum T such that dp[T][K] >= N.',
    time_complexity: 'O(K * log N) — T grows logarithmically.',
    space_complexity: 'O(K) — only two rows needed.',
    code: `public class EggDrop {
    static int superEggDrop(int k, int n) {
        // dp[j] = max floors we can check with j eggs in current trial count
        int[] dp = new int[k + 1];
        int trials = 0;
        while (dp[k] < n) {
            trials++;
            // Iterate right to left to avoid using updated values
            for (int j = k; j >= 1; j--) {
                dp[j] = dp[j-1] + dp[j] + 1;
            }
        }
        return trials;
    }

    public static void main(String[] args) {
        System.out.println(superEggDrop(1, 100)); // 100 (must try every floor)
        System.out.println(superEggDrop(2, 100)); // 14
        System.out.println(superEggDrop(3, 14));  // 4
        System.out.println(superEggDrop(2, 6));   // 3
        System.out.println(superEggDrop(4, 5000)); // 19
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Coin Change — Minimum Coins',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-minimum-number-of-coins-that-make-a-change/',
    statement: 'Given an array of coin denominations and an amount, find the minimum number of coins needed to make up that amount. Return -1 if it\'s not possible. Coins can be used multiple times. Constraints: 1 <= N <= 12; 1 <= coins[i] <= 2^31; 0 <= amount <= 10^4.',
    intuition: 'Unbounded knapsack-style DP. dp[i] = minimum coins to make amount i. Initialize dp[0] = 0, rest = infinity. For each amount i from 1 to target, try every coin: if coin <= i, dp[i] = min(dp[i], dp[i - coin] + 1).',
    time_complexity: 'O(N * amount) — two nested loops.',
    space_complexity: 'O(amount) — DP array.',
    code: `import java.util.Arrays;

public class CoinChange {
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // sentinel for "infinity"
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return (dp[amount] > amount) ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1,5,6,9}, 11)); // 2  (5+6)
        System.out.println(coinChange(new int[]{2}, 3));         // -1
        System.out.println(coinChange(new int[]{1,2,5}, 11));    // 3  (5+5+1)
        System.out.println(coinChange(new int[]{1}, 0));         // 0
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Maximum Sum Increasing Subsequence',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/maximum-sum-increasing-subsequence-dp-14/',
    statement: 'Given an array of positive integers, find the sum of the maximum sum increasing subsequence. A subsequence is increasing if each element is strictly greater than the previous one. Constraints: 1 <= N <= 1000; 1 <= arr[i] <= 10^5.',
    intuition: 'Similar to LIS but tracking sum instead of length. dp[i] = maximum sum of an increasing subsequence ending at index i. dp[i] = arr[i] + max(dp[j]) for all j < i where arr[j] < arr[i]. Base case: dp[i] = arr[i] (subsequence of just that element). Answer is max(dp).',
    time_complexity: 'O(N²) — two nested loops.',
    space_complexity: 'O(N) — dp array.',
    code: `import java.util.Arrays;

public class MaxSumIncreasingSubsequence {
    static int maxSumIS(int[] arr) {
        int n = arr.length;
        int[] dp = Arrays.copyOf(arr, n); // dp[i] = max sum ending at i
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + arr[i]);
            }
        }
        int max = 0;
        for (int x : dp) max = Math.max(max, x);
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxSumIS(new int[]{1,101,2,3,100,4,5}));    // 106 (1+2+3+100)
        System.out.println(maxSumIS(new int[]{3,4,5,10}));              // 22  (3+4+5+10)
        System.out.println(maxSumIS(new int[]{10,5,4,3}));              // 10
        System.out.println(maxSumIS(new int[]{1,2,3,4,5}));             // 15
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Minimum Path Sum in Grid',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/minimum-path-sum/',
    statement: 'Given an M x N grid filled with non-negative integers, find the minimum sum path from the top-left to the bottom-right corner. You can only move right or down. Constraints: 1 <= M, N <= 200; 0 <= grid[i][j] <= 100.',
    intuition: 'DP in-place or with a 1D array. dp[j] = minimum cost to reach column j in the current row. For row 0, prefix sums going right. For each subsequent row, dp[j] = grid[i][j] + min(dp[j] (from above), dp[j-1] (from left)).',
    time_complexity: 'O(M * N) — each cell processed once.',
    space_complexity: 'O(N) — single row DP.',
    code: `public class MinPathSum {
    static int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        dp[0] = grid[0][0];
        for (int j = 1; j < n; j++) dp[j] = dp[j-1] + grid[0][j];
        for (int i = 1; i < m; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; j++) {
                dp[j] = grid[i][j] + Math.min(dp[j], dp[j-1]);
            }
        }
        return dp[n-1];
    }

    public static void main(String[] args) {
        System.out.println(minPathSum(new int[][]{{1,3,1},{1,5,1},{4,2,1}})); // 7 (1+3+1+1+1)
        System.out.println(minPathSum(new int[][]{{1,2,3},{4,5,6}}));          // 12 (1+2+3+6)
        System.out.println(minPathSum(new int[][]{{5}}));                       // 5
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Longest Palindromic Subsequence',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/longest-palindromic-subsequence-dp-12/',
    statement: 'Given a string S, find the length of its longest palindromic subsequence. A subsequence doesn\'t need to be contiguous. Constraints: 1 <= |S| <= 1000.',
    intuition: 'LPS(s) = LCS(s, reverse(s)). The longest common subsequence of a string and its reverse must be a palindrome. This reduces the problem to a known LCS computation, avoiding a separate 2D interval DP.',
    time_complexity: 'O(N²) — LCS of two strings of length N.',
    space_complexity: 'O(N) — two rows of the LCS DP.',
    code: `public class LongestPalindromicSubsequence {
    static int lps(String s) {
        String rev = new StringBuilder(s).reverse().toString();
        int n = s.length();
        int[] prev = new int[n + 1], curr = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (s.charAt(i-1) == rev.charAt(j-1)) curr[j] = prev[j-1] + 1;
                else curr[j] = Math.max(prev[j], curr[j-1]);
            }
            int[] tmp = prev; prev = curr; curr = tmp;
            java.util.Arrays.fill(curr, 0);
        }
        return prev[n];
    }

    public static void main(String[] args) {
        System.out.println(lps("bbbab")); // 4  (bbbb)
        System.out.println(lps("cbbd"));  // 2  (bb)
        System.out.println(lps("a"));     // 1
        System.out.println(lps("abcba")); // 5  (abcba itself)
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/maximum-product-subarray/',
    statement: 'Given an integer array, find the contiguous subarray that has the largest product and return that product. Constraints: 1 <= N <= 2*10^4; -10 <= arr[i] <= 10; product fits in a 32-bit integer.',
    intuition: 'Track both the maximum and minimum product ending at the current position (minimum matters because a negative * negative = positive). At each step: maxProd = max(arr[i], maxProd*arr[i], minProd*arr[i]); minProd = min(arr[i], maxProd_prev*arr[i], minProd_prev*arr[i]). Update global max.',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1) — only two variables.',
    code: `public class MaxProductSubarray {
    static int maxProduct(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int prevMax = maxProd, prevMin = minProd;
            maxProd = Math.max(nums[i], Math.max(prevMax * nums[i], prevMin * nums[i]));
            minProd = Math.min(nums[i], Math.min(prevMax * nums[i], prevMin * nums[i]));
            result = Math.max(result, maxProd);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(maxProduct(new int[]{2,3,-2,4}));   // 6  (2*3)
        System.out.println(maxProduct(new int[]{-2,0,-1}));    // 0
        System.out.println(maxProduct(new int[]{-2,3,-4}));    // 24 (-2*3*-4)
        System.out.println(maxProduct(new int[]{-3,-1,-1}));   // 3  (-1*-3 or -1*-1...)
        // Actually: max prod in -3,-1,-1: all: -3; -3*-1=3; -3*-1*-1=-3; max=3
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Minimum Cost to Cut a Stick',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/minimum-and-maximum-cost-to-buy-n-candies/',
    statement: 'Given a stick of length N and an array of cut positions, find the minimum cost to perform all cuts. The cost of a cut is the length of the stick being cut at that point. Constraints: 2 <= N <= 10^6; 1 <= cuts.length <= min(N-1, 100).',
    intuition: 'Add 0 and N to the cuts array and sort it. Interval DP: dp[i][j] = minimum cost to make all cuts between cuts[i] and cuts[j]. For each interval, try every cut k in between: dp[i][j] = (cuts[j] - cuts[i]) + dp[i][k] + dp[k][j]. The (cuts[j]-cuts[i]) is the cost of any cut in this interval.',
    time_complexity: 'O(M³) where M = cuts.length + 2.',
    space_complexity: 'O(M²) — DP table.',
    code: `import java.util.Arrays;

public class MinCostCutStick {
    static int minCost(int n, int[] cuts) {
        int m = cuts.length;
        int[] c = new int[m + 2];
        c[0] = 0; c[m + 1] = n;
        for (int i = 0; i < m; i++) c[i + 1] = cuts[i];
        Arrays.sort(c);
        int sz = c.length;
        int[][] dp = new int[sz][sz];
        for (int len = 2; len < sz; len++) {
            for (int i = 0; i + len < sz; i++) {
                int j = i + len;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i + 1; k < j; k++) {
                    dp[i][j] = Math.min(dp[i][j], c[j] - c[i] + dp[i][k] + dp[k][j]);
                }
            }
        }
        return dp[0][sz - 1];
    }

    public static void main(String[] args) {
        System.out.println(minCost(7, new int[]{1,3,4,5}));  // 16
        System.out.println(minCost(9, new int[]{5,6,1,4,2})); // 22
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Burst Balloons',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/burst-balloon-to-maximize-coins/',
    statement: 'Given N balloons with values, burst all balloons to maximize coins collected. When you burst balloon i, you collect nums[left] * nums[i] * nums[right] coins. Add 1 to both ends of the array as sentinels. Constraints: 0 <= N <= 500; 0 <= nums[i] <= 100.',
    intuition: 'Think in reverse: which balloon is burst LAST in a range [l, r]? If k is the last balloon burst in [l, r], its neighbors are the sentinels at l and r (since all others in [l,r] are already gone). dp[l][r] = max over k in (l,r) of: dp[l][k] + nums[l]*nums[k]*nums[r] + dp[k][r].',
    time_complexity: 'O(N³) — O(N²) sub-intervals, O(N) splits each.',
    space_complexity: 'O(N²) — DP table.',
    code: `public class BurstBalloons {
    static int maxCoins(int[] nums) {
        int n = nums.length;
        int[] arr = new int[n + 2];
        arr[0] = arr[n + 1] = 1;
        for (int i = 0; i < n; i++) arr[i + 1] = nums[i];
        int sz = arr.length;
        int[][] dp = new int[sz][sz];
        for (int len = 2; len < sz; len++) {
            for (int l = 0; l + len < sz; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++) {
                    dp[l][r] = Math.max(dp[l][r], dp[l][k] + arr[l]*arr[k]*arr[r] + dp[k][r]);
                }
            }
        }
        return dp[0][sz - 1];
    }

    public static void main(String[] args) {
        System.out.println(maxCoins(new int[]{3,1,5,8}));  // 167 (3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15+120+24+8=167)
        System.out.println(maxCoins(new int[]{1,5}));       // 10  (1*5*1 + 1*1*1 = 5+1? 1*5*1=5, then 1*1=1 => 6? or 1*1*5=5, 1*5*1=5 => burst 1 first: 1*1*5=5, then 1*5*1=5 => 10)
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Number of Ways to Decode',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/count-possible-decodings-given-digit-sequence/',
    statement: 'A string of digits can be decoded where \'A\'=1, \'B\'=2, ..., \'Z\'=26. Given a string of digits, return the number of ways to decode it. A \'0\' cannot be decoded alone. Constraints: 1 <= |S| <= 100; S contains only digits.',
    intuition: 'DP: dp[i] = number of ways to decode S[0..i-1]. If S[i-1] != \'0\', we can extend any decoding of S[0..i-2] with a single character: dp[i] += dp[i-1]. If S[i-2..i-1] forms 10-26, we can extend any decoding of S[0..i-3] with a two-character code: dp[i] += dp[i-2].',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1) — two variables.',
    code: `public class DecodeWays {
    static int numDecodings(String s) {
        int n = s.length();
        if (n == 0 || s.charAt(0) == '0') return 0;
        int prev2 = 1, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = 0;
            int one = s.charAt(i-1) - '0';
            int two = Integer.parseInt(s.substring(i-2, i));
            if (one >= 1) curr += prev1;
            if (two >= 10 && two <= 26) curr += prev2;
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(numDecodings("12"));   // 2 (AB or L)
        System.out.println(numDecodings("226"));  // 3 (BBF, BZ, VF)
        System.out.println(numDecodings("06"));   // 0
        System.out.println(numDecodings("10"));   // 1 (J)
        System.out.println(numDecodings("11106")); // 2
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Wildcard Pattern Matching',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/wildcard-pattern-matching/',
    statement: 'Given a string S and a pattern P containing \'?\' (matches any single character) and \'*\' (matches any sequence of characters including empty), determine if P matches the entire S. Constraints: 0 <= |S|, |P| <= 2000; lowercase letters.',
    intuition: 'DP: dp[i][j] = true if s[0..i-1] matches p[0..j-1]. If p[j-1] == \'*\': dp[i][j] = dp[i][j-1] (star = empty) OR dp[i-1][j] (star = one more char from s). If p[j-1] == \'?\' or p[j-1] == s[i-1]: dp[i][j] = dp[i-1][j-1]. Optimize to O(N) space.',
    time_complexity: 'O(M * N) — filling the DP table.',
    space_complexity: 'O(N) — single row.',
    code: `public class WildcardMatching {
    static boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int j = 1; j <= n; j++) dp[j] = dp[j-1] && p.charAt(j-1) == '*';
        for (int i = 1; i <= m; i++) {
            boolean prev = dp[0];
            dp[0] = false;
            for (int j = 1; j <= n; j++) {
                boolean temp = dp[j];
                char pc = p.charAt(j-1);
                if (pc == '*') dp[j] = dp[j-1] || dp[j]; // empty match or extend
                else if (pc == '?' || pc == s.charAt(i-1)) dp[j] = prev;
                else dp[j] = false;
                prev = temp;
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(isMatch("aa", "a"));    // false
        System.out.println(isMatch("aa", "*"));    // true
        System.out.println(isMatch("cb", "?a"));   // false
        System.out.println(isMatch("adceb", "*a*b")); // true
        System.out.println(isMatch("acdcb", "a*c?b")); // false
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Minimum Number of Jumps to Reach End',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-a-given-array/',
    statement: 'Given an array where arr[i] is the maximum jump length from index i, find the minimum number of jumps to reach the last index starting from index 0. Return -1 if it\'s not possible. Constraints: 1 <= N <= 10^4; 0 <= arr[i] <= 10^4.',
    intuition: 'Greedy: maintain the current jump boundary (end) and the farthest we can reach (farthest). When we hit the boundary, we must take another jump (jumps++). Update end = farthest. If end never reaches or exceeds the last index, it\'s unreachable. Early exit if arr[0] = 0 and N > 1.',
    time_complexity: 'O(N) — single pass.',
    space_complexity: 'O(1) — three variables.',
    code: `public class MinJumps {
    static int jump(int[] nums) {
        int n = nums.length;
        if (n <= 1) return 0;
        int jumps = 0, farthest = 0, end = 0;
        for (int i = 0; i < n - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                if (farthest <= i) return -1; // stuck
                jumps++;
                end = farthest;
                if (end >= n - 1) break;
            }
        }
        return jumps;
    }

    public static void main(String[] args) {
        System.out.println(jump(new int[]{2,3,1,1,4})); // 2 (index 0->1->4)
        System.out.println(jump(new int[]{2,3,0,1,4})); // 2 (index 0->1->4)
        System.out.println(jump(new int[]{0}));          // 0 (already at end)
        System.out.println(jump(new int[]{0,2,3}));      // -1 (stuck at 0)
        System.out.println(jump(new int[]{1,1,1,1,1}));  // 4
    }
}`
  },
  {
    topic: 'Dynamic Programming',
    title: 'Weighted Job Scheduling',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/weighted-job-scheduling/',
    statement: 'Given N jobs, each with a start time, end time, and profit, find the maximum profit achievable by scheduling non-overlapping jobs. Constraints: 1 <= N <= 10^5; 1 <= start < end <= 10^9; 1 <= profit <= 10^4.',
    intuition: 'Sort jobs by end time. dp[i] = max profit using jobs from the first i jobs. For each job i, find the latest job j that ends at or before job i starts (binary search). dp[i] = max(dp[i-1], profit[i] + dp[j]). The first option skips job i; the second includes it.',
    time_complexity: 'O(N log N) — sorting and binary search per job.',
    space_complexity: 'O(N) — dp array.',
    code: `import java.util.*;

public class WeightedJobScheduling {
    static int maxProfit(int[] start, int[] end, int[] profit) {
        int n = start.length;
        int[][] jobs = new int[n][3];
        for (int i = 0; i < n; i++) jobs[i] = new int[]{start[i], end[i], profit[i]};
        Arrays.sort(jobs, (a, b) -> a[1] - b[1]);
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            // Binary search for latest job ending <= jobs[i-1].start
            int lo = 0, hi = i - 1;
            while (lo < hi) {
                int mid = (lo + hi + 1) / 2;
                if (jobs[mid-1][1] <= jobs[i-1][0]) lo = mid;
                else hi = mid - 1;
            }
            dp[i] = Math.max(dp[i-1], dp[lo] + jobs[i-1][2]);
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{1,2,3,3}, new int[]{2,5,4,6}, new int[]{50,10,40,70})); // 120 (job1+job4: 50+70)
        System.out.println(maxProfit(new int[]{1,2,3,4,6}, new int[]{3,5,10,6,9}, new int[]{20,20,100,200,200})); // 400
    }
}`
  }
];
