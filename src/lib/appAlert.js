const emitter = new EventTarget();

export function onAppAlert(cb) {
  const handler = (e) => cb(e.detail);
  emitter.addEventListener('app-alert', handler);
  return () => emitter.removeEventListener('app-alert', handler);
}

export function showAppAlert(payload = {}) {
  // payload: { type: 'success'|'error'|'info', title, message, timeout }
  emitter.dispatchEvent(new CustomEvent('app-alert', { detail: payload }));
}
