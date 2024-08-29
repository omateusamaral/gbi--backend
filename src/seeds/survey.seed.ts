import { TargetAudience } from '../interfaces/survey.interface';
import { Survey } from '../survey.model';

export const seedSurvey: Partial<Survey>[] = [
  {
    surveyId: '7f8ab2fd-9c69-48a0-ba1c-22a62665ab14',
    title: 'title',
    targetAudience: TargetAudience.YoungAdults,
    starRating: 5,
    contactEmail: 'email@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    surveyId: 'cef0ce83-b230-4d12-b093-775c177730bd',
    title: 'mateus',
    targetAudience: TargetAudience.YoungAdults,
    starRating: 5,
    contactEmail: 'email@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    surveyId: 'e4e39880-8e8b-415a-92a3-4580413814bb',
    title: 'title',
    targetAudience: TargetAudience.YoungAdults,
    starRating: 5,
    contactEmail: 'email@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    surveyId: 'c1f81cb2-3bf4-4af4-9330-fb1d7b589cc3',
    title: 'mateus',
    targetAudience: TargetAudience.YoungAdults,
    starRating: 5,
    contactEmail: 'mateus2@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    surveyId: 'bb4560f9-ad12-4028-acff-a01f173a2ca0',
    title: 'gat2o',
    targetAudience: TargetAudience.YoungAdults,
    starRating: 1,
    contactEmail: 'mateus@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    surveyId: 'bb4560f9-ad12-4028-acff-a01f173a2ca0',
    title: 'gat2o',
    targetAudience: TargetAudience.OccasionShoppers,
    starRating: 1,
    contactEmail: 'mateus@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
