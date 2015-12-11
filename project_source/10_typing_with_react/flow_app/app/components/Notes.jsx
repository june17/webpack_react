/* @flow */
import React from 'react';
import Editable from './Editable.jsx';
import Note from './Note.jsx';
import LaneActions from '../actions/LaneActions';

export default class Notes extends React.Component {
  props: {
    items: Array<Object>,
    onEdit: Function,
    onDelete: Function
  };
  static defaultProps: {
    items: [],
    onEdit: () => any,
    onDelete: () => any
  };
  render(): ReactElement {
    const notes = this.props.items;

    return <ul className="notes">{notes.map(this.renderNote, this)}</ul>;
  }
  renderNote(note: Object): ReactElement {
    return (
      <Note className="note" onMove={LaneActions.move}
        id={note.id} key={note.id}>
        <Editable
          value={note.task}
          onEdit={this.props.onEdit.bind(null, note.id)}
          onDelete={this.props.onDelete.bind(null, note.id)} />
      </Note>
    );
  }
}
