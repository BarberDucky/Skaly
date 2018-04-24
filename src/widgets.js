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
    static imageDiv(parent, className, src) {
        let div = Widgets.div(parent, className)
        let image = document.createElement('img')
        image.src = src
        image.style.maxHeight = '100%'
        image.style.maxWidth = '100%'
        div.appendChild(image)
        return div
    }
    static checkInput(input, state) {
        let color
        if (state) {
            color = "red"
        } else {
            color = "green"
        }
        input.style.outline = `2px solid ${color}`

    }
}