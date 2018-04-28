import * as Rxjs from 'rxjs'
import Table from './table'
import Widgets from './widgets'
import FormatService from './format.service'
import UsersService from './users.service'
export class View {
    constructor() {
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

        const appTitle = Widgets.textElement(regDiv, "h1", "Skaly.")

        const pageTitle = Widgets.textElement(regDiv, "h2", "Register")

        const userInput = Widgets.inputDiv(regDiv, 'text', 'Username')

        const passInput = Widgets.inputDiv(regDiv, 'password', 'Password')

        const superCheck = Widgets.inputDiv(regDiv, 'checkbox', "Super user", true)

        const promiseObs = (text) => Rxjs.Observable.fromPromise(UsersService.checkUserExists(text)
            .then(res => true)
            .catch(rej => false)
        )

        Rxjs.Observable.fromEvent(userInput.input, 'input')
            .debounceTime(500)
            .map(event => event.target.value)
            .switchMap(value => promiseObs(value))
            .subscribe(res => Widgets.checkInput(userInput.input, res))


        const submitButton = Widgets.button(regDiv, 'REGISTER')
        submitButton.onclick = () => {
            const credentials = {
                id: userInput.input.value,
                password: passInput.input.value,
                superUser: superCheck.input.checked
            }
            UsersService.addUser(credentials)
                .then(() => {
                    this.displayPage('loginPageDiv')
                    userInput.input.value = ''
                    passInput.input.value = ''
                    superCheck.input.checked = false
                })
                .catch(rej => {})
        }
        const backButton = Widgets.button(regDiv, 'BACK')
        backButton.onclick = () => {
            userInput.input.value = ''
            passInput.input.value = ''
            Widgets.checkInput(userInput.input, true)
            this.displayPage('loginPageDiv')
        }
        return regDiv
    }
    renderLogin(parent) {
        const loginDiv = Widgets.div(parent, 'loginPageDiv')

        const appTitle = Widgets.textElement(loginDiv, "h1", "Skaly.")

        const pageTitle = Widgets.textElement(loginDiv, "h2", "Login")

        const userInput = Widgets.inputDiv(loginDiv, 'text', 'Username')

        const passInput = Widgets.inputDiv(loginDiv, 'password', 'Password')

        const submitButton = Widgets.button(loginDiv, 'LOGIN')
        submitButton.onclick = () => {
            const credentials = {
                id: userInput.input.value,
                password: passInput.input.value
            }
            UsersService.checkUser(credentials)
                .then(res => {
                    UsersService.setData(res)
                    this.updateAside(this.sideList, UsersService.getSubjects())
                    this.displayPage('mainPageDiv')
                    let userString
                    if (UsersService.getSuperUser()) {
                        userString = 'Moderator'
                    } else {
                        userString = 'Standard'
                    }
                    document.getElementById('userType').innerHTML = userString
                    userInput.input.value = ''
                    passInput.input.value = ''
                })
                .catch(rej => {})
        }
        const registerButton = Widgets.button(loginDiv, 'REGISTER')
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
        this.updateAside(aside, UsersService.getSubjects())
        this.sideList = aside
        this.table = new Table(contentHolder)
        this.table.main.hidden = true
        return contentHolder
    }
    saveCurrentSubject() {
        if (this.selectedSubject) {
            const selected = UsersService.getSubjects()
                .find(subject => subject.text == this.selectedSubject.id)
            if (selected) {
                selected.scale = this.table.getData()
                UsersService.updateUser()
                if (UsersService.getSuperUser()) {
                    FormatService.putFormat(selected, UsersService.getData().id)
                }
            }
        }
    }
    header(parent) {
        const header = document.createElement('header')
        const appTitle = Widgets.textElement(header, 'h1', 'Skaly.')
        const userType = Widgets.textElement(header, 'h2', '')
        userType.id = 'userType'
        const logoutButton = Widgets.button(header, 'Logout')
        logoutButton.onclick = () => {
            this.deleteAside(this.sideList, UsersService.getSubjects())
            this.table.main.hidden = true
            this.saveCurrentSubject()
            this.selectedSubject = null
            this.displayPage('loginPageDiv')
        }
        parent.appendChild(header)
        return header
    }
    aside(parent) {
        const aside = document.createElement('div')
        aside.className = "aside"
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
        subjectDiv.id = data.text
        const text = document.createElement('span')
        text.className = 'text'
        text.style.color = 'white'
        text.innerHTML = data.text
        subjectDiv.appendChild(text)

        const deleteBox = Widgets.imageDiv(subjectDiv, 'deleteBox', './src/img/delete.png')
        deleteBox.onclick = (ev) => {
            const oldSubject = UsersService.getSubjects()
                .find(subject => subject.text == subjectDiv.id)
            const newSubjects = UsersService.getSubjects()
                .filter(subject => {
                    return subject.text != subjectDiv.id
                })
            UsersService.setSubjects(newSubjects)
            this.deleteAsideOne(parent, subjectDiv.id)
            UsersService.updateUser()
            if (UsersService.getSuperUser()) {
                FormatService.deleteFormat(oldSubject)
            }
            this.table.main.hidden = true
            ev.cancelBubble = true
        }
        subjectDiv.onclick = () => {
            this.saveCurrentSubject()
            let subjectFromService = UsersService.getSubjects()
                .find(subject => subject.text == subjectDiv.id)
            FormatService.getFormat(subjectFromService)
                .then(res => {
                    this.table.updateData({
                        format: res.format,
                        points: subjectFromService.scale.points,
                        rows: subjectFromService.scale.rows,
                        cols: subjectFromService.scale.cols
                    }, UsersService.getSuperUser())
                    this.table.main.hidden = false
                    this.table.deselectAll()
                    this.selectedSubject = subjectDiv
                    this.selectSubject(subjectDiv)

                })
                .catch(rej => {
                    alert('Subject no longer exists')
                    const newSubjects = UsersService.getSubjects()
                        .filter(subject => {
                            return subject.text != subjectDiv.id
                        })
                    UsersService.setSubjects(newSubjects)
                    this.deleteAsideOne(parent, subjectDiv.id)
                    UsersService.updateUser()
                })


        }
        return subjectDiv

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
        const nameInput = Widgets.inputList(subjectInput, 'Subject name')
        const submitButton = Widgets.button(subjectInput, 'Submit subject')

        const formatObservable = (text) => Rxjs.Observable.fromPromise(FormatService.getFormatRegExp(text)
            .then(res => res)
            .catch(rej => null)
        )
        let subscription = Rxjs.Observable.fromEvent(nameInput.input, 'input')
            .filter(event => !UsersService.getSuperUser())
            .debounceTime(500)
            .switchMap(event => formatObservable(event.target.value))
            .filter(res => res != null)
            .do(array => nameInput.addOptions(array))
            .subscribe()

        submitButton.onclick = () => {
            if (nameInput.input.value != '' && !this.checkDuplicate(nameInput.input.value)) {
                const newInput = {
                    text: nameInput.input.value,
                    scale: this.table.getEmptyScale()
                }
                if (UsersService.getSuperUser()) {
                    FormatService.postFormat(newInput, UsersService.getData().id)
                        .then(() => {
                            UsersService.getSubjects().push(newInput)
                            nameInput.input.value = ''
                            subjectInput.hidden = true
                            UsersService.updateUser()
                                .then(this.updateAsideOne(parent, newInput))
                        })
                        .catch(rej => {})
                } else {
                    FormatService.getFormat(newInput)
                        .then(res => {
                            newInput.text = res.id
                            newInput.scale.format = res.format
                            UsersService.getSubjects().push(newInput)
                            nameInput.input.value = ''
                            subjectInput.hidden = true
                            UsersService.updateUser()
                                .then(this.updateAsideOne(parent, newInput))
                        })
                        .catch(rej => alert("Subject doesn't exist"))
                }
            } else {
                alert('Pogresan unos')
            }
        }
        const cancelButton = Widgets.button(subjectInput, 'Cancel')
        cancelButton.onclick = () => {
            nameInput.input.value = ''
            subjectInput.hidden = true
        }
        return subjectInput
    }
    checkDuplicate(text) {
        let duplicates = UsersService.getSubjects().filter(subject => subject.text == text)
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