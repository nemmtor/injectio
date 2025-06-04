import { useCallback, useState } from 'react';
import { inject } from '@injectio/react';

import { Modal, ModalProps } from '../components/modal';
import { Button } from '../components/button';

type Props = {
  defaultValue?: number;
  onSubmit: (count: number) => void;
} & ModalProps;

export const CounterModal = ({
  defaultValue = 0,
  onSubmit,
  ...modalProps
}: Props) => {
  const [count, setCount] = useState(defaultValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const submit = useCallback(() => {
    onSubmit(count);
  }, [count, onSubmit]);

  return (
    <Modal {...modalProps}>
      <Button className="block mb-2" onClick={increment}>
        Increment {count}
      </Button>
      <Button onClick={submit}>Submit</Button>
    </Modal>
  );
};

type OnSubmitProps = {
  dismiss: () => void;
};
type InjectProps = {
  id?: string;
  onSubmit?: (props: OnSubmitProps) => void;
  defaultValue?: number;
};
export const injectCounterModal = ({
  id,
  defaultValue,
  onSubmit,
}: InjectProps = {}) =>
  inject<number | undefined>(
    ({ dismissed, dismiss, resolve, remove }) => (
      <CounterModal
        defaultValue={defaultValue}
        isOpened={!dismissed}
        onClose={() => {
          dismiss();
          resolve(undefined);
        }}
        onCloseAnimationFinished={remove}
        onSubmit={(count) => {
          onSubmit?.({ dismiss });
          resolve(count);
        }}
      />
    ),
    id
  );
