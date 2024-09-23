import mongoose from "mongoose";
import app from "./app.js";
const uri = process.env.MONGODB_URI;

mongoose
    .connect(uri)
    .then(console.log("database is connected successfully"))
    .catch((err) => console.log(err));

const port = process.env.API_PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
