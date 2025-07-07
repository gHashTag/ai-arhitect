import { AssistantService } from '../services/assistant';

import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock OpenAI
vi.mock('../services/openai', () => ({
  openai: {
    beta: {
      assistants: {
      retrieve: vi.fn(),
      },
      threads: {
        create: vi.fn(),
        messages: {
          create: vi.fn(),
          list: vi.fn(),
        },
        runs: {
          createAndPoll: vi.fn(),
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
