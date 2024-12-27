// Migrate envelope data to new format
function migrateEnvelope(envelope) {
    if (!envelope.history) {
        envelope.history = [{
            date: envelope.createdAt || new Date().toISOString(),
            amount: envelope.amount,
            type: 'initial',
            name: 'Initial deposit'
        }];
    }
    if (!envelope.createdAt) {
        envelope.createdAt = new Date().toISOString();
    }
    return envelope;
}

// Initialize storage with error handling
function initializeStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        
        const savedEnvelopes = localStorage.getItem('envelopes');
        const savedAchievements = localStorage.getItem('achievements');
        
        envelopes = savedEnvelopes ? JSON.parse(savedEnvelopes).map(migrateEnvelope) : [];
        achievements = savedAchievements ? JSON.parse(savedAchievements) : [];
        previousEnvelopes = {};
        
        envelopes.forEach(env => {
            previousEnvelopes[env.id] = { ...env };
        });

        if (savedEnvelopes) {
            saveData();
        }
        
        return true;
    } catch (error) {
        console.error('Storage initialization failed:', error);
        alert('Warning: Local storage is not available. Your data will not be saved.');
        envelopes = [];
        achievements = [];
        previousEnvelopes = {};
        return false;
    }
}

// Store envelopes and achievements in localStorage
let envelopes = [];
let achievements = [];
let previousEnvelopes = {};
let storageAvailable = false;

// Initialize the app
function init() {
    storageAvailable = initializeStorage();
    renderEnvelopes();
    updateTotalBalance();
    loadAchievements();
    loadTheme();
}

// Theme management
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-theme') === theme);
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'green';
    setTheme(savedTheme);
}

// Weasel tips
function toggleWeaselTip() {
    const tips = [
        "Save consistently, even if it's small amounts! 💫",
        "Track every expense, no matter how tiny! 📝",
        "Set realistic goals you can achieve! 🎯",
        "Celebrate your savings milestones! 🎉",
        "Build an emergency fund first! 🚨",
        "Pay yourself first - savings before spending! 💰",
        "Review your budget regularly! 📊",
        "Every penny counts towards your goals! ✨"
    ];
    
    let tipDisplay = document.getElementById('weasel-tip');
    if (!tipDisplay) {
        tipDisplay = document.createElement('div');
        tipDisplay.id = 'weasel-tip';
        tipDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: var(--shadow);
            max-width: 300px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(tipDisplay);
    }
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    tipDisplay.textContent = randomTip;
    
    setTimeout(() => {
        tipDisplay.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => tipDisplay.remove(), 300);
    }, 3000);
}

// Quick add predefined categories
function quickAdd(name, amount) {
    const envelope = {
        id: Date.now(),
        name,
        amount: amount * 0.1,
        goal: amount,
        createdAt: new Date().toISOString(),
        history: [{
            date: new Date().toISOString(),
            amount: amount * 0.1,
            type: 'initial',
            name: 'Initial deposit'
        }]
    };
    
    envelopes.push(envelope);
    saveEnvelopes();
    renderEnvelopes();
    updateTotalBalance();
}

// Update total balance
function updateTotalBalance() {
    const total = envelopes.reduce((sum, env) => sum + env.amount, 0);
    const totalGoal = envelopes.reduce((sum, env) => sum + env.goal, 0);
    const progress = (total / totalGoal) * 100;
    
    const balanceEl = document.querySelector('.balance-amount');
    balanceEl.textContent = formatCurrency(total);
    balanceEl.innerHTML += `<div class="balance-progress">Progress to Goals: ${progress.toFixed(1)}%</div>`;
    
    balanceEl.style.animation = 'none';
    balanceEl.offsetHeight;
    balanceEl.style.animation = 'pulse 0.5s ease-out';
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Create celebration animation
function createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-container';
    
    const weasel = document.createElement('div');
    weasel.className = 'mega-weasel';
    weasel.innerHTML = '🦦';
    celebration.appendChild(weasel);
    
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.setProperty('--delay', `${Math.random() * 2}s`);
        sparkle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        sparkle.style.setProperty('--distance', `${30 + Math.random() * 40}vh`);
        sparkle.innerHTML = ['✨', '💫', '⭐️', '🌟'][Math.floor(Math.random() * 4)];
        celebration.appendChild(sparkle);
    }
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.setProperty('--delay', `${Math.random() * 3}s`);
        confetti.style.setProperty('--x', `${Math.random() * 100}vw`);
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 50%)`;
        celebration.appendChild(confetti);
    }

    document.body.appendChild(celebration);

    const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
    audio.play().catch(() => {});

    celebration.addEventListener('animationend', (e) => {
        if (e.target === weasel) {
            celebration.remove();
        }
    });
}

// Check for duplicate names
function isDuplicateName(name, excludeId = null) {
    return envelopes.some(env => 
        env.name.toLowerCase() === name.toLowerCase() && env.id !== excludeId
    );
}

// Add new envelope
function addEnvelope() {
    const nameInput = document.getElementById('envelope-name');
    const amountInput = document.getElementById('envelope-amount');
    const goalInput = document.getElementById('envelope-goal');
    
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const goal = parseFloat(goalInput.value) || amount * 2;
    
    if (!name || isNaN(amount) || amount < 0) {
        alert('Please enter a valid name and amount');
        return;
    }

    if (isDuplicateName(name)) {
        alert('An envelope with this name already exists');
        return;
    }
    
    const envelope = {
        id: Date.now(),
        name,
        amount,
        goal,
        createdAt: new Date().toISOString(),
        history: [{
            date: new Date().toISOString(),
            amount,
            type: 'initial',
            name: 'Initial deposit'
        }]
    };
    
    envelopes.push(envelope);
    saveEnvelopes();
    renderEnvelopes();
    updateTotalBalance();
    
    nameInput.value = '';
    amountInput.value = '';
    goalInput.value = '';
}

// Update envelope amount
function updateEnvelope(id, action, value) {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope) return;
    
    const previousAmount = envelope.amount;
    const transactionName = action === 'add' ? 'Deposit' : 'Withdrawal';
    
    if (action === 'add') {
        envelope.amount += amount;
        envelope.history.push({
            date: new Date().toISOString(),
            amount: amount,
            type: 'deposit',
            name: transactionName
        });
    } else if (action === 'subtract') {
        if (envelope.amount < amount) {
            alert('Insufficient funds in envelope');
            return;
        }
        envelope.amount -= amount;
        envelope.history.push({
            date: new Date().toISOString(),
            amount: -amount,
            type: 'withdrawal',
            name: transactionName
        });
    }
    
    if (envelope.amount >= envelope.goal && previousAmount < envelope.goal) {
        createCelebration();
        
        achievements.push({
            type: 'goal_reached',
            envelopeName: envelope.name,
            amount: envelope.amount,
            goal: envelope.goal,
            date: new Date().toISOString()
        });
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        loadAchievements();
    }
    
    saveEnvelopes();
    renderEnvelopes();
    updateTotalBalance();
}

// Update transaction name
function updateTransactionName(envelopeId, transactionDate, newName) {
    const envelope = envelopes.find(e => e.id === envelopeId);
    if (!envelope) return;

    const transaction = envelope.history.find(t => t.date === transactionDate);
    if (!transaction) return;

    transaction.name = newName.trim() || transaction.type;
    saveEnvelopes();
    renderEnvelopes();
}

// Delete transaction
function deleteTransaction(envelopeId, transactionDate) {
    const envelope = envelopes.find(e => e.id === envelopeId);
    if (!envelope) return;

    const transactionIndex = envelope.history.findIndex(t => t.date === transactionDate);
    if (transactionIndex === -1) return;

    const transaction = envelope.history[transactionIndex];
    
    if (transaction.type === 'deposit') {
        envelope.amount -= transaction.amount;
    } else if (transaction.type === 'withdrawal') {
        envelope.amount += Math.abs(transaction.amount);
    }

    envelope.history.splice(transactionIndex, 1);
    saveEnvelopes();
    renderEnvelopes();
    updateTotalBalance();
}

// Toggle achievements panel
function toggleAchievements() {
    const content = document.getElementById('achievements');
    const icon = document.querySelector('.toggle-icon');
    content.classList.toggle('collapsed');
    icon.style.transform = content.classList.contains('collapsed') ? 'rotate(-90deg)' : '';
}

// Remove achievement
function removeAchievement(index) {
    achievements.splice(index, 1);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    loadAchievements();
}

// Load achievements
function loadAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    if (!achievementsContainer) return;
    
    achievementsContainer.innerHTML = achievements.slice(-5).reverse().map((achievement, index) => `
        <div class="achievement">
            <span class="achievement-icon">🎯</span>
            <div class="achievement-details">
                <div class="achievement-title">Goal Reached: ${achievement.envelopeName}</div>
                <div class="achievement-date">${new Date(achievement.date).toLocaleDateString()}</div>
            </div>
            <button class="achievement-remove" onclick="removeAchievement(${achievements.length - 1 - index})">×</button>
        </div>
    `).join('') || '<p class="helper-text">No achievements yet. Keep saving! 💪</p>';
}

// Delete envelope
function deleteEnvelope(id) {
    if (confirm('Are you sure you want to delete this envelope?')) {
        envelopes = envelopes.filter(e => e.id !== id);
        saveEnvelopes();
        renderEnvelopes();
        updateTotalBalance();
    }
}

// Save data to localStorage
function saveData() {
    if (!storageAvailable) return;
    
    try {
        localStorage.setItem('envelopes', JSON.stringify(envelopes));
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        envelopes.forEach(env => {
            previousEnvelopes[env.id] = { ...env };
        });
    } catch (error) {
        console.error('Failed to save data:', error);
        alert('Warning: Failed to save your changes. Storage might be full.');
    }
}

// Save envelopes
function saveEnvelopes() {
    saveData();
}

// Update envelope name
function updateEnvelopeName(id, newName) {
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope) return;

    newName = newName.trim();
    if (!newName) {
        alert('Please enter a valid name');
        return;
    }

    if (isDuplicateName(newName, id)) {
        alert('An envelope with this name already exists');
        return;
    }

    envelope.name = newName;
    saveEnvelopes();
    renderEnvelopes();
}

// Render envelopes
function renderEnvelopes() {
    const container = document.getElementById('envelopes-list');
    container.innerHTML = '';
    
    envelopes.forEach(envelope => {
        const progress = (envelope.amount / envelope.goal) * 100;
        const isGoalReached = envelope.amount >= envelope.goal;
        
        const el = document.createElement('div');
        el.className = `envelope ${isGoalReached ? 'goal-reached' : ''}`;
        
        const recentHistory = envelope.history || [];
        const trend = recentHistory.length > 1 ? 
            recentHistory.reduce((sum, entry) => 
                sum + (entry.type === 'deposit' ? entry.amount : -entry.amount), 0) : 0;
        
        const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '🎯';
        
        el.innerHTML = `
            <h2 class="envelope-name" onclick="this.setAttribute('contenteditable', true)" 
                onblur="updateEnvelopeName(${envelope.id}, this.textContent)"
                onkeypress="return event.keyCode != 13">${envelope.name} ${trendIcon}</h2>
            <div class="amount">${formatCurrency(envelope.amount)}</div>
            <div class="goal-info">Goal: ${formatCurrency(envelope.goal)}</div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <div class="progress-label">${progress.toFixed(1)}%</div>
            </div>
            <div class="actions">
                <input type="number" min="0" step="0.01" placeholder="Amount">
                <button class="add-btn" onclick="updateEnvelope(${envelope.id}, 'add', this.parentElement.querySelector('input').value)">Add</button>
                <button class="subtract-btn" onclick="updateEnvelope(${envelope.id}, 'subtract', this.parentElement.querySelector('input').value)">Subtract</button>
            </div>
            <div class="top-actions">
                <button class="export-btn" onclick="exportToExcel(${envelope.id})">📥</button>
                <button class="delete-btn" onclick="deleteEnvelope(${envelope.id})">×</button>
            </div>
            ${envelope.history && envelope.history.length > 0 ? `
                <div class="history-preview">
                    Last transaction: ${formatCurrency(Math.abs(envelope.history[envelope.history.length - 1].amount))}
                    ${envelope.history[envelope.history.length - 1].type === 'deposit' ? '↗️' : '↘️'}
                </div>
                <button class="transactions-toggle" onclick="toggleTransactions(${envelope.id})">
                    View All Transactions ▼
                </button>
                <div class="transactions-list" id="transactions-${envelope.id}">
                    ${envelope.history.reverse().map(transaction => `
                        <div class="transaction-item">
                            <span class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</span>
                            <span class="transaction-type ${transaction.type}">${transaction.type}</span>
                            <span class="transaction-name" 
                                onclick="this.setAttribute('contenteditable', true)" 
                                onblur="updateTransactionName(${envelope.id}, '${transaction.date}', this.textContent)"
                                onkeypress="return event.keyCode != 13">
                                ${transaction.name || transaction.type}
                            </span>
                            <span class="transaction-amount ${transaction.type === 'deposit' ? 'positive' : 'negative'}">
                                ${transaction.type === 'deposit' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
                            </span>
                            <button class="transaction-delete" onclick="deleteTransaction(${envelope.id}, '${transaction.date}')">×</button>
                        </div>
                    `).join('')}
                </div>
            ` : '<div class="history-preview">No transactions yet</div>'}
        `;
        container.appendChild(el);
    });
}

// Toggle transaction list
function toggleTransactions(id) {
    const list = document.getElementById(`transactions-${id}`);
    const button = list.previousElementSibling;
    list.classList.toggle('expanded');
    button.textContent = list.classList.contains('expanded') ? 
        'Hide Transactions ▲' : 'View All Transactions ▼';
}

// Initialize app
window.addEventListener('load', () => {
    init();
    document.getElementById('achievements').classList.add('collapsed');
});

// Handle storage events
window.addEventListener('storage', (e) => {
    if (e.key === 'envelopes' || e.key === 'achievements' || e.key === 'theme') {
        initializeStorage();
        renderEnvelopes();
        updateTotalBalance();
        loadAchievements();
        if (e.key === 'theme') {
            loadTheme();
        }
    }
});

// Export envelope transactions to Excel (CSV)
function exportToExcel(id) {
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope || !envelope.history) return;

    // Prepare CSV content
    const headers = ['Date', 'Type', 'Name', 'Amount', 'Balance'];
    let csvContent = headers.join(',') + '\n';
    
    let runningBalance = 0;
    envelope.history.forEach(transaction => {
        const amount = transaction.type === 'deposit' ? transaction.amount : -transaction.amount;
        runningBalance += amount;
        
        const row = [
            new Date(transaction.date).toLocaleDateString(),
            transaction.type,
            `"${transaction.name || transaction.type}"`,
            amount.toFixed(2),
            runningBalance.toFixed(2)
        ];
        csvContent += row.join(',') + '\n';
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${envelope.name}_transactions.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import new envelope from CSV
function importNewEnvelope(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        
        // Skip header row and get first row for envelope info
        if (rows.length < 2) {
            alert('CSV file must contain at least one transaction');
            return;
        }

        // Calculate initial amount and create envelope
        let totalAmount = 0;
        const transactions = [];
        
        // Process all rows to build transaction history
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 4) continue; // Skip invalid rows
            
            const date = row[0];
            const type = row[1].toLowerCase();
            const name = row[2].replace(/"/g, '');
            const amount = Math.abs(parseFloat(row[3]));
            
            if (isNaN(amount)) continue;
            
            transactions.push({
                date: new Date(date).toISOString(),
                amount: amount,
                type: type,
                name: name
            });
            
            if (type === 'deposit') {
                totalAmount += amount;
            } else if (type === 'withdrawal') {
                totalAmount -= amount;
            }
        }

        // Create new envelope
        const envelope = {
            id: Date.now(),
            name: file.name.replace('.csv', ''),
            amount: totalAmount,
            goal: Math.max(totalAmount * 1.5, 1000), // Set a reasonable goal
            createdAt: new Date().toISOString(),
            history: transactions
        };
        
        envelopes.push(envelope);
        saveEnvelopes();
        renderEnvelopes();
        updateTotalBalance();
    };
    reader.readAsText(file);
    input.value = ''; // Reset file input
}

// Add slide animations
const slideStyle = document.createElement('style');
slideStyle.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(slideStyle);
