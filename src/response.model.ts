import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';
import { Survey } from './survey.model';
import { Question } from './question.model';

@Entity({ name: 'response' })
export class Response {
  @PrimaryColumn()
  @Index()
  public responseId: string;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  survey: Survey;

  @ManyToOne(() => Question, (question) => question)
  question: Question;

  @Column()
  answer: string;

  @CreateDateColumn()
  responseDate: Date;

  @BeforeInsert()
  setResponseId() {
    this.responseId = v4();
  }
}
