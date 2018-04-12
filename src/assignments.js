export default class Assignments {
    static getAssignments() {
        const assignments = [{
                text: 'Kolok',
                color: '#b200ff'
            },
            {
                text: 'Ispit',
                color: 'green'
            },
            {
                text: 'Lab',
                color: 'red'
            },
            {
                text: 'Projekat',
                color: 'orange'
            },
            {
                text: 'Domaci',
                color: 'yellow'
            },
            {
                text: 'Ostalo',
                color: 'blue'
            }
        ]
        return assignments
    }
    static findAssignment(key) {
        let assignment = Assignments.getAssignments()
            .find(element => element.text[0] == key)
        if (assignment) {
            return assignment
        } else {
            return null
        }
    }
}