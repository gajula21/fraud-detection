// FraudEngine.js
import { Queue, SinglyLinkedList, quickSort } from './Structures.js';
import { VelocityRule, AmountLimitRule, LocationMismatchRule } from './Rules.js';

export class FraudEngine {
    constructor() {
        this.transactionQueue = new Queue();
        
        // JS Map provides O(1) average lookup for a user's linked list history.
        this.userDatabase = new Map();
        
        // Array of BaseRule objects demonstrating Polymorphism in action
        this.rules = [
            new VelocityRule(60, 3), 
            new AmountLimitRule(5000), 
            new LocationMismatchRule()
        ];
        this.flaggedTransactions = [];
    }

    streamTransaction(transaction) {
        // Enqueue transaction
        this.transactionQueue.enqueue(transaction);
    }

    processTransactions() {
        console.log("\n--- Processing Queued Transactions ---");
        while (!this.transactionQueue.isEmpty()) {
            const tx = this.transactionQueue.dequeue();
            
            console.log(`\nEvaluating [ID: ${tx.transactionId}] | Amount: $${tx.amount} | Loc: ${tx.location} | User: ${tx.userId}`);

            // O(1) Lookup for User History
            if (!this.userDatabase.has(tx.userId)) {
                console.log(`  [DSA: Hash Map] O(1) Lookup: Creating new history for User ${tx.userId}`);
                this.userDatabase.set(tx.userId, new SinglyLinkedList());
            } else {
                console.log(`  [DSA: Hash Map] O(1) Lookup: Found existing history for User ${tx.userId}`);
            }

            const historyList = this.userDatabase.get(tx.userId);
            const historyArray = historyList.toArray();

            // Run polymorphic rules
            let totalRisk = 0.0;
            for (const rule of this.rules) {
                totalRisk += rule.evaluate(tx, historyArray);
            }

            tx.riskScore = Math.min(totalRisk, 1.0);
            console.log(`  Final Risk Score: ${tx.riskScore.toFixed(2)}`);

            if (tx.riskScore > 0.0) {
                console.log(`  [Flagged] Transaction queued for review.`);
                this.flaggedTransactions.push(tx);
            }

            // O(1) Insertion into user history
            console.log(`  [DSA: Linked List] Prepended transaction to User ${tx.userId} history in O(1) time.`);
            historyList.prepend(tx);
        }
    }

    getRankedFlaggedTransactions() {
        console.log("\n--- Ranking Flagged Transactions ---");
        console.log("[DSA: QuickSort] Sorting flagged transactions by risk score (Descending, O(N log N))...");
        return quickSort(this.flaggedTransactions);
    }
}
