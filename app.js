import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import userRoutes from "./src/routes/user.route.js";
const app = express();


app.use(urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes)


app.use((err, req, res, next) => {
    console.log(err.stack);
    
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'An unexpected error occurred.'
    });
  });


export default app;