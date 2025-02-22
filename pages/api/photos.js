import { mongooseConnect } from "@/lib/mongoose";
import { Photos } from "@/models/Photo";

export default async function handle(req, res) {
  await mongooseConnect();

  const { method } = req;

  if (method === "POST") {
    const { title, slug, images } = req.body;

    const projectDoc = await Photos.create({
      title,
      slug,
      images,
    });
    res.json(projectDoc);
  }
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Photos.findById(req.query.id));
    } else {
      res.json((await Photos.find()).reverse());
    }
  }
  if (method === "PUT") {
    const { _id, title, slug, images } = req.body;

    await Photos.updateOne(
      { _id },
      {
        title,
        slug,
        images,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Photos.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
