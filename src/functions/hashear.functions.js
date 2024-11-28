import bcrypt from "bcryptjs"; // Asegúrate de que esté escrito correctamente
import jwt from "jsonwebtoken"; // Importa jsonwebtoken si aún no lo has hecho
import { SALTROUNDS } from "../config.js";

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

// Comparar una contraseña ingresada con el hash almacenado
async function comparePassword({password, hashedPassword}) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // Devuelve true si coinciden, false si no
}

function createToken(email, username, idUser) {
    const token = jwt.sign(
        { 
            email: email, 
            username: username,
            uid: idUser,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    return token;  // Devuelve el token JWT
}

export const hashPasswordModel = {
    hashPassword,
    comparePassword,
    createToken
};
