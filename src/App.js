import React, { Component } from "react";
import $ from "jquery";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select from "react-select";
import "./App.css";

//`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=sports&apikey=B0Vm1oHgzSTL44eTNbyGpT6YsFv5kiLQ&city=Nashville&startDateTime=2018-12-10T00:00:01Z&endDateTime=2018-12-14T23:59:59Z`,

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
      city: "Chicago",
      genrePicked: "sports",
      rangeStart: "2018-12-12T00:00:01",
      rangeEnd: "2018-12-19T23:59:59",
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
  // 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=' + {genrePicked} + '&apikey=B0Vm1oHgzSTL44eTNbyGpT6YsFv5kiLQ&city=Nashville&startDateTime=' + {rangeStart} + '&endDateTime=' + {rangeEnd}
  componentDidMount() {
    this.getEventResults();
  }

  getEventResults() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=&apikey=B0Vm1oHgzSTL44eTNbyGpT6YsFv5kiLQ&city=${
        this.state.city
      }&startDateTime=2018-12-10T00:00:01Z&endDateTime=2018-12-14T23:59:59Z`,
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
            url: event.url,
            location: event._embedded.venues.name
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

  updateGenre = genrePicked => {
    this.setState({ genrePicked });
  };

  handleClick() {
    this.setState({ eventResult: this.eventResult.splice(-1, 1) });
  }

  render() {
    var { searching, eventResult, genrePicked } = this.state;

    if (!searching) {
      return <div className="App-logo">Loading...</div>;
    }

    return (
      <div className="App">
        <div className="dateRange">
          <h2>Date Range</h2>
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
        <div className="genreSelection">
          <h2>Specify Event Genre</h2>
          <Select
            value={genrePicked}
            onChange={this.updateGenre}
            options={genres}
            placeholder="All Genres Included"
          />
          <br />
          <button onClick={this.handleClick}>Find Event Suggestions</button>
          <br />
          <h2>Event Recommendations</h2>
          <ul>
            {eventResult.map(item => (
              <li key="{item.name}">
                Name: {item.name} <br />
                URL: {item.url}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
