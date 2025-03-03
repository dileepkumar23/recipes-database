const mongoose = require("mongoose")

require("dotenv").config();

mongoUri = process.env.MONGODB

const initializeDatabase = async () => {
    await mongoose.connect(mongoUri)
                   .then(() => {console.log("Connected to database")})
                   .catch((error) => {console.log("Error while connecting to database.")})
}



module.exports = {initializeDatabase}