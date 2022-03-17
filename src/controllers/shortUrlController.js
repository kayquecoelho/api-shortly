import joi from "joi";
import { connection } from "../database.js";
import { nanoid } from "nanoid";

export async function generateShorten(req, res) {
  const urlSchema = joi.object({
    url: joi.string().uri().required()
  });
  const { user } = res.locals;

  const validation = urlSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  const shortenUrl = nanoid(8);

  try {
    await connection.query(`
      INSERT INTO links ("shortenUrl", url, "userId")
        VALUES ($1, $2, $3)
    `, [shortenUrl, req.body.url, user.id]);

    return res.status(201).send({ shortUrl: shortenUrl });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const result = await connection.query(`
      SELECT * FROM links WHERE "shortenUrl"=$1
    `, [shortUrl]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const viewsCount = result.rows[0].viewsCount + 1;
    await connection.query(`
      UPDATE links SET "viewsCount"=$1 WHERE id=$2
    `, [viewsCount, result.rows[0].id]);

    return res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}