import {Comment} from "./comment.interface";

export interface Article {
  id: number;
  title: string;
  authorName: string;
  SubjectName: string;
  content: string;
  comments: Comment[];
  createdAt: Date;
}
