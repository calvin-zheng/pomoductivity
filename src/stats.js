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
      testdata: [ {name:"Sunday", value: 0},{name:"Monday", value: 0}, {name:"Tuesday", value: 0}, {name:"Wednesday", value: 0}, {name:"Thursday", value: 0}, {name:"Friday", value: 0}, {name:"Saturday", value: 0}],
      taskdata: [ {name:"Sunday", value: 0},{name:"Monday", value: 0}, {name:"Tuesday", value: 0}, {name:"Wednesday", value: 0}, {name:"Thursday", value: 0}, {name:"Friday", value: 0}, {name:"Saturday", value: 0}]
    }
    //this.componentStats = this.componentStats.bind(this);
  }

  componentDidMount(){

    var datatesting = [ {name:"Sunday", value: 0},{name:"Monday", value: 0}, {name:"Tuesday", value: 0}, {name:"Wednesday", value: 0}, {name:"Thursday", value: 0}, {name:"Friday", value: 0}, {name:"Saturday", value: 0}]
    firebase.database().ref("/stats/" + this.props.user.uid).on('value', (snapshot) => {
      datatesting = snapshot.val();
    });
    console.log(datatesting)
    var actual = [ {name:"Sunday", value: 0},{name:"Monday", value: 0}, {name:"Tuesday", value: 0}, {name:"Wednesday", value: 0}, {name:"Thursday", value: 0}, {name:"Friday", value: 0}, {name:"Saturday", value: 0}]
    var i
    for (i = 0; i < actual.length; i++){
      actual[i].value = datatesting[i];
    }
    this.setState({
      testdata: actual
    });
    
  }
  

  render(){
    return (
      
      <div className="statisticstesting"> 
        <h1> Welcome to Statistics</h1>
        
          <div>
            Actual Data from Database Minutes:
            {console.log("testing this", this.state.testdata)}
            <div className = "bar"> 
              <BarChart width={730} height={250} data={this.state.testdata}>
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value" fill="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Minutes Studied', angle: -90, position: 'insideLeft' }} />
              </BarChart>
          </div>
          </div>

      </div>


    )
  }
}

export default Stats;
