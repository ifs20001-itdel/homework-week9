const express = require('express')
const app = express()
const port = 3030
const Users = require('./routes/usersRouter')
const Movies = require('./routes/moviesRouter')
const bodyParser = require('body-parser')
// const swaggerJsdoc = require('swagger-jsdoc')
// const swaggerUi = require('swagger-ui-express')
const {authenticate} = require('./middleware/auth')
const morgan = require('morgan')
require('dotenv').config()


app.use(morgan('common'))



// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Express API with Swagger',
//             version: '0.1.0',
//             description:
//                 'This is a simple CRUD API application made with Express and documented with Swagger',
//         },
//         servers: [
//             {
//                 url: `http://localhost:${port}`,
//             },
//         ],
//     },
//     apis: ['./routes/*.js'],
// }
// const specs = swaggerJsdoc(options);
// app.use(
//     '/api-docs',
//     swaggerUi.serve,
//     swaggerUi.setup(specs, {explorer: true})
// )

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(Users)
app.use(authenticate)
app.use(Movies)

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})