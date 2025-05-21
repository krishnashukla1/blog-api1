const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'], // Regex for email validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

//regex: regex is a sequence of characters that forms a search pattern. It is used for pattern matching within strings. In this case, the regex is used to validate the email format.
//mongoose: mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a schema-based solution to model application data. In this case, it is used to define the structure of the User document in the MongoDB database.