import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import Note from "./Note";

export interface IMilestone extends Document {
    name: string
    description: string
    project: Types.ObjectId
    tasks: PopulatedDoc<ITask & Document>[]
}

const MilestoneSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
}, { timestamps: true })

MilestoneSchema.pre('deleteOne', { document: true }, async function () {
    const milestoneId = this._id
    if (!milestoneId) return

    const tasks = await Task.find({ milestone: milestoneId })
    for (const task of tasks) {
        await Note.deleteMany({ task: task.id })
    }
    await Task.deleteMany({ milestone: milestoneId })
})

const Milestone = mongoose.model<IMilestone>('Milestone', MilestoneSchema)
export default Milestone
