const ImgSchemaDB = require("../../model/ImgSection");

// POST: '/api/createImgSection'  - homepageRoutes.js
exports.createImgSection = async (req, res) => {
    try {
      const imageUrl = req.files
        .filter((file) => file.fieldname === "image")
        .map((file) => file.location);
  
      const { text } = req.body;
  
      const imageInfo = new ImgSchemaDB({
        img: imageUrl.join(""),
        text,
      });
      const imgSection = await imageInfo.save();
  
      res.status(201).json({ message: "Images Section added successfully! " });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// GET: '/api/getImgSection'  - homepageRoutes.js
  exports.getImgSection = async (req, res) => {
    try {
      const info = await ImgSchemaDB.find();
      res.status(200).json(info);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// POST: '/api/deleteImgSection/:imgId'  - homepageRoutes.js
  exports.deleteImgSection = async (req, res) => {
    const imgId = req.params.imgId;
  
    try {
      const result = await ImgSchemaDB.findOneAndDelete({ _id: imgId });
  
      if (!result) {
        return res.status(404).json({ message: "Image not found" });
      }
  
      // Fetch updated data after deletion
      const updatedData = await ImgSchemaDB.find();
  
      res.json(updatedData);
    } catch (error) {
      console.error("Error deleting images section:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };