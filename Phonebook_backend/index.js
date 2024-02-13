// Imports
const express = require('express')
const morgan = require('morgan')

// Define app
const app = express()

// Use middleware
app.use(express.json())
app.use(morgan('tiny'))

// Default array of persons
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person){
    res.json(person)
  }else{
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  console.log(person)

  if(!person.name || !person.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  if(persons.find(p => p.name === person.name)){
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  person.id = Math.floor(Math.random() * 10000) // replace with hash-table?
  persons = persons.concat(person)
  res.json(person)
})
// ...

// Use middleware
app.use(express.json())
app.use(morgan('combined'))

// ...

const PORT = 3002 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})