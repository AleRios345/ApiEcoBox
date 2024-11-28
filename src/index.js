import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import router from "./routes/users.routes.js";

const app = express();


// EXPRESS USES

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api',router);


app.listen((PORT || 3000),()=>{
    console.log(`Server running on port ${PORT}`);
});