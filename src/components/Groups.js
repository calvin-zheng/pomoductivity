import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { config } from "../config.js";
import ReactPhotoGrid from "react-photo-grid";
import { FirebaseDatabaseProvider} from "@react-firebase/database";

class Groups extends Component {
    constructor(props) {
        super(props);
        this.createGroupNameChange = this.createGroupNameChange.bind(this);
        this.createGroupCodeChange = this.createGroupCodeChange.bind(this);
        this.joinGroupCodeChange = this.joinGroupCodeChange.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.joinGroup = this.joinGroup.bind(this);
        this.state = {
            createGroupCode: "",
            joinGroupCode: "",
            errorText: "",
            images: []
        };
    } 

    createGroupNameChange(event) {
        this.setState({createGroupName: event.target.value});
    }
    
    createGroupCodeChange(event) {
        this.setState({createGroupCode: event.target.value});
    }

    joinGroupCodeChange(event) {
        this.setState({joinGroupCode: event.target.value});
    }
    
    createGroup() {
        firebase.database().ref("/groups/" + this.state.createGroupCode).on('value', (snapshot) => {
            const data = snapshot.val();
            if(data !== null) {
                this.setState({errorText: "Group code already exists"});
                return;
            }
        });
        firebase.database().ref("/groups/" + this.state.createGroupCode).push({"id": this.props.user.uid, "pic": this.props.user.photoURL});
        
        // Add group to user database
        firebase.database().ref("/users/" + this.props.user.uid).push(this.state.createGroupCode);
    }

    joinGroup() {
        // Check if group code is valid
        firebase.database().ref("/groups/" + this.state.joinGroupCode).on('value', (snapshot) => {
            const data = snapshot.val();
            if(data === null) {
                this.setState({errorText: "Group code invalid, try another code"});
                return;
            }
            for(let i; i < data.length; i++) {
                if (data[i].id == this.props.user.uid) {
                    this.setState({errorText: "You are already in this group"});
                    return;
                }
            }
        });
        // If yes, join group
        firebase.database().ref("/groups/" + this.state.joinGroupCode).push({"pic": this.props.user.photoURL , "id": this.props.user.uid});
        console.log(this.state.joinGroupCode);

        // Add group to user database
        firebase.database().ref("/users/" + this.props.user.uid).push(this.state.createGroupCode);

    }
    

    getImagesForGroupCode() {
        let images = [];
        // Check if group code is valid
        firebase.database().ref("/groups/" + this.state.joinGroupCode).on('value', (snapshot) => {
            const data = snapshot.val();
            if(data === null) {
                this.setState({errorText: "Group code invalid, try another code"});
                return;
            }
            for(let i; i < data.length; i++) {
                images.push(data[i].pic)
            }
            this.setState({images: images})
        });
    }

    render() {
        return <FirebaseDatabaseProvider firebase={firebase} {...config}>
            <p>Create group</p>
            <form class = "bg-gray-400 w-2/6 h-1/6">
                  <label>Group code:</label>
                  <input onChange={this.createGroupCodeChange}  type="text" id="task" name="task"/> <br/>
            </form>
            <button onClick={this.createGroup}>Create Group</button>
            <p>Join group</p>
            <form class = "bg-gray-400 w-2/6 h-1/6">
                  <label>Group code:</label>
                  <input onChange={this.joinGroupCodeChange}  type="text" id="task" name="task"/> <br/>
            </form>
            <button onClick={this.joinGroup}>Join Group</button>
            <p>{this.state.errorText}</p>
            <ReactPhotoGrid
                onImageClick={this.handleImageClick}
                data={this.state.images} 
            />
        </FirebaseDatabaseProvider>
    }
}

export default Groups;
