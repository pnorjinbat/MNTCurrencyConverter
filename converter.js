// MNT Currency Converter for Webflow
document.addEventListener('DOMContentLoaded', function() {
  // Currency data
  const currencies = {
    MNT: { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", rate: 1 },
    USD: { code: "USD", name: "US Dollar", symbol: "$", rate: 0.00029 },
    EUR: { code: "EUR", name: "Euro", symbol: "€", rate: 0.00026 },
    CNY: { code: "Chinese Yuan", name: "Chinese Yuan", symbol: "¥", rate: 0.0021 },
    RUB: { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 0.026 },
    JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 0.041 },
    GBP: { code: "GBP", name: "British Pound", symbol: "£", rate: 0.00022 }
  };

  // Init converter
  function initConverter() {
    // Find container
    const container = document.getElementById('mnt-currency-converter');
    if (!container) return;

    // Set last updated date
    const lastUpdated = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' MNT';

    // Render converter HTML
    container.innerHTML = `
      <div class="mnt-converter">
        <div class="mnt-converter-header">
          <div class="mnt-converter-header-top">
            <h1 class="mnt-converter-title">MNT Currency Converter</h1>
            <span>Bank of Mongolia Rates</span>
          </div>
          <p class="mnt-converter-subtitle">Convert between Mongolian Tugrik (MNT) and major currencies</p>
          <div class="mnt-converter-last-updated">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mnt-refresh-icon">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
            Last updated: ${lastUpdated}
          </div>
        </div>
        
        <div class="mnt-converter-body">
          <div class="mnt-converter-form">
            <label class="mnt-converter-form-label">From</label>
            <div class="mnt-converter-input-group">
              <div class="mnt-converter-input-wrapper">
                <span class="mnt-converter-input-symbol">₮</span>
                <input type="number" class="mnt-converter-input" id="mnt-amount-from" value="1000">
                <select class="mnt-converter-select" id="mnt-currency-from">
                  ${Object.keys(currencies).map(code => 
                    `<option value="${code}" ${code === 'MNT' ? 'selected' : ''}>${code}</option>`
                  ).join('')}
                </select>
              </div>
              
              <button class="mnt-converter-swap-button" id="mnt-swap-button" title="Swap currencies">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3L4 7l4 4"></path>
                  <path d="M4 7h16"></path>
                  <path d="m16 21 4-4-4-4"></path>
                  <path d="M20 17H4"></path>
                </svg>
              </button>
              
              <div class="mnt-converter-input-wrapper">
                <span class="mnt-converter-input-symbol" id="mnt-to-symbol">$</span>
                <input type="number" class="mnt-converter-input" id="mnt-amount-to" value="0.29">
                <select class="mnt-converter-select" id="mnt-currency-to">
                  ${Object.keys(currencies).map(code => 
                    `<option value="${code}" ${code === 'USD' ? 'selected' : ''}>${code}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>
          
          <div class="mnt-converter-warning" id="mnt-warning" style="display: none;">
            Please select MNT as one of the currencies for conversion.
          </div>
          
          <div class="mnt-converter-results">
            <h2 class="mnt-converter-results-title">Conversion Result</h2>
            <div class="mnt-converter-result-row">
              <span id="mnt-result-from">1,000 MNT</span>
              <span class="font-bold">=</span>
              <span class="mnt-converter-result-amount" id="mnt-result-to">0.29 USD</span>
            </div>
            <div class="mnt-converter-result-row">
              <span>Exchange Rate:</span>
              <span class="mnt-converter-result-rate" id="mnt-result-rate">1 MNT = 0.00029 USD</span>
            </div>
          </div>
          
          <div class="mnt-converter-currencies">
            <h2 class="mnt-converter-currencies-title">Popular Currencies</h2>
            <div class="mnt-converter-currencies-grid">
              ${['USD', 'EUR', 'CNY', 'RUB', 'JPY', 'GBP'].map(code => `
                <div class="mnt-converter-currency-card" data-currency="${code}">
                  <div class="mnt-converter-currency-card-content">
                    <div class="mnt-converter-currency-flag mnt-bg-${code.toLowerCase()}">
                      <div class="mnt-converter-currency-code ${code === 'JPY' ? 'mnt-text-red' : code === 'RUB' ? 'mnt-text-blue' : 'mnt-text-white'}">${code}</div>
                    </div>
                    <div class="mnt-converter-currency-info">
                      <div class="mnt-converter-currency-name">${currencies[code].name}</div>
                      <div class="mnt-converter-currency-rate">₮1 = ${currencies[code].rate.toFixed(6)}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="mnt-converter-footer">
          <div class="mnt-converter-footer-info">
            <p>Data provided by the Bank of Mongolia</p>
          </div>
          <button class="mnt-converter-refresh-button" id="mnt-refresh-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mnt-refresh-icon">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
            Refresh Rates
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    setupEventListeners();
  }

  // Helper functions
  function formatNumber(number, decimals = 2) {
    return parseFloat(number).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function parseNumberWithCommas(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
  }

  function formatInputValue(input, decimals = 2) {
    const value = parseNumberWithCommas(input.value);
    if (!isNaN(value)) {
      input.value = formatNumber(value, decimals);
    }
  }

  function getCurrencySymbol(code) {
    return currencies[code]?.symbol || '';
  }

  // Convert currency
  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!currencies[fromCurrency] || !currencies[toCurrency]) return 0;
    
    // Convert to MNT first (if not already MNT)
    const amountInMNT = fromCurrency === "MNT" ? amount : amount / currencies[fromCurrency].rate;
    
    // Then convert from MNT to target currency
    return toCurrency === "MNT" ? amountInMNT : amountInMNT * currencies[toCurrency].rate;
  }

  // Update conversion result
  function updateResult() {
    const fromAmount = parseNumberWithCommas(document.getElementById('mnt-amount-from').value);
    const fromCurrency = document.getElementById('mnt-currency-from').value;
    const toCurrency = document.getElementById('mnt-currency-to').value;
    
    const warningElement = document.getElementById('mnt-warning');
    const resultsElement = document.querySelector('.mnt-converter-results');
    
    // Check if at least one currency is MNT and they're not the same
    if (fromCurrency === toCurrency || (fromCurrency !== 'MNT' && toCurrency !== 'MNT')) {
      warningElement.style.display = 'block';
      resultsElement.style.display = 'none';
      return;
    } else {
      warningElement.style.display = 'none';
      resultsElement.style.display = 'block';
    }
    
    const result = convertCurrency(fromAmount, fromCurrency, toCurrency);
    document.getElementById('mnt-amount-to').value = formatNumber(result, 2);
    
    // Update result display
    document.getElementById('mnt-result-from').textContent = 
      `${formatNumber(fromAmount, 0)} ${fromCurrency}`;
    document.getElementById('mnt-result-to').textContent = 
      `${formatNumber(result, 2)} ${toCurrency}`;
    
    // Update exchange rate display
    const rate = convertCurrency(1, fromCurrency, toCurrency);
    document.getElementById('mnt-result-rate').textContent = 
      `1 ${fromCurrency} = ${formatNumber(rate, 6)} ${toCurrency}`;
    
    // Update to currency symbol
    document.getElementById('mnt-to-symbol').textContent = getCurrencySymbol(toCurrency);
  }

  // Set up event listeners
  function setupEventListeners() {
    // From amount change
    document.getElementById('mnt-amount-from').addEventListener('input', function() {
      updateResult();
    });
    
    // From amount formatting on blur
    document.getElementById('mnt-amount-from').addEventListener('blur', function() {
      formatInputValue(this, 2);
      updateResult();
    });
    
    // From amount formatting on input (for live comma formatting)
    document.getElementById('mnt-amount-from').addEventListener('input', function() {
      // Only format if user paused typing (debounced)
      clearTimeout(this.formatTimeout);
      this.formatTimeout = setTimeout(() => {
        const cursorPos = this.selectionStart;
        const oldValue = this.value;
        formatInputValue(this, 2);
        // Restore cursor position after formatting
        const newValue = this.value;
        const diff = newValue.length - oldValue.length;
        this.setSelectionRange(cursorPos + diff, cursorPos + diff);
      }, 500);
    });
    
    // To amount change
    document.getElementById('mnt-amount-to').addEventListener('input', function() {
      const toAmount = parseNumberWithCommas(this.value);
      const fromCurrency = document.getElementById('mnt-currency-from').value;
      const toCurrency = document.getElementById('mnt-currency-to').value;
      
      const fromAmount = convertCurrency(toAmount, toCurrency, fromCurrency);
      document.getElementById('mnt-amount-from').value = formatNumber(fromAmount, 2);
      
      updateResult();
    });
    
    // To amount formatting on blur
    document.getElementById('mnt-amount-to').addEventListener('blur', function() {
      formatInputValue(this, 2);
      updateResult();
    });
    
    // To amount formatting on input (for live comma formatting)
    document.getElementById('mnt-amount-to').addEventListener('input', function() {
      clearTimeout(this.formatTimeout);
      this.formatTimeout = setTimeout(() => {
        const cursorPos = this.selectionStart;
        const oldValue = this.value;
        formatInputValue(this, 2);
        const newValue = this.value;
        const diff = newValue.length - oldValue.length;
        this.setSelectionRange(cursorPos + diff, cursorPos + diff);
      }, 500);
    });
    
    // From currency change
    document.getElementById('mnt-currency-from').addEventListener('change', function() {
      const fromCurrency = this.value;
      const toCurrency = document.getElementById('mnt-currency-to').value;
      
      // If same currency or neither is MNT, fix it
      if (fromCurrency === toCurrency || (fromCurrency !== 'MNT' && toCurrency !== 'MNT')) {
        document.getElementById('mnt-currency-to').value = fromCurrency === 'MNT' ? 'USD' : 'MNT';
      }
      
      document.getElementById('mnt-from-symbol').textContent = getCurrencySymbol(fromCurrency);
      updateResult();
    });
    
    // To currency change
    document.getElementById('mnt-currency-to').addEventListener('change', function() {
      const fromCurrency = document.getElementById('mnt-currency-from').value;
      const toCurrency = this.value;
      
      // If same currency or neither is MNT, fix it
      if (fromCurrency === toCurrency || (fromCurrency !== 'MNT' && toCurrency !== 'MNT')) {
        document.getElementById('mnt-currency-from').value = toCurrency === 'MNT' ? 'USD' : 'MNT';
        document.getElementById('mnt-from-symbol').textContent = getCurrencySymbol(toCurrency === 'MNT' ? 'USD' : 'MNT');
      }
      
      updateResult();
    });
    
    // Swap currencies
    document.getElementById('mnt-swap-button').addEventListener('click', function() {
      const fromCurrency = document.getElementById('mnt-currency-from');
      const toCurrency = document.getElementById('mnt-currency-to');
      const fromAmount = document.getElementById('mnt-amount-from');
      const toAmount = document.getElementById('mnt-amount-to');
      
      // Swap values
      const tempCurrency = fromCurrency.value;
      fromCurrency.value = toCurrency.value;
      toCurrency.value = tempCurrency;
      
      const tempAmount = fromAmount.value;
      fromAmount.value = toAmount.value;
      toAmount.value = tempAmount;
      
      updateResult();
    });
    
    // Currency card selection
    document.querySelectorAll('.mnt-converter-currency-card').forEach(card => {
      card.addEventListener('click', function() {
        const currency = this.dataset.currency;
        document.getElementById('mnt-currency-to').value = currency;
        updateResult();
      });
    });
    
    // Refresh button (simulates refresh)
    document.getElementById('mnt-refresh-button').addEventListener('click', function() {
      const button = this;
      const icon = button.querySelector('.mnt-refresh-icon');
      
      // Add spinning animation
      icon.classList.add('mnt-animate-spin');
      button.disabled = true;
      
      // Simulate refresh after 1 second
      setTimeout(() => {
        // Update last updated time
        const lastUpdated = new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' MNT';
        
        document.querySelector('.mnt-converter-last-updated').innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mnt-refresh-icon">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          Last updated: ${lastUpdated}
        `;
        
        // Stop animation
        icon.classList.remove('mnt-animate-spin');
        button.disabled = false;
        
        // Update results
        updateResult();
      }, 1000);
    });
  }

  // Initialize the converter
  initConverter();
});