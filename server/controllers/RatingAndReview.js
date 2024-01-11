const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        //fetch data from req body
        const { rating, review, courseId } = req.body;
        //check if user enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $req: userId } }
            }
        )
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            })
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            Course: courseId,
        })
        if (!alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course already reviewed by the user",
            })
        }
        //create review and rating
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        })
        //update course with this rating/review
        await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true })
        //return res
        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//avg rating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ])
        //return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result(0).averageRating,
            })
        }
        //if no rating/review exists
        return res.status(200).json({
            success: true,
            message: "No rating found",
            averageRating: 0,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//show all rating/reviews
exports.showAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}