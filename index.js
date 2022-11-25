require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
const Contact = require('./models/contact');

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', function (request, response) { 
    if(request.method === 'POST' && response.statusCode !== 400) {
      return JSON.stringify(request.body)
    } else if(request.method === 'POST' && response.statusCode === 400) {
      return 'error'
    } else {
      return '-'
    }
})

app.use(morgan(':method :url :status :res[content-length] :body :response-time ms'))

app.get('/', (request, response) => {
    response.send('<h1><a href=/api/persons>All Contacts</a></h1><h1><a href=/info>Info</a></h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contact => {
    response.json(contact)
  })  
})

app.get('/info', (request, response) => {
  Contact.find({}).then(contact => {
    response.send(`<p>Phonebook has info for ${contact.length}</p>
        <p>${new Date}</p>
    `)
  })  
})

app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
      .then(contact => {
        if (contact) {
          response.json(contact)
        } else {
          response.status(404).end()
        }
      })
      .catch(error=> next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name) return response.status(400).json({ error: 'name missing' })
  if (!body.number) return response.status(400).json({ error: 'number missing' })
    
  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then(saved => {
    console.log(saved);
    response.json(saved)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(
      request.params.id, 
      contact, 
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    console.log(error.name)
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)