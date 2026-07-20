import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPageView extends Document {
  path: string;
  sessionId: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    referrer: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true },
);

PageViewSchema.index({ createdAt: -1 });
PageViewSchema.index({ sessionId: 1, createdAt: -1 });
PageViewSchema.index({ path: 1, createdAt: -1 });

const PageView: Model<IPageView> =
  mongoose.models.PageView ||
  mongoose.model<IPageView>("PageView", PageViewSchema);

export default PageView;
