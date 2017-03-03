import React, { Component } from 'react';
import './style.css';

class ButtonBar extends Component {
  render() {
    return (
      <button onClick={() => this.props.onClick()} type="button" className="btn btn-block btn-primary">{this.props.text}</button>
    );
  }
}

export default ButtonBar;
