const Section = require("../models/Section")
const Course = require("../models/Course");
const { findByIdAndDelete } = require("../models/Category");


//create section
exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        //create section
        const newSection = await Section.create({ sectionName })
        //update course with section objectId
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            }
        )
        //return res
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            updatedCourse,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create course, please try again",
            error: error.message,

        })
    }
}

//update section

exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedCourse,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: error.message,
        })
    }
}


// delete section

exports.deleteSection = async (req, res) => {
    try {
        //get id
        const sectionId = req.params
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            updatedCourse,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message
        })
    }
}