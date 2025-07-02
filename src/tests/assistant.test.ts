import { AssistantService } from '../services/assistant';

// Mock OpenAI
jest.mock('../services/openai', () => ({
  openai: {
    beta: {
      assistants: {
        retrieve: jest.fn(),
      },
      threads: {
        create: jest.fn(),
        messages: {
          create: jest.fn(),
          list: jest.fn(),
        },
        runs: {
          createAndPoll: jest.fn(),
        },
      },
    },
  },
}));

describe('AssistantService', () => {
  let assistantService: AssistantService;
  const mockAssistantId = 'asst_test123';

  beforeEach(() => {
    assistantService = new AssistantService(mockAssistantId);
  });

  test('should create AssistantService instance', () => {
    expect(assistantService).toBeInstanceOf(AssistantService);
  });

  test('should have assistant ID', () => {
    expect(assistantService).toBeDefined();
  });

  // Добавьте больше тестов по мере развития функциональности
});

export {};
