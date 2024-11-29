import { text } from "express";
import { pool } from "../modells/db.js";

// Creacion de los controllers para la base de datos de la aplicacion ecobox

const registerUser = async ({ nameUser, surnamesUser, username, emailUser, passUser, institutionUser, icon_url }) => {
    const query = {
        text: `
            INSERT INTO users_eco_box (name_user, surnames_user, username, email_user, pass_user, institution_user, icon_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_user
        `,
        values: [nameUser, surnamesUser, username, emailUser, passUser, institutionUser, icon_url]
    }

    const { rows } = await pool.query(query);
    return rows
}

const findOneUserEmail = async (email) => {
    const query = {
        text: `
            SELECT 
                u.id_user,
                u.pass_user,    
                u.name_user,
                u.surnames_user,
                u.email_user,
                u.institution_user,
                u.username,
                u.icon_url,
                s.score_points,
                s.number_bottels
            FROM users_eco_box u
            INNER JOIN scores_eco_box s ON u.id_user = s.id_user
            WHERE u.email_user = $1
        `,
        values: [email]
    };

    const { rows } = await pool.query(query);
    return rows[0];
};

const findOneUserID = async (id_user) => {
    const query = {
        text: `
            SELECT * FROM progreso_semanal_eco_box WHERE id_user = $1
        `
        ,
        values: [id_user]
    }
    const { rows } = await pool.query(query);
    return rows[0]
}

const findOneUserUsername = async (email) => {
    const query = {
        text: `
            SELECT * FROM users_eco_box WHERE username = $1
        `
        ,
        values: [email]
    }
    const { rows } = await pool.query(query);
    return rows[0]
}

const createScoreUser = async (userId) => {
    const query = {
        text: `
            INSERT INTO scores_eco_box (id_user,score_points,number_bottels)
            VALUES ($1,0,0)
        `,
        values: [userId]
    }
    const { rows } = await pool.query(query);
    return rows[0]
}

const createProgressWeekly = async (userId) => {
    const query = {
        text: `
            INSERT INTO progreso_semanal_eco_box (id_user,monday,tuesday,wednesday,thursday,friday,saturday,sunday)
            VALUES ($1,0,0,0,0,0,0,0)
        `,
        values: [userId]
    }
    const { rows } = await pool.query(query);
    return rows[0]
}


const updateScore = async ({ email, points, bottles }) => {
    const query = {
        text: `
            UPDATE scores_eco_box
            SET score_points = score_points + $1,
                number_bottels = number_bottels + $2
            WHERE id_user = (SELECT id_user FROM users_eco_box WHERE email_user = $3);
        `,
        values: [points, bottles, email],
    };

    await pool.query(query);
};

const updateDayColumn = async ({ email, bottles }) => {
    const today = new Date().getDay();

    const query = `
      UPDATE progreso_semanal_eco_box
      SET 
        ${["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][today]} = $1
      WHERE id_user = (SELECT id_user FROM users_eco_box WHERE email_user = $2);
    `;

    try {
        // Ejecutar la consulta
        await pool.query(query, [bottles, email]);
    } catch (error) {
        console.error("Error al actualizar el día:", error);
        throw new Error("Error al ejecutar la consulta");
    }
};



const scoreboardWeekly = async () => {
    const query = {
        text: `
            SELECT  (p.monday + p.tuesday + p.wednesday + p.thursday + p.friday + p.saturday + p.sunday) AS total,u.username,u.icon_url
            FROM progreso_semanal_eco_box AS p
            INNER JOIN users_eco_box AS u
            ON p.id_user = u.id_user
            ORDER BY total DESC
            LIMIT 5;
        `
    }

    const { rows } = await pool.query(query);
    return rows;
}



export const userModel = {
    registerUser,
    findOneUserEmail,
    findOneUserUsername,
    createScoreUser,
    findOneUserID,
    scoreboardWeekly,
    createProgressWeekly,
    updateDayColumn,
    updateScore
}