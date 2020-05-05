const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;