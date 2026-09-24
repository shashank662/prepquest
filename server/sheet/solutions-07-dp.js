// Striver's 180 — Dynamic Programming (19)
export default {

  // ── Dynamic Programming › State Transition DP ───────────────────────────────

  'frog-jump-with-k-distances': {
    difficulty: 'Medium',
    statement: 'A frog is on step 0 of a staircase with heights[i]. From step i it can jump to any step i+1 … i+k, and a jump from i to j costs |heights[i] − heights[j]| energy. Return the minimum energy needed to reach the last step.',
    intuition: "Let dp[i] be the cheapest way to reach step i. The last jump into i came from one of the k steps before it, so dp[i] = min over j in [i−k, i−1] of dp[j] + |h[i] − h[j]|, with dp[0] = 0. Filling dp from left to right means every dp[j] is ready when it's needed.",
    time: 'O(n · k)',
    space: 'O(n)',
    code: `import java.util.*;

public class FrogJumpK {
    public static int frogJump(int[] h, int k) {
        int n = h.length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i < n; i++)
            for (int j = Math.max(0, i - k); j < i; j++)
                dp[i] = Math.min(dp[i], dp[j] + Math.abs(h[i] - h[j]));
        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(frogJump(new int[]{10, 5, 20, 0, 15}, 2));  // 15
        System.out.println(frogJump(new int[]{15, 4, 1, 14, 15}, 3));  // 2
        System.out.println(frogJump(new int[]{10, 20, 10}, 1));        // 20
    }
}`,
  },

  'house-robber': {
    difficulty: 'Medium',
    statement: 'Houses stand in a circle, so the first and last houses are neighbours. Given the money in each house, return the most you can rob without robbing two adjacent houses. (TUF poses the circular version; LeetCode calls it House Robber II.)',
    intuition: "For a straight line of houses: best[i] = max(best[i−1], best[i−2] + money[i]). Either skip house i, or rob it and add the best total up to i − 2. Two rolling variables are enough. In a circle, house 0 and house n − 1 can't both be robbed, so solve the line twice, once without the last house and once without the first, and take the larger answer.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class HouseRobberCircular {
    public static long rob(int[] money) {
        int n = money.length;
        if (n == 1) return money[0];
        return Math.max(robLine(money, 0, n - 2), robLine(money, 1, n - 1));
    }
    private static long robLine(int[] a, int lo, int hi) {
        long prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            long cur = Math.max(prev1, prev2 + a[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[]{2, 1, 4, 9}));     // 10
        System.out.println(rob(new int[]{1, 5, 2, 1, 6}));  // 11
        System.out.println(rob(new int[]{2, 3, 2}));        // 3
        System.out.println(rob(new int[]{5}));              // 5
    }
}`,
  },

  "ninja's-training": {
    difficulty: 'Medium',
    statement: 'A ninja trains for n days and each day does one of three activities; points[i][a] is the merit for activity a on day i. The same activity cannot be done on two consecutive days. Return the maximum total merit.',
    intuition: "The only thing a day needs to know about the past is which activity was done yesterday. Let dp[a] be the best total up to today if today's activity is a. Then newDp[a] = points[i][a] + max of dp[b] for the two other activities b. Only the previous day's three values are ever needed.",
    time: 'O(n · 3 · 3)',
    space: 'O(1) — three values per day',
    code: `public class NinjaTraining {
    public static int ninjaTraining(int[][] points) {
        int[] dp = points[0].clone();
        for (int i = 1; i < points.length; i++) {
            int[] next = new int[3];
            for (int a = 0; a < 3; a++) {
                int bestPrev = 0;
                for (int b = 0; b < 3; b++) if (b != a) bestPrev = Math.max(bestPrev, dp[b]);
                next[a] = points[i][a] + bestPrev;
            }
            dp = next;
        }
        return Math.max(dp[0], Math.max(dp[1], dp[2]));
    }

    public static void main(String[] args) {
        System.out.println(ninjaTraining(new int[][]{{10, 40, 70}, {20, 50, 80}, {30, 60, 90}}));  // 210
        System.out.println(ninjaTraining(new int[][]{{70, 40, 10}, {180, 20, 5}, {200, 60, 30}})); // 290
        System.out.println(ninjaTraining(new int[][]{{1, 2, 5}}));                                 // 5
    }
}`,
  },

  'unique-paths-ii': {
    difficulty: 'Medium',
    statement: 'In an m × n grid where 1 marks an obstacle, count the paths from the top-left to the bottom-right cell moving only right or down, never entering an obstacle.',
    intuition: "The number of ways to reach a cell is the ways to reach the cell above it plus the ways to reach the cell to its left. An obstacle cell has 0 ways. The start has 1 way, unless it is itself blocked. Keep one row of values and update it in place: dp[c] (which still holds the value from above) += dp[c − 1] (from the left).",
    time: 'O(m · n)',
    space: 'O(n) — one row',
    code: `public class UniquePathsII {
    public static int uniquePaths(int[][] g) {
        int n = g[0].length;
        int[] dp = new int[n];
        dp[0] = g[0][0] == 1 ? 0 : 1;
        for (int[] row : g)
            for (int c = 0; c < n; c++) {
                if (row[c] == 1) dp[c] = 0;
                else if (c > 0) dp[c] += dp[c - 1];
            }
        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(uniquePaths(new int[][]{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}})); // 2
        System.out.println(uniquePaths(new int[][]{{0, 1}, {0, 0}}));                 // 1
        System.out.println(uniquePaths(new int[][]{{1}}));                            // 0
    }
}`,
  },

  'best-time-to-buy-and-sell-stock-with-cooldown-and-transaction-fees': {
    difficulty: 'Medium',
    statement: 'Given daily stock prices and a transaction fee charged on each sale, return the maximum profit from as many buy/sell transactions as you like, holding at most one share at a time.',
    intuition: "Two states at the end of each day: `cash`, the best profit while holding no share, and `hold`, the best profit while holding one. Each day: cash = max(cash, hold + price − fee), either do nothing or sell today. hold = max(hold, cash − price), either do nothing or buy today. Updating cash first is fine: buying back on the same day you sold can't gain anything.",
    time: 'O(n)',
    space: 'O(1)',
    code: `public class StockWithFee {
    public static int maxProfit(int[] prices, int fee) {
        int cash = 0, hold = -prices[0];
        for (int i = 1; i < prices.length; i++) {
            cash = Math.max(cash, hold + prices[i] - fee);
            hold = Math.max(hold, cash - prices[i]);
        }
        return cash;
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{1, 3, 4, 0, 2}, 1));     // 3
        System.out.println(maxProfit(new int[]{1, 3, 2, 8, 4, 9}, 2));  // 8
        System.out.println(maxProfit(new int[]{9, 8, 7}, 1));           // 0
    }
}`,
  },

  'best-time-to-buy-and-sell-stock-iv': {
    difficulty: 'Hard',
    statement: 'Given daily stock prices and k, return the maximum profit from at most k transactions (a buy followed by a sell), holding at most one share at a time.',
    intuition: "Keep buy[t] = the best balance after the t-th buy, and sell[t] = the best balance after the t-th sell. For each price, go through t = 1..k: buy[t] = max(buy[t], sell[t−1] − p), sell[t] = max(sell[t], buy[t] + p). Transaction t can only start from the profit of transaction t − 1. If k ≥ n/2 the limit never binds, so just sum every price increase.",
    time: 'O(n · k)',
    space: 'O(k)',
    code: `import java.util.*;

public class StockIV {
    public static int maxProfit(int k, int[] prices) {
        int n = prices.length;
        if (k >= n / 2) {                                   // effectively unlimited
            int p = 0;
            for (int i = 1; i < n; i++) p += Math.max(0, prices[i] - prices[i - 1]);
            return p;
        }
        int[] buy = new int[k + 1], sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE);
        for (int p : prices)
            for (int t = 1; t <= k; t++) {
                buy[t]  = Math.max(buy[t], sell[t - 1] - p);
                sell[t] = Math.max(sell[t], buy[t] + p);
            }
        return sell[k];
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(2, new int[]{3, 2, 6, 5, 0, 3})); // 7
        System.out.println(maxProfit(2, new int[]{2, 4, 1}));          // 2
        System.out.println(maxProfit(1, new int[]{1, 2, 4, 2, 5, 7, 2, 4, 9, 0})); // 8
    }
}`,
  },

  // ── Dynamic Programming › Knapsack DP ───────────────────────────────────────

  '0-and-1-knapsack': {
    difficulty: 'Medium',
    statement: 'Given item values and weights and a knapsack capacity W, return the maximum total value of a subset of items whose total weight is at most W. Each item is either taken whole or left.',
    intuition: "dp[w] is the best value using capacity w with the items considered so far. For each item, either skip it (dp[w] stays) or take it (dp[w − wt] + val). Loop w downwards from W so that dp[w − wt] still holds the value from before this item. That ensures each item is used at most once. Looping upwards would allow unlimited copies instead.",
    time: 'O(n · W)',
    space: 'O(W)',
    code: `public class Knapsack01 {
    public static int knapsack(int[] val, int[] wt, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < val.length; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[]{60, 100, 120}, new int[]{10, 20, 30}, 50)); // 220
        System.out.println(knapsack(new int[]{10, 40, 30, 50}, new int[]{5, 4, 6, 3}, 10)); // 90
        System.out.println(knapsack(new int[]{5}, new int[]{10}, 3));                      // 0
    }
}`,
  },

  'partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference': {
    difficulty: 'Medium',
    statement: 'Split an array of non-negative integers into two subsets so that the absolute difference of their sums is as small as possible, and return that difference. (LeetCode poses the same problem as "Last Stone Weight II".)',
    intuition: "If one subset sums to s, the other sums to total − s, so the difference is |total − 2s|. Use a subset-sum DP to find every achievable s up to total/2. can[s] is true if some subset sums to s, updated per number with a downward loop like 0/1 knapsack. The largest achievable s ≤ total/2 gives the answer total − 2s.",
    time: 'O(n · total)',
    space: 'O(total)',
    code: `public class MinSubsetSumDifference {
    public static int minDifference(int[] arr) {
        int total = 0;
        for (int x : arr) total += x;
        boolean[] can = new boolean[total / 2 + 1];
        can[0] = true;
        for (int x : arr)
            for (int s = total / 2; s >= x; s--)
                can[s] |= can[s - x];
        for (int s = total / 2; ; s--)
            if (can[s]) return total - 2 * s;
    }

    public static void main(String[] args) {
        System.out.println(minDifference(new int[]{1, 7, 14, 5}));       // 1
        System.out.println(minDifference(new int[]{3, 9, 7, 3}));        // 2
        System.out.println(minDifference(new int[]{2, 7, 4, 1, 8, 1}));  // 1
    }
}`,
  },

  'target-sum': {
    difficulty: 'Medium',
    statement: "Put a '+' or '−' in front of every number in nums. Return the number of sign assignments that evaluate to target, modulo 10⁹ + 7.",
    intuition: "Let P be the sum of the '+' numbers and N the sum of the '−' numbers. Then P − N = target and P + N = total, so P = (total + target) / 2. The question becomes: how many subsets sum to P? That is a counting 0/1 knapsack: ways[s] += ways[s − x], looping s downwards. If total + target is odd or negative, or |target| > total, the answer is 0. Zeros are handled correctly, since each one doubles the count.",
    time: 'O(n · P)',
    space: 'O(P)',
    code: `public class TargetSum {
    public static int findTargetSumWays(int[] nums, int target) {
        final int MOD = 1_000_000_007;
        int total = 0;
        for (int x : nums) total += x;
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
        int P = (total + target) / 2;
        int[] ways = new int[P + 1];
        ways[0] = 1;
        for (int x : nums)
            for (int s = P; s >= x; s--)
                ways[s] = (ways[s] + ways[s - x]) % MOD;
        return ways[P];
    }

    public static void main(String[] args) {
        System.out.println(findTargetSumWays(new int[]{1, 2, 7, 1, 5}, 4));  // 2
        System.out.println(findTargetSumWays(new int[]{1, 1, 1, 1, 1}, 3));  // 5
        System.out.println(findTargetSumWays(new int[]{0, 0, 1}, 1));        // 4
    }
}`,
  },

  'coin-change-ii': {
    difficulty: 'Medium',
    statement: 'Given coin denominations (each usable any number of times) and an amount, return the number of distinct combinations that make up the amount, modulo 10⁹ + 7.',
    intuition: "ways[a] counts the combinations that make amount a. Put the coins in the outer loop and the amounts in the inner loop, going upwards: ways[a] += ways[a − coin]. With coins outside, each combination is built in one fixed coin order, so 1+2 and 2+1 are counted once. The upward loop lets the same coin be used again.",
    time: 'O(n · amount)',
    space: 'O(amount)',
    code: `public class CoinChangeII {
    public static int change(int[] coins, int amount) {
        final int MOD = 1_000_000_007;
        int[] ways = new int[amount + 1];
        ways[0] = 1;
        for (int c : coins)
            for (int a = c; a <= amount; a++)
                ways[a] = (ways[a] + ways[a - c]) % MOD;
        return ways[amount];
    }

    public static void main(String[] args) {
        System.out.println(change(new int[]{2, 4, 10}, 10)); // 4
        System.out.println(change(new int[]{1, 2, 5}, 5));   // 4
        System.out.println(change(new int[]{2}, 3));         // 0
    }
}`,
  },

  // ── Dynamic Programming › Sequence DP ───────────────────────────────────────

  'longest-common-subsequence': {
    difficulty: 'Medium',
    statement: 'Given two strings, return the length of their longest common subsequence: the longest sequence of characters that appears in both, in the same order but not necessarily contiguous.',
    intuition: "dp[i][j] is the LCS of the first i characters of a and the first j characters of b. If a[i−1] == b[j−1], that character extends the LCS: dp[i−1][j−1] + 1. Otherwise drop one character from one of the strings: max(dp[i−1][j], dp[i][j−1]). Each row only needs the row above, so two rolling rows of length m + 1 are enough.",
    time: 'O(n · m)',
    space: 'O(m)',
    code: `public class LongestCommonSubsequence {
    public static int lcs(String a, String b) {
        int n = a.length(), m = b.length();
        int[] prev = new int[m + 1], cur = new int[m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++)
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[m];
    }

    public static void main(String[] args) {
        System.out.println(lcs("bdefg", "bfg"));   // 3
        System.out.println(lcs("abcde", "ace"));   // 3
        System.out.println(lcs("abc", "def"));     // 0
    }
}`,
  },

  'longest-common-substring': {
    difficulty: 'Medium',
    statement: 'Given two strings, return the length of their longest common substring (a contiguous run of characters that appears in both).',
    intuition: "Like LCS, but the match must be contiguous. dp[i][j] is the length of the common substring ending exactly at a[i−1] and b[j−1]. It is dp[i−1][j−1] + 1 when the characters match, and 0 otherwise, because a mismatch breaks the run. The answer is the largest value anywhere in the table, not the last cell.",
    time: 'O(n · m)',
    space: 'O(m)',
    code: `public class LongestCommonSubstring {
    public static int longestCommonSubstr(String a, String b) {
        int n = a.length(), m = b.length(), best = 0;
        int[] prev = new int[m + 1], cur = new int[m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1] + 1 : 0;
                best = Math.max(best, cur[j]);
            }
            int[] t = prev; prev = cur; cur = t;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestCommonSubstr("abcde", "abfce"));    // 2
        System.out.println(longestCommonSubstr("abcjklp", "acjkp"));  // 3
        System.out.println(longestCommonSubstr("xyz", "abc"));        // 0
    }
}`,
  },

  'longest-palindromic-subsequence': {
    difficulty: 'Medium',
    statement: 'Given a string, return the length of its longest palindromic subsequence.',
    intuition: "A subsequence of s that is a palindrome reads the same in reverse, so it is also a subsequence of reverse(s). That makes the answer LCS(s, reverse(s)). You can also use an interval DP: dp[i][j] = dp[i+1][j−1] + 2 if s[i] == s[j], otherwise max(dp[i+1][j], dp[i][j−1]).",
    time: 'O(n²)',
    space: 'O(n)',
    code: `public class LongestPalindromicSubsequence {
    public static int longestPalinSubseq(String s) {
        String r = new StringBuilder(s).reverse().toString();
        int n = s.length();
        int[] prev = new int[n + 1], cur = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++)
                cur[j] = s.charAt(i - 1) == r.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[n];
    }

    public static void main(String[] args) {
        System.out.println(longestPalinSubseq("eeeme"));  // 4
        System.out.println(longestPalinSubseq("bbbab"));  // 4
        System.out.println(longestPalinSubseq("abcd"));   // 1
    }
}`,
  },

  'longest-increasing-subsequence': {
    difficulty: 'Medium',
    statement: 'Given an integer array, return the length of its longest strictly increasing subsequence.',
    intuition: "Patience sorting in O(n log n). tails[len] holds the smallest possible last value of an increasing subsequence of length len + 1. For each x, binary search for the first tail ≥ x and replace it with x, or append x if every tail is smaller. A smaller tail can only make it easier to extend later. The length of tails is the answer, although tails itself isn't necessarily a real subsequence.",
    time: 'O(n log n)',
    space: 'O(n)',
    code: `public class LongestIncreasingSubsequence {
    public static int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int len = 0;
        for (int x : nums) {
            int lo = 0, hi = len;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1; else hi = mid;
            }
            tails[lo] = x;
            if (lo == len) len++;
        }
        return len;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18})); // 4
        System.out.println(lengthOfLIS(new int[]{0, 1, 0, 3, 2, 3}));           // 4
        System.out.println(lengthOfLIS(new int[]{7, 7, 7}));                    // 1
    }
}`,
  },

  'number-of-longest-increasing-subsequences': {
    difficulty: 'Medium',
    statement: 'Given an integer array, return how many longest strictly increasing subsequences it has.',
    intuition: "Along with len[i], the LIS length ending at i, track cnt[i], the number of such subsequences. For each j < i with nums[j] < nums[i]: if len[j] + 1 is longer than len[i], take it and set cnt[i] = cnt[j]. If it ties, add cnt[j] to cnt[i]. The answer is the sum of cnt[i] over all i whose len[i] equals the overall maximum.",
    time: 'O(n²)',
    space: 'O(n)',
    code: `import java.util.*;

public class NumberOfLIS {
    public static int findNumberOfLIS(int[] nums) {
        int n = nums.length, maxLen = 0, total = 0;
        int[] len = new int[n], cnt = new int[n];
        for (int i = 0; i < n; i++) {
            len[i] = 1; cnt[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[j] >= nums[i]) continue;
                if (len[j] + 1 > len[i])       { len[i] = len[j] + 1; cnt[i] = cnt[j]; }
                else if (len[j] + 1 == len[i]) cnt[i] += cnt[j];
            }
            if (len[i] > maxLen) { maxLen = len[i]; total = cnt[i]; }
            else if (len[i] == maxLen) total += cnt[i];
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(findNumberOfLIS(new int[]{1, 3, 5, 4, 7}));  // 2
        System.out.println(findNumberOfLIS(new int[]{2, 2, 2, 2, 2}));  // 5
        System.out.println(findNumberOfLIS(new int[]{1, 2, 4, 3, 5, 4, 7, 2})); // 3
    }
}`,
  },

  'edit-distance': {
    difficulty: 'Medium',
    statement: 'Return the minimum number of single-character insertions, deletions and replacements needed to turn string start into string target.',
    intuition: "dp[i][j] is the cost of turning the first i characters of start into the first j characters of target. If the last characters match, dp[i][j] = dp[i−1][j−1]. Otherwise it is 1 + the cheapest of: replace (dp[i−1][j−1]), delete from start (dp[i−1][j]), or insert into start (dp[i][j−1]). The first row and column are i or j, since against an empty string only pure deletions or insertions work.",
    time: 'O(n · m)',
    space: 'O(m)',
    code: `public class EditDistance {
    public static int editDistance(String a, String b) {
        int n = a.length(), m = b.length();
        int[] prev = new int[m + 1], cur = new int[m + 1];
        for (int j = 0; j <= m; j++) prev[j] = j;
        for (int i = 1; i <= n; i++) {
            cur[0] = i;
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) cur[j] = prev[j - 1];
                else cur[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
            }
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[m];
    }

    public static void main(String[] args) {
        System.out.println(editDistance("planet", "plan"));          // 2
        System.out.println(editDistance("horse", "ros"));            // 3
        System.out.println(editDistance("intention", "execution"));  // 5
    }
}`,
  },

  'wildcard-matching': {
    difficulty: 'Hard',
    statement: "Return true if pattern pat matches the entire string str, where '?' matches any single character and '*' matches any sequence of characters (including an empty one).",
    intuition: "dp[i][j] is whether the first i characters of pat match the first j characters of str. A letter or '?' must match a single character: dp[i−1][j−1] with a matching character. A '*' either matches nothing (dp[i−1][j]) or swallows one more character (dp[i][j−1]). Base cases: an empty pattern matches only the empty string, and a pattern made only of '*'s matches the empty string too.",
    time: 'O(n · m)',
    space: 'O(m)',
    code: `public class WildcardMatching {
    public static boolean wildCard(String str, String pat) {
        int n = pat.length(), m = str.length();
        boolean[] prev = new boolean[m + 1], cur = new boolean[m + 1];
        prev[0] = true;
        for (int i = 1; i <= n; i++) {
            char p = pat.charAt(i - 1);
            cur[0] = prev[0] && p == '*';
            for (int j = 1; j <= m; j++) {
                if (p == '*') cur[j] = prev[j] || cur[j - 1];
                else cur[j] = prev[j - 1] && (p == '?' || p == str.charAt(j - 1));
            }
            boolean[] t = prev; prev = cur; cur = t;
        }
        return prev[m];
    }

    public static void main(String[] args) {
        System.out.println(wildCard("xaylmz", "x?y*z"));   // true
        System.out.println(wildCard("aa", "a"));           // false
        System.out.println(wildCard("adceb", "*a*b"));     // true
        System.out.println(wildCard("acdcb", "a*c?b"));    // false
    }
}`,
  },

  // ── Dynamic Programming › Partition DP ──────────────────────────────────────

  'matrix-chain-multiplication': {
    difficulty: 'Hard',
    statement: 'Matrix Aᵢ has dimensions nums[i−1] × nums[i]. Return the minimum number of scalar multiplications needed to compute A₁A₂…Aₙ₋₁, choosing the parenthesisation freely.',
    intuition: "Every parenthesisation has a final multiplication that splits the chain at some k: (A_i … A_k) × (A_{k+1} … A_j). That final product costs nums[i−1] · nums[k] · nums[j]. So dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + nums[i−1]·nums[k]·nums[j]. Fill the table by increasing chain length so the smaller intervals are ready first.",
    time: 'O(n³)',
    space: 'O(n²)',
    code: `public class MatrixChainMultiplication {
    public static int matrixMultiplication(int[] nums) {
        int n = nums.length;
        int[][] dp = new int[n][n];                             // dp[i][j]: cost for A_i..A_j (1-based)
        for (int len = 2; len < n; len++)
            for (int i = 1; i + len - 1 < n; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++)
                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + nums[i - 1] * nums[k] * nums[j]);
            }
        return dp[1][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(matrixMultiplication(new int[]{10, 15, 20, 25}));      // 8000
        System.out.println(matrixMultiplication(new int[]{4, 2, 3}));             // 24
        System.out.println(matrixMultiplication(new int[]{10, 20, 30, 40, 30}));  // 30000
    }
}`,
  },

  'palindrome-partitioning-ii-': {
    difficulty: 'Hard',
    statement: 'Return the minimum number of cuts needed to split a string into pieces that are all palindromes.',
    intuition: "cuts[i] is the fewest cuts for the prefix s[0..i]. If s[0..i] is itself a palindrome, cuts[i] = 0. Otherwise cuts[i] = min over j of cuts[j−1] + 1 for every j where s[j..i] is a palindrome. A second table, pal[j][i] = (s[j] == s[i] && (i − j < 2 || pal[j+1][i−1])), filled as i grows, answers each palindrome check in O(1).",
    time: 'O(n²)',
    space: 'O(n²)',
    code: `public class PalindromePartitioningII {
    public static int minCut(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];
        int[] cuts = new int[n];
        for (int i = 0; i < n; i++) {
            cuts[i] = i;                                        // worst case: every char alone
            for (int j = 0; j <= i; j++) {
                if (s.charAt(j) == s.charAt(i) && (i - j < 2 || pal[j + 1][i - 1])) {
                    pal[j][i] = true;
                    cuts[i] = (j == 0) ? 0 : Math.min(cuts[i], cuts[j - 1] + 1);
                }
            }
        }
        return cuts[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(minCut("aab"));            // 1
        System.out.println(minCut("a"));              // 0
        System.out.println(minCut("ababbbabbababa")); // 3
    }
}`,
  },
};
