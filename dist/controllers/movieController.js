import { Movie } from "../models/Movie.js";
import { deleteFromCloudinary, extractPublicId } from "../config/cloudinary.js";
// =============================
// Add movie
// =============================
export const addMovie = async (req, res) => {
    try {
        const data = req.body;
        // convert Json string to object
        const fieldsToParse = [
            "directors",
            "writers",
            "cast",
            "producers",
            "slots",
            "trailer",
            "genres",
            "auditoriums",
        ];
        fieldsToParse.forEach((field) => {
            if (data[field]) {
                try {
                    data[field] = JSON.parse(data[field]);
                }
                catch (error) {
                    console.error(`Error parsing ${field}:`, error);
                    data[field] = [];
                }
            }
        });
        // adding poster
        const file = req.file;
        if (file)
            data.poster = file.path; // Cloudinary URL
        const movie = await Movie.create(data);
        res.status(201).json({ statusMsg: "success", movie });
    }
    catch (err) {
        res.status(500).json({ statusMsg: "fail", error: err.message });
    }
};
// =============================
// Get paginated movies
// =============================
export const getAllMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const filter = {};
        if (type)
            filter.type = type;
        const movies = await Movie.find(filter)
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .sort({ createdAt: -1 });
        const total = await Movie.countDocuments(filter);
        const totalPages = Math.ceil(total / +limit);
        res
            .status(200)
            .json({ statusMsg: "success", page, totalPages, total, movies });
    }
    catch (err) {
        res.status(500).json({ statusMsg: "fail", error: err.message });
    }
};
// =============================
// Update movie
// =============================
export const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie)
            return res.status(404).json({ error: "Movie not found" });
        const data = req.body;
        const file = req.file;
        if (file && movie.poster) {
            // Delete old image from Cloudinary
            try {
                const publicId = extractPublicId(movie.poster);
                await deleteFromCloudinary(publicId);
            }
            catch (error) {
                console.error("Error deleting old image from Cloudinary:", error);
            }
            data.poster = file.path; // New Cloudinary URL
        }
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });
        res.status(200).json({ statusMsg: "success", updatedMovie });
    }
    catch (err) {
        res.status(500).json({ statusMsg: "fail", error: err.message });
    }
};
// =============================
// Delete movie
// =============================
export const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie)
            return res.status(404).json({ error: "Movie not found" });
        if (movie.poster) {
            // Delete image from Cloudinary
            try {
                const publicId = extractPublicId(movie.poster);
                await deleteFromCloudinary(publicId);
            }
            catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
        await Movie.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ statusMsg: "success", message: "Movie deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ statusMsg: "fail", error: err.message });
    }
};
//# sourceMappingURL=movieController.js.map