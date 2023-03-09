function on(eventName, listener) {
  const callListener = ({ detail }) => {
    listener(detail)
  }
  window.addEventListener(eventName, callListener)
  return () => {
    window.removeEventListener(eventName, callListener)
  }
}

function emit(eventName, data) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
}

export const eventBus = { on, emit }

export const eventBusService = { on, emit }

export function showUserMsg(msg) {
    eventBusService.emit('show-msg', msg)    
}

export function showSuccessMsg(txt) {
    showUserMsg({txt, type: 'success'})
}
export function showErrorMsg(txt) {
    showUserMsg({txt, type: 'error'})
}
