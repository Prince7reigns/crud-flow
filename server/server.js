import app from "./app.js"

import 'dotenv/config';
import DBconnect from "./src/config/db.js";

app.listen(3000,()=> console.log(`API running on :${process.env.PORT} (${process.env.NODE_ENV})`))
DBconnect()
