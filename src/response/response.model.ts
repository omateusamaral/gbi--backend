import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  BeforeInsert,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { Survey } from '../survey/survey.model';
import { Question } from '../question/question.model';
import { v4 } from 'uuid';

@Entity()
export class Response {
  @PrimaryColumn()
  @Index()
  responseId: string;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  survey: Survey;

  @ManyToOne(() => Question, (question) => question)
  question: Question;

  @Column('text')
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  setQuestionId() {
    this.responseId = v4();
  }
}
