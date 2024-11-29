import { userModel } from "../models/user.model.js";
import { hashPasswordModel } from "../functions/hashear.functions.js";
import validator from "validator";

const registerUser = async (req, res) => {
    try {
        const { name_user, surnames_user, username, email_user, pass_user, institution_user, icon_url } = req.body;

        // Validaciones de entrada
        if (!name_user || !surnames_user || !username || !email_user || !pass_user || !institution_user || !icon_url) {
            return res.status(400).json({ ok: false, msg: 'Todos los campos son obligatorios' });
        }

        if (!validator.isEmail(email_user)) {
            return res.status(400).json({ ok: false, msg: 'Correo electrónico no válido' });
        }

        if (pass_user.length < 6) {
            return res.status(400).json({ ok: false, msg: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Encriptar la contraseña
        const passwordHashed = await hashPasswordModel.hashPassword(pass_user);

        // Guardar el usuario en la base de datos
        const newUser = await userModel.registerUser({
            nameUser: name_user,
            surnamesUser: surnames_user,
            username: username,
            emailUser: email_user,
            passUser: passwordHashed,
            institutionUser: institution_user,
            icon_url: icon_url
        });

        const score = await userModel.createScoreUser(newUser[0].id_user);
        const progress_weekly = await userModel.createProgressWeekly(newUser[0].id_user);

        // Crear el token JWT
        const token = hashPasswordModel.createToken(newUser.email_user, newUser.username, newUser.id_user);

        // Respuesta con token
        return res.status(201).json({
            ok: true,
            msg: 'Usuario Registrado',
            token: token  // Enviar el token generado
        });
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({
            ok: false,
            msg: 'Error al registrar usuario'
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { emailUser, passUser } = req.body;

        if (!validator.isEmail(emailUser)) {
            return res.status(400).json({
                ok: false,
                msg: 'Email invalido'
            })
        }


        const user = await userModel.findOneUserEmail(emailUser)
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el usuario'
            })
        }

        const isMatch = await hashPasswordModel.comparePassword({ password: passUser, hashedPassword: user.pass_user })

        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }



        const token = hashPasswordModel.createToken(emailUser, user.username, user.id_user)

        return res.status(200).json({
            ok: true,
            msg: 'Sesion iniciada',
            token: token
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            ok: false,
            msg: 'Eror al iniciar sesion'
        })
    }
}

const getProfileUser = async (req, res) => {
    try {
        const user = await userModel.findOneUserEmail(req.email);
        return res.status(200).json({
            ok: true,
            user: {
                id_user: user.id_user,
                name_user: user.name_user,
                surnames_user: user.surnames_user,
                username: user.username,
                email_user: user.email_user,
                institution_user: user.institution_user,
                icon_url: user.icon_url,
                score_user: user.score_points,
                number_bottels: user.number_bottels
            }
        })
    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener el perfil del usuario'
        })
    }
}

const getWeeklyProgress = async (req, res) => {
    try {
        const user = await userModel.findOneUserID(req.id_user);
        return res.status(200).json({
            ok: true,
            weekly_progress: {
                user: {
                    monday: user.monday,
                    tuesday: user.tuesday,
                    wednesday: user.wednesday,
                    thursday: user.thursday,
                    friday: user.friday,
                    saturday: user.saturday,
                    sunday: user.sunday
                }

            }
        })
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'No se pudo obtener el progreso semanal'
        })
    }
}

const getScoreBoardWeekly = async (req, res) => {
    try {
        const scoreBoard = await userModel.scoreboardWeekly();
        return res.status(200).json({
            ok: true,
            score_board: scoreBoard
        })
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'No se pudo obtener el tablero de puntajes semanal'
        })
    }
}

const updateScoreBoard = async (req, res) => {
    try {
        const { email, points, bottles } = req.body;

        // Validar datos
        if (!email || points == null || bottles == null) {
            return res.status(400).json({ ok: false, error: "Datos incompletos." });
        }

        // Actualizar puntaje
        await userModel.updateScore({ email, points, bottles });

        // Actualizar progreso semanal
        await userModel.updateDayColumn({ email, bottles });

        res.status(200).json({ ok: true, message: "Actualización exitosa." });
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ ok: false, error: "Hubo un error al procesar la solicitud." });
    }
};




export const userController = {
    registerUser,
    loginUser,
    getProfileUser,
    getWeeklyProgress,
    getScoreBoardWeekly,
    updateScoreBoard
}


