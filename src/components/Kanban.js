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
    transform             : 'translate(-50%, -50%)',
    background            : '#4D6EDB'
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

    componentDidMount(){
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
      this.setState({taskName: "",
                      priority: "0",
                      date: "",});
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
          <div className="mt-16">
          <FirebaseDatabaseProvider firebase={firebase} {...config}>
          {this.state.modalOpen ? <Modal
            isOpen={this.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="Add task"
           >
             <div>
             <form class = "space-y-3 p-2 mb-4 text-white">
                  <label>Task name: </label>
                  <input className="rounded-md bg-white bg-opacity-20"  value={this.state.taskName} onChange={this.handleTaskChange}  type="text" id="task" name="task"/> <br/>
                  <label>Priority: </label>
                  <select className="rounded-md bg-white bg-opacity-20"  id="priority" name="priority" value={this.state.priority} onChange={this.handlePriorityChange} >
                    <option value={"0"}>High</option>
                    <option value={"1"}>Medium</option>
                    <option value={"2"}>Low</option>
                  </select>  <br/>
                  <label>Date: </label>
                  <input className="mb-4 rounded-md bg-white bg-opacity-20" type="text" id="date" name="date" value={this.state.date} onChange={this.handleDateChange} /> <br/>
                </form>
                <button className="float-right mx-auto bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded text-sm" onClick={async (event) => {
                this.addTask(event);
              }}>
                Add task
              </button>
              </div>
           </Modal> : <div></div>}
            <div className = "flex h-full w-2/3 mx-auto">
                <DndProvider backend={HTML5Backend}>
                    {columns.map((column) => (
                      <KanbanColumn className="" status={column}>
                                <div className="text-2xl font-bold">{column}</div>
                                <div className ="flex flex-col w-full">
                                {columnsToTasks[column].map((item) => (
                                      <KanbanItem id={item.id} onDrop={async (item, column) => {
                                        this.onDrop(item, column);
                                      }}>
                                          <KanbanCard delete={this.deleteTask} id={item.id} uid={this.props.user.uid} task={item.title} priority={item.priority} dueDate = {item.dueDate}></KanbanCard>
                                      </KanbanItem>
                                  ))}
                                 {column === columns[0] ? <button className="mx-auto bg-white hover:bg-gray-300 rounded-full px-2 text-blue-800 text-xl" onClick={async () => {this.setState({modalOpen: true})}}><span className="hello"><p>Add task +</p></span></button>: <div></div>}
                                </div>
                    </KanbanColumn>
                    ))}
                </DndProvider>
              <br/>
            </div>
            </FirebaseDatabaseProvider>
            </div>
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
      return this.props.connectDropTarget(<div class = "h-full w-1/3 rounded-xl bg-white bg-opacity-10 w-1/2 m-2 border border-white min-h-75screen" >{this.props.children}</div>);
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
