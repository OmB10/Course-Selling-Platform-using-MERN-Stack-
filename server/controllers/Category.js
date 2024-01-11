const Category = require("../models/Category");
const Tag = require("../models/Category")

//create handler function for category

exports.createCategory = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: true,
                message: "All fields are required"
            })
        }
        //entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails);
        //return res
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


//show all Categories

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Tag.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "All categories returned successfully",
            allTags,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//category page details
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        //get course for the specified id
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();
        console.log(selectedCategory);
        //if the category is not found
        if (!selectedCategory) {
            console.log("Category not found");
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        //when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category"
            })
        }
        const selectedCourses = selectedCategory.courses;
        //get courses for the other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate("courses")

        let differentCourses = [];
        for (const category of categoriesExceptSelected) {
            differentCourses.push(...category.courses)
        }
        //get top-selling courses across all categories
        const allCategories = await Category.find().populate("courses");
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0.10);

        return res.status(200).json({
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}