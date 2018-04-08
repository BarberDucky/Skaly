import * as Rxjs from 'rxjs'
import {UsersService} from './users.service'
export class View {
    constructor () {
        this.service = new UsersService
        
        this.mainDiv = document.getElementById('main')
        
        this.mainDiv.appendChild(this.renderLogin())
        this.mainDiv.appendChild(this.renderRegister())
        this.mainDiv.appendChild(this.renderMain())

        this.displayPage('mainPageDiv')

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
                        username: userInput.value,
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
                        username: userInput.value,
                        password: passInput.value
                    }
                    this.service.checkUser(credentials)
                        .then(res => this.service.setData(res))
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
            console.log(header, aside)
        return mainPageDiv
    }
    displayPage (page) {
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
        logoutButton.onclick = () => this.displayPage('loginPageDiv')
        parent.appendChild(logoutButton)
        return logoutButton 
    }
    header (parent) {
        const header = document.createElement('header')
        header.style.backgroundColor = 'blue'
            const logoutButton = this.logoutButton(header)
        parent.appendChild(header)
        return header
    }
    aside (parent) {
        const aside = document.createElement('aside')
        aside.style.backgroundColor = 'red'
        aside.style.width = '100px'
        aside.style.height = '100%'
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
}