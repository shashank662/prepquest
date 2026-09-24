// Striver's 180 — Binary Trees (15) + Binary Search Trees (10)
//
// Every solution is a standalone class. build(...) turns a LeetCode-style level-order array
// (null = missing child) into a tree; show(...) prints a tree back in the same format.

const TREE = `    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    static TreeNode build(Integer... v) {
        if (v.length == 0 || v[0] == null) return null;
        TreeNode root = new TreeNode(v[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        for (int i = 1; i < v.length; ) {
            TreeNode n = q.poll();
            if (v[i] != null) q.add(n.left = new TreeNode(v[i]));
            i++;
            if (i < v.length && v[i] != null) q.add(n.right = new TreeNode(v[i]));
            i++;
        }
        return root;
    }`;

const SHOW = `    static String show(TreeNode root) {
        List<String> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) { out.add("null"); continue; }
            out.add(String.valueOf(n.val));
            q.add(n.left); q.add(n.right);
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
        return out.toString();
    }`;

export default {

  // ── Binary Trees › BFS ──────────────────────────────────────────────────────

  'level-order-traversal': {
    difficulty: 'Medium',
    statement: "Given the root of a binary tree, return its nodes' values level by level, from left to right.",
    intuition: "Breadth-first search with a queue. At the start of each level, the queue holds exactly that level's nodes, so record size = q.size(), poll that many nodes into one list, and enqueue their children for the next level.",
    time: 'O(n)',
    space: 'O(w) — the widest level',
    code: `import java.util.*;

public class LevelOrderTraversal {
${TREE}

    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int size = q.size(); size > 0; size--) {
                TreeNode n = q.poll();
                level.add(n.val);
                if (n.left != null)  q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            res.add(level);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(levelOrder(build(3, 9, 20, null, null, 15, 7))); // [[3], [9, 20], [15, 7]]
        System.out.println(levelOrder(build(1)));                           // [[1]]
        System.out.println(levelOrder(build()));                            // []
    }
}`,
  },

  'maximum-width-of-bt': {
    difficulty: 'Medium',
    statement: 'Return the maximum width over all levels of a binary tree, where the width of a level is the distance between its leftmost and rightmost non-null nodes, counting the null positions in between as if the tree were complete.',
    intuition: "Number the nodes the way a heap does: a node at index i has children at 2i and 2i + 1. The width of a level is lastIndex − firstIndex + 1. On a deep, one-sided tree these indices overflow, so at the start of each level subtract the level's first index from every index before doubling. BFS level by level and track the best width.",
    time: 'O(n)',
    space: 'O(w)',
    code: `import java.util.*;

public class MaxWidthBinaryTree {
${TREE}

    public static int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        Queue<Object[]> q = new LinkedList<>();              // {node, index}
        q.add(new Object[]{root, 0L});
        int best = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            long first = (long) q.peek()[1], last = first;
            for (int i = 0; i < size; i++) {
                Object[] cur = q.poll();
                TreeNode n = (TreeNode) cur[0];
                long idx = (long) cur[1] - first;            // normalise to avoid overflow
                last = idx;
                if (n.left != null)  q.add(new Object[]{n.left, 2 * idx});
                if (n.right != null) q.add(new Object[]{n.right, 2 * idx + 1});
            }
            best = Math.max(best, (int) (last + 1));
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5, 3, null, 9)));                    // 4
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5, null, null, 9, 6, null, 7)));     // 7
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5)));                                // 2
    }
}`,
  },

  'right-left-view-of-bt': {
    difficulty: 'Medium',
    statement: 'Return the values of the nodes visible when a binary tree is viewed from its right side (and, for the left view, from its left side), from top to bottom.',
    intuition: "Each level contributes exactly one visible node: the last one from the right, the first one from the left. A DFS that visits the right child first adds a node whenever it reaches a depth for the first time (depth == result.size()). For the left view, visit the left child first instead. This uses O(h) space rather than a whole level.",
    time: 'O(n)',
    space: 'O(h) — recursion depth',
    code: `import java.util.*;

public class BinaryTreeViews {
${TREE}

    public static List<Integer> rightView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, 0, res, true);
        return res;
    }
    public static List<Integer> leftView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        dfs(root, 0, res, false);
        return res;
    }
    private static void dfs(TreeNode n, int depth, List<Integer> res, boolean rightFirst) {
        if (n == null) return;
        if (depth == res.size()) res.add(n.val);             // first node seen at this depth
        dfs(rightFirst ? n.right : n.left, depth + 1, res, rightFirst);
        dfs(rightFirst ? n.left : n.right, depth + 1, res, rightFirst);
    }

    public static void main(String[] args) {
        TreeNode t = build(1, 2, 3, null, 5, null, 4);
        System.out.println(rightView(t)); // [1, 3, 4]
        System.out.println(leftView(t));  // [1, 2, 5]
        System.out.println(rightView(build(1, 2, 3, 4)));  // [1, 3, 4]
    }
}`,
  },

  'top-view-of-bt': {
    difficulty: 'Medium',
    statement: 'Return the top view of a binary tree: for each vertical line (horizontal distance from the root), the topmost node, ordered from left to right. If two nodes tie, take the one that comes first from left to right.',
    intuition: "Give the root column 0, left children column − 1 and right children column + 1. BFS visits nodes from top to bottom and, within a level, left to right. So the first node BFS reaches in each column is the one seen from above. Store it with putIfAbsent in a TreeMap keyed by column, which keeps the columns sorted from left to right.",
    time: 'O(n log n) — TreeMap inserts (O(n) with a min-column offset array)',
    space: 'O(n)',
    code: `import java.util.*;

public class TopView {
${TREE}

    public static List<Integer> topView(TreeNode root) {
        TreeMap<Integer, Integer> firstInCol = new TreeMap<>();
        Queue<Object[]> q = new LinkedList<>();
        if (root != null) q.add(new Object[]{root, 0});
        while (!q.isEmpty()) {
            Object[] cur = q.poll();
            TreeNode n = (TreeNode) cur[0];
            int col = (int) cur[1];
            firstInCol.putIfAbsent(col, n.val);
            if (n.left != null)  q.add(new Object[]{n.left, col - 1});
            if (n.right != null) q.add(new Object[]{n.right, col + 1});
        }
        return new ArrayList<>(firstInCol.values());
    }

    public static void main(String[] args) {
        System.out.println(topView(build(1, 2, 3, 4, 5, 6, 7)));            // [4, 2, 1, 3, 7]
        System.out.println(topView(build(10, 20, 30, 40, 60, 90, 100)));    // [40, 20, 10, 30, 100]
        System.out.println(topView(build(1, 2, 3, null, 4, null, null, null, 5, null, 6))); // [2, 1, 3, 6]
    }
}`,
  },

  'print-all-nodes-at-a-distance-of-k-in-bt': {
    difficulty: 'Medium',
    statement: 'Given the root of a binary tree, a target node and an integer k, return the values of all nodes exactly k edges away from the target (in any order).',
    intuition: "A tree only lets you walk down, but distance k can also go up through parents. First record each node's parent in a map with one traversal. Now the tree is an undirected graph (left, right, parent), so run BFS from the target for k levels, marking visited nodes so you never walk back. The nodes left in the queue are the answer.",
    time: 'O(n)',
    space: 'O(n) — parent map + visited set',
    code: `import java.util.*;

public class NodesAtDistanceK {
${TREE}

    public static List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n.left != null)  { parent.put(n.left, n);  q.add(n.left); }
            if (n.right != null) { parent.put(n.right, n); q.add(n.right); }
        }
        Set<TreeNode> seen = new HashSet<>();
        q.add(target); seen.add(target);
        for (int d = 0; d < k && !q.isEmpty(); d++) {
            for (int size = q.size(); size > 0; size--) {
                TreeNode n = q.poll();
                for (TreeNode nb : new TreeNode[]{n.left, n.right, parent.get(n)})
                    if (nb != null && seen.add(nb)) q.add(nb);
            }
        }
        List<Integer> res = new ArrayList<>();
        for (TreeNode n : q) res.add(n.val);
        Collections.sort(res);
        return res;
    }
    static TreeNode find(TreeNode n, int val) {
        if (n == null || n.val == val) return n;
        TreeNode l = find(n.left, val);
        return l != null ? l : find(n.right, val);
    }

    public static void main(String[] args) {
        TreeNode root = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4);
        System.out.println(distanceK(root, find(root, 5), 2)); // [1, 4, 7]
        System.out.println(distanceK(root, find(root, 3), 3)); // [4, 7]
        System.out.println(distanceK(root, find(root, 7), 1)); // [2]
    }
}`,
  },

  'minimum-time-taken-to-burn-the-bt-from-a-given-node': {
    difficulty: 'Hard',
    statement: 'A fire starts at the target node of a binary tree. Each second it spreads from every burning node to its left child, right child and parent. Return the number of seconds until the whole tree is burnt.',
    intuition: "The fire spreads like BFS on the tree seen as an undirected graph. Build a parent map, then BFS outwards from the target one level per second, marking visited nodes. The answer is the number of levels after the starting one, which is the distance to the farthest node.",
    time: 'O(n)',
    space: 'O(n)',
    code: `import java.util.*;

public class BurnBinaryTree {
${TREE}

    public static int timeToBurn(TreeNode root, int start) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        TreeNode target = null;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n.val == start) target = n;
            if (n.left != null)  { parent.put(n.left, n);  q.add(n.left); }
            if (n.right != null) { parent.put(n.right, n); q.add(n.right); }
        }
        Set<TreeNode> burnt = new HashSet<>();
        q.add(target); burnt.add(target);
        int time = -1;
        while (!q.isEmpty()) {
            time++;
            for (int size = q.size(); size > 0; size--) {
                TreeNode n = q.poll();
                for (TreeNode nb : new TreeNode[]{n.left, n.right, parent.get(n)})
                    if (nb != null && burnt.add(nb)) q.add(nb);
            }
        }
        return time;
    }

    public static void main(String[] args) {
        System.out.println(timeToBurn(build(1, 2, 3, 4, null, 5, 6, null, 7), 1)); // 3
        System.out.println(timeToBurn(build(1, 2, 3, 4, null, 5, 6, null, 7), 7)); // 5
        System.out.println(timeToBurn(build(1), 1));                               // 0
    }
}`,
  },

  'vertical-order-traversal': {
    difficulty: 'Hard',
    statement: 'The root is at (row 0, col 0); the left child of (r, c) is at (r + 1, c − 1) and the right child at (r + 1, c + 1). Return the vertical order traversal: columns from left to right, each listed top to bottom, with nodes at the same row and column sorted by value.',
    intuition: "Record (col, row, val) for every node during any traversal, then sort by column, then row, then value, which is exactly the required order. Walk the sorted list and start a new group whenever the column changes. A TreeMap<col, TreeMap<row, PriorityQueue>> gives the same result without a separate sort.",
    time: 'O(n log n)',
    space: 'O(n)',
    code: `import java.util.*;

public class VerticalOrderTraversal {
${TREE}

    public static List<List<Integer>> verticalTraversal(TreeNode root) {
        List<int[]> nodes = new ArrayList<>();                  // {col, row, val}
        collect(root, 0, 0, nodes);
        nodes.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] != b[1] ? a[1] - b[1] : a[2] - b[2]);
        List<List<Integer>> res = new ArrayList<>();
        Integer prevCol = null;
        for (int[] n : nodes) {
            if (prevCol == null || n[0] != prevCol) { res.add(new ArrayList<>()); prevCol = n[0]; }
            res.get(res.size() - 1).add(n[2]);
        }
        return res;
    }
    private static void collect(TreeNode n, int row, int col, List<int[]> out) {
        if (n == null) return;
        out.add(new int[]{col, row, n.val});
        collect(n.left, row + 1, col - 1, out);
        collect(n.right, row + 1, col + 1, out);
    }

    public static void main(String[] args) {
        System.out.println(verticalTraversal(build(3, 9, 20, null, null, 15, 7))); // [[9], [3, 15], [20], [7]]
        System.out.println(verticalTraversal(build(1, 2, 3, 4, 5, 6, 7)));         // [[4], [2], [1, 5, 6], [3], [7]]
        System.out.println(verticalTraversal(build(1, 2, 3, 4, 6, 5, 7)));         // [[4], [2], [1, 5, 6], [3], [7]]
    }
}`,
  },

  // ── Binary Trees › DFS / Tree DP ────────────────────────────────────────────

  'print-root-to-leaf-path-in-bt': {
    difficulty: 'Easy',
    statement: 'Given the root of a binary tree, return every root-to-leaf path as a list of node values.',
    intuition: "DFS while carrying the current path. Add the node on the way down. At a leaf (no children), copy the path into the result. Remove the node on the way back up so its siblings start from the right prefix. Every path shares one list, so the only extra memory is the copies stored at the leaves.",
    time: 'O(n · h) — each leaf copies a path of length ≤ h',
    space: 'O(h) — recursion + current path',
    code: `import java.util.*;

public class RootToLeafPaths {
${TREE}

    public static List<List<Integer>> allPaths(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(root, new ArrayList<>(), res);
        return res;
    }
    private static void dfs(TreeNode n, List<Integer> path, List<List<Integer>> res) {
        if (n == null) return;
        path.add(n.val);
        if (n.left == null && n.right == null) res.add(new ArrayList<>(path));
        else { dfs(n.left, path, res); dfs(n.right, path, res); }
        path.remove(path.size() - 1);
    }

    public static void main(String[] args) {
        System.out.println(allPaths(build(1, 2, 3, null, 5, null, 4))); // [[1, 2, 5], [1, 3, 4]]
        System.out.println(allPaths(build(1, 2, 3, 4, 5)));             // [[1, 2, 4], [1, 2, 5], [1, 3]]
    }
}`,
  },

  'diameter-of-binary-tree': {
    difficulty: 'Easy',
    statement: 'Return the diameter of a binary tree: the number of edges on the longest path between any two nodes. The path does not have to pass through the root.',
    intuition: "Every path has one highest node. At that node, the path's length is height(left) + height(right). A post-order DFS returns each subtree's height and, along the way, updates a global best with leftHeight + rightHeight. So one pass computes all heights and the diameter together, O(n) instead of O(n²).",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class DiameterOfBinaryTree {
${TREE}

    private static int best;

    public static int diameter(TreeNode root) {
        best = 0;
        height(root);
        return best;
    }
    private static int height(TreeNode n) {
        if (n == null) return 0;
        int l = height(n.left), r = height(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    }

    public static void main(String[] args) {
        System.out.println(diameter(build(1, 2, 3, 4, 5)));                                // 3
        System.out.println(diameter(build(1, 2)));                                         // 1
        System.out.println(diameter(build(1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8))); // 6
    }
}`,
  },

  'lca-in-bt': {
    difficulty: 'Medium',
    statement: 'Given a binary tree and two nodes p and q in it, return their lowest common ancestor: the deepest node that has both p and q as descendants (a node counts as a descendant of itself).',
    intuition: "Recurse into both subtrees. If the current node is null, p or q, return it. If the left and right calls both come back non-null, p and q are in different subtrees, so this node is the LCA. Otherwise pass up whichever side is non-null. That is either the LCA found lower down, or the one target found so far.",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class LowestCommonAncestor {
${TREE}

    public static TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode l = lca(root.left, p, q), r = lca(root.right, p, q);
        if (l != null && r != null) return root;
        return l != null ? l : r;
    }
    static TreeNode find(TreeNode n, int val) {
        if (n == null || n.val == val) return n;
        TreeNode l = find(n.left, val);
        return l != null ? l : find(n.right, val);
    }

    public static void main(String[] args) {
        TreeNode root = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4);
        System.out.println(lca(root, find(root, 5), find(root, 1)).val); // 3
        System.out.println(lca(root, find(root, 5), find(root, 4)).val); // 5
        System.out.println(lca(root, find(root, 7), find(root, 8)).val); // 3
    }
}`,
  },

  'boundary-traversal': {
    difficulty: 'Medium',
    statement: 'Return the boundary of a binary tree anti-clockwise from the root: the root, then the left boundary top-down (excluding leaves), then all leaves from left to right, then the right boundary bottom-up (excluding leaves).',
    intuition: "Collect three parts separately. Left boundary: from root.left, keep going left (or right if there is no left child), adding every node that isn't a leaf. Leaves: an inorder-style DFS adds nodes with no children. Right boundary: from root.right, keep going right (or left if needed), store the non-leaf nodes, and reverse them at the end. Leaving leaves out of the two boundaries stops them from being counted twice.",
    time: 'O(n)',
    space: 'O(h) besides the output',
    code: `import java.util.*;

public class BoundaryTraversal {
${TREE}

    public static List<Integer> boundary(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        if (!isLeaf(root)) res.add(root.val);
        for (TreeNode n = root.left; n != null; n = (n.left != null) ? n.left : n.right)
            if (!isLeaf(n)) res.add(n.val);
        addLeaves(root, res);
        List<Integer> right = new ArrayList<>();
        for (TreeNode n = root.right; n != null; n = (n.right != null) ? n.right : n.left)
            if (!isLeaf(n)) right.add(n.val);
        Collections.reverse(right);
        res.addAll(right);
        return res;
    }
    private static boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
    private static void addLeaves(TreeNode n, List<Integer> res) {
        if (n == null) return;
        if (isLeaf(n)) { res.add(n.val); return; }
        addLeaves(n.left, res);
        addLeaves(n.right, res);
    }

    public static void main(String[] args) {
        System.out.println(boundary(build(1, 2, 3, 4, 5, 6, 7, null, null, 8, 9)));                          // [1, 2, 4, 8, 9, 6, 7, 3]
        System.out.println(boundary(build(1, 2, null, 4, 9, 6, 5, 3, null, null, null, null, null, 7, 8))); // [1, 2, 4, 6, 5, 7, 8]
        System.out.println(boundary(build(1)));                                                              // [1]
    }
}`,
  },

  'construct-a-bt-from-preorder-and-inorder': {
    difficulty: 'Medium',
    statement: 'Given the preorder and inorder traversals of a binary tree with unique values, rebuild the tree and return its root.',
    intuition: "The next preorder value is always the root of the current subtree. Its position in the inorder array splits the remaining values into the left subtree (everything before it) and the right subtree (everything after). Recurse on the left part first, since preorder lists it next, then the right. A value → inorder-index map makes each split O(1).",
    time: 'O(n)',
    space: 'O(n) — index map + recursion',
    code: `import java.util.*;

public class BuildTreePreIn {
${TREE}

${SHOW}

    private static int pre;

    public static TreeNode buildTree(int[] preorder, int[] inorder) {
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
        pre = 0;
        return build(preorder, pos, 0, inorder.length - 1);
    }
    private static TreeNode build(int[] preorder, Map<Integer, Integer> pos, int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(preorder[pre++]);
        int mid = pos.get(root.val);
        root.left  = build(preorder, pos, lo, mid - 1);
        root.right = build(preorder, pos, mid + 1, hi);
        return root;
    }

    public static void main(String[] args) {
        System.out.println(show(buildTree(new int[]{3, 9, 20, 15, 7}, new int[]{9, 3, 15, 20, 7}))); // [3, 9, 20, null, null, 15, 7]
        System.out.println(show(buildTree(new int[]{1, 2, 4, 5, 3}, new int[]{4, 2, 5, 1, 3})));     // [1, 2, 3, 4, 5]
    }
}`,
  },

  'morris-inorder-traversal-': {
    difficulty: 'Medium',
    statement: 'Return the inorder traversal of a binary tree using O(1) extra space: no recursion and no stack (Morris traversal).',
    intuition: "To get back up from a left subtree without a stack, add a temporary 'thread'. The inorder predecessor of cur (the rightmost node of its left subtree) gets its right pointer set to cur. The first time we reach cur, create the thread and go left. The second time we arrive (by following the thread), remove it, visit cur, and go right. A node with no left child is visited immediately. Each edge is walked a constant number of times.",
    time: 'O(n) — each edge traversed at most 3 times',
    space: 'O(1)',
    code: `import java.util.*;

public class MorrisInorder {
${TREE}

    public static List<Integer> inorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) { res.add(cur.val); cur = cur.right; continue; }
            TreeNode pred = cur.left;
            while (pred.right != null && pred.right != cur) pred = pred.right;
            if (pred.right == null) { pred.right = cur; cur = cur.left; }         // create thread
            else { pred.right = null; res.add(cur.val); cur = cur.right; }          // remove thread
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(inorder(build(1, 4, null, 4, 2)));        // [4, 4, 2, 1]
        System.out.println(inorder(build(1, null, 2, 3)));           // [1, 3, 2]
        System.out.println(inorder(build(4, 2, 6, 1, 3, 5, 7)));     // [1, 2, 3, 4, 5, 6, 7]
    }
}`,
  },

  'maximum-path-sum-': {
    difficulty: 'Hard',
    statement: 'A path in a binary tree is a sequence of adjacent nodes with no node repeated; it need not pass through the root. Return the largest path sum over all non-empty paths.',
    intuition: "Every path has a highest node where it can bend, taking a downward branch into the left and one into the right. A post-order DFS returns the best downward branch starting at each node: node.val + max(0, left, right). A negative branch counts as 0, meaning 'don't take it'. At each node, also try the bent path node.val + max(0, left) + max(0, right) as a candidate for the global best.",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class MaxPathSum {
${TREE}

    private static int best;

    public static int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }
    private static int gain(TreeNode n) {
        if (n == null) return 0;
        int l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
    }

    public static void main(String[] args) {
        System.out.println(maxPathSum(build(20, 9, -10, null, null, 15, 7)));  // 34
        System.out.println(maxPathSum(build(-10, 9, 20, null, null, 15, 7)));  // 42
        System.out.println(maxPathSum(build(-3)));                             // -3
    }
}`,
  },

  'serialize-and-de-serialize-bt': {
    difficulty: 'Hard',
    statement: 'Design serialize(root), which turns a binary tree into a string, and deserialize(data), which rebuilds exactly the same tree from that string.',
    intuition: "Write a preorder traversal that includes a '#' marker for every null child, separated by commas. The null markers make preorder unambiguous, since they show where each subtree ends. To deserialize, read the tokens in the same order with a shared cursor: '#' means null, otherwise create the node and rebuild its left subtree, then its right.",
    time: 'O(n) for both',
    space: 'O(n)',
    code: `import java.util.*;

public class SerializeDeserialize {
${TREE}

${SHOW}

    public static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        write(root, sb);
        return sb.substring(0, sb.length() - 1);
    }
    private static void write(TreeNode n, StringBuilder sb) {
        if (n == null) { sb.append("#,"); return; }
        sb.append(n.val).append(',');
        write(n.left, sb);
        write(n.right, sb);
    }

    public static TreeNode deserialize(String data) {
        return read(new ArrayDeque<>(Arrays.asList(data.split(","))));
    }
    private static TreeNode read(Deque<String> tokens) {
        String t = tokens.poll();
        if (t.equals("#")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(t));
        n.left = read(tokens);
        n.right = read(tokens);
        return n;
    }

    public static void main(String[] args) {
        TreeNode t = build(1, 2, 3, null, null, 4, 5);
        String s = serialize(t);
        System.out.println(s);                     // 1,2,#,#,3,4,#,#,5,#,#
        System.out.println(show(deserialize(s)));  // [1, 2, 3, null, null, 4, 5]
        System.out.println(serialize(null));       // #
    }
}`,
  },

  // ── Binary Search Trees › Inorder Traversal ─────────────────────────────────

  'insert-a-given-node-in-bst': {
    difficulty: 'Medium',
    statement: 'Insert a value (guaranteed not already present) into a binary search tree and return the root.',
    intuition: "Walk down the tree as if searching for the value: go left if it is smaller, right if it is larger. The first null child reached is where the value belongs, so attach a new leaf there. The rest of the tree doesn't change. An empty tree just becomes the new node.",
    time: 'O(h)',
    space: 'O(1) — iterative',
    code: `import java.util.*;

public class InsertIntoBST {
${TREE}

${SHOW}

    public static TreeNode insert(TreeNode root, int val) {
        TreeNode node = new TreeNode(val);
        if (root == null) return node;
        TreeNode cur = root;
        while (true) {
            if (val < cur.val) {
                if (cur.left == null) { cur.left = node; break; }
                cur = cur.left;
            } else {
                if (cur.right == null) { cur.right = node; break; }
                cur = cur.right;
            }
        }
        return root;
    }

    public static void main(String[] args) {
        System.out.println(show(insert(build(4, 2, 7, 1, 3), 5)));  // [4, 2, 7, 1, 3, 5]
        System.out.println(show(insert(build(40, 20, 60, 10, 30, 50, 70), 25))); // [40, 20, 60, 10, 30, 50, 70, null, null, 25]
        System.out.println(show(insert(null, 9)));                  // [9]
    }
}`,
  },

  'lca-in-bst': {
    difficulty: 'Medium',
    statement: 'Given a binary search tree and two values p and q present in it, return their lowest common ancestor.',
    intuition: "The BST ordering tells you which way to go. If both values are smaller than the current node, the LCA is in the left subtree. If both are larger, it is in the right. Otherwise they split here, or one of them equals the current node, so this node is the LCA. There is no need to search both subtrees as in a general binary tree.",
    time: 'O(h)',
    space: 'O(1)',
    code: `import java.util.*;

public class LCAInBST {
${TREE}

    public static TreeNode lca(TreeNode root, int p, int q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p < cur.val && q < cur.val) cur = cur.left;
            else if (p > cur.val && q > cur.val) cur = cur.right;
            else return cur;
        }
        return null;
    }

    public static void main(String[] args) {
        TreeNode root = build(5, 3, 6, 2, 4, null, 7);
        System.out.println(lca(root, 2, 4).val); // 3
        System.out.println(lca(root, 2, 7).val); // 5
        System.out.println(lca(root, 6, 7).val); // 6
    }
}`,
  },

  'delete-a-node-in-bst': {
    difficulty: 'Medium',
    statement: 'Delete the node with the given key from a binary search tree (if present) and return the root of the updated tree.',
    intuition: "Search for the key recursively. If the node has at most one child, replace it with that child. If it has two children, copy in its inorder successor (the smallest value in its right subtree) and then delete that successor from the right subtree. The successor has no left child, so that second deletion is always the easy case.",
    time: 'O(h)',
    space: 'O(h) — recursion',
    code: `import java.util.*;

public class DeleteNodeBST {
${TREE}

${SHOW}

    public static TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val)      root.left  = deleteNode(root.left, key);
        else if (key > root.val) root.right = deleteNode(root.right, key);
        else {
            if (root.left == null)  return root.right;
            if (root.right == null) return root.left;
            TreeNode succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = deleteNode(root.right, succ.val);
        }
        return root;
    }

    public static void main(String[] args) {
        System.out.println(show(deleteNode(build(5, 3, 6, 2, 4, null, 7), 3)));  // [5, 4, 6, 2, null, null, 7]
        System.out.println(show(deleteNode(build(5, 3, 6, 2, 4, null, 7), 0)));  // [5, 3, 6, 2, 4, null, 7]
        System.out.println(show(deleteNode(build(5, 3, 6, 2, 4, null, 7), 5)));  // [6, 3, 7, 2, 4]
    }
}`,
  },

  'inorder-successor-and-predecessor-in-bst': {
    difficulty: 'Medium',
    statement: 'Given a BST and a key present in it, return [inorder predecessor, inorder successor] of the key, using −1 where one does not exist.',
    intuition: "Walk down from the root once for each answer. For the successor: whenever node.val > key, the node is a candidate, so record it and go left to look for a smaller one. Otherwise go right. The predecessor is the mirror image: record node.val < key and go right. Each walk is one root-to-leaf path.",
    time: 'O(h)',
    space: 'O(1)',
    code: `import java.util.*;

public class PredecessorSuccessorBST {
${TREE}

    public static int[] predSucc(TreeNode root, int key) {
        int pred = -1, succ = -1;
        for (TreeNode n = root; n != null; ) {
            if (n.val > key) { succ = n.val; n = n.left; } else n = n.right;
        }
        for (TreeNode n = root; n != null; ) {
            if (n.val < key) { pred = n.val; n = n.right; } else n = n.left;
        }
        return new int[]{pred, succ};
    }

    public static void main(String[] args) {
        TreeNode root = build(5, 2, 10, 1, 4, 7, 12);
        System.out.println(Arrays.toString(predSucc(root, 10))); // [7, 12]
        System.out.println(Arrays.toString(predSucc(root, 1)));  // [-1, 2]
        System.out.println(Arrays.toString(predSucc(root, 12))); // [10, -1]
    }
}`,
  },

  'kth-smallest-and-largest-element-in-bst': {
    difficulty: 'Medium',
    statement: 'Given a BST and k (1-indexed), return [k-th smallest value, k-th largest value].',
    intuition: "An inorder traversal of a BST visits the values in ascending order, so the k-th visited node is the k-th smallest. A reverse inorder (right, node, left) visits them in descending order and gives the k-th largest. An iterative stack lets you stop as soon as the k-th node is reached.",
    time: 'O(h + k) for each',
    space: 'O(h)',
    code: `import java.util.*;

public class KthSmallestLargestBST {
${TREE}

    public static int[] kthSmallestLargest(TreeNode root, int k) {
        return new int[]{kth(root, k, false), kth(root, k, true)};
    }
    // reverse = false: ascending inorder; reverse = true: descending
    private static int kth(TreeNode root, int k, boolean reverse) {
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = reverse ? cur.right : cur.left; }
            cur = st.pop();
            if (--k == 0) return cur.val;
            cur = reverse ? cur.left : cur.right;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(kthSmallestLargest(build(3, 1, 4, null, 2), 1)));              // [1, 4]
        System.out.println(Arrays.toString(kthSmallestLargest(build(5, 3, 6, 2, 4, null, null, 1), 3)));  // [3, 4]
    }
}`,
  },

  'check-if-a-tree-is-a-bst-or-not': {
    difficulty: 'Medium',
    statement: 'Return true if a binary tree is a valid BST: every left subtree holds strictly smaller keys, every right subtree strictly larger keys, and both subtrees are BSTs.',
    intuition: "Comparing a node only with its children isn't enough: a node deep in the left subtree must also be smaller than every ancestor it sits to the left of. So pass an allowed (low, high) range down the tree. Going left tightens high to node.val, going right tightens low to node.val. Use long bounds so that Integer.MIN/MAX values in the tree are still handled.",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class ValidateBST {
${TREE}

    public static boolean isValidBST(TreeNode root) {
        return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private static boolean check(TreeNode n, long low, long high) {
        if (n == null) return true;
        if (n.val <= low || n.val >= high) return false;
        return check(n.left, low, n.val) && check(n.right, n.val, high);
    }

    public static void main(String[] args) {
        System.out.println(isValidBST(build(5, 3, 6, 2, 4, null, 7)));      // true
        System.out.println(isValidBST(build(5, 1, 4, null, null, 3, 6)));   // false
        System.out.println(isValidBST(build(5, 4, 6, null, null, 3, 7)));   // false
    }
}`,
  },

  'construct-a-bst-from-a-preorder-traversal': {
    difficulty: 'Medium',
    statement: 'Given the preorder traversal of a BST (distinct values), build the tree and return its root.',
    intuition: "Read the preorder values one at a time, and pass each recursive call an upper bound. The next value belongs in the current subtree only if it is below that bound. For each node, build its left subtree with bound = node.val, then its right subtree with the parent's bound. Every value is used exactly once, so this is O(n) without sorting or searching.",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class BSTFromPreorder {
${TREE}

${SHOW}

    private static int i;

    public static TreeNode bstFromPreorder(int[] pre) {
        i = 0;
        return build(pre, Integer.MAX_VALUE);
    }
    private static TreeNode build(int[] pre, int bound) {
        if (i == pre.length || pre[i] > bound) return null;
        TreeNode root = new TreeNode(pre[i++]);
        root.left  = build(pre, root.val);
        root.right = build(pre, bound);
        return root;
    }

    public static void main(String[] args) {
        System.out.println(show(bstFromPreorder(new int[]{8, 5, 1, 7, 10, 12}))); // [8, 5, 10, 1, 7, null, 12]
        System.out.println(show(bstFromPreorder(new int[]{1, 3})));               // [1, null, 3]
    }
}`,
  },

  'two-sum-in-bst': {
    difficulty: 'Easy',
    statement: 'Given the root of a BST and an integer k, return true if two different nodes have values that add up to k.',
    intuition: "This is two-pointer Two Sum on a sorted array, except the sorted order comes from the BST. Keep two iterators: one gives values in ascending inorder (the left pointer) and one in descending order (the right pointer), each backed by a stack of height h. If the sum is too small, advance the left one. If too big, advance the right one. Stop when they meet.",
    time: 'O(n)',
    space: 'O(h) — two stacks',
    code: `import java.util.*;

public class TwoSumBST {
${TREE}

    static class BSTIterator {
        private final Deque<TreeNode> st = new ArrayDeque<>();
        private final boolean reverse;
        BSTIterator(TreeNode root, boolean reverse) { this.reverse = reverse; pushAll(root); }
        int next() {
            TreeNode n = st.pop();
            pushAll(reverse ? n.left : n.right);
            return n.val;
        }
        private void pushAll(TreeNode n) {
            for (; n != null; n = reverse ? n.right : n.left) st.push(n);
        }
    }

    public static boolean findTarget(TreeNode root, int k) {
        if (root == null) return false;
        BSTIterator lo = new BSTIterator(root, false), hi = new BSTIterator(root, true);
        int i = lo.next(), j = hi.next();
        while (i < j) {
            if (i + j == k) return true;
            if (i + j < k) i = lo.next();
            else j = hi.next();
        }
        return false;
    }

    public static void main(String[] args) {
        TreeNode root = build(5, 3, 6, 2, 4, null, 7);
        System.out.println(findTarget(root, 9));  // true
        System.out.println(findTarget(root, 28)); // false
        System.out.println(findTarget(root, 10)); // true
    }
}`,
  },

  'correct-bst-with-two-nodes-swapped': {
    difficulty: 'Medium',
    statement: 'Exactly two nodes of a BST had their values swapped by mistake. Recover the tree without changing its structure.',
    intuition: "The inorder sequence of a BST is sorted. Swapping two values creates one 'drop' (prev > cur) if they were adjacent in the sequence, or two drops if not. During inorder, the first drop's prev is the first wrong node, and the last drop's cur is the second. Swap their values. With Morris traversal this runs in O(1) space. The recursive version is shown here for clarity.",
    time: 'O(n)',
    space: 'O(h) — recursion (O(1) with Morris)',
    code: `import java.util.*;

public class RecoverBST {
${TREE}

${SHOW}

    private static TreeNode first, second, prev;

    public static void recoverTree(TreeNode root) {
        first = second = prev = null;
        inorder(root);
        int t = first.val; first.val = second.val; second.val = t;
    }
    private static void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        if (prev != null && prev.val > n.val) {
            if (first == null) first = prev;
            second = n;
        }
        prev = n;
        inorder(n.right);
    }

    public static void main(String[] args) {
        TreeNode a = build(1, 3, null, null, 2);
        recoverTree(a);
        System.out.println(show(a)); // [3, 1, null, null, 2]
        TreeNode b = build(3, 1, 4, null, null, 2);
        recoverTree(b);
        System.out.println(show(b)); // [2, 1, 4, null, null, 3]
    }
}`,
  },

  'largest-bst-in-binary-tree': {
    difficulty: 'Medium',
    statement: 'Given a binary tree, return the number of nodes in its largest subtree that is also a valid BST.',
    intuition: "Work bottom-up so each subtree is checked once. A post-order DFS returns {min, max, size} for each subtree. A null subtree returns min = +∞, max = −∞, size 0, which fits any parent. A node forms a BST if left.max < node.val < right.min. Then it returns the combined min and max and size = left + right + 1. Otherwise it returns an impossible range (−∞, +∞) so no ancestor can be a BST, and passes up the larger child size.",
    time: 'O(n)',
    space: 'O(h)',
    code: `import java.util.*;

public class LargestBSTSubtree {
${TREE}

    public static int largestBst(TreeNode root) {
        return dfs(root)[2];
    }
    // returns {min, max, size}; size = best BST size found in this subtree
    private static int[] dfs(TreeNode n) {
        if (n == null) return new int[]{Integer.MAX_VALUE, Integer.MIN_VALUE, 0};
        int[] l = dfs(n.left), r = dfs(n.right);
        if (l[1] < n.val && n.val < r[0])
            return new int[]{Math.min(l[0], n.val), Math.max(r[1], n.val), l[2] + r[2] + 1};
        return new int[]{Integer.MIN_VALUE, Integer.MAX_VALUE, Math.max(l[2], r[2])};
    }

    public static void main(String[] args) {
        System.out.println(largestBst(build(2, 1, 3)));                 // 3
        System.out.println(largestBst(build(10, 5, 15, 1, 8, null, 7))); // 3
        System.out.println(largestBst(build(5, 2, 4, 1, 3)));           // 3
    }
}`,
  },
};
