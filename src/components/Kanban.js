import React, { Component } from "react";
import { DndProvider, DropTarget, DragSource } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanCard from "./KanbanCard";
import { v4 as uuidv4 } from 'uuid';

class Kanban extends Component {

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.addTask = this.addTask.bind(this);
        this.handleTaskChange = this.handleTaskChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        let columns = ["Not started", "In progress", "Completed"]
        let columnsToTasks = {}
        for (let i = 0; i < columns.length; i++) {
          columnsToTasks[columns[i]] = []
        }
        this.state = {
          columns: columns,
          columnsToTasks: columnsToTasks,
          taskName: "",
          priority: 0,
          date: ""
        };
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
      let newState = this.state;
      let newTask = {id:uuidv4(), title:this.state.taskName, priority:this.state.priority, dueDate: this.state.date};
      newState.columnsToTasks[this.state.columns[0]].push(newTask);
      this.setState(newState);
      event.preventDefault();
    }
      
    render() {
        const { columns, columnsToTasks } = this.state;
        console.log(columnsToTasks);
        return (
            <div class = "flex h-full w-full">
                <DndProvider backend={HTML5Backend}>
                    {columns.map((column) => (
                        <KanbanColumn status={column}>
                            <React.Fragment>
                                <div>{column}</div>
                                <div class ="flex flex-col h-full w-full">
                                {columnsToTasks[column].map((item) => (
                                    <KanbanItem id={item.id} onDrop={this.onDrop}>
                                        <KanbanCard id={item.id} task={item.title} priority={item.priority} dueDate = {item.dueDate}></KanbanCard>
                                    </KanbanItem>
                                    ))}
                                </div>
                            </React.Fragment>
                    </KanbanColumn>
                    ))}
                </DndProvider>
              <br/>
              <form class = "bg-gray-400 w-2/6 h-1/6" onSubmit={this.addTask}>
                <label for="task">Task name: </label>
                <input value={this.state.taskName} onChange={this.handleTaskChange}  type="text" id="task" name="task"/> <br/>
                <label for="priority">Priority: </label>
                <select id="priority" name="priority" value={this.state.priority} onChange={this.handlePriorityChange} >
                  <option value={"0"}>High</option>
                  <option value={"1"}>Medium</option>
                  <option value={"2"}>Low</option>
                </select>  <br/>
                <label for="date">Date: </label>
                <input type="text" id="date" name="date" value={this.state.date} onChange={this.handleDateChange} /> <br/>
                <button type="submit">Add task</button>
              </form>
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
      return this.props.connectDragSource(<div class ="h-1/6 mb-6">{this.props.children}</div>);
    }
  }
  
  KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(KanbanItem);