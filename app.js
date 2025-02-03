import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import userRoutes from "./src/routes/user.route.js";
import cors from "cors";
import productRoute from "./src/routes/product.route.js"
import categoryRoute from "./src/routes/category.route.js"

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,  // Allow cookies to be sent with requests (important for JWT)
  };
  

  app.use(express.urlencoded({ extended: true })); // This is important
  app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))


app.use("/api/user",userRoutes)
app.use("/api/product",productRoute)
app.use("/api/category",categoryRoute)

app.use((err, req, res, next) => {
    console.log(err.stack);
    
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'An unexpected error occurred.'
    });
  });


export default app;