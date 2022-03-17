import bcrypt from "bcrypt";
import { connection } from "../database.js";

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(
      `
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `,
      [user.name, user.email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { id } = res.locals.user;

  try {
    const { rows: user } = await connection.query(
      `
      SELECT 
        users.id, 
        users.name,
        SUM(links."visitCount") AS "visitCount"
      FROM users
        LEFT JOIN links ON links."userId"=users.id
        WHERE users.id=$1
      GROUP BY users.id;
    `,
      [id]
    );

    if (user.length === 0) {
      return res.sendStatus(404);
    }

    const { rows: shortenedUrls } = await connection.query(
      `
      SELECT * FROM links WHERE "userId"=$1
    `,
      [id]
    );
    
    res.send({
      ...user[0],
      shortenedUrls,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
