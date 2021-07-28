import { Animation } from "./Animation.js";
import { Time } from "./Time.js";
import { UI } from "./UI.js";

export class Game {
  constructor() {
    this.ui = new UI();
    this.animation = new Animation();
    this.time = new Time(60, this);

    this.keys = ["1C", "7A", "E9", "55", "BD", "XX"];

    this.activeRow = 0;
    this.activeCol = null;

    this.playing = false;
    this.gameOver = false;
    
    this.refreshCost = 3;
    this.score = 0;
    this.scoreReward = 5;
    this.ramUsage = 0;

    this.password = [];
    this.ram = ["-","-","-","-","-","-","-","-"];
    this.tokens = [
      ["-","-","-","-","-","-","-","-"],
      ["-","-","-","-","-","-","-","-"],
      ["-","-","-","-","-","-","-","-"],
      ["-","-","-","-","-","-","-","-"]
    ]
    this.tokensBlocked = [false, false, false, false];
    this.rewards = [
      {name: "10s", time: 10, bits: 0},
      {name: "10s & 50b", time: 10, bits: 50},
      {name: "20s & 80b", time: 20, bits: 80},
      {name: "60s & 300b", time: 60, bits: 300}
    ]
    this.initEventListeners();
    this.start();
  }

  showResult() {
    document.querySelector('.collectedBits').textContent = this.score;
    document.querySelector('.connectionTime').textContent = this.time.convertedStoperTime;
    this.animation.openResult();
  }

  start() {
    this.animation.openMenu();
  }

  play() {
    document.querySelector('.score').textContent = this.score;
    document.querySelector('.refreshCost').textContent = this.refreshCost;

    const rewards = document.querySelectorAll('.reward');
    rewards.forEach((reward, i) => {
      reward.textContent = this.rewards[i].name;
    })

    this.generateMatrix();

    this.animation.openBoard();
  }

  generateMatrix() {
    this.generateTokens();
    this.activeRow = 0;
    this.activeCol = null;

    const isTable = document.querySelector('table') != null;
    if(isTable) document.querySelector('table').remove();

    const table = document.createElement('table');

    for(let r=0; r<6; r++){
      const tr = document.createElement('tr');
      for(let c=0; c<6; c++){
        const td = document.createElement('td');
        td.addEventListener('click', () => { this.checkKey(r,c) });
        td.classList.add(`r${r}c${c}`);
        td.textContent = this.keys[Math.floor(Math.random() * this.keys.length)];
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    document.querySelector('.matrix').appendChild(table);
    this.drawActiveArea();
  }

  drawActiveArea() {
    document.querySelectorAll('td').forEach(td => td.classList.remove('active_key'));

    if(this.activeRow != null) {
      for(let i=0; i<6; i++){
        document.querySelector(`.r${this.activeRow}c${i}`).classList.add('active_key');
      }
    } else {
      for(let i=0; i<6; i++){
        document.querySelector(`.r${i}c${this.activeCol}`).classList.add('active_key');
      }
    }
  }

  generateTokens() {
    this.password[0] = [];
    this.password[1] = [];
    this.password[2] = [];
    this.password[3] = [];

    const elementsTokens = document.querySelectorAll('.token');
    elementsTokens.forEach(elementToken => {
      elementToken.classList.remove('token_ignored');
      elementToken.classList.remove('token_good');
      elementToken.classList.remove('token_bad');
    })

    this.tokens[0].forEach((token,i) => {
      if(i < 2) {
        this.tokens[0][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
        this.password[0][i] = this.tokens[0][i];
      } else {
        this.tokens[0][i] = '-';
      }
    })

    this.tokens[1].forEach((token,i) => {
      if(i < 3) {
        this.tokens[1][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
        this.password[1][i] = this.tokens[1][i];
      } else {
        this.tokens[1][i] = '-';
      }
    })

    this.tokens[2].forEach((token,i) => {
      if(i < 4) {
        this.tokens[2][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
        this.password[2][i] = this.tokens[2][i];
      } else {
        this.tokens[2][i] = '-';
      }
    })

    this.tokens[3].forEach((token,i) => {
      if(i < 6) {
        this.tokens[3][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
        this.password[3][i] = this.tokens[3][i];
      } else {
        this.tokens[3][i] = '-';
      }
    })



    this.drawTokens();
  }

  drawTokens() {
    const tokenGroups = document.querySelectorAll('.token_group');
    tokenGroups.forEach((group,g) => {
      const tokens = group.querySelectorAll('.token');
      tokens.forEach((token,t) => {
        token.textContent = this.tokens[g][t];
      })
    })
  }

  checkToken() {

    if(!this.tokensBlocked[0]){
      if(this.ram[this.ramUsage-1] == this.tokens[0][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[0].querySelectorAll('.token')[this.ramUsage-1];

        token.classList.add('token_good');

        if((this.ramUsage-1) == 7 || (this.tokens[0][this.ramUsage] == "-")){

          this.tokensBlocked[0] = true;

          this.time.changeSeconds(this.rewards[0].time);
          this.score += this.rewards[0].bits;

          const tokensGroup = document.querySelectorAll('.token_group')[0];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[0] = ["C","O","R","R","E","C","T","."];
          
          for(let i=0; i < 8; i++){
            tokens[i].classList.add('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }
      } else {

        if((this.ramUsage-1) + 2 < 8){
          const tokensGroup = document.querySelectorAll('.token_group')[0];
          const tokens = tokensGroup.querySelectorAll('.token');

          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[0][i] = ".";
            tokens[i].classList.remove('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.add('token_ignored');
          }

          this.tokens[0][(this.ramUsage-1) + 1] = this.password[0][0];
          this.tokens[0][(this.ramUsage-1) + 2] = this.password[0][1];
        } else {
          this.tokensBlocked[0] = true;

          const tokensGroup = document.querySelectorAll('.token_group')[0];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[0] = ["W","R","O","N","G",".",".","."];

          for(let i=0; i < 8; i++){
            tokens[i].classList.remove('token_good');
            tokens[i].classList.add('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }

      }
    }

    if(!this.tokensBlocked[1]){
      if(this.ram[this.ramUsage-1] == this.tokens[1][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[1].querySelectorAll('.token')[this.ramUsage-1];

        token.classList.add('token_good');

        if((this.ramUsage-1) == 7 || (this.tokens[1][this.ramUsage] == "-")){

          this.tokensBlocked[1] = true;

          this.time.changeSeconds(this.rewards[1].time);
          this.score += this.rewards[1].bits;

          const tokensGroup = document.querySelectorAll('.token_group')[1];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[1] = ["C","O","R","R","E","C","T","."];
          
          for(let i=0; i < 8; i++){
            tokens[i].classList.add('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }
      } else {

        if((this.ramUsage-1) + 3 < 8){
          const tokensGroup = document.querySelectorAll('.token_group')[1];
          const tokens = tokensGroup.querySelectorAll('.token');

          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[1][i] = ".";
            tokens[i].classList.remove('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.add('token_ignored');
          }
          this.tokens[1][(this.ramUsage-1) + 1] = this.password[1][0];
          this.tokens[1][(this.ramUsage-1) + 2] = this.password[1][1];
          this.tokens[1][(this.ramUsage-1) + 3] = this.password[1][2];
          
        } else {
          this.tokensBlocked[1] = true;

          const tokensGroup = document.querySelectorAll('.token_group')[1];
          const tokens = tokensGroup.querySelectorAll('.token');
          this.tokens[1] = ["W","R","O","N","G",".",".","."];

          for(let i=0; i < 8; i++){
            tokens[i].classList.remove('token_good');
            tokens[i].classList.add('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }

      }
    }

    if(!this.tokensBlocked[2]){
      if(this.ram[this.ramUsage-1] == this.tokens[2][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[2].querySelectorAll('.token')[this.ramUsage-1];

        token.classList.add('token_good');

        if((this.ramUsage-1) == 7 || (this.tokens[2][this.ramUsage] == "-")){

          this.tokensBlocked[2] = true;

          this.time.changeSeconds(this.rewards[2].time);
          this.score += this.rewards[2].bits;

          const tokensGroup = document.querySelectorAll('.token_group')[2];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[2] = ["C","O","R","R","E","C","T","."];
          
          for(let i=0; i < 8; i++){
            tokens[i].classList.add('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }
      } else {

        if((this.ramUsage-1) + 4 < 8){
          const tokensGroup = document.querySelectorAll('.token_group')[2];
          const tokens = tokensGroup.querySelectorAll('.token');

          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[2][i] = ".";
            tokens[i].classList.remove('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.add('token_ignored');
          }
          this.tokens[2][(this.ramUsage-1) + 1] = this.password[2][0];
          this.tokens[2][(this.ramUsage-1) + 2] = this.password[2][1];
          this.tokens[2][(this.ramUsage-1) + 3] = this.password[2][2];
          this.tokens[2][(this.ramUsage-1) + 4] = this.password[2][3];
        } else {
          this.tokensBlocked[2] = true;

          const tokensGroup = document.querySelectorAll('.token_group')[2];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[2] = ["W","R","O","N","G",".",".","."];

          for(let i=0; i < 8; i++){
            tokens[i].classList.remove('token_good');
            tokens[i].classList.add('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }

      }
    }

    if(!this.tokensBlocked[3]){
      if(this.ram[this.ramUsage-1] == this.tokens[3][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[3].querySelectorAll('.token')[this.ramUsage-1];

        token.classList.add('token_good');

        if((this.ramUsage-1) == 7 || (this.tokens[3][this.ramUsage] == "-")){

          this.tokensBlocked[3] = true;

          this.time.changeSeconds(this.rewards[3].time);
          this.score += this.rewards[3].bits;

          const tokensGroup = document.querySelectorAll('.token_group')[3];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[3] = ["C","O","R","R","E","C","T","."];
          
          for(let i=0; i < 8; i++){
            tokens[i].classList.add('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }
      } else {

        if((this.ramUsage-1) + 6 < 8){
          const tokensGroup = document.querySelectorAll('.token_group')[3];
          const tokens = tokensGroup.querySelectorAll('.token');

          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[3][i] = ".";
            tokens[i].classList.remove('token_good');
            tokens[i].classList.remove('token_bad');
            tokens[i].classList.add('token_ignored');
          }

          this.tokens[3][(this.ramUsage-1) + 1] = this.password[3][0];
          this.tokens[3][(this.ramUsage-1) + 2] = this.password[3][1];
          this.tokens[3][(this.ramUsage-1) + 3] = this.password[3][2];
          this.tokens[3][(this.ramUsage-1) + 4] = this.password[3][3];
          this.tokens[3][(this.ramUsage-1) + 5] = this.password[3][4];
          this.tokens[3][(this.ramUsage-1) + 6] = this.password[3][5];
        } else {
          this.tokensBlocked[3] = true;

          const tokensGroup = document.querySelectorAll('.token_group')[3];
          const tokens = tokensGroup.querySelectorAll('.token');

          this.tokens[3] = ["W","R","O","N","G",".",".","."];

          for(let i=0; i < 8; i++){
            tokens[i].classList.remove('token_good');
            tokens[i].classList.add('token_bad');
            tokens[i].classList.remove('token_ignored');
          }
        }

      }
    }

    this.drawTokens();

  }

  checkKey(row, col){
    if(this.gameOver) return

    if(!this.playing) {
      this.playing = true;
      this.time.start();
    }

    if(this.ramUsage < this.ram.length) {
      const field = document.querySelector(`.r${row}c${col}`);
      const key = field.textContent;

      if(key != "-" && field.classList.contains('active_key')){
        this.ram[this.ramUsage] = key;
        this.ramUsage++;
        this.score += this.scoreReward;
        field.textContent = '-';
        field.classList.add('disabled_key');

        if(this.activeRow != null) {
          this.activeRow = null;
          this.activeCol = col;
        } else {
          this.activeCol = null;
          this.activeRow = row;
        }

        this.drawActiveArea();
        this.writeRam();
        this.checkToken();
        this.writeScore();
      }

    }
  }

  writeRam() {
    const ramSlots = document.querySelectorAll('.memory_slot');
    ramSlots.forEach((slot,i) => {
      slot.textContent = this.ram[i];
    })
  }

  writeScore() {
    document.querySelector('.score').textContent = this.score;
  }

  refresh() {
    this.time.changeSeconds(-this.refreshCost);
    this.ram = ["-","-","-","-","-","-","-","-"];
    this.tokensBlocked = [false, false, false, false];
    this.ramUsage = 0;
    this.generateMatrix();
    this.writeRam();
  }

  initEventListeners() {
    document.querySelector('.btn_play').addEventListener('click', this.play.bind(this));
    document.querySelector('.btn_refresh').addEventListener('click', this.refresh.bind(this));
  }

}