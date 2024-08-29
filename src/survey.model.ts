import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { v4 } from 'uuid';
import { Question } from './question.model';
import { Response } from './response.model';
import { TargetAudience } from './interfaces/TargetAudience';

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

  @Column({ type: 'int' })
  public starRating: number;

  @Column()
  public contactEmail: string;

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
  }
}
