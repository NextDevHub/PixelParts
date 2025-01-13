import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const storage = multer.diskStorage({});
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

// Expect the field name to be 'image' (change this if needed)
const uploadPhoto = upload.single("image"); // Match this with your frontend field name

const uploadToCloud = async (req, res, next) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return next();
    //new AppError("Please Provide the file", 400)
    const result = await cloudinary.uploader.upload(filePath);
    const url = cloudinary.url(result.public_id, {
      transformation: [
        {
          responsive: true,
          width: 1920, // Increased width for high resolution
          height: 1080, // Increased height for high resolution
          gravity: "auto",
          crop: "auto",
          quality: "auto:best", // Set quality to the highest
          fetch_format: "auto",
          gravity: "faces",
        },
      ],
    });
    // console.log(result);
    // return url;
    //propagation of parameters
    if (url) req.imageUrl = url;
    else req.imageUrl = null;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteFromCloud = async (url) => {
  try {
    //https://res.cloudinary.com/dgljetjdr/image/upload/c_fill,f_auto,g_faces,h_200,q_auto,w_200/znia0eeexizaoq8f76un?_a=BAMCkGFD0
    const publicId = url.split("/").at(-1).split("?")[0];
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result.result);
    if (result === "ok") {
      console.log("DELETED SUCCESSFULLY");
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw err;
  }
};

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4)
      ? "fail"
      : "internal database error";
    this.isOperational = true;
  }
}

const globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
  });
};

const formatString = (string) => {
  if (!string) return;
  string = string.trim().replaceAll(" ", "");
  string = string[0].toUpperCase() + string.slice(1).toLowerCase();
  return string;
};

const filterQueryHandler = (query, validAttributes) => {
  if (Object.entries(query).some((el) => !validAttributes.includes(el[0])))
    return false;

  const filters = Object.entries(query).map((el) => {
    if (el[0].slice(-2) === "Id") return `${el[0]} = ${Number(el[1])}`;
    if (el[0].slice(-4) === "Name" || el[0].slice(-4) === "Name") {
      const s = el[1].replaceAll(" ", "");
      console.log(s);
      return `${el[0]} ='${s[0].toUpperCase() + s.slice(1).toLowerCase()}'`;
    }
    return `${el[0]}='${el[1]}'`;
  });
  return filters;
};

const fieldsQueryHandler = (query, validAttributes) => {
  const fields = query.fields.split(",");
  if (fields.some((el) => !validAttributes.includes(el))) return false;
  return fields;
};

const orderQueryHandler = (query, validAttributes) => {
  const orderList = query.order.split(",");

  if (
    orderList.some((el) => {
      if (el.startsWith("-")) return !validAttributes.includes(el.slice(1));
      return !validAttributes.includes(el);
    })
  )
    return false;

  let orders = query.order.split(",");
  orders = orders.map((el) => {
    if (el.startsWith("-")) return `${el.slice(1)} DESC`;
    return `${el} ASC`;
  });
  return orders;
};
export {
  catchAsyncError,
  AppError,
  globalErrorHandler,
  formatString,
  orderQueryHandler,
  fieldsQueryHandler,
  filterQueryHandler,
  uploadPhoto,
  uploadToCloud,
  deleteFromCloud,
};
