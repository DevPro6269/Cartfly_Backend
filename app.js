import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import userRoutes from "./src/routes/user.route.js";
import productRoute from "./src/routes/product.route.js";
import categoryRoute from "./src/routes/category.route.js";
import reviewRoute from "./src/routes/review.route.js";
import orderRoute from "./src/routes/order.route.js";
import cartRoute from "./src/routes/cart.route.js";
import subCategoryRoute from "./src/routes/subCategory.route.js";

// Initialize app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  credentials: true,  // Allow cookies to be sent with requests (important for JWT)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));  // Parses URL-encoded data
app.use(express.json());  // Parses incoming JSON requests

// Cookie parser middleware (after body parsing)
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/sub-category", subCategoryRoute);
app.use("/api/review", reviewRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred.'
  });
});

export default app;
