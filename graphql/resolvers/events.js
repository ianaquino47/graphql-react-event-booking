const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(transformEvent);
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
            creator: "5ea0c1a28deb2ce31608ea14"
        })
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = transformEvent(result);
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
    }
}