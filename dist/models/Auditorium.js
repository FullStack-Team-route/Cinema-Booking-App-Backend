import mongoose from "mongoose";
const AuditoriumSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: ["standard", "premium", "imax", "vip"],
        default: "standard",
    },
    facilities: [{ type: String }],
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
}, { timestamps: true });
// Indexes
AuditoriumSchema.index({ name: 1 });
AuditoriumSchema.index({ type: 1 });
AuditoriumSchema.index({ isActive: 1 });
export const Auditorium = mongoose.model("Auditorium", AuditoriumSchema);
//# sourceMappingURL=Auditorium.js.map