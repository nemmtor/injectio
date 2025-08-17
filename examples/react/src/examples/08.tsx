import { Atom, useAtomValue } from '@effect-atom/atom-react';
import { inject } from '@injectio/react';
import { Deferred, Effect } from 'effect';

class Users extends Effect.Service<Users>()('app/Users', {
  succeed: {
    getAll: Effect.succeed([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ]),
  },
}) {}

const runtimeAtom = Atom.runtime(Users.Default);

const selectedUserAtom = runtimeAtom.atom(
  Effect.gen(function* () {
    const users = yield* Users;
    const allUsers = yield* users.getAll;
    const { deferred } = yield* inject<{ id: string; name: string }>({
      renderFn: ({ deferred }) => (
        <SelectUserForm
          users={allUsers}
          onSelect={(user) =>
            deferred.pipe(Deferred.succeed(user), Effect.runPromise)
          }
        />
      ),
      initialProps: {},
    });

    return yield* Deferred.await(deferred);
  }).pipe(Effect.scoped),
);

export const useSelectedUser = () => {
  return useAtomValue(selectedUserAtom);
};
