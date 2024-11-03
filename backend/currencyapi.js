// currencyConverter.js
const axios = require('axios');
const express = require('express');
const router = express.Router();

// Replace with your actual API key from Currency API
const API_KEY = process.env.CURRENCY_API;
const BASE_URL = `https://api.currencyapi.com/v3/latest`;

async function convertCurrency(fromCurrency, toCurrency, amount) {
    try {
        // Make the request to the Currency API
        const response = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                base_currency: fromCurrency,
                currencies: toCurrency,
            },
        });

        // Extract the exchange rate
        const exchangeRate = response.data.data[toCurrency].value;
        if (!exchangeRate) {
            throw new Error(`Exchange rate not found for currency: ${toCurrency}`);
        }

        // Convert the amount
        const convertedAmount = amount * exchangeRate;
        return convertedAmount;
    } catch (error) {
        console.error('Error converting currency:', error.message);
        throw error;
    }
}

router.post('/convert', async (req, res) => {
    const { fromCurrency, toCurrency, amount} = req.body;
    try {
        const convertedAmount = await convertCurrency(fromCurrency, toCurrency, amount);
        console.log(`Converted amount: ${convertedAmount} ${toCurrency}`);
        res.json({ message: `${convertedAmount} ${toCurrency}`});
    } catch (error) {
        res.status(500).json({ message: 'Error converting currency', error });
    }
  });

module.exports = router;
