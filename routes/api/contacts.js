const express = require("express");
const Joi = require("joi");

const {validateBody} = require("./middlewares/validateBody");
const addContactShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const schemaUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  
}).min(1);
const schemaFavorite = Joi.object({
  favorite: Joi.bool()
})

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,

} = require("../../models/contacts");
const router = express.Router();
const {autMid}= require('./middlewares/autorizeMidlewears')
router.use(autMid)
router.get("/", async (req, res, next) => {
  const data = await listContacts(req,res);

  res.status(200).send(data);
});

router.get("/:contactId", async (req, res) => {
  const data = await getContactById(req.params.contactId);

  res.send(data);
});

router.post("/", validateBody(addContactShema), async (req, res, next) => {
  const { name, email, phone } = req.body;
  const data = await addContact(req,name, email, phone);
  res.status(201).send(data);
});

router.delete("/:contactId", async (req, res, next) => {
  const data = await removeContact(req.params.contactId);
  res.send(data);
});

router.put(
  "/:contactId",
  validateBody(schemaUpdate),
  async (req, res, next) => {
    const data = await updateContact(req.params.contactId, req.body);
    res.send(data);
  }
);
router.patch(
  "/:contactId/favorite",
  validateBody(schemaFavorite),
  async (req, res, next) => {
   
    const data = await updateStatusContact(req.params.contactId, req.body);
    res.send(data);
  }
);

module.exports = router;
