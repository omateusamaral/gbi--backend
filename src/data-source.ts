import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Survey } from './survey.model';
import { Gen1724891244388 } from './migration/1724891244388-gen';
import { Gen1724896913330 } from './migration/1724896913330-gen';
import { Gen1724983339244 } from './migration/1724983339244-gen';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: [Survey],
  migrations: [Gen1724891244388, Gen1724896913330, Gen1724983339244],
  migrationsRun: true,
});
