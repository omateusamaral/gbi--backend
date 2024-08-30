import { Survey } from 'src/survey.model';

export enum TargetAudience {
  GEEKS = 'Geeks',
  NERDS = 'Nerds',
  MINIMALIST = 'Minimalista',
  ATHLETES = 'Atletas',
  SPORTSMEN = 'Esportistas',
}

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SurveyPage {
  values: Survey[];
  nextPageToken?: string;
}
