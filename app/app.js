const DATABASE = 'tournamentapp-60f17-default-rtdb.europe-west1'
const roundOfSixteen = document.querySelectorAll('[data-match="roundOfSixteen"]')
const roundOfEight = document.querySelectorAll('[data-match="roundOfEight"]')
const semiFinal = document.querySelectorAll('[data-match="semiFinal"]')
const final = document.querySelectorAll('[data-match="final"]')
const allTeams = document.querySelectorAll('.team__name')
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
    static #round = [roundOfEight, semiFinal, final]

    static async #getData() {
        const response = await fetch(`https://${DATABASE}.firebasedatabase.app/data.json`)
        const data = await response.json()
        return Object.values(data).map(teams => teams.team_name)
    }

    static #generator(matches, teamOne, teamTwo) {
        matches.push(
            new Match(
                new Team(teamOne, Math.floor(Math.random() * 5)),
                new Team(teamTwo, Math.floor(Math.random() * 5))
            )
        )
    }

    static async #randomMatchMaker() {
        const teams = await this.#getData()
        let filteredTeams = [...teams]
        let sideL = Array.from(roundOfSixteen).filter((elem, index) => index % 2 === 0)
        let sideR = Array.from(roundOfSixteen).filter((elem, index) => index % 2 !== 0)
        let matches = []

        for (let i = 0; i < teams.length / 2; i++) {

            let teamOne = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
            filteredTeams = filteredTeams.filter(teamName => teamName !== teamOne)

            let teamTwo = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
            filteredTeams = filteredTeams.filter(teamName => teamName !== teamTwo)

            this.#generator(matches, teamOne, teamTwo)
        }

        for (let i = 0; i < teams.length / 2; i++) {
            sideL[i].textContent = matches[i].teamOne.name + matches[i].teamOne.score
            sideR[i].textContent = matches[i].teamTwo.name + matches[i].teamTwo.score
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

        round.forEach((elem, i) => elem.textContent = teamName[i] + teamScore[i]);
    }

    static async start() {
        this.#matches = await this.#randomMatchMaker()
        this.#winners =  this.#winner()
        this.#matches = this.#matchMaker()
        this.#scores = this.#score()
        this.#render(this.#round[0])

        this.#winners =  this.#winner()
        this.#matches = this.#matchMaker()
        this.#scores = this.#score()

        this.#render(this.#round[1])
        this.#winners = this.#winner()
        this.#matches = this.#matchMaker()
        this.#scores = this.#score()
        this.#render(this.#round[2])

    }
    
    static reset() {
        allTeams.forEach(elem => elem.textContent = ' ')
    }
}

start.addEventListener('click', Tournament.start.bind(Tournament))
reset.addEventListener('click', Tournament.reset)