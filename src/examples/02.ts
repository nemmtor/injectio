import { CaptureBasicProfileDialog } from '@/features/capture-basic-profile/capture-basic-profile-dialog';
import { ThanksDialog } from '@/features/thanks-dialog';
import { Deferred, Effect, Duration } from 'effect';

/**
 * Simple flow - capture profile dialog, use it as a prefill for 2nd capture profile dialog and display greetings at the end
 */
export const startExample2 = () =>
  CaptureBasicProfileDialog.inject().pipe(
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
    Effect.flatMap((profile) => CaptureBasicProfileDialog.inject({ profile })),
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
    Effect.tap(() =>
      ThanksDialog.inject().pipe(
        Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
        Effect.timeout(Duration.seconds(3)),
        Effect.ignore,
        Effect.scoped,
      ),
    ),
    Effect.tap(Effect.log),
    Effect.runPromise,
  );
