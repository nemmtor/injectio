import { Button } from '../components/button';

import { injectCounterModal } from './counter-modal';

type StartProps = {
  modal1DefaultValue?: number;
  modal2DefaultValue?: number;
};

const start = async ({
  modal1DefaultValue,
  modal2DefaultValue,
}: StartProps = {}) => {
  const modal1 = injectCounterModal({
    onSubmit: ({ dismiss }) => {
      dismiss();
    },
    defaultValue: modal1DefaultValue,
    id: 'modal1',
  });
  const modal1Value = await modal1.value;

  if (modal1Value === undefined) {
    return;
  }

  const modal2 = injectCounterModal({
    defaultValue: modal2DefaultValue,
    onSubmit: ({ dismiss }) => {
      dismiss();
      modal1.dismiss();
    },
  });
  const modal2Value = await modal2.value;
  if (modal2Value === undefined) {
    return start({
      modal1DefaultValue: modal1Value as number,
    });
  }
  alert(`Flow finished with modal1: ${modal1Value} and modal2: ${modal2Value}`);
};
export const ModalsFlowWithDismissingButStatePersisted = () => {
  return (
    <Button onClick={start}>
      Start Modals Flow With Dismissing But State Persisted
    </Button>
  );
};
