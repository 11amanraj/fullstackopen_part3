const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 9,
    validate: {
      validator: (value) =>
        /* the number must be at least 8 digits, contain a '-' and ther is no limit on max length.*/
        /^[0-9]{2}[0-9]?-[0-9]{6}[0-9]*/.test(value),
      message: 'Phone number should be in form of 012-345678 or 01-2345678',
    },
    required: true,
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
