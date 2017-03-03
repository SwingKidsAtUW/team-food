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
      user: null,
      userChecked: false,
      dayRef: firebase.database().ref("days").child(key),
      nominations: [],
      ballots: [],
      pollsOpen: false,
      pollsClosed: false
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
      let results = [];

      if (pollsOpen && pollsClosed && today.ballots) {
        results = IRV(today.ballots);
      }

      this.setState({
        nominations: nominations,
        results: results,
        pollsOpen: pollsOpen,
        pollsClosed: pollsClosed
      })
    });
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
    this.state.dayRef.child("nominations").push(location)
  }

  openPolls() {
    this.state.dayRef.child("pollsOpen").set(true);
  }

  closePolls() {
    this.state.dayRef.child("pollsClosed").set(true);
  }

  reOpenPolls() {
    this.state.dayRef.child("pollsClosed").set(false);
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
            <p>Checking Login State</p>
          }

          { this.state.userChecked && this.state.user == null &&
            <ButtonBar onClick={() => this.login()} text="Login with Gmail" />
          }

          { this.state.userChecked && this.state.user != null &&
            <div>
              <ButtonBar onClick={() => this.logout()} text="Logout" />
              { !this.state.pollsClosed &&
                <UnSortedList data={this.state.nominations} />
              }
              { !this.state.pollsOpen && !this.state.pollsClosed &&
                <NewLocationForm submit={(location) => this.submit(location)} />
              }
              { this.state.pollsOpen && this.state.pollsClosed &&
                <SortedList locations={this.state.nominations} data={this.state.results} />
              }

              { !this.state.pollsOpen && !this.state.pollsClosed &&
                <ButtonBar onClick={() => this.openPolls()} text="Open Polls" />
              }
              { this.state.pollsOpen && !this.state.pollsClosed &&
                <ButtonBar onClick={() => this.closePolls()} text="Close Polls" />
              }
              { this.state.pollsOpen && this.state.pollsClosed &&
                <ButtonBar onClick={() => this.reOpenPolls()} text="ReOpen Polls" />
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Admin;
