import joi from "joi";
import { connection } from "../database.js";
import { nanoid } from "nanoid";

export async function generateShorten(req, res) {
  const urlSchema = joi.object({
    link: joi.string().uri().required()
  });
  const { user } = res.locals;

  const validation = urlSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  const shortUrl = nanoid(8);

  try {
    await connection.query(`
      INSERT INTO links ("shortUrl", url, "userId")
        VALUES ($1, $2, $3)
    `, [shortUrl, req.body.link, user.id]);

    return res.status(201).send({ shortUrl });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const result = await connection.query(`
      SELECT * FROM links WHERE "shortUrl"=$1
    `, [shortUrl]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const viewsCount = result.rows[0].visitCount + 1;
    await connection.query(`
      UPDATE links SET "visitCount"=$1 WHERE id=$2
    `, [viewsCount, result.rows[0].id]);

    return res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteShortUrl(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    const result = await connection.query(`
      SELECT * FROM links WHERE id=$1
    `, [id]);
    
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (result.rows[0].userId !== user.id) {
      return res.sendStatus(401);
    }

    await connection.query(`
      DELETE FROM links WHERE id=$1
    `, [id]);

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}