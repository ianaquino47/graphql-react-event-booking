const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

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
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5ea05b9fba0c71cac2c835c4"
        })
        let createdEvent;

        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc, 
                _id: result._doc._id.toString(), 
                date: new Date(event._doc.date).toISOString()
            };
            const creator = await User.findById('5ea05b9fba0c71cac2c835c4')

            if (!creator) {
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
    }
}