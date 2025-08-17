import { CaptureBasicProfileDialog } from "@/features/capture-basic-profile/capture-basic-profile-dialog";
import { ThanksDialog } from "@/features/thanks-dialog";
import { Deferred, Duration, Effect } from "effect";

export const startExample3 = () =>
  CaptureBasicProfileDialog.inject().pipe(
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.flatMap((profile) => CaptureBasicProfileDialog.inject({ profile })),
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.tap(() =>
      ThanksDialog.inject().pipe(
        Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
        Effect.timeout(Duration.seconds(3)),
        Effect.ignore
      )
    ),
    Effect.scoped,
    Effect.tap(Effect.log),
    Effect.runPromise
  );
