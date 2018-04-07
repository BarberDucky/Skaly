export class UsersService {
    constructor () {
        this.data = {}
    }
    addUser (credentials) {
        if (!credentials.username || !credentials.password) {
            alert('Input username and password')
            return Promise.reject()
        } else {
            return fetch(`http://localhost:3000/users?username=${credentials.username}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length != 0) {
                        alert('Username already exists')
                        return Promise.reject()
                    } else {
                        fetch('http://localhost:3000/users', {
                            method: 'POST', 
                            body: JSON.stringify(credentials), 
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            })
                        })
                            .then(() => alert('Successful registration'))
                    }
                }
            )
        }
    }
    checkUser (credentials) {
        if (!credentials.username || !credentials.password) {
            alert('Input username and password')
            return Promise.reject()
        } else {
            return fetch(`http://localhost:3000/users?username=${credentials.username}&password=${credentials.password}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length == 0) {
                        alert('Wrong credentials')
                        return Promise.reject()
                    } else {
                        alert('Successful login')
                        return Promise.resolve(res[0])
                    }
                }
            )
        }
    }
    setData (data) {
        this.data = data
    }
}