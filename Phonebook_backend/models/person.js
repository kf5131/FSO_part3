const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to database: ', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    number: {
        type: String,
        required: true,
        minlength: [8, 'Phone number must be at least 8 digits long'],
        validate: {
            validator: function(v) {
                return /^(?:\d{2}-\d{6}|\d{3}-\d{5})$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

personSchema.set('validateBeforeSave', true);

module.exports = mongoose.model('Person', personSchema);