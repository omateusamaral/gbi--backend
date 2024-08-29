import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';
import { Survey } from './survey.model';
@Entity({ name: 'question' })
export class Question {
  @PrimaryColumn()
  @Index()
  public questionId: string;

  @Column()
  questionText: string;

  @Column()
  responseType: string;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @BeforeInsert()
  setQuestionId() {
    this.questionId = v4();
  }
}
