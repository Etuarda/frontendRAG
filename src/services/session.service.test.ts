import { beforeEach, describe, expect, it } from 'vitest';
import { sessionService } from './session.service';

describe('session.service', () => {
  beforeEach(() => sessionStorage.clear());
  it('centraliza leitura, gravação e remoção da sessão', () => {
    sessionService.setSessionId('s_abcdefghijklmnopqrstuv');
    expect(sessionService.getSessionId()).toBe('s_abcdefghijklmnopqrstuv');
    sessionService.clearSession();
    expect(sessionService.getSessionId()).toBeNull();
  });
});
