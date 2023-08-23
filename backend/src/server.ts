import mongoose from "mongoose";
import app from "./app";
import env from "./utils/validateEnv";

app.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT}.`);
});

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => console.log("Connected to MongoDB."))
    .catch(error => console.log(error));

mongoose.connection.on("error", err => console.log(err));
