const { generateToken, verifyToken } = require('../helpers/jwt')
const pool = require('../config/db')


module.exports = {
    authenticate: async function (req, res, next) {
        try {
            const accessToken = req.headers.access_token
            const decoded = verifyToken(accessToken)
            const checkUser = await pool.query(`SELECT * FROM public.users WHERE email='${decoded.email}' AND password='${decoded.password}'`)

            console.log(checkUser.rows[0].role, '====>')
            if (checkUser) {
                req.role = checkUser.rows[0].role;
                next()
            } else {
                next({ name: "SignInError" })
            }
        }
        catch (err) {
            next(err)
        }

    },
    authorize: async function (req, res, next) {
        try {
            const isElectrician = req.role === 'Electrician'

            if (!isElectrician) {
                throw new Error;
            }else{
                next();
            }
        }
        catch (err) {
            console.log('masuk', err)
            next({ name: "Unauthorized" })
        }
    }
}