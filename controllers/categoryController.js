const Category = require("../models/Category");

// ══════════════════════════════════════════════════════════════════════════════
// Add Category (Expense Category like Food, Transport, etc.)
// ══════════════════════════════════════════════════════════════════════════════
exports.addCategory = async (req, res) => {
  try {
    const data = req.body;

    const category = new Category({
      ...data,
      CrBy: data.email,
      CrAt: new Date(),
      MoBy: data.email,
      MoAt: new Date()
    });

    await category.save();
    res.send(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Get User Categories (legacy - without workspace filter)
// Returns ALL categories across all workspaces for a user
// ══════════════════════════════════════════════════════════════════════════════
exports.getCategories = async (req, res) => {
  try {
    const { userId } = req.params;
    const categories = await Category.find({ userId }).sort({ CrAt: -1 });
    res.send(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// ✅ NEW - Get Categories by Workspace
// Returns only categories for a specific workspace
// Example: Get all expense categories (Food, Transport, etc.) for "Work" workspace
// ══════════════════════════════════════════════════════════════════════════════
exports.getCategoriesByWorkspace = async (req, res) => {
  try {
    const { userId, workspaceId } = req.params;
    
    const categories = await Category.find({ 
      userId, 
      workspaceId 
    }).sort({ CrAt: -1 });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories by workspace:', error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
};