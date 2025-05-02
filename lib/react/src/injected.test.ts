import { Injected } from './injected';

describe('injected', () => {
  it('should be dismissable', () => {
    const injected = new Injected({
      onDismiss: vi.fn(),
      renderFn: vi.fn(),
      onRemove: vi.fn(),
    });

    injected.dismiss();

    expect(injected.dismissed).toBe(true);
  });

  it('should call onSync after dismissing', () => {
    const dismissSpy = vi.fn();
    const injected = new Injected({
      onDismiss: dismissSpy,
      renderFn: vi.fn(),
      onRemove: vi.fn(),
    });

    injected.dismiss();

    expect(dismissSpy).toHaveBeenCalled();
  });

  it('should not call onSync if not dismissing', () => {
    const dismissSpy = vi.fn();

    new Injected({
      onDismiss: dismissSpy,
      renderFn: vi.fn(),
      onRemove: vi.fn(),
    });

    expect(dismissSpy).not.toHaveBeenCalled();
  });
});
