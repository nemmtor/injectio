import { inject } from '@injectio/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Duration, Effect } from 'effect';
import { Spinner } from './ui/spinner';

type Props = {
  open: boolean;
  title: string;
  description: string;
  onRetry?: VoidFunction;
};

export const LoaderDialog = ({ open, title, description, onRetry }: Props) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Spinner />
      </DialogContent>

      {onRetry && (
        <DialogFooter>
          <Button onClick={onRetry}>Retry</Button>
        </DialogFooter>
      )}
    </Dialog>
  );
};

type InjectedProps = Pick<Props, 'open' | 'description' | 'onRetry'>;

type InjectArgs = Pick<Props, 'title' | 'description' | 'onRetry'>;

LoaderDialog.inject = <E = never>({
  title,
  description,
  onRetry,
}: InjectArgs) =>
  Effect.gen(function* () {
    const result = yield* inject<undefined, E, InjectedProps>({
      renderFn: ({ props }) => {
        return <LoaderDialog {...props} title={title} />;
      },
      initialProps: {
        open: true,
        description,
        onRetry,
      },
    });

    yield* Effect.addFinalizer(() => {
      result.updateProps({ open: false });
      return Effect.sleep(Duration.millis(150));
    });

    return result;
  });
