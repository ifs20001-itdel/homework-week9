const express = require('express')
const router = express.Router()
const Pool = require('../config/db')
const {authorize} = require('../middleware/auth')


router.use(authorize)

router.get('/Movies', (req, res ,next)=>{
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit
    const sql = 'SELECT * FROM public.movies limit $1 offset $2'
    Pool.query(sql, [limit, offset],(err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).send(result.rows)
        }
    })
})

router.get('/Movies/:id', (req, res ,next)=>{
    const id = req.params.id
    const sql = `SELECT * FROM public.movies WHERE id = ${id}`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).send(result.rows)
        }
    })
})

router.post('/Movies', (req, res ,next)=>{
    const {id, title, genres, year} = req.body
    const sql = `INSERT INTO public.movies (id, title, genres, year) VALUES (${id}, '${title}', '${genres}', '${year}')`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json({message: "User created"});
        }
    })
})

router.put('/Movies', (req, res ,next)=>{
    const {id, title, genres, year} = req.body
    const sql = `UPDATE public.movies SET id='${id}', title='${title}', genres='${genres}', year='${year}' WHERE id='${id}'`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(202).json({message: "User updated successfully"})
        }
    })
})

router.delete('/Movies', (req, res ,next)=>{
    const {id} = req.body
    const sql = `DELETE FROM public.movies WHERE id='${id}'`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json({message: `User with ID ${id} has been deleted`})
        }
    })
})
module.exports = router