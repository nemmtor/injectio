import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LuBadgeCheck } from "react-icons/lu";
import { Deferred, Duration, Effect } from "effect";
import { addFinalizer } from "effect/Effect";
import { useCallback } from "react";
import { inject } from "@injectio/react";

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export const ThanksDialog = ({ open, onClose }: Props) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>That's it!</DialogTitle>
          <DialogDescription>
            Thank you for your time! <LuBadgeCheck />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

type InjectedProps = Pick<Props, "open">;

ThanksDialog.inject = () =>
  Effect.gen(function* () {
    const result = yield* inject<undefined, never, InjectedProps>({
      renderFn: ({ props, deferred }) => {
        const succeed = () =>
          deferred.pipe(Deferred.succeed(undefined), Effect.runSync);
        return <ThanksDialog {...props} onClose={succeed} />;
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
