const API_URL = 'http://localhost:5000/api';

// Load envelopes from API
async function loadEnvelopes() {
    try {
        const response = await fetch(`${API_URL}/envelopes`);
        if (!response.ok) throw new Error('Failed to load envelopes');
        return await response.json();
    } catch (error) {
        console.error('Error loading envelopes:', error);
        return [];
    }
}

// Save envelope to API
async function saveEnvelope(envelope) {
    try {
        const response = await fetch(`${API_URL}/envelopes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(envelope)
        });
        if (!response.ok) throw new Error('Failed to save envelope');
        return await response.json();
    } catch (error) {
        console.error('Error saving envelope:', error);
        throw error;
    }
}

// Update envelope in API
async function updateEnvelopeAPI(id, data) {
    try {
        const response = await fetch(`${API_URL}/envelopes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update envelope');
        return await response.json();
    } catch (error) {
        console.error('Error updating envelope:', error);
        throw error;
    }
}

// Delete envelope from API
async function deleteEnvelopeAPI(id) {
    try {
        const response = await fetch(`${API_URL}/envelopes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete envelope');
    } catch (error) {
        console.error('Error deleting envelope:', error);
        throw error;
    }
}

// Load transactions for envelope
async function loadTransactions(envelopeId) {
    try {
        const response = await fetch(`${API_URL}/envelopes/${envelopeId}/transactions`);
        if (!response.ok) throw new Error('Failed to load transactions');
        return await response.json();
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
}

// Add transaction to envelope
async function addTransaction(envelopeId, transaction) {
    try {
        const response = await fetch(`${API_URL}/envelopes/${envelopeId}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        if (!response.ok) throw new Error('Failed to add transaction');
        return await response.json();
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
}

// Load achievements from API
async function loadAchievements() {
    try {
        const response = await fetch(`${API_URL}/achievements`);
        if (!response.ok) throw new Error('Failed to load achievements');
        return await response.json();
    } catch (error) {
        console.error('Error loading achievements:', error);
        return [];
    }
}

// Update achievement in API
async function updateAchievement(id, data) {
    try {
        const response = await fetch(`${API_URL}/achievements/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update achievement');
        return await response.json();
    } catch (error) {
        console.error('Error updating achievement:', error);
        throw error;
    }
}

// Initialize the app
let envelopes = [];
let achievements = [];

async function init() {
    try {
        envelopes = await loadEnvelopes();
        achievements = await loadAchievements();
        renderEnvelopes();
        updateTotalBalance();
        loadTheme();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Failed to load data from server. Please try again later.');
    }
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

// Update total balance
function updateTotalBalance() {
    const total = envelopes.reduce((sum, env) => sum + env.budget - env.spent, 0);
    const totalBudget = envelopes.reduce((sum, env) => sum + env.budget, 0);
    const progress = totalBudget > 0 ? ((totalBudget - total) / totalBudget) * 100 : 0;
    
    const balanceEl = document.querySelector('.balance-amount');
    balanceEl.textContent = formatCurrency(total);
    balanceEl.innerHTML += `<div class="balance-progress">Progress to Goals: ${progress.toFixed(1)}%</div>`;
    
    balanceEl.style.animation = 'none';
    balanceEl.offsetHeight;
    balanceEl.style.animation = 'pulse 0.5s ease-out';
}

// Add new envelope
async function addEnvelope() {
    const nameInput = document.getElementById('envelope-name');
    const budgetInput = document.getElementById('envelope-amount');
    
    const name = nameInput.value.trim();
    const budget = parseFloat(budgetInput.value);
    
    if (!name || isNaN(budget) || budget < 0) {
        alert('Please enter a valid name and budget');
        return;
    }

    try {
        const envelope = await saveEnvelope({ name, budget, spent: 0 });
        envelopes.push(envelope);
        renderEnvelopes();
        updateTotalBalance();
        
        nameInput.value = '';
        budgetInput.value = '';
    } catch (error) {
        alert('Failed to create envelope. Please try again.');
    }
}

// Update envelope amount
async function updateEnvelope(id, action, value) {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope) return;
    
    try {
        const transaction = {
            amount: action === 'add' ? amount : -amount,
            description: action === 'add' ? 'Deposit' : 'Withdrawal',
            date: new Date().toISOString()
        };
        
        await addTransaction(id, transaction);
        const updatedEnvelope = await loadEnvelopes();
        envelopes = updatedEnvelope;
        renderEnvelopes();
        updateTotalBalance();
    } catch (error) {
        alert('Failed to update envelope. Please try again.');
    }
}

// Delete envelope
async function deleteEnvelope(id) {
    if (!confirm('Are you sure you want to delete this envelope?')) return;
    
    try {
        await deleteEnvelopeAPI(id);
        envelopes = envelopes.filter(e => e.id !== id);
        renderEnvelopes();
        updateTotalBalance();
    } catch (error) {
        alert('Failed to delete envelope. Please try again.');
    }
}

// Export envelope transactions to CSV
async function exportToExcel(id) {
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope) return;

    try {
        const transactions = await loadTransactions(id);
        
        // Prepare CSV content
        const headers = ['Date', 'Type', 'Description', 'Amount', 'Balance'];
        let csvContent = headers.join(',') + '\n';
        
        let runningBalance = 0;
        transactions.forEach(transaction => {
            const amount = transaction.amount;
            runningBalance += amount;
            
            const row = [
                new Date(transaction.date).toLocaleDateString(),
                amount > 0 ? 'deposit' : 'withdrawal',
                `"${transaction.description}"`,
                Math.abs(amount).toFixed(2),
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
    } catch (error) {
        console.error('Failed to export transactions:', error);
        alert('Failed to export transactions. Please try again.');
    }
}

// Render envelopes
function renderEnvelopes() {
    const container = document.getElementById('envelopes-list');
    container.innerHTML = '';
    
    envelopes.forEach(envelope => {
        const progress = envelope.budget > 0 ? (envelope.spent / envelope.budget) * 100 : 0;
        
        const el = document.createElement('div');
        el.className = 'envelope';
        
        el.innerHTML = `
            <h2 class="envelope-name">${envelope.name}</h2>
            <div class="amount">Available: ${formatCurrency(envelope.budget - envelope.spent)}</div>
            <div class="goal-info">Budget: ${formatCurrency(envelope.budget)}</div>
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
        `;
        container.appendChild(el);
    });
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

// Initialize app
window.addEventListener('load', init);
