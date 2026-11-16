const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // 🟢 Fetch total income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 🟢 Fetch total expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 🟢 Get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // 🟢 Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );
    // 🟣 Get expense transactions in the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const last6MonthsExpenseTransactions = await Expense.find({
     userId: userObjectId,
    date: { $gte: sixMonthsAgo },
}).sort({ date: 1 }); // ascending for ML


    // 🟢 Fetch last 5 transactions (income + expenses)
    const lastIncome = await Income.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const lastExpense = await Expense.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const lastTransactions = [
      ...lastIncome.map((txn) => ({ ...txn, type: "income" })),
      ...lastExpense.map((txn) => ({ ...txn, type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    // 🟢 Final response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
       // ✅ ADD THIS NEW FIELD
      last6MonthsExpenses: last6MonthsExpenseTransactions,
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
