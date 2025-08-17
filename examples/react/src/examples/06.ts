import { ProgressDialog } from "@/components/progress-dialog";
import type { BasicProfile } from "@/features/capture-basic-profile/basic-profile-form";
import { CaptureBasicProfileDialog } from "@/features/capture-basic-profile/capture-basic-profile-dialog";
import { ThanksDialog } from "@/features/thanks-dialog";
import { Data, Deferred, Duration, Effect, Fiber, Ref } from "effect";
import { toast } from "sonner";

const someApiCall = Effect.promise(() => {
  return new Promise<void>((res) => {
    setTimeout(() => res(), 2000);
  });
});

const MAX_ATTEMPTS = 3;
class RetryError extends Data.TaggedError("RetryError") {}

const waitForSomeApiCallFlow = (
  basicProfile: BasicProfile,
  attemptRef: Ref.Ref<number>
) =>
  Effect.gen(function* () {
    yield* Ref.update(attemptRef, (v) => v + 1);
    const attempt = yield* Ref.get(attemptRef);
    const canRetry = attempt < MAX_ATTEMPTS;

    const progressDialog = yield* ProgressDialog.inject<RetryError>({
      title: `Hi, ${basicProfile.firstName}!`,
      description: `Please hold on while we're preparing next steps for you.`,
      progress: 10,
    });

    const apiCallFiber = yield* Effect.fork(
      someApiCall.pipe(Effect.delay(Duration.seconds(100)))
    );
    const apiResult = Fiber.join(apiCallFiber).pipe(
      (v) => v,
      Effect.catchAllCause(() => {
        return Effect.fail(new RetryError());
      })
    );

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

      Effect.flatMap(() =>
        Effect.if(canRetry, {
          onFalse: () => Effect.fail(new RetryError()),
          onTrue: () =>
            Effect.sync(() => {
              progressDialog.updateProps({
                description: "Something might be wrong, please retry.",
                onRetry: () => {
                  Effect.runPromise(Fiber.interrupt(apiCallFiber));
                },
              });
            }),
        })
      ),
      Effect.flatMap(() => apiResult)
    );

    return yield* Effect.raceFirst(apiResult, slowPath);
  }).pipe(
    Effect.scoped,
    Effect.retry({
      times: MAX_ATTEMPTS - 1,
      while: (e) => e instanceof RetryError,
    }),
    Effect.tapErrorTag("RetryError", () =>
      Effect.sync(() => toast.error("Sorry, try again later."))
    )
  );

export const startExample6 = () =>
  Effect.gen(function* () {
    const basicProfile = yield* CaptureBasicProfileDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.scoped
    );

    const retryCountRef = yield* Ref.make(0);
    yield* waitForSomeApiCallFlow(basicProfile, retryCountRef);

    yield* ThanksDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.timeout(Duration.seconds(2)),
      Effect.ignore,
      Effect.scoped
    );

    return basicProfile;
  }).pipe(Effect.tap(Effect.log), Effect.runPromise);
