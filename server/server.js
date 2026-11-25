import app from "./app.js";
import DBconnect from "./src/config/db.js";

const port = Number(process.env.PORT) || 3000;

await DBconnect();
app.listen(port, () => console.log(`API running on port ${port} (${process.env.NODE_ENV ?? "development"})`));
