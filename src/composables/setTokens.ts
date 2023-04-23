export function setToken(data: string) {
  sessionStorage.setItem('diatonicToken', data)
}

export function removeToken() {
  sessionStorage.removeItem('diatonicToken')
}

export function isauthenticated() {
  let isauth = sessionStorage.getItem('diatonicToken') ? true : false
  return isauth
}
