export default class Selector {
    constructor (parent) {
        this.assignments = [{
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
        }]
        this.selector = this.createSelector(parent)
    }
    getSelector() {
        return this.selector
    }
    findAssignment(key) {
        let assignment = {}
        if (key != 'X') {
            assignment = this.assignments.filter(element => element.text[0] == key)
        }
        return assignment[0]
    }
    createSelector(parent) {
        const selector = document.createElement('div')
        selector.className = 'selector'
        selector.array = this.createAssignments(selector)
        parent.appendChild(selector)
        return selector
    }
    createAssignments(parent) {
        const assignments = this.assignments.map(assign => {
            const assignDiv = document.createElement('div')
            assignDiv.className = 'assignDiv'
            assignDiv.id = assign.text
            assignDiv.innerHTML = `${assign.text[0]} </br> ${assign.text}`
            assignDiv.style.color = assign.color
            assignDiv.assign = assign
            assignDiv.draggable = true;
            assignDiv.ondragstart = (ev) => {
                ev.dataTransfer.setData('application/json', JSON.stringify(assignDiv.assign))
            }
            parent.appendChild(assignDiv)
            return assignDiv
        })
    }
}



