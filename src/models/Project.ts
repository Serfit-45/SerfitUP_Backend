import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IMilestone } from "./Milestone";
import { IUser } from "./User";

export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    milestones: PopulatedDoc<IMilestone & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    milestones: [
        {
            type: Types.ObjectId,
            ref: 'Milestone'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true })

ProjectSchema.pre('deleteOne', { document: true }, async function () {
    const projectId = this._id
    if (!projectId) return

    const Milestone = mongoose.model('Milestone')
    const milestones = await Milestone.find({ project: projectId })
    for (const milestone of milestones) {
        await (milestone as any).deleteOne()
    }
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
