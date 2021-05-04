const DATABASE = 'tournamentapp-60f17-default-rtdb.europe-west1'
const roundOfSixteen = document.querySelectorAll('[data-match="roundOfSixteen"]')
const roundOfEight = document.querySelectorAll('[data-match="roundOfEight"]')
const semiFinal = document.querySelectorAll('[data-match="semiFinal"]')
const final = document.querySelectorAll('[data-match="final"]')

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
        return this.teamOne.score > this.teamTwo.score ? this.teamOne.name : this.teamTwo.name
    }
}

async function getData() {
    const response = await fetch(`https://${DATABASE}.firebasedatabase.app/data.json`)
    const data = await response.json()
    return Object.values(data).map(teams => teams.team_name)
}

async function randomMatchMaker() {
    const teams = await getData()
    let filteredTeams = [...teams]
    let sideL = Array.from(roundOfSixteen).filter((elem, index) => index % 2 === 0)
    let sideR = Array.from(roundOfSixteen).filter((elem, index) => index % 2 !== 0)
    let matches = []

    for (let i = 0; i < teams.length / 2; i++) {

        let teamOne = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
        filteredTeams = filteredTeams.filter(teamName => teamName !== teamOne)
        sideL[i].textContent = teamOne

        let teamTwo = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
        filteredTeams = filteredTeams.filter(teamName => teamName !== teamTwo)
        sideR[i].textContent = teamTwo
        
        matches.push(
            new Match(
                new Team(teamOne, Math.floor(Math.random() * 5)),
                new Team(teamTwo, Math.floor(Math.random() * 5))
            )
        )
    }

    return matches
}

async function matchMaker(matchWinners) {

    let match = []
    let teams = await matchWinners

    for (let i = 0; i < teams.length; i += 2) {
        match.push(
            new Match(
                new Team(teams[i], Math.floor(Math.random() * 5)),
                new Team(teams[i + 1], Math.floor(Math.random() * 5))
            )
        )
    }
    return match
}

async function winners(match) {
    
        const matches = await match
        let winners = []
    
        for (let i = 0; i < matches.length; i++) {
            winners.push(matches[i].winner)
        }

        return winners
}

async function render(round, winners) {

    let winner = await winners

    round.forEach((elem, i) => elem.textContent = winner[i]);
}

// let a = winners(randomMatchMaker())

// render(roundOfEight, a)

// let b = matchMaker(a)

// let q = winners(b)

// render(semiFinal, q)

// let d = matchMaker(q)

// let u = winners(d)

// render(final, u)