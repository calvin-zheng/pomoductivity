import React, { Component } from "react";

class KanbanCard extends Component {

    constructor(props) {
        super(props);
    }

    getPriorityText() {
        const {priority} = this.props;
        if (priority === "0") {
            return <p class="bg-red-300">Priority high 🔥</p>
        }
        if (priority === "1") {
            return <p class="bg-yellow-300">Priority medium ⭐️</p>

        }
        if (priority === "2") {
            return <p class="bg-green-300">Priority low 😴</p>
        }
    }

    getDueDate() {
        const {dueDate} = this.props;
    }

    render() {
        return <div  key={this.id} class = "rounded-lg mx-auto w-5/6 h-full bg-gray-50">
            <p>{this.props.task}</p>
            {this.getPriorityText()}
            <p>{this.props.dueDate}</p>
        </div>;
    }
}

export default KanbanCard;