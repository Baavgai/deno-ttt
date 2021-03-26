import { initGame, move, isPos } from "./tttEngine.ts";

import { displayGame, getUserPos } from "./tttConsole.ts";

let game = initGame();

displayGame(game, true);

game = move(game, 4);

displayGame(game, true);

// const entry = prompt("enter thing");
// console.log("you hit: " + entry);
// console.log(`isPos(${isPos(entry)})`);

game = move(game, getUserPos(game));

displayGame(game, true);
