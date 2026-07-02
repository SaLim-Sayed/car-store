import mongoose, { Document, Model, Schema } from "mongoose";

export interface IClickTrack extends Document {
  type: string; // e.g., 'showroom_contact', 'car_contact', etc.
  targetId: mongoose.Types.ObjectId; // The ID of the item clicked (e.g. Showroom ID)
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ClickTrackSchema = new Schema<IClickTrack>(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize queries for reports
ClickTrackSchema.index({ type: 1, targetId: 1, createdAt: -1 });
ClickTrackSchema.index({ createdAt: -1 });

const ClickTrack: Model<IClickTrack> =
  mongoose.models.ClickTrack ||
  mongoose.model<IClickTrack>("ClickTrack", ClickTrackSchema);

export default ClickTrack;
