const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    });

    console.log('Database online :)');
  } catch (error) {
    console.log(error);
    throw new Error('Database error.');
  }
};

module.exports = {
  dbConnection,
};
