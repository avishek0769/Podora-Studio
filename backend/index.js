import "dotenv/config";
import { server, app } from "./app.js";
import connectDB from "./utils/connectDB.js";

connectDB().then(() => {
    app.on("error", (error) => {
        console.log("Server issue: ", error);
    });

    server.listen(process.env.PORT, () => {
        console.log("Server running ... \n HOST: ", process.env.HOST);
    });
});
