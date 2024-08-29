import { Survey } from 'src/survey.model';

export enum TargetAudience {
  YoungAdults = 'Young Adults (18-35 years)',
  Professionals = 'Professionals Seeking Workwear',
  ParentsAndFamilies = 'Parents and Families',
  FashionConsciousConsumers = 'Fashion-Conscious Consumers',
  OccasionShoppers = 'Occasion Shoppers',
}

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SurveyPage {
  values: Survey[];
  nextPageToken?: string;
}
