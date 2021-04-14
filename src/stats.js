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
      dataHours: [ {name:"Monday", value: 1}, {name:"Tuesday", value: 2}, {name:"Wednesday", value: 3}, {name:"Thursday", value: 4}, {name:"Friday", value: 5}, ],
      dataTasks: [ {name:"Monday", value: 2}, {name:"Tuesday", value: 1}, {name:"Wednesday", value: 5}, {name:"Thursday", value: 3}, {name:"Friday", value: 1}, ],
      dataCombined:  [ {name:"Monday", hours: 1, tasks: 2}, {name:"Tuesday", hours: 2, tasks: 1}, {name:"Wednesday", hours: 3, tasks: 5}, {name:"Thursday", hours: 4, tasks:3}, {name:"Friday", hours: 5, tasks: 1}, ],
      testdata: null
    }
    //this.componentStats = this.componentStats.bind(this);
  }

  componentDidMount(){
    var datatesting = null
    firebase.database().ref("/stats/" + this.props.user).on('value', (snapshot) => {
      this.setState({
        testdata: snapshot.val()
      });
      datatesting = snapshot.val();
    });
    
  }
  

  render(){
    return (
      
      <div className="statisticstesting"> 
        <h1> Statistics</h1>
        <div>
          <PieChart width={730} height={250}>
            <Pie data={this.state.dataHours} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <PieChart width={730} height={250}>
            <Pie data={this.state.dataHours} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
            <Tooltip />
          </PieChart>
        </div>
        <div className = "bar">
          <BarChart width={730} height={250} data={this.state.dataHours}>
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Hours Studied', angle: -90, position: 'insideLeft' }} />
          </BarChart>
          </div>
          <div className = "bar"> 
            <BarChart width={730} height={250} data={this.state.dataTasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="value" fill="#8884d8" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Tasks Completed', angle: -90, position: 'insideLeft' }} />
            </BarChart>
          </div>
          <div className = "line">
          <LineChart
              width={730}
              height={300}
              data={this.state.dataCombined}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="tasks" stroke="#82ca9d" />
            </LineChart>
          </div>
          <div>
            Testing here:
            {console.log("testing this", this.state.testdata)}
          </div>

      </div>


    )
  }
}

export default Stats;
