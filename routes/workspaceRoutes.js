const router = require("express").Router();
const {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceById,        // ✅ Optional
  setDefaultWorkspace      // ✅ Optional
} = require("../controllers/workspaceController");

// ══════════════════════════════════════════════════════════════════════════════
// WORKSPACE ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/workspaces/:userId
// Get all workspaces for a user
// Example: GET /api/workspaces/507f1f77bcf86cd799439011
// Returns: [{ _id, userId, name, icon, isDefault, CrAt }, ...]
router.get("/:userId", getWorkspaces);

// POST /api/workspaces
// Create a new workspace
// Body: { userId, name, icon, isDefault, email }
// Example Body:
// {
//   "userId": "507f1f77bcf86cd799439011",
//   "name": "Work",
//   "icon": "💼",
//   "isDefault": true,
//   "email": "user@example.com"
// }
router.post("/", createWorkspace);

// PUT /api/workspaces/:workspaceId
// Update workspace name and/or icon
// Body: { name?, icon?, email? }
// Example: PUT /api/workspaces/507f1f77bcf86cd799439012
// Body: { "name": "Personal Life", "icon": "🏠" }
router.put("/:workspaceId", updateWorkspace);

// DELETE /api/workspaces/:workspaceId
// Delete workspace and ALL associated data (categories & expenses)
// Example: DELETE /api/workspaces/507f1f77bcf86cd799439012
// WARNING: This is permanent and deletes all expenses/categories in this workspace!
router.delete("/:workspaceId", deleteWorkspace);

module.exports = router;