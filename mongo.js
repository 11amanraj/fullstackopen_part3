const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0ps495t.mongodb.net/phonebook?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
          console.log(contact.name,contact.number)
        })
        mongoose.connection.close()
      })
    })
}

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      const contact = new Contact({
        name: process.argv[3],
        number: Number(process.argv[4])
      })
      return contact.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}


