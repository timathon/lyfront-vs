import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent /* implements OnInit */ {
  squares: any[];
  xIsNext: boolean;
  winner: string | null;
  constructor() { 
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  // ngOnInit(): void {
  //   this.newGame();
  // }
  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner();
  }

  calculateWinner() {
    const lines = [];

    return null;
  }
}
