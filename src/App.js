import React, { Component } from "react";
import $ from "jquery";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventResult: [],
      searching: false
    };
  }

  componentDidMount() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=sports&apikey=B0Vm1oHgzSTL44eTNbyGpT6YsFv5kiLQ&city=Nashville&startDateTime=2018-12-10T00:00:01Z&endDateTime=2018-12-14T23:59:59Z`,
      type: "GET",
      async: true,
      dataType: "json",
      success: data => {
        console.log("GET success: ", data._embedded);
        var events = data._embedded.events;
        var eventInfoArray = [];
        events.forEach(event => {
          var info = {
            name: event.name,
            url: event.url
          };
          eventInfoArray.push(info);
        });
        this.setState({
          eventResult: eventInfoArray,
          searching: true
        });
      },
      error: data => {
        console.error("GET error: ", data);
      }
    });
  }

  render() {
    var { searching, eventResult } = this.state;

    if (!searching) {
      return <div>Loading...</div>;
    }

    return (
      <div className="App">
        <ul>
          {eventResult.map(item => (
            <li key="{item.name}">
              Name: {item.name} | URL: {item.url}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
