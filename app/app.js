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
}

async function getData() {
    const response = await fetch(`https://${DATABASE}.firebasedatabase.app/data.json`)
    const data = await response.json()
    return Object.values(data).map(teams => teams.team_name)
}

async function aaa() {
    const teams = await getData()
    let filteredTeams = [...teams]
    let left = Array.from(roundOfSixteen).filter((elem, index) => index % 2 === 0 )
    let rigth = Array.from(roundOfSixteen).filter((elem, index) => index % 2 !== 0 )
    let matches = []
console.log(left);
console.log(rigth);
    for (let i = 0; i < teams.length/2; i++) {
        let teamOne = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
        left[i].textContent = teamOne
        filteredTeams = filteredTeams.filter(teamName => teamName !== teamOne)
        let teamTwo = filteredTeams[Math.floor(Math.random() * filteredTeams.length)]
        rigth[i].textContent = teamTwo
        filteredTeams = filteredTeams.filter(teamName => teamName !== teamTwo)
        
        matches.push(
            new Match(
                new Team(teamOne, Math.floor(Math.random() * 5)),
                new Team(teamTwo, Math.floor(Math.random() * 5))
            )
        )
    }
    
    console.log(matches[1].teamOne.name);
}

aaa()