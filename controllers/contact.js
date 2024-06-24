const { validationResult } = require("express-validator");
const { responseError, handleResponse } = require("../utils");
const {
  createContact,
  getAllContacts,
  editContact,
  deleteContact,
  getSingleContact,
} = require("../services/contactServices");

exports.createContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const amendedError = errors.array().map((error) => ({
        msg: error.msg,
        value: error.value,
      }));
      responseError("Validation failed.", 422, amendedError);
    }
    const contact = await createContact(req);
    handleResponse(
      res,
      201,
      "Contact created successfully!",
      contact,
      "contact"
    );
  } catch (err) {
    next(err);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const { user, lastPage, nextPage, totalContacts } = await getAllContacts(
      req
    );

    if (!user || user.contacts.length < 1) {
      throw responseError("Empty contact list!", 404);
    }

    handleResponse(res, 200, "Contacts found", {
      contacts: user.contacts,
      lastPage,
      nextPage,
      totalContacts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await getSingleContact(req);
    handleResponse(res, 200, "Contact found!", contact, "contact");
  } catch (err) {
    next(err);
  }
};

exports.editContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const amendedError = errors.array().map((error) => ({
        msg: error.msg,
        value: error.value,
      }));
      responseError("Validation failed.", 422, amendedError);
    }
    const contact = await editContact(req);
    handleResponse(
      res,
      201,
      "Contact updated successfully!",
      contact,
      "contact"
    );
  } catch (err) {
    next(err);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await deleteContact(req);
    handleResponse(res, 201, "Contact deleted successfully!");
  } catch (err) {
    next(err);
  }
};
