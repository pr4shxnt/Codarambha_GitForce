const axios = require('axios');

// Supported currencies
const SUPPORTED_CURRENCIES = ['NPR', 'INR', 'USD'];

// Cache exchange rates for 1 hour
let ratesCache = {
    timestamp: 0,
    rates: {}
};

// You should replace this with your preferred forex API
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
// Fallback rates in case API is down (NOT FOR PRODUCTION)
const FALLBACK_RATES = {
    USD: 1,
    NPR: 132.50,  // As of 2025
    INR: 83.20    // As of 2025
};

/**
 * Fetch latest exchange rates from API
 */
async function updateExchangeRates() {
    try {
        // Check if cache is still valid (1 hour)
        if (Date.now() - ratesCache.timestamp < 3600000) {
            return ratesCache.rates;
        }

        const response = await axios.get(EXCHANGE_API_URL);
        const usdRates = response.data.rates;

        ratesCache = {
            timestamp: Date.now(),
            rates: usdRates
        };

        return usdRates;
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        // Use fallback rates if API fails
        return FALLBACK_RATES;
    }
}

/**
 * Convert amount between currencies
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!SUPPORTED_CURRENCIES.includes(fromCurrency) || !SUPPORTED_CURRENCIES.includes(toCurrency)) {
        throw new Error('Unsupported currency');
    }

    if (fromCurrency === toCurrency) {
        return amount;
    }

    const rates = await updateExchangeRates();

    // Convert to USD first (as base currency)
    const usdAmount = fromCurrency === 'USD' 
        ? amount 
        : amount / rates[fromCurrency];

    // Convert from USD to target currency
    const convertedAmount = toCurrency === 'USD'
        ? usdAmount
        : usdAmount * rates[toCurrency];

    // Round to 2 decimal places
    return Math.round(convertedAmount * 100) / 100;
}

/**
 * Get exchange rate between two currencies
 */
async function getExchangeRate(fromCurrency, toCurrency) {
    if (!SUPPORTED_CURRENCIES.includes(fromCurrency) || !SUPPORTED_CURRENCIES.includes(toCurrency)) {
        throw new Error('Unsupported currency');
    }

    const rates = await updateExchangeRates();

    if (fromCurrency === toCurrency) {
        return 1;
    }

    // Calculate cross rate through USD
    const rate = rates[toCurrency] / rates[fromCurrency];
    return Math.round(rate * 10000) / 10000; // Round to 4 decimal places
}

/**
 * Format amount with currency symbol
 */
function formatCurrency(amount, currency) {
    const symbols = {
        USD: '$',
        NPR: 'रू',
        INR: '₹'
    };

    const symbol = symbols[currency] || '';
    return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Validate if currency is supported
 */
function isSupportedCurrency(currency) {
    return SUPPORTED_CURRENCIES.includes(currency);
}

module.exports = {
    convertCurrency,
    getExchangeRate,
    formatCurrency,
    isSupportedCurrency,
    SUPPORTED_CURRENCIES
};