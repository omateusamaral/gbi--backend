import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SurveyModule } from './survey.module';

async function bootstrap() {
  const app = await NestFactory.create(SurveyModule);

  const config = new DocumentBuilder()
    .setTitle('GBI Backend')
    .setDescription('Backend for GBI Test')
    .setVersion('1.0')
    .addTag('survey')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('App running at: ', 'http://localhost:3000/api');
}
bootstrap();
