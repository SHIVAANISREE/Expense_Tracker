const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/workspaces', require('./routes/workspaceRoutes'));
app.use("/api/titles", require("./routes/titleRoutes"));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API with Workspaces' });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});


