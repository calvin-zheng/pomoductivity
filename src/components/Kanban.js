import React, { Component } from "react";
import { DndProvider, DropTarget, DragSource } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanCard from "./KanbanCard";
import { v4 as uuidv4 } from 'uuid';
import firebase from "firebase/app";
import "firebase/database";
import { config } from "../config.js";
import { FirebaseDatabaseProvider} from "@react-firebase/database";
import Modal from 'react-modal';

const modalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Kanban extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.addTask = this.addTask.bind(this);
        this.handleTaskChange = this.handleTaskChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.modalIsOpen = this.modalIsOpen.bind(this);
        this.closeModal = this.closeModal.bind(this);
        let columns = ["Not started", "In progress", "Completed"]
        let columnsToTasks = {}
        for (let i = 0; i < columns.length; i++) {
          columnsToTasks[columns[i]] = []
        }
        firebase.database().ref("/kanban/" + this.props.user.uid).on('value', (snapshot) => {
          const d = snapshot.val();
          console.log(d);
          if(d === null) {
            return;
          }
          let newColumnsToTasks = {};
          for (let i = 0; i < columns.length; i++) {
            if (d[columns[i]] != null) {
              newColumnsToTasks[columns[i]] = d[columns[i]];
            }
            else {
              newColumnsToTasks[columns[i]] = [];
            }
          }
          this.setState({columnsToTasks: newColumnsToTasks})
        });
        this.state = {
          columns: columns,
          columnsToTasks: columnsToTasks,
          taskName: "",
          priority: "0",
          date: "",
          modalOpen: false
        };
    } 

    updateFirebase(uid) {
      firebase.database().ref("/kanban/" + uid).update(this.state.columnsToTasks);
    }

    onDrop(item, column) {
      let columns = this.state.columns;
      let columnsToTasks = this.state.columnsToTasks;
      let taskToRemove = -1;

      for(let i = 0; i < columns.length; i++) {
        const currentColumn = columns[i];
        const tasks = columnsToTasks[currentColumn];
        for(let j = 0; j < tasks.length; j++) {
            const task = tasks[j];
            if(task.id === item) {
                //remove item
                taskToRemove = task;
                columnsToTasks[currentColumn].splice(j, 1);
            }
        }
      }

      let tasksToAddTo = columnsToTasks[column];
      tasksToAddTo.push(taskToRemove);
      columnsToTasks[column] = tasksToAddTo;
      this.setState({columnsToTasks: columnsToTasks});
      this.updateFirebase(this.props.user.uid, columnsToTasks)
    };

    handleTaskChange(event) {
      this.setState({taskName: event.target.value});
    }

    handlePriorityChange(event) {
      this.setState({priority: event.target.value});
    }

    handleDateChange(event) {
      this.setState({date: event.target.value});
    }

    addTask(event) {
      const { taskName, priority, date } = this.state;
      if (taskName === "" || priority === "" || date === "")
        return;
      let newState = this.state;
      let newTask = {id:uuidv4(), title: taskName, priority: priority, dueDate: date};
      newState.columnsToTasks[this.state.columns[0]].push(newTask);
      this.setState(newState);
      this.updateFirebase(this.props.user.uid, newState.columnsToTasks);
      this.closeModal();
      event.preventDefault();
    }

    deleteTask(id) {
      let columns = this.state.columns;
      let columnsToTasks = this.state.columnsToTasks;
      for(let i = 0; i < columns.length; i++) {
        const currentColumn = columns[i];
        const tasks = columnsToTasks[currentColumn];
        for(let j = 0; j < tasks.length; j++) {
            const task = tasks[j];
            if(task.id === id) {
                //remove item
                columnsToTasks[currentColumn].splice(j, 1);
            }
        }
      }
      this.setState({columnsToTasks: columnsToTasks});
      this.updateFirebase(this.props.user.uid, columnsToTasks);
    }

    modalIsOpen() {
      console.log(this.state.modalOpen);
      return this.state.modalOpen;
    }


    closeModal() {
      this.setState({modalOpen: false});
    }

    render() {
        const { columns, columnsToTasks } = this.state;
        return (
          <FirebaseDatabaseProvider firebase={firebase} {...config}>
          {this.state.modalOpen ? <Modal
            isOpen={this.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="Add task"
           >
             <form class = "bg-gray-400 w-2/6 h-1/6">
                  <label>Task name: </label>
                  <input value={this.state.taskName} onChange={this.handleTaskChange}  type="text" id="task" name="task"/> <br/>
                  <label>Priority: </label>
                  <select id="priority" name="priority" value={this.state.priority} onChange={this.handlePriorityChange} >
                    <option value={"0"}>High</option>
                    <option value={"1"}>Medium</option>
                    <option value={"2"}>Low</option>
                  </select>  <br/>
                  <label>Date: </label>
                  <input type="text" id="date" name="date" value={this.state.date} onChange={this.handleDateChange} /> <br/>
                </form>
                <button onClick={async (event) => {
                this.addTask(event);
              }}>
                Add task
              </button>
           </Modal> : <div></div>}
            <div class = "flex h-full w-full">
                <DndProvider backend={HTML5Backend}>
                    {columns.map((column) => (
                      <KanbanColumn status={column}>
                                <div>{column}</div>
                                <div class ="flex flex-col h-full w-full">
                                {columnsToTasks[column].map((item) => (
                                      <KanbanItem id={item.id} onDrop={async (item, column) => {
                                        this.onDrop(item, column);
                                      }}>
                                          <KanbanCard delete={this.deleteTask} id={item.id} uid={this.props.user.uid} task={item.title} priority={item.priority} dueDate = {item.dueDate}></KanbanCard>
                                      </KanbanItem>
                                  ))}
                                 {column === columns[0] ? <button onClick={async () => {this.setState({modalOpen: true})}}>+</button>: <div></div>}
                                </div>
                    </KanbanColumn>
                    ))}
                </DndProvider>
              <br/>
              <button onClick = {this.props.signOut}>Sign out</button>
            </div>
            </FirebaseDatabaseProvider>
        );
      }
}

export default Kanban;


const boxTarget = {
    drop(props) {
      return { name: props.status };
    },
  };

  class KanbanColumn extends React.Component {
    render() {
      return this.props.connectDropTarget(<div class = "h-full w-1/3 rounded-md border-4 border-black bg-opacity-30 bg-blue-500 m-2" >{this.props.children}</div>);
    }
  }

  KanbanColumn = DropTarget("kanbanItem", boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }))(KanbanColumn);

  const boxSource = {
    beginDrag(props) {
      return {
        id: props.id,
      };
    },

    endDrag(props, monitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        props.onDrop(item.id, dropResult.name);
      }
    },
  };

  class KanbanItem extends React.Component {
    render() {
      return this.props.connectDragSource(<div class ="h-1/6 mb-3 ">{this.props.children}</div>);
    }
  }

  KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(KanbanItem);
