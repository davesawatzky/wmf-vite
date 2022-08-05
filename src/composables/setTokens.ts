export function setToken(data: string) {
  localStorage.setItem('diatonicToken', data)
}

export function removeToken() {
  localStorage.removeItem('diatonicToken')
}
