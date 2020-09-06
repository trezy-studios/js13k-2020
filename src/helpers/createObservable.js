export function createObservable(objectToObserve) {
	let eventTarget = new EventTarget

	return new Proxy(objectToObserve, {
		get (object, key) {
			if (key === 'on') {
				return eventTarget.on.bind(eventTarget)
			}

			return object[key]
		},

		set (object, key, value) {
			let eventOptions = {
				detail: {
					key,
					value,
				},
			}

			object[key] = value

			eventTarget.dispatchEvent(new CustomEvent(`change:${key}`, eventOptions))
			eventTarget.dispatchEvent(new CustomEvent('change', eventOptions))

			return 1
		},
	})
}
