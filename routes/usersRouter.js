const express = require('express')
const router = express.Router()
const Pool = require('../config/db')
const { generateToken } = require('../helpers/jwt')

router.post('/registrasi', (req, res, next)=>{
    const {id, email, gender, password, role} = req.body
    const sql = `INSERT INTO public.users (id, email, gender, password, role) VALUES ('${id}', '${email}', '${gender}', '${password}', '${role}')`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            const {id, email, gender, password, role} = result.rows
            const generateRegisterToken = generateToken({id, email, gender, password, role})
            res.status(201).json({acces_token : generateRegisterToken, result: result});
        }
    })
})


router.get('/login', (req, res ,next)=>{
    const {email, password} = req.body
    const sql = `SELECT * FROM public.users WHERE email='${email}' AND password='${password}'`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            const {email, password} = result.rows[0]
            const generateUserToken = generateToken({email, password})
            res.status(201).json({acces_token : generateUserToken, result: result.rows[0]});
        }
    })
})




router.get('/Users', (req, res ,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit
    const sql = 'SELECT * FROM public.users limit $1 offset $2'
    Pool.query(sql, [limit, offset], (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json(result.rows)
        }
    })
})

router.get('/Users/:id', (req, res ,next)=>{
    const id = req.params.id
    const sql = `SELECT * FROM public.users WHERE id=${id}`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json(result.rows)
        }
    })
})

router.post('/Users', (req, res ,next)=>{
    const {id, email, gender, password, role} = req.body
    const sql = `INSERT INTO public.users (id, email, gender, password, role) VALUES ('${id}', '${email}', '${gender}', '${password}', '${role}')`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json({message: "User created"});
        }
    })
})

router.put('/Users', (req, res ,next)=>{
    const {id, email, gender, password, role} = req.body
    const sql = `UPDATE public.users SET id ='${id}', email = '${email}', gender = '${gender}', password = '${password}', role ='${role}' WHERE id = '${id}'`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(202).json({message: "User updated successfully"})
        }
    })
})

router.delete('/Users', (req, res ,next)=>{
    const {id} = req.body
    const sql = `DELETE FROM public.users WHERE id = '${id}'`
    Pool.query(sql, (err, result)=>{
        if(err) {
            next(err)
        }else{
            res.status(201).json({message: `User with ID ${id} has been deleted`})
        }
    })
})

module.exports = router