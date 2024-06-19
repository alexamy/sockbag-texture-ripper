import { Show, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

export function Help() {
  const [shown, setShown] = createSignal(false);

  return (
    <>
      <span class="help" onClick={() => setShown(true)}>❓</span>
      <Show when={shown()}>
        <Portal mount={document.body}>
          <div class="help-modal">
            <button onClick={() => setShown(false)}>Close</button>
            <Modal />
          </div>
        </Portal>
      </Show>
    </>
  );
}

function Modal() {
  return (<p>Hello! This is a help modal.</p>);
}
