// Rules.js

// OOP Base Class
export class BaseRule {
    constructor(name) {
        this.name = name;
    }

    // Abstract method to be overridden using polymorphism
    evaluate(transaction, userHistory) {
        throw new Error("Method 'evaluate()' must be implemented.");
    }
}

// Inherits from BaseRule
export class VelocityRule extends BaseRule {
    constructor(timeWindowMinutes = 60, maxTransactions = 3) {
        super("VelocityRule");
        this.timeWindowMs = timeWindowMinutes * 60 * 1000;
        this.maxTransactions = maxTransactions;
    }

    // Polymorphism: Overriding evaluate
    evaluate(transaction, userHistory) {
        console.log(`  [OOP: Polymorphism] Executing ${this.name}.evaluate()`);
        let recentCount = 0;
        const now = transaction.timestamp;
        
        for (const pastTx of userHistory) {
            if (now - pastTx.timestamp <= this.timeWindowMs) {
                recentCount++;
            } else {
                // Since linked list is prepended, older transactions are later.
                break;
            }
        }

        if (recentCount >= this.maxTransactions) {
            console.log(`    -> Triggered! Too many transactions (${recentCount}) recently by User ${transaction.userId}.`);
            return 0.4; // Adds 0.4 to risk score
        }
        return 0.0;
    }
}

export class AmountLimitRule extends BaseRule {
    constructor(limit = 5000) {
        super("AmountLimitRule");
        this.limit = limit;
    }

    evaluate(transaction, userHistory) {
        console.log(`  [OOP: Polymorphism] Executing ${this.name}.evaluate()`);
        if (transaction.amount > this.limit) {
            console.log(`    -> Triggered! High amount: $${transaction.amount}`);
            return 0.5; // Adds 0.5 to risk score
        }
        return 0.0;
    }
}

export class LocationMismatchRule extends BaseRule {
    constructor() {
        super("LocationMismatchRule");
    }

    evaluate(transaction, userHistory) {
        console.log(`  [OOP: Polymorphism] Executing ${this.name}.evaluate()`);
        if (userHistory.length > 0) {
            const lastTx = userHistory[0]; // Most recent
            if (lastTx.location !== transaction.location) {
                console.log(`    -> Triggered! Location changed from ${lastTx.location} to ${transaction.location}`);
                return 0.3; // Adds 0.3 to risk score
            }
        }
        return 0.0;
    }
}
