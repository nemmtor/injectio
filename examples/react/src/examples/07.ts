import { Atom } from '@effect-atom/atom-react';
import { Duration, Effect } from 'effect';
import { LoaderDialog } from '@/components/loader-dialog';

class Users extends Effect.Service<Users>()('app/Users', {
  succeed: {
    create: (name: string) =>
      Effect.succeed({ id: 1, name }).pipe(Effect.delay(Duration.seconds(3))),
  } as const,
}) {}

const runtimeAtom = Atom.runtime(Users.Default);

export const createUserAtom = runtimeAtom.fn((name: string) =>
  Effect.gen(function* () {
    yield* Effect.addFinalizer(() => Effect.log('finalizer'));
    const users = yield* Users;
    yield* LoaderDialog.inject({
      title: `Hold on ${name}`,
      description: 'Your profile is being created.',
    });
    const user = yield* users.create(name);

    return user;
  }).pipe(Effect.scoped),
);
