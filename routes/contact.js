const express = require("express");

const {
  createContact,
  getContacts,
  editContact,
  deleteContact,
  getContact,
} = require("../controllers/contact");
const isAuth = require("../middlewares/isAuth");
const {
  validateCreateContact,
  validateEditContact,
} = require("../middlewares/validateContact");

const router = express.Router();

router.get("/", isAuth, getContacts);

router.get("/:contactId", isAuth, getContact);

router.put("/create", isAuth, validateCreateContact, createContact);

router.patch("/edit/:contactId", isAuth, validateEditContact, editContact);

router.delete("/delete/:contactId", isAuth, deleteContact);

module.exports = router;
