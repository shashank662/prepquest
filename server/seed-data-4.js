export const batch4 = [
  // ─── Tree (16) ──────────────────────────────────────────────────────────────
  {
    topic: 'Tree',
    title: 'Inorder Traversal (Iterative)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/inorder-tree-traversal-without-recursion/',
    statement: 'Given the root of a binary tree, return its inorder traversal (left, root, right) iteratively without recursion. Constraints: 0 <= N <= 10^5.',
    intuition: 'Use an explicit stack. Push nodes while going left. When you can\'t go further left, pop a node, record it, then move to its right child. This exactly simulates the recursive call stack: push = recursive call, pop = return from left subtree, right = recursive call on right.',
    time_complexity: 'O(N) — each node pushed and popped once.',
    space_complexity: 'O(H) — stack depth equals tree height; O(N) worst for skewed.',
    code: `import java.util.*;

public class InorderIterative {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static List<Integer> inorder(Node root) {
        List<Integer> result = new ArrayList<>();
        Deque<Node> stack = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            result.add(cur.val);
            cur = cur.right;
        }
        return result;
    }

    public static void main(String[] args) {
        //     1
        //      \
        //       2
        //      /
        //     3
        Node root = new Node(1); root.right = new Node(2); root.right.left = new Node(3);
        System.out.println(inorder(root)); // [1, 3, 2]

        //     4
        //    / \
        //   2   5
        //  / \
        // 1   3
        Node r2 = new Node(4);
        r2.left = new Node(2); r2.right = new Node(5);
        r2.left.left = new Node(1); r2.left.right = new Node(3);
        System.out.println(inorder(r2)); // [1, 2, 3, 4, 5]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Height of Binary Tree',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/',
    statement: 'Given the root of a binary tree, find its height (number of edges on the longest path from root to a leaf). Return 0 for a single node, -1 for null. Constraints: 0 <= N <= 10^5.',
    intuition: 'Recursively compute the height of left and right subtrees. The height of the current node is 1 + max(leftHeight, rightHeight). Base case: null returns -1 (so a leaf = max(-1,-1)+1 = 0).',
    time_complexity: 'O(N) — visits every node exactly once.',
    space_complexity: 'O(H) — recursion stack; O(N) for skewed trees.',
    code: `public class HeightBinaryTree {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static int height(Node root) {
        if (root == null) return -1;
        return 1 + Math.max(height(root.left), height(root.right));
    }

    public static void main(String[] args) {
        //     1
        //    / \
        //   2   3
        //  /
        // 4
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        root.left.left = new Node(4);
        System.out.println(height(root));        // 2
        System.out.println(height(new Node(1))); // 0
        System.out.println(height(null));        // -1

        // Skewed tree: 1 -> 2 -> 3 -> 4 -> 5
        Node s = new Node(1); s.right = new Node(2); s.right.right = new Node(3);
        s.right.right.right = new Node(4); s.right.right.right.right = new Node(5);
        System.out.println(height(s)); // 4
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Level Order Traversal (BFS)',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/level-order-tree-traversal/',
    statement: 'Given the root of a binary tree, return its level-order traversal as a list of lists (each inner list contains nodes at one level). Constraints: 0 <= N <= 10^5.',
    intuition: 'BFS using a queue. At each BFS layer, record the current queue size (number of nodes at this level). Process exactly that many nodes, adding their non-null children to the queue. Collect each level\'s values into its own list.',
    time_complexity: 'O(N) — each node enqueued and dequeued once.',
    space_complexity: 'O(W) — width of the widest level (max nodes in queue at once).',
    code: `import java.util.*;

public class LevelOrderTraversal {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }

    public static void main(String[] args) {
        //     3
        //    / \
        //   9  20
        //     /  \
        //    15   7
        Node root = new Node(3);
        root.left = new Node(9); root.right = new Node(20);
        root.right.left = new Node(15); root.right.right = new Node(7);
        System.out.println(levelOrder(root)); // [[3], [9, 20], [15, 7]]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Check if Binary Tree is BST',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/a-program-to-check-if-a-binary-tree-is-bst-or-not/',
    statement: 'Given the root of a binary tree, determine whether it is a valid Binary Search Tree. A BST requires every node\'s value to be > all values in its left subtree and < all values in its right subtree. Constraints: 0 <= N <= 10^5.',
    intuition: 'Pass a valid range [min, max] to each recursive call. The root can be anything. Going left, the max becomes the current node\'s value (all left values must be smaller). Going right, the min becomes current. If any node\'s value falls outside its range, it\'s invalid.',
    time_complexity: 'O(N) — each node visited once.',
    space_complexity: 'O(H) — recursion stack.',
    code: `public class ValidBST {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static boolean isValidBST(Node root, long min, long max) {
        if (root == null) return true;
        if (root.val <= min || root.val >= max) return false;
        return isValidBST(root.left, min, root.val)
            && isValidBST(root.right, root.val, max);
    }

    static boolean isBST(Node root) {
        return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    public static void main(String[] args) {
        //   2
        //  / \
        // 1   3
        Node valid = new Node(2); valid.left = new Node(1); valid.right = new Node(3);
        System.out.println(isBST(valid)); // true

        //   5
        //  / \
        // 1   4
        //    / \
        //   3   6
        Node invalid = new Node(5); invalid.left = new Node(1); invalid.right = new Node(4);
        invalid.right.left = new Node(3); invalid.right.right = new Node(6);
        System.out.println(isBST(invalid)); // false (4 < 5 but is right child)
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Lowest Common Ancestor in Binary Tree',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/',
    statement: 'Given the root of a binary tree and two nodes p and q, find their Lowest Common Ancestor (LCA). The LCA is the deepest node that has both p and q as descendants (a node is a descendant of itself). Constraints: both p and q exist in the tree.',
    intuition: 'Recursively search left and right. If current node is p or q, return it. After recursing, if both sides return non-null, current node is the LCA. If only one side returns non-null, that result propagates up (either one of the targets or an LCA found deeper). If null is returned, neither p nor q is in that subtree.',
    time_complexity: 'O(N) — visits every node.',
    space_complexity: 'O(H) — recursion depth.',
    code: `public class LowestCommonAncestor {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static Node lca(Node root, Node p, Node q) {
        if (root == null || root == p || root == q) return root;
        Node left = lca(root.left, p, q);
        Node right = lca(root.right, p, q);
        if (left != null && right != null) return root;
        return (left != null) ? left : right;
    }

    public static void main(String[] args) {
        //         3
        //        / \
        //       5   1
        //      / \ / \
        //     6  2 0  8
        //       / \
        //      7   4
        Node root = new Node(3);
        Node n5 = new Node(5); Node n1 = new Node(1);
        root.left = n5; root.right = n1;
        Node n6 = new Node(6); Node n2 = new Node(2);
        n5.left = n6; n5.right = n2;
        n1.left = new Node(0); n1.right = new Node(8);
        Node n7 = new Node(7); Node n4 = new Node(4);
        n2.left = n7; n2.right = n4;

        System.out.println(lca(root, n5, n1).val); // 3
        System.out.println(lca(root, n5, n4).val); // 5
        System.out.println(lca(root, n6, n4).val); // 5
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/find-maximum-path-sum-in-a-binary-tree/',
    statement: 'Given a binary tree, find the maximum path sum. A path is any sequence of nodes where each pair of adjacent nodes has an edge. The path does not need to pass through the root. Node values can be negative. Constraints: 1 <= N <= 3*10^4.',
    intuition: 'For each node, compute the best single-branch gain (max of 0, left gain, right gain). The path through this node has value node.val + leftGain + rightGain — update the global max. Return node.val + max(leftGain, rightGain) to the parent (a path can only extend in one direction upward).',
    time_complexity: 'O(N) — single post-order traversal.',
    space_complexity: 'O(H) — recursion depth.',
    code: `public class MaxPathSum {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static int maxSum;

    static int dfs(Node node) {
        if (node == null) return 0;
        int leftGain = Math.max(0, dfs(node.left));
        int rightGain = Math.max(0, dfs(node.right));
        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
    }

    static int maxPathSum(Node root) {
        maxSum = Integer.MIN_VALUE;
        dfs(root);
        return maxSum;
    }

    public static void main(String[] args) {
        //   1
        //  / \
        // 2   3
        Node r1 = new Node(1); r1.left = new Node(2); r1.right = new Node(3);
        System.out.println(maxPathSum(r1)); // 6

        //     -10
        //     / \
        //    9  20
        //       / \
        //      15   7
        Node r2 = new Node(-10); r2.left = new Node(9); r2.right = new Node(20);
        r2.right.left = new Node(15); r2.right.right = new Node(7);
        System.out.println(maxPathSum(r2)); // 42 (15 + 20 + 7)

        System.out.println(maxPathSum(new Node(-3))); // -3
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/diameter-of-a-binary-tree/',
    statement: 'Given the root of a binary tree, return the length of the diameter — the longest path between any two nodes. The path may or may not pass through the root. Length is the number of edges. Constraints: 1 <= N <= 10^4.',
    intuition: 'At each node, the diameter through it = height(left) + height(right) + 2. Compute heights post-order and track the running maximum diameter. Return height + 1 to the parent. This avoids recomputing heights separately.',
    time_complexity: 'O(N) — single traversal.',
    space_complexity: 'O(H) — recursion stack.',
    code: `public class DiameterBinaryTree {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static int maxDiameter;

    static int height(Node node) {
        if (node == null) return -1;
        int lh = height(node.left);
        int rh = height(node.right);
        maxDiameter = Math.max(maxDiameter, lh + rh + 2);
        return 1 + Math.max(lh, rh);
    }

    static int diameter(Node root) {
        maxDiameter = 0;
        height(root);
        return maxDiameter;
    }

    public static void main(String[] args) {
        //     1
        //    / \
        //   2   3
        //  / \
        // 4   5
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        root.left.left = new Node(4); root.left.right = new Node(5);
        System.out.println(diameter(root)); // 3 (4->2->5 or 4->2->1->3)

        Node r2 = new Node(1); r2.left = new Node(2);
        System.out.println(diameter(r2)); // 1
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/',
    statement: 'Design an algorithm to serialize a binary tree to a string and deserialize it back to the original tree structure. Choose any format. Constraints: 0 <= N <= 10^4; values fit in int.',
    intuition: 'BFS serialize: output node values level by level, using "null" for absent children. This preserves parent-child relationships by index. Deserialize: BFS again — for each node dequeued, assign the next two values from the serialized array as left and right children.',
    time_complexity: 'O(N) serialize and deserialize.',
    space_complexity: 'O(N) — string and queue.',
    code: `import java.util.*;

public class SerializeDeserialize {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static String serialize(Node root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            Node n = q.poll();
            if (n == null) { sb.append("null,"); }
            else { sb.append(n.val).append(","); q.offer(n.left); q.offer(n.right); }
        }
        return sb.toString();
    }

    static Node deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        String[] vals = data.split(",");
        Node root = new Node(Integer.parseInt(vals[0]));
        Queue<Node> q = new LinkedList<>();
        q.offer(root);
        int i = 1;
        while (!q.isEmpty() && i < vals.length) {
            Node n = q.poll();
            if (!vals[i].equals("null")) { n.left = new Node(Integer.parseInt(vals[i])); q.offer(n.left); }
            i++;
            if (i < vals.length && !vals[i].equals("null")) { n.right = new Node(Integer.parseInt(vals[i])); q.offer(n.right); }
            i++;
        }
        return root;
    }

    static List<Integer> inorder(Node root) {
        List<Integer> res = new ArrayList<>();
        Deque<Node> st = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop(); res.add(cur.val); cur = cur.right;
        }
        return res;
    }

    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        root.right.left = new Node(4); root.right.right = new Node(5);
        String s = serialize(root);
        System.out.println(s);
        Node restored = deserialize(s);
        System.out.println(inorder(restored)); // [2, 1, 4, 3, 5]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/find-k-th-smallest-element-in-bst-order-statistics-in-bst/',
    statement: 'Given the root of a BST and integer K, return the Kth smallest element (1-indexed). Constraints: 1 <= K <= N <= 10^4.',
    intuition: 'Inorder traversal of a BST yields values in ascending order. Perform iterative inorder and count nodes visited; return when the count reaches K. Stop early without fully traversing the tree.',
    time_complexity: 'O(H + K) — traverse H levels to leftmost, then K more.',
    space_complexity: 'O(H) — stack depth.',
    code: `import java.util.Deque;
import java.util.ArrayDeque;

public class KthSmallestBST {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static int kthSmallest(Node root, int k) {
        Deque<Node> stack = new ArrayDeque<>();
        Node cur = root;
        int count = 0;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            if (++count == k) return cur.val;
            cur = cur.right;
        }
        throw new IllegalArgumentException("k exceeds tree size");
    }

    public static void main(String[] args) {
        //     3
        //    / \
        //   1   4
        //    \
        //     2
        Node root = new Node(3); root.left = new Node(1); root.right = new Node(4);
        root.left.right = new Node(2);
        System.out.println(kthSmallest(root, 1)); // 1
        System.out.println(kthSmallest(root, 2)); // 2
        System.out.println(kthSmallest(root, 3)); // 3
        System.out.println(kthSmallest(root, 4)); // 4
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Vertical Order Traversal',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/print-binary-tree-vertical-order/',
    statement: 'Given the root of a binary tree, return its vertical order traversal as a list of lists. Nodes in the same column are grouped together, columns from left to right. Within the same column and row, sort by value. Constraints: 0 <= N <= 1000.',
    intuition: 'BFS with coordinates: root is (0, 0). Left child is (col-1, row+1), right child is (col+1, row+1). Store (row, value) per column. After traversal, sort columns by key and within each column sort by (row, value). This handles ties correctly.',
    time_complexity: 'O(N log N) — sorting nodes.',
    space_complexity: 'O(N) — map and queue.',
    code: `import java.util.*;

public class VerticalOrderTraversal {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static List<List<Integer>> verticalOrder(Node root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        TreeMap<Integer, List<int[]>> map = new TreeMap<>(); // col -> [(row, val)]
        Queue<int[]> queue = new LinkedList<>(); // {node-index (use a trick), col, row}
        // Use wrapper objects for queue
        Queue<Object[]> q = new LinkedList<>();
        q.offer(new Object[]{root, 0, 0});
        while (!q.isEmpty()) {
            Object[] entry = q.poll();
            Node node = (Node) entry[0];
            int col = (int) entry[1], row = (int) entry[2];
            map.computeIfAbsent(col, k -> new ArrayList<>()).add(new int[]{row, node.val});
            if (node.left != null) q.offer(new Object[]{node.left, col-1, row+1});
            if (node.right != null) q.offer(new Object[]{node.right, col+1, row+1});
        }
        for (List<int[]> col : map.values()) {
            col.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
            List<Integer> vals = new ArrayList<>();
            for (int[] pair : col) vals.add(pair[1]);
            result.add(vals);
        }
        return result;
    }

    public static void main(String[] args) {
        //     3
        //    / \
        //   9  20
        //      / \
        //     15   7
        Node root = new Node(3); root.left = new Node(9); root.right = new Node(20);
        root.right.left = new Node(15); root.right.right = new Node(7);
        System.out.println(verticalOrder(root)); // [[9], [3, 15], [20], [7]]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Mirror Tree / Symmetric Tree',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/symmetric-tree-tree-which-is-mirror-image-of-itself/',
    statement: 'Given the root of a binary tree, check if it is symmetric (a mirror image of itself around its center). Constraints: 1 <= N <= 10^3.',
    intuition: 'Two subtrees are mirrors if: their roots have equal values, and one\'s left subtree is a mirror of the other\'s right, and vice versa. Recursively compare pairs. Use a helper that takes two nodes and checks this mirror condition.',
    time_complexity: 'O(N) — each node visited once.',
    space_complexity: 'O(H) — recursion depth.',
    code: `public class SymmetricTree {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static boolean isMirror(Node l, Node r) {
        if (l == null && r == null) return true;
        if (l == null || r == null) return false;
        return l.val == r.val
            && isMirror(l.left, r.right)
            && isMirror(l.right, r.left);
    }

    static boolean isSymmetric(Node root) {
        return root == null || isMirror(root.left, root.right);
    }

    public static void main(String[] args) {
        //     1
        //    / \
        //   2   2
        //  / \ / \
        // 3  4 4  3
        Node sym = new Node(1);
        sym.left = new Node(2); sym.right = new Node(2);
        sym.left.left = new Node(3); sym.left.right = new Node(4);
        sym.right.left = new Node(4); sym.right.right = new Node(3);
        System.out.println(isSymmetric(sym)); // true

        //   1
        //  / \
        // 2   2
        //  \   \
        //   3   3
        Node asym = new Node(1);
        asym.left = new Node(2); asym.right = new Node(2);
        asym.left.right = new Node(3); asym.right.right = new Node(3);
        System.out.println(isSymmetric(asym)); // false
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Boundary Traversal of Binary Tree',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/boundary-traversal-of-binary-tree/',
    statement: 'Given a binary tree, print its boundary nodes anticlockwise starting from the root: left boundary (top to bottom), all leaves (left to right), right boundary (bottom to top). Don\'t print duplicate leaves. Constraints: 1 <= N <= 10^4.',
    intuition: 'Break into three parts: (1) left boundary excluding leaves — go left preferring left child, (2) all leaf nodes via DFS/BFS, (3) right boundary excluding leaves in reverse — go right preferring right child and collect then reverse. Concatenate all three.',
    time_complexity: 'O(N) — each node visited once or twice.',
    space_complexity: 'O(H) — recursion and output lists.',
    code: `import java.util.*;

public class BoundaryTraversal {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static boolean isLeaf(Node n) { return n.left == null && n.right == null; }

    static void addLeftBoundary(Node root, List<Integer> res) {
        Node cur = root.left;
        while (cur != null) {
            if (!isLeaf(cur)) res.add(cur.val);
            cur = (cur.left != null) ? cur.left : cur.right;
        }
    }

    static void addLeaves(Node root, List<Integer> res) {
        if (root == null) return;
        if (isLeaf(root)) { res.add(root.val); return; }
        addLeaves(root.left, res);
        addLeaves(root.right, res);
    }

    static void addRightBoundary(Node root, List<Integer> res) {
        Node cur = root.right;
        List<Integer> tmp = new ArrayList<>();
        while (cur != null) {
            if (!isLeaf(cur)) tmp.add(cur.val);
            cur = (cur.right != null) ? cur.right : cur.left;
        }
        Collections.reverse(tmp);
        res.addAll(tmp);
    }

    static List<Integer> boundary(Node root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        res.add(root.val);
        addLeftBoundary(root, res);
        addLeaves(root, res);
        addRightBoundary(root, res);
        return res;
    }

    public static void main(String[] args) {
        //         1
        //        / \
        //       2   3
        //      / \   \
        //     4   5   6
        //            / \
        //           7   8
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        root.left.left = new Node(4); root.left.right = new Node(5);
        root.right.right = new Node(6);
        root.right.right.left = new Node(7); root.right.right.right = new Node(8);
        System.out.println(boundary(root)); // [1, 2, 4, 5, 7, 8, 6, 3]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Connect Nodes at Same Level',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/connect-nodes-at-same-level/',
    statement: 'Given a binary tree where each node has an extra "next" pointer, populate each next pointer to point to the next right node in the same level. If there is no next right node, set it to null. Do this in O(1) extra space (excluding recursion). Constraints: 0 <= N <= 6000.',
    intuition: 'Use already-established next pointers to traverse the current level without a queue. Maintain a dummy head for the next level. For each node in the current level, connect its children via the dummy chain. Then advance to the next level using dummy.next.',
    time_complexity: 'O(N) — each node visited once.',
    space_complexity: 'O(1) extra (level links replace the queue).',
    code: `public class ConnectSameLevel {
    static class Node {
        int val; Node left, right, next;
        Node(int v) { val = v; }
    }

    static void connect(Node root) {
        Node levelStart = root;
        while (levelStart != null) {
            Node dummy = new Node(0), cur = dummy;
            for (Node n = levelStart; n != null; n = n.next) {
                if (n.left != null) { cur.next = n.left; cur = cur.next; }
                if (n.right != null) { cur.next = n.right; cur = cur.next; }
            }
            levelStart = dummy.next;
        }
    }

    static String levelStr(Node root) {
        StringBuilder sb = new StringBuilder();
        Node levelStart = root;
        while (levelStart != null) {
            Node n = levelStart;
            while (n != null) { sb.append(n.val).append(n.next != null ? "->":"->null"); n = n.next; }
            sb.append(" | ");
            // go to next level via first child
            if (levelStart.left != null) levelStart = levelStart.left;
            else if (levelStart.right != null) levelStart = levelStart.right;
            else break;
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        root.left.left = new Node(4); root.left.right = new Node(5);
        root.right.left = new Node(6); root.right.right = new Node(7);
        connect(root);
        System.out.println(levelStr(root));
        // 1->null | 2->3->null | 4->5->6->7->null
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Construct Binary Tree from Inorder and Preorder',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/construct-tree-from-given-inorder-and-preorder-traversal/',
    statement: 'Given inorder and preorder traversal arrays of a binary tree, reconstruct the original tree. Constraints: 1 <= N <= 3*10^4; all values unique.',
    intuition: 'The first element of preorder is always the root. Find its position in inorder: elements to the left are the left subtree, to the right are the right subtree. Recurse with the corresponding slices of preorder and inorder. Use a HashMap for O(1) inorder index lookups.',
    time_complexity: 'O(N) — each node constructed once; HashMap lookup is O(1).',
    space_complexity: 'O(N) — HashMap plus recursion stack.',
    code: `import java.util.HashMap;
import java.util.Map;

public class ConstructFromTraversals {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static int preIdx;
    static Map<Integer, Integer> inMap;

    static Node build(int[] preorder, int inStart, int inEnd) {
        if (inStart > inEnd) return null;
        int rootVal = preorder[preIdx++];
        Node root = new Node(rootVal);
        int inIdx = inMap.get(rootVal);
        root.left = build(preorder, inStart, inIdx - 1);
        root.right = build(preorder, inIdx + 1, inEnd);
        return root;
    }

    static Node buildTree(int[] preorder, int[] inorder) {
        preIdx = 0;
        inMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }

    static void inorderPrint(Node root) {
        if (root == null) return;
        inorderPrint(root.left);
        System.out.print(root.val + " ");
        inorderPrint(root.right);
    }

    public static void main(String[] args) {
        int[] pre = {3,9,20,15,7}, in = {9,3,15,20,7};
        Node root = buildTree(pre, in);
        inorderPrint(root); System.out.println(); // 9 3 15 20 7

        int[] pre2 = {1,2}, in2 = {2,1};
        Node root2 = buildTree(pre2, in2);
        inorderPrint(root2); System.out.println(); // 2 1
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Zigzag Level Order Traversal',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/zigzag-tree-traversal/',
    statement: 'Given the root of a binary tree, return its zigzag level-order traversal: first level left to right, second level right to left, alternating. Each level\'s values in one inner list. Constraints: 0 <= N <= 2000.',
    intuition: 'BFS level by level (standard level-order). After collecting each level\'s values, alternate the direction by toggling a boolean flag. When the flag says "reverse", call Collections.reverse() on that level\'s list before adding to results. This keeps the BFS simple while varying output order.',
    time_complexity: 'O(N) — each node enqueued and dequeued once.',
    space_complexity: 'O(W) — queue holds at most one full level (max width W).',
    code: `import java.util.*;

public class ZigzagTraversal {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static List<List<Integer>> zigzag(Node root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        boolean leftToRight = true;
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                level.add(node.val);
                if (node.left  != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            if (!leftToRight) Collections.reverse(level);
            result.add(level);
            leftToRight = !leftToRight;
        }
        return result;
    }

    public static void main(String[] args) {
        //     3
        //    / \\
        //   9  20
        //      / \\
        //     15   7
        Node root = new Node(3);
        root.left = new Node(9); root.right = new Node(20);
        root.right.left = new Node(15); root.right.right = new Node(7);
        System.out.println(zigzag(root)); // [[3], [20, 9], [15, 7]]

        Node single = new Node(1);
        System.out.println(zigzag(single)); // [[1]]
    }
}`
  },
  {
    topic: 'Tree',
    title: 'Flatten Binary Tree to Linked List',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/flatten-a-binary-tree-into-linked-list/',
    statement: 'Given the root of a binary tree, flatten it in-place into a linked list in preorder (using right pointers, left pointers set to null). Constraints: 0 <= N <= 2000.',
    intuition: 'Process in reverse postorder (right, left, root). Keep a "prev" pointer initialized to null. For each node, set node.right = prev, node.left = null, then prev = node. When we process root last, root.right points to the start of the right subtree which correctly follows it in preorder.',
    time_complexity: 'O(N) — each node visited once.',
    space_complexity: 'O(H) — recursion stack.',
    code: `public class FlattenBSTToList {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static Node prev;

    static void flatten(Node root) {
        if (root == null) return;
        flatten(root.right);
        flatten(root.left);
        root.right = prev;
        root.left = null;
        prev = root;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.right != null) sb.append(", "); h = h.right; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        //     1
        //    / \
        //   2   5
        //  / \   \
        // 3   4   6
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(5);
        root.left.left = new Node(3); root.left.right = new Node(4);
        root.right.right = new Node(6);
        prev = null;
        flatten(root);
        System.out.println(str(root)); // [1, 2, 3, 4, 5, 6]
    }
}`
  }
];
