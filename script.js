const apiKey = "669e29c8a350d0612f4e5144"; // Your API key
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const convertButton = document.getElementById("convert-btn");
const resultDisplay = document.getElementById("result");

// Initialize currencies
const currencies = ["USD", "EUR", "GBP"];

// Populate currency dropdowns
function populateCurrencyDropdowns() {
  currencies.forEach((currency) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromCurrencySelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = currency;
    optionTo.textContent = currency;
    toCurrencySelect.appendChild(optionTo);
  });
}

// Convert currency function
async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  try {
    // Fetch the exchange rates from the API
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error fetching exchange rates: ${response.statusText}`);
    }

    const data = await response.json();

    // Get the exchange rate for the target currency
    const exchangeRate = data.conversion_rates[toCurrency];

    // Check if the exchange rate exists
    if (!exchangeRate) {
      throw new Error(`Currency ${toCurrency} is not available.`);
    }

    // Calculate the converted amount
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    return `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } catch (error) {
    console.error(error.message);
    return `Error: ${error.message}`;
  }
}

// Handle conversion on button click
convertButton.addEventListener("click", async () => {
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;
  const amount = parseFloat(amountInput.value);

  if (!amount) {
    resultDisplay.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    const result = await convertCurrency(amount, fromCurrency, toCurrency);
    resultDisplay.textContent = result;
  } catch (error) {
    resultDisplay.textContent = error.message;
  }
});

// Populate dropdowns on load
populateCurrencyDropdowns();
