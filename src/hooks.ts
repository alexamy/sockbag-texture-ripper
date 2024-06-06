import { onCleanup, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import {
  Actor,
  ActorOptions,
  AnyActorLogic,
  createActor as createActorXState,
} from "xstate";

export function createActor<TLogic extends AnyActorLogic>(
  logic: TLogic,
  options?: ActorOptions<TLogic>
): Actor<TLogic> {
  const actor = createActorXState(logic, options);

  onMount(() => {
    actor.start();
    onCleanup(() => actor.stop());
  });

  return actor;
}

export function createActorState<TLogic extends AnyActorLogic>(
  actor: Actor<TLogic>
) {
  const [snapshot, setSnapshot] = createStore(actor.getSnapshot());

  onMount(() => {
    const subscription = actor.subscribe((snapshot) => {
      setSnapshot(reconcile(snapshot));
    });

    onCleanup(() => subscription.unsubscribe());
  });

  return snapshot;
}
