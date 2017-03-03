import React, { Component } from 'react';
import './style.css';

class SortedList extends Component {
  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <ol className="list-group">
        {
          this.props.data.map((element) => {
            let key = Object.values(element).toString()
            let rank = `Rank: ${element.rank}`;
            if (typeof element.rank === "string") {
              rank = element.rank;
            }

            return (
              <li className="list-group-item" key={key} >
                <span className="badge">{rank}</span>
                {element.name}
              </li>
            )
          })
        }
      </ol>
    );
  }
}

export default SortedList;
