/**
 * Google Apps Script - Stock Price API
 * Versi Sederhana dan Robust
 * 
 * Deploy sebagai Web App dengan akses "Anyone"
 * URL: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?kode=IDX:BBCA
 */

function doGet(e) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  try {
    // Ambil parameter kode dari URL
    let kode = 'IDX:BBCA'; // default
    if (e && e.parameter && e.parameter.kode) {
      kode = e.parameter.kode.trim().toUpperCase();
    }
    
    // Validasi format kode saham
    if (!kode.match(/^[A-Z]+:[A-Z0-9]+$/)) {
      return createResponse({
        success: false,
        error: 'Format kode saham tidak valid. Gunakan format seperti IDX:BBCA atau NASDAQ:AAPL'
      });
    }
    
    // Ambil harga saham
    const harga = getStockPrice(kode);
    
    if (harga === null || harga === undefined || isNaN(harga) || harga <= 0) {
      return createResponse({
        success: false,
        error: `Data untuk kode "${kode}" tidak ditemukan atau tidak tersedia`
      });
    }
    
    // Response sukses
    return createResponse({
      success: true,
      kode: kode,
      harga: harga,
      timestamp: new Date().toISOString(),
      currency: getCurrency(kode)
    });
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return createResponse({
      success: false,
      error: 'Terjadi kesalahan server: ' + error.toString()
    });
  }
}

/**
 * Ambil harga saham menggunakan GOOGLEFINANCE
 */
function getStockPrice(kode) {
  let spreadsheet = null;
  
  try {
    // Buat spreadsheet temporary
    spreadsheet = SpreadsheetApp.create('StockTemp_' + Date.now());
    const sheet = spreadsheet.getActiveSheet();
    
    // Set formula GOOGLEFINANCE (tanpa parameter "price" - lebih reliable)
    sheet.getRange('A1').setFormula(`=GOOGLEFINANCE("${kode}")`);
    
    // Tunggu sebentar untuk eksekusi
    Utilities.sleep(2500);
    
    // Ambil nilai
    const value = sheet.getRange('A1').getValue();
    
    // Return hasil
    if (typeof value === 'number' && !isNaN(value) && value > 0) {
      return value;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error getting stock price:', error);
    return null;
  } finally {
    // Cleanup spreadsheet
    if (spreadsheet) {
      try {
        DriveApp.getFileById(spreadsheet.getId()).setTrashed(true);
      } catch (cleanupError) {
        console.log('Cleanup error:', cleanupError);
      }
    }
  }
}

/**
 * Tentukan mata uang berdasarkan kode saham
 */
function getCurrency(kode) {
  if (kode.startsWith('IDX:')) {
    return 'IDR';
  } else if (kode.startsWith('NASDAQ:') || kode.startsWith('NYSE:')) {
    return 'USD';
  }
  return 'USD'; // Default
}

/**
 * Buat response dengan handling error yang robust
 */
function createResponse(data) {
  try {
    const jsonString = JSON.stringify(data);
    const output = ContentService.createTextOutput(jsonString);
    
    // Coba set MIME type, tapi tidak critical jika gagal
    try {
      output.setMimeType(ContentService.MimeType.JSON);
    } catch (mimeError) {
      console.log('MIME type error (non-critical):', mimeError);
    }
    
    return output;
    
  } catch (error) {
    console.error('Error creating response:', error);
    // Fallback response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: 'Error creating response: ' + error.toString()
      })
    );
  }
}

/**
 * Test function untuk development
 */
function testStockPrice() {
  const testCases = ['IDX:BBCA', 'NASDAQ:AAPL', 'IDX:BMRI'];
  
  testCases.forEach(kode => {
    console.log(`Testing ${kode}:`);
    const price = getStockPrice(kode);
    console.log(`Result: ${price}`);
  });
}

/**
 * Test doGet function
 */
function testDoGet() {
  const testEvent = {
    parameter: {
      kode: 'IDX:BBCA'
    }
  };
  
  const result = doGet(testEvent);
  console.log('Test result:', result.getContent());
}
