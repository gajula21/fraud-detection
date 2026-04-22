// Structures.js

// --- Queue Implementation ---
// Used to handle incoming transaction streams.
class QueueNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enqueue(data) {
        const newNode = new QueueNode(data);
        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
        console.log(`[DSA: Queue] Enqueued transaction ${data.transactionId}. Queue size: ${this.size}`);
    }

    dequeue() {
        if (!this.head) return null;
        const temp = this.head;
        this.head = this.head.next;
        if (!this.head) this.tail = null;
        this.size--;
        console.log(`[DSA: Queue] Dequeued transaction ${temp.data.transactionId}. Queue size: ${this.size}`);
        return temp.data;
    }

    isEmpty() {
        return this.head === null;
    }
}

// --- Singly Linked List Implementation ---
// Used to store user transaction histories.
class ListNode {
    constructor(transaction) {
        this.transaction = transaction;
        this.next = null;
    }
}

export class SinglyLinkedList {
    constructor() {
        this.head = null;
    }

    // O(1) Insertion by prepending to the head
    prepend(transaction) {
        const newNode = new ListNode(transaction);
        newNode.next = this.head;
        this.head = newNode;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while(current) {
            arr.push(current.transaction);
            current = current.next;
        }
        return arr;
    }
}

// --- QuickSort Implementation ---
// Used to rank flagged transactions by risk score (Descending O(N log N)).
export function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        // Compare by riskScore descending
        if (arr[i].riskScore > pivot.riskScore) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}
