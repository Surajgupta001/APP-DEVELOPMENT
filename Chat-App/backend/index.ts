import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";

const port = process.env.PORT || 3000;

const httpServer = createServer(app);

initializeSocket(httpServer);

connectDB().then(() => {
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1); // exit with failure
});