const DATABASE = 'tournamentapp-60f17-default-rtdb.europe-west1'
const roundOfSixteen = document.querySelectorAll('[data-match="roundOfSixteen"]')
const roundOfEight = document.querySelectorAll('[data-match="roundOfEight"]')
const semiFinal = document.querySelectorAll('[data-match="semiFinal"]')
const final = document.querySelectorAll('[data-match="final"]')
const allTeams = document.querySelectorAll('.team__name')
const winner = document.querySelector('#winner')
const start = document.querySelector('#start')
const reset = document.querySelector('#reset')

class Team {
    constructor(name, score) {
        this.name = name
        this.score = score
    }
}

class Match {
    constructor(teamOne, teamTwo) {
        this.teamOne = teamOne
        this.teamTwo = teamTwo
    }

    get winner() {
        return this.teamOne.score > this.teamTwo.score ? this.teamOne : this.teamTwo
    }
}

class Tournament {

    static #matches
    static #winners
    static #scores
    static #index = 0
    static #round = [roundOfEight, semiFinal, final]

    static #generator(matches, teamOne, teamTwo) {

        matches.push(
            new Match(
                new Team(teamOne, Math.floor(Math.random() * 5)),
                new Team(teamTwo, Math.floor(Math.random() * 5))
            )
        )
    }

    static async #getData() {

        const response = await fetch(`https://${DATABASE}.firebasedatabase.app/data.json`)
        const data = await response.json()
        return Object.values(data).map(teams => teams.team_name)
    }

    static async #randomMatchMaker() {

        const teams = await this.#getData()
        let filteredTeams = [...teams]
        let sideL = Array.from(roundOfSixteen).filter((elem, index) => index % 2 === 0)
        let sideR = Array.from(roundOfSixteen).filter((elem, index) => index % 2 !== 0)
        let matches = []
        // creating random matches
        for (let i = 0; i < teams.length / 2; i++) {

            let teamOne = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
            filteredTeams = filteredTeams.filter(teamName => teamName !== teamOne)

            let teamTwo = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
            filteredTeams = filteredTeams.filter(teamName => teamName !== teamTwo)

            this.#generator(matches, teamOne, teamTwo)
        }
        // rendering matches
        for (let i = 0; i < teams.length / 2; i++) {
            sideL[i].innerHTML = matches[i].teamOne.name +
                                `<span class="team__score">${matches[i].teamOne.score}</span>`
            sideR[i].innerHTML = matches[i].teamTwo.name +
                                `<span class="team__score">${matches[i].teamTwo.score}</span>`
        }

        return matches
    }

    static #matchMaker() {

        let teams = this.#winners
        let matches = []

        for (let i = 0; i < teams.length; i += 2) {
            this.#generator(matches, teams[i], teams[i + 1])
        }

        return matches
    }

    static #winner() {

        let matches = this.#matches
        let winners = []

        for (let i = 0; i < matches.length; i++) {
            winners.push(matches[i].winner.name)
        }

        return winners
    }

    static #score() {

        let matches = this.#matches
        let scores = []

        for (let i = 0; i < matches.length; i++) {
            scores.push(matches[i].teamOne.score)
            scores.push(matches[i].teamTwo.score)
        }

        return scores
    }

    static #render(round) {

        let teamName = this.#winners
        let teamScore = this.#scores

        round.forEach((elem, i) => {
            elem.innerHTML = teamName[i] + `<span class="team__score">${teamScore[i]}</span>`
        });

        if (this.#matches.length === 1) {
            winner.textContent = `Winner is ${this.#matches[0].winner.name}`
        }
    }
    
    static async start() {

        if (this.#matches === undefined) {

            this.#matches = await this.#randomMatchMaker()
            this.#winners =  this.#winner()
        } else {
            
            this.#winners =  this.#winner()
            this.#matches = this.#matchMaker()
            this.#scores = this.#score()
            this.#render(this.#round[this.#index])
            this.#index++
        }
    }
    
    static reset() {
        this.#index = 0
        this.#matches = undefined
        allTeams.forEach(elem => elem.textContent = ' ')
        winner.textContent = ''
    }
}

start.addEventListener('click', Tournament.start.bind(Tournament))
reset.addEventListener('click', Tournament.reset.bind(Tournament))