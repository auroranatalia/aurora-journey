/**
 * Aurora Journey — Google Apps Script
 *
 * Setup:
 * 1. Create a new Google Sheet (this will store quiz responses)
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code into Code.gs
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and paste it into index.html
 *    replacing YOUR_APPS_SCRIPT_URL
 */

var SHEET_NAME = 'Responses';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = getOrCreateSheet();
    var data = JSON.parse(e.postData.contents);

    var row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.start || '',
      data.ai || '',
      data.hope || '',
      data.build_first || '',
      data.open_response || '',
      data.ref || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Email',
      'Where do you feel it most?',
      'AI familiarity',
      'What would it feel like?',
      'Build first',
      'Open response',
      'Referrer'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('1:1').setFontWeight('bold');
  }

  return sheet;
}

function doGet() {
  return ContentService
    .createTextOutput('Aurora Journey endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}
