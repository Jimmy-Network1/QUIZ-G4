import axios from 'axios';
import {fetchQuestionsFromAPI} from './fetchQuestions';

jest.mock('axios', () => ({
  get: jest.fn(),
  create: jest.fn(() => ({
    interceptors: {
      request: {use: jest.fn(), eject: jest.fn()},
      response: {use: jest.fn(), eject: jest.fn()},
    },
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

describe('fetchQuestionsFromAPI', () => {
  test('should fetch questions', async () => {
    const mockedQuestions = {
      data: {
        response_code: 0,
        results: {mockedQuestions: 'mocked questions'},
      },
    };
    (axios.get as jest.Mock).mockResolvedValue(mockedQuestions);
    const results = await fetchQuestionsFromAPI('10', 10);

    expect(results).toEqual(mockedQuestions.data.results);
  });
});
