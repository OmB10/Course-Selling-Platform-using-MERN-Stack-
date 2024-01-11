// const { default: mongoose } = require("mongoose");
// const { instance } = require("../config/razorpay")
// const Course = require("../models/Course")
// const User = require("../models/User")

// //capture payments and initiate the Razorpay order
// exports.capturePayments = async (req, res) => {
//     //get courseId and userId
//     const { course_id } = req.body;
//     const userId = req.user.id;
//     //valid courseId
//     if (!course_id) {
//         return res.json({
//             success: false,
//             message: "Please provide valid course ID"
//         })
//     }
//     //valid course details
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if (!course) {
//             return res.json({
//                 success: false,
//                 message: "Could not find the course"
//             })
//         }
//         //check user already pays for the course
//         const uid = new mongoose.Types.ObjectId(userid);
//         if (!course.studentsEnrolled.includes(uid)) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Student already enrolled"
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }

//     //create order
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.noe()).toString(),
//         notes: {
//             courseId: course_id,
//             userId,
//         }
//     }

//     try {
//         //initiate payment using razorpay
//         const paymentsResponse = await instance.orders.create(options);
//         console.log(paymentsResponse);
//         //return res
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentsResponse.id,
//             currency: paymentsResponse.currency,
//             amount: paymentsResponse.amount,
//             message: "Payments Successfully",
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Could not initiate payments",
//         })
//     }
// };


// //verify signature
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345";
//     const signature = req.headers["x-razorpay-signature"]

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if (signature === digest) {
//         console.log("Payments is Authorized");

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             //fulfill action

//             //find the course and enrolled student
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                 { _id: courseId },
//                 { $push: { studentsEnrolled: userId } },
//                 { new: true }
//             );

//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found",
//                 })
//             }
//             console.log(enrolledCourse);

//             //find the student and add the course to their enrolled course
//             const enrolledStudent = await User.findByIdAndUpdate(
//                 { _id: userId },
//                 { $push: { courses: courseId } },
//                 { new: true }
//             )
//             console.log(enrolledStudent);

//             //mail send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 `Congratulations you are enrolled for the ${courseName}`
//             )
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Course added successfully",
//             })

//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     } else {
//         return res.status(500).json({
//             success: false,
//             message: "Invalid request",
//         })
//     }
// }
