import { Effect, Deferred } from "effect";

import { CaptureBasicProfileDialog } from "@/features/capture-basic-profile/capture-basic-profile-dialog";

export const startExample1 = () =>
  CaptureBasicProfileDialog.inject().pipe(
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
    Effect.tap(Effect.log),
    Effect.runPromise
  );
