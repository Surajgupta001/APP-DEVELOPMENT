import app from "./src/app";
import { connectDB } from "./src/config/database";

const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1); // exit with failure
});