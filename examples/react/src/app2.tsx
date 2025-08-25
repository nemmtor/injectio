import { inject } from '@injectio/react';
import { Data, Deferred, Duration, Effect, flow } from 'effect';
import { useCallback } from 'react';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';

const mockProfile = {
  name: 'John',
};

const SelectProfileModal = (props: {
  onCancel: VoidFunction;
  onSelect: (profile: Profile) => void;
}) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        props.onCancel();
      }
    },
    [props.onCancel],
  );

  return (
    <Dialog modal open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a profile:</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={props.onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => props.onSelect(mockProfile)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type Profile = { name: string };

// TODO: Cool idea - after timeout it starts to behave differently via updateProps

class SelectProfileCancelledError extends Data.TaggedError(
  'SelectProfileCancelledError',
) {}

// select profile returns an Effect of type:
// Effect.Effect<Profile, SelectProfileCancelledError | TimeoutException, never>
const selectProfile = () =>
  inject<Profile, SelectProfileCancelledError>({
    initialProps: {},
    renderFn: ({ deferred }) => (
      <SelectProfileModal
        onCancel={() =>
          deferred.pipe(
            Deferred.fail(new SelectProfileCancelledError()),
            Effect.runPromise,
          )
        }
        onSelect={(profile) =>
          deferred.pipe(Deferred.succeed(profile), Effect.runPromise)
        }
      />
    ),
  }).pipe(
    Effect.timeout(Duration.seconds(30)),
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
  );

export const Example = () => {
  const startOnboarding = useCallback(async () => {
    const profile = await selectProfile().pipe(Effect.runPromise);
    // proceed with collected profile
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={startOnboarding} variant="outline">
        Start onboarding
      </Button>
    </div>
  );
};
