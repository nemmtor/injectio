import { Atom } from "effect/reactivity";
import { Context, Duration, Effect, Layer } from "effect";
import { LoaderDialog } from "@/components/loader-dialog";

class Users extends Context.Service<Users>()("app/Users", {
  make: Effect.succeed({
    create: (name: string) =>
      Effect.succeed({ id: 1, name }).pipe(Effect.delay(Duration.seconds(3))),
  } as const),
}) {
  static readonly layer = Layer.effect(this, this.make);
}

const runtimeAtom = Atom.runtime(Users.layer);

export const createUserAtom = runtimeAtom.fn((name: string) =>
  Effect.gen(function* () {
    yield* Effect.addFinalizer(() => Effect.log("finalizer"));
    const users = yield* Users;
    yield* LoaderDialog.inject({
      title: `Hold on ${name}`,
      description: "Your profile is being created.",
    });
    const user = yield* users.create(name);

    return user;
  }).pipe(Effect.scoped),
);
