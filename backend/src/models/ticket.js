const { model, Schema } = require('mongoose');

const TicketSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // dropdown options
        default: 'Medium'
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Ticket = model('Ticket', TicketSchema);

module.exports = Ticket;
