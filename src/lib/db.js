import mysql from 'mysql2/promise';

export async function db({ sql, values = [] }) {
    const config = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });

    try {
        const [results] = await config.execute(sql, values);
        // console.log(results);
        config.end();
        return results;
    } catch (error) {
        console.log(error);
    }

}