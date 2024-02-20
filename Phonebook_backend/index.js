// Imports
const express = require('express') // Import express
const app = express() // Define app
require('dotenv').config() // require dotenv

// Database connection
const Person = require('./models/person')

// Serve static files
app.use(express.static('dist'))

// Define error handler
const errorHandler = (error, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Define logger
const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Import cors
const cors = require('cors')

// Use middleware
app.use(cors())
app.use(express.json())

// Define custom token for morgan
morgan.token('body', function (req) { return JSON.stringify(req.body) })

// Define unknown endpoint
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Define routes
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if(person){
      res.json(person)
    }else{
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {next(error)})
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id

  const person = {
    name: body.name,
    number: body.number
  }

  try {
    Person.findByIdAndUpdate(id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// Use error handlers
app.use(unkownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})