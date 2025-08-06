// Additional fix for daily limit display
// This script ensures the daily limit display is updated properly

// Function to force update daily limit display
function forceUpdateDailyLimit() {
    console.log('Force updating daily limit display...');
    
    // First, recalculate today's expenses
    const today = new Date();
    const todayString = today.toDateString();
    const todayFormatted = today.toLocaleDateString('id-ID');
    
    // Get all expenses for today
    const todayExpenses = transactions.filter(t => {
        if (t.type !== 'expense') return false;
        
        let isToday = false;
        
        // Check formattedDate
        if (t.formattedDate === todayFormatted) {
            isToday = true;
        }
        
        // Check date field as fallback
        if (!isToday && t.date) {
            const transactionDate = new Date(t.date).toDateString();
            isToday = transactionDate === todayString;
        }
        
        return isToday;
    });
    
    console.log('Today expenses found:', todayExpenses.length, 'transactions');
    const totalToday = todayExpenses.reduce((sum, t) => sum + t.amount, 0);
    console.log('Total today expenses:', totalToday);
    
    // Force update the display elements
    if (dailyLimitSettings && dailyLimitSettings.enabled) {
        const remaining = Math.max(0, dailyLimitSettings.amount - totalToday);
        const percentage = Math.min(100, (totalToday / dailyLimitSettings.amount) * 100);
        
        // Update all relevant elements
        const elements = {
            'daily-spent-amount': formatCurrency(totalToday),
            'daily-limit-amount': formatCurrency(dailyLimitSettings.amount),
            'daily-remaining-amount': formatCurrency(remaining),
            'daily-progress-percentage': `${percentage.toFixed(1)}%`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                console.log(`Updated ${id}:`, value);
            }
        });
        
        // Update progress bar
        const progressBar = document.getElementById('daily-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        // Show/hide the spending card
        const spendingCard = document.getElementById('daily-spending-card');
        if (spendingCard) {
            spendingCard.classList.remove('hidden');
        }
    }
}

// Add event listener to ensure daily limit is updated after any transaction
if (typeof window !== 'undefined') {
    // Override the original addExpense function to include our fix
    const originalAddExpense = window.addExpense;
    if (originalAddExpense) {
        window.addExpense = function(event) {
            const result = originalAddExpense.call(this, event);
            setTimeout(() => {
                forceUpdateDailyLimit();
            }, 200);
            return result;
        };
    }
    
    // Also add to window for manual calling
    window.forceUpdateDailyLimit = forceUpdateDailyLimit;
}
