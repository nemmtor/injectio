import { InjectioObserver } from './injectio-observer';


let onSyncSpy: VoidFunction;
vi.mock('./injected', () => {
  return {
    Injected: vi.fn().mockImplementation(({ onSync }) => {
      onSyncSpy = onSync;
    }),
  };
});

describe('injectio observer', () => {
  it('should notify subscribers after adding new item', () => {
    const injectioObserver = new InjectioObserver();
    const subscriber = vi.fn();

    injectioObserver.subscribe(subscriber);
    injectioObserver.add(vi.fn());

    expect(subscriber).toHaveBeenCalled();
  });

  it('should update snapshot', () => {
    const injectioObserver = new InjectioObserver();
    injectioObserver.add(vi.fn());
    const snapshot = injectioObserver.getSnapshot();

    expect(snapshot).toHaveLength(1);
  });

  it('should update snapshot reference after injected calls onSync', () => {
    const injectioObserver = new InjectioObserver();
    injectioObserver.add(vi.fn());
    const snapshotBeforeSync = injectioObserver.getSnapshot();

    onSyncSpy();
    const snapshotAfterSync = injectioObserver.getSnapshot();

    expect(snapshotBeforeSync).not.toBe(snapshotAfterSync);
  });
});
