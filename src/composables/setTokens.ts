export function setToken(data: string) {
	localStorage.setItem('diatonicToken', data)
}

export function removeToken() {
	localStorage.removeItem('diatonicToken')
}

export function isauthenticated() {
	let isauth = localStorage.getItem('diatonicToken') ? true : false
	return isauth
}
