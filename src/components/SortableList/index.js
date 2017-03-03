import React from 'react';
import Sortable from 'react-sortablejs';

import './style.css';

// Functional Component
const SortableList = ({ items, onChange }) => {
    items = items.sort((a, b) => {
      return a.rank - b.rank;
    })
    const listItems = items.map((element, key) => {
      return (
        <li key={key} className="list-group-item" data-id={element.name}>
          <span className="badge">{element.rank}</span>
          {element.name}
        </li>
      )
    });

    return (
      <Sortable
        className="list-group"
        // Sortable options (https://github.com/RubaXa/Sortable#options)
        options={{
          ghostClass: "sortable-ghost",
          chosenClass: "sortable-chosen",
          dragClass: "sortable-drag",
        }}

        // [Optional] A tag to specify the wrapping element. Defaults to "div".
        tag="ol"

        // [Optional] The onChange method allows you to implement a controlled component and keep
        // DOM nodes untouched. You have to change state to re-render the component.
        // @param {Array} order An ordered array of items defined by the `data-id` attribute.
        // @param {Object} sortable The sortable instance.
        // @param {Event} evt The event object.
        onChange={(order, sortable, evt) => {
          onChange(order);
        }}
      >
        {listItems}
      </Sortable>
    );
};

SortableList.propTypes = {
    items: React.PropTypes.array,
    onChange: React.PropTypes.func
};

export default SortableList;
