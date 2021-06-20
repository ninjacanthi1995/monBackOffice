const mongoose = require("mongoose");

const uri = "mongodb+srv://ninjacanthi1995:Neuco123@cluster0.89hu1.mongodb.net/contacts?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

mongoose.connect(uri, options, function (err) {
  console.log(err);
});

const contactSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    contactType: {
        type: String,
        enum: ['famille', 'amis', 'pro']
    }
});

const contactModel = mongoose.model('contacts', contactSchema);

module.exports = contactModel;
