/* @flow */
import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

class Lane extends React.Component {
  props: {
    lane: {
      id: string,
      name?: string,
      notes?: Array<Object>
    },
    connectDropTarget: Function
  };
  static defaultProps: {
    lane: {
      name: '',
      notes: []
    }
  };
  render(): any {
    const {connectDropTarget, lane, ...props} = this.props;
    const id = lane.id;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header">
          <Editable className="lane-name" value={lane.name}
            onEdit={this.editName.bind(id)} />
          <div className="lane-add-note">
            <button onClick={this.addNote.bind(id)}>+</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.get(lane.notes)
          }}
        >
          <Notes
            onEdit={this.editNote}
            onDelete={this.deleteNote.bind(id)} />
        </AltContainer>
      </div>
    );
  }
  addNote(laneId): void {
    NoteActions.create({task: 'New task'});
    LaneActions.attachToLane({laneId});
  };
  editNote(id, task): void {
    NoteActions.update({id, task});
  };
  deleteNote(laneId, noteId): void {
    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  };
  editName(id, name): void {
    if(name) {
      LaneActions.update({id, name});
    }
    else {
      LaneActions.delete(id);
    }
  };
}

export default DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))(Lane);
