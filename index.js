import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import connectDB from './src/configaration/db.config.js';
import app from "./app.js"
connectDB().then(()=>app.listen(process.env.PORT||5000,()=>console.log("server is started")))