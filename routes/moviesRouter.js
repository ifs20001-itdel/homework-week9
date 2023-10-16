const express = require('express')
const router = express.Router()
const Pool = require('../config/db')
const { authorize } = require('../middleware/auth')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const port = 3030


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.1.0',
            description:
                'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
        "tags": [
            {
                "name": "MOVIES",
                "description": "POST tag description example"
            }
        ],
    },
    apis: ['./routes/*.js'],
}
const specs = swaggerJSDoc(options);
router.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
)


router.use(authorize)


/**
 * @swagger
 * components:
 *      schemas:
 *          Movies:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 *                  genres:
 *                      type: string
 *                  year:
 *                      type: string
 * 
 * */
/**
 * @swagger
 * /Movies:
 *              get:
 *                  summary : To get all data Movies from postgres
 *                  "tags" : [ "MOVIES" ]
 *                  description: This api is used to fetch data from postgres
 *                  responses:
 *                      200:    
 *                          description: This api is used to fetch data from postgres
 *                          content:
 *                              application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#components/schemas/Movies'
 * 
 * */
/**
 * @swagger
 * /Movies/{id}:
 *              get:
 *                  summary : To get all data Movies from postgres
 *                  "tags" : [ "MOVIES" ]
 *                  description: This api is used to fetch data from postgres
 *                  parameters:
 *                      - in: path
 *                        name: id
 *                        required: true
 *                        description: Numeric ID required
 *                        schema:
 *                          type: integer
 *                  responses:
 *                      200:    
 *                          description: This api is used to fetch data from postgres
 *                      400:
 *                          description: Invalid ID supplied
 *                      404:
 *                          description: User not found
 *                          content:
 *                              application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#components/schemas/Movies'
 * 
 * */
/**
 * @swagger
 * /Movies:
 *              post:
 *                  summary : Used to insert data movies to postgres
 *                  "tags" : [ "MOVIES" ]
 *                  description: This api is used to fetch data from postgres
 *                  requestBody:
 *                      required: true
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#components/schemas/Movies'
 *                  responses:
 *                      200:    
 *                          description: Added Succesfully
 *                      405:
 *                          description: Invalid input
 * */

/**
 * @swagger
 * /Movies/{id}:
 *              put:
 *                  summary : Used to update data movies to postgres
 *                  "tags" : [ "MOVIES" ]
 *                  description: This api is used to fetch data from postgres
 *                  parameters:
 *                      - in: path
 *                        name: id
 *                        required: true
 *                        description: Numeric ID required
 *                        schema:
 *                          type: integer
 *                  requestBody:
 *                      required: true
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#components/schemas/Movies'
 *                  responses:
 *                      200:    
 *                          description: Updated Succesfully
 *                          content:
 *                             application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                         $ref: '#components/schema/Movies'
 * 
 * */
/**
 * @swagger
 * /Movies/{id}:
 *              delete:
 *                  summary : This API is used to deleted record data from postgres
 *                  "tags" : [ "MOVIES" ]
 *                  description: This api is used to fetch data from postgres
 *                  parameters:
 *                      - in: path
 *                        name: id
 *                        required: true
 *                        description: Numeric ID required
 *                        schema:
 *                          type: integer
 *                  responses:
 *                      200:    
 *                          description: Data is Deleted
 *                      404:
 *                          description: Data not found
 * */

router.get('/Movies', (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit
    const sql = 'SELECT * FROM public.movies limit $1 offset $2'
    Pool.query(sql, [limit, offset], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).send(result.rows)
        }
    })
})

router.get('/Movies/:id', (req, res, next) => {
    const id = req.params.id
    const sql = `SELECT * FROM public.movies WHERE id = ${id}`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).send(result.rows)
        }
    })
})

router.post('/Movies', (req, res, next) => {
    const { id, title, genres, year } = req.body
    const sql = `INSERT INTO public.movies (id, title, genres, year) VALUES (${id}, '${title}', '${genres}', '${year}')`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json({ message: "User created" });
        }
    })
})

router.put('/Movies', (req, res, next) => {
    const { id, title, genres, year } = req.body
    const sql = `UPDATE public.movies SET id='${id}', title='${title}', genres='${genres}', year='${year}' WHERE id='${id}'`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(202).json({ message: "User updated successfully" })
        }
    })
})

router.delete('/Movies', (req, res, next) => {
    const { id } = req.body
    const sql = `DELETE FROM public.movies WHERE id='${id}'`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json({ message: `User with ID ${id} has been deleted` })
        }
    })
})
module.exports = router