import React from "react";
import { tileStates } from "./common";

function Tile({ x, y, value, state, onTileClick, size }) {
  let tileColor = "black";
  if (y % 2 === 0) {
    if (x % 2 === 0) {
      tileColor = "white";
    }
  } else {
    if (x % 2 === 1) {
      tileColor = "white";
    }
  }

  const styleTile = {
    backgroundColor: tileColor,
    float: "left",
    color: "gray",
    width: size + "px",
    height: size + "px",
  };

  let styleCircle = undefined;
  if (state !== tileStates.none) {
    const circleColor =
      state === tileStates.first
        ? "green"
        : state === tileStates.last
        ? "orange"
        : "red";

    styleCircle = {
      borderRadius: "50%",
      width: "70%",
      height: "70%",
      position: "relative",
      boxShadow: "0 0 0 2px " + circleColor,
      margin: "15%",
    };
  }

  return (
    <div style={styleTile} data-y={y} data-x={x} onClick={onTileClick}>
      <div style={styleCircle}>{value > 0 ? value : ""}</div>
    </div>
  );
}

export default Tile;
