export default class FormatService {
    static getFormat(subject) {
        fetch(`http://localhost:3000/formats/${subject.text}`)
            .then(res => res.json())
            .then(res => {
                if (res.length != 0) {
                    return res[0]
                }
            })
    }
    static postFormat(subject, user) {
        fetch(`http://localhost:3000/formats`, {
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