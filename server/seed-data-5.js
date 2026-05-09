export const batch5 = [
  // ─── Graph (10) ─────────────────────────────────────────────────────────────
  {
    topic: 'Graph',
    title: 'Breadth First Search (BFS)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/',
    statement: 'Given an undirected graph with V vertices and adjacency list, perform a BFS from vertex 0 and return the traversal order. Constraints: 1 <= V <= 10^4; 0 <= E <= 10^4. Graph may be disconnected.',
    intuition: 'Use a queue and a visited array. Start by enqueuing vertex 0 and marking it visited. At each step, dequeue a vertex, record it, then enqueue all unvisited neighbors (marking them visited before enqueuing to avoid duplicates in the queue). This ensures level-by-level exploration.',
    time_complexity: 'O(V + E) — each vertex and edge processed once.',
    space_complexity: 'O(V) — visited array and queue.',
    code: `import java.util.*;

public class BFSGraph {
    static List<Integer> bfs(int v, List<List<Integer>> adj) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[v];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        visited[0] = true;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            for (int neighbor : adj.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int v = 6;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        // Edges: 0-1, 0-2, 1-3, 1-4, 2-5
        int[][] edges = {{0,1},{0,2},{1,3},{1,4},{2,5}};
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        System.out.println(bfs(v, adj)); // [0, 1, 2, 3, 4, 5]

        // Ensure sorted neighbors for determinism
        for (List<Integer> l : adj) Collections.sort(l);
        System.out.println(bfs(v, adj)); // [0, 1, 2, 3, 4, 5]
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Depth First Search (DFS)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/',
    statement: 'Given an undirected graph with V vertices and adjacency list, perform a DFS from vertex 0 and return the traversal order. Constraints: 1 <= V <= 10^4; 0 <= E <= 10^4.',
    intuition: 'Use recursion (or an explicit stack). Mark vertex visited before recursing into it. For each unvisited neighbor, recurse. This explores as deep as possible along each branch before backtracking.',
    time_complexity: 'O(V + E) — each vertex and edge processed once.',
    space_complexity: 'O(V) — visited array and recursion stack.',
    code: `import java.util.*;

public class DFSGraph {
    static void dfsHelper(int node, List<List<Integer>> adj, boolean[] visited, List<Integer> result) {
        visited[node] = true;
        result.add(node);
        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor]) dfsHelper(neighbor, adj, visited, result);
        }
    }

    static List<Integer> dfs(int v, List<List<Integer>> adj) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[v];
        dfsHelper(0, adj, visited, result);
        return result;
    }

    public static void main(String[] args) {
        int v = 6;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        int[][] edges = {{0,1},{0,2},{1,3},{1,4},{2,5}};
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        for (List<Integer> l : adj) Collections.sort(l);
        System.out.println(dfs(v, adj)); // [0, 1, 3, 4, 2, 5]
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Detect Cycle in a Directed Graph',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/',
    statement: 'Given a directed graph with V vertices and E edges, detect whether it contains a cycle. Return true if a cycle exists. Constraints: 1 <= V <= 10^4; 0 <= E <= 10^4.',
    intuition: 'DFS with a recursion stack. Maintain two boolean arrays: visited[] and inStack[]. When a node is entered, mark both. On exit, unmark inStack. If we ever encounter a neighbor that\'s already inStack, a cycle exists (we\'ve looped back to an ancestor in the current DFS path).',
    time_complexity: 'O(V + E) — each vertex and edge processed once.',
    space_complexity: 'O(V) — visited and recursion arrays.',
    code: `import java.util.*;

public class DirectedCycleDetection {
    static boolean dfs(int node, List<List<Integer>> adj, boolean[] visited, boolean[] inStack) {
        visited[node] = true;
        inStack[node] = true;
        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor] && dfs(neighbor, adj, visited, inStack)) return true;
            if (inStack[neighbor]) return true;
        }
        inStack[node] = false;
        return false;
    }

    static boolean hasCycle(int v, List<List<Integer>> adj) {
        boolean[] visited = new boolean[v], inStack = new boolean[v];
        for (int i = 0; i < v; i++)
            if (!visited[i] && dfs(i, adj, visited, inStack)) return true;
        return false;
    }

    public static void main(String[] args) {
        int v = 4;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        adj.get(0).add(1); adj.get(1).add(2); adj.get(2).add(3); adj.get(3).add(1); // cycle: 1->2->3->1
        System.out.println(hasCycle(v, adj)); // true

        List<List<Integer>> adj2 = new ArrayList<>();
        for (int i = 0; i < v; i++) adj2.add(new ArrayList<>());
        adj2.get(0).add(1); adj2.get(0).add(2); adj2.get(1).add(2); adj2.get(2).add(3);
        System.out.println(hasCycle(v, adj2)); // false
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Topological Sort (Kahn\'s Algorithm)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/',
    statement: 'Given a Directed Acyclic Graph (DAG), return a topological ordering of its vertices. If no ordering exists (cycle detected), return an empty array. Constraints: 1 <= V <= 10^4.',
    intuition: 'Kahn\'s BFS algorithm: compute in-degree for all vertices. Enqueue vertices with in-degree 0. Process each: add it to the result, then reduce the in-degree of all its neighbors. Enqueue any neighbor whose in-degree drops to 0. If result length < V, a cycle exists.',
    time_complexity: 'O(V + E) — process every vertex and edge once.',
    space_complexity: 'O(V) — in-degree array and queue.',
    code: `import java.util.*;

public class TopologicalSort {
    static int[] topoSort(int v, List<List<Integer>> adj) {
        int[] inDegree = new int[v];
        for (int u = 0; u < v; u++)
            for (int w : adj.get(u)) inDegree[w]++;
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < v; i++) if (inDegree[i] == 0) queue.offer(i);
        int[] result = new int[v];
        int idx = 0;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result[idx++] = node;
            for (int neighbor : adj.get(node))
                if (--inDegree[neighbor] == 0) queue.offer(neighbor);
        }
        return (idx == v) ? result : new int[0]; // empty = cycle detected
    }

    public static void main(String[] args) {
        int v = 6;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        adj.get(5).add(2); adj.get(5).add(0);
        adj.get(4).add(0); adj.get(4).add(1);
        adj.get(2).add(3); adj.get(3).add(1);
        System.out.println(Arrays.toString(topoSort(v, adj))); // one valid order: [4, 5, 0, 2, 3, 1]
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Dijkstra\'s Shortest Path',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/',
    statement: 'Given a weighted directed graph with V vertices, E edges, and a source vertex, find the shortest distance from the source to all other vertices. Edge weights are non-negative. Constraints: 1 <= V <= 10^4; 0 <= weight <= 10^9.',
    intuition: 'Use a min-heap (priority queue) with (distance, vertex). Start with source at distance 0. Extract the closest unfinalized vertex, finalize its distance, then relax its outgoing edges. Skip stale entries (distance in PQ > current best). Greedy: once finalized, a vertex\'s distance is optimal.',
    time_complexity: 'O((V + E) log V) — log V per heap operation.',
    space_complexity: 'O(V + E) — distance array and heap.',
    code: `import java.util.*;

public class Dijkstra {
    static int[] dijkstra(int v, List<List<int[]>> adj, int src) {
        int[] dist = new int[v];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], u = cur[1];
            if (d > dist[u]) continue; // stale entry
            for (int[] edge : adj.get(u)) {
                int w = edge[0], newDist = dist[u] + edge[1];
                if (newDist < dist[w]) {
                    dist[w] = newDist;
                    pq.offer(new int[]{newDist, w});
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int v = 5;
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        // {neighbor, weight}
        adj.get(0).add(new int[]{1, 4}); adj.get(0).add(new int[]{2, 1});
        adj.get(2).add(new int[]{1, 2}); adj.get(1).add(new int[]{3, 1});
        adj.get(2).add(new int[]{3, 5}); adj.get(3).add(new int[]{4, 3});
        System.out.println(Arrays.toString(dijkstra(v, adj, 0))); // [0, 3, 1, 4, 7]
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Number of Islands',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-number-of-islands/',
    statement: 'Given a 2D grid of \'1\'s (land) and \'0\'s (water), count the number of islands. An island is a group of connected \'1\'s (connected horizontally or vertically). Constraints: 1 <= rows, cols <= 300.',
    intuition: 'DFS/BFS flood fill. Iterate every cell. When a \'1\' is found, increment the island count and use DFS to mark all connected land cells as \'0\' (visited). This ensures each island is counted exactly once.',
    time_complexity: 'O(rows * cols) — each cell visited at most once.',
    space_complexity: 'O(rows * cols) — recursion stack in worst case (all land).',
    code: `public class NumberOfIslands {
    static void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r+1, c); dfs(grid, r-1, c);
        dfs(grid, r, c+1); dfs(grid, r, c-1);
    }

    static int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
        return count;
    }

    public static void main(String[] args) {
        char[][] g1 = {
            {'1','1','1','1','0'},
            {'1','1','0','1','0'},
            {'1','1','0','0','0'},
            {'0','0','0','0','0'}
        };
        System.out.println(numIslands(g1)); // 1

        char[][] g2 = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(numIslands(g2)); // 3
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Bellman-Ford Shortest Path (Detect Negative Cycle)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/',
    statement: 'Given a directed weighted graph with V vertices and E edges and a source vertex, find shortest distances from the source. Return the distances array, or detect if a negative-weight cycle is reachable. Constraints: 1 <= V <= 10^4.',
    intuition: 'Relax all E edges V-1 times. Each pass guarantees the shortest paths using at most one more edge. After V-1 passes, do a Vth pass: if any distance still decreases, a negative-weight cycle is reachable from the source.',
    time_complexity: 'O(V * E) — V-1 passes, each scanning all E edges.',
    space_complexity: 'O(V) — distance array.',
    code: `import java.util.Arrays;

public class BellmanFord {
    static int[] bellmanFord(int v, int[][] edges, int src) {
        int[] dist = new int[v];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        for (int i = 1; i < v; i++) {
            for (int[] e : edges) { // {u, w, weight}
                int u = e[0], w = e[1], wt = e[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + wt < dist[w])
                    dist[w] = dist[u] + wt;
            }
        }
        // Check for negative cycles
        for (int[] e : edges) {
            int u = e[0], w = e[1], wt = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + wt < dist[w])
                return null; // negative cycle
        }
        return dist;
    }

    public static void main(String[] args) {
        int v = 5;
        int[][] edges = {{0,1,-1},{0,2,4},{1,2,3},{1,3,2},{1,4,2},{3,2,5},{3,1,1},{4,3,-3}};
        System.out.println(Arrays.toString(bellmanFord(v, edges, 0))); // [0, -1, 2, -2, 1]

        // Negative cycle test: 0->1->2->0 with weights -1,-2,3 = sum 0, not negative. Let's add a true negative cycle:
        int[][] edges2 = {{0,1,1},{1,2,-3},{2,0,1}};
        System.out.println(bellmanFord(3, edges2, 0)); // null (negative cycle)
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Strongly Connected Components (Kosaraju\'s)',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/strongly-connected-components/',
    statement: 'Given a directed graph with V vertices and E edges, find the number of Strongly Connected Components (SCCs). An SCC is a maximal set of vertices where every vertex is reachable from every other vertex. Constraints: 1 <= V <= 10^5.',
    intuition: 'Kosaraju\'s: (1) DFS on original graph, push nodes to a stack in finish order. (2) Transpose the graph (reverse all edges). (3) Pop nodes from the stack; for each unvisited node, DFS on the transposed graph — each DFS visit is one SCC. The finish order ensures we process SCCs from "sink" to "source".',
    time_complexity: 'O(V + E) — two DFS passes.',
    space_complexity: 'O(V + E) — transposed graph and stack.',
    code: `import java.util.*;

public class Kosaraju {
    static void dfs1(int u, List<List<Integer>> adj, boolean[] vis, Deque<Integer> stack) {
        vis[u] = true;
        for (int v : adj.get(u)) if (!vis[v]) dfs1(v, adj, vis, stack);
        stack.push(u);
    }

    static void dfs2(int u, List<List<Integer>> radj, boolean[] vis) {
        vis[u] = true;
        for (int v : radj.get(u)) if (!vis[v]) dfs2(v, radj, vis);
    }

    static int countSCC(int v, List<List<Integer>> adj) {
        boolean[] vis = new boolean[v];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < v; i++) if (!vis[i]) dfs1(i, adj, vis, stack);

        List<List<Integer>> radj = new ArrayList<>();
        for (int i = 0; i < v; i++) radj.add(new ArrayList<>());
        for (int u = 0; u < v; u++) for (int w : adj.get(u)) radj.get(w).add(u);

        Arrays.fill(vis, false);
        int count = 0;
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (!vis[u]) { dfs2(u, radj, vis); count++; }
        }
        return count;
    }

    public static void main(String[] args) {
        int v = 5;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        adj.get(1).add(0); adj.get(0).add(2); adj.get(2).add(1);
        adj.get(0).add(3); adj.get(3).add(4);
        System.out.println(countSCC(v, adj)); // 3  ({0,1,2}, {3}, {4})
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Minimum Spanning Tree (Prim\'s Algorithm)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/',
    statement: 'Given a connected undirected weighted graph with V vertices, find the weight of its Minimum Spanning Tree using Prim\'s algorithm. Constraints: 1 <= V <= 10^3; edge weights are non-negative.',
    intuition: 'Maintain a min-heap of (weight, vertex) pairs. Start with vertex 0 at cost 0. Always pick the cheapest edge connecting a visited vertex to an unvisited one. Add that cost to MST total and enqueue the new vertex\'s neighbors. Skip already-included vertices.',
    time_complexity: 'O((V + E) log V) — heap operations.',
    space_complexity: 'O(V + E) — adjacency list and heap.',
    code: `import java.util.*;

public class PrimsMST {
    static int prim(int v, List<List<int[]>> adj) {
        boolean[] inMST = new boolean[v];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0}); // {weight, vertex}
        int total = 0;
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int wt = cur[0], u = cur[1];
            if (inMST[u]) continue;
            inMST[u] = true;
            total += wt;
            for (int[] edge : adj.get(u)) {
                if (!inMST[edge[0]]) pq.offer(new int[]{edge[1], edge[0]});
            }
        }
        return total;
    }

    public static void main(String[] args) {
        int v = 5;
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        int[][] edges = {{0,1,2},{0,3,6},{1,2,3},{1,3,8},{1,4,5},{2,4,7},{3,4,9}};
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1],e[2]});
            adj.get(e[1]).add(new int[]{e[0],e[2]});
        }
        System.out.println(prim(v, adj)); // 16  (edges: 0-1:2, 1-2:3, 1-4:5, 0-3:6)
    }
}`
  },
  {
    topic: 'Graph',
    title: 'Word Ladder (Shortest Transformation)',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/word-ladder-length-of-shortest-chain-to-reach-a-target-word/',
    statement: 'Given a beginWord, endWord, and a wordList, find the minimum number of transformations to convert beginWord to endWord where each step changes exactly one letter and the result must be in wordList. Return 0 if no path exists. Constraints: word length <= 10; wordList size <= 10^4.',
    intuition: 'BFS on the graph of valid word transformations. From each word, try all single-character substitutions. If the result is in the word set (and unvisited), enqueue it. Return level + 1 when endWord is reached. BFS guarantees the shortest path.',
    time_complexity: 'O(M² * N) where M = word length, N = word list size.',
    space_complexity: 'O(N * M) — word set and queue.',
    code: `import java.util.*;

public class WordLadder {
    static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;
        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        int level = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                char[] chars = word.toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char orig = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == orig) continue;
                        chars[j] = c;
                        String next = new String(chars);
                        if (next.equals(endWord)) return level + 1;
                        if (wordSet.contains(next)) {
                            wordSet.remove(next); // mark visited
                            queue.offer(next);
                        }
                    }
                    chars[j] = orig;
                }
            }
            level++;
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(ladderLength("hit", "cog", Arrays.asList("hot","dot","dog","lot","log","cog"))); // 5
        System.out.println(ladderLength("hit", "cog", Arrays.asList("hot","dot","dog","lot","log")));       // 0
    }
}`
  },

  // ─── Trie (6) ────────────────────────────────────────────────────────────────
  {
    topic: 'Trie',
    title: 'Implement Trie (Insert, Search, StartsWith)',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/trie-insert-and-search/',
    statement: 'Implement a Trie (prefix tree) with insert(word), search(word), and startsWith(prefix) operations. search returns true if the word is in the trie. startsWith returns true if any word in the trie starts with the prefix. Constraints: word length <= 2000; lowercase letters only.',
    intuition: 'Each TrieNode has 26 children (one per letter) and an isEnd flag. Insert: walk the path letter by letter, creating nodes as needed, mark isEnd=true at last node. Search: walk the path — fail if any node is missing; check isEnd at the end. StartsWith: same walk without isEnd check.',
    time_complexity: 'O(L) per operation where L = word length.',
    space_complexity: 'O(total characters inserted) — each unique prefix gets its own node.',
    code: `public class Trie {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (cur.children[idx] == null) cur.children[idx] = new TrieNode();
            cur = cur.children[idx];
        }
        cur.isEnd = true;
    }

    boolean search(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (cur.children[idx] == null) return false;
            cur = cur.children[idx];
        }
        return cur.isEnd;
    }

    boolean startsWith(String prefix) {
        TrieNode cur = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (cur.children[idx] == null) return false;
            cur = cur.children[idx];
        }
        return true;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.insert("apple");
        System.out.println(trie.search("apple"));   // true
        System.out.println(trie.search("app"));     // false
        System.out.println(trie.startsWith("app")); // true
        trie.insert("app");
        System.out.println(trie.search("app"));     // true
    }
}`
  },
  {
    topic: 'Trie',
    title: 'Longest Common Prefix Using Trie',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/longest-common-prefix-using-trie/',
    statement: 'Given N strings, find the longest string that is a prefix of all the given strings. Return an empty string if no common prefix exists. Constraints: 1 <= N <= 200; string lengths <= 200; lowercase letters only.',
    intuition: 'Build a trie with all strings. The longest common prefix ends where either a node has more than one non-null child (the strings diverge) or a word ends (can\'t extend further). Traverse from root following single-child, non-terminal nodes.',
    time_complexity: 'O(total characters) — build trie + traverse.',
    space_complexity: 'O(total characters) — trie storage.',
    code: `public class LongestCommonPrefix {
    static class TrieNode {
        TrieNode[] ch = new TrieNode[26];
        boolean isEnd;
        int childCount;
    }

    static String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        TrieNode root = new TrieNode();
        for (String s : strs) {
            TrieNode cur = root;
            for (char c : s.toCharArray()) {
                int idx = c - 'a';
                if (cur.ch[idx] == null) { cur.ch[idx] = new TrieNode(); cur.childCount++; }
                cur = cur.ch[idx];
            }
            cur.isEnd = true;
        }
        StringBuilder sb = new StringBuilder();
        TrieNode cur = root;
        while (cur.childCount == 1 && !cur.isEnd) {
            for (int i = 0; i < 26; i++) {
                if (cur.ch[i] != null) { sb.append((char)('a'+i)); cur = cur.ch[i]; break; }
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(longestCommonPrefix(new String[]{"flower","flow","flight"})); // "fl"
        System.out.println(longestCommonPrefix(new String[]{"dog","racecar","car"}));    // ""
        System.out.println(longestCommonPrefix(new String[]{"geeksforgeeks","geeks","geek","geezer"})); // "gee"
    }
}`
  },
  {
    topic: 'Trie',
    title: 'Word Search II (Find all words in a board)',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/boggle-find-possible-words-board-characters/',
    statement: 'Given an m x n board of characters and a list of words, find all words from the list that can be formed by sequentially adjacent cells (horizontally or vertically adjacent) without reusing the same cell. Constraints: 1 <= m, n <= 12; 1 <= words.length <= 3*10^4.',
    intuition: 'Build a Trie of all words. DFS from each cell, following the Trie to prune invalid paths early. When isEnd is reached, add the word to results. Mark cells visited during DFS with a sentinel and restore on backtrack. Removing a found word from the Trie prevents duplicate results.',
    time_complexity: 'O(M * N * 4^L) where L = max word length.',
    space_complexity: 'O(W * L) — Trie storage.',
    code: `import java.util.*;

public class WordSearchII {
    static class TrieNode {
        TrieNode[] ch = new TrieNode[26];
        String word;
    }

    static List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (cur.ch[i] == null) cur.ch[i] = new TrieNode();
                cur = cur.ch[i];
            }
            cur.word = w;
        }
        List<String> result = new ArrayList<>();
        int rows = board.length, cols = board[0].length;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                dfs(board, r, c, root, result);
        return result;
    }

    static void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#' || node.ch[ch - 'a'] == null) return;
        node = node.ch[ch - 'a'];
        if (node.word != null) { result.add(node.word); node.word = null; } // avoid duplicates
        board[r][c] = '#';
        dfs(board, r+1, c, node, result); dfs(board, r-1, c, node, result);
        dfs(board, r, c+1, node, result); dfs(board, r, c-1, node, result);
        board[r][c] = ch;
    }

    public static void main(String[] args) {
        char[][] board = {{'o','a','a','n'},{'e','t','a','e'},{'i','h','k','r'},{'i','f','l','v'}};
        List<String> result = findWords(board, new String[]{"oath","pea","eat","rain"});
        Collections.sort(result);
        System.out.println(result); // [eat, oath]
    }
}`
  },
  {
    topic: 'Trie',
    title: 'Auto-Complete Feature Using Trie',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/auto-complete-feature-using-trie/',
    statement: 'Given a Trie of N words and a query prefix, return all words in the Trie that start with the given prefix. Return them in lexicographic order. Constraints: N <= 10^4; word length <= 50.',
    intuition: 'Search the Trie to the end of the prefix — this is O(L). Then DFS from that node, collecting all words ending (isEnd=true) along any path. DFS on a Trie naturally visits children in alphabetical order (children[0] before children[1], etc.), so the result is already sorted.',
    time_complexity: 'O(L + output) — L to reach prefix node, then traverse matching subtree.',
    space_complexity: 'O(N * L) — trie storage.',
    code: `import java.util.*;

public class AutoComplete {
    static class TrieNode {
        TrieNode[] ch = new TrieNode[26];
        boolean isEnd;
    }

    TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.ch[i] == null) cur.ch[i] = new TrieNode();
            cur = cur.ch[i];
        }
        cur.isEnd = true;
    }

    void dfs(TrieNode node, StringBuilder prefix, List<String> result) {
        if (node.isEnd) result.add(prefix.toString());
        for (int i = 0; i < 26; i++) {
            if (node.ch[i] != null) {
                prefix.append((char)('a' + i));
                dfs(node.ch[i], prefix, result);
                prefix.deleteCharAt(prefix.length() - 1);
            }
        }
    }

    List<String> autocomplete(String prefix) {
        TrieNode cur = root;
        for (char c : prefix.toCharArray()) {
            int i = c - 'a';
            if (cur.ch[i] == null) return Collections.emptyList();
            cur = cur.ch[i];
        }
        List<String> result = new ArrayList<>();
        dfs(cur, new StringBuilder(prefix), result);
        return result;
    }

    public static void main(String[] args) {
        AutoComplete ac = new AutoComplete();
        String[] words = {"there","their","answer","any","by","bye","their","they"};
        for (String w : words) ac.insert(w);
        System.out.println(ac.autocomplete("th"));  // [their, there, they]
        System.out.println(ac.autocomplete("an"));  // [answer, any]
        System.out.println(ac.autocomplete("b"));   // [by, bye]
        System.out.println(ac.autocomplete("xyz")); // []
    }
}`
  },
  {
    topic: 'Trie',
    title: 'Maximum XOR of Two Numbers in an Array',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/maximum-xor-of-two-numbers-in-an-array/',
    statement: 'Given an integer array, find the maximum XOR of any two elements. Constraints: 1 <= N <= 2*10^5; 0 <= arr[i] <= 2^31 - 1.',
    intuition: 'Build a binary Trie (bit by bit from MSB). For each number, query the Trie greedily: at each bit, try the opposite bit — if that path exists, XOR gains a 1. Insert each number after querying (or insert all first, then query). This is more efficient than O(N²) brute force.',
    time_complexity: 'O(N * 32) = O(N) — 32-bit numbers, linear per number.',
    space_complexity: 'O(N * 32) — trie with at most 32N nodes.',
    code: `public class MaxXOR {
    static class TrieNode {
        TrieNode[] ch = new TrieNode[2];
    }

    static TrieNode root = new TrieNode();

    static void insert(int num) {
        TrieNode cur = root;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (cur.ch[bit] == null) cur.ch[bit] = new TrieNode();
            cur = cur.ch[bit];
        }
    }

    static int query(int num) {
        TrieNode cur = root;
        int xor = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int want = 1 - bit; // we want the opposite bit for maximum XOR
            if (cur.ch[want] != null) { xor |= (1 << i); cur = cur.ch[want]; }
            else cur = cur.ch[bit];
        }
        return xor;
    }

    static int findMaxXOR(int[] nums) {
        root = new TrieNode();
        for (int n : nums) insert(n);
        int max = 0;
        for (int n : nums) max = Math.max(max, query(n));
        return max;
    }

    public static void main(String[] args) {
        System.out.println(findMaxXOR(new int[]{3, 10, 5, 25, 2, 8})); // 28 (5 XOR 25)
        System.out.println(findMaxXOR(new int[]{0}));                   // 0
        System.out.println(findMaxXOR(new int[]{2, 4}));                // 6 (2 XOR 4)
    }
}`
  },
  {
    topic: 'Trie',
    title: 'Count Distinct Substrings Using Trie',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/count-distinct-substrings-of-a-string-using-trie/',
    statement: 'Given a string S, count the total number of distinct non-empty substrings. Constraints: 1 <= |S| <= 500; lowercase letters only.',
    intuition: 'Insert every suffix of S into a Trie. Each new edge created during insertion represents a new distinct substring (the prefix up to that edge). So the answer is the total number of edges in the Trie. Count edges as new TrieNode creations during all insertions.',
    time_complexity: 'O(N²) — N suffixes, average length N/2.',
    space_complexity: 'O(N²) — worst case all characters distinct.',
    code: `public class CountDistinctSubstrings {
    static class TrieNode {
        TrieNode[] ch = new TrieNode[26];
    }

    static int countDistinct(String s) {
        TrieNode root = new TrieNode();
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            TrieNode cur = root;
            for (int j = i; j < s.length(); j++) {
                int idx = s.charAt(j) - 'a';
                if (cur.ch[idx] == null) {
                    cur.ch[idx] = new TrieNode();
                    count++; // new edge = new distinct substring
                }
                cur = cur.ch[idx];
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countDistinct("abab")); // 7  (a,b,ab,ba,aba,bab,abab)
        System.out.println(countDistinct("abc"));  // 6  (a,b,c,ab,bc,abc)
        System.out.println(countDistinct("aa"));   // 2  (a,aa)
        System.out.println(countDistinct("abcd")); // 10 (all 4+3+2+1 substrings are distinct)
    }
}`
  }
];
