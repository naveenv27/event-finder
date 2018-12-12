import React, { Component } from "react";
import $ from "jquery";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./App.css";

const genres = [
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
  { label: "Arts & Theatre", value: "arts %26 theatre" }
];

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genrePicked: "",
      rangeStart: "2018-12-12T00:00:01Z",
      rangeEnd: "2018-12-19T23:59:59Z",
      dateRange: {
        // represents the potential dates
        selection: {
          startDate: new Date(),
          endDate: null,
          key: "selection"
        }
      },
      dateRangePicker: {
        // represents the dates selected
        selection: {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: "selection"
        }
      }
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

  handleRangeChange(which, payload) {
    this.setState({
      [which]: {
        ...this.state[which],
        ...payload
      },
      rangeStart:
        payload.selection.startDate.toString().substring(11, 15) +
        "-" +
        monthMap[payload.selection.startDate.toString().substring(4, 7)] +
        "-" +
        payload.selection.startDate.toString().substring(8, 10) +
        "T00:00:01Z",
      rangeEnd:
        payload.selection.endDate.toString().substring(11, 15) +
        "-" +
        monthMap[payload.selection.endDate.toString().substring(4, 7)] +
        "-" +
        payload.selection.endDate.toString().substring(8, 10) +
        "T23:59:59Z"
    });
  }

  render() {
    var { searching, eventResult } = this.state;

    if (!searching) {
      return <div>Loading...</div>;
    }

    return (
      <div className="App">
        <div className="dateRange">
          <DateRangePicker
            onChange={this.handleRangeChange.bind(this, "dateRangePicker")}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            className={"PreviewArea"}
            months={2}
            ranges={[this.state.dateRangePicker.selection]}
            direction="horizontal"
          />
        </div>
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
