// adapted from https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95

import React from 'react'

function animationInterval(ms, signal, callback) {
	const start = document?.timeline?.currentTime || performance.now()

	function frame(time) {
		if (signal.aborted) {
			return
		}
		callback(time)
		scheduleFrame(time)
	}

	function scheduleFrame(time) {
		const elapsed = time - start
		const roundedElapsed = Math.round(elapsed / ms) * ms
		const targetNext = start + roundedElapsed + ms
		const delay = targetNext - performance.now()
		setTimeout(() => requestAnimationFrame(frame), delay)
	}

	scheduleFrame(start)
}

export const useAnimationFrame = (ms, callback) => {
	const [delayMs, setDelayMs] = React.useState(0)

	const callbackRef = React.useRef(callback)
	React.useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	React.useEffect(() => {
		const controller = new AbortController()
		if (delayMs > 0) {
			animationInterval(delayMs, controller.signal, callbackRef.current)
		}
		return () => controller.abort()
	}, [delayMs])

	return {
		start: React.useCallback(() => setDelayMs(ms), [ms]),
		stop: React.useCallback(() => setDelayMs(0), []),
	}
}