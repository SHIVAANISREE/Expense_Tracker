const Expense  = require("../models/Expense");
const mongoose = require("mongoose");

// ── Add Expense ───────────────────────────────────────────────────────────────
exports.addExpense = async (req, res) => {
  try {
    const data    = req.body;
    const expense = new Expense({
      ...data,
      CrBy: data.email,
      CrAt: new Date(),
      MoBy: data.email,
      MoAt: new Date(),
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("addExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── Get Summary by Workspace ──────────────────────────────────────────────────
// GET /api/expenses/summary/:userId/:workspaceId?today=&month=&year=
exports.getSummaryByWorkspace = async (req, res) => {
  try {
    const { userId, workspaceId }    = req.params;
    const { today, month, year }     = req.query;

    const userOId      = new mongoose.Types.ObjectId(userId);
    const workspaceOId = new mongoose.Types.ObjectId(workspaceId);
    const todayRegex   = new RegExp(`^${today}$`);
    const base         = { userId: userOId, workspaceId: workspaceOId };

    const [ti, te, mi, me, yi, ye] = await Promise.all([
      Expense.aggregate([{ $match: { ...base, date: { $regex: todayRegex }, type: "Income"  } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { ...base, date: { $regex: todayRegex }, type: "Expense" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { ...base, month, type: "Income"  } },                        { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { ...base, month, type: "Expense" } },                        { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { ...base, year,  type: "Income"  } },                        { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { ...base, year,  type: "Expense" } },                        { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    res.json({
      todayIncome:  ti[0]?.total ?? 0,
      todayExpense: te[0]?.total ?? 0,
      monthIncome:  mi[0]?.total ?? 0,
      monthExpense: me[0]?.total ?? 0,
      yearIncome:   yi[0]?.total ?? 0,
      yearExpense:  ye[0]?.total ?? 0,
    });
  } catch (err) {
    console.error("getSummaryByWorkspace error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── Get Expenses (by month OR by date) ───────────────────────────────────────
// GET /api/expenses/:userId?workspaceId=...&month=2026-02
// GET /api/expenses/:userId?workspaceId=...&date=2026-02-15
exports.getExpensesByMonth = async (req, res) => {
  try {
    const { userId }                   = req.params;
    const { workspaceId, month, date } = req.query;

    const query = {
      userId:      new mongoose.Types.ObjectId(userId),
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    };

    if (date)       query.date  = date;
    else if (month) query.month = month;

    const expenses = await Expense.find(query)
      .populate({
        path: 'categoryId',
        select: 'name'
      })
      .sort({ date: -1 })
      .lean();

    console.log('Sample expense with population:', expenses); // Debug

    res.json(expenses);
  } catch (err) {
    console.error("getExpensesByMonth error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── Update Expense ────────────────────────────────────────────────────────────
// PUT /api/expenses/:expenseId
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updateData    = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    Object.keys(updateData).forEach((key) => {
      if (!["_id", "CrBy", "CrAt"].includes(key)) expense[key] = updateData[key];
    });
    expense.MoBy = updateData.email || "system";
    expense.MoAt = new Date();

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("updateExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── Delete Expense ────────────────────────────────────────────────────────────
// DELETE /api/expenses/:expenseId
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    await Expense.findByIdAndDelete(expenseId);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error("deleteExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};