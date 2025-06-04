import { Button } from '../components/button';

import { injectCounterModal } from './counter-modal';

const start = async () => {
  const modal1 = injectCounterModal({
    onSubmit: ({ dismiss }) => {
      dismiss();
    },
  });
  const modal1Value = await modal1.value;

  if (modal1Value === undefined) {
    return;
  }

  const modal2 = injectCounterModal({
    onSubmit: ({ dismiss }) => {
      dismiss();
      modal1.dismiss();
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
