import {Comment} from "./comment.interface";

export interface Article {
  id: number;
  title: string;
  authorName: string;
  SubjectName: string;
  content: string;
  commentResponses: Comment[];
  date: Date;
}
