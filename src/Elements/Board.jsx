import React from "react";
import Tile from "./Tile";

function Board({ tiles, onTileClick, tileSize }) {
  const style = {
    border: tileSize / 8 + "px solid brown",
    width: tiles[0].length * tileSize + "px",
    height: tiles.length * tileSize + "px",
    margin: "0 auto",
  };

  return (
    <div style={style}>
      {tiles.map((rowTiles, y) => {
        return rowTiles.map((tile, x) => {
          const index = y * rowTiles.length + x;

          return (
            <Tile
              key={index}
              y={y}
              x={x}
              value={tile.value}
              state={tile.state}
              onTileClick={onTileClick}
              size={tileSize}
            />
          );
        });
      })}
    </div>
  );
}

export default Board;
