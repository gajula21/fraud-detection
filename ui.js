import { Transaction } from './Transaction.js';
import { FraudEngine } from './FraudEngine.js';

// Initialize Engine
const engine = new FraudEngine();
let totalProcessed = 0;

// DOM Elements
const terminalBody = document.getElementById('terminal-body');
const queueSizeEl = document.getElementById('queue-size');
const processedCountEl = document.getElementById('processed-count');
const flaggedListEl = document.getElementById('flagged-list');

// Intercept console.log to write to UI Terminal
const originalLog = console.log;
console.log = function(...args) {
    // Keep it in actual console too
    originalLog.apply(console, args);
    
    // Parse to UI
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    
    // Create element
    const div = document.createElement('div');
    div.className = 'log-entry';
    
    // Simple color coding logic based on our string tags
    if (msg.includes('[DSA:')) div.classList.add('dsa');
    else if (msg.includes('[OOP:')) div.classList.add('oop');
    else if (msg.includes('Triggered!') || msg.includes('[Flagged]')) div.classList.add('alert');
    else if (msg.includes('Final Risk Score')) div.classList.add('success');
    else div.classList.add('system');
    
    // Preserve spaces for tree-like logs
    div.innerHTML = msg.replace(/ /g, '&nbsp;');
    
    terminalBody.appendChild(div);
    // Auto-scroll
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    // Update live state heuristically when queue changes
    if (msg.includes('Queue size:')) {
        const match = msg.match(/Queue size: (\d+)/);
        if (match) queueSizeEl.innerText = match[1];
    }
};

// UI Controllers
document.getElementById('tx-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = document.getElementById('tx-user').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const location = document.getElementById('tx-location').value;
    const txId = 'TXN' + String(Math.floor(Math.random() * 90000) + 10000);
    
    const tx = new Transaction(txId, userId, amount, location, Date.now());
    engine.streamTransaction(tx);
    console.log(`[System] Injected manual transaction: ${txId} for ${userId}`);
});

document.getElementById('btn-simulate').addEventListener('click', () => {
    console.log("[System] Injecting simulated load test stream...");
    const now = Date.now();
    const MINUTE = 60 * 1000;
    
    const stream = [
        new Transaction("TXNS01", "U1", 100, "New York", now - 60 * MINUTE),
        new Transaction("TXNS02", "U2", 250, "Los Angeles", now - 55 * MINUTE),
        new Transaction("TXNS03", "U1", 150, "London", now - 50 * MINUTE),
        new Transaction("TXNS04", "U2", 6000, "Los Angeles", now - 45 * MINUTE),
        new Transaction("TXNS05", "U3", 50, "Chicago", now - 10 * MINUTE),
        new Transaction("TXNS06", "U3", 60, "Chicago", now - 8 * MINUTE),
        new Transaction("TXNS07", "U3", 40, "Chicago", now - 7 * MINUTE),
        new Transaction("TXNS08", "U3", 100, "Chicago", now - 5 * MINUTE),
        new Transaction("TXNS09", "U4", 500, "Miami", now - 100 * MINUTE),
        new Transaction("TXNS10", "U4", 8000, "Paris", now - 1 * MINUTE),
    ];
    
    for (const tx of stream) {
        engine.streamTransaction(tx);
    }
});

document.getElementById('btn-process').addEventListener('click', () => {
    if (engine.transactionQueue.isEmpty()) {
        console.log("[System] Queue is empty. Nothing to process.");
        return;
    }
    
    const size = engine.transactionQueue.size;
    engine.processTransactions();
    totalProcessed += size;
    processedCountEl.innerText = totalProcessed;
    queueSizeEl.innerText = "0"; // Process clears it
    
    updateFlaggedUI();
});

document.getElementById('btn-clear').addEventListener('click', () => {
    terminalBody.innerHTML = '<div class="log-entry system">Terminal cleared.</div>';
});

function updateFlaggedUI() {
    const rankedFraud = engine.getRankedFlaggedTransactions();
    flaggedListEl.innerHTML = '';
    
    if (rankedFraud.length === 0) {
        flaggedListEl.innerHTML = '<li class="empty-state">No flagged transactions yet.</li>';
        return;
    }
    
    rankedFraud.forEach((tx) => {
        const li = document.createElement('li');
        li.className = 'flagged-item';
        
        const riskPct = (tx.riskScore * 100).toFixed(0);
        
        li.innerHTML = `
            <div class="flagged-item-header">
                <strong>${tx.transactionId} (${tx.userId})</strong>
                <span class="flag-risk">Risk: ${riskPct}%</span>
            </div>
            <div style="font-size: 0.85rem; color: #aaa;">
                $${tx.amount} | Loc: ${tx.location}
            </div>
        `;
        
        flaggedListEl.appendChild(li);
    });
}
