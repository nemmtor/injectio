import { InjectioObserver } from './injectio-observer';

type TestProps = { visible: boolean };

describe('injectio observer', () => {
  it('should notify subscribers after adding new item', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const subscriber = vi.fn();

    injectioObserver.subscribe(subscriber);
    injectioObserver.add(vi.fn(), { visible: true });

    expect(subscriber).toHaveBeenCalled();
  });

  it('should update snapshot after adding new item', () => {
    const injectioObserver = InjectioObserver.getInstance();

    injectioObserver.add(vi.fn(), { visible: true });
    const snapshot = injectioObserver.getSnapshot();

    expect(snapshot).toHaveLength(1);
  });

  it('should update snapshot reference after injected calls updateProps', () => {
    const injectioObserver = InjectioObserver.getInstance();
    injectioObserver.add(vi.fn(), { visible: true });
    const snapshotBeforeSync = injectioObserver.getSnapshot();
    const [injected] = snapshotBeforeSync;

    injected?.updateProps((props: TestProps) => ({ ...props, visible: false }));
    const snapshotAfterSync = injectioObserver.getSnapshot();

    expect(snapshotBeforeSync).not.toBe(snapshotAfterSync);
  });

  it('should update snapshot reference after injected calls onRemove', () => {
    const injectioObserver = InjectioObserver.getInstance();
    injectioObserver.add(vi.fn(), { visible: true });
    const snapshotBeforeSync = injectioObserver.getSnapshot();
    const [injected] = snapshotBeforeSync;

    injected?.remove();
    const snapshotAfterSync = injectioObserver.getSnapshot();

    expect(snapshotBeforeSync).not.toBe(snapshotAfterSync);
  });

  it('should not add another item with same id', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const item = vi.fn();

    injectioObserver.add(item, { visible: true }, 'id');
    injectioObserver.add(item, { visible: true }, 'id');
    const snapshot = injectioObserver.getSnapshot();

    expect(snapshot).toHaveLength(1);
  });

  it('should restart promise after adding item with same id', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const item = vi.fn();

    const firstInjection = injectioObserver.add(item, { visible: true }, 'id');
    firstInjection.resolve('resolved');
    const firstInjectionValue = firstInjection.value;
    const secondInjection = injectioObserver.add(item, { visible: true }, 'id');
    const secondInjectionValue = secondInjection.value;

    expect(firstInjectionValue).not.toBe(secondInjectionValue);
  });
});
