const express = require('express')
const app = express()
const port = 3030
const Users = require('./routes/usersRouter')
const Movies = require('./routes/moviesRouter')
const bodyParser = require('body-parser')
const {authenticate} = require('./middleware/auth')
const morgan = require('morgan')
require('dotenv').config()


app.use(morgan('common'))


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(Users)
app.use(authenticate)
app.use(Movies)

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})