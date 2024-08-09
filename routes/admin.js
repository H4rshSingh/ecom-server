const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const adminController = require("../controller/auth/admin");
const { uploadImage } = require("../middleware/uploadImage")

// create new admin
router.post("/register", adminController.createAdmin);

// login and get a JWT
router.post("/login", adminController.loginAdmin);

// retrieve admin details
router.get("/profile", verifyToken, adminController.adminProfile);

// POST: '/admin/imgUpload'
//  image upload to S3 
router.post('/imgUpload', verifyToken, uploadImage.array('image', 4), (req, res, next) => {
  const imageUrls = req.files.map(file => file.location);
  res.json({ message: 'Images uploaded successfully', imageUrls });
});


module.exports = router