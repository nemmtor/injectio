import { useCallback, useState } from 'react';
import { inject, UpdatePropsFn } from '@injectio/react';

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

type CounterModalProps = {
  isOpened: boolean;
};

type OnSubmitProps = {
  updateProps: (updater: (props: CounterModalProps) => CounterModalProps) => void;
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
}: InjectProps = {}): {
  updateProps: UpdatePropsFn<CounterModalProps>;
  resolve: (value?: number | undefined) => void;
  value: Promise<number | undefined>;
} => {
  let updatePropsRef: ((updater: (props: CounterModalProps) => CounterModalProps) => void) | undefined;
  
  const result = inject<CounterModalProps, number | undefined>(
    ({ props, resolve, remove }) => (
      <CounterModal
        defaultValue={defaultValue}
        isOpened={props.isOpened}
        onClose={() => {
          updatePropsRef?.((p) => ({ ...p, isOpened: false }));
          resolve(undefined);
        }}
        onCloseAnimationFinished={remove}
        onSubmit={(count) => {
          onSubmit?.({ updateProps: updatePropsRef! });
          resolve(count);
        }}
      />
    ),
    { isOpened: true },
    id
  );
  
  updatePropsRef = result.updateProps;
  
  return result;
};
