import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BasicProfileForm, type BasicProfile } from "./basic-profile-form";
import { Button } from "@/components/ui/button";
import { Data, Deferred, Duration, Effect } from "effect";
import { useCallback, useId } from "react";
import { addFinalizer } from "effect/Effect";
import { inject } from "@injectio/react";

type Props = {
  onCancel: VoidFunction;
  open: boolean;
  profile?: BasicProfile;
  onSubmit: (profile: BasicProfile) => void;
};

export const CaptureBasicProfileDialog = ({
  open,
  profile,
  onSubmit,
  onCancel,
}: Props) => {
  const id = useId();
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
    },
    [onCancel]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Basic information</DialogTitle>
          <DialogDescription>Tell as about yourself.</DialogDescription>
        </DialogHeader>

        <BasicProfileForm profile={profile} onSubmit={onSubmit} id={id} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={id}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

class CaptureBasicProfileCancelledError extends Data.TaggedError(
  "CaptureBasicProfileCancelledError"
) {}

type InjectArgs = {
  profile?: BasicProfile;
};

type InjectedProps = Pick<Props, "open">;

CaptureBasicProfileDialog.inject = ({ profile }: InjectArgs = {}) =>
  Effect.gen(function* () {
    const result = yield* inject<
      BasicProfile,
      CaptureBasicProfileCancelledError,
      InjectedProps
    >({
      renderFn: ({ props, deferred }) => {
        const fail = () =>
          deferred.pipe(
            Deferred.fail(new CaptureBasicProfileCancelledError()),
            Effect.runSync
          );
        const succeed = (basicProfile: BasicProfile) =>
          deferred.pipe(Deferred.succeed(basicProfile), Effect.runSync);

        return (
          <CaptureBasicProfileDialog
            {...props}
            profile={profile}
            onCancel={fail}
            onSubmit={succeed}
          />
        );
      },
      initialProps: {
        open: true,
      },
    });

    yield* addFinalizer(() => {
      result.updateProps({ open: false });
      return Effect.sleep(Duration.millis(150));
    });

    return result;
  });
