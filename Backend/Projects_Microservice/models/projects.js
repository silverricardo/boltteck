const mongoose = require('mongoose');
const mongo = require('mongodb');
require("dotenv-safe").load();


var TasksSchema = mongoose.Schema(
    {
        description: {
            type: String
        },
        createDate: {
            type: Date
        },
        finisheDate: {
            type: Date
        },
        done: {
            type: Boolean,
            default: false
        }
    }
)


var ProjectSchema = mongoose.Schema(
    {
        userId: {
            type: String
        },
        name: {
            type: String
        },
        tasks: [
            { type: TasksSchema }
        ]
    },
    {
        timestamps: true
    }
)

var Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports.createProject = function (newProject, callback) {
    newProject.save(callback);
}

module.exports.updateProject = function (query, values, callback) {
    Project.findOneAndUpdate(query, values, { new: true }, callback);
}

module.exports.deleteProject = function (query, callback) {
    Project.deleteOne(query, callback);
}
