import { Button } from '../components/button';

import { injectCounterModal } from './counter-modal';

type CounterModalProps = {
  isOpened: boolean;
};

const start = async () => {
  const modal1 = injectCounterModal({
    onSubmit: ({ updateProps }) => {
      updateProps((p) => ({ ...p, isOpened: false }));
    },
  });
  const modal1Value = await modal1.value;

  if (modal1Value === undefined) {
    return;
  }

  const modal2 = injectCounterModal({
    onSubmit: ({ updateProps }) => {
      updateProps((p) => ({ ...p, isOpened: false }));
      modal1.updateProps((p: CounterModalProps) => ({ ...p, isOpened: false }));
    },
  });
  const modal2Value = await modal2.value;
  if (modal2Value === undefined) {
    return start();
  }
  alert(`Flow finished with modal1: ${modal1Value} and modal2: ${modal2Value}`);
};
export const ModalsFlowWithDismissingButStateReset = () => {
  return (
    <Button onClick={start}>
      Start Modals Flow With Dismissing But State Resetted
    </Button>
  );
};
