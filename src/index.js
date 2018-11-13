import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import initialData from './initial-data';
import Column from './Column';
import Done from './done';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.draggableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
  
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
  
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      }
      this.setState(newState);
    } else if (destination.droppableId === 'column-done') {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...start,
        taskIds: startTaskIds,
      }

      const doneTaskIds = Array.from(this.state.done);
      doneTaskIds.splice(destination.index, 0, draggableId);
      const newDoneList = [...doneTaskIds];

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStartColumn.id]: newStartColumn,
        },
        done: newDoneList,
      }

      this.setState(newState);

    } else {
      const sourceTaskIds = Array.from(start.taskIds);
      sourceTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...start,
        taskIds: sourceTaskIds,
      };

      const newSourceTaskIds = Array.from(finish.taskIds);
      newSourceTaskIds.splice(destination.index, 0, draggableId);
      const newEndColumn = {
        ...finish,
        taskIds: newSourceTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        }
      }
      this.setState(newState);
    }
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {
            this.state.columnOrder.map(columnId => {
              const column = this.state.columns[columnId];
              const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
              
              return <Column key={column.id} column={column} tasks={tasks} />;
            })
          }
          <Done doneItems={this.state.done} />
        </Container>
      </DragDropContext>
    );
  }
} 

ReactDOM.render(<App />, document.getElementById('root'));