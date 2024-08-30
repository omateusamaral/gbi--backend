import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [DomainModule.register()],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
