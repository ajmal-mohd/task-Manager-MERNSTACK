const User = require("../model/user");
const Project = require("../model/project");

async function createTask(req, res) {
    try {
        // Get all the data from the body 
        const { email, projectName, language, date, managerId } = req.body;

        // Validate required fields
        if (!email || !projectName || !language || !date) {
            return res.status(400).send({ message: "All fields are required" });
        }
   
        console.log(email,"kjhg");
        // Validate manager ID-1-2026
        const manager = await User.findOne({ _id: managerId });
        if (!manager || manager.id !== managerId) {
            return res.status(400).json({ message: "Invalid manager ID" });
        }
        console.log("Manager ID is valid:", manager._id);

        // findinEmployee
        const emloyeeId = await User.findOne({ email });
        
        if (!emloyeeId) {
            return res.status(400).json({ message: "not provided employee id" });
        }
        console.log(emloyeeId,"id");
        const empoId = emloyeeId._id;
 
        const createTask = await Project.create({
            projectName,
            language,
            createManager: manager.id,
            projectUser: empoId, 
            finalDate: date,
        });     

        console.log("newTask", createTask);
        return res.status(201).json({
            message: "Task created successfully.",
            task: createTask,
        });
    } catch (error) {
        console.error("Error creating task:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//get userProject

async function getUserProject(req, res) {
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(400).json({ message: "id not provided" });
        }

        const userProject = await Project.find({ projectUser: id });

        if (!userProject || userProject.length === 0) {
            return res.status(400).json({ message: "no projects founded  for this user" });
        }

        res.status(200).json({ message: "user project sucsussFully founded", project: userProject });
        console.log(userProject, "get");
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUsersProjects = async (req, res) => {
    try {
        const allProjects = await Project.find().populate("projectUser", "name");
        res.status(200).json(allProjects);

        console.log(allProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

const DeleteTask = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "not provided id" });
    }

    const findTask = await Project.findOne({ _id: id });

    if (!findTask) {
        return res.status(404).json({ message: "not founded this user projec" });
    }

    const deleteTask = await Project.findByIdAndDelete({ _id: id });

    if (deleteTask) {
        return res.status(201).json({ message: "succussFully deleted", DeleteTask: deleteTask });
    }
};

// edit
const getProjectByUserId = async (req, res) => {
    const { editId } = req.query;

    if (!editId) {
        return res.status(400).json({ message: "ID not provided" });
    }

    try {
        const userProject = await Project.findOne({ _id: editId });

        if (!userProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({ project: userProject });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

//updateing Task

const updateUserTask = async (req, res) => {
    const { id, projectName, language, finalDate } = req.body;
    console.log(id);

    if (!id) {
        return res.status(400).json({ message: "id not provided" });
    }

    try {
        const findProject = await Project.findOne({ _id: id });
        console.log(findProject);
        if (!findProject) {
            return res.status(400).json({ message: " not project database founded" });
        }

        if (!(projectName || language || finalDate)) {
            return res.status(400).json({ message: " not required fields" });
        }

        const modifyTask = await Project.findOneAndUpdate(
            { _id: id },
            {
                projectName,
                language,
                finalDate,
            },
            { new: true }
        );

        if (modifyTask) {
            res.status(201).json({ message: "project succussFully updated", modifyTask });
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
//getuser

const getUserProjectDetails = async (req, res) => {
    const { id } = req.query;
    console.log(id);
    if (!id) {
        return res.status(400).json({ message: "id not provided" });
    }

    try {
        const userProject = await Project.findOne({ _id: id });

        if (!userProject) {
            return res.status(404).json({ message: "The project does not exist  in databse" });
        }

        res.status(200).json({ message: "succussFully fetched in database", userProject });
        console.log(userProject, "recived");
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
//modify
const userModifyTask = async (req, res) => {
    console.log(req.body);
    const { editData:{id,status}} = req.body;

    if (!id) {
        return res.status(400).json({ message: "'id' is required" });
    }

    if (!status) {
        return res.status(400).json({ message: "'status' field is required" });
    }

    const validStatuses = ["inProgress", "completed", "pending"];
    if (!validStatuses.includes(status)) {
        return res
            .status(400)
            .json({ message: "Invalid status value. Valid values are 'inProgress', 'completed', 'pending'" });
    }

    try {
        const projectFind = await Project.findOne({ _id: id });

        if (!projectFind) {
            return res.status(404).json({ message: "Project not found in the database" });
        }

        const modifyStatus = await Project.findByIdAndUpdate(
            { _id: id },
            { $set: { status: status } }, // Ensuring only the status is updated
            { new: true }
        );

        console.log(modifyStatus);

        if (modifyStatus) {
            return res.status(200).json({ message: "Successfully updated", modifyStatus });
        } else {
            return res.status(400).json({ message: "Failed to update project status" });
        }
    } catch (error) {
        console.error("Error updating project:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createTask,
    getUserProject,
    getUsersProjects,
    DeleteTask,
    getProjectByUserId,
    getUserProject,
    updateUserTask,
    userModifyTask,
    getUserProjectDetails,
};
