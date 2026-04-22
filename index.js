// index.js
import { Transaction } from './Transaction.js';
import { FraudEngine } from './FraudEngine.js';

console.log("==================================================");
console.log("===     RULE-BASED FRAUD DETECTION SYSTEM      ===");
console.log("===  (Demonstrating DSA & OOP For Evaluators)  ===");
console.log("==================================================\n");

const engine = new FraudEngine();

function simulateStream() {
    console.log("--- Simulating Transaction Stream ---\n");

    const now = Date.now();
    const MINUTE = 60 * 1000;

    const stream = [
        new Transaction("TXN001", "U1", 100, "New York", now - 60 * MINUTE),
        new Transaction("TXN002", "U2", 250, "Los Angeles", now - 55 * MINUTE),
        new Transaction("TXN003", "U1", 150, "London", now - 50 * MINUTE),                 // Location Mismatch
        new Transaction("TXN004", "U2", 6000, "Los Angeles", now - 45 * MINUTE),             // High Amount Limit
        new Transaction("TXN005", "U3", 50, "Chicago", now - 10 * MINUTE),
        new Transaction("TXN006", "U3", 60, "Chicago", now - 8 * MINUTE),
        new Transaction("TXN007", "U3", 40, "Chicago", now - 7 * MINUTE),
        new Transaction("TXN008", "U3", 100, "Chicago", now - 5 * MINUTE),                   // Velocity Trigger
        new Transaction("TXN009", "U4", 500, "Miami", now - 100 * MINUTE),
        new Transaction("TXN010", "U4", 8000, "Paris", now - 1 * MINUTE),                    // Extreme: Amount + Location
    ];

    for (const tx of stream) {
        engine.streamTransaction(tx);
    }
}

// 1. Simulate incoming stream into the Queue
simulateStream();

// 2. Process all dequeued transactions sequentially
engine.processTransactions();

// 3. Rank flagged operations using QuickSort
const rankedFraud = engine.getRankedFlaggedTransactions();

console.log("\n==================================================");
console.log("===    FLAGGED TRANSACTIONS REPORT (RANKED)    ===");
console.log("==================================================");
if (rankedFraud.length === 0) {
    console.log("No transactions were flagged.");
} else {
    rankedFraud.forEach((tx, idx) => {
        console.log(`${idx + 1}. [Risk: ${(tx.riskScore * 100).toFixed(0)}%] ID: ${tx.transactionId} | User: ${tx.userId} | Amount: $${tx.amount} | Loc: ${tx.location}`);
    });
}
console.log("==================================================\n");
