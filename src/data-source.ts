import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Question } from './question.model';
import { Response } from './response.model';
import { Survey } from './survey.model';
import { Gen1724891244388 } from './migration/1724891244388-gen';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: [Survey, Question, Response],
  migrations: [Gen1724891244388],
  migrationsRun: true,
});
