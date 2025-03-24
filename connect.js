const mongoose = require('mongoose');

const makeConnection = async ( name) => {
    return await mongoose.connect(`mongodb://127.0.0.1:27017/${name}?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.15`)
}

module.exports = {
    makeConnection,
}