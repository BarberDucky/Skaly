import Selector from './selector'
import Widgets from './widgets'

export default class Table {
    constructor(parent) {
        this.main = Widgets.div(parent, 'tableMain')

        this.table = []
        this.selectedBox = {}
        this.superUser = false

        this.selector = new Selector(this.main)
        this.tableDiv = this.createTable(this.main, 3, 10)
        this.PointInput = this.createPointInput(this.main)
        this.caluclateText = this.createCalculateText(this.main)
        this.calculateButton = this.createCalculateButton(this.main)
    }
    getData() {
        let generated = this.generateFormat()
        let data = {
            rows: this.table.length,
            cols: this.table[0].length,
            format: generated.format,
            points: generated.points
        }
        return data
    }
    getEmptyScale() {
        return {
            rows: this.table.length,
            cols: this.table[0].length,
            format: ['XXXXXXXXXX', 'XXXXXXXXXX', 'XXXXXXXXXX']
        }
    }
    updateData(data, superUser) {
        console.log(data)
        this.superUser = superUser
        this.selector.setActive(superUser)
        for (let i = 0; i < data.rows; i++) {
            let last = {}
            for (let j = 0; j < data.cols; j++) {
                if (data.format[i][j] != '+') {
                    last = this.table[i][j]
                    this.table[i][j].colSpan = '1'
                    this.table[i][j].hidden = false
                    this.table[i][j].history = []
                    let reset
                    let assignment = this.selector.findAssignment(data.format[i][j])
                    if (assignment) {
                        this.table[i][j].data = assignment
                        if (data.points && data.points[i][j] != 'X') {
                            this.table[i][j].points = data.points[i][j]
                            this.table[i][j].lowerText.innerHTML = this.table[i][j].points
                        } else {
                            this.table[i][j].points = 0
                            this.table[i][j].lowerText.innerHTML = ''
                        }
                        if (this.superUser) {
                            this.table[i][j].ondragstart = (ev) => {
                                ev.dataTransfer.setData('application/json', JSON.stringify(this.table[i][j].data))
                            }
                            this.table[i][j].ondragend = (ev) => {
                                this.updateBox(this.table[i][j], `X${this.table[i][j].code.slice(1)}`, true)
                                this.deselectPointInput()
                            }
                        }
                        this.updateBox(this.table[i][j], assignment.text[0], false)

                    } else {
                        this.updateBox(this.table[i][j], 'X', true)
                    }
                } else {
                    let oldSpan = parseInt(last.colSpan)
                    last.colSpan = `${oldSpan + 1}`
                    last.code += '+'
                    last.history.push('hide')
                    this.table[i][j].colSpan = '1'
                    this.updateBox(this.table[i][j], '', true)
                    this.table[i][j].hidden = true
                    this.table[i][j].history = []
                }
            }
        }
    }
    createTable(parent, rowNum, colNum) {
        const tableDiv = document.createElement('table')
        let row = {}
        for (let i = 0; i < rowNum; i++) {
            row = document.createElement('tr')
            this.table[i] = []
            for (let j = 0; j < colNum; j++) {
                this.table[i][j] = this.createCell(i, j)
                row.appendChild(this.table[i][j])
            }
            tableDiv.appendChild(row)
        }
        parent.appendChild(tableDiv)
        return tableDiv
    }
    createCell(i, j) {
        const newCell = document.createElement('td')
        newCell.id = `cell${i}${j}`
        newCell.history = []
        newCell.upperText = Widgets.div(newCell, 'upperText')
        newCell.lowerText = Widgets.div(newCell, 'lowerText')
        newCell.controls = this.addControls(newCell, i, j)
        this.updateBox(newCell, 'X', true)
        newCell.onclick = () => {
            if (this.superUser) {
                const prevState = newCell.controls.hidden
                this.deselectControls()
                newCell.controls.hidden = !prevState
            }
        }
        newCell.ondblclick = () => {
            if (!this.superUser && newCell.data) {
                this.selectedBox = newCell
                this.PointInput.hidden = false
            }
        }
        newCell.ondragover = (ev) => {
            ev.preventDefault()
        }
        newCell.ondrop = (ev) => {
            if (this.superUser) {
                ev.preventDefault()
                const cellData = JSON.parse(ev.dataTransfer.getData('application/json'))
                newCell.data = cellData
                this.updateBox(newCell, `${cellData.text[0]}${newCell.code.slice(1)}`, false)
                newCell.ondragstart = (ev) => {
                    ev.dataTransfer.setData('application/json', JSON.stringify(newCell.data))
                }
                newCell.ondragend = (ev) => {
                    this.updateBox(newCell, `X${newCell.code.slice(1)}`, true)
                    this.deselectPointInput()
                }
            }
        }
        return newCell
    }
    generateFormat() {
        let format = []
        let points = []
        for (let i = 0; i < this.table.length; i++) {
            format[i] = ''
            points[i] = []
            for (let j = 0; j < this.table[i].length; j++) {
                if (this.table[i][j].points) {
                    points[i][j] = this.table[i][j].points
                } else {
                    points[i][j] = 'X'
                }
                if (!this.table[i][j].hidden) {
                    format[i] += this.table[i][j].code
                }
            }
        }
        return {
            format: format,
            points: points
        }
    }

    addControls(parent, x, y) {
        let oldSpan = {}
        const controlsDiv = Widgets.div(parent, 'controlsDiv')
        const enlargeControl = Widgets.div(controlsDiv, 'enlargeControl')
        enlargeControl.onclick = (ev) => {
            if (x != this.table[0].length - 1) {
                let nextElement = this.findNextCell(x, y)
                oldSpan = parseInt(this.table[x][y].colSpan)
                if (nextElement) {
                    if (nextElement.colSpan == '1') {
                        nextElement.hidden = true
                        nextElement.code = ''
                        parent.history.push({
                            oper: 'hide',
                            target: nextElement
                        })
                    } else {
                        let oldSpanNext = parseInt(nextElement.colSpan)
                        nextElement.colSpan = `${oldSpanNext - 1}`
                        this.modifyPoints(nextElement, oldSpanNext, (span) => span - 1)
                        nextElement.code = nextElement.code.slice(0, -1)
                        parent.history.push({
                            oper: 'borrow',
                            target: nextElement
                        })
                    }
                    this.table[x][y].colSpan = `${oldSpan+1}`
                    this.table[x][y].code += '+'
                    this.modifyPoints(this.table[x][y], oldSpan, (span) => span + 1)
                }
            }
            ev.cancelBubble = true
        }

        const reduceControl = Widgets.div(controlsDiv, 'reduceControl')
        reduceControl.onclick = (ev) => {
            if (parent.colSpan != '1') {
                oldSpan = parseInt(this.table[x][y].colSpan)
                let lastMove = parent.history.pop()
                if (lastMove.oper == 'hide') {
                    lastMove.target.hidden = false
                    if (lastMove.target.data) {
                        lastMove.target.code = lastMove.target.data.text[0]
                    } else {
                        lastMove.target.code = 'X'
                    }
                } else if (lastMove.oper == 'borrow') {
                    let oldSpanNext = parseInt(lastMove.target.colSpan)
                    lastMove.target.colSpan = `${oldSpanNext + 1}`
                    lastMove.target.code += '+'
                    this.modifyPoints(lastMove.target, oldSpanNext, (span) => span + 1)
                } else {
                    let prev = this.table[x][y + oldSpan - 1]
                    prev.hidden = false
                    if (prev.data) {
                        prev.code = prev.data.text[0]
                    } else {
                        prev.code = 'X'
                    }
                }
                this.table[x][y].colSpan = `${oldSpan - 1}`
                this.table[x][y].code = this.table[x][y].code.slice(0, -1)
                this.modifyPoints(this.table[x][y], oldSpan, (span) => span - 1)
            }
            ev.cancelBubble = true
        }
        controlsDiv.hidden = true
        return controlsDiv
    }
    findNextCell(x, y) {
        let a = x
        let b = y + 1
        while (b < this.table[a].length && this.table[a][b].hidden == true) {
            b++
        }
        return this.table[a][b]
    }
    modifyPoints(cell, oldSpan, operation) {
        if (cell.points) {
            const newSpan = operation(oldSpan)
            cell.points = ((newSpan * cell.points) / oldSpan).toFixed(2)
            cell.lowerText.innerHTML = cell.points
        }
    }
    updateBox(element, code, reset) {
        if (!reset) {
            element.code = code
            element.style.color = element.data.color
            element.style.borderColor = element.data.color
            element.upperText.innerHTML = element.data.text[0]
            element.draggable = true && this.superUser
        } else {
            element.code = code
            element.data = null
            element.style.color = 'slateblue'
            element.style.borderColor = 'slateblue'
            element.upperText.innerHTML = ''
            element.lowerText.innerHTML = ''
            element.points = 0
            element.draggable = false 
        }
    }
    createPointInput(parent) {
        const pointDiv = Widgets.div(parent, 'pointDiv')
        pointDiv.pointInput = Widgets.inputDiv(pointDiv, 'text', 'Earned points')
        pointDiv.maxInput = Widgets.inputDiv(pointDiv, 'text', 'Maximum possible points')
        pointDiv.submitButton = Widgets.button(pointDiv, 'Submit')
        pointDiv.cancelButton = Widgets.button(pointDiv, 'Cancel')
        pointDiv.hidden = true
        pointDiv.submitButton.onclick = () => {
            if (this.selectedBox.data) {
                let colSpan = parseInt(this.selectedBox.colSpan)
                let point = parseInt(pointDiv.pointInput.input.value)
                let max = parseInt(pointDiv.maxInput.input.value)
                if (!isNaN(point) && !isNaN(max) && max >= point) {
                    this.selectedBox.points = (((point * 100 / max) / 100) * 10 * colSpan).toFixed(2)
                    this.selectedBox.lowerText.innerHTML = this.selectedBox.points
                    this.deselectPointInput()
                } else {
                    alert('invalid input')
                }
            } else {
                this.deselectPointInput()
            }
        }
        pointDiv.cancelButton.onclick = () => {
            this.deselectPointInput()
        }
        return pointDiv
    }
    createCalculateText(parent) {
        const text = Widgets.div(parent, 'markDiv')
        return text
    }
    createCalculateButton(parent) {
        const calcButton = Widgets.button(parent, 'Calculate')
        calcButton.onclick = () => {
            let max = 0
            let rowValue
            for (let i = 0; i < this.table.length; i++) {
                rowValue = this.table[i]
                    .filter(element => element.points && !element.hidden)
                    .reduce((acc, element) => acc + parseInt(element.points), 0)
                if (rowValue > max) {
                    max = rowValue
                }
            }
            this.caluclateText.hidden = false
            this.caluclateText.innerHTML = `Osvojeno poena: ${max}`
        }
        return calcButton
    }
    deselectControls() {
        for (let i = 0; i < this.table.length; i++) {
            for (let j = 0; j < this.table[i].length; j++) {
                this.table[i][j].controls.hidden = true
            }
        }
    }
    deselectPointInput() {
        this.PointInput.hidden = true
        this.PointInput.pointInput.input.value = ''
        this.PointInput.maxInput.input.value = ''
    }
    deselectAll() {
        this.deselectControls()
        this.deselectPointInput()
        this.caluclateText.hidden = true
    }
}