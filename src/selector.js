import Widgets from './widgets'
import Assignments from './assignments'

export default class Selector {
    constructor(parent) {
        this.selector = this.createSelector(parent)
    }
    getSelector() {
        return this.selector
    }
    findAssignment(key) {
        return Assignments.findAssignment(key)
    }
    createSelector(parent) {
        const selector = Widgets.div(parent, 'selector')
        selector.array = this.createAssignments(selector)
        return selector
    }
    createAssignments(parent) {
        const assignments = Assignments.getAssignments().map(assignment => {
            const assignDiv = Widgets.div(parent, 'assignDiv')
            assignDiv.id = assignment.text
            assignDiv.innerHTML = `${assignment.text[0]} </br> ${assignment.text}`
            assignDiv.style.color = assignment.color
            assignDiv.data = assignment
            assignDiv.draggable = true;
            assignDiv.ondragstart = (ev) => {
                ev.dataTransfer.setData('application/json', JSON.stringify(assignDiv.data))
            }
            return assignDiv
        })
        return assignments
    }
}