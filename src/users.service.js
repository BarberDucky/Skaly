export class UsersService {
    constructor() {
        this.data = {}
    }
    addUser(credentials) {
        if (!credentials.id || !credentials.password) {
            alert('Input username and password')
            return Promise.reject()
        } else {
            return fetch(`http://localhost:3000/users?id=${credentials.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length != 0) {
                        alert('Username already exists')
                        return Promise.reject()
                    } else {
                        credentials.subjects = []
                        fetch('http://localhost:3000/users', {
                                method: 'POST',
                                body: JSON.stringify(credentials),
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            })
                            .then(() => alert('Successful registration'))
                    }
                })
        }
    }
    checkUserExists(id) {
        if (id != '') {
            return fetch(`http://localhost:3000/users?id=${id}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length != 0) {
                        return Promise.resolve()
                    } else {
                        return Promise.reject()
                    }
                })
        } else {
            return Promise.resolve()
        }
    }

    checkUser(credentials) {
        if (!credentials.id || !credentials.password) {
            alert('Input username and password')
            return Promise.reject()
        } else {
            return fetch(`http://localhost:3000/users?id=${credentials.id}&password=${credentials.password}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length == 0) {
                        alert('Wrong credentials')
                        return Promise.reject()
                    } else {
                        alert('Successful login')
                        return Promise.resolve(res[0])
                    }
                })
        }
    }
    setData(data) {
        this.data = data
        return new Promise((resolve, reject) => resolve(data))
    }
    updateUser() {
        return fetch(`http://localhost:3000/users/${this.data.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
}