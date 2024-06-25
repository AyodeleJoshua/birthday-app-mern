const User = require("../models/user");
const Contact = require("../models/contact");
const { responseError, serviceErrorHandler } = require("../utils");

const PAGE_SIZE = 10;
const CURRENT_PAGE = 1;

exports.createContact = async (req) => {
  try {
    const { firstName, lastName, dob, email, phoneNumber } = req.body;
    const userId = req.userId;
    const contact = new Contact({
      firstName,
      lastName,
      dob,
      phoneNumber,
      owner: userId,
      email,
    });
    const savedContact = await contact.save();
    const user = await User.findById(userId);
    user.contacts.push(savedContact._id);
    await user.save();
    return savedContact;
  } catch (err) {
    serviceErrorHandler(err);
  }
};

exports.getAllContacts = async (req) => {
  const { queryPage, dob } = req.query;
  const limit = req.query.limit || PAGE_SIZE;
  const page = queryPage || CURRENT_PAGE;
  const userId = req.userId;
  try {
    let retrievedUser;
    let contactCount;

    if (dob) {
      retrievedUser = await User.find(
        { _id: userId, dob },
        "contacts"
      ).populate({
        path: "contacts",
        perDocumentLimit: limit,
        options: { skip: (page - 1) * limit },
      });
      contactCount = await Contact.find({
        owner: userId,
        dob,
      }).countDocuments();
    } else {
      retrievedUser = await User.find({ _id: userId }, "contacts").populate({
        path: "contacts",
        perDocumentLimit: limit,
        options: { skip: (page - 1) * limit },
      });
      contactCount = await Contact.find({
        owner: userId,
      }).countDocuments();
    }

    const lastPage = Math.ceil(contactCount / limit);
    const nextPage = +page + 1;
    return {
      user: retrievedUser[0],
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
