import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { config } from "../config.js";
import { ImageGallery } from 'react-image-gallery';
import { FirebaseDatabaseProvider} from "@react-firebase/database";

class Groups extends Component {
    constructor(props) {
        super(props);
        this.createGroupNameChange = this.createGroupNameChange.bind(this);
        this.createGroupCodeChange = this.createGroupCodeChange.bind(this);
        this.joinGroupCodeChange = this.joinGroupCodeChange.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.joinGroup = this.joinGroup.bind(this);
        this.obtainGroupWeekTotal = this.obtainGroupWeekTotal.bind(this);
        this.state = {
            createGroupCode: "",
            joinGroupCode: "",
            errorText: "",
            groups: [],
            groupSum: {}
        };
    }

    obtainGroupWeekTotal(){
        let groupSum = {};
        for(let i = 0; i < this.state.groups.length; i++) {
            const groupCode = this.state.groups[i];
            firebase.database().ref("/groups/" + groupCode).on('value', (snapshot) => {
                let groupTotal = 0;
                snapshot.forEach((child) => {
                    const currentId = child.val().id;
                    firebase.database().ref("/stats/" + currentId).on('value', (snapshot2) => {
                        for (let j = 0; j < 6; j++) {
                            groupTotal += snapshot2.val()[j];
                        }
                    })
                });
                groupSum[groupCode] = groupTotal;
            })
        }
        this.setState({groupSum: groupSum});
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

    componentDidMount(){
        firebase.database().ref("/users/" + this.props.user.uid).on('value', (snapshot) => {
            let groups = [];
            if(snapshot.exists()){
                snapshot.forEach((child) => {
                    groups.push(child.val())
                })
            }
            this.setState({groups: groups});
            this.obtainGroupWeekTotal();
            console.log(this.state.groupSum);
        });
    }

    async createGroup(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({errorText: ""});
        await firebase.database().ref("/groups/" + this.state.createGroupCode).once('value', (snapshot) => {
            console.log(this.state);
            if(snapshot.exists()) {
                this.setState({errorText: "Group code already exists"});
                return;
            }
            firebase.database().ref("/groups/" + this.state.createGroupCode).push({"id": this.props.user.uid, "pic": this.props.user.photoURL});
            firebase.database().ref("/users/" + this.props.user.uid).push(this.state.createGroupCode);
        });
    }


    async joinGroup(event) {
        // Check if group code is valid
        event.preventDefault();
        event.stopPropagation();
        this.setState({errorText: ""});
        await firebase.database().ref("/groups/" + this.state.joinGroupCode).once('value', (snapshot) => {
            if(!snapshot.exists()) {
                this.setState({errorText: "Group code invalid, try another code"});
                return;
            }
            snapshot.forEach((child) => {
                // console.log(child.key, child.val());
                if(child.val().id === this.props.user.uid){
                    this.setState({errorText: 'You are already in this' +
                            ' group!'});
                }
            });


        });
        if(this.state.errorText.length === 0){
            firebase.database().ref("/groups/" + this.state.joinGroupCode).push({"pic": this.props.user.photoURL , "id": this.props.user.uid});
            firebase.database().ref("/users/" + this.props.user.uid).push(this.state.joinGroupCode);
            this.setState({joinGroupCode: ""});
        }

    }


    render() {
        const setting = {
            width: '600px',
            height: ['250px', '170px'],
            layout: [1, 4],
            photos: [
              { src: 'url/image-1.jpg' },
              { src: 'url/image-2.jpg' },
              { src: 'url/image-3.jpg' },
              { src: 'url/image-4.jpg' },
              { src: 'url/image-5.jpg' },
              { src: 'url/image-6.jpg' },
            ],
            showNumOfRemainingPhotos: true
          };

        return <FirebaseDatabaseProvider firebase={firebase} {...config}>
            <p>Your groups</p>
            {this.state.groups.map((group) => {
               return <div>{group}</div>;
            })}
            <p>Create group</p>
            <form class = "bg-gray-400 w-2/6 h-1/6">
                  <label>Group code:</label>
                  <input onChange={this.createGroupCodeChange}  type="text" id="task" name="task"/> <br/>
            </form>
            <button onClick={(event) => this.createGroup(event)}>Create Group</button>
            <p>Join group</p>
            <form class = "bg-gray-400 w-2/6 h-1/6">
                  <label>Group code:</label>
                  <input onChange={this.joinGroupCodeChange}  type="text" id="task" name="task"/> <br/>
            </form>
            <button onClick={(event) => this.joinGroup(event)}>Join Group</button>
            <p>{this.state.errorText}</p>


        </FirebaseDatabaseProvider>
    }
}

export default Groups;
