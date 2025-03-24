const mongoose = require('mongoose');

const makeConnection = async ( name) => {
    return await mongoose.connect(`mongodb+srv://marvelavengersharsha:${process.env.db_password}@cluster0.xv2jk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${name}`);
}

module.exports = {
    makeConnection,
}