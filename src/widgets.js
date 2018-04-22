export default class Widgets {
    static input(parent, type) {
        const input = document.createElement('input')
        input.className = 'input'
        input.setAttribute('type', type)
        parent.appendChild(input)
        return input
    }
    static button(parent, text) { //logout, back, submit
        const button = document.createElement('button')
        button.className = 'button'
        button.innerHTML = text
        parent.appendChild(button)
        return button
    }
    static div(parent, className) {
        const div = document.createElement('div')
        div.className = className
        parent.appendChild(div)
        return div
    }
    static label(parent, text) {
        const label = document.createElement('label')
        label.className = 'label'
        label.innerHTML = text
        parent.appendChild(label)
        return label
    }
    static inputDiv(parent, type, text, inline) {
        const inputDiv = this.div(parent, 'inputDiv')
        inputDiv.label = this.label(inputDiv, text)
        inputDiv.input = this.input(inputDiv, type)
        if (inline) {
            inputDiv.style.display = "inline";
        }
        return inputDiv
    }

    static textElement(parent, type, text) {
        const element = document.createElement(type)
        element.innerHTML = text
        parent.appendChild(element)
        return element
    }
}