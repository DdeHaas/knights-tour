import React, { useState, useEffect } from "react";
import "../App.css";
import * as utils from "../utils";
import * as knightsTour from "../knightsTour";
import { tourStates, tourActions, tileStates } from "./common";
import Board from "./Board";

function App() {
  const [positions, setPositions] = useState([]);
  const [positionOne, setPostionOne] = useState(null);
  const [closedTour, setClosedTour] = useState(false);
  const [tourState, setTourState] = useState(tourStates.idle);
  const [startTime, setStartTime] = useState(null);

  const speed = 10; // timer speed in ms
  const tileSize = 40; // size in px

  const tourStarted = positionOne != null || startTime != null;

  const getTilesFromPositions = () => {
    const tiles = knightsTour.createTiles(0, tileStates.none);

    if (positions.length > 0) {
      for (const position of positions) {
        const tile = tiles[position.y][position.x];
        tile.value = position.value;

        switch (tile.value) {
          case 1:
            tile.state = tileStates.first;
            break;
          case knightsTour.boardSize:
            tile.state = tileStates.last;
            break;
          case positions.length:
            tile.state = tileStates.current;
            break;
          default:
        }
      }
    }

    return tiles;
  };

  useEffect(() => {
    const doNextStep = () => {
      if (startTime == null) {
        setStartTime(new Date().getTime());
      }

      if (tourState === tourStates.step) {
        setPositions(knightsTour.nextStep(positions, closedTour));
        setTourState(tourStates.idle);
      }

      if (tourState === tourStates.running) {
        setPositions(knightsTour.nextStep(positions, closedTour));
      }
    };

    let timerId;

    if (tourStarted) {
      switch (positions.length) {
        case 0:
          setTourState(tourStates.stuck);
          setPositions([positionOne]);
          break;
        case knightsTour.boardSize:
          setTourState(tourStates.solved);
          break;
        default:
      }

      if (tourState !== tourStates.idle) {
        timerId = setTimeout(() => doNextStep(), speed);
      }
    }

    return () => clearTimeout(timerId);
  }, [positions, positionOne, closedTour, tourStarted, tourState, startTime]);

  const handleClick = (event) => {
    const action = parseInt(event.target.dataset.action);
    if (action === tourActions.reset) {
      setPositions([]);
      setPostionOne(null);
      setTourState(tourStates.idle);
      setStartTime(null);
      return;
    }

    if (tourStarted) {
      switch (action) {
        case tourActions.continue:
          setTourState(tourStates.running);
          break;
        case tourActions.pause:
          setTourState(tourStates.idle);
          break;
        case tourActions.step:
          setTourState(tourStates.step);
          break;
        default:
      }
      return;
    }

    if (positions.length === knightsTour.boardSize) {
      return;
    }

    // start
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    const _positions = knightsTour.start(x, y);
    setPostionOne(_positions[0]);
    setPositions(_positions);
  };

  const handleNoMonitoring = () => {
    if (startTime == null) {
      setStartTime(new Date().getTime());
    }

    let _positions = [...positions];
    do {
      _positions = knightsTour.nextStep(_positions, closedTour);
    } while (
      _positions.length > 0 &&
      _positions.length < knightsTour.boardSize
    );

    switch (_positions.length) {
      case 0:
        _positions.push(positionOne);
        setTourState(tourStates.stuck);
        break;
      case knightsTour.boardSize:
        setTourState(tourStates.solved);
        break;
      default:
    }

    setPositions(_positions);
  };

  const handleLookForClosedTourChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setClosedTour(value);
  };

  const displayState = () => {
    switch (tourState) {
      case tourStates.running:
        return "Running";
      case tourStates.stuck:
        return "Unsolvable";
      case tourStates.solved:
        return "Solved";
      default:
        return tourStarted
          ? positions.length > 1
            ? "Paused"
            : "Started"
          : "Idle";
    }
  };

  return (
    <div className="App">
      <h1>Knight's Tour</h1>
      <p className="description">
        click on any tile on the board to set the start position
      </p>
      <p>
        <input
          id="checkboxClosedTour"
          type="checkbox"
          onChange={handleLookForClosedTourChange}
          disabled={positions.length > 0 ?? "disabled"}
        />
        <label htmlFor="checkboxClosedTour">Look for closed tour</label>
      </p>
      <Board
        tiles={getTilesFromPositions()}
        onTileClick={handleClick}
        tileSize={tileSize}
      />
      <p>
        <span>State: {displayState()}</span>
        <br />
        <span>{utils.getDurationUntilNow(startTime)}</span>
      </p>
      <button
        onClick={handleClick}
        data-action={tourActions.reset}
        disabled={
          tourState === tourStates.solved || tourState === tourStates.stuck
            ? undefined
            : "disabled"
        }
      >
        Reset
      </button>
      <button
        onClick={handleClick}
        data-action={tourActions.continue}
        disabled={
          tourStarted && tourState === tourStates.idle ? undefined : "disabled"
        }
      >
        Continue
      </button>
      <button
        onClick={handleClick}
        data-action={tourActions.pause}
        disabled={
          tourStarted && tourState === tourStates.running
            ? undefined
            : "disabled"
        }
      >
        Pause
      </button>
      <button
        onClick={handleClick}
        data-action={tourActions.step}
        disabled={
          tourStarted && tourState === tourStates.idle ? undefined : "disabled"
        }
      >
        Step
      </button>
      <br />
      <button
        onClick={handleNoMonitoring}
        disabled={
          tourStarted && tourState === tourStates.idle ? undefined : "disabled"
        }
      >
        No monitoring
      </button>
    </div>
  );
}

export default App;
