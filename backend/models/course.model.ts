import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser,
  question: string,
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: IUser,
  rating: number,
  comment: string,
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string,
  url: string;
}

interface ICourseData extends Document {
  title: string,
  description: string,
  videoUrl: string,
  videoThumbnail: object,
  videoSection: string,
  videoLength: string,
  videoPlayer: string,
  links: ILink[],
  suggestions: string
  questions: IComment[];
}

interface ICourse extends Document {
  _id: mongoose.Types.ObjectId,
  name: string,
  description: string,
  thumbnail: object,
  tags: string,
  level: string,
  demoUrl: string,
  benefits: {
    title: string,
  }[],
  prerequisites: {
    title: string
  }[],
  reviews: IReview[],
  courseData: ICourseData[],
  ratings?: number,
  studying?: boolean;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
})

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
})

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
})

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  // videoThumbnail: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestions: String,
  questions: [commentSchema]
})

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String
    }
  },
  tags: {
    required: true,
    type: String,
  },
  level: {
    required: true,
    type: String,
  },
  demoUrl: {
    required: true,
    type: String
  },
  benefits: [
    {
      title: String
    }
  ],
  prerequisites: [
    {
      title: String
    }
  ],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  studying: {
    type: Boolean,
    default: false,
  }
})

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema)

export default CourseModel