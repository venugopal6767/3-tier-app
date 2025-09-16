// minimal client-side auth helpers
export function saveToken(token){
localStorage.setItem('token', token)
}
export function getToken(){
return localStorage.getItem('token')
}
export function logout(){
localStorage.removeItem('token')
}