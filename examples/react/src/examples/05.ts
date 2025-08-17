import { ProgressDialog } from "@/components/progress-dialog";
import type { BasicProfile } from "@/features/capture-basic-profile/basic-profile-form";
import { CaptureBasicProfileDialog } from "@/features/capture-basic-profile/capture-basic-profile-dialog";
import { ThanksDialog } from "@/features/thanks-dialog";
import { Deferred, Duration, Effect, Fiber } from "effect";

const someApiCall = Effect.promise(() => {
  return new Promise<void>((res) => {
    setTimeout(() => res(), 2000);
  });
});

const waitForSomeApiCallFlow = (basicProfile: BasicProfile) =>
  Effect.gen(function* () {
    const progressDialog = yield* ProgressDialog.inject({
      title: `Hi, ${basicProfile.firstName}!`,
      description: `Please hold on while we're preparing next steps for you.`,
      progress: 10,
    });

    const apiCallFiber = yield* Effect.fork(
      someApiCall.pipe(Effect.delay(Duration.seconds(20)))
    );
    const apiResult = Fiber.join(apiCallFiber);

    const slowPath = Effect.void.pipe(
      Effect.tap(() =>
        Effect.sync(() =>
          progressDialog.updateProps({
            progress: 15,
          })
        ).pipe(Effect.delay(Duration.millis(500)))
      ),
      Effect.tap(() =>
        Effect.sync(() =>
          progressDialog.updateProps({
            description: "Nearly there...",
            progress: 20,
          })
        ).pipe(Effect.delay(Duration.millis(500)))
      ),
      Effect.tap(() =>
        Effect.sync(() =>
          progressDialog.updateProps({
            progress: 25,
          })
        ).pipe(Effect.delay(Duration.millis(500)))
      ),
      Effect.tap(() =>
        Effect.sync(() =>
          progressDialog.updateProps({
            progress: 30,
          })
        ).pipe(Effect.delay(Duration.millis(500)))
      ),
      Effect.tap(
        Effect.sync(() =>
          progressDialog.updateProps({
            description:
              "Please hold on, it should take only few seconds more.",
            progress: 40,
          })
        ).pipe(Effect.delay(Duration.seconds(2)))
      ),
      Effect.tap(
        Effect.sync(() =>
          progressDialog.updateProps({
            description: `Usually it doesn't take that long...`,
          })
        ).pipe(Effect.delay(Duration.seconds(3)))
      ),
      Effect.flatMap(() => apiResult)
    );

    return yield* Effect.raceFirst(apiResult, slowPath);
  }).pipe(Effect.scoped);

export const startExample5 = () =>
  Effect.gen(function* () {
    const basicProfile = yield* CaptureBasicProfileDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.scoped
    );

    yield* waitForSomeApiCallFlow(basicProfile);

    yield* ThanksDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.timeout(Duration.seconds(2)),
      Effect.ignore,
      Effect.scoped
    );

    return basicProfile;
  }).pipe(Effect.tap(Effect.log), Effect.runPromise);
