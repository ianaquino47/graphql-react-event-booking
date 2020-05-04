const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events
                .map(event => {
                    return {
                        ...event._doc, 
                        _id: event.id, 
                        date: new Date(event._doc.date).toISOString()
                    };
                })
        } catch (error) {
            throw error
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc, 
                    _id: booking.id, 
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.createdAt).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5ea0c1a28deb2ce31608ea14"
        })
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc, 
                _id: result._doc._id.toString(), 
                date: new Date(event._doc.date).toISOString()
            };
            const user = await User.findById('5ea0c1a28deb2ce31608ea14')

            if (!user) {
                throw new Error('User not found.')
            }
            user.createdEvents.push(event);
            await user.save();

            return createdEvent;
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = await new User({
                email: args.userInput.email,
                password: hashedPassword
            })

            const result =  await user.save();

            return {...result._doc, password: null, _id: result._id}
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: '5ea0c1a28deb2ce31608ea14',
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            _id: result._id,
            user: booking._doc.user,
            event: booking._doc.event,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.createdAt).toISOString()
        }
    },
    cancelBooking: async args => {
        try {
            const booking =  await (await Booking.findById(args.bookingId)).populate('event');
            const event = {
                ...booking.event._doc, 
                _id: booking.event.id
            };
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
}

