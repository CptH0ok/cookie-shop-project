const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      cookieId: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  purchaseDate: { type: Date, required: true },
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);
module.exports = PurchaseHistory;
