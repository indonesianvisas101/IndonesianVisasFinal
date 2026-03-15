# Spreadsheet Integration Guide (v2.2)

The syntax error "Invalid or unexpected token" usually happens if backticks (```) or other hidden characters are copied into the Apps Script editor. 

### Step-by-Step Instructions:

1. **Delete Everything**: Open your Google Sheets Apps Script editor, delete **all existing code** in `Kode.gs`.
2. **Copy Pure Code**: Copy only the code between the lines below (do not include the backticks).
3. **Save & Authorize**: Click the Save icon (floppy disk), then click the "Run" button to authorize the script.
4. **Deploy**: If you want it to run on a schedule, go to **Triggers** (Clock icon) and add a "Time-driven" trigger for `refreshAllData`.

---

### COPY THIS CODE (v2.2 CLEAN):

```javascript
/**
 * Dynamic Data Collection for Indonesian Visas
 * Version: 2.2 (Refined for Syntax Safety)
 */

function refreshAllData() {
  const CONFIG = {
    API_URL: "https://indonesianvisas.com/api/admin/reports/dynamic",
    SECRET: "YOUR_DYNAMIC_REPORT_SECRET", // Check your .env file for DYNAMIC_REPORT_SECRET
    UPDATE_LOG: true
  };

  updateSheet("orders", "Orders_Data", CONFIG);
  updateSheet("invoicing", "Financial_Data", CONFIG);
  updateSheet("users", "User_Base", CONFIG);
}

function updateSheet(type, sheetName, CONFIG) {
  const url = CONFIG.API_URL + "?type=" + type;
  const options = {
    "method": "get",
    "headers": {
      "x-dynamic-report-secret": CONFIG.SECRET
    },
    "muteHttpExceptions": true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const text = response.getContentText();
    const data = JSON.parse(text);
    
    if (data.error) {
      Logger.log("Error fetching " + type + ": " + data.error);
      return;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    sheet.clear();
    
    if (!data || data.length === 0) {
      Logger.log("No data found for " + type);
      return;
    }
    
    // Extract headers
    const headers = Object.keys(data[0]);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
    
    // Fill data
    const rows = data.map(function(item) {
      return headers.map(function(header) {
        const val = item[header];
        if (typeof val === 'object' && val !== null) return JSON.stringify(val);
        return val;
      });
    });
    
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    
    if (CONFIG.UPDATE_LOG) {
      Logger.log("Successfully updated " + sheetName + " with " + rows.length + " rows.");
    }
  } catch (e) {
    Logger.log("Exception in updateSheet " + type + ": " + e.toString());
  }
}
```
