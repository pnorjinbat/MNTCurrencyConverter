// MNT Currency Converter
(function() {
  'use strict';

  // Sample exchange rates (to be replaced with real API data)
  const currencies = {
    "MNT": { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", rate: 1 },
    "USD": { code: "USD", name: "US Dollar", symbol: "$", rate: 0.00029 },
    "EUR": { code: "EUR", name: "Euro", symbol: "€", rate: 0.00027 },
    "GBP": { code: "GBP", name: "British Pound", symbol: "£", rate: 0.00023 },
    "JPY": { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 0.044 },
    "CNY": { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 0.0021 },
    "KRW": { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 0.39 },
    "RUB": { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 0.029 },
    "CAD": { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 0.00041 },
    "AUD": { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 0.00045 }
  };

  // Initialize the converter
  function initConverter() {
    const container = document.getElementById('mnt-currency-converter');
    if (!container) return;

    container.innerHTML = createConverterHTML();
    setupEventListeners();
    updateResult();
  }

  // Create the HTML structure
  function createConverterHTML() {
    return `
      <div class="mnt-converter">
        <div class="mnt-converter-header">
          <div class="mnt-converter-header-top">
            <div>
              <h1 class="mnt-converter-title">MNT Currency Converter</h1>
              <p class="mnt-converter-subtitle">Convert Mongolian Tugrik to other currencies</p>
            </div>
            <div class="mnt-converter-flag">
              <svg width="32" height="24" viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="24" fill="#CE1126"/>
                <rect x="10.67" width="10.67" height="24" fill="#0066CC"/>
                <rect x="21.33" width="10.67" height="24" fill="#CE1126"/>
                <g fill="#FFD700">
                  <circle cx="5.33" cy="6" r="1"/>
                  <circle cx="5.33" cy="12" r="1"/>
                  <circle cx="5.33" cy="18" r="1"/>
                  <rect x="4.5" y="8.5" width="1.67" height="7" rx="0.2"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div class="mnt-converter-body">
          <div class="mnt-converter-form">
            <label class="mnt-converter-form-label">Amount to Convert</label>
            <div class="mnt-converter-input-group">
              <div class="mnt-converter-input-wrapper">
                <span class="mnt-converter-input-symbol" id="mnt-from-symbol">₮</span>
                <input type="number" class="mnt-converter-input" id="mnt-amount-from" value="1000" placeholder="0">
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
                <input type="number" class="mnt-converter-input" id="mnt-amount-to" value="0.29" placeholder="0">
                <select class="mnt-converter-select" id="mnt-currency-to">
                  ${Object.keys(currencies).map(code => 
                    `<option value="${code}" ${code === 'USD' ? 'selected' : ''}>${code}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>
          
          <div class="mnt-converter-warning" id="mnt-warning">
            Please select MNT as one of the currencies for conversion.
          </div>
          
          <div class="mnt-converter-results" id="mnt-results">
            <h2 class="mnt-converter-results-title">Conversion Result</h2>
            <div class="mnt-converter-result-row">
              <span id="mnt-result-from">1,000 MNT</span>
              <span style="font-weight: bold">=</span>
              <span class="mnt-converter-result-amount" id="mnt-result-to">0.29 USD</span>
            </div>
            <div class="mnt-converter-result-row">
              <span>Exchange Rate:</span>
              <span class="mnt-converter-result-rate" id="mnt-result-rate">1 MNT = 0.000290 USD</span>
            </div>
          </div>

          <div class="mnt-converter-currencies">
            <h2 class="mnt-converter-currencies-title">Popular Currencies</h2>
            <div class="mnt-converter-currencies-grid">
              ${Object.entries(currencies).filter(([code]) => code !== 'MNT').slice(0, 6).map(([code, currency]) => `
                <div class="mnt-converter-currency-card" data-currency="${code}">
                  <div class="mnt-converter-currency-code">${code}</div>
                  <div class="mnt-converter-currency-name">${currency.name}</div>
                  <div class="mnt-converter-currency-rate">1 MNT = ${formatNumber(currency.rate, 6)} ${code}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mnt-converter-refresh">
            <button class="mnt-converter-refresh-button" id="mnt-refresh-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Refresh Rates
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Helper functions
  function formatNumber(number, decimals = 2) {
    return parseFloat(number).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function parseNumberWithCommas(value) {
    return parseFloat(String(value).replace(/,/g, '')) || 0;
  }

  function formatInputValue(input, decimals = 2) {
    const value = parseNumberWithCommas(input.value);
    if (!isNaN(value) && value >= 0) {
      input.value = formatNumber(value, decimals);
    }
  }

  function getCurrencySymbol(code) {
    return currencies[code]?.symbol || '';
  }

  function getCurrencyName(code) {
    return currencies[code]?.name || '';
  }

  // Convert currency
  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!currencies[fromCurrency] || !currencies[toCurrency]) return 0;
    
    // Convert to MNT first (if not already MNT)
    const amountInMNT = fromCurrency === "MNT" ? amount : amount / currencies[fromCurrency].rate;
    
    // Then convert from MNT to target currency
    return toCurrency === "MNT" ? amountInMNT : amountInMNT * currencies[toCurrency].rate;
  }

  // Update conversion result with smart validation
  function updateResult() {
    const fromAmount = parseNumberWithCommas(document.getElementById('mnt-amount-from').value) || 0;
    const fromCurrency = document.getElementById('mnt-currency-from').value;
    const toCurrency = document.getElementById('mnt-currency-to').value;
    
    const warningElement = document.getElementById('mnt-warning');
    const resultsElement = document.getElementById('mnt-results');
    
    // Smart validation: at least one currency must be MNT and they can't be the same
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
    
    // Update currency symbols
    document.getElementById('mnt-from-symbol').textContent = getCurrencySymbol(fromCurrency);
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
    
    // From currency change with smart validation
    document.getElementById('mnt-currency-from').addEventListener('change', function() {
      const fromCurrency = this.value;
      const toCurrency = document.getElementById('mnt-currency-to').value;
      
      // Smart correction: if same currency or neither is MNT, fix it
      if (fromCurrency === toCurrency || (fromCurrency !== 'MNT' && toCurrency !== 'MNT')) {
        document.getElementById('mnt-currency-to').value = fromCurrency === 'MNT' ? 'USD' : 'MNT';
      }
      
      updateResult();
    });
    
    // To currency change with smart validation
    document.getElementById('mnt-currency-to').addEventListener('change', function() {
      const fromCurrency = document.getElementById('mnt-currency-from').value;
      const toCurrency = this.value;
      
      // Smart correction: if same currency or neither is MNT, fix it
      if (fromCurrency === toCurrency || (fromCurrency !== 'MNT' && toCurrency !== 'MNT')) {
        document.getElementById('mnt-currency-from').value = toCurrency === 'MNT' ? 'USD' : 'MNT';
      }
      
      updateResult();
    });
    
    // Swap currencies button
    document.getElementById('mnt-swap-button').addEventListener('click', function() {
      const fromCurrency = document.getElementById('mnt-currency-from');
      const toCurrency = document.getElementById('mnt-currency-to');
      const fromAmount = document.getElementById('mnt-amount-from');
      const toAmount = document.getElementById('mnt-amount-to');
      
      // Swap values
      const tempCurrency = fromCurrency.value;
      const tempAmount = fromAmount.value;
      
      fromCurrency.value = toCurrency.value;
      toCurrency.value = tempCurrency;
      fromAmount.value = toAmount.value;
      
      updateResult();
    });
    
    // Currency card clicks
    document.querySelectorAll('.mnt-converter-currency-card').forEach(card => {
      card.addEventListener('click', function() {
        const currency = this.dataset.currency;
        const fromCurrency = document.getElementById('mnt-currency-from').value;
        
        if (fromCurrency === 'MNT') {
          document.getElementById('mnt-currency-to').value = currency;
        } else {
          document.getElementById('mnt-currency-from').value = currency;
        }
        
        updateResult();
      });
    });
    
    // Refresh button
    document.getElementById('mnt-refresh-button').addEventListener('click', function() {
      // In a real implementation, this would fetch new rates from API
      updateResult();
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConverter);
  } else {
    initConverter();
  }

})();