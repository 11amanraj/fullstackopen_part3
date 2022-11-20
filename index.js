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
    response.send(`<p>Phonebook has info for ${persons.length}</p>
        <p>${new Date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    !person && console.log(false)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) return response.status(400).json({ error: 'name missing' })
  if (!body.number) return response.status(400).json({ error: 'number missing' })
  
  // const allNames = persons.map(n => n.name)
  // for(let i=0; i<allNames.length; i++) {
  //   if(body.name === allNames[i]) {
  //     return response.status(400).json({ error: `contact with name ${body.name} already exists` })
  //   }
  // }

  const contact = new Contact({
    name: body.name,
    number: Number(body.number),
  })

  contact.save().then(saved => {
    console.log(saved)
    response.json(saved)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})