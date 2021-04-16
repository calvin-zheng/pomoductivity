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
        this.obtainGroupWeekTotal = this.obtainGroupWeekTotal.bind(this);
        this.getImagesForGroupCode = this.getImagesForGroupCode.bind(this);
        this.state = {
            createGroupCode: "",
            joinGroupCode: "",
            errorText: "",
            groups: [],
            groupSum: {},
            images: {}
        };
    }

    obtainGroupWeekTotal(groups){
        let groupSum = this.state.groupSum;
        for(let i = 0; i < groups.length; i++) {
            const groupCode = groups[i];
            firebase.database().ref("/groups/" + groupCode).on('value', (snapshot) => {
                let groupTotal = 0;
                snapshot.forEach((child) => {
                    const currentId = child.val().id;
                    firebase.database().ref("/stats/" + currentId).on('value', (snapshot2) => {
                        if(snapshot2.exists()){
                            for (let j = 0; j < 6; j++) {
                                groupTotal += snapshot2.val()[j];
                            }
                            groupSum[groupCode] = groupTotal;
                            this.setState({groupSum: groupSum});
                        }
                    })
                });
            })
        }
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
            this.obtainGroupWeekTotal(groups);
            for(let group of groups){
                this.getImagesForGroupCode(group)
            }
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

    getImagesForGroupCode(groupCode) {
        let images = this.state.images;
        // Check if group code is valid
        firebase.database().ref("/groups/" + groupCode).once('value', (snapshot) => {
            // const data = snapshot.val();
            if(!snapshot.exists()) {
                this.setState({errorText: "Group code invalid, try another code"});
                return;
            }
            snapshot.forEach((child) => {
                if(groupCode in images){
                    images[groupCode].push(child.val().pic);
                }
                else{
                    images[groupCode] = [child.val().pic];
                }
            });
            // console.log(data);
            // for(let i; i < data.length; i++) {
            //
            //     // images.push(data[i].pic)
            // }
            this.setState({images: images});
            // console.log(images);
        });
    }

    render() {
        return <FirebaseDatabaseProvider firebase={firebase} {...config}>
            <div className="flex flex-row mx-auto w-1/2 items-center justify-center space-x-4 mt-16">
                <div className="group-creation-form space-y-3 border border-white rounded-md p-4">
                    <h1 className="text-2xl font-bold">Create group</h1>
                    <form className = "space-x-3">
                        <label>Group code:</label>
                        <input className="rounded-md bg-white bg-opacity-20" onChange={this.createGroupCodeChange}  type="text" id="task" name="task"/> <br/>
                    </form>
                    <button className="mx-auto w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded text-sm" onClick={(event) => this.createGroup(event)}>Create</button>
                </div>
                <div className="group-join-form space-y-3 border border-white rounded-md p-4">
                    <h1 className="text-2xl font-bold">Join group</h1>
                    <form className = "space-x-3">
                        <label>Group code:</label>
                        <input className="rounded-md bg-white bg-opacity-20" onChange={this.joinGroupCodeChange}  type="text" id="task" name="task"/> <br/>
                    </form>
                    <button className="mx-auto w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded text-sm" onClick={(event) => this.joinGroup(event)}>Join</button>
                </div>

                <p>{this.state.errorText}</p>
            </div>
            <h1 className="text-2xl font-bold mt-16">Your groups</h1>
            <div className="grid grid-cols-3 gap-4 w-3/4 mx-auto mt-8">
                {this.state.groups.map((group) => {

                    return (
                        <div className="rounded-xl bg-white bg-opacity-10 w-3/4 text-white mx-auto flex flex-col p-5">
                            <h2 className="text-xl font-bold">{group}</h2>
                            <div className="flex flex-row mx-auto">
                                {this.state.images[group] &&
                                this.state.images[group].map((image, i) => {
                                    return <img className="rounded-full h-10 w-10 flex-grow-0" src={image} />
                                })}
                            </div>
                            {!this.state.groupSum[group] && <p>0 minutes worked collectively</p>}
                            {(Math.floor(this.state.groupSum[group]/60) === 1) && <p>{Math.floor(this.state.groupSum[group]/60)} minute worked collectively</p>}
                            {(Math.floor(this.state.groupSum[group]/60) !== 1) && <p>{Math.floor(this.state.groupSum[group]/60)} minutes worked collectively</p>}
                        </div>);
                })}
            </div>


        </FirebaseDatabaseProvider>
    }
}

export default Groups;
