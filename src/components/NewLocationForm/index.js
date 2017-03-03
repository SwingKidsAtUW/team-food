import React, { Component } from 'react';
import './style.css';

class NewLocationForm extends Component {
  submit(e) {
    e.preventDefault();
    this.props.submit(this.refs.name.value);
    this.refs.name.value = "";
  }
  render() {
    return (

      <form role="form" onSubmit={(e) => this.submit(e)} >
        <legend>Add New Location</legend>

        <div className="form-group">
          <input ref="name" type="text" className="form-control" placeholder="Name" />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

    );
  }
}

export default NewLocationForm;
