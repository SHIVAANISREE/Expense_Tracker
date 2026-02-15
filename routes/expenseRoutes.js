const router = require("express").Router();
const {
  addExpense,
  getSummaryByWorkspace,
  getExpensesByMonth,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// POST  /api/expenses/add
router.post("/add", addExpense);

// GET   /api/expenses/summary/:userId/:workspaceId?today=&month=&year=
router.get("/summary/:userId/:workspaceId", getSummaryByWorkspace);

// GET   /api/expenses/:userId?workspaceId=...&month=2026-02
// GET   /api/expenses/:userId?workspaceId=...&date=2026-02-15
router.get("/:userId", getExpensesByMonth);  // ✅ must be LAST

// PUT   /api/expenses/:expenseId
router.put("/:expenseId", updateExpense);

// DELETE /api/expenses/:expenseId
router.delete("/:expenseId", deleteExpense);

module.exports = router;