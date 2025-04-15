const connectDB = require("../DB/connectDB");

async function getDashboardCounts(req, res) {
  try {
    const db = await connectDB();

    // Get total users count
    const usersCount = await db
      .collection("Register")
      .countDocuments({ role: "user" });

    // Get total owners count
    const ownersCount = await db.collection("Register").countDocuments({
      role: "owner",
    });

    // Get total properties count
    const propertiesCount = await db
      .collection("Property")
      .countDocuments({ status: "Active" });

    // Get total bookings count
    const bookingsCount = await db.collection("Booking").countDocuments();

    // Get total revenue (sum of all payments)
    const revenueResult = await db
      .collection("Payment")
      .aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$amount" } } }])
      .toArray();
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: usersCount,
        totalOwners: ownersCount,
        totalProperties: propertiesCount,
        totalBookings: bookingsCount,
        totalRevenue: totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { getDashboardCounts };
