// Striver's 180 — Graphs (29)
export default {

  // ── Graphs › BFS / DFS ──────────────────────────────────────────────────────

  'flood-fill-algorithm': {
    difficulty: 'Easy',
    statement: 'Given an image as a 2-D grid of pixel values, a start pixel (sr, sc) and a new colour, recolour the start pixel and every pixel connected to it 4-directionally that has the same original colour.',
    intuition: "This is DFS over the region of same-coloured cells around (sr, sc). Remember the original colour, repaint each matching cell, and recurse into its four neighbours. Repainting doubles as marking a cell visited. The one trap: if newColor already equals the original, return straight away, otherwise the DFS keeps revisiting cells forever.",
    time: 'O(n · m)',
    space: 'O(n · m) — recursion in the worst case',
    code: `import java.util.*;

public class FloodFill {
    public static int[][] floodFill(int[][] img, int sr, int sc, int newColor) {
        int old = img[sr][sc];
        if (old != newColor) fill(img, sr, sc, old, newColor);
        return img;
    }
    private static void fill(int[][] img, int r, int c, int old, int color) {
        if (r < 0 || c < 0 || r >= img.length || c >= img[0].length || img[r][c] != old) return;
        img[r][c] = color;
        fill(img, r + 1, c, old, color); fill(img, r - 1, c, old, color);
        fill(img, r, c + 1, old, color); fill(img, r, c - 1, old, color);
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(floodFill(new int[][]{{1, 1, 1}, {1, 1, 0}, {1, 0, 1}}, 1, 1, 2))); // [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
        System.out.println(Arrays.deepToString(floodFill(new int[][]{{0, 0, 0}, {0, 0, 0}}, 0, 0, 0)));             // [[0, 0, 0], [0, 0, 0]]
    }
}`,
  },

  'number-of-islands': {
    difficulty: 'Medium',
    statement: "Given a grid of '1' (land) and '0' (water), count the islands, where land cells are connected in all 8 directions (horizontally, vertically and diagonally). (LeetCode's version uses only the 4 side directions.)",
    intuition: "Each island is one connected component. Scan the grid, and every time you find land that hasn't been visited, count a new island and flood it with BFS or DFS, marking every connected land cell as visited (here by sinking it to '0'). To switch to 4-directional connectivity, just change the direction list.",
    time: 'O(n · m)',
    space: 'O(n · m) — BFS queue in the worst case',
    code: `import java.util.*;

public class NumberOfIslands {
    public static int numIslands(char[][] g) {
        int count = 0;
        for (int r = 0; r < g.length; r++)
            for (int c = 0; c < g[0].length; c++)
                if (g[r][c] == '1') { count++; sink(g, r, c); }
        return count;
    }
    private static void sink(char[][] g, int sr, int sc) {
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[]{sr, sc});
        g[sr][sc] = '0';
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {
                    int r = cur[0] + dr, c = cur[1] + dc;
                    if (r >= 0 && c >= 0 && r < g.length && c < g[0].length && g[r][c] == '1') {
                        g[r][c] = '0';
                        q.add(new int[]{r, c});
                    }
                }
        }
    }
    static char[][] grid(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    public static void main(String[] args) {
        System.out.println(numIslands(grid("11101", "10000", "11101", "00011"))); // 2
        System.out.println(numIslands(grid("110", "001")));                       // 1
        System.out.println(numIslands(grid("101", "000", "101")));                // 4
    }
}`,
  },

  'rotten-oranges': {
    difficulty: 'Medium',
    statement: 'In a grid, 2 is a rotten orange, 1 a fresh orange and 0 an empty cell. Every minute each rotten orange rots its fresh 4-directional neighbours. Return the minutes until no fresh orange is left, or −1 if that never happens.',
    intuition: "Multi-source BFS: put every rotten orange in the queue at time 0 and spread one level per minute. Each level of BFS is one minute. Count the fresh oranges at the start and decrease the count as they rot. If any are still fresh when the queue empties, they can't be reached, so return −1.",
    time: 'O(n · m)',
    space: 'O(n · m)',
    code: `import java.util.*;

public class RottenOranges {
    public static int orangesRotting(int[][] g) {
        Deque<int[]> q = new ArrayDeque<>();
        int fresh = 0;
        for (int r = 0; r < g.length; r++)
            for (int c = 0; c < g[0].length; c++) {
                if (g[r][c] == 2) q.add(new int[]{r, c});
                else if (g[r][c] == 1) fresh++;
            }
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            minutes++;
            for (int size = q.size(); size > 0; size--) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int r = cur[0] + d[0], c = cur[1] + d[1];
                    if (r >= 0 && c >= 0 && r < g.length && c < g[0].length && g[r][c] == 1) {
                        g[r][c] = 2; fresh--;
                        q.add(new int[]{r, c});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }

    public static void main(String[] args) {
        System.out.println(orangesRotting(new int[][]{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}})); // 4
        System.out.println(orangesRotting(new int[][]{{2, 1, 1}, {0, 1, 1}, {1, 0, 1}})); // -1
        System.out.println(orangesRotting(new int[][]{{0, 2}}));                          // 0
    }
}`,
  },

  'distance-of-nearest-cell-having-one': {
    difficulty: 'Medium',
    statement: 'Given a binary grid, return a grid where each cell holds the Manhattan distance to its nearest cell containing 1 (cells that are 1 get 0).',
    intuition: "Running BFS from every 0 would repeat the same work over and over. Run it backwards instead: start one BFS from all the 1s together at distance 0. Moving to an unvisited neighbour adds 1. BFS reaches each cell first from its closest 1, so the first distance written into a cell is final.",
    time: 'O(n · m)',
    space: 'O(n · m)',
    code: `import java.util.*;

public class NearestOneDistance {
    public static int[][] nearest(int[][] g) {
        int n = g.length, m = g[0].length;
        int[][] dist = new int[n][m];
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < n; r++)
            for (int c = 0; c < m; c++) {
                if (g[r][c] == 1) q.add(new int[]{r, c});
                else dist[r][c] = -1;                             // unvisited
            }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int r = cur[0] + d[0], c = cur[1] + d[1];
                if (r >= 0 && c >= 0 && r < n && c < m && dist[r][c] == -1) {
                    dist[r][c] = dist[cur[0]][cur[1]] + 1;
                    q.add(new int[]{r, c});
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(nearest(new int[][]{{0, 1, 1, 0}, {1, 1, 0, 0}, {0, 0, 1, 1}}))); // [[1, 0, 0, 1], [0, 0, 1, 1], [1, 1, 0, 0]]
        System.out.println(Arrays.deepToString(nearest(new int[][]{{1, 0, 0}, {0, 0, 0}})));                     // [[0, 1, 2], [1, 2, 3]]
    }
}`,
  },

  'surrounded-regions': {
    difficulty: 'Medium',
    statement: "Given a grid of 'X' and 'O', capture every region of 'O's that is completely surrounded by 'X' (not connected to the border) by flipping it to 'X'.",
    intuition: "Instead of finding the surrounded regions, find the safe ones. Any 'O' connected to the border can't be captured. Run DFS from every border 'O' and mark its region with a temporary '#'. Then sweep the grid: remaining 'O's are surrounded and become 'X', and '#' cells go back to 'O'.",
    time: 'O(n · m)',
    space: 'O(n · m) — recursion in the worst case',
    code: `import java.util.*;

public class SurroundedRegions {
    public static void solve(char[][] b) {
        int n = b.length, m = b[0].length;
        for (int r = 0; r < n; r++) { mark(b, r, 0); mark(b, r, m - 1); }
        for (int c = 0; c < m; c++) { mark(b, 0, c); mark(b, n - 1, c); }
        for (int r = 0; r < n; r++)
            for (int c = 0; c < m; c++)
                b[r][c] = (b[r][c] == '#') ? 'O' : 'X';
    }
    private static void mark(char[][] b, int r, int c) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != 'O') return;
        b[r][c] = '#';
        mark(b, r + 1, c); mark(b, r - 1, c); mark(b, r, c + 1); mark(b, r, c - 1);
    }
    static char[][] grid(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    public static void main(String[] args) {
        char[][] b = grid("XXXX", "XOOX", "XXOX", "XOXX");
        solve(b);
        System.out.println(Arrays.deepToString(b)); // [[X, X, X, X], [X, X, X, X], [X, X, X, X], [X, O, X, X]]
        char[][] c = grid("OOO", "OXO", "OOO");
        solve(c);
        System.out.println(Arrays.deepToString(c)); // [[O, O, O], [O, X, O], [O, O, O]]
    }
}`,
  },

  'number-of-distinct-islands': {
    difficulty: 'Medium',
    statement: 'Given a binary grid, count the distinct island shapes (4-directionally connected 1s). Two islands are the same only if one can be translated onto the other, without rotation or reflection.',
    intuition: "Describe each island's shape by the offsets of its cells from the island's first cell, (r − r0, c − c0), listed in DFS order. Translated copies produce exactly the same list, and different shapes produce different lists. Put each signature into a HashSet. Its size is the number of distinct islands.",
    time: 'O(n · m)',
    space: 'O(n · m)',
    code: `import java.util.*;

public class DistinctIslands {
    public static int countDistinctIslands(int[][] g) {
        Set<String> shapes = new HashSet<>();
        for (int r = 0; r < g.length; r++)
            for (int c = 0; c < g[0].length; c++)
                if (g[r][c] == 1) {
                    StringBuilder sig = new StringBuilder();
                    dfs(g, r, c, r, c, sig);
                    shapes.add(sig.toString());
                }
        return shapes.size();
    }
    private static void dfs(int[][] g, int r, int c, int r0, int c0, StringBuilder sig) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return;
        g[r][c] = 0;
        sig.append(r - r0).append(':').append(c - c0).append(';');
        dfs(g, r + 1, c, r0, c0, sig); dfs(g, r - 1, c, r0, c0, sig);
        dfs(g, r, c + 1, r0, c0, sig); dfs(g, r, c - 1, r0, c0, sig);
    }

    public static void main(String[] args) {
        System.out.println(countDistinctIslands(new int[][]{{1, 1, 0, 0, 0}, {1, 1, 0, 0, 0}, {0, 0, 0, 1, 1}, {0, 0, 0, 1, 1}})); // 1
        System.out.println(countDistinctIslands(new int[][]{{1, 1, 0, 1, 1}, {1, 0, 0, 0, 0}, {0, 0, 0, 0, 1}, {1, 1, 0, 1, 1}})); // 3
    }
}`,
  },

  'detect-a-cycle-in-an-undirected-graph': {
    difficulty: 'Medium',
    statement: 'Given an undirected graph as an adjacency list with V vertices (0 … V−1), return true if it contains a cycle.',
    intuition: "BFS or DFS from every unvisited vertex, remembering the parent each vertex was reached from. In an undirected graph, the edge back to the parent is the same edge you just used, so it doesn't count. Reaching any other already-visited vertex means a second path exists, which means a cycle. Starting from every unvisited vertex covers disconnected graphs.",
    time: 'O(V + E)',
    space: 'O(V)',
    code: `import java.util.*;

public class UndirectedCycle {
    public static boolean isCycle(int V, List<List<Integer>> adj) {
        boolean[] seen = new boolean[V];
        for (int s = 0; s < V; s++) {
            if (seen[s]) continue;
            Deque<int[]> q = new ArrayDeque<>();                  // {node, parent}
            q.add(new int[]{s, -1});
            seen[s] = true;
            while (!q.isEmpty()) {
                int[] cur = q.poll();
                for (int nb : adj.get(cur[0])) {
                    if (!seen[nb]) { seen[nb] = true; q.add(new int[]{nb, cur[0]}); }
                    else if (nb != cur[1]) return true;
                }
            }
        }
        return false;
    }
    static List<List<Integer>> adj(int[]... lists) {
        List<List<Integer>> g = new ArrayList<>();
        for (int[] l : lists) { List<Integer> row = new ArrayList<>(); for (int x : l) row.add(x); g.add(row); }
        return g;
    }

    public static void main(String[] args) {
        System.out.println(isCycle(6, adj(new int[]{1, 3}, new int[]{0, 2, 4}, new int[]{1, 5}, new int[]{0, 4}, new int[]{1, 3, 5}, new int[]{2, 4}))); // true
        System.out.println(isCycle(3, adj(new int[]{1}, new int[]{0, 2}, new int[]{1})));   // false
        System.out.println(isCycle(4, adj(new int[]{}, new int[]{2, 3}, new int[]{1, 3}, new int[]{1, 2}))); // true
    }
}`,
  },

  'bipartite-graph': {
    difficulty: 'Medium',
    statement: 'Given an undirected graph with V vertices and an edge list, return true if its vertices can be split into two sets so that every edge connects the two sets.',
    intuition: "Try to 2-colour the graph. BFS from each uncoloured vertex, giving neighbours the opposite colour. If an edge ever joins two vertices of the same colour, 2-colouring fails, which happens exactly when the graph has an odd cycle, so it isn't bipartite. Start a new BFS in every component.",
    time: 'O(V + E)',
    space: 'O(V + E)',
    code: `import java.util.*;

public class BipartiteGraph {
    public static boolean isBipartite(int V, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] color = new int[V];                                 // 0 = uncoloured, 1 / -1
        for (int s = 0; s < V; s++) {
            if (color[s] != 0) continue;
            Deque<Integer> q = new ArrayDeque<>();
            q.add(s); color[s] = 1;
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == 0) { color[v] = -color[u]; q.add(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isBipartite(4, new int[][]{{0, 1}, {0, 3}, {1, 2}, {2, 3}})); // true
        System.out.println(isBipartite(3, new int[][]{{0, 1}, {1, 2}, {2, 0}}));         // false
        System.out.println(isBipartite(3, new int[][]{}));                               // true
    }
}`,
  },

  // ── Graphs › Ordering & Connectivity ────────────────────────────────────────

  'detect-a-cycle-in-a-directed-graph': {
    difficulty: 'Medium',
    statement: 'Given a directed graph as an adjacency list with V vertices, return true if it contains a cycle.',
    intuition: "In a directed graph, reaching an already-visited vertex isn't enough, because it could sit on a different branch. The cycle has to come back to a vertex on the current DFS path. Track three states: 0 = unvisited, 1 = on the current path, 2 = fully done. An edge into a state-1 vertex is a back edge, so there's a cycle. (Kahn's algorithm is an alternative: a cycle exists iff the topological sort can't include every vertex.)",
    time: 'O(V + E)',
    space: 'O(V)',
    code: `import java.util.*;

public class DirectedCycle {
    public static boolean isCyclic(int V, List<List<Integer>> adj) {
        int[] state = new int[V];
        for (int s = 0; s < V; s++)
            if (state[s] == 0 && dfs(s, adj, state)) return true;
        return false;
    }
    private static boolean dfs(int u, List<List<Integer>> adj, int[] state) {
        state[u] = 1;                                           // on current path
        for (int v : adj.get(u)) {
            if (state[v] == 1) return true;                     // back edge
            if (state[v] == 0 && dfs(v, adj, state)) return true;
        }
        state[u] = 2;                                           // finished
        return false;
    }
    static List<List<Integer>> adj(int[]... lists) {
        List<List<Integer>> g = new ArrayList<>();
        for (int[] l : lists) { List<Integer> row = new ArrayList<>(); for (int x : l) row.add(x); g.add(row); }
        return g;
    }

    public static void main(String[] args) {
        System.out.println(isCyclic(6, adj(new int[]{1}, new int[]{2, 5}, new int[]{3}, new int[]{4}, new int[]{1}, new int[]{}))); // true
        System.out.println(isCyclic(3, adj(new int[]{1}, new int[]{2}, new int[]{})));                 // false
        System.out.println(isCyclic(4, adj(new int[]{1, 2}, new int[]{3}, new int[]{3}, new int[]{}))); // false
    }
}`,
  },

  'topological-sort-or-kahns-algorithm': {
    difficulty: 'Medium',
    statement: 'Given a directed acyclic graph as an adjacency list, return any topological ordering: every edge u → v must have u before v.',
    intuition: "Kahn's algorithm: a vertex with in-degree 0 has no remaining prerequisites, so it can go next. Put all in-degree-0 vertices in a queue. Repeatedly remove one, append it to the order, and decrease the in-degree of its neighbours, adding any that drop to 0. In a DAG every vertex gets output. If some are missing, the graph had a cycle.",
    time: 'O(V + E)',
    space: 'O(V)',
    code: `import java.util.*;

public class TopologicalSort {
    public static List<Integer> topoSort(int V, List<List<Integer>> adj) {
        int[] indeg = new int[V];
        for (List<Integer> out : adj) for (int v : out) indeg[v]++;
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < V; i++) if (indeg[i] == 0) q.add(i);
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return order;
    }
    static List<List<Integer>> adj(int[]... lists) {
        List<List<Integer>> g = new ArrayList<>();
        for (int[] l : lists) { List<Integer> row = new ArrayList<>(); for (int x : l) row.add(x); g.add(row); }
        return g;
    }

    public static void main(String[] args) {
        System.out.println(topoSort(6, adj(new int[]{}, new int[]{}, new int[]{3}, new int[]{1}, new int[]{0, 1}, new int[]{0, 2}))); // [4, 5, 0, 2, 3, 1]
        System.out.println(topoSort(3, adj(new int[]{1}, new int[]{2}, new int[]{})));  // [0, 1, 2]
    }
}`,
  },

  'course-schedule-ii': {
    difficulty: 'Medium',
    statement: 'There are N tasks 0 … N−1, and each pair [a, b] means task b must be done before task a. Return an order that finishes every task, or an empty array if that is impossible.',
    intuition: "Draw an edge b → a for each prerequisite pair, and the problem becomes topological sort. Kahn's algorithm outputs tasks in a valid order. If the output has fewer than N tasks, some tasks are stuck in a cycle of dependencies, so return an empty array.",
    time: 'O(N + P) for P prerequisites',
    space: 'O(N + P)',
    code: `import java.util.*;

public class CourseScheduleII {
    public static int[] findOrder(int n, int[][] prereq) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereq) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        int[] order = new int[n];
        int k = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[k++] = u;
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return k == n ? order : new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(findOrder(4, new int[][]{{1, 0}, {2, 1}, {3, 2}})));          // [0, 1, 2, 3]
        System.out.println(Arrays.toString(findOrder(4, new int[][]{{1, 0}, {2, 0}, {3, 1}, {3, 2}})));  // [0, 1, 2, 3]
        System.out.println(Arrays.toString(findOrder(2, new int[][]{{0, 1}, {1, 0}})));                  // []
    }
}`,
  },

  'alient-dictionary': {
    difficulty: 'Hard',
    statement: 'Given N words sorted in an alien language that uses the first K letters of the alphabet, return an order of those K letters consistent with the sorting.',
    intuition: "Only neighbouring words tell you anything. For words[i] and words[i+1], the first position where they differ gives one rule: that letter of the first word comes before that letter of the second. Everything after that position says nothing. Turn each rule into an edge between letters, then topologically sort the K letters with Kahn's algorithm. (If the second word is a proper prefix of the first, the input is invalid.)",
    time: 'O(total characters + K)',
    space: 'O(K²) worst-case edges',
    code: `import java.util.*;

public class AlienDictionary {
    public static String findOrder(String[] dict, int K) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < K; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[K];
        for (int i = 0; i + 1 < dict.length; i++) {
            String a = dict[i], b = dict[i + 1];
            int len = Math.min(a.length(), b.length());
            for (int j = 0; j < len; j++) {
                if (a.charAt(j) != b.charAt(j)) {
                    adj.get(a.charAt(j) - 'a').add(b.charAt(j) - 'a');
                    indeg[b.charAt(j) - 'a']++;
                    break;                                     // only the first difference matters
                }
            }
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int c = 0; c < K; c++) if (indeg[c] == 0) q.add(c);
        StringBuilder order = new StringBuilder();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.append((char) ('a' + u));
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return order.toString();
    }

    public static void main(String[] args) {
        System.out.println(findOrder(new String[]{"baa", "abcd", "abca", "cab", "cad"}, 4)); // bdac
        System.out.println(findOrder(new String[]{"caa", "aaa", "aab"}, 3));                 // cab
    }
}`,
  },

  "kosaraju's-algorithm": {
    difficulty: 'Hard',
    statement: 'Given a directed graph with V vertices as an adjacency list, return the number of strongly connected components (maximal groups where every vertex can reach every other).',
    intuition: "Kosaraju's algorithm uses two DFS passes. (1) DFS the graph and push each vertex onto a stack when it finishes. The vertex that finishes last lies in a 'source' component. (2) Reverse every edge and pop vertices from the stack. Each unvisited vertex starts a DFS in the reversed graph, and that DFS covers exactly its own SCC: reversing the edges stops it from leaking into components that come later. Count these second-pass DFS calls.",
    time: 'O(V + E)',
    space: 'O(V + E) — reversed graph',
    code: `import java.util.*;

public class Kosaraju {
    public static int kosaraju(int V, List<List<Integer>> adj) {
        boolean[] seen = new boolean[V];
        Deque<Integer> finish = new ArrayDeque<>();
        for (int i = 0; i < V; i++) if (!seen[i]) dfs(i, adj, seen, finish);

        List<List<Integer>> rev = new ArrayList<>();
        for (int i = 0; i < V; i++) rev.add(new ArrayList<>());
        for (int u = 0; u < V; u++) for (int v : adj.get(u)) rev.get(v).add(u);

        Arrays.fill(seen, false);
        int scc = 0;
        while (!finish.isEmpty()) {
            int u = finish.pop();
            if (!seen[u]) { scc++; dfs(u, rev, seen, null); }
        }
        return scc;
    }
    private static void dfs(int u, List<List<Integer>> g, boolean[] seen, Deque<Integer> finish) {
        seen[u] = true;
        for (int v : g.get(u)) if (!seen[v]) dfs(v, g, seen, finish);
        if (finish != null) finish.push(u);
    }
    static List<List<Integer>> adj(int[]... lists) {
        List<List<Integer>> g = new ArrayList<>();
        for (int[] l : lists) { List<Integer> row = new ArrayList<>(); for (int x : l) row.add(x); g.add(row); }
        return g;
    }

    public static void main(String[] args) {
        System.out.println(kosaraju(5, adj(new int[]{2, 3}, new int[]{0}, new int[]{1}, new int[]{4}, new int[]{}))); // 3
        System.out.println(kosaraju(3, adj(new int[]{1}, new int[]{2}, new int[]{0})));                                // 1
        System.out.println(kosaraju(3, adj(new int[]{1}, new int[]{2}, new int[]{})));                                 // 3
    }
}`,
  },

  'bridges-in-graph': {
    difficulty: 'Hard',
    statement: 'Given a connected undirected graph with V vertices and an edge list, return all bridges: edges whose removal disconnects the graph.',
    intuition: "Tarjan's method. During DFS, give each vertex a discovery time tin[u]. Also compute low[u]: the earliest discovery time reachable from u's subtree using at most one back edge, not counting the edge to the parent. A tree edge u → v is a bridge exactly when low[v] > tin[u], because then nothing in v's subtree can get back to u or above without that edge.",
    time: 'O(V + E)',
    space: 'O(V + E)',
    code: `import java.util.*;

public class BridgesInGraph {
    private static int timer;

    public static List<List<Integer>> criticalConnections(int V, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] tin = new int[V], low = new int[V];
        Arrays.fill(tin, -1);
        timer = 0;
        List<List<Integer>> bridges = new ArrayList<>();
        for (int i = 0; i < V; i++) if (tin[i] == -1) dfs(i, -1, adj, tin, low, bridges);
        bridges.sort((a, b) -> a.get(0) != b.get(0) ? a.get(0) - b.get(0) : a.get(1) - b.get(1));
        return bridges;
    }
    private static void dfs(int u, int parent, List<List<Integer>> adj, int[] tin, int[] low, List<List<Integer>> out) {
        tin[u] = low[u] = timer++;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (tin[v] == -1) {
                dfs(v, u, adj, tin, low, out);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > tin[u]) out.add(Arrays.asList(Math.min(u, v), Math.max(u, v)));
            } else {
                low[u] = Math.min(low[u], tin[v]);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(criticalConnections(4, new int[][]{{0, 1}, {1, 2}, {2, 0}, {1, 3}}));                 // [[1, 3]]
        System.out.println(criticalConnections(5, new int[][]{{0, 1}, {1, 2}, {2, 0}, {1, 3}, {3, 4}}));         // [[1, 3], [3, 4]]
        System.out.println(criticalConnections(2, new int[][]{{0, 1}}));                                         // [[0, 1]]
    }
}`,
  },

  'articulation-point-in-graph': {
    difficulty: 'Hard',
    statement: 'Given an undirected graph (possibly disconnected) as an adjacency list, return in ascending order every vertex whose removal increases the number of connected components, or [−1] if there are none.',
    intuition: "Same tin/low bookkeeping as bridges, but the test is about vertices. A non-root vertex u is an articulation point if some DFS child v has low[v] ≥ tin[u]: v's subtree can't reach above u without going through u. The DFS root is a special case, and it is an articulation point only if it has more than one DFS child. For a back edge, update low with tin[v], not low[v].",
    time: 'O(V + E)',
    space: 'O(V)',
    code: `import java.util.*;

public class ArticulationPoints {
    private static int timer;

    public static List<Integer> articulationPoints(int V, List<List<Integer>> adj) {
        int[] tin = new int[V], low = new int[V];
        boolean[] isAP = new boolean[V];
        Arrays.fill(tin, -1);
        timer = 0;
        for (int i = 0; i < V; i++) if (tin[i] == -1) dfs(i, -1, adj, tin, low, isAP);
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < V; i++) if (isAP[i]) res.add(i);
        if (res.isEmpty()) res.add(-1);
        return res;
    }
    private static void dfs(int u, int parent, List<List<Integer>> adj, int[] tin, int[] low, boolean[] isAP) {
        tin[u] = low[u] = timer++;
        int children = 0;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (tin[v] == -1) {
                dfs(v, u, adj, tin, low, isAP);
                low[u] = Math.min(low[u], low[v]);
                if (parent != -1 && low[v] >= tin[u]) isAP[u] = true;
                children++;
            } else {
                low[u] = Math.min(low[u], tin[v]);
            }
        }
        if (parent == -1 && children > 1) isAP[u] = true;
    }
    static List<List<Integer>> adj(int[]... lists) {
        List<List<Integer>> g = new ArrayList<>();
        for (int[] l : lists) { List<Integer> row = new ArrayList<>(); for (int x : l) row.add(x); g.add(row); }
        return g;
    }

    public static void main(String[] args) {
        List<List<Integer>> g = adj(new int[]{1, 2, 3}, new int[]{0}, new int[]{0, 3, 4, 5}, new int[]{2, 0},
                                    new int[]{2, 6}, new int[]{2, 6}, new int[]{4, 5});
        System.out.println(articulationPoints(7, g));                                                  // [0, 2]
        System.out.println(articulationPoints(3, adj(new int[]{1, 2}, new int[]{0, 2}, new int[]{0, 1}))); // [-1]
    }
}`,
  },

  // ── Graphs › Shortest Path ──────────────────────────────────────────────────

  'shortest-path-in-undirected-graph-with-unit-weights': {
    difficulty: 'Medium',
    statement: 'Given an undirected graph with N vertices and unit-weight edges, return the shortest distance from vertex 0 to every vertex, using −1 for unreachable vertices.',
    intuition: "When every edge costs 1, BFS already finds shortest paths. It explores vertices in rings of increasing distance, so the first time a vertex is reached, the path is as short as possible. Set dist[0] = 0 and give each newly reached vertex dist[u] + 1. Vertices that are never reached stay at −1.",
    time: 'O(N + M)',
    space: 'O(N + M)',
    code: `import java.util.*;

public class ShortestPathUnitWeights {
    public static int[] shortestPath(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[0] = 0;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(0);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u))
                if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
        }
        return dist;
    }

    public static void main(String[] args) {
        int[][] e = {{0, 1}, {0, 3}, {3, 4}, {4, 5}, {5, 6}, {1, 2}, {2, 6}, {6, 7}, {7, 8}, {6, 8}};
        System.out.println(Arrays.toString(shortestPath(9, e)));                          // [0, 1, 2, 1, 2, 3, 3, 4, 4]
        System.out.println(Arrays.toString(shortestPath(4, new int[][]{{0, 1}, {2, 3}}))); // [0, 1, -1, -1]
    }
}`,
  },

  'shortest-path-in-dag': {
    difficulty: 'Medium',
    statement: 'Given a weighted directed acyclic graph with N vertices, return the shortest distance from vertex 0 to every vertex, using −1 for unreachable vertices.',
    intuition: "In a DAG you can relax edges in topological order. By the time u is processed, every path into u has already been considered, so dist[u] is final. Relax each of u's outgoing edges once. This works even with negative weights, needs no priority queue, and runs in linear time.",
    time: 'O(N + M)',
    space: 'O(N + M)',
    code: `import java.util.*;

public class ShortestPathDAG {
    public static int[] shortestPath(int n, int[][] edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] e : edges) { adj.get(e[0]).add(new int[]{e[1], e[2]}); indeg[e[1]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        long INF = Long.MAX_VALUE;
        long[] dist = new long[n];
        Arrays.fill(dist, INF);
        dist[0] = 0;
        while (!q.isEmpty()) {                                  // Kahn order = topological order
            int u = q.poll();
            for (int[] e : adj.get(u)) {
                if (dist[u] != INF) dist[e[0]] = Math.min(dist[e[0]], dist[u] + e[1]);
                if (--indeg[e[0]] == 0) q.add(e[0]);
            }
        }
        int[] res = new int[n];
        for (int i = 0; i < n; i++) res[i] = dist[i] == INF ? -1 : (int) dist[i];
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(shortestPath(4, new int[][]{{0, 1, 2}, {0, 2, 1}})));   // [0, 2, 1, -1]
        int[][] e = {{0, 1, 2}, {0, 4, 1}, {4, 5, 4}, {4, 2, 2}, {1, 2, 3}, {2, 3, 6}, {5, 3, 1}};
        System.out.println(Arrays.toString(shortestPath(6, e)));                                   // [0, 2, 3, 6, 1, 5]
    }
}`,
  },

  "dijkstra's-algorithm": {
    difficulty: 'Medium',
    statement: 'Given a weighted undirected graph with non-negative edge weights and a source S, return the shortest distance from S to every vertex.',
    intuition: "Greedy by distance: take the unfinished vertex with the smallest known distance from a min-heap. Its distance is final, because any other route would have to go through a vertex that is already at least as far away, and weights are non-negative. Relax its edges and push improved distances. Stale heap entries, where the popped distance is larger than dist[u], are skipped.",
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    code: `import java.util.*;

public class Dijkstra {
    public static int[] dijkstra(int V, int[][] edges, int S) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(new int[]{e[1], e[2]}); adj.get(e[1]).add(new int[]{e[0], e[2]}); }
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[S] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[]{0, S});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;                          // stale entry
            for (int[] e : adj.get(u)) {
                if (d + e[1] < dist[e[0]]) {
                    dist[e[0]] = d + e[1];
                    pq.add(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(dijkstra(2, new int[][]{{0, 1, 9}}, 0)));                         // [0, 9]
        System.out.println(Arrays.toString(dijkstra(3, new int[][]{{0, 1, 1}, {1, 2, 3}, {0, 2, 6}}, 2)));   // [4, 3, 0]
    }
}`,
  },

  'path-with-minimum-effort': {
    difficulty: 'Medium',
    statement: "A hiker moves up/down/left/right on a height grid from the top-left to the bottom-right cell. A route's effort is the largest absolute height difference between two consecutive cells on it. Return the minimum possible effort.",
    intuition: "This is Dijkstra with a different path cost: a path's cost is the maximum step along it, not the sum. The cost of reaching (r, c) through a neighbour is max(effort so far, |height difference|). This cost never decreases along a path, which is exactly what makes Dijkstra's greedy choice valid. The first time the target is popped from the heap, its effort is optimal.",
    time: 'O(R · C · log(R · C))',
    space: 'O(R · C)',
    code: `import java.util.*;

public class MinimumEffortPath {
    public static int minimumEffortPath(int[][] h) {
        int R = h.length, C = h[0].length;
        int[][] best = new int[R][C];
        for (int[] row : best) Arrays.fill(row, Integer.MAX_VALUE);
        best[0][0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));  // {effort, r, c}
        pq.add(new int[]{0, 0, 0});
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int e = cur[0], r = cur[1], c = cur[2];
            if (r == R - 1 && c == C - 1) return e;
            if (e > best[r][c]) continue;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
                int ne = Math.max(e, Math.abs(h[nr][nc] - h[r][c]));
                if (ne < best[nr][nc]) { best[nr][nc] = ne; pq.add(new int[]{ne, nr, nc}); }
            }
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(minimumEffortPath(new int[][]{{1, 2, 2}, {3, 8, 2}, {5, 3, 5}})); // 2
        System.out.println(minimumEffortPath(new int[][]{{1, 2, 3}, {3, 8, 4}, {5, 3, 5}})); // 1
        System.out.println(minimumEffortPath(new int[][]{{1, 2, 1, 1, 1}, {1, 2, 1, 2, 1}, {1, 2, 1, 2, 1}, {1, 2, 1, 2, 1}, {1, 1, 1, 2, 1}})); // 0
    }
}`,
  },

  'cheapest-flight-within-k-stops': {
    difficulty: 'Medium',
    statement: 'Given n cities and flights [from, to, price], return the cheapest price from src to dst using at most k stops (k + 1 flights), or −1 if there is no such route.',
    intuition: "Plain Dijkstra breaks here, because a cheaper route that uses more stops can block a slightly pricier route with fewer stops. Instead, do Bellman–Ford limited to k + 1 rounds. Round i finds the cheapest price using at most i flights. Relax every edge each round using a copy of the previous round's prices, so one round never chains two flights together.",
    time: 'O(k · F) for F flights',
    space: 'O(n)',
    code: `import java.util.*;

public class CheapestFlightsKStops {
    public static int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int INF = Integer.MAX_VALUE;
        int[] cost = new int[n];
        Arrays.fill(cost, INF);
        cost[src] = 0;
        for (int round = 0; round <= k; round++) {
            int[] next = cost.clone();                          // only extend last round's paths
            for (int[] f : flights)
                if (cost[f[0]] != INF && cost[f[0]] + f[2] < next[f[1]])
                    next[f[1]] = cost[f[0]] + f[2];
            cost = next;
        }
        return cost[dst] == INF ? -1 : cost[dst];
    }

    public static void main(String[] args) {
        int[][] f = {{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}};
        System.out.println(findCheapestPrice(4, f, 0, 3, 1));                                        // 700
        System.out.println(findCheapestPrice(3, new int[][]{{0, 1, 100}, {1, 2, 100}, {0, 2, 500}}, 0, 2, 1)); // 200
        System.out.println(findCheapestPrice(3, new int[][]{{0, 1, 100}, {1, 2, 100}, {0, 2, 500}}, 0, 2, 0)); // 500
    }
}`,
  },

  'bellman-ford-algorithm': {
    difficulty: 'Medium',
    statement: 'Given a weighted directed graph (weights may be negative) and a source S, return the shortest distance to every vertex, using 10⁹ for unreachable vertices. If a negative cycle exists, return [−1].',
    intuition: "A shortest path without repeated vertices has at most V − 1 edges. So relax every edge V − 1 times. After round i, every shortest path that uses ≤ i edges is correct. Then do one more round. If any distance still improves, a negative cycle exists, because the distances could keep decreasing forever.",
    time: 'O(V · E)',
    space: 'O(V)',
    code: `import java.util.*;

public class BellmanFord {
    public static int[] bellmanFord(int V, int[][] edges, int S) {
        final int INF = 1_000_000_000;
        int[] dist = new int[V];
        Arrays.fill(dist, INF);
        dist[S] = 0;
        for (int i = 0; i < V - 1; i++)
            for (int[] e : edges)
                if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) dist[e[1]] = dist[e[0]] + e[2];
        for (int[] e : edges)
            if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) return new int[]{-1};
        return dist;
    }

    public static void main(String[] args) {
        int[][] e = {{3, 2, 6}, {5, 3, 1}, {0, 1, 5}, {1, 5, -3}, {1, 2, -2}, {3, 4, -2}, {2, 4, 3}};
        System.out.println(Arrays.toString(bellmanFord(6, e, 0)));                                   // [0, 5, 3, 3, 1, 2]
        System.out.println(Arrays.toString(bellmanFord(3, new int[][]{{0, 1, 5}}, 0)));              // [0, 5, 1000000000]
        System.out.println(Arrays.toString(bellmanFord(2, new int[][]{{0, 1, -1}, {1, 0, -1}}, 0))); // [-1]
    }
}`,
  },

  'floyd-warshall-algorithm': {
    difficulty: 'Medium',
    statement: 'Given an n × n adjacency matrix of a weighted directed graph (−1 means no edge), compute the shortest distance between every pair of vertices in place, leaving −1 where no path exists.',
    intuition: "Dynamic programming over allowed middle vertices. After step k, d[i][j] is the shortest i → j path whose intermediate vertices all come from {0 … k}. Allowing vertex k as well gives d[i][j] = min(d[i][j], d[i][k] + d[k][j]). Run the three loops with k on the outside. (A negative d[i][i] afterwards would mean a negative cycle.)",
    time: 'O(n³)',
    space: 'O(1) extra — in place',
    code: `import java.util.*;

public class FloydWarshall {
    public static void shortestDistance(int[][] d) {
        int n = d.length;
        final int INF = Integer.MAX_VALUE / 2;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][j] == -1) d[i][j] = INF;
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][j] >= INF) d[i][j] = -1;
    }

    public static void main(String[] args) {
        int[][] m = {{0, 2, -1, -1}, {1, 0, 3, -1}, {-1, -1, 0, 1}, {3, 5, 4, 0}};
        shortestDistance(m);
        System.out.println(Arrays.deepToString(m)); // [[0, 2, 5, 6], [1, 0, 3, 4], [4, 6, 0, 1], [3, 5, 4, 0]]
        int[][] m2 = {{0, 25}, {-1, 0}};
        shortestDistance(m2);
        System.out.println(Arrays.deepToString(m2)); // [[0, 25], [-1, 0]]
    }
}`,
  },

  'word-ladder-i': {
    difficulty: 'Hard',
    statement: 'Given startWord, targetWord and a list of words of equal length, return the number of words in the shortest transformation sequence from startWord to targetWord, changing one letter at a time with every intermediate word in the list. Return 0 if no sequence exists.',
    intuition: "Each word is a vertex, and two words are joined when they differ in exactly one letter. BFS from startWord finds the shortest sequence. Don't compare every pair of words. Instead, try all 26 replacements at each position and check the dictionary set. Removing a word from the set when it is enqueued marks it visited.",
    time: 'O(N · L · 26) for N words of length L',
    space: 'O(N · L)',
    code: `import java.util.*;

public class WordLadder {
    public static int ladderLength(String start, String target, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(target)) return 0;
        Deque<String> q = new ArrayDeque<>();
        q.add(start);
        dict.remove(start);
        for (int steps = 1; !q.isEmpty(); steps++) {
            for (int size = q.size(); size > 0; size--) {
                String w = q.poll();
                if (w.equals(target)) return steps;
                char[] cs = w.toCharArray();
                for (int i = 0; i < cs.length; i++) {
                    char orig = cs[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        cs[i] = c;
                        String next = new String(cs);
                        if (dict.remove(next)) q.add(next);
                    }
                    cs[i] = orig;
                }
            }
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(ladderLength("der", "dfs", Arrays.asList("des", "der", "dfr", "dgt", "dfs")));        // 3
        System.out.println(ladderLength("hit", "cog", Arrays.asList("hot", "dot", "dog", "lot", "log", "cog"))); // 5
        System.out.println(ladderLength("hit", "cog", Arrays.asList("hot", "dot", "dog", "lot", "log")));        // 0
    }
}`,
  },

  'word-ladder-ii': {
    difficulty: 'Hard',
    statement: 'Same setup as Word Ladder I, but return every shortest transformation sequence from startWord to targetWord (in any order).',
    intuition: "Run BFS level by level from startWord. Delete a level's words from the dictionary only after the whole level is done, so several parents at the same depth can all lead to one word. Record parents[word] for every such parent. Stop after the level where targetWord appears. Then backtrack from targetWord through the parent lists to rebuild every shortest path. This stores only the edges that lie on shortest paths.",
    time: 'O(N · L · 26 + number of shortest paths × path length)',
    space: 'O(N · L)',
    code: `import java.util.*;

public class WordLadderII {
    public static List<List<String>> findSequences(String start, String target, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        List<List<String>> res = new ArrayList<>();
        if (!dict.contains(target)) return res;
        dict.remove(start);
        Map<String, List<String>> parents = new HashMap<>();
        Set<String> level = new HashSet<>(Collections.singleton(start));
        boolean found = false;
        while (!level.isEmpty() && !found) {
            Set<String> next = new HashSet<>();
            for (String w : level) {
                char[] cs = w.toCharArray();
                for (int i = 0; i < cs.length; i++) {
                    char orig = cs[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        cs[i] = c;
                        String nw = new String(cs);
                        if (!dict.contains(nw)) continue;
                        next.add(nw);
                        parents.computeIfAbsent(nw, k -> new ArrayList<>()).add(w);
                        if (nw.equals(target)) found = true;
                    }
                    cs[i] = orig;
                }
            }
            dict.removeAll(next);                               // remove only after the whole level
            level = next;
        }
        if (found) backtrack(target, start, parents, new LinkedList<>(Collections.singletonList(target)), res);
        res.sort(Comparator.comparing(Object::toString));
        return res;
    }
    private static void backtrack(String w, String start, Map<String, List<String>> parents,
                                  LinkedList<String> path, List<List<String>> res) {
        if (w.equals(start)) { res.add(new ArrayList<>(path)); return; }
        for (String p : parents.getOrDefault(w, Collections.emptyList())) {
            path.addFirst(p);
            backtrack(p, start, parents, path, res);
            path.removeFirst();
        }
    }

    public static void main(String[] args) {
        System.out.println(findSequences("der", "dfs", Arrays.asList("des", "der", "dfr", "dgt", "dfs")));        // [[der, des, dfs], [der, dfr, dfs]]
        System.out.println(findSequences("hit", "cog", Arrays.asList("hot", "dot", "dog", "lot", "log", "cog"))); // [[hit, hot, dot, dog, cog], [hit, hot, lot, log, cog]]
        System.out.println(findSequences("hit", "cog", Arrays.asList("hot", "dot")));                             // []
    }
}`,
  },

  // ── Graphs › DSU / MST ──────────────────────────────────────────────────────

  'disjoint-set-': {
    difficulty: 'Medium',
    statement: 'Design a disjoint-set (union–find) structure over n elements with unionByRank(u, v), unionBySize(u, v) and find(u, v), which returns whether u and v are in the same set.',
    intuition: "Each set is a tree, identified by its root. findRoot follows parent pointers up to the root, and path compression points every node on the way directly at the root. Union attaches the root of the smaller tree under the root of the larger one, where 'smaller' means lower rank (an upper bound on height) or fewer elements. Together these make each operation run in effectively constant amortised time, O(α(n)).",
    time: 'O(α(n)) amortised per operation — practically constant',
    space: 'O(n)',
    code: `public class DisjointSet {
    private final int[] parent, rank, size;

    public DisjointSet(int n) {
        parent = new int[n]; rank = new int[n]; size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }
    public int findRoot(int x) {
        if (parent[x] != x) parent[x] = findRoot(parent[x]);   // path compression
        return parent[x];
    }
    public boolean find(int u, int v) { return findRoot(u) == findRoot(v); }

    public void unionByRank(int u, int v) {
        int a = findRoot(u), b = findRoot(v);
        if (a == b) return;
        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        size[a] += size[b];
        if (rank[a] == rank[b]) rank[a]++;
    }
    public void unionBySize(int u, int v) {
        int a = findRoot(u), b = findRoot(v);
        if (a == b) return;
        if (size[a] < size[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        size[a] += size[b];
    }

    public static void main(String[] args) {
        DisjointSet ds = new DisjointSet(5);
        ds.unionByRank(0, 1);
        ds.unionBySize(2, 3);
        System.out.println(ds.find(0, 1)); // true
        System.out.println(ds.find(0, 3)); // false
        ds.unionBySize(1, 3);
        System.out.println(ds.find(0, 2)); // true
    }
}`,
  },

  'find-the-mst-weight': {
    difficulty: 'Medium',
    statement: 'Given a connected, weighted, undirected graph as an adjacency list of [neighbour, weight] pairs, return the total weight of its minimum spanning tree.',
    intuition: "Prim's algorithm grows the tree from vertex 0. At every step, take the cheapest edge that leaves the current tree (the cut property says it's safe to add). A min-heap of (weight, vertex) entries does this. Skip vertices that are already in the tree, add the weight, and push the new vertex's edges. Kruskal's algorithm (sort the edges and union them with a DSU) works just as well.",
    time: 'O(E log E)',
    space: 'O(V + E)',
    code: `import java.util.*;

public class MinimumSpanningTree {
    // adj.get(u) = list of {v, w}
    public static int spanningTree(int V, List<List<int[]>> adj) {
        boolean[] inTree = new boolean[V];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));  // {w, v}
        pq.add(new int[]{0, 0});
        int total = 0;
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int w = cur[0], u = cur[1];
            if (inTree[u]) continue;
            inTree[u] = true;
            total += w;
            for (int[] e : adj.get(u)) if (!inTree[e[0]]) pq.add(new int[]{e[1], e[0]});
        }
        return total;
    }
    static List<List<int[]>> graph(int V, int[][] edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(new int[]{e[1], e[2]}); adj.get(e[1]).add(new int[]{e[0], e[2]}); }
        return adj;
    }

    public static void main(String[] args) {
        System.out.println(spanningTree(4, graph(4, new int[][]{{0, 1, 1}, {1, 2, 2}, {2, 3, 3}, {0, 3, 4}}))); // 6
        System.out.println(spanningTree(3, graph(3, new int[][]{{0, 1, 5}, {1, 2, 3}, {0, 2, 1}})));            // 4
    }
}`,
  },

  'number-of-operations-to-make-network-connected': {
    difficulty: 'Medium',
    statement: 'n computers are linked by an edge list of cables. In one operation you can unplug any cable and use it to join two computers. Return the minimum number of operations needed to connect every computer, or −1 if it is impossible.',
    intuition: "Joining c components takes c − 1 cables, and the cables you can move are the redundant ones, meaning edges inside a component that already connect two computers in the same set. Union all the edges with a DSU, counting an edge as spare whenever both ends already share a root. The answer is c − 1 if spare ≥ c − 1, otherwise −1. (Equivalently: −1 if m < n − 1.)",
    time: 'O(n + m · α(n))',
    space: 'O(n)',
    code: `public class MakeNetworkConnected {
    public static int solve(int n, int[][] edges) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n, spare = 0;
        for (int[] e : edges) {
            int a = find(parent, e[0]), b = find(parent, e[1]);
            if (a == b) spare++;
            else { parent[a] = b; components--; }
        }
        return spare >= components - 1 ? components - 1 : -1;
    }
    private static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }         // path halving
        return x;
    }

    public static void main(String[] args) {
        System.out.println(solve(4, new int[][]{{0, 1}, {0, 2}, {1, 2}}));                  // 1
        System.out.println(solve(6, new int[][]{{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}}));  // 2
        System.out.println(solve(6, new int[][]{{0, 1}, {0, 2}, {0, 3}, {1, 2}}));          // -1
    }
}`,
  },

  'number-of-islands-ii': {
    difficulty: 'Hard',
    statement: 'An n × m grid starts as all water. Each operation turns one cell into land. After every operation, report the current number of islands (4-directionally connected land).',
    intuition: "Rerunning a flood fill after every operation costs O(n·m) each time. Use a DSU over cell ids (r·m + c) instead. Adding a new land cell adds 1 island. Then union it with each neighbouring land cell, and every union that joins two different sets removes one island. If the cell is already land, the count doesn't change.",
    time: 'O(n·m + k · α(n·m))',
    space: 'O(n · m)',
    code: `import java.util.*;

public class NumberOfIslandsII {
    public static List<Integer> numOfIslands(int n, int m, int[][] ops) {
        int[] parent = new int[n * m];
        boolean[] land = new boolean[n * m];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        List<Integer> res = new ArrayList<>();
        int islands = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] op : ops) {
            int id = op[0] * m + op[1];
            if (!land[id]) {
                land[id] = true;
                islands++;
                for (int[] d : dirs) {
                    int r = op[0] + d[0], c = op[1] + d[1];
                    if (r < 0 || c < 0 || r >= n || c >= m || !land[r * m + c]) continue;
                    int a = find(parent, id), b = find(parent, r * m + c);
                    if (a != b) { parent[a] = b; islands--; }
                }
            }
            res.add(islands);
        }
        return res;
    }
    private static int find(int[] p, int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    }

    public static void main(String[] args) {
        System.out.println(numOfIslands(4, 5, new int[][]{{1, 1}, {0, 1}, {3, 3}, {3, 4}}));          // [1, 1, 2, 2]
        System.out.println(numOfIslands(3, 3, new int[][]{{0, 0}, {0, 2}, {0, 1}, {0, 1}, {2, 2}}));  // [1, 2, 1, 1, 2]
    }
}`,
  },

  'making-a-large-island': {
    difficulty: 'Hard',
    statement: 'In an n × n binary grid you may change at most one 0 to 1. Return the size of the largest island (4-directionally connected 1s) you can end up with.',
    intuition: "First label every island with an id and record its size, using DFS or a DSU. Then, for each 0 cell, add 1 to the sizes of the distinct islands next to it. Use a set so an island touching two sides isn't counted twice. The best such total is a candidate, and so is the largest existing island, which covers a grid that is all 1s.",
    time: 'O(n²)',
    space: 'O(n²)',
    code: `import java.util.*;

public class MakingLargeIsland {
    public static int largestIsland(int[][] g) {
        int n = g.length;
        Map<Integer, Integer> size = new HashMap<>();
        int id = 2, best = 0;                                    // ids start at 2 (0/1 are taken)
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                if (g[r][c] == 1) {
                    int s = paint(g, r, c, id);
                    size.put(id++, s);
                    best = Math.max(best, s);
                }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) {
                if (g[r][c] != 0) continue;
                Set<Integer> touching = new HashSet<>();
                for (int[] d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nc >= 0 && nr < n && nc < n && g[nr][nc] > 1) touching.add(g[nr][nc]);
                }
                int total = 1;
                for (int t : touching) total += size.get(t);
                best = Math.max(best, total);
            }
        return best;
    }
    private static int paint(int[][] g, int r, int c, int id) {
        if (r < 0 || c < 0 || r >= g.length || c >= g.length || g[r][c] != 1) return 0;
        g[r][c] = id;
        return 1 + paint(g, r + 1, c, id) + paint(g, r - 1, c, id) + paint(g, r, c + 1, id) + paint(g, r, c - 1, id);
    }

    public static void main(String[] args) {
        System.out.println(largestIsland(new int[][]{{1, 0}, {0, 1}})); // 3
        System.out.println(largestIsland(new int[][]{{1, 1}, {1, 0}})); // 4
        System.out.println(largestIsland(new int[][]{{1, 1}, {1, 1}})); // 4
    }
}`,
  },
};
