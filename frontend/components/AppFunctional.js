import React, { useState } from "react";
import axios from "axios";

export default function AppFunctional(props) {
  const [state, setState] = useState({
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

  const north = () => {
    if (state.y === 1) {
      setState({ ...state, message: `You can't go up` });
    } else {
      const newIndex = [...state.index];
      newIndex[state.y - 1][state.x - 1] = 0;
      newIndex[state.y - 2][state.x - 1] = 1;
      console.log(newIndex);
      setState({
        ...state,
        y: state.y - 1,
        index: newIndex,
        steps: state.steps + 1,
        message: "",
      });
    }
  };

  const east = () => {
    if (state.x === 3) {
      setState({ ...state, message: `You can't go right` });
    } else {
      const newIndex = [...state.index];
      newIndex[state.y - 1][state.x - 1] = 0;
      newIndex[state.y - 1][state.x] = 1;
      setState({
        ...state,
        x: state.x + 1,
        index: newIndex,
        steps: state.steps + 1,
        message: "",
      });
    }
  };

  const south = () => {
    if (state.y === 3) {
      setState({ ...state, message: `You can't go down` });
    } else {
      const newIndex = [...state.index];
      newIndex[state.y - 1][state.x - 1] = 0;
      newIndex[state.y][state.x - 1] = 1;
      setState({
        ...state,
        y: state.y + 1,
        index: newIndex,
        steps: state.steps + 1,
        message: "",
      });
    }
  };

  const west = () => {
    if (state.x === 1) {
      setState({ ...state, message: `You can't go left` });
    } else {
      const newIndex = [...state.index];
      newIndex[state.y - 1][state.x - 1] = 0;
      newIndex[state.y - 1][state.x - 2] = 1;
      setState({
        ...state,
        x: state.x - 1,
        index: newIndex,
        steps: state.steps + 1,
        message: "",
      });
    }
  };

  const reset = () => {
    setState({
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

  const onChange = (evt) => {
    const { value } = evt.target;
    setState({
      ...state,
      email: value,
    });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        ...state,
        email: state.email,
      })
      .then((res) => {
        setState({
          ...state,
          message: res.data.message,
          email: "",
        });
      })
      .catch((err) => {
        setState({
          ...state,
          message: err.response.data.message,
        });
      });
    setState({ ...state, email: "" });
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Coordinates ({state.x}, {state.y})
        </h3>
        <h3 id="steps">
          You moved {state.steps} {state.steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {state.index
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
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={west}>
          LEFT
        </button>
        <button id="up" onClick={north}>
          UP
        </button>
        <button id="right" onClick={east}>
          RIGHT
        </button>
        <button id="down" onClick={south}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={state.email}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
