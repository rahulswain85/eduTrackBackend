import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },

    taskTitle: {
        type: String,
        trim: true,
        required: true
    },

    taskStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Completed']
    },

    taskDueDate: {
        type: Date,
    },

    taskPriority: {
        type: String,
        enum: ['High', 'Low', 'Medium'],
        required: true
    }
});

export const Task = mongoose.model('Task', taskSchema);