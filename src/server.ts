import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import movieRouter from "./routes/movieRoutes.ts";

export const app = express();
const PORT = process.env.PORT;


// Connect to db
await connectDB();


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/movies", movieRouter);

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);

});
