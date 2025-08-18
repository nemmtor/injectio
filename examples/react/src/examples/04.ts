import { Deferred, Duration, Effect } from 'effect';
import { LoaderDialog } from '@/components/loader-dialog';
import { CaptureBasicProfileDialog } from '@/features/capture-basic-profile/capture-basic-profile-dialog';
import { ThanksDialog } from '@/features/thanks-dialog';

const someApiCall = Effect.promise(() => {
  return new Promise<void>((res) => {
    setTimeout(() => res(), 2000);
  });
});

export const startExample4 = () =>
  Effect.gen(function* () {
    const basicProfile = yield* CaptureBasicProfileDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.scoped,
    );

    yield* LoaderDialog.inject({
      title: `Hi, ${basicProfile.firstName}!`,
      description: `Please hold on while we're preparing next steps for you.`,
    }).pipe(
      Effect.flatMap(() => someApiCall),
      Effect.scoped,
    );

    yield* ThanksDialog.inject().pipe(
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.timeout(Duration.seconds(2)),
      Effect.ignore,
      Effect.scoped,
    );

    return basicProfile;
  }).pipe(Effect.tap(Effect.log), Effect.runPromise);
