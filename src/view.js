import * as Rxjs from 'rxjs'
import Table from './table'
import Widgets from './widgets'
import {
    UsersService
} from './users.service'
export class View {
    constructor() {
        this.service = new UsersService
        this.sideList = {}
        this.selectedSubject = {}
        this.table = {}
        this.mainDiv = document.getElementById('main')
        this.mainDiv.registerPage = this.renderRegister(this.mainDiv)
        this.mainDiv.loginPage = this.renderLogin(this.mainDiv)
        this.mainDiv.mainPage = this.renderMain(this.mainDiv)

        this.displayPage('loginPageDiv')

        document.body.appendChild(this.mainDiv)
    }
    renderRegister(parent) {
        const regDiv = Widgets.div(parent, 'regPageDiv')

        const userInput = Widgets.inputDiv(regDiv, 'text', 'Username')

        const passInput = Widgets.inputDiv(regDiv, 'password', 'Password')

        const submitButton = Widgets.button(regDiv, 'Register')
        Rxjs.Observable.fromEvent(submitButton, 'click')
            .subscribe(() => {
                const credentials = {
                    id: userInput.input.value,
                    password: passInput.input.value
                }
                this.service.addUser(credentials)
                    .then(() => this.displayPage('loginPageDiv'))
                    .then(() => {
                        userInput.input.value = ''
                        passInput.input.value = ''
                    })
                    .catch(rej => {})
            })

        const backButton = Widgets.button(regDiv, 'Back')
        backButton.onclick = () => {
            userInput.input.value = ''
            passInput.input.value = ''
            this.displayPage('loginPageDiv')
        }
        return regDiv
    }
    renderLogin(parent) {
        const loginDiv = Widgets.div(parent, 'loginPageDiv')

        const userInput = Widgets.inputDiv(loginDiv, 'text', 'Username')

        const passInput = Widgets.inputDiv(loginDiv, 'password', 'Password')

        const submitButton = Widgets.button(loginDiv, 'Login')
        Rxjs.Observable.fromEvent(submitButton, 'click')
            .subscribe(() => {
                const credentials = {
                    id: userInput.input.value,
                    password: passInput.input.value
                }
                this.service.checkUser(credentials)
                    .then(res => this.service.setData(res))
                    .then(res => this.updateAside(this.sideList, this.service.data.subjects))
                    .then(() => this.displayPage('mainPageDiv'))
                    .then(() => {
                        userInput.input.value = ''
                        passInput.input.value = ''
                    })
                    .catch(rej => {})
            })

        const registerButton = Widgets.button(loginDiv, 'Register')
        registerButton.onclick = () => this.displayPage('regPageDiv')
        return loginDiv
    }
    renderMain(parent) {
        const mainPageDiv = Widgets.div(parent, 'mainPageDiv')
        mainPageDiv.style.height = '100%'
        const header = this.header(mainPageDiv)
        this.contentHolder = this.contentHolder(mainPageDiv)
        return mainPageDiv
    }
    displayPage(page) { // <------
        document.querySelectorAll("[class$='PageDiv']").forEach(div => {
            if (div.className == page) {
                div.hidden = false
            } else {
                div.hidden = true
            }
        })
    }
    //components
    contentHolder(parent) {
        const contentHolder = Widgets.div(parent, 'contentHolder')
        const aside = this.aside(contentHolder)
        this.updateAside(aside, this.service.data.subjects)
        this.sideList = aside
        this.table = new Table(contentHolder)
        this.table.main.hidden = true
        const button = Widgets.button(contentHolder, 'Save table')
        button.onclick = () => {
            this.service.data.subjects.map(subject => {
                if (subject.text == this.selectedSubject.id) {
                    subject.scale = this.table.getData()
                }
            })
            this.service.updateUser()
        }
        return contentHolder
    }
    header(parent) {
        const header = document.createElement('header')
        const logoutButton = Widgets.button(header, 'Logout')
        logoutButton.onclick = () => {
            this.deleteAside(this.sideList, this.service.data.subjects)
            this.table.main.hidden = true
            this.displayPage('loginPageDiv')
        }
        parent.appendChild(header)
        return header
    }
    aside(parent) {
        const aside = document.createElement('aside')
        const subjectInput = this.subjectInput(aside)
        subjectInput.hidden = true
        const subjectAddButton = this.subjectAddButton(aside)
        subjectAddButton.onclick = () => {
            subjectInput.hidden = false
        }
        parent.appendChild(aside)
        return aside
    }
    subjectDiv(parent, data) {
        const subjectDiv = Widgets.div(parent, 'subjectDiv')
        subjectDiv.style.backgroundColor = data.color
        subjectDiv.id = data.text
        const text = document.createElement('span')
        text.className = 'text'
        text.style.color = 'white'
        text.innerHTML = data.text
        subjectDiv.appendChild(text)

        const deleteBox = this.deleteBox(subjectDiv)
        deleteBox.onclick = (e) => {
            const newSubjects = this.service.data.subjects
                .filter(subject => {
                    return subject.text != subjectDiv.id
                })
            this.service.data.subjects = newSubjects
            this.deleteAsideOne(parent, subjectDiv.id)
            this.service.updateUser()
            this.table.main.hidden = true
            e.cancelBubble = true
        }
        subjectDiv.onclick = () => {
            this.table.main.hidden = false
            this.table.deselectAll()
            this.selectedSubject = subjectDiv
            this.selectSubject(subjectDiv)
            let subjectFromService = this.service.data.subjects
                .filter(subject => subject.text == this.selectedSubject.id)
            this.table.updateData(subjectFromService[0].scale)
        }
        return subjectDiv

    }
    deleteBox(parent) {
        const deleteBox = Widgets.div(parent, 'deleteBox')
        deleteBox.innerHTML = 'x'
        return deleteBox
    }
    updateAside(aside, data) {
        if (data) {
            data.forEach(subject => {
                const subjectDiv = this.subjectDiv(aside, subject)
            })
        }
    }
    updateAsideOne(aside, data) {
        if (data) {
            const subjectDiv = this.subjectDiv(aside, data)
        }
    }
    deleteAside(aside, data) {
        if (data) {
            data.forEach(subject => {
                this.deleteAsideOne(aside, subject.text)
            })
        }
    }
    deleteAsideOne(aside, data) {
        if (data) {
            document.getElementById(data).remove()
        }
    }
    subjectAddButton(parent) {
        const subjectAddButton = Widgets.div(parent, 'subjectAddButton')
        const text = document.createElement('span')
        text.className = 'text'
        text.style.color = 'white'
        text.innerHTML = '+'
        subjectAddButton.appendChild(text)
        return subjectAddButton
    }
    subjectInput(parent) {
        const subjectInput = Widgets.div(parent, 'subjectInput')
        const nameInput = Widgets.inputDiv(subjectInput, 'text', 'Subject name')

        const colorPicker = Widgets.input(subjectInput, 'color')

        const submitButton = Widgets.button(subjectInput, 'Submit subject')
        submitButton.onclick = () => {
            if (nameInput.input.value != '' && !this.checkDuplicate(nameInput.input.value)) {
                const newInput = {
                    text: nameInput.input.value,
                    color: colorPicker.value,
                    scale: this.table.getEmptyScale()
                }
                this.service.data.subjects.push(newInput)
                nameInput.input.value = ''
                colorPicker.value = '#000000'
                subjectInput.hidden = true
                this.service.updateUser()
                    .then(this.updateAsideOne(parent, newInput))
            } else {
                alert('Pogresan unos')
            }
        }
        const cancelButton = Widgets.button(subjectInput, 'Cancel')
        cancelButton.onclick = () => subjectInput.hidden = true
        return subjectInput
    }
    checkDuplicate(text) {
        let duplicates = this.service.data.subjects.filter(subject => subject.text == text)
        if (duplicates.length == 0) {
            return false
        } else {
            return true
        }
    }
    selectSubject(subject) {
        document.querySelectorAll('.subjectDiv').forEach(subjectDiv => {
            if (subjectDiv.id == subject.id) {
                subjectDiv.style.border = '2px solid black'
            } else {
                subjectDiv.style.border = 'none'
            }
        })
    }
}