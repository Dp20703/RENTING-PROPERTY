const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function register_owner(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");


    // Check if required fields are present
    const { firstName, lastName, email, phoneNo, password } = req.body;

    // l_Id file handling:
    const l_IdFile = req.files?.l_Id?.[0] ? req.files.l_Id[0].filename : null;
    const l_Id = l_IdFile || null;


    // Check if user already exists:
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Owner already exists with this email" });
    }
    // Create new user object
    const newUser = {
      firstName,
      lastName,
      email,
      phoneNo,
      l_Id,
      password,
      role: "owner",
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Insert into DB
    await collection.insertOne(newUser);

    return res.status(201).json({ message: "Owner registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register_owner };
