import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    token = token.split(' ')[1]

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET)

        req.email = email;
        next()
    } catch (err) {
        return res.status(400).json({
            ok: false,
            message: 'Token invalido.'
        })
    }


}

export const verifyTokenUserID = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    token = token.split(' ')[1]

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)

        req.id_user = uid;
        next()
    } catch (err) {
        return res.status(400).json({
            ok: false,
            message: 'Token invalido.'
        })
    }


}
