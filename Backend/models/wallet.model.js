// const mongoose = require("mongoose");

// const walletSchema = new mongoose.Schema(
//   {
//     balance: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     userType: {
//       type: String,
//       enum: ["User", "Org", "Ward"],
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: userType,
//       required: true,
//     },
//     history: [
//       {
//         title: {
//           type: String,
//         },
//         amount: {
//           type: Number,
//         },
//         uuid: {
//           type: String,
//         },
//         date: {
//           type: Date,
//         },
//         remarks: {
//           type: String,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Wallet", walletSchema);

// block chain integration remains
