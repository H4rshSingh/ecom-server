//  controller for the banner section
const bannerSectionDB = require("../../model/bannerSection");
const Room = require("../../model/room");

// POST: '/api/createBannerSection'  - homepageRoutes.js
exports.createBannerSection = async (req, res) => {
  try {
    const { text, roomId, mainHeading, description } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const bannerSection = new bannerSectionDB({
      text,
      room: room._id,
      mainHeading,
      description,
    });
    await bannerSection.save();

    res
      .status(201)
      .json({ message: "Banner section image added successfully! " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: '/api/getBannerSection'  - homepageRoutes.js
exports.getBannerSection = async (req, res) => {
  try {
    const info = await bannerSectionDB.find().populate({
      path: "room",
      model: Room,
    });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: '/api/deleteBannerSection/:imgId'  - homepageRoutes.js
exports.deleteBannerSection = async (req, res) => {
  const { imgId } = req.params;

  try {
    const result = await bannerSectionDB.findOneAndDelete({ _id: imgId });

    if (!result) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Fetch updated data after deletion
    const updatedData = await bannerSectionDB.find();
    res.json(updatedData);
  } catch (error) {
    console.error("Error deleting images section:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
