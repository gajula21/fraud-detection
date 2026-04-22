// Transaction.js

// Represents a business entity (OOP encapsulation)
export class Transaction {
    constructor(transactionId, userId, amount, location, timestamp) {
        this.transactionId = transactionId;
        this.userId = userId;
        this.amount = amount;
        this.location = location;
        this.timestamp = timestamp;
        this.riskScore = 0.0;
    }
}
