export class View {
    constructor () {
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
            const userInput = document.createElement('input')
            userInput.className = 'userInput'
            regDiv.appendChild(userInput)

            const passInput = document.createElement('input')
            passInput.className = 'passInput'
            regDiv.appendChild(passInput)

            const submitButton = document.createElement('button')
            submitButton.className = 'submitButton'
            submitButton.innerHTML = 'Register'
            submitButton.onclick = () => this.displayPage('loginPageDiv')
            regDiv.appendChild(submitButton)
        return regDiv
    }
    renderLogin () {
        const loginDiv = document.createElement('div')
        loginDiv.className = 'loginPageDiv'
            const userInput = document.createElement('input')
            userInput.className = 'userInput'
            loginDiv.appendChild(userInput)

            const passInput = document.createElement('input')
            passInput.className = 'passInput'
            loginDiv.appendChild(passInput)

            const submitButton = document.createElement('button')
            submitButton.className = 'submitButton'
            submitButton.innerHTML = 'Login'
            submitButton.onclick = () => this.displayPage('mainPageDiv')
            loginDiv.appendChild(submitButton)

            const registerLink = document.createElement('a')
            registerLink.className = 'registerLink'
            registerLink.innerHTML = 'Register'
            registerLink.onclick = () => this.displayPage('regPageDiv')
            loginDiv.appendChild(registerLink)
        return loginDiv
    }
    renderMain () {
        const mainPageDiv = document.createElement('div')
        mainPageDiv.className = 'mainPageDiv'
            const logoutButton = document.createElement('button')
            logoutButton.className = 'logoutButton'
            logoutButton.innerHTML = 'Logout'
            logoutButton.onclick = () => this.displayPage('loginPageDiv')
            mainPageDiv.appendChild(logoutButton)
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

}