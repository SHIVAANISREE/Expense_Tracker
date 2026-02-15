// routes/titleRoutes.js
const express = require("express");
const router  = express.Router();
const { addTitle, getTitlesByCategory, deleteTitle } = require("../controllers/titleController");

router.post("/add", addTitle);
router.get("/category/:categoryId", getTitlesByCategory); // ✅ fetch by category
router.delete("/:titleId", deleteTitle);

module.exports = router;