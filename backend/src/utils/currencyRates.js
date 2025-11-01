const db = require('../config/database');

const currencyRates = {
  async getExchangeRate(fromCurrency, toCurrency = 'GBP') {
    if (fromCurrency === toCurrency) return 1.0;

    const [rates] = await db.execute(
      'SELECT currency_code, rate_to_gbp FROM currency_rates WHERE currency_code IN (?, ?)',
      [fromCurrency, toCurrency]
    );

    const fromRate = rates.find(r => r.currency_code === fromCurrency)?.rate_to_gbp;
    const toRate = rates.find(r => r.currency_code === toCurrency)?.rate_to_gbp;

    if (!fromRate || !toRate) {
      throw new Error('Exchange rate not available for the specified currencies');
    }

    return fromRate / toRate;
  },

  async convertAmount(amount, fromCurrency, toCurrency = 'GBP') {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  },

  async getAllRates() {
    const [rows] = await db.execute('SELECT * FROM currency_rates ORDER BY currency_code');
    return rows;
  },

  async updateRate(currency_code, rate_to_gbp) {
    await db.execute(
      'INSERT INTO currency_rates (currency_code, rate_to_gbp) VALUES (?, ?) ON DUPLICATE KEY UPDATE rate_to_gbp = ?, last_updated = CURRENT_TIMESTAMP',
      [currency_code, rate_to_gbp, rate_to_gbp]
    );
  }
};

module.exports = currencyRates;