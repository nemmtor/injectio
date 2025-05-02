import { Injected } from './injected';

describe('injected', () => {
  it('should be dismissable', () => {
    const injected = new Injected({ onSync: vi.fn(), renderFn: vi.fn() });

    injected.dismiss();

    expect(injected.dismissed).toBe(true);
  });

  it('should call onSync after dismissing', () => {
    const syncSpy = vi.fn();
    const injected = new Injected({ onSync: syncSpy, renderFn: vi.fn() });

    injected.dismiss();

    expect(syncSpy).toHaveBeenCalled();
  })

  it('should not call onSync if not dismissing', () => {
    const syncSpy = vi.fn();
    new Injected({ onSync: syncSpy, renderFn: vi.fn() });

    expect(syncSpy).not.toHaveBeenCalled();
  })
});
