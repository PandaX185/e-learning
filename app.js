import { createServer } from "./utils/server.js";
import db from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;

const app = createServer();
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
