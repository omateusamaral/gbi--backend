import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from 'typeorm';
import { v4 } from 'uuid';
import { TargetAudience } from './interfaces/survey.interface';
import { Question } from '../question/question.model';
import { Response } from '../response/response.model';

@Entity({ name: 'survey' })
export class Survey {
  @PrimaryColumn()
  @Index()
  public surveyId: string;

  @Column()
  @Index()
  public title: string;

  @Column({
    enum: TargetAudience,
  })
  public targetAudience: TargetAudience;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @OneToMany(() => Response, (response) => response.survey)
  responses: Response[];

  @BeforeInsert()
  setSurveyId() {
    this.surveyId = v4();
    if (!this.questions) {
      this.questions = [];
    }

    const requiredQuestions = [
      { questionText: 'Público-alvo' },
      { questionText: 'Quantidade de estrelas' },
      { questionText: 'E-mail para contato' },
    ];
    this.questions.push(
      ...requiredQuestions.map((q) => {
        const question = new Question();
        question.question = q.questionText;
        return question;
      }),
    );
  }
}
