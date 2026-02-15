const Workspace = require("../models/Workspace");
const Category = require("../models/Category");
const Expense = require("../models/Expense");

// ══════════════════════════════════════════════════════════════════════════════
// Get all workspaces for a user
// ══════════════════════════════════════════════════════════════════════════════
exports.getWorkspaces = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const workspaces = await Workspace.find({ userId })
      .sort({ CrAt: -1 });
    
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while fetching workspaces'
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Create new workspace
// ══════════════════════════════════════════════════════════════════════════════
exports.createWorkspace = async (req, res) => {
  try {
    const { userId, name, icon, isDefault } = req.body;

    // Validate required fields
    if (!userId || !name) {
      return res.status(400).json({
        error: true,
        message: 'Please provide userId and name'
      });
    }

    // Create workspace
    const workspace = new Workspace({
      userId,
      name,
      icon: icon || '💼',
      isDefault: isDefault || false,
      CrBy: req.body.email || 'system',
      CrAt: new Date(),
      MoBy: req.body.email || 'system',
      MoAt: new Date()
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while creating workspace'
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Update workspace (name and/or icon)
// ══════════════════════════════════════════════════════════════════════════════
exports.updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, icon } = req.body;

    // Find workspace
    let workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: 'Workspace not found'
      });
    }

    // Update fields
    if (name) workspace.name = name;
    if (icon) workspace.icon = icon;
    workspace.MoBy = req.body.email || 'system';
    workspace.MoAt = new Date();

    await workspace.save();
    res.json(workspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while updating workspace'
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Delete workspace and all associated data
// IMPORTANT: This will delete ALL categories and expenses in this workspace!
// ══════════════════════════════════════════════════════════════════════════════
exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Find workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: 'Workspace not found'
      });
    }

    // Delete all associated expense categories
    const deletedCategories = await Category.deleteMany({ workspaceId });
    console.log(`Deleted ${deletedCategories.deletedCount} categories from workspace ${workspaceId}`);

    // Delete all associated expenses
    const deletedExpenses = await Expense.deleteMany({ workspaceId });
    console.log(`Deleted ${deletedExpenses.deletedCount} expenses from workspace ${workspaceId}`);

    // Delete the workspace itself
    await Workspace.findByIdAndDelete(workspaceId);
    console.log(`Deleted workspace ${workspaceId}`);

    res.json({
      success: true,
      message: 'Workspace and all associated data deleted successfully',
      deleted: {
        workspace: 1,
        categories: deletedCategories.deletedCount,
        expenses: deletedExpenses.deletedCount
      }
    });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while deleting workspace'
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Get workspace by ID (optional - for detailed view)
// ══════════════════════════════════════════════════════════════════════════════
exports.getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: 'Workspace not found'
      });
    }

    // Optional: Get counts of categories and expenses
    const categoryCount = await Category.countDocuments({ workspaceId });
    const expenseCount = await Expense.countDocuments({ workspaceId });

    res.json({
      ...workspace.toObject(),
      stats: {
        categoryCount,
        expenseCount
      }
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while fetching workspace'
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Set workspace as default (optional - for future use)
// ══════════════════════════════════════════════════════════════════════════════
exports.setDefaultWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: true,
        message: 'Please provide userId'
      });
    }

    // Find workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: 'Workspace not found'
      });
    }

    // Check ownership
    if (workspace.userId.toString() !== userId) {
      return res.status(403).json({
        error: true,
        message: 'Not authorized to modify this workspace'
      });
    }

    // Remove default flag from all user's workspaces
    await Workspace.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );

    // Set this workspace as default
    workspace.isDefault = true;
    workspace.MoBy = req.body.email || 'system';
    workspace.MoAt = new Date();
    await workspace.save();

    res.json({
      success: true,
      message: 'Default workspace updated',
      workspace
    });
  } catch (error) {
    console.error('Error setting default workspace:', error);
    res.status(500).json({
      error: true,
      message: 'Server error while setting default workspace'
    });
  }
};