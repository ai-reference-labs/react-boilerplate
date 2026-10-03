import { getApp2Queue, submitApp1 } from './journey-api';

describe('journey API client', () => {
  afterEach(() => vi.restoreAllMocks());

  it('posts a typed App 1 request', async () => {
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
    await submitApp1({
      title: 'Sample',
      requester: 'Alex',
      description: 'A useful request',
      priority: 'standard',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/app1',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('loads the App 2 queue', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ generatedAt: 'now', items: [] }), {
        status: 200,
      }),
    );
    await expect(getApp2Queue()).resolves.toEqual({
      generatedAt: 'now',
      items: [],
    });
  });
});
