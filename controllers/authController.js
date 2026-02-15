const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async(req,res)=>{
  try {
    const {name,email,password} = req.body;
    console.log(req.body);

    if(!name || !email || !password) {
      return res.status(400).json({error: "All fields required"});
    }

    const hashed = await bcrypt.hash(password,10);

    const user = new User({
      name,email,password:hashed,
      CrBy: email,
      CrAt: new Date(),
      MoBy: email,
      MoAt: new Date()
    });

    await user.save();
    res.json({message: "User Registered", user});
  } catch(err) {
    console.log(err);
    if(err.code === 11000) {
      return res.status(400).json({error: "Email already exists"});
    }
    res.status(500).json({error: err.message});
  }
};

// Login
exports.login = async(req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password) {
      return res.status(400).json({error: "Email and password required"});
    }

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "User not found"});

    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({error: "Invalid password"});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    res.json({token, user});
  } catch(err) {
    console.log(err);
    res.status(500).json({error: err.message});
  }
};

// Change Password
exports.changePassword = async(req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    console.log("Change password request:", req.body); // Debug log

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: "New password must be different from current password" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    user.MoBy = user.email;
    user.MoAt = new Date();
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: err.message });
  }
};
