import React, {Component} from "react";
import {PieChart, Pie, Tooltip} from 'recharts'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line} from 'recharts';
import { FirebaseDatabaseProvider, FirebaseDatabaseNode, FirebaseDatabaseMutation} from "@react-firebase/database";
import firebase from "firebase";
import {config} from "./config";
import KanbanCard from "./components/KanbanCard";


// how many hours spent on studying
// how many tasks were completed
// need to create graphs for showing this stuff
// most productive times during the day

class Stats extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: [ {name:"Sunday", value: 0},{name:"Monday", value: 0}, {name:"Tuesday", value: 0}, {name:"Wednesday", value: 0}, {name:"Thursday", value: 0}, {name:"Friday", value: 0}, {name:"Saturday", value: 0}],
    }
    //this.componentStats = this.componentStats.bind(this);
  }

  componentDidMount(){
    let data = this.state.data;
    firebase.database().ref("/stats/" + this.props.user.uid).once('value', (snapshot) => {
      if(snapshot.exists()){
        const snapshotData = snapshot.val();
        for(let i = 0; i < 7; i++){
          data[i].value = snapshotData[i]*1.0/60;
        }
        this.setState({data: data});
      }
    });
  }

  render(){
    return (

      <div className="mt-16">
        <h1 className="text-2xl font-bold mb-3">How Productive You Were This Week</h1>
        <p className="w-1/3 mx-auto mb-3">The stats page keeps track of how long you worked through the pomodoro timer. To make sure your work time is tracked, make sure to have the timer open in a tab while working!</p>
        <div className = "rounded-xl bg-white bg-opacity-10 w-1/2 text-white mx-auto p-4">
          <BarChart className="mx-auto" width={730} height={500} data={this.state.data}>
            {/*<CartesianGrid strokeDasharray="3 3" />*/}
            <Legend width={200} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#4D6EDB', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            <XAxis dataKey="name" style={{fill: "#FFFFFF"}}/>
            <YAxis label={{angle: -90, position: 'insideLeft', fill: "#FFFFFF" }} style={{fill: "#FFFFFF"}}/>
            <Tooltip cursor={{fill: 'rgba(0, 0, 255, 0.1)'}} content={<CustomTooltip />} wrapperStyle={{ width: 200, backgroundColor: 'rgba(0,0,0, 0.3)' }} />
            <Bar name="Minutes Worked" dataKey="value" fill="#ffffff" />
            {/*<Tooltip wrapperStyle={{ width: 1000, backgroundColor: '#ccc' }} />*/}
            {/*<Line name="Minutes Studied" type="monotone" dataKey="value" stroke="#8884d8" />*/}
          </BarChart>
        </div>

      </div>


    )
  }
}

export default Stats;

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </div>
    );
  }

  return null;
}
