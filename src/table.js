import Selector from './selector'
import Widgets from './widgets'

export default class Table {
    constructor (parent) {
        this.main = document.createElement('div')
        this.main.className = 'tableMain'
        this.table = []
        this.rows = []
        this.selectedBox = {}

        this.selector = new Selector(this.main)
        this.tableDiv = this.createTable(this.main)
        this.selectedInput = this.createInput(this.main)
        this.calculateButton = this.createCalculation(this.main)

        parent.appendChild(this.main)
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
    updateData(data) {
        for (let i = 0; i < data.rows; i++) {
            let last = {}
            for (let j = 0; j < data.cols; j++) {
                if (data.format[i][j] != '+') {

                    last = this.table[i][j]
                    this.table[i][j].colSpan = '1'
                    this.table[i][j].hidden = false
                    this.table[i][j].history = []
                    let assignment = this.selector.findAssignment(data.format[i][j])
                    if (assignment) {
                        this.table[i][j].data = assignment
                        this.table[i][j].code = assignment.text[0]
                        if (data.points[i][j] != 'X') {
                            this.table[i][j].points = data.points[i][j]
                            this.table[i][j].lowerText.innerHTML = this.table[i][j].points
                        } else {
                            this.table[i][j].points = 0
                            this.table[i][j].lowerText.innerHTML = ''
                        }
                        this.table[i][j].ondragstart = (ev) => {
                            ev.dataTransfer.setData('application/json', JSON.stringify(this.table[i][j].data))
                        }
                        this.table[i][j].ondragend = (ev) => {
                            this.table[i][j].data = null
                            this.table[i][j].code = `X${this.table[i][j].code.slice(1)}`
                            this.updateBox(this.table[i][j], true)
                            this.table[i][j].draggable = false
                            this.selectedInput.hidden = true
                        }
                    } else {
                        this.table[i][j].data = null
                        this.table[i][j].code = 'X'
                        this.table[i][j].points = 0
                        this.table[i][j].lowerText.innerHTML = ''
                    }
                    let reset = false
                    if (data.format[i][j] == 'X') {
                        reset = true
                    }
                    this.updateBox(this.table[i][j], reset)
                } else {
                    let oldSpan = parseInt(last.colSpan)
                    last.colSpan = `${oldSpan + 1}`
                    this.table[i][j].code = ''
                    this.table[i][j].points = 0 
                    last.code += '+'
                    last.history.push('hide')
                    this.table[i][j].data = null
                    this.updateBox(this.table[i][j], true)
                    this.table[i][j].hidden = true
                    this.table[i][j].history = []
                }
            }
        }     
    }
    createTable(parent) {
        const tableDiv = document.createElement('table')
        for(let i = 0; i < 3; i++){
            this.rows[i] = document.createElement('tr')
            this.rows[i].id = `row${i}`
            tableDiv.appendChild(this.rows[i])
            this.table[i] = []
            for (let j = 0; j < 10; j++) {
                const newCell = document.createElement('td')
                newCell.id = `cell${i}${j}`
                newCell.history = []
                newCell.code = 'X'
                newCell.draggable = false
                this.createText(newCell)
                newCell.controls = this.addControls(newCell, i, j)
                newCell.onclick = () => {   
                    newCell.controls.forEach(control => {
                        control.hidden = !control.hidden
                    })
                }
                newCell.ondblclick = () => {
                    if (newCell.data) {
                        this.selectedBox = newCell
                        this.selectedInput.hidden = false
                    }
                }
                newCell.ondragover = (ev) => {
                    ev.preventDefault()
                }
                newCell.ondrop = (ev) => {
                    ev.preventDefault()
                    const cellData = JSON.parse(ev.dataTransfer.getData('application/json'))
                    newCell.data = cellData
                    this.updateBox(newCell, false)
                    newCell.code = `${cellData.text[0]}${newCell.code.slice(1)}`
                    newCell.draggable = true
                    newCell.ondragstart = (ev) => {
                        ev.dataTransfer.setData('application/json', JSON.stringify(newCell.data))
                    }
                    newCell.ondragend = (ev) => {
                        newCell.data = null
                        newCell.code = `X${newCell.code.slice(1)}`
                        this.updateBox(newCell, true)
                        newCell.draggable = false
                        newCell.points = 0
                        this.selectedInput.hidden = true     
                    }
                }
                this.table[i][j] = newCell
                this.rows[i].appendChild(this.table[i][j])
            }
        }
        parent.appendChild(tableDiv)
        return tableDiv
    }

    generateFormat() {   
        let format = []
        let points = []
        for(let i = 0; i < this.table.length; i++) {
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
        const outBoxLeft = document.createElement('div')
        outBoxLeft.className = 'outBoxLeft'
        outBoxLeft.onclick = () => {
            if(x != this.table[0].length-1) {
                let a = x
                let b = y + 1
                while (b < this.table[a].length && this.table[a][b].hidden == true ) {
                    b++
                }
                let nextElement = this.table[a][b]
                oldSpan = parseInt(this.table[x][y].colSpan)
                if (nextElement) {
                    if (nextElement.colSpan == '1') {
                        nextElement.hidden = true
                        nextElement.code = ''
                        parent.history.push({oper:'hide', target: nextElement})
                    } else {
                        let oldSpanNext = parseInt(nextElement.colSpan)
                        nextElement.colSpan = `${oldSpanNext - 1}`
                        if (nextElement.points) {
                            nextElement.points = (((oldSpanNext-1) * nextElement.points) / oldSpanNext).toFixed(2)
                            nextElement.lowerText.innerHTML = nextElement.points
                        }
                        nextElement.code = nextElement.code.slice(0, -1)
                        parent.history.push({oper:'borrow', target: nextElement})
                    }
                    this.table[x][y].colSpan = `${oldSpan+1}`
                    this.table[x][y].code += '+'
                    if (this.table[x][y].points) {
                        this.table[x][y].points = (((oldSpan+1) * this.table[x][y].points) / oldSpan).toFixed(2)
                        this.table[x][y].lowerText.innerHTML = this.table[x][y].points
                    }
                }
            }
        }
        outBoxLeft.hidden = true
        parent.appendChild(outBoxLeft)

        const inBoxLeft = document.createElement('div')
        inBoxLeft.className = 'inBoxLeft'
        inBoxLeft.onclick = () => {
            if(parent.colSpan != '1') {
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
                    if (lastMove.target.points) {
                        lastMove.target.points = (((oldSpanNext+1) * lastMove.target.points) / oldSpanNext).toFixed(2)
                        lastMove.target.lowerText.innerHTML = lastMove.target.points
                    }
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
                if (this.table[x][y].points) {
                    this.table[x][y].points = (((oldSpan-1) * this.table[x][y].points) / oldSpan).toFixed(2)
                    this.table[x][y].lowerText.innerHTML = this.table[x][y].points
                }
            }
        }
        inBoxLeft.hidden = true
        parent.appendChild(inBoxLeft)

        return [outBoxLeft, inBoxLeft]
    }

    createText(parent) {
        const upperText = document.createElement('div')
        parent.upperText = upperText
        upperText.className = 'upperText'
        parent.appendChild(upperText)
        
        const lowerText = document.createElement('div')
        parent.lowerText = lowerText
        lowerText.className = 'lowerText'
        parent.appendChild(lowerText)
    }

    updateBox(element, reset) {
        if (!reset) { 
            element.style.color = element.data.color
            element.style.borderColor = element.data.color
            element.upperText.innerHTML = element.data.text[0]
            element.draggable = true
        } else {
            element.style.color = 'slateblue'
            element.style.borderColor = 'slateblue'
            element.upperText.innerHTML = ''
            element.lowerText.innerHTML = ''
            element.draggable = false
        }
    }
    createInput(parent) {
        const pointDiv = Widgets.div(parent, 'pointDiv')
            const pointInput = Widgets.input(pointDiv, 'text')
            const maxInput = Widgets.input(pointDiv, 'text')
            const submitButton = Widgets.button(pointDiv, 'Submit')
            const cancelButton = Widgets.button(pointDiv, 'Cancel')
            pointDiv.hidden = true
            submitButton.onclick = () => {
                if (this.selectedBox.data) {
                    let colSpan = parseInt(this.selectedBox.colSpan)
                    let point = parseInt(pointInput.value)
                    let max = parseInt(maxInput.value)
                    if(!isNaN(point) && !isNaN(max) && max >= point){
                        this.selectedBox.points = (((point * 100 / max) / 100) * 10 * colSpan).toFixed(2)
                        this.selectedBox.lowerText.innerHTML = this.selectedBox.points
                        pointDiv.hidden = true
                        pointInput.value = ''
                        maxInput.value = ''
                    } else {
                        alert('invalid input')
                    }
                } else {
                    pointDiv.hidden = true
                    pointInput.value = ''
                    maxInput.value = ''
                }
            }
            cancelButton.onclick = () => {
                pointDiv.hidden = true
            }
        return pointDiv
    }
    createCalculation(parent) {
        const calcDiv = Widgets.div(parent, 'calcDiv')
            const markDiv = Widgets.div(calcDiv, 'markDiv')
            const calcButton = Widgets.button(calcDiv, 'Calculate')
            calcButton.onclick = () => {
                let max = 0
                for(let i = 0; i < this.table.length; i++) {
                    let rowValue = 0
                    for (let j = 0; j < this.table[i].length; j++) {
                        if (this.table[i][j].points && !this.table[i][j].hidden) {
                            rowValue += parseInt(this.table[i][j].points)
                        }
                    }
                    if (rowValue > max) {
                        max = rowValue
                    }
                }
                markDiv.innerHTML = `Osvojeno poena: ${max}`
            }
        return calcDiv
    }
}


