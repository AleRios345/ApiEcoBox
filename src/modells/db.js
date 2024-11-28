import pg from 'pg';
import { DB_USER,DB_DATABASE,DB_PASSWORD,DB_PORT,DB_HOST } from '../config.js';

export const pool = new pg.Pool({
    allowExitOnIdle: true,
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
})

