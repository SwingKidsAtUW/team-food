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

      <form className="NewLocationForm" role="form" onSubmit={(e) => this.submit(e)} >

        <div className="input-group">
          <input ref="name" type="text" className="form-control" placeholder="New Location" />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-default">Submit</button>
          </span>
        </div>

      </form>

    );
  }
}

export default NewLocationForm;
