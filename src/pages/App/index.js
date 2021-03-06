import React, { Component } from 'react';
import './style.css';

import firebase from 'firebase';
import SortableList from '../../components/SortableList';
import UnSortedList from '../../components/UnSortedList';

class App extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let key = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;

    this.state = {
      user: null,
      dayRef: firebase.database().ref("days").child(key),
      nominations: [],
      pollsOpen: false,
      pollsClosed: false,
      myVotes: [],
      rawBallot: {},
      listner: () => {},
      winner: null,
      showResults: false
    }

    firebase.auth().onAuthStateChanged((user) => {
      window.user = user;
      if (user) {
        this.state.listner();
        this.setState({
          user: user,
          listener: this.listen()
        });
      } else {
        firebase.auth().signInAnonymously().catch(function(error) {
          console.error(error);
        });
      }
    });
  }

  listen() {
    return this.state.dayRef.on('value', (snapshot) => {
      let today = snapshot.val();
      if (!today) {
        return;
      }
      let nominations = !today.nominations ? [] : Object.values(today.nominations)
      let pollsOpen = today.pollsOpen;
      let pollsClosed = today.pollsClosed;
      if (pollsOpen && !pollsClosed && (!today.ballots || !today.ballots[this.state.user.uid])) {
        nominations.forEach((location, index) => {
          this.state.dayRef.child("ballots").child(this.state.user.uid).push({
            name: location,
            rank: index + 1
          });
        });
        return;
      }

      let myVotes = this.state.myVotes;
      let rawBallot = this.state.rawBallot;

      if (pollsOpen  && !pollsClosed && today.ballots && today.ballots[this.state.user.uid]) {
        myVotes = Object.values(today.ballots[this.state.user.uid]);
        rawBallot = today.ballots[this.state.user.uid];
      }

      let winner = today.winner;
      let showResults = today.showResults;

      this.setState({
        nominations: nominations,
        pollsOpen: pollsOpen,
        pollsClosed: pollsClosed,
        myVotes: myVotes,
        rawBallot: rawBallot,
        winner: winner,
        showResults: showResults
      })
    });
  }

  logout() {
    firebase.auth().signOut()
  }

  rankItems(items) {
    let rawBallot = this.state.rawBallot;
    Object.keys(rawBallot).forEach((location) => {
      rawBallot[location].rank = items.indexOf(rawBallot[location].name) + 1;
    })
    this.state.dayRef.child("ballots").child(this.state.user.uid).set(rawBallot);
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1 className="text-center">Team Food</h1>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              {/* Before Polls Open */}
              {
                !this.state.pollsOpen &&
                <div>
                  <p className="text-center">Please wait for voting to start.</p>
                  { this.state.nominations.length > 0 &&
                    <p>Current Nominations:</p>
                  }
                  <UnSortedList data={this.state.nominations} />
                </div>
              }

              {/* While Polls are open */}
              {
               this.state.pollsOpen && !this.state.pollsClosed &&
               <div>
                  <p className="text-center">Drag to rank your choices.</p>
                  <SortableList
                    items={this.state.myVotes}
                    onChange={(items) => this.rankItems(items)}
                  >
                  </SortableList>
               </div>
             }

             {/* While counting ballots */}
             {
                this.state.pollsOpen && this.state.pollsClosed && (!this.state.winner || (this.state.winner && !this.state.showResults)) &&
                <div>
                  <h4 className="text-center">Tabulating Results</h4>
                  <p className="text-center">The cats are working as fast as they can...</p>
                  <img src="https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif" className="img-responsive tabulating-cat" alt="Tabulating Cat" align="middle" />
                </div>
             }

             {/* Winner */}
             {
                this.state.pollsOpen && this.state.pollsClosed && this.state.winner && this.state.showResults &&
                <div>
                  <p className="text-center">The Winner is...</p>
                  <h4 className="text-center">{this.state.winner}</h4>
                  <img src="https://media.giphy.com/media/peAFQfg7Ol6IE/giphy.gif" className="img-responsive tabulating-cat" alt="Tabulating Cat" align="middle" />
                  <p className="text-center">Thanks for playing!!</p>
                </div>
             }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
