let runRound = (ballots, eliminated) => {
  return Object.values(Object.values(ballots).reduce((results, ballot, index) => {
    let highest = {
      rank: 999
    }

    Object.values(ballot).forEach((vote) => {
      // console.log(`User: ${index}, Rank: ${vote.rank}, Location: ${vote.name}`);
      if (eliminated.indexOf(vote.name) === -1 && vote.rank < highest.rank) {
        highest = vote;
      }
    });
    // console.log(`++`);

    if (results.hasOwnProperty(highest.name)) {
      results[highest.name].votes++
    } else {
      results[highest.name] = {
        name: highest.name,
        votes: 1
      }
    }

    return results;
  }, {})).sort((a, b) => {
    return b.votes - a.votes;
  });

}

const IRV = (ballots) => {
  let ballotCount = Object.keys(ballots).length;
  let round = 1;
  let eliminated = [];
  let results = runRound(ballots, eliminated);
  let rounds = [];

  while(
    round < 10 &&
    !(results[0].votes > (ballotCount / 2))
  ) {
    // console.log(results[0].votes > (ballotCount / 2));
    let lastplace = results.filter((result) => {
      return result.votes === results.slice(-1)[0].votes;
    });
    let looser = 1;
    if (lastplace.length > 1) {
      let question = lastplace.reduce((question, place, index) => {
        return question += `${index + 1}) ${place.name} \n`;
      }, "There was an unbreakable tie, which one should be eliminated? \n");
      looser = window.prompt(question);
    }
    eliminated.push(lastplace[looser - 1].name);
    rounds.push(results.slice());
    results = runRound(ballots, eliminated);
    round++;
  }

  // console.log(rounds);

  rounds.forEach((round, index) => {
    // console.log(`Round: ${index + 1}`);
    round.forEach((location) => {
      // console.log(`Location: ${location.name}, Votes: ${location.votes}`);
    });
  })

  results = results.concat(eliminated.reverse()).map((result, index) => {
    return {
      name: result.name || result,
      rank: index + 1
    }
  });

  // console.log(results)

  return results;
}

export default IRV;
