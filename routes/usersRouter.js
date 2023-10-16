const express = require('express')
const router = express.Router()
const Pool = require('../config/db')
const { generateToken } = require('../helpers/jwt')
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
                "name": "USER",
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

/**
 * @swagger
 * components:
 *      schema:
 *          Users:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  email:
 *                      type: string
 *                  gender:
 *                      type: string
 *                  password:
 *                      type: string
 *                  role:
 *                      type: string
 * 
 * */
/**
 * @swagger
 * /login:
 *              get:
 *                  summary : To get all data Users from postgres
 *                  "tags" : [ "USER" ]
 *                  description: This api is used to fetch data from postgres
 *                  parameters:
 *                      - in: path
 *                        name: email
 *                        required: true
 *                        description: Character email required
 *                        schema:
 *                          type: string
 *                      - in: path
 *                        name: password
 *                        required: true
 *                        description: Character password required
 *                        schema:
 *                          type: string
 *                  responses:
 *                      200:    
 *                          description: This api is used to fetch data from postgres
 *                      400:
 *                          description: Invalid email/password supplied
 *                          content:
 *                              application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#components/schema/Users'
 * 
 * */
/**
 * @swagger
 * /Users:
 *              get:
 *                  summary : To get all data Users from postgres
 *                  "tags" : [ "USER" ]
 *                  description: This api is used to fetch data from postgres
 *                  responses:
 *                      200:    
 *                          description: This api is used to fetch data from postgres
 *                          content:
 *                              application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#components/schema/Users'
 * 
 * */
/**
 * @swagger
 * /Users/{id}:
 *              get:
 *                  summary : To get all data Users from postgres
 *                  "tags" : [ "USER" ]
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
 *                                          $ref: '#components/schema/Users'
 * 
 * */
/**
 * @swagger
 * /Users:
 *              post:
 *                  summary : Used to insert data users to postgres
 *                  "tags" : [ "USER" ]
 *                  description: This api is used to fetch data from postgres
 *                  requestBody:
 *                      required: true
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  $ref: '#components/schema/Users'
 *                  responses:
 *                      200:    
 *                          description: Added Succesfully
 *                      405:
 *                          description: Invalid input
 * */

/**
 * @swagger
 * /Users/{id}:
 *              put:
 *                  summary : Used to update data users to postgres
 *                  "tags" : [ "USER" ]
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
 *                                  $ref: '#components/schema/Users'
 *                  responses:
 *                      200:    
 *                          description: Updated Succesfully
 *                          content:
 *                             application/json:
 *                                  schema:
 *                                      type: array
 *                                      items:
 *                                         $ref: '#components/schema/Users'
 * 
 * */
/**
 * @swagger
 * /Users/{id}:
 *              delete:
 *                  summary : This API is used to deleted record data from postgres
 *                  "tags" : [ "USER" ]
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


router.post('/registrasi', (req, res, next) => {
    const { id, email, gender, password, role } = req.body
    const sql = `INSERT INTO public.users (id, email, gender, password, role) VALUES ('${id}', '${email}', '${gender}', '${password}', '${role}')`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            const { id, email, gender, password, role } = result.rows
            const generateRegisterToken = generateToken({ id, email, gender, password, role })
            res.status(201).json({ acces_token: generateRegisterToken, result: result });
        }
    })
})

router.get('/login', (req, res, next) => {
    const { email, password } = req.body
    const sql = `SELECT * FROM public.users WHERE email='${email}' AND password='${password}'`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            const { email, password } = result.rows[0]
            const generateUserToken = generateToken({ email, password })
            res.status(201).json({ acces_token: generateUserToken, result: result.rows[0] });
        }
    })
})

router.get('/Users', (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit
    const sql = 'SELECT * FROM public.users limit $1 offset $2'
    Pool.query(sql, [limit, offset], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json(result.rows)
        }
    })
})


router.get('/Users/:id', (req, res, next) => {
    const id = req.params.id
    const sql = `SELECT * FROM public.users WHERE id=${id}`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json(result.rows)
        }
    })
})


router.post('/Users', (req, res, next) => {
    const { id, email, gender, password, role } = req.body
    const sql = `INSERT INTO public.users (id, email, gender, password, role) VALUES ('${id}', '${email}', '${gender}', '${password}', '${role}')`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json({ message: "User created" });
        }
    })
})

router.put('/Users', (req, res, next) => {
    const { id, email, gender, password, role } = req.body
    const sql = `UPDATE public.users SET id ='${id}', email = '${email}', gender = '${gender}', password = '${password}', role ='${role}' WHERE id = '${id}'`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(202).json({ message: "User updated successfully" })
        }
    })
})

router.delete('/Users', (req, res, next) => {
    const { id } = req.body
    const sql = `DELETE FROM public.users WHERE id = '${id}'`
    Pool.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(201).json({ message: `User with ID ${id} has been deleted` })
        }
    })
})

module.exports = router