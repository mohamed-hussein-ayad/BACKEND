import { mongooseConnect } from "@/lib/mongoose";
import { Contact } from "@/models/contact";

export default async function handle(req, res) {
  await mongooseConnect();

  const { method } = req;

  if (method === "POST") {
    const {
      name,
      lname,
      email,
      company,
      phone,
      country,
      price,
      description,
      project,
    } = req.body;

    const contactDoc = await Contact.create({
      name,
      lname,
      email,
      company,
      phone,
      country,
      price,
      description,
      project,
    });
    res.json(contactDoc);
  }
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Contact.findById(req.query.id));
    } else {
      res.json((await Contact.find()).reverse());
    }
  }
  if (method === "PUT") {
    const {
      _id,
      name,
      lname,
      email,
      company,
      phone,
      country,
      price,
      description,
      project,
    } = req.body;

    await Contact.updateOne(
      { _id },
      {
        name,
        lname,
        email,
        company,
        phone,
        country,
        price,
        description,
        project,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Contact.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
