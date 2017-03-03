import React, { Component } from 'react';
import './style.css';

class SortedList extends Component {
  render() {
    return (
      <ul className="list-group">
        {
          this.props.data.map((element) => (
            <li className="list-group-item" key={element} >
              {element}
            </li>
          ))
        }
      </ul>
    );
  }
}

export default SortedList;
