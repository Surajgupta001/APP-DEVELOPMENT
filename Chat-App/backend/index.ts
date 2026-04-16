import app from "./src/app";
import { connectDB } from "./src/config/database";

const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});