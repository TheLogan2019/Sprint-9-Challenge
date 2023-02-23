import React from "react";
import axios from "axios";

export default class AppClass extends React.Component {
  state = {
    x: 2,
    y: 2,
    index: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    steps: 0,
    message: "",
    email: "",
  };

  north = () => {
    if (this.state.y === 1) {
      this.setState({ ...this.state, message: `You can't go up` });
    } else {
      const newIndex = [...this.state.index];
      newIndex[this.state.y - 1][this.state.x - 1] = 0;
      newIndex[this.state.y - 2][this.state.x - 1] = 1;
      console.log(newIndex);
      this.setState({
        ...this.state,
        y: this.state.y - 1,
        index: newIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    }
  };

  east = () => {
    if (this.state.x === 3) {
      this.setState({ ...this.state, message: `You can't go right` });
    } else {
      const newIndex = [...this.state.index];
      newIndex[this.state.y - 1][this.state.x - 1] = 0;
      newIndex[this.state.y - 1][this.state.x] = 1;
      this.setState({
        ...this.state,
        x: this.state.x + 1,
        index: newIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    }
  };

  south = () => {
    if (this.state.y === 3) {
      this.setState({ ...this.state, message: `You can't go down` });
    } else {
      const newIndex = [...this.state.index];
      newIndex[this.state.y - 1][this.state.x - 1] = 0;
      newIndex[this.state.y][this.state.x - 1] = 1;
      this.setState({
        ...this.state,
        y: this.state.y + 1,
        index: newIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    }
  };

  west = () => {
    if (this.state.x === 1) {
      this.setState({ ...this.state, message: `You can't go left` });
    } else {
      const newIndex = [...this.state.index];
      newIndex[this.state.y - 1][this.state.x - 1] = 0;
      newIndex[this.state.y - 1][this.state.x - 2] = 1;
      this.setState({
        ...this.state,
        x: this.state.x - 1,
        index: newIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    }
  };

  reset = () => {
    this.setState({
      x: 2,
      y: 2,
      index: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      steps: 0,
      message: "",
      email: "",
    });
  };

  onChange = (evt) => {
    const { value } = evt.target;
    this.setState({
      ...this.state,
      email: value,
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        ...this.state,
        email: this.state.email,
      })
      .then((res) => {
        this.setState({
          ...this.state,
          message: res.data.message,
          email: "",
        });
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          message: err.response.data.message,
        });
      });
    this.setState({ ...this.state, email: "" });
  };

  render() {
    const { x, y, index, steps, message, email } = this.props;
    const { className } = this.props;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({this.state.x}, {this.state.y})
          </h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
        </div>
        <div id="grid">
          {this.state.index
            .flatMap((x) => x)
            .map((spot, idx) => {
              return spot === 1 ? (
                <div key={idx} value={idx} className="square active">
                  B
                </div>
              ) : (
                <div key={idx} value={idx} className="square"></div>
              );
            })}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.west}>
            LEFT
          </button>
          <button id="up" onClick={this.north}>
            UP
          </button>
          <button id="right" onClick={this.east}>
            RIGHT
          </button>
          <button id="down" onClick={this.south}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            value={this.state.email}
            id="email"
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
