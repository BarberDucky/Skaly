export default class UsersService {
    constructor() {
        this.data = {}
    }
    static addUser(credentials) {
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
    static checkUserExists(id) {
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

    static checkUser(credentials) {
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
    static setData(data) {
        this.data = data
        return new Promise((resolve, reject) => resolve(data))
    }
    static getData() {
        return this.data
    }
    static getSubjects() {
        if (this.data)
            return this.data.subjects
    }
    static getSuperUser() {
        return this.data.getSuperUser
    }
    static setSubjects(newSubjects) {
        this.data.subjects = newSubjects
    }
    static updateUser() {
        return fetch(`http://localhost:3000/users/${this.data.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
}