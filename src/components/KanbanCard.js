import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { config } from "../config.js";
import { FirebaseDatabaseProvider, FirebaseDatabaseNode, FirebaseDatabaseMutation} from "@react-firebase/database";

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
        return <div key={this.id} class = "rounded-lg mx-auto w-5/6 bg-gray-50">
                <p>{this.props.task}</p>
                {this.getPriorityText()}
                <p>{this.props.dueDate}</p>
                <FirebaseDatabaseMutation key={this.props.task} path={"/kanban/" + this.props.uid} type="set">
                    {({ runMutation }) => (
                        <button onClick={async (event) => {
                            console.log("deleted") 
                        }}>
                        Delete
                        </button>
                    )}
                </FirebaseDatabaseMutation>
            </div>;
    }
}

export default KanbanCard;