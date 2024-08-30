import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Survey } from './survey/survey.model';
import { Question } from './question/question.model';
import { Response } from './response/response.model';
import { Gen1724985973920 } from './migration/1724985973920-gen';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: [Survey, Question, Response],
  migrations: [Gen1724985973920],
  migrationsRun: true,
});
