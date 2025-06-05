import { Injected } from './injected';

type TestProps = { visible: boolean };

describe('injected', () => {
  it('should update props and call onPropsUpdate', () => {
    const propsUpdateSpy = vi.fn();
    const injected = new Injected<TestProps, void>({
      initialProps: { visible: true },
      onPropsUpdate: propsUpdateSpy,
      renderFn: vi.fn(),
      onRemove: vi.fn(),
      onResolve: vi.fn(),
    });

    injected.updateProps((currentProps) => ({ ...currentProps, visible: false }));

    expect(injected.props.visible).toBe(false);
    expect(propsUpdateSpy).toHaveBeenCalled();
  });

  it('should call onRemove with correct id', () => {
    const removeSpy = vi.fn();
    const injected = new Injected<TestProps, void>({
      id: 'test-id',
      initialProps: { visible: true },
      onPropsUpdate: vi.fn(),
      renderFn: vi.fn(),
      onRemove: removeSpy,
      onResolve: vi.fn(),
    });

    injected.remove();

    expect(removeSpy).toHaveBeenCalledWith('test-id');
  });

  it('should call onResolve with correct value', () => {
    const resolveSpy = vi.fn();
    const injected = new Injected<TestProps, string>({
      initialProps: { visible: true },
      onPropsUpdate: vi.fn(),
      renderFn: vi.fn(),
      onRemove: vi.fn(),
      onResolve: resolveSpy,
    });

    injected.resolve('test-value');

    expect(resolveSpy).toHaveBeenCalledWith('test-value');
  });
});
