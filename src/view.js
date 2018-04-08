import * as Rxjs from 'rxjs'
import {UsersService} from './users.service'
export class View {
    constructor () {
        this.service = new UsersService
        this.sideList = {}
        this.mainDiv = document.getElementById('main')
        
        this.mainDiv.appendChild(this.renderLogin())
        this.mainDiv.appendChild(this.renderRegister())
        this.mainDiv.appendChild(this.renderMain())

        this.displayPage('loginPageDiv')

        document.body.appendChild(this.mainDiv)
    }
    renderRegister () {
        const regDiv = document.createElement('div')
        regDiv.className = 'regPageDiv'

            const userInput = this.userInput(regDiv)

            const passInput = this.passInput(regDiv)

            const submitButton = this.submitButton(regDiv, 'Register')
            Rxjs.Observable.fromEvent(submitButton, 'click')
                .subscribe(() => {
                    const credentials = {
                        id: userInput.value,
                        password: passInput.value
                    }
                    this.service.addUser(credentials)
                        .then(() => this.displayPage('loginPageDiv'))
                        .then(() => {
                            userInput.value = ''
                            passInput.value = ''
                        })
                        .catch(rej => {})
                })

            const backButton = this.backButton(regDiv)
            backButton.onclick = () => {
                userInput.value = ''
                passInput.value = ''
                this.displayPage('loginPageDiv')
            }
        return regDiv
    }
    renderLogin () {
        const loginDiv = document.createElement('div')
        loginDiv.className = 'loginPageDiv'
            const userInput = this.userInput(loginDiv)

            const passInput = this.passInput(loginDiv)

            const submitButton = this.submitButton(loginDiv, 'Login')
            Rxjs.Observable.fromEvent(submitButton, 'click')
                .subscribe(() => {
                    const credentials = {
                        id: userInput.value,
                        password: passInput.value
                    }
                    this.service.checkUser(credentials)
                        .then(res => this.service.setData(res))
                        .then(res => this.updateAside(this.sideList, this.service.data.subjects))
                        .then(() => this.displayPage('mainPageDiv'))
                        .then(() => {
                            userInput.value = ''
                            passInput.value = ''
                        })
                        .catch(rej => {})
                })

            const registerLink = this.registerLink(loginDiv)
            registerLink.onclick = () => this.displayPage('regPageDiv')
        return loginDiv
    }
    renderMain () {
        const mainPageDiv = document.createElement('div')
        mainPageDiv.className = 'mainPageDiv'
        mainPageDiv.style.height = '100%'
            const header = this.header(mainPageDiv)
            const aside = this.aside(mainPageDiv)
            this.updateAside(aside, this.service.data.subjects)
            this.sideList = aside
        this.mainDiv.appendChild(mainPageDiv)
        return mainPageDiv
    }
    displayPage (page) {  // <------
        document.querySelectorAll("[class$='PageDiv']").forEach(div => {
            if (div.className == page) {
                div.hidden = false
            } else {
                div.hidden = true
            }
        })
    }
    //components
    logoutButton (parent) {
        const logoutButton = document.createElement('button')
        logoutButton.className = 'logoutButton'
        logoutButton.innerHTML = 'Logout'
        parent.appendChild(logoutButton)
        return logoutButton 
    }
    header (parent) {
        const header = document.createElement('header')
            const logoutButton = this.logoutButton(header)
            logoutButton.onclick = () => {
                this.deleteAside(this.sideList, this.service.data.subjects)
                this.displayPage('loginPageDiv')
            }
        parent.appendChild(header)
        return header
    }
    aside (parent) {
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
    userInput (parent) {
        const userInput = document.createElement('input')
        userInput.className = 'userInput'
        parent.appendChild(userInput)
        return userInput
    }
    passInput (parent) {
        const passInput = document.createElement('input')
        passInput.className = 'passInput'
        passInput.type = 'password'
        parent.appendChild(passInput)
        return passInput
    }
    backButton (parent) {
        const backButton = document.createElement('button')
        backButton.className = 'backButton'
        backButton.innerHTML = 'Back'
        parent.appendChild(backButton) 
        return backButton        
    }
    submitButton (parent, text) {
        const submitButton = document.createElement('button')
        submitButton.className = 'submitButton'
        submitButton.innerHTML = text
        parent.appendChild(submitButton)
        return submitButton
    }
    registerLink (parent) {
        const registerLink = document.createElement('a')
        registerLink.className = 'registerLink'
        registerLink.innerHTML = 'Register'
        parent.appendChild(registerLink)
        return registerLink
    }
    subjectDiv (parent, data) {
        const subjectDiv = document.createElement('div')
        subjectDiv.className = 'subjectDiv'
        subjectDiv.style.backgroundColor = data.color
        subjectDiv.id = data.text
            const text = document.createElement('span')
            text.className = 'text'
            text.style.color = 'white'
            text.innerHTML = data.text
            subjectDiv.appendChild(text)

            const deleteBox = this.deleteBox(subjectDiv)
            deleteBox.onclick = () => {
                const newSubjects = this.service.data.subjects
                    .filter(subject => {
                            return subject.text != subjectDiv.id
                    })
                console.log(newSubjects)
                this.service.data.subjects = newSubjects
                this.deleteAsideOne(parent, subjectDiv.id)
                this.service.updateUser()
            }
        parent.appendChild(subjectDiv)
        return subjectDiv

    }
    deleteBox (parent) {
        const deleteBox = document.createElement('div')
        deleteBox.className = 'deleteBox'
        deleteBox.innerHTML = 'x'
        parent.appendChild(deleteBox)
        return deleteBox
    }
    updateAside (aside, data) {
        if (data) {
            data.forEach(subject => {
                const subjectDiv = this.subjectDiv(aside, subject)
            })
        }
    }
    updateAsideOne (aside, data) {
        if (data) {
            const subjectDiv = this.subjectDiv(aside, data)
        }
    }
    deleteAside (aside, data) {
        if (data) {
            data.forEach(subject => {
                this.deleteAsideOne(aside, subject.text)
            })
        }
    }
    deleteAsideOne (aside, data) {
        if (data) {
            document.getElementById(data).remove()
        }
    }
    subjectAddButton (parent) {
        const subjectAddButton = document.createElement('div')
        subjectAddButton.className = 'subjectAddButton'
            const text = document.createElement('span')
            text.className = 'text'
            text.style.color = 'white'
            text.innerHTML = '+'
            subjectAddButton.appendChild(text)
        parent.appendChild(subjectAddButton)
        return subjectAddButton
    }
    subjectInput (parent) {
        const subjectInput = document.createElement('div')
        subjectInput.className = 'subjectInput'
            const nameInput = document.createElement('input')
            nameInput.className = 'nameInput'
            subjectInput.appendChild(nameInput)

            const colorPicker = this.colorPicker(subjectInput)

            const submitButton = this.submitButton(subjectInput, 'Submit subject')
            submitButton.onclick = () => {
                const newInput = {text: nameInput.value, color: colorPicker.value}
                this.service.data.subjects.push(newInput)
                nameInput.value = ''
                colorPicker.value = '#000000'
                subjectInput.hidden = true
                this.service.updateUser()
                    .then(this.updateAsideOne(parent, newInput))
            }
            const backButton = this.backButton(subjectInput)
            backButton.onclick = () => subjectInput.hidden = true
        parent.appendChild(subjectInput)
        return subjectInput
    }
    colorPicker (parent) {
        const colorPicker = document.createElement('input')
        colorPicker.className = 'colorPicker'
        colorPicker.setAttribute('type', 'color')
        parent.appendChild(colorPicker)
        return colorPicker
    }
}