import { Injectable } from '@nestjs/common';

interface PageToken {
  contactEmail?: string;
  surveyId?: string;
}

@Injectable()
export class PageTokenService {
  decodePageToken(token: string): PageToken {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {};
    }
  }

  encodePageToken({ contactEmail, surveyId }: PageToken): string {
    return Buffer.from(JSON.stringify({ contactEmail, surveyId })).toString(
      'base64',
    );
  }
}
