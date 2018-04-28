export default class FormatService {
    static getFormat(subject) {
        return fetch(`http://localhost:3000/formats?id=${subject.text}`)
            .then(res => res.json())
            .then(res => {
                if (res.length != 0) {
                    return Promise.resolve(res[0])
                } else {
                    return Promise.reject()
                }
            })
    }
    static getFormatRegExp(regExp) {
        console.log(regExp)
        return fetch(`http://localhost:3000/formats?id_like=^${regExp}`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.length != 0) {
                    return Promise.resolve(res)
                } else {
                    return Promise.reject()
                }
            })
    }
    static getFormatAll() {
        return fetch(`http://localhost:3000/formats`)
            .then(res => res.json())
            .then(res => Promise.resolve(res))
    }
    static postFormat(subject, user) {
        return fetch(`http://localhost:3000/formats?id=${subject.text}`)
            .then(res => res.json())
            .then(res => {
                if (res.length != 0) {
                    alert("Subject already exists")
                    return Promise.reject()
                } else {
                    fetch('http://localhost:3000/formats', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: subject.text,
                            user: user,
                            format: subject.scale.format
                        }),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                }
            })
    }
    static putFormat(subject, user) {
        fetch(`http://localhost:3000/formats/${subject.text}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: subject.text,
                user: user,
                format: subject.scale.format
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
    static deleteFormat(subject) {
        fetch(`http://localhost:3000/formats/${subject.text}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
}