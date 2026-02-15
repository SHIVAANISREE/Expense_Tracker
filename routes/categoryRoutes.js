const router = require("express").Router();
const { 
  addCategory, 
  getCategories, 
  getCategoriesByWorkspace  // ✅ NEW function
} = require("../controllers/categoryController");

// ══════════════════════════════════════════════════════════════════════════════
// Legacy Routes (backward compatible with existing app)
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/categories/add
// Add a new expense category (Food, Transport, etc.)
// Body: { userId, workspaceId, name, email }
router.post("/add", addCategory);

// GET /api/categories/:userId
// Get all categories for a user (across all workspaces)
router.get("/:userId", getCategories);

// ══════════════════════════════════════════════════════════════════════════════
// ✅ NEW Workspace Routes
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/categories/:userId/:workspaceId
// Get categories for a specific workspace
// Example: GET /api/categories/user123/workspace456
// Returns: [{ _id, userId, workspaceId, name: "Food" }, { name: "Transport" }, ...]
router.get("/:userId/:workspaceId", getCategoriesByWorkspace);

module.exports = router;