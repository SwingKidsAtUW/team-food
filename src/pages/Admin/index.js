import React, { Component } from 'react';
import './style.css';

import ButtonBar from '../../components/ButtonBar';
import SortedList from '../../components/SortedList';
import UnSortedList from '../../components/UnSortedList';
import NewLocationForm from '../../components/NewLocationForm';

import IRV from './irv';

import firebase from 'firebase';

class Admin extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let key = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;

    this.state = {
      ready: false,
      user: null,
      userChecked: false,
      dayRef: firebase.database().ref("days").child(key),
      nominations: [],
      ballots: {},
      pollsOpen: false,
      pollsClosed: false,
      results: []
    }

    firebase.auth().onAuthStateChanged((user) => {
      window.user = user;
      this.setState({
        user: user,
        userChecked: true
      })
    });

    this.state.dayRef.on('value', (snapshot) => {
      let today = snapshot.val();
      if (!today) {
        return;
      }
      let nominations = Object.values(today.nominations || {});
      let pollsOpen = today.pollsOpen;
      let pollsClosed = today.pollsClosed;
      let ballots = this.state.ballots;
      let results = this.state.results;

      if (pollsOpen && today.ballots) {
        ballots = today.ballots;
      }

      if (pollsOpen && pollsClosed && today.results) {
        results = today.results;
      }

      if (pollsOpen && pollsClosed && today.ballots && (!today.winner || !today.results) && !this.counting) {
        this.countBallots(ballots);
      }

      this.setState({
        ready: true,
        nominations: nominations,
        pollsOpen: pollsOpen,
        pollsClosed: pollsClosed,
        ballots: ballots,
        results: results
      })
    });
  }

  countBallots(ballots) {
    this.counting = true;
    ballots = ballots || this.state.ballots;
    this.state.dayRef.update({
      "results": null,
      "winner": null
    });
    if (!ballots || Object.keys(ballots).length === 0) {
      this.counting = false;
      return;
    }
    let results = IRV(ballots);
    if (results.length < 1) {
      this.counting = false;
      return;
    }
    this.state.dayRef.update({
      "results": results,
      "winner": results[0].name
    });
    this.counting = false;
  }

  login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
  }

  logout() {
    firebase.auth().signOut()
  }

  submit(location) {
    if (location.length === 0) {
      return false;
    }
    this.state.dayRef.child("nominations").push(location)
  }

  openPolls() {
    this.state.dayRef.child("pollsOpen").set(true);
  }

  closePolls() {
    this.state.dayRef.child("pollsClosed").set(true);
  }

  resetBallots() {
    this.state.dayRef.child("ballots").remove();
  }

  reOpenPolls() {
    this.state.dayRef.update({
      "pollsClosed": false,
      "winner": null
    });
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1 className="text-center">Team Food Admin</h1>
            </div>
          </div>

          { !this.state.userChecked &&
            <p className="text-center">Checking Login State</p>
          }

          { this.state.userChecked && this.state.user == null &&
            <ButtonBar onClick={() => this.login()} text="Login with Gmail" />
          }

          { this.state.userChecked && this.state.user != null && this.state.ready &&
            <div>
              {/*<ButtonBar onClick={() => this.logout()} text="Logout" />*/}

              {/* Before Voting */}
              { !this.state.pollsOpen &&
                <div>
                  <h4>Current Nominations:</h4>
                  <UnSortedList data={this.state.nominations} />
                  <NewLocationForm submit={(location) => this.submit(location)} />
                  <ButtonBar onClick={() => this.openPolls()} text="Open Polls" />
                </div>
              }

              {/* During Voting */}
              { this.state.pollsOpen && !this.state.pollsClosed &&
                <div>
                  <p className="text-center">{Object.keys(this.state.ballots).length} people voting</p>
                  <UnSortedList data={this.state.nominations} />
                  <ButtonBar onClick={() => this.resetBallots()} text="Reset Ballots" />
                  <ButtonBar onClick={() => this.closePolls()} text="Close Polls" />
                </div>
              }

              {/* After Voting */}
              { this.state.pollsOpen && this.state.pollsClosed &&
                <div>
                  <SortedList locations={this.state.nominations} data={this.state.results} />
                  <ButtonBar onClick={() => this.countBallots()} text="Re Count" />
                  <ButtonBar onClick={() => this.reOpenPolls()} text="ReOpen Polls" />
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Admin;
