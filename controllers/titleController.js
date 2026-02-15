// controllers/titleController.js
const Title    = require("../models/Title");
const mongoose = require("mongoose");

exports.addTitle = async (req, res) => {
  try {
    const { categoryId, userId, name, email } = req.body; // ✅ add userId

    if (!categoryId || !name || !userId) {
      return res.status(400).json({ error: "categoryId, userId and name are required" });
    }

    const existing = await Title.findOne({
      categoryId: new mongoose.Types.ObjectId(categoryId),
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({ error: "Title already exists in this category" });
    }

    const title = new Title({
      categoryId: new mongoose.Types.ObjectId(categoryId),
      userId:     new mongoose.Types.ObjectId(userId), // ✅ add this
      name,
      email,
      CrBy: email,
      CrAt: new Date(),
      MoBy: email,
      MoAt: new Date(),
    });

    await title.save();
    res.status(201).json({ message: "Title added", title });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/titles/category/:categoryId
exports.getTitlesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ error: "categoryId is required" });
    }

    const titles = await Title.find({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    }).sort({ name: 1 }); // alphabetical order

    res.json(titles);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/titles/:titleId
exports.deleteTitle = async (req, res) => {
  try {
    const { titleId } = req.params;
    await Title.findByIdAndDelete(titleId);
    res.json({ message: "Title deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};