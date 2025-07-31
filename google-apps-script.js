/**
 * Google Apps Script untuk mengambil harga saham menggunakan GOOGLEFINANCE
 * Deploy sebagai Web App dengan akses "Anyone" atau "Anyone with Google account"
 * 
 * URL format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?kode=IDX:BBCA
 */

function doGet(e) {
  try {
    // Ambil parameter kode dari URL, default ke IDX:BBCA jika kosong
    let kode = e.parameter.kode || 'IDX:BBCA';
    
    // Bersihkan dan validasi kode
    kode = kode.trim().toUpperCase();
    
    // Validasi format kode saham
    if (!isValidStockCode(kode)) {
      return createErrorResponse('Format kode saham tidak valid. Gunakan format seperti IDX:BBCA atau NASDAQ:AAPL');
    }
    
    // Ambil harga menggunakan GOOGLEFINANCE langsung
    let harga;
    try {
      // Cara lebih sederhana tanpa membuat spreadsheet temporary
      const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Sample spreadsheet ID
      const range = 'A1';
      
      // Gunakan GOOGLEFINANCE langsung
      harga = getStockPriceDirectly(kode);
      
      if (harga === null || harga === undefined || isNaN(harga) || harga <= 0) {
        return createErrorResponse(`Data untuk kode "${kode}" tidak ditemukan atau tidak tersedia`);
      }
      
    } catch (error) {
      console.error('Error getting stock price:', error);
      return createErrorResponse(`Tidak dapat mengambil data untuk kode "${kode}": ${error.message}`);
    }
    
    // Return response sukses
    return createSuccessResponse(kode, harga);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return createErrorResponse('Terjadi kesalahan server: ' + error.message);
  }
}

/**
 * Ambil harga saham langsung menggunakan GOOGLEFINANCE
 */
function getStockPriceDirectly(kode) {
  try {
    // Buat spreadsheet baru temporary atau gunakan yang sudah ada
    let spreadsheet;
    try {
      // Coba buat spreadsheet temporary
      spreadsheet = SpreadsheetApp.create('TempStock_' + Date.now());
    } catch (e) {
      // Jika gagal, coba gunakan spreadsheet yang sudah ada
      const files = DriveApp.getFilesByName('TempStockData');
      if (files.hasNext()) {
        spreadsheet = SpreadsheetApp.openById(files.next().getId());
      } else {
        throw new Error('Cannot create or access spreadsheet');
      }
    }
    
    const sheet = spreadsheet.getActiveSheet();
    
    // Set formula GOOGLEFINANCE
    const formula = `=GOOGLEFINANCE("${kode}")`;
    sheet.getRange('A1').setFormula(formula);
    
    // Tunggu sebentar untuk eksekusi
    Utilities.sleep(2000);
    
    // Ambil nilai
    const value = sheet.getRange('A1').getValue();
    
    // Cleanup - hapus spreadsheet
    try {
      DriveApp.getFileById(spreadsheet.getId()).setTrashed(true);
    } catch (cleanupError) {
      console.log('Cleanup warning:', cleanupError);
    }
    
    // Return nilai
    if (typeof value === 'number' && !isNaN(value) && value > 0) {
      return value;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error in getStockPriceDirectly:', error);
    throw error;
  }
}

/**
 * Validasi format kode saham
 */
function isValidStockCode(kode) {
  // Format yang diizinkan: IDX:KODE, NASDAQ:KODE, NYSE:KODE, dll
  const pattern = /^[A-Z]+:[A-Z0-9]+$/;
  return pattern.test(kode);
}

/**
 * Buat response sukses dalam format JSON
 */
function createSuccessResponse(kode, harga) {
  const response = {
    success: true,
    kode: kode,
    harga: harga,
    timestamp: new Date().toISOString(),
    currency: getCurrency(kode)
  };
  
  try {
    const output = ContentService.createTextOutput(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (e) {
    // Fallback jika setMimeType bermasalah
    return ContentService.createTextOutput(JSON.stringify(response));
  }
}

/**
 * Buat response error dalam format JSON
 */
function createErrorResponse(message) {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  try {
    const output = ContentService.createTextOutput(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (e) {
    // Fallback jika setMimeType bermasalah
    return ContentService.createTextOutput(JSON.stringify(response));
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
  } else {
    return 'USD'; // Default
  }
}

/**
 * Fungsi untuk testing (opsional)
 */
function testFunction() {
  const testEvent = {
    parameter: {
      kode: 'IDX:BBCA'
    }
  };
  
  const result = doGet(testEvent);
  console.log(result.getContent());
}
