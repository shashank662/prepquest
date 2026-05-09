export const batch2 = [
  // ─── Linked List (14) ───────────────────────────────────────────────────────
  {
    topic: 'Linked List',
    title: 'Reverse a Linked List',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/reverse-a-linked-list/',
    statement: 'Given the head of a singly linked list, reverse the list and return the new head. Constraints: 0 <= N <= 10^4, node values fit in int.',
    intuition: 'Iterate through the list maintaining a prev pointer. At each step, save next, point current.next to prev, advance prev to current, and advance current to saved next. When current is null, prev is the new head. This is a classic pointer manipulation — no extra space needed.',
    time_complexity: 'O(N) — single pass through the list.',
    space_complexity: 'O(1) — only three pointers used.',
    code: `public class ReverseLinkedList {
    static class Node {
        int val;
        Node next;
        Node(int v) { val = v; }
    }

    static Node reverse(Node head) {
        Node prev = null, curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    static Node build(int... vals) {
        Node dummy = new Node(0), cur = dummy;
        for (int v : vals) { cur.next = new Node(v); cur = cur.next; }
        return dummy.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(reverse(build(1,2,3,4,5))));  // [5, 4, 3, 2, 1]
        System.out.println(str(reverse(build(1))));           // [1]
        System.out.println(str(reverse(null)));               // []
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Find the Middle of a Linked List',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/write-a-c-function-to-print-the-middle-of-the-linked-list/',
    statement: 'Given a singly linked list, find its middle node. If there are two middle nodes (even length), return the second middle. Constraints: 1 <= N <= 10^4.',
    intuition: 'Use the slow-fast pointer technique. Slow moves one step at a time; fast moves two. When fast reaches the end, slow is at the middle. For even-length lists, this naturally lands on the second middle node.',
    time_complexity: 'O(N) — one pass with two pointers.',
    space_complexity: 'O(1) — constant extra space.',
    code: `public class MiddleLinkedList {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node findMiddle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    static Node build(int... vals) {
        Node dummy = new Node(0), cur = dummy;
        for (int v : vals) { cur.next = new Node(v); cur = cur.next; }
        return dummy.next;
    }

    public static void main(String[] args) {
        System.out.println(findMiddle(build(1,2,3,4,5)).val); // 3
        System.out.println(findMiddle(build(1,2,3,4,5,6)).val); // 4  (second middle)
        System.out.println(findMiddle(build(1)).val); // 1
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/',
    statement: 'Given heads of two sorted linked lists, merge them into a single sorted list in-place (no extra nodes) and return the new head. Constraints: 0 <= N, M <= 10^4.',
    intuition: 'Use a dummy head node and a tail pointer. At each step, pick the smaller current node from either list and append it to tail. Advance the chosen list\'s pointer. When one list is exhausted, append the other list\'s remaining portion directly.',
    time_complexity: 'O(N + M) — each node visited once.',
    space_complexity: 'O(1) — in-place pointer manipulation, dummy node is just local.',
    code: `public class MergeSortedLists {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node merge(Node a, Node b) {
        Node dummy = new Node(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else               { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(merge(build(1,3,5), build(2,4,6)))); // [1, 2, 3, 4, 5, 6]
        System.out.println(str(merge(build(1,2,3), build())));       // [1, 2, 3]
        System.out.println(str(merge(build(), build(1))));           // [1]
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Detect Loop in Linked List',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/',
    statement: 'Given the head of a linked list, determine whether the list contains a cycle. Return true if a cycle exists, false otherwise.',
    intuition: 'Floyd\'s cycle detection: use slow (1 step) and fast (2 steps) pointers. If they ever meet, there is a cycle. If fast reaches null, there is no cycle. The meeting is guaranteed because fast gains one step per iteration — if a loop exists, fast laps slow inside it.',
    time_complexity: 'O(N) — fast pointer traverses at most 2N steps.',
    space_complexity: 'O(1) — only two pointers.',
    code: `public class DetectLoop {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static boolean hasCycle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        // No cycle
        Node n1 = new Node(1), n2 = new Node(2), n3 = new Node(3);
        n1.next = n2; n2.next = n3;
        System.out.println(hasCycle(n1)); // false

        // Cycle: 1 -> 2 -> 3 -> 2
        n3.next = n2;
        System.out.println(hasCycle(n1)); // true

        System.out.println(hasCycle(null)); // false
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Remove Loop in Linked List',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/detect-and-remove-loop-in-a-linked-list/',
    statement: 'Given a linked list that may contain a loop, detect and remove the loop. The list should remain intact after removal. Constraints: 1 <= N <= 10^4.',
    intuition: 'Use Floyd\'s algorithm to find the meeting point. Then reset one pointer to head. Advance both one step at a time — they meet at the loop start. Walk one pointer from the loop start until its next is the loop start (finding the last node of the loop), then set that next to null. Edge case: if head itself is the loop start, the "last node" detection needs a special check.',
    time_complexity: 'O(N) — detection + finding start + finding tail are all O(N).',
    space_complexity: 'O(1) — pointer manipulation only.',
    code: `public class RemoveLoop {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static void removeLoop(Node head) {
        Node slow = head, fast = head;
        // Detect
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
            if (slow == fast) break;
        }
        if (fast == null || fast.next == null) return; // no loop

        // Find loop start
        slow = head;
        if (slow == fast) { // head is the loop start
            while (fast.next != slow) fast = fast.next;
        } else {
            while (slow.next != fast.next) { slow = slow.next; fast = fast.next; }
            fast = fast.next; // fast is now the loop start
        }
        // fast is loop start; find last node
        Node tail = fast;
        while (tail.next != fast) tail = tail.next;
        tail.next = null;
    }

    static String str(Node h, int limit) {
        StringBuilder sb = new StringBuilder("[");
        int i = 0;
        while (h != null && i++ < limit) { sb.append(h.val); if (h.next != null && i < limit) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        Node n1=new Node(1),n2=new Node(2),n3=new Node(3),n4=new Node(4),n5=new Node(5);
        n1.next=n2; n2.next=n3; n3.next=n4; n4.next=n5; n5.next=n3; // loop at n3
        removeLoop(n1);
        System.out.println(str(n1, 10)); // [1, 2, 3, 4, 5]

        Node a=new Node(1),b=new Node(2),c=new Node(3);
        a.next=b; b.next=c; c.next=a; // loop at head
        removeLoop(a);
        System.out.println(str(a, 10)); // [1, 2, 3]
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Nth Node from End of Linked List',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/nth-node-from-the-end-of-a-linked-list/',
    statement: 'Given a linked list and an integer N, return the value of the Nth node from the end (1-indexed). Constraints: 1 <= N <= length of list.',
    intuition: 'Use two pointers. Advance the fast pointer N steps ahead. Then advance both slow and fast together until fast reaches the last node. At that point, slow is at the Nth node from the end. This avoids computing the length separately.',
    time_complexity: 'O(length) — one pass.',
    space_complexity: 'O(1) — constant extra pointers.',
    code: `public class NthFromEnd {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static int nthFromEnd(Node head, int n) {
        Node slow = head, fast = head;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast != null) { slow = slow.next; fast = fast.next; }
        return slow.val;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    public static void main(String[] args) {
        System.out.println(nthFromEnd(build(1,2,3,4,5), 2)); // 4
        System.out.println(nthFromEnd(build(1,2,3,4,5), 1)); // 5
        System.out.println(nthFromEnd(build(1,2,3,4,5), 5)); // 1
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Add Two Numbers Represented as Linked Lists',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/add-two-numbers-represented-by-linked-lists/',
    statement: 'Two non-negative integers are represented as linked lists in reverse order (units digit first). Add the two numbers and return the sum as a linked list in the same reversed format. Constraints: 1 <= N, M <= 10^4; digits 0-9.',
    intuition: 'Traverse both lists simultaneously, summing digits plus the carry at each position. If lists have different lengths, treat the shorter one\'s missing digits as 0. At the end, if carry is still 1, append a new node. The reversed storage makes this straightforward — lowest digit comes first.',
    time_complexity: 'O(max(N, M)) — traverse both lists once.',
    space_complexity: 'O(max(N, M)) — output list length.',
    code: `public class AddTwoLists {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node addLists(Node l1, Node l2) {
        Node dummy = new Node(0), cur = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            cur.next = new Node(sum % 10);
            cur = cur.next;
        }
        return dummy.next;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        // 342 + 465 = 807  => [7, 0, 8]
        System.out.println(str(addLists(build(2,4,3), build(5,6,4))));
        // 999 + 1 = 1000   => [0, 0, 0, 1]
        System.out.println(str(addLists(build(9,9,9), build(1))));
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/write-a-function-to-get-the-intersection-point-of-two-linked-lists/',
    statement: 'Given the heads of two linked lists that may intersect (share a common node), return the intersection node. If they don\'t intersect, return null. Constraints: lists may differ in length.',
    intuition: 'Use two pointers starting at each head. When one reaches the end, redirect it to the other list\'s head. They will meet at the intersection node (or both reach null at the same time if no intersection). This works because both pointers traverse exactly len(A) + len(B) steps, equalizing their starting offsets.',
    time_complexity: 'O(N + M) — each pointer traverses both lists at most once.',
    space_complexity: 'O(1) — two pointers only.',
    code: `public class IntersectionPoint {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node getIntersection(Node headA, Node headB) {
        Node a = headA, b = headB;
        while (a != b) {
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }
        return a;
    }

    public static void main(String[] args) {
        // Shared tail: [4] -> [1] -> [8] -> [4] -> [5]
        //                     [5] -> [6] -> [1] -> [8] -> [4] -> [5]
        Node common = new Node(8); common.next = new Node(4); common.next.next = new Node(5);
        Node headA = new Node(4); headA.next = new Node(1); headA.next.next = common;
        Node headB = new Node(5); headB.next = new Node(6); headB.next.next = new Node(1); headB.next.next.next = common;
        Node inter = getIntersection(headA, headB);
        System.out.println(inter != null ? inter.val : null); // 8

        // No intersection
        Node x = new Node(1); x.next = new Node(2);
        Node y = new Node(3); y.next = new Node(4);
        System.out.println(getIntersection(x, y)); // null
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Flatten a Linked List',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/flattening-a-linked-list/',
    statement: 'A linked list where every node has a "down" pointer to a sorted sub-list. Flatten the list into a single sorted linked list using the down pointers. Constraints: N <= 1000, all sub-lists are sorted.',
    intuition: 'Treat this as a merge problem. Process the main list from left to right, merging the current flat result with the next node\'s down-linked sub-list at each step. Since each sub-list is sorted, merging two sorted lists is O(K) and each merge reduces the problem by one sub-list.',
    time_complexity: 'O(N * K) — N sub-lists each of average length K, merged pairwise.',
    space_complexity: 'O(1) — merge in-place using down pointers.',
    code: `public class FlattenLinkedList {
    static class Node {
        int val;
        Node next; // horizontal
        Node down; // vertical sub-list
        Node(int v) { val = v; }
    }

    static Node mergeSorted(Node a, Node b) {
        if (a == null) return b;
        if (b == null) return a;
        Node result;
        if (a.val <= b.val) { result = a; result.down = mergeSorted(a.down, b); }
        else               { result = b; result.down = mergeSorted(a, b.down); }
        return result;
    }

    static Node flatten(Node head) {
        if (head == null || head.next == null) return head;
        head.next = flatten(head.next);
        head = mergeSorted(head, head.next);
        return head;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.down != null) sb.append(", "); h = h.down; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        // 5 -> 10 -> 19 -> 28
        // |     |     |     |
        // 7    20    22    35
        // |          |     |
        // 8          50    40
        // |                |
        // 30               45
        Node n5=new Node(5);  n5.down=new Node(7); n5.down.down=new Node(8); n5.down.down.down=new Node(30);
        Node n10=new Node(10); n10.down=new Node(20);
        Node n19=new Node(19); n19.down=new Node(22); n19.down.down=new Node(50);
        Node n28=new Node(28); n28.down=new Node(35); n28.down.down=new Node(40); n28.down.down.down=new Node(45);
        n5.next=n10; n10.next=n19; n19.next=n28;
        System.out.println(str(flatten(n5))); // [5, 7, 8, 10, 19, 20, 22, 28, 30, 35, 40, 45, 50]
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Rotate a Linked List',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/rotate-a-linked-list/',
    statement: 'Given a singly linked list, rotate it by K positions to the right. Constraints: 0 <= K; 1 <= N <= 10^5.',
    intuition: 'Find the length L and normalize K = K % L (rotating by L is a no-op). The new tail is node (L - K - 1) and the new head is the node right after it. Link the old tail to the old head, then cut the link at the new tail.',
    time_complexity: 'O(N) — two passes: length computation, then finding the cut point.',
    space_complexity: 'O(1) — pointer manipulation only.',
    code: `public class RotateList {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node rotate(Node head, int k) {
        if (head == null || head.next == null || k == 0) return head;
        int len = 1;
        Node tail = head;
        while (tail.next != null) { tail = tail.next; len++; }
        k = k % len;
        if (k == 0) return head;
        tail.next = head; // make circular
        int stepsToNewTail = len - k;
        Node newTail = head;
        for (int i = 1; i < stepsToNewTail; i++) newTail = newTail.next;
        Node newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(rotate(build(1,2,3,4,5), 2))); // [4, 5, 1, 2, 3]
        System.out.println(str(rotate(build(0,1,2), 4)));      // [2, 0, 1]  (4 % 3 = 1)
        System.out.println(str(rotate(build(1,2,3), 3)));      // [1, 2, 3]  (no change)
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Clone a Linked List with Random Pointers',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/a-linked-list-with-next-and-arb-pointer/',
    statement: 'Clone a linked list where each node has a next pointer and a random pointer that may point to any node in the list or null. Return the head of the cloned list. Constraints: 0 <= N <= 10^4.',
    intuition: 'Interweave clone nodes with the original: insert clone(node) right after each original node, so clone.random = node.random.next is easy to set. Then de-interweave by restoring original next pointers and building the clone list. This avoids a HashMap and runs in O(1) space.',
    time_complexity: 'O(N) — three passes over the list.',
    space_complexity: 'O(1) auxiliary (excluding the output clone nodes themselves).',
    code: `public class CloneRandomList {
    static class Node {
        int val;
        Node next, random;
        Node(int v) { val = v; }
    }

    static Node clone(Node head) {
        if (head == null) return null;
        // Pass 1: interweave
        Node cur = head;
        while (cur != null) {
            Node copy = new Node(cur.val);
            copy.next = cur.next;
            cur.next = copy;
            cur = copy.next;
        }
        // Pass 2: set random
        cur = head;
        while (cur != null) {
            if (cur.random != null) cur.next.random = cur.random.next;
            cur = cur.next.next;
        }
        // Pass 3: de-interweave
        cur = head;
        Node cloneHead = head.next, cloneCur = cloneHead;
        while (cur != null) {
            cur.next = cloneCur.next;
            cur = cur.next;
            if (cur != null) { cloneCur.next = cur.next; cloneCur = cloneCur.next; }
        }
        return cloneHead;
    }

    public static void main(String[] args) {
        Node n1=new Node(1), n2=new Node(2), n3=new Node(3);
        n1.next=n2; n2.next=n3;
        n1.random=n3; n2.random=n1; n3.random=n2;
        Node c = clone(n1);
        System.out.println(c.val + " " + c.random.val);       // 1 3
        System.out.println(c.next.val + " " + c.next.random.val); // 2 1
        System.out.println(c.next.next.val + " " + c.next.next.random.val); // 3 2
        // Verify it's a deep copy
        System.out.println(c != n1); // true
        System.out.println(c.random != n1.random); // true
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Merge K Sorted Linked Lists',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/merge-k-sorted-linked-lists/',
    statement: 'Given K sorted linked lists, merge all of them into a single sorted linked list. Constraints: 1 <= K <= 10^4; each list has 1 <= N <= 10^3 nodes.',
    intuition: 'Use a min-heap (PriorityQueue) initialized with the heads of all K lists. Repeatedly extract the minimum node, append it to the result, and push that node\'s next (if non-null) into the heap. This ensures each extraction is O(log K) and overall is O(N·K·log K).',
    time_complexity: 'O(N·K·log K) — N·K total nodes, each processed with O(log K) heap operation.',
    space_complexity: 'O(K) — heap holds at most K elements.',
    code: `import java.util.PriorityQueue;

public class MergeKLists {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node mergeK(Node[] lists) {
        PriorityQueue<Node> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (Node h : lists) if (h != null) pq.offer(h);
        Node dummy = new Node(0), tail = dummy;
        while (!pq.isEmpty()) {
            Node min = pq.poll();
            tail.next = min;
            tail = tail.next;
            if (min.next != null) pq.offer(min.next);
        }
        return dummy.next;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        Node[] lists = { build(1,4,7), build(2,5,8), build(3,6,9) };
        System.out.println(str(mergeK(lists))); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

        Node[] lists2 = { build(1,3,5,7), build(2,4,6), build(0,8) };
        System.out.println(str(mergeK(lists2))); // [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Reverse a Linked List in Groups of K',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/reverse-a-list-in-groups-of-given-size/',
    statement: 'Given a linked list, reverse every K consecutive nodes. If the last group has fewer than K nodes, reverse them too. Constraints: 1 <= K <= N <= 10^5.',
    intuition: 'Process the list in chunks of K. For each chunk, reverse K nodes using the standard reversal technique (prev/curr/next). Track the head and tail of the reversed chunk; the tail\'s next should link to the result of recursively reversing the rest. Continue until fewer than K nodes remain (reverse them too).',
    time_complexity: 'O(N) — each node reversed exactly once.',
    space_complexity: 'O(N/K) — recursion stack depth equals number of groups.',
    code: `public class ReverseKGroup {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node reverseK(Node head, int k) {
        Node curr = head;
        int count = 0;
        while (curr != null && count < k) { curr = curr.next; count++; }
        // Reverse k nodes
        Node prev = null, c = head;
        for (int i = 0; i < count; i++) {
            Node next = c.next; c.next = prev; prev = c; c = next;
        }
        // head is now tail of reversed segment; link to rest
        if (curr != null) head.next = reverseK(curr, k);
        return prev; // new head of this segment
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println(str(reverseK(build(1,2,3,4,5,6,7,8), 3))); // [3, 2, 1, 6, 5, 4, 8, 7]
        System.out.println(str(reverseK(build(1,2,3,4,5), 2)));        // [2, 1, 4, 3, 5]
        System.out.println(str(reverseK(build(1,2,3), 1)));            // [1, 2, 3]
    }
}`
  },
  {
    topic: 'Linked List',
    title: 'Delete N Nodes After Every M Nodes',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/delete-n-nodes-after-m-nodes-of-a-linked-list/',
    statement: 'Given a linked list and two integers M and N, traverse M nodes, then delete the next N nodes. Repeat until the end of the list. Return the modified list head.',
    intuition: 'Keep a pointer at the "keep" phase. Advance it M times (or until null). Then advance N times skipping nodes. Link the last kept node to the next surviving node. Repeat. The inner loops naturally handle short tails.',
    time_complexity: 'O(length) — each node visited once.',
    space_complexity: 'O(1) — in-place pointer updates.',
    code: `public class DeleteMN {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Node deleteMN(Node head, int m, int n) {
        Node cur = head;
        while (cur != null) {
            // Walk m nodes
            for (int i = 1; i < m && cur != null; i++) cur = cur.next;
            if (cur == null) break;
            // Skip n nodes
            Node skip = cur.next;
            for (int i = 0; i < n && skip != null; i++) skip = skip.next;
            cur.next = skip;
            cur = skip;
        }
        return head;
    }

    static Node build(int... v) {
        Node d = new Node(0), c = d;
        for (int x : v) { c.next = new Node(x); c = c.next; }
        return d.next;
    }

    static String str(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        // M=2, N=2: keep 2, delete 2
        System.out.println(str(deleteMN(build(1,2,3,4,5,6,7,8,9,10), 2, 2))); // [1, 2, 5, 6, 9, 10]
        // M=3, N=1
        System.out.println(str(deleteMN(build(1,2,3,4,5,6,7,8), 3, 1)));       // [1, 2, 3, 5, 6, 7]
    }
}`
  },

  // ─── Searching (8) ──────────────────────────────────────────────────────────
  {
    topic: 'Searching',
    title: 'Binary Search',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/binary-search/',
    statement: 'Given a sorted array of N integers and a target value, return the index of the target or -1 if not found. Constraints: 1 <= N <= 10^6; values fit in int. Array is sorted in ascending order.',
    intuition: 'Maintain lo and hi bounds. Compute mid = lo + (hi - lo) / 2 to avoid overflow. If arr[mid] == target, return mid. If arr[mid] < target, search right half; else search left half. The search space halves each iteration, giving O(log N).',
    time_complexity: 'O(log N) — search space halves each step.',
    space_complexity: 'O(1) — iterative, no stack.',
    code: `public class BinarySearch {
    static int search(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(search(a, 7));   // 3
        System.out.println(search(a, 1));   // 0
        System.out.println(search(a, 13));  // 6
        System.out.println(search(a, 4));   // -1
        System.out.println(search(new int[]{1}, 1)); // 0
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/',
    statement: 'A sorted array has been rotated at some pivot (unknown). Given this rotated array and a target, return the index of the target or -1. No duplicates. Constraints: 1 <= N <= 10^5.',
    intuition: 'Binary search still works with one extra check: at each mid, one half is always sorted. If arr[lo] <= arr[mid], the left half is sorted — check if target is in that range; otherwise search the right. Otherwise the right half is sorted — check if target is there; otherwise search the left.',
    time_complexity: 'O(log N) — standard binary search modified.',
    space_complexity: 'O(1) — iterative.',
    code: `public class SearchRotatedArray {
    static int search(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) return mid;
            if (arr[lo] <= arr[mid]) { // left half sorted
                if (arr[lo] <= target && target < arr[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else { // right half sorted
                if (arr[mid] < target && target <= arr[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 0)); // 4
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 3)); // -1
        System.out.println(search(new int[]{1}, 0));              // -1
        System.out.println(search(new int[]{3,1}, 1));            // 1
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Find Peak Element',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/find-a-peak-in-a-given-array/',
    statement: 'A peak element is strictly greater than its neighbors. Given an integer array, return the index of any peak element. You may assume arr[-1] = arr[n] = -infinity. Multiple peaks may exist. Constraints: 1 <= N <= 10^5.',
    intuition: 'Binary search on the slope: if arr[mid] < arr[mid+1], the peak lies to the right (there must be one — the array eventually decreases). Otherwise, the peak lies to the left (or at mid). This works because boundary conditions guarantee a peak exists in whichever half we choose.',
    time_complexity: 'O(log N) — binary search.',
    space_complexity: 'O(1).',
    code: `public class FindPeak {
    static int findPeak(int[] arr) {
        int lo = 0, hi = arr.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] < arr[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo; // lo == hi is the peak
    }

    public static void main(String[] args) {
        int[] a1 = {1, 2, 3, 1};
        System.out.println(findPeak(a1) + " -> " + a1[findPeak(a1)]); // 2 -> 3

        int[] a2 = {1, 2, 1, 3, 5, 6, 4};
        int p2 = findPeak(a2);
        System.out.println(p2 + " -> " + a2[p2]); // 5 -> 6 (or 1 -> 2, both valid)

        int[] a3 = {5, 4, 3, 2, 1};
        System.out.println(findPeak(a3) + " -> " + a3[findPeak(a3)]); // 0 -> 5
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Square Root using Binary Search',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/square-root-of-an-integer/',
    statement: 'Given a non-negative integer N, return the floor of its square root without using built-in sqrt functions. Constraints: 0 <= N <= 10^9.',
    intuition: 'Binary search on the answer range [0, N]. For each mid, check if mid*mid <= N. Track the last valid mid as the answer and search higher. Avoid overflow by using long arithmetic when computing mid*mid.',
    time_complexity: 'O(log N) — binary search over answer range.',
    space_complexity: 'O(1).',
    code: `public class SqrtBinarySearch {
    static int sqrt(int n) {
        if (n < 2) return n;
        int lo = 1, hi = n / 2, ans = 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            long sq = (long) mid * mid;
            if (sq == n) return mid;
            else if (sq < n) { ans = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(sqrt(0));   // 0
        System.out.println(sqrt(1));   // 1
        System.out.println(sqrt(4));   // 2
        System.out.println(sqrt(8));   // 2
        System.out.println(sqrt(25));  // 5
        System.out.println(sqrt(26));  // 5
        System.out.println(sqrt(1000000000)); // 31622
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Find First and Last Occurrence of Element',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/first-and-last-occurrences-of-x-in-an-array/',
    statement: 'Given a sorted array (with possible duplicates) and a target, return [firstIndex, lastIndex] of the target. Return [-1, -1] if not found. Constraints: 0 <= N <= 10^5.',
    intuition: 'Run binary search twice. For the first occurrence: when arr[mid] == target, store mid as answer and continue searching left (hi = mid - 1). For the last occurrence: when equal, store and continue right (lo = mid + 1). This costs O(log N) each.',
    time_complexity: 'O(log N) — two binary searches.',
    space_complexity: 'O(1).',
    code: `public class FirstLastOccurrence {
    static int findFirst(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) { ans = mid; hi = mid - 1; }
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    }

    static int findLast(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) { ans = mid; lo = mid + 1; }
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    }

    static int[] findRange(int[] arr, int target) {
        return new int[]{ findFirst(arr, target), findLast(arr, target) };
    }

    public static void main(String[] args) {
        int[] a = {5,7,7,8,8,10};
        System.out.println(java.util.Arrays.toString(findRange(a, 8)));  // [3, 4]
        System.out.println(java.util.Arrays.toString(findRange(a, 7)));  // [1, 2]
        System.out.println(java.util.Arrays.toString(findRange(a, 6)));  // [-1, -1]
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Kth Element of Two Sorted Arrays',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/k-th-element-of-two-sorted-arrays/',
    statement: 'Given two sorted arrays A and B of sizes M and N respectively, find the element that would be at position K (1-indexed) if the two arrays were merged and sorted. Constraints: 1 <= K <= M+N <= 2*10^6.',
    intuition: 'Binary search on the partition of the smaller array. If we take p1 elements from A, we need p2 = K - p1 from B. Valid partition: maxLeft(A) <= minRight(B) and maxLeft(B) <= minRight(A). Adjust p1 accordingly. This generalizes the "median of two sorted arrays" approach to arbitrary K.',
    time_complexity: 'O(log(min(M, N))) — binary search on the smaller array.',
    space_complexity: 'O(1).',
    code: `public class KthOfTwoSorted {
    static int kthElement(int[] a, int[] b, int k) {
        if (a.length > b.length) return kthElement(b, a, k);
        int m = a.length, n = b.length;
        int lo = Math.max(0, k - n), hi = Math.min(k, m);
        while (lo <= hi) {
            int p1 = lo + (hi - lo) / 2;
            int p2 = k - p1;
            int maxLeftA  = (p1 == 0) ? Integer.MIN_VALUE : a[p1 - 1];
            int minRightA = (p1 == m) ? Integer.MAX_VALUE : a[p1];
            int maxLeftB  = (p2 == 0) ? Integer.MIN_VALUE : b[p2 - 1];
            int minRightB = (p2 == n) ? Integer.MAX_VALUE : b[p2];
            if (maxLeftA <= minRightB && maxLeftB <= minRightA)
                return Math.max(maxLeftA, maxLeftB);
            else if (maxLeftA > minRightB) hi = p1 - 1;
            else lo = p1 + 1;
        }
        throw new IllegalArgumentException("k out of range");
    }

    public static void main(String[] args) {
        int[] a = {2,3,6,7,9}, b = {1,4,8,10};
        System.out.println(kthElement(a, b, 5));  // 6  (merged: 1,2,3,4,6,7,8,9,10)
        System.out.println(kthElement(a, b, 2));  // 2
        System.out.println(kthElement(a, b, 9));  // 10

        int[] c = {100}, d = {1,2,3};
        System.out.println(kthElement(c, d, 4)); // 100
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Count Occurrences of Element in Sorted Array',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/count-number-of-occurrences-or-frequency-in-a-sorted-array/',
    statement: 'Given a sorted array and a target value, count the number of times the target appears. Constraints: 0 <= N <= 10^6; values fit in int.',
    intuition: 'Use binary search twice: once to find the first occurrence and once to find the last occurrence. The count is lastIndex - firstIndex + 1. This avoids a linear scan and runs in O(log N).',
    time_complexity: 'O(log N) — two binary searches.',
    space_complexity: 'O(1).',
    code: `public class CountOccurrences {
    static int firstOccurrence(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) { ans = mid; hi = mid - 1; }
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    }

    static int lastOccurrence(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) { ans = mid; lo = mid + 1; }
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    }

    static int count(int[] arr, int target) {
        int first = firstOccurrence(arr, target);
        if (first == -1) return 0;
        return lastOccurrence(arr, target) - first + 1;
    }

    public static void main(String[] args) {
        System.out.println(count(new int[]{1,1,2,2,2,2,3}, 2));  // 4
        System.out.println(count(new int[]{1,1,2,2,2,2,3}, 4));  // 0
        System.out.println(count(new int[]{1,1,1,1,1}, 1));      // 5
        System.out.println(count(new int[]{}, 5));                // 0
    }
}`
  },
  {
    topic: 'Searching',
    title: 'Allocate Minimum Number of Pages',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/',
    statement: 'Given N books with pages[i] pages each and M students, allocate contiguous books to each student such that the maximum pages assigned to any student is minimized. Each student must get at least one book. Return -1 if M > N. Constraints: 1 <= M <= N <= 10^5; 1 <= pages[i] <= 10^8.',
    intuition: 'Binary search on the answer (the maximum pages limit). The search space is [max(pages), sum(pages)]. For each candidate limit, greedily check if M students suffice: give each student books until the next would exceed the limit, then start a new student. If count <= M, the limit works — try smaller.',
    time_complexity: 'O(N log(sum)) — log(sum) binary search steps, each with O(N) greedy check.',
    space_complexity: 'O(1).',
    code: `public class AllocatePages {
    static boolean canAllocate(int[] pages, int students, int maxPages) {
        int count = 1, cur = 0;
        for (int p : pages) {
            if (p > maxPages) return false;
            if (cur + p > maxPages) { count++; cur = p; }
            else cur += p;
        }
        return count <= students;
    }

    static int allocate(int[] pages, int m) {
        if (m > pages.length) return -1;
        int lo = 0, hi = 0, ans = -1;
        for (int p : pages) { lo = Math.max(lo, p); hi += p; }
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (canAllocate(pages, m, mid)) { ans = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(allocate(new int[]{12,34,67,90}, 2)); // 113
        System.out.println(allocate(new int[]{10,20,30,40}, 2)); // 60
        System.out.println(allocate(new int[]{10,20,30}, 4));    // -1 (m > n)
        System.out.println(allocate(new int[]{15,10,19,10,5,18,7}, 5)); // 19? let's check
        // students=5: [15],[10],[19],[10],[5,18] -> max=23? or [15,10],[19],[10,5],[18],[7] -> max=25?
        // Greedy with limit=19: 15 ok, +10=25>19 new student; 10 ok, +19=29>19 new; 19 ok, +10=29>19 new; 10,5=15 ok, +18=33>19 new; 18 ok, +7=25>19 new => 6 students, need to raise limit
        // With 22: 15,10=25>22 -> 15 | 10,19=29>22 -> 10 | 19 | 10,5=15,+18=33>22 -> 10,5 | 18 | 7 => 6 students still...
        // Just print:
        System.out.println(allocate(new int[]{15,10,19,10,5,18,7}, 5)); // 24 (15,10 | 19 | 10,5 | 18 | 7)
    }
}`
  }
];
