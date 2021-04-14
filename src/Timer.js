import React, {Component} from "react";
import { FirebaseDatabaseProvider, FirebaseDatabaseNode, FirebaseDatabaseMutation} from "@react-firebase/database";
import firebase from "firebase";
import {config} from "./config";
import KanbanCard from "./components/KanbanCard";

class Timer extends Component{
    constructor(props){
        super(props);

        this.state = {
            initTime: 1500,
            time: 1500, /* seconds */
            minutes: 25,
            seconds: 0,
            started: false,
            break: false,
            sessions: 0,
            intervalId: 0,
            dates: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6:0},
            statWeek: null
        };
        this.startCountdown = this.startCountdown.bind(this);
        this.decreaseTime = this.decreaseTime.bind(this);
        this.stopCountdown = this.stopCountdown.bind(this);
    }

    startCountdown(){
        this.setState({
            intervalId: setInterval(this.decreaseTime, 1000),
            started: true
        });
    }

    stopCountdown(){
        clearInterval(this.state.intervalId);
        this.setState({
            started: false
        });
    }

    componentDidMount() {
        firebase.database().ref("/stats/" + this.props.user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if(data !== null) {
                let defaultDates = this.state.dates;
                for(let i = 0; i < data.length; i++){
                    defaultDates[i] = data[i];
                }
                this.setState({dates: defaultDates});
            }
        });
        const today = new Date();
        const weekBegin = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    }

    decreaseTime(){
        if(this.state.time % 10 === 0 && !this.state.break &&
            (this.state.initTime - this.state.time) !== 0){
            const day = (new Date()).getDay();
            let newDates = this.state.dates;
            newDates[day] += 10;
            this.setState({dates: newDates});

            firebase.database().ref("/stats/" + this.props.user.uid).update(
                {
                    0: this.state.dates[0],
                    1: this.state.dates[1],
                    2: this.state.dates[2],
                    3: this.state.dates[3],
                    4: this.state.dates[4],
                    5: this.state.dates[5],
                    6: this.state.dates[6]
                });
        }

        if(this.state.time === 0 && !this.state.break){
            clearInterval(this.state.intervalId);
            if((this.state.sessions + 1) % 4 === 0){
                this.setState( {
                    initTime: 1200,
                    time: 1200,
                    minutes: 20,
                    seconds: 0,
                    break: true,
                    started: false,
                    sessions: this.state.sessions + 1
                })
            }
            else{
                this.setState( {
                    initTime: 300,
                    time: 300,
                    minutes: 5,
                    seconds: 0,
                    break: true,
                    started: false,
                    sessions: this.state.sessions + 1
                })
            }
        }
        else if(this.state.time === 0 && this.state.break){
            clearInterval(this.state.intervalId);
            this.setState({
                initTime: 1500,
                time: 1500,
                minutes: 25,
                seconds: 0,
                break: false,
                started: false
            })
        }
        else{
            this.setState({
                time: this.state.time - 1,
                minutes: Math.floor((this.state.time - 1)/60),
                seconds: (this.state.time - 1) % 60
            })
        }
    }

    render(){
        return (
            <FirebaseDatabaseProvider firebase={firebase} {...config}>
            <div className="rounded-xl bg-white bg-opacity-10 w-1/2 text-white mx-auto flex flex-col space-y-3 p-5">
                    {!this.state.started && !this.state.break && <div>
                        Let's get started!
                    </div>}
                    {this.state.started && !this.state.break && <div>
                        Keep up the good work!
                    </div>}
                    {this.state.break && <div>
                        Great work! Now let's take a break!
                    </div>}
                    <div>
                        <span className ="text-7xl font-semibold">
                            {this.state.minutes} : {('0' + this.state.seconds).slice(-2)}
                        </span>
                    </div>
                    {!this.state.started && <button
                        onClick = {this.startCountdown}
                        className="mx-auto w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded">
                        BEGIN
                    </button>}
                    {this.state.started && <button
                        onClick= {this.stopCountdown}
                        className="mx-auto w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded">
                        PAUSE

                    </button>}
            </div>
            </FirebaseDatabaseProvider>);

    }
}

export default Timer;
