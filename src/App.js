import logo from './logo.svg';
import './App.css';
import Kanban from './components/Kanban';

function App() {
  return (
    <div className="App">
      <div style={{height: "600px",  width: "1200px", display: "flex"}}> <Kanban/> </div>
    </div>
  );
}

export default App;
