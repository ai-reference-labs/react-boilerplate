import { getPlanningQueue, submitIntake } from './journey-api';

describe('journey API client', () => {
  afterEach(() => vi.restoreAllMocks());

  it('posts a typed intake request', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'REQ-1',
          status: 'accepted',
          submittedAt: 'now',
          summary: 'Sample',
        }),
        { status: 200 },
      ),
    );
    await submitIntake({
      title: 'Sample',
      requester: 'Alex',
      description: 'A useful request',
      priority: 'standard',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/intake',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('loads the planning queue', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ generatedAt: 'now', items: [] }), {
        status: 200,
      }),
    );
    await expect(getPlanningQueue()).resolves.toEqual({
      generatedAt: 'now',
      items: [],
    });
  });
});
