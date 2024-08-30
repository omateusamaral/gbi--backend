import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { v4 } from 'uuid';
import { TargetAudience } from './interfaces/survey.interface';

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

  @BeforeInsert()
  setSurveyId() {
    this.surveyId = v4();
  }
}
