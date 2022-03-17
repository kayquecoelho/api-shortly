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