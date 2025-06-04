import { Button } from '../components/button';

import { injectCounterModal } from './counter-modal';

const start = async () => {
  const modal1 = injectCounterModal({ id: 'modal1' });
  const modal1Value = await modal1.value;

  // modal1 was closed without submitting
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
  // modal2 was closed without submitting - restart from modal1
  if (modal2Value === undefined) {
    return start();
  }
  alert(`Flow finished with modal1: ${modal1Value} and modal2: ${modal2Value}`);
};

export const ModalsFlowWithStacking = () => {
  return <Button onClick={start}>Start Modals Flow With Stacking</Button>;
};
