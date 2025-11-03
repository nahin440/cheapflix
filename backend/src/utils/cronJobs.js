const cron = require('node-cron');
const billingService = require('./billingService');
const Cancellation = require('../models/Cancellation');

const cronJobs = {
  init() {
    // Run monthly billing on 1st day of every month at 2 AM
    cron.schedule('0 2 1 * *', async () => {
      console.log('Running monthly billing...');
      await billingService.processMonthlyBilling();
    });

    // Process cancellations daily at 3 AM
    cron.schedule('0 3 * * *', async () => {
      console.log('Processing scheduled cancellations...');
      await Cancellation.processScheduledCancellations();
    });

    console.log('Cron jobs initialized');
  }
};

module.exports = cronJobs;