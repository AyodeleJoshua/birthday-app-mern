const Contact = require("../models/contact");
const { responseError, serviceErrorHandler } = require("../utils");

const PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 20;
const CURRENT_PAGE = 1;

exports.createContact = async (req) => {
  try {
    const { firstName, lastName, dob, email, phoneNumber } = req.body;
    const userId = req.userId;
    let contact;
    contact = new Contact({
      firstName,
      lastName,
      dob,
      phoneNumber,
      owner: userId,
      email,
    });
    contact = await contact.save();
    contact = Contact.findById(contact._id);
    return contact;
  } catch (err) {
    serviceErrorHandler(err);
  }
};

exports.getAllContacts = async (req) => {
  const { page: queryPage, dob, limit: queryLimit } = req.query;
  const limit =
    Number(queryLimit) && Number(queryLimit) <= MAX_PAGE_SIZE
      ? Number(queryLimit)
      : PAGE_SIZE;
  const page = Number(queryPage) || CURRENT_PAGE;
  const userId = req.userId;
  try {
    let contacts;
    let contactCount;
    const searchQuery = { owner: userId };

    dob && (searchQuery.dob = dob);
    contacts = await Contact.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    contactCount = await Contact.find(searchQuery).countDocuments();

    const lastPage = Math.ceil(contactCount / limit);
    const nextPage = +page + 1;
    return {
      contacts,
      nextPage: nextPage >= lastPage ? null : nextPage,
      lastPage,
      totalContacts: contactCount,
    };
  } catch (err) {
    throw new Error(err);
  }
};

exports.getSingleContact = async (req) => {
  const contactId = req.params.contactId;
  try {
    const contact = await Contact.findOne(
      {
        _id: contactId,
        owner: req.userId,
        isDeleted: false,
      },
      "firstName lastName email dob phoneNumber"
    );

    if (!contact) {
      throw responseError("Unknown contact!", 404);
    }

    return contact;
  } catch (err) {
    serviceErrorHandler(err);
  }
};

exports.editContact = async (req) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw responseError("Contant not found!", 404);
    }

    if (contact.owner.toString() !== req.userId.toString()) {
      throw responseError("Unauthorized!", 401);
    }

    const { email, dob, firstName, lastName } = req.body;
    if (!email && !dob && !firstName && !lastName) {
      throw responseError(
        "Request body does not contain recognized fields!",
        400
      );
    }

    contact.email = email || contact.email;
    contact.dob = dob || contact.dob;
    contact.firstName = firstName || contact.firstName;
    contact.lastName = lastName || contact.lastName;

    await contact.save();

    const updatedContact = await Contact.findById(
      contactId,
      "firstName lastName email dob phoneNumber"
    );
    return updatedContact;
  } catch (err) {
    serviceErrorHandler(err);
  }
};

exports.deleteContact = async (req) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw responseError("Contact not found!", 404);
    }

    if (contact.isDeleted) {
      throw responseError("Contact was already deleted!", 422);
    }

    if (contact.owner.toString() !== req.userId.toString()) {
      throw responseError("Unauthorized!", 401);
    }

    const options = { validateBeforeSave: false };
    await Contact.softDelete({ _id: contactId }, options);
    return;
  } catch (err) {
    serviceErrorHandler(err);
  }
};
