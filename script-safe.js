// SAFE PRODUCTION VERSION - NO API CALLS
// Disable all external API calls

// Override any potential API calls
window.addEventListener('DOMContentLoaded', function() {
    // Block all external fetch calls
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && (url.includes('script.google.com') || url.includes('googleapis.com'))) {
            return Promise.reject(new Error('External API calls disabled for production'));
        }
        return originalFetch.apply(this, arguments);
    };
    
    // Disable console in production
    if (window.location.hostname !== 'localhost') {
        console.log = console.warn = console.info = console.debug = function() {};
    }
});

// Safe demo-only investment functions
function getStockPrice() {
    const stockCode = document.getElementById('stock-code')?.value?.trim()?.toUpperCase();
    if (!stockCode) {
        showError('Masukkan kode saham terlebih dahulu');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        const demoData = getDemoStockData(stockCode);
        if (demoData) {
            showStockResult(demoData);
            showNotification(`📊 Data demo untuk ${stockCode}`, 'info');
        } else {
            showError('Data tidak tersedia. Coba IDX:BBCA, NASDAQ:AAPL, dll.');
        }
        hideLoading();
    }, 500);
}

function getDemoStockData(stockCode) {
    const demoStocks = {
        'IDX:BBCA': { kode: 'IDX:BBCA', harga: 9775, currency: 'IDR', success: true, source: 'demo', timestamp: new Date().toISOString() },
        'IDX:BMRI': { kode: 'IDX:BMRI', harga: 5850, currency: 'IDR', success: true, source: 'demo', timestamp: new Date().toISOString() },
        'NASDAQ:AAPL': { kode: 'NASDAQ:AAPL', harga: 150.25, currency: 'USD', success: true, source: 'demo', timestamp: new Date().toISOString() }
    };
    
    return demoStocks[stockCode] || null;
}

// Placeholder functions
function showLoading() { /* Add loading UI */ }
function hideLoading() { /* Remove loading UI */ }
function showError(msg) { alert('Error: ' + msg); }
function showNotification(msg, type) { console.log(msg); }
function showStockResult(data) { 
    if (document.getElementById('stock-symbol')) {
        document.getElementById('stock-symbol').textContent = data.kode;
    }
    if (document.getElementById('stock-price')) {
        document.getElementById('stock-price').textContent = data.currency === 'IDR' ? 
            `Rp ${data.harga.toLocaleString('id-ID')}` : 
            `$${data.harga.toFixed(2)}`;
    }
}
