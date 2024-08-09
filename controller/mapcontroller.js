const { default: axios } = require("axios");
const MapPlacesModel = require("../model/mapmodel");

const getMapPlaces = async (req, res) => {
  try {

    const MapPlaces = await MapPlacesModel.find();
    res.status(200).json(MapPlaces);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createMapPlaces = async (req, res) => {
  try {
    // Extract image from req.files
    console.log("enter")
    console.log(req.files)
    const imageUrls = req.files.image
      .filter((file) => file.fieldname === 'image')
      .map((file) => file.location);
    const profileImgUrls = req.files.profileImg
      .filter((file) => file.fieldname === 'profileImg')
      .map((file) => file.location);
    console.log({imageUrls})
    console.log({profileImgUrls})
    if (!req.body) {
      return res.status(406).send("Please provide product data");
    }
    const { name, address, phone, 'geo_location.latitude': latitude, 'geo_location.longitude': longitude, pincode, category } = req.body;

    const newMapDetail = new MapPlacesModel({
      name,
      address,
      phone,
      pincode,
      geo_location: {
        latitude,
        longitude
      },
      images: imageUrls,
      profileImg: profileImgUrls[0],
      category
    })

    const mapData = await newMapDetail.save();

    res.status(201).json({ message: "New map created successfully!...." });

  } catch (error) {
    console.log(error)
    res.status(409).json({ message: error.message });
  }
};

const deleteMapPlaces = async (req, res) => {
  const mapId = req.params.mapId;

  try {
    const result = await MapPlacesModel.findOneAndDelete({ _id: mapId });

    if (!result) {
      return res.status(404).json({ message: 'Map details not found' });
    }

    // Fetch updated data after deletion
    const updatedData = await MapPlacesModel.find();

    res.json(updatedData);
  } catch (error) {
    console.error('Error deleting map:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getDistance = async (req, res) => {
  try {
    const { origins, destinations } = req.query;

    // console.log(origins, destinations);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const searchMapStore = async (req, res) => {
  try {
    const { search } = req.query;
    console.log(search);
    let query = MapPlacesModel.find({});
    if (search) {
      query = query.find({
        $or: [
          { name: { $regex: new RegExp(search, "i") } },
          { address: { $regex: new RegExp(search, "i") } },
        ],
      });
    }
    const stores = await query;
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getMapPlaces, createMapPlaces, deleteMapPlaces, getDistance, searchMapStore };




