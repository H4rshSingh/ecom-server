const DemandType = require("../model/DemandType");
const Offers = require("../model/Offers");
const Product = require("../model/Products");
const RoomMain = require("../model/RoomMain");
const Room = require("../model/room");

// POST: api/create
exports.create = async (req, res) => {
  try {
    // const imageUrls = req.files
    //   .filter((file) => file.fieldname === "image")
    //   .map((file) => file.location);
    // if (!req.body) {
    //   return res.status(406).json({ error: "Please provide room data" });
    // }

    // const {
    //   roomName,
    //   title,
    //   metadataTitle,
    //   description,
    //   fiveGridHeader,
    //   fiveGridDescription,
    //   twoGridHeader,
    //   twoGridDescription,
    //   details,
    //   roomData,
    //   roomType,
    //   category,
    //   firstSlider,
    //   secondSlider,
    //   thirdSlider,
    //   ...circles
    // } = req.body;

    // const existingRoom = await RoomMain.findOne({ roomType: roomName });
    // if (existingRoom) {
    //   return res.status(400).json({ error: "Room type already exists" });
    // }

    // const formattedCircles = convertToSchemaType(circles);
    // const rooms = [];
    // for (let data of roomData) {
    //   const room = await Room.findOne({
    //     productId: data.productId,
    //     roomType: data.roomType,
    //   });
    //   if (room) {
    //     rooms.push(room._id);
    //   } else {
    //     console.log(
    //       `Room not found for productId: ${data.productId} and roomType: ${data.roomType}`
    //     );
    //   }
    // }

    // const fiveRooms = [];
    // for (let data of category) {
    //   const room = await Room.findOne({
    //     roomType,
    //     productCategory: { $regex: new RegExp(data, "i") },
    //   });
    //   if (room) {
    //     fiveRooms.push(room._id);
    //   } else {
    //     console.log(
    //       `Room not found for productId: ${data.productId} and roomType: ${data.roomType}`
    //     );
    //   }
    // }

    // let firstSliderProducts = [];
    // if (firstSlider.type === "Offer") {
    //   const products = await Product.find({ offer: firstSlider.subType });
    //   products.forEach((product) => {
    //     firstSliderProducts.push(product._id);
    //   });
    // } else if (firstSlider.type === "Category") {
    //   const products = await Product.find({ category: firstSlider.subType });
    //   products.forEach((product) => {
    //     firstSliderProducts.push(product._id);
    //   });
    // } else if (firstSlider.type === "Demand Type") {
    //   const products = await Product.find({ demandtype: firstSlider.subType });
    //   products.forEach((product) => {
    //     firstSliderProducts.push(product._id);
    //   });
    // }

    // let secondSliderProducts = [];
    // if (secondSlider.type === "Offer") {
    //   const products = await Product.find({ offer: secondSlider.subType });
    //   products.forEach((product) => {
    //     secondSliderProducts.push(product._id);
    //   });
    // } else if (secondSlider.type === "Category") {
    //   const products = await Product.find({ category: secondSlider.subType });
    //   products.forEach((product) => {
    //     secondSliderProducts.push(product._id);
    //   });
    // } else if (secondSlider.type === "Demand Type") {
    //   const products = await Product.find({ demandtype: secondSlider.subType });
    //   products.forEach((product) => {
    //     secondSliderProducts.push(product._id);
    //   });
    // }

    // let thirdSliderProducts = [];
    // if (thirdSlider.type === "Offer") {
    //   const products = await Product.find({ offer: thirdSlider.subType });
    //   products.forEach((product) => {
    //     thirdSliderProducts.push(product._id);
    //   });
    // } else if (thirdSlider.type === "Category") {
    //   const products = await Product.find({ category: thirdSlider.subType });
    //   products.forEach((product) => {
    //     thirdSliderProducts.push(product._id);
    //   });
    // } else if (thirdSlider.type === "Demand Type") {
    //   const products = await Product.find({ demandtype: thirdSlider.subType });
    //   products.forEach((product) => {
    //     thirdSliderProducts.push(product._id);
    //   });
    // }
    // const position = [
    //   "twoGrid",
    //   "fiveGrid",
    //   "secondSlider",
    //   "forthSlider",
    //   "heading",
    //   "mainImage",
    //   "firstSlider",
    //   "thirdSlider",
    //   "fifthSlider",
    // ]

    if (!req.body) {
      return res.status(406).send("Please provide product data");
    }

    const {
      heading,
      summary,
      shortSummary,
      fiveRooms,
      fiveGridHeader,
      fiveGridDescription,
      twoRooms,
      twoGridHeader,
      twoGridDescription,
      firstSlider,
      secondSlider,
      thirdSlider,
      forthSlider,
      fifthSlider,
      metadataTitle,
      mainImage,
      roomType,
      position
    } = req.body;

    const fiveGridRooms = [];

    for (let data of fiveRooms) {
      const room = await Room.findById(data);
      if (room) {
        fiveGridRooms.push(room._id);
      } else {
        console.log(`Room not found in fiveRooms.`);
        return res.status(404).json({ message: "Room not found in fiveRooms" });
      }
    }

    const twoGridRooms = [];
    for (let data of twoRooms) {
      const room = await Room.findById(data);
      if (room) {
        twoGridRooms.push(room._id);
      } else {
        console.log(`Room not found in fiveRooms.`);
        return res.status(404).json({ message: "Room not found in fiveRooms" });
      }
    }

    const mappedFiveGrid = {
      fiveGridHeader,
      fiveGridDescription,
      fiveGridRooms,
    };

    const mappedTwoGrid = {
      twoGridHeader,
      twoGridDescription,
      twoGridRooms,
    };

    // mainImage
    const validMainRoom = await Room.findById(mainImage);
    if (!validMainRoom) {
      console.log(`Room not found in mainRoom.`);
      return res.status(404).json({ message: "Room not found in mainRoom" });
    }

    let firstSliderProducts = [];
    if (firstSlider.type === "Offer") {
      const products = await Product.find({ offer: firstSlider.subType });
      products.forEach((product) => {
        firstSliderProducts.push(product._id);
      });
    } else if (firstSlider.type === "Category") {
      const products = await Product.find({ category: firstSlider.subType });
      products.forEach((product) => {
        firstSliderProducts.push(product._id);
      });
    } else if (firstSlider.type === "Demand Type") {
      const products = await Product.find({ demandtype: firstSlider.subType });
      products.forEach((product) => {
        firstSliderProducts.push(product._id);
      });
    }

    let secondSliderProducts = [];
    if (secondSlider.type === "Offer") {
      const products = await Product.find({ offer: secondSlider.subType });
      products.forEach((product) => {
        secondSliderProducts.push(product._id);
      });
    } else if (secondSlider.type === "Category") {
      const products = await Product.find({ category: secondSlider.subType });
      products.forEach((product) => {
        secondSliderProducts.push(product._id);
      });
    } else if (secondSlider.type === "Demand Type") {
      const products = await Product.find({ demandtype: secondSlider.subType });
      products.forEach((product) => {
        secondSliderProducts.push(product._id);
      });
    }

    let thirdSliderProducts = [];
    if (thirdSlider.type === "Offer") {
      const products = await Product.find({ offer: thirdSlider.subType });
      products.forEach((product) => {
        thirdSliderProducts.push(product._id);
      });
    } else if (thirdSlider.type === "Category") {
      const products = await Product.find({ category: thirdSlider.subType });
      products.forEach((product) => {
        thirdSliderProducts.push(product._id);
      });
    } else if (thirdSlider.type === "Demand Type") {
      const products = await Product.find({ demandtype: thirdSlider.subType });
      products.forEach((product) => {
        thirdSliderProducts.push(product._id);
      });
    }

    let forthSliderProducts = [];
    if (forthSlider.type === "Offer") {
      const products = await Product.find({ offer: forthSlider.subType });
      products.forEach((product) => {
        forthSliderProducts.push(product._id);
      });
    } else if (forthSlider.type === "Category") {
      const products = await Product.find({ category: forthSlider.subType });
      products.forEach((product) => {
        forthSliderProducts.push(product._id);
      });
    } else if (forthSlider.type === "Demand Type") {
      const products = await Product.find({ demandtype: forthSlider.subType });
      products.forEach((product) => {
        forthSliderProducts.push(product._id);
      });
    }
    let fifthSliderProducts = [];
    if (fifthSlider.type === "Offer") {
      const products = await Product.find({ offer: fifthSlider.subType });
      products.forEach((product) => {
        fifthSliderProducts.push(product._id);
      });
    } else if (fifthSlider.type === "Category") {
      const products = await Product.find({ category: fifthSlider.subType });
      products.forEach((product) => {
        fifthSliderProducts.push(product._id);
      });
    } else if (fifthSlider.type === "Demand Type") {
      const products = await Product.find({ demandtype: fifthSlider.subType });
      products.forEach((product) => {
        fifthSliderProducts.push(product._id);
      });
    }

    const newRoom = new RoomMain({
      roomType,
      heading,
      summary,
      shortSummary,
      mainImage: validMainRoom._id,
      fiveGrid: mappedFiveGrid,
      twoGrid: mappedTwoGrid,
      firstSlider: firstSliderProducts,
      secondSlider: secondSliderProducts,
      thirdSlider: thirdSliderProducts,
      forthSlider: forthSliderProducts,
      fifthSlider: fifthSliderProducts,
      metadata: { title: metadataTitle },
      position
      // roomType: roomName,
      // title,
      // metadata: { title: metadataTitle },
      // description,
      // details,
      // fiveGridHeader,
      // fiveGridDescription,
      // twoGridHeader,
      // twoGridDescription,
      // img: imageUrls[0],
      // children: formattedCircles.circles,
      // rooms,
      // fiveRooms,
      // firstSlider: firstSliderProducts,
      // secondSlider: secondSliderProducts,
      // thirdSlider: thirdSliderProducts,
    });

    await newRoom.save();
    res.status(201).json({ message: "New Room created successfully!" });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: error.message || "Error while creating new Room!" });
  }
};

const convertToSchemaType = (inputData) => {
  const result = { circles: [] };

  for (const key in inputData) {
    if (inputData.hasOwnProperty(key)) {
      const match = key.match(/^circles\[(\d+)\]\.(\w+)$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!result.circles[index]) {
          result.circles[index] = {};
        }

        result.circles[index][field] =
          field === "productPrice" ? Number(inputData[key]) : inputData[key];
      }
    }
  }
  return result;
};

exports.getRoom = async (req, res) => {
  const { roomType } = req.query;
  console.log({ roomType });
  try {
    const room = await RoomMain.findOne({ roomType })
      .populate("mainImage")
      .populate("fiveGrid.fiveGridRooms")
      .populate("twoGrid.twoGridRooms")
      .populate("firstSlider")
      .populate("secondSlider")
      .populate("thirdSlider")
      .populate("forthSlider")
      .populate("fifthSlider");
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ err: error.message || "Error while fetching rooms!" });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const room = await RoomMain.find().populate("mainImage");
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ err: error.message || "Error while fetching rooms!" });
  }
};

exports.deleteRoomById = async (req, res) => {
  const { roomId } = req.params;

  try {
    await RoomMain.findByIdAndDelete({ _id: roomId });
    const updatedData = await productsDB.find();

    res.status(200).json(updatedData);
  } catch (error) {
    res
      .status(500)
      .json({ err: error.message || "Error while deleting room!" });
  }
};
