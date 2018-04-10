export default class Widgets {
    static input (parent, type) { //colorPicker, subjectInput
        const input = document.createElement('input')
        input.className = 'input'
        input.setAttribute('type', type)
        parent.appendChild(input)
        return input
    }
    static button (parent, text) { //logout, back, submit
        const button = document.createElement('button')
        button.className = 'button'
        button.innerHTML = text
        parent.appendChild(button)
        return button
    }
    static div (parent, className) {
        const div = document.createElement('div')
        div.className = className
        parent.appendChild(div)
        return div
    }
}