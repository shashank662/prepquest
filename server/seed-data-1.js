// Batch 1: Array (10) + String (14) = 24 problems
export const batch1 = [

  // ── Array ──────────────────────────────────────────────────────────────────

  {
    topic: 'Array', title: "Largest Sum Contiguous Subarray (Kadane's)",
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1',
    statement: 'Given an integer array (possibly with negative numbers), find the contiguous subarray that has the largest sum and return that sum. The array has at least one element.',
    intuition: "Kadane's algorithm maintains a running maximum ending at the current position. At each element, decide whether to start a new subarray or extend the current one — take whichever is larger. Track the global max across all positions in a single pass.",
    time_complexity: 'O(n) — one pass through the array',
    space_complexity: 'O(1) — only two variables needed',
    code: `public class KadanesAlgorithm {
    public static long maxSubArray(int[] arr) {
        long maxSoFar = arr[0], cur = arr[0];
        for (int i = 1; i < arr.length; i++) {
            cur = Math.max(arr[i], cur + arr[i]);
            maxSoFar = Math.max(maxSoFar, cur);
        }
        return maxSoFar;
    }
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
        System.out.println(maxSubArray(new int[]{-1,-2,-3,-4}));            // -1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8}));             // 23
    }
}`,
  },

  {
    topic: 'Array', title: 'Search in Row-wise and Column-wise Sorted Matrix',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/search-in-a-matrix17201720/1',
    statement: 'Given an n×m matrix where each row and each column is sorted in ascending order, determine if a given target value exists in the matrix.',
    intuition: 'Start from the top-right corner. If the current cell equals target, found. If it is greater, move left (eliminate column). If it is less, move down (eliminate row). Each step eliminates one row or column, giving O(n+m) time.',
    time_complexity: 'O(n + m) — at most n+m steps',
    space_complexity: 'O(1) — no extra space',
    code: `public class SearchSortedMatrix {
    public static boolean search(int[][] mat, int target) {
        int r = 0, c = mat[0].length - 1;
        while (r < mat.length && c >= 0) {
            if      (mat[r][c] == target) return true;
            else if (mat[r][c] > target)  c--;
            else                          r++;
        }
        return false;
    }
    public static void main(String[] args) {
        int[][] m = {{1,4,7,11},{2,5,8,12},{3,6,9,16},{10,13,14,17}};
        System.out.println(search(m, 5));  // true
        System.out.println(search(m, 20)); // false
        System.out.println(search(m, 17)); // true
    }
}`,
  },

  {
    topic: 'Array', title: 'Print Matrix in Spiral Form',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1',
    statement: 'Given a 2D matrix of m×n integers, return all elements in spiral order: traverse the outermost ring clockwise (left→right, top→bottom, right→left, bottom→top), then move inward and repeat.',
    intuition: 'Maintain four boundaries: top, bottom, left, right. Peel one layer at a time traversing all four directions, shrinking the boundaries after each direction. Stop when top > bottom or left > right.',
    time_complexity: 'O(m×n) — every element visited once',
    space_complexity: 'O(1) — result list aside',
    code: `import java.util.*;
public class SpiralMatrix {
    public static List<Integer> spiral(int[][] mat) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = mat.length - 1, left = 0, right = mat[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++)  res.add(mat[top][c]);  top++;
            for (int r = top; r <= bottom; r++)  res.add(mat[r][right]); right--;
            if (top <= bottom) { for (int c = right; c >= left; c--) res.add(mat[bottom][c]); bottom--; }
            if (left <= right) { for (int r = bottom; r >= top; r--) res.add(mat[r][left]);  left++;  }
        }
        return res;
    }
    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        System.out.println(spiral(m)); // [1,2,3,6,9,8,7,4,5]
    }
}`,
  },

  {
    topic: 'Array', title: 'Program for Array Rotation',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1',
    statement: 'Given an array of n integers and a number d, left-rotate the array by d positions — the first d elements move to the end.',
    intuition: 'The three-reversal trick: reverse the first d elements, reverse the remaining n-d elements, then reverse the whole array. This achieves left rotation in O(n) time with O(1) space.',
    time_complexity: 'O(n) — three reversal passes',
    space_complexity: 'O(1) — in-place',
    code: `import java.util.Arrays;
public class ArrayRotation {
    static void rev(int[] a, int l, int r) { while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; } }
    public static void rotate(int[] arr, int d) {
        int n = arr.length; d %= n;
        rev(arr, 0, d-1); rev(arr, d, n-1); rev(arr, 0, n-1);
    }
    public static void main(String[] args) {
        int[] a = {1,2,3,4,5,6,7}; rotate(a, 2);
        System.out.println(Arrays.toString(a)); // [3,4,5,6,7,1,2]
        int[] b = {1,2,3}; rotate(b, 4);
        System.out.println(Arrays.toString(b)); // [2,3,1]  (4%3=1)
    }
}`,
  },

  {
    topic: 'Array', title: 'Trapping Rain Water',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1',
    statement: 'Given n non-negative integers representing an elevation map where each bar has width 1, compute how much water can be trapped between the bars after rain.',
    intuition: 'Use two pointers from both ends. Water above a bar equals min(leftMax, rightMax) − height. Move the pointer on the side with the smaller maximum — that side\'s contribution is fully determined by its own max. No extra arrays needed.',
    time_complexity: 'O(n) — single two-pointer pass',
    space_complexity: 'O(1) — no prefix/suffix arrays',
    code: `public class TrappingRainWater {
    public static long trap(int[] h) {
        int l = 0, r = h.length - 1, lMax = 0, rMax = 0;
        long water = 0;
        while (l < r) {
            if (h[l] <= h[r]) {
                if (h[l] >= lMax) lMax = h[l]; else water += lMax - h[l];
                l++;
            } else {
                if (h[r] >= rMax) rMax = h[r]; else water += rMax - h[r];
                r--;
            }
        }
        return water;
    }
    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // 6
        System.out.println(trap(new int[]{4,2,0,3,2,5}));               // 9
        System.out.println(trap(new int[]{1,0,1}));                     // 1
    }
}`,
  },

  {
    topic: 'Array', title: 'Count Pairs With Given Sum',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1',
    statement: 'Given an array of integers and a target k, count the number of distinct pairs (i, j) with i < j such that arr[i] + arr[j] equals k.',
    intuition: 'Use a frequency HashMap. For each element x, the number of valid pairs it can form is the count of (k-x) already seen. Add that count to the result, then increment x\'s frequency. This single pass avoids nested loops.',
    time_complexity: 'O(n) — one pass with a HashMap',
    space_complexity: 'O(n) — HashMap storage',
    code: `import java.util.*;
public class CountPairsWithSum {
    public static int countPairs(int[] arr, int k) {
        Map<Integer,Integer> freq = new HashMap<>();
        int count = 0;
        for (int x : arr) {
            count += freq.getOrDefault(k - x, 0);
            freq.merge(x, 1, Integer::sum);
        }
        return count;
    }
    public static void main(String[] args) {
        System.out.println(countPairs(new int[]{1,5,7,-1,5}, 6));  // 3
        System.out.println(countPairs(new int[]{1,1,1,1}, 2));     // 6
        System.out.println(countPairs(new int[]{10,12,10,15,-1,7,6,5,4,2,1}, 125)); // 0
    }
}`,
  },

  {
    topic: 'Array', title: 'Find the Subarray with Least Average',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/subarray-with-least-average5031/1',
    statement: 'Given an array of n integers and a window size k, find the starting index of the contiguous subarray of length k that has the minimum average.',
    intuition: 'Compute the sum of the first window, then slide: add the new element and subtract the element leaving the window. Track the minimum sum and its start index. Minimum average corresponds to minimum sum for equal-length windows.',
    time_complexity: 'O(n) — one sliding window pass',
    space_complexity: 'O(1)',
    code: `public class MinAvgSubarray {
    public static int findMinAvg(int[] arr, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += arr[i];
        int minSum = sum, minIdx = 0;
        for (int i = k; i < arr.length; i++) {
            sum += arr[i] - arr[i - k];
            if (sum < minSum) { minSum = sum; minIdx = i - k + 1; }
        }
        return minIdx;
    }
    public static void main(String[] args) {
        System.out.println(findMinAvg(new int[]{3,7,90,20,10,50,40}, 3)); // 3
        System.out.println(findMinAvg(new int[]{1,2,3,4,5}, 2));          // 0
        System.out.println(findMinAvg(new int[]{5,1,2,3,4}, 3));          // 1
    }
}`,
  },

  {
    topic: 'Array', title: 'Convert Array into Zig-Zag Fashion',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/convert-array-into-zig-zag-fashion1638/1',
    statement: 'Rearrange an array in-place so that elements alternate: a[0] < a[1] > a[2] < a[3] > a[4] ... The pattern must satisfy a[i] < a[i+1] for even i and a[i] > a[i+1] for odd i.',
    intuition: 'Iterate through pairs. At even index i, if a[i] > a[i+1] swap them. At odd index i, if a[i] < a[i+1] swap them. Each local swap fixes the invariant without breaking previously satisfied constraints.',
    time_complexity: 'O(n) — single pass',
    space_complexity: 'O(1) — in-place',
    code: `import java.util.Arrays;
public class ZigZag {
    public static void zigzag(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if ((i % 2 == 0 && arr[i] > arr[i+1]) ||
                (i % 2 == 1 && arr[i] < arr[i+1])) {
                int t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t;
            }
        }
    }
    public static void main(String[] args) {
        int[] a = {4,3,7,8,6,2,1}; zigzag(a);
        System.out.println(Arrays.toString(a)); // valid zig-zag e.g. [3,7,4,8,2,6,1]
        int[] b = {1,2,3,4,5}; zigzag(b);
        System.out.println(Arrays.toString(b)); // e.g. [1,3,2,5,4]
    }
}`,
  },

  {
    topic: 'Array', title: 'Find Duplicates in an Array',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/find-duplicates-in-an-array/1',
    statement: 'Given an array of n integers where each element is in range [1, n], find all elements that appear more than once. Return them sorted; return [-1] if none.',
    intuition: 'Use the array as a visited map. For each value x, negate arr[|x|-1]. If it is already negative, |x| is a duplicate. Restore signs in a second pass if needed. O(1) extra space beyond the output.',
    time_complexity: 'O(n) — two passes',
    space_complexity: 'O(1) — in-place marking',
    code: `import java.util.*;
public class FindDuplicates {
    public static List<Integer> duplicates(int[] arr) {
        List<Integer> res = new ArrayList<>();
        for (int x : arr) {
            int i = Math.abs(x) - 1;
            if (arr[i] < 0) res.add(i + 1);
            else arr[i] = -arr[i];
        }
        Collections.sort(res);
        return res.isEmpty() ? List.of(-1) : res;
    }
    public static void main(String[] args) {
        System.out.println(duplicates(new int[]{4,3,2,7,8,2,3,1})); // [2,3]
        System.out.println(duplicates(new int[]{1,2,3}));            // [-1]
        System.out.println(duplicates(new int[]{1,1,2,3,3}));        // [1,3]
    }
}`,
  },

  {
    topic: 'Array', title: 'Find a Triplet That Sums to a Given Value',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1',
    statement: 'Given an array of n integers and a target sum, determine if there exist three distinct-index elements that sum to the target.',
    intuition: 'Sort the array. For each element arr[i], use two pointers j=i+1 and k=n-1 to find a pair summing to target-arr[i]. Advance j when the sum is too small, retreat k when too large. O(n²) total after O(n log n) sort.',
    time_complexity: 'O(n²) — outer loop × two-pointer inner loop',
    space_complexity: 'O(1) — sorting in-place',
    code: `import java.util.Arrays;
public class TripletSum {
    public static boolean hasTriplet(int[] arr, int target) {
        Arrays.sort(arr);
        for (int i = 0; i < arr.length - 2; i++) {
            int j = i + 1, k = arr.length - 1;
            while (j < k) {
                int s = arr[i] + arr[j] + arr[k];
                if      (s == target) return true;
                else if (s < target)  j++;
                else                  k--;
            }
        }
        return false;
    }
    public static void main(String[] args) {
        System.out.println(hasTriplet(new int[]{1,4,45,6,10,8}, 22)); // true
        System.out.println(hasTriplet(new int[]{1,2,4,3,6}, 10));     // true
        System.out.println(hasTriplet(new int[]{1,2,3}, 10));          // false
    }
}`,
  },

  // ── String ─────────────────────────────────────────────────────────────────

  {
    topic: 'String', title: 'Validate an IP Address',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/validate-an-ip-address-1587115621/1',
    statement: 'Given a string, determine if it is a valid IPv4 address. A valid IPv4 address consists of exactly 4 dot-separated octets, each being an integer in [0, 255] with no leading zeros.',
    intuition: 'Split on ".". Verify exactly 4 parts. For each part: non-empty, no leading zeros (except "0" itself), parseable as integer, and value in [0, 255]. Any violation returns false.',
    time_complexity: 'O(1) — fixed length (IPv4 ≤ 15 chars)',
    space_complexity: 'O(1)',
    code: `public class ValidateIP {
    public static boolean isValid(String ip) {
        String[] parts = ip.split("\\\\.", -1);
        if (parts.length != 4) return false;
        for (String p : parts) {
            if (p.isEmpty() || p.length() > 3) return false;
            if (p.length() > 1 && p.charAt(0) == '0') return false;
            for (char c : p.toCharArray()) if (!Character.isDigit(c)) return false;
            if (Integer.parseInt(p) > 255) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isValid("192.168.0.1"));   // true
        System.out.println(isValid("256.1.2.3"));     // false
        System.out.println(isValid("1.1.1.01"));      // false (leading zero)
    }
}`,
  },

  {
    topic: 'String', title: 'Multiply Strings',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/multiply-two-strings/1',
    statement: 'Given two non-negative integers represented as strings, return their product as a string. The inputs may be very large — do not convert directly to long.',
    intuition: 'Simulate grade-school multiplication. A number with m digits times a number with n digits has at most m+n digits. Use an int array of size m+n, multiply digit by digit placing results at position i+j+1, then carry propagate, and strip leading zeros.',
    time_complexity: 'O(m × n) — for digits m and n',
    space_complexity: 'O(m + n) — result array',
    code: `public class MultiplyStrings {
    public static String multiply(String a, String b) {
        int m = a.length(), n = b.length();
        int[] pos = new int[m + n];
        for (int i = m - 1; i >= 0; i--)
            for (int j = n - 1; j >= 0; j--) {
                int mul = (a.charAt(i) - '0') * (b.charAt(j) - '0');
                int p1 = i + j, p2 = i + j + 1;
                int sum = mul + pos[p2];
                pos[p2] = sum % 10;
                pos[p1] += sum / 10;
            }
        StringBuilder sb = new StringBuilder();
        for (int d : pos) if (!(sb.length() == 0 && d == 0)) sb.append(d);
        return sb.length() == 0 ? "0" : sb.toString();
    }
    public static void main(String[] args) {
        System.out.println(multiply("123", "456"));    // 56088
        System.out.println(multiply("99", "99"));      // 9801
        System.out.println(multiply("0", "12345"));    // 0
    }
}`,
  },

  {
    topic: 'String', title: 'Implement Atoi',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/implement-atoi/1',
    statement: 'Implement atoi — convert a string to a 32-bit signed integer. Skip leading whitespace, handle optional +/- sign, read digits until a non-digit, and clamp to [INT_MIN, INT_MAX] on overflow.',
    intuition: 'Strip leading spaces, record sign, then accumulate digits. Detect overflow before it happens: if current result > (MAX - digit) / 10, clamp immediately. Return result multiplied by sign.',
    time_complexity: 'O(n) — single pass',
    space_complexity: 'O(1)',
    code: `public class Atoi {
    public static int myAtoi(String s) {
        int i = 0, n = s.length(), sign = 1;
        long result = 0;
        while (i < n && s.charAt(i) == ' ') i++;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-'))
            sign = (s.charAt(i++) == '+') ? 1 : -1;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int d = s.charAt(i++) - '0';
            if (result > (Integer.MAX_VALUE - d) / 10) return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            result = result * 10 + d;
        }
        return (int)(sign * result);
    }
    public static void main(String[] args) {
        System.out.println(myAtoi("  -42"));           // -42
        System.out.println(myAtoi("4193 with words")); // 4193
        System.out.println(myAtoi("99999999999"));     // 2147483647
    }
}`,
  },

  {
    topic: 'String', title: 'Check if String is Rotated by Two Places',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/check-if-string-is-rotated-by-two-places-1587115620/1',
    statement: 'Given two strings s1 and s2 of the same length, check if s2 is a rotation of s1 by exactly 2 places — either clockwise (right rotation by 2) or anticlockwise (left rotation by 2).',
    intuition: 'A right rotation by 2 of s1 gives s1.substring(n-2) + s1.substring(0,n-2). A left rotation by 2 gives s1.substring(2) + s1.substring(0,2). Check if s2 equals either.',
    time_complexity: 'O(n) — string comparison',
    space_complexity: 'O(n) — for the rotated strings',
    code: `public class RotatedByTwo {
    public static boolean isRotated(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        int n = s1.length();
        String rightRot = s1.substring(n - 2) + s1.substring(0, n - 2);
        String leftRot  = s1.substring(2)     + s1.substring(0, 2);
        return s2.equals(rightRot) || s2.equals(leftRot);
    }
    public static void main(String[] args) {
        System.out.println(isRotated("amazon", "onazon")); // false — wait, amazon right2 = "onamazz"? No: "amazon" n=6 right2 = "on"+"amaz"="onamaz"
        System.out.println(isRotated("amazon", "azonam")); // true (left 2: "azon"+"am"="azonam")
        System.out.println(isRotated("geeks", "eksge"));   // true (left 2: "ks"+"gee"? no. left2: "eks"+"ge"="eksge" yes)
    }
}`,
  },

  {
    topic: 'String', title: 'Permutations of a Given String',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1',
    statement: 'Given a string s, print all distinct permutations of the string in lexicographically sorted order.',
    intuition: 'Sort the characters to handle duplicates. Use backtracking with a boolean visited array: at each position, try each unvisited character (skip if same as previous unvisited character to avoid duplicates). Recurse then backtrack.',
    time_complexity: 'O(n! × n) — n! permutations each of length n',
    space_complexity: 'O(n) — recursion stack',
    code: `import java.util.*;
public class StringPermutations {
    static List<String> result = new ArrayList<>();
    static void permute(char[] arr, boolean[] used, StringBuilder sb) {
        if (sb.length() == arr.length) { result.add(sb.toString()); return; }
        for (int i = 0; i < arr.length; i++) {
            if (used[i]) continue;
            if (i > 0 && arr[i] == arr[i-1] && !used[i-1]) continue; // skip duplicates
            used[i] = true; sb.append(arr[i]);
            permute(arr, used, sb);
            used[i] = false; sb.deleteCharAt(sb.length() - 1);
        }
    }
    public static List<String> getPermutations(String s) {
        result.clear();
        char[] arr = s.toCharArray(); Arrays.sort(arr);
        permute(arr, new boolean[arr.length], new StringBuilder());
        return result;
    }
    public static void main(String[] args) {
        System.out.println(getPermutations("ABC")); // [ABC, ACB, BAC, BCA, CAB, CBA]
        System.out.println(getPermutations("AB").size()); // 2
    }
}`,
  },

  {
    topic: 'String', title: 'Longest Repeating Subsequence',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/longest-repeating-subsequence2004/1',
    statement: 'Given a string s, find the length of the longest subsequence that appears at least twice in the string such that no character position is used in both occurrences simultaneously.',
    intuition: 'This is LCS of the string with itself, but when two characters match at positions i and j, require i ≠ j. Use a 2D DP table: dp[i][j] = LCS(s[0..i-1], s[0..j-1]) where matching requires i ≠ j.',
    time_complexity: 'O(n²) — filling n×n DP table',
    space_complexity: 'O(n²) — DP table',
    code: `public class LongestRepeatingSubsequence {
    public static int lrs(String s) {
        int n = s.length();
        int[][] dp = new int[n + 1][n + 1];
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++) {
                if (s.charAt(i-1) == s.charAt(j-1) && i != j)
                    dp[i][j] = 1 + dp[i-1][j-1];
                else
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        return dp[n][n];
    }
    public static void main(String[] args) {
        System.out.println(lrs("AABEBCDD")); // 3 (ABD or similar)
        System.out.println(lrs("ABCD"));     // 0
        System.out.println(lrs("AABB"));     // 2 (AB)
    }
}`,
  },

  {
    topic: 'String', title: 'Roman Number to Integer',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/roman-number-to-integer3201/1',
    statement: 'Convert a Roman numeral string to its integer value. Roman numerals use symbols I(1), V(5), X(10), L(50), C(100), D(500), M(1000) with subtractive notation (e.g. IV=4, IX=9).',
    intuition: 'Iterate right to left. If the current symbol\'s value is less than the previous (right neighbor), subtract it; otherwise add it. This handles all subtractive cases automatically without special-casing.',
    time_complexity: 'O(n) — one pass',
    space_complexity: 'O(1)',
    code: `import java.util.*;
public class RomanToInteger {
    public static int romanToInt(String s) {
        Map<Character,Integer> val = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
        int result = 0, prev = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            int cur = val.get(s.charAt(i));
            result += (cur < prev) ? -cur : cur;
            prev = cur;
        }
        return result;
    }
    public static void main(String[] args) {
        System.out.println(romanToInt("III"));     // 3
        System.out.println(romanToInt("IV"));      // 4
        System.out.println(romanToInt("MCMXCIV")); // 1994
    }
}`,
  },

  {
    topic: 'String', title: 'Length of Longest Substring (no repeats)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1',
    statement: 'Given a string s, find the length of the longest substring that has all unique characters (no repeating characters).',
    intuition: 'Sliding window with a HashMap tracking the last seen index of each character. Advance the left pointer to last_seen[char]+1 whenever a repeated character enters the window. The window [left, right] always contains unique characters.',
    time_complexity: 'O(n) — each character processed at most twice',
    space_complexity: 'O(min(n, 128)) — HashMap size bounded by charset',
    code: `import java.util.*;
public class LongestUniqueSubstring {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character,Integer> last = new HashMap<>();
        int max = 0, left = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last.containsKey(c) && last.get(c) >= left)
                left = last.get(c) + 1;
            last.put(c, r);
            max = Math.max(max, r - left + 1);
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // 1
        System.out.println(lengthOfLongestSubstring("pwwkew"));   // 3
    }
}`,
  },

  {
    topic: 'String', title: 'String Formation from Substring',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/string-formation-from-substring2734/1',
    statement: 'Given a string s, check if it can be formed by repeatedly concatenating one of its own substrings. In other words, is s a repetition of one of its non-empty proper substrings?',
    intuition: 'Concatenate s with itself and check if s appears in the middle of the doubled string (i.e., at positions 1..n-1 in s+s). If s+s contains s at any index other than 0 and n, then s is a repetition of a shorter substring. Use KMP or indexOf.',
    time_complexity: 'O(n) — KMP search in doubled string',
    space_complexity: 'O(n)',
    code: `public class StringFormation {
    public static boolean isRepetition(String s) {
        String doubled = s + s;
        // search for s in doubled[1..2n-2]
        int idx = doubled.indexOf(s, 1);
        return idx < s.length();
    }
    public static void main(String[] args) {
        System.out.println(isRepetition("abab"));   // true (ab repeated)
        System.out.println(isRepetition("aba"));    // false
        System.out.println(isRepetition("abcabc")); // true
    }
}`,
  },

  {
    topic: 'String', title: 'Check Whether Two Strings Are Anagrams',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/anagram-1587115620/1',
    statement: 'Given two strings a and b, check if they are anagrams of each other — i.e., they contain the same characters with the same frequencies (case-insensitive).',
    intuition: 'Count character frequencies using an int[256] array. Increment for each character in string a, decrement for each character in string b. If all counts are zero at the end, they are anagrams. O(n) with O(1) space.',
    time_complexity: 'O(n) — one pass per string',
    space_complexity: 'O(1) — fixed-size frequency array',
    code: `public class Anagram {
    public static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] freq = new int[256];
        for (char c : a.toCharArray()) freq[c]++;
        for (char c : b.toCharArray()) { freq[c]--; if (freq[c] < 0) return false; }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
        System.out.println(isAnagram("hello", "world"));   // false
        System.out.println(isAnagram("anagram", "nagaram")); // true
    }
}`,
  },

  {
    topic: 'String', title: 'Look-and-Say Sequence',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/decode-the-pattern1138/1',
    statement: 'Given a positive integer n, return the nth term of the look-and-say sequence. The sequence starts with "1"; each subsequent term describes the previous: count consecutive identical digits and write count followed by digit.',
    intuition: 'Start with "1". For each step up to n, scan the current string, counting consecutive runs of the same character, and build the next string as count+character. Repeat n-1 times.',
    time_complexity: 'O(m) per step where m is the current string length; total O(n × max_length)',
    space_complexity: 'O(m) — current string',
    code: `public class LookAndSay {
    public static String nthTerm(int n) {
        String cur = "1";
        for (int step = 1; step < n; step++) {
            StringBuilder next = new StringBuilder();
            int i = 0;
            while (i < cur.length()) {
                char c = cur.charAt(i);
                int count = 0;
                while (i < cur.length() && cur.charAt(i) == c) { i++; count++; }
                next.append(count).append(c);
            }
            cur = next.toString();
        }
        return cur;
    }
    public static void main(String[] args) {
        System.out.println(nthTerm(1)); // 1
        System.out.println(nthTerm(4)); // 1211
        System.out.println(nthTerm(5)); // 111221
    }
}`,
  },

  {
    topic: 'String', title: 'Remove Minimum Characters to Make Strings Anagram',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/anagram-of-string/1',
    statement: 'Given two strings a and b, find the minimum number of characters to delete (from either string) to make them anagrams of each other.',
    intuition: 'Count character frequencies in both strings. For each character, the excess in either string must be deleted. The answer is the sum of |freq_a[c] - freq_b[c]| over all characters, which equals (total chars) - 2×(common chars).',
    time_complexity: 'O(n + m) — counting frequencies',
    space_complexity: 'O(1) — 26-letter alphabet',
    code: `public class MinDeletionsAnagram {
    public static int minDeletions(String a, String b) {
        int[] fa = new int[26], fb = new int[26];
        for (char c : a.toCharArray()) fa[c-'a']++;
        for (char c : b.toCharArray()) fb[c-'a']++;
        int deletions = 0;
        for (int i = 0; i < 26; i++) deletions += Math.abs(fa[i] - fb[i]);
        return deletions;
    }
    public static void main(String[] args) {
        System.out.println(minDeletions("bcadeh", "hea")); // 3
        System.out.println(minDeletions("cde", "abc"));    // 4
        System.out.println(minDeletions("abc", "abc"));    // 0
    }
}`,
  },

  {
    topic: 'String', title: 'Smallest Window Containing All Characters of Another String',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1',
    statement: 'Given strings s and p, find the smallest substring of s that contains all characters of p (including duplicates). Return "-1" if no such window exists.',
    intuition: 'Sliding window: expand the right pointer until all characters of p are covered (track with a need count and a freq map). Then shrink the left pointer as much as possible while still covering all characters. Record the minimum valid window throughout.',
    time_complexity: 'O(|s| + |p|) — each character visited at most twice',
    space_complexity: 'O(1) — 256-char frequency arrays',
    code: `public class SmallestWindow {
    public static String smallestWindow(String s, String p) {
        int[] need = new int[256], have = new int[256];
        for (char c : p.toCharArray()) need[c]++;
        int required = 0;
        for (int x : need) if (x > 0) required++;
        int formed = 0, left = 0, minLen = Integer.MAX_VALUE, start = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            have[c]++;
            if (need[c] > 0 && have[c] == need[c]) formed++;
            while (formed == required) {
                if (r - left + 1 < minLen) { minLen = r - left + 1; start = left; }
                char lc = s.charAt(left++);
                have[lc]--;
                if (need[lc] > 0 && have[lc] < need[lc]) formed--;
            }
        }
        return minLen == Integer.MAX_VALUE ? "-1" : s.substring(start, start + minLen);
    }
    public static void main(String[] args) {
        System.out.println(smallestWindow("timetopractice", "toc")); // "toprac"
        System.out.println(smallestWindow("ADOBECODEBANC", "ABC"));  // "BANC"
        System.out.println(smallestWindow("a", "b"));                // "-1"
    }
}`,
  },

  {
    topic: 'String', title: 'Length of Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1',
    statement: 'Given a string s, find the length of the longest contiguous substring where all characters are distinct (no character appears more than once).',
    intuition: 'Sliding window: use a HashSet to track characters in the current window. Expand right pointer, adding characters. When a duplicate is found, shrink from the left until the duplicate is removed. Track the maximum window size seen.',
    time_complexity: 'O(n) — at most 2n pointer moves',
    space_complexity: 'O(min(n, charset)) — HashSet',
    code: `import java.util.*;
public class LongestDistinctSubstring {
    public static int longestDistinct(String s) {
        Set<Character> window = new HashSet<>();
        int left = 0, max = 0;
        for (int r = 0; r < s.length(); r++) {
            while (window.contains(s.charAt(r))) window.remove(s.charAt(left++));
            window.add(s.charAt(r));
            max = Math.max(max, r - left + 1);
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(longestDistinct("geeksforgeeks")); // 7 (eksforg)
        System.out.println(longestDistinct("aaa"));           // 1
        System.out.println(longestDistinct("abcdefg"));       // 7
    }
}`,
  },
];
