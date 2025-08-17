import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Duration, Effect } from "effect";
import { Progress } from "./ui/progress";
import { inject } from "@injectio/react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  progress: number;
  onRetry?: VoidFunction;
};

export const ProgressDialog = ({
  open,
  title,
  description,
  progress,
  onRetry,
}: Props) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Progress value={progress} />

        {onRetry ? (
          <DialogFooter>
            <Button onClick={onRetry}>Retry</Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

type InjectedProps = Pick<
  Props,
  "open" | "description" | "progress" | "onRetry"
>;

type InjectArgs = Pick<Props, "title" | "progress" | "description" | "onRetry">;

ProgressDialog.inject = <E = never,>({
  title,
  description,
  progress,
  onRetry,
}: InjectArgs) =>
  Effect.gen(function* () {
    const result = yield* inject<undefined, E, InjectedProps>({
      renderFn: ({ props }) => {
        return <ProgressDialog {...props} title={title} />;
      },
      initialProps: {
        open: true,
        progress,
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
