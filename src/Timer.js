import React, {Component} from "react";

class Timer extends Component{
    constructor(){
        super();

        this.state = {
            time: 1500, /* seconds */
            minutes: 25,
            seconds: 0,
            started: false,
            break: false,
            sessions: 0,
            intervalId: 0
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

    decreaseTime(){
        if(this.state.time === 0 && !this.state.break){
            clearInterval(this.state.intervalId);
            if((this.state.sessions + 1) % 4 === 0){
                this.setState( {
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
            </div>);

    }
}

export default Timer;
