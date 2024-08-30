import { Test } from '@nestjs/testing';
import { PageTokenService } from './page-token.service';

describe('PageTokenService', () => {
  let pageTokenService: PageTokenService;
  const token =
    'eyJjb250YWN0RW1haWwiOiJjb250YWN0ZW1haWxAZ21haWwuY29tIiwic3VydmV5SWQiOiJlNGUzOTg4MC04ZThiLTQxNWEtOTJhMy00NTgwNDEzODE0YmIifQ==';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PageTokenService],
    }).compile();

    pageTokenService = moduleRef.get<PageTokenService>(PageTokenService);
    jest.clearAllMocks();
  });

  describe('encodePageToken', () => {
    it('should return the base64', () => {
      //Arrange

      //Act
      const response = pageTokenService.encodePageToken({
        contactEmail: 'contactemail@gmail.com',
        surveyId: 'e4e39880-8e8b-415a-92a3-4580413814bb',
      });
      //Assert

      expect(response.length).toBeGreaterThan(0);
      expect(response).toEqual(token);
    });
  });

  describe('decodePageToken', () => {
    it('should return the email and surveyId', () => {
      //Arrange

      //Act
      const response = pageTokenService.decodePageToken(token);
      //Assert

      expect(response).toEqual({
        contactEmail: 'contactemail@gmail.com',
        surveyId: 'e4e39880-8e8b-415a-92a3-4580413814bb',
      });
    });

    it('should return empty object because could not process decode', async () => {
      //Arrange
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw 'error';
      });
      //Act
      const response = pageTokenService.decodePageToken(token);
      //Assert
      expect(response).toEqual({});
      expect(response).toBeInstanceOf(Object);
    });
  });
});
