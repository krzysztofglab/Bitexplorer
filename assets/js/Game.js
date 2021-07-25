import { Animation } from "./Animation.js";

export class Game {
  constructor() {
    this.animation = new Animation();
    this.keys = ["1C", "7A", "E9", "55", "BD", "XX"];
    this.time = 60;
    this.password = [];
    this.activeRow = 0;
    this.activeCol = null;
    this.playing = false;
    this.end = false;
    this.miliseconds = 0;
    this.refreshCost = 3;
    this.score = 0;
    this.scoreReward = 5;
    this.ramUsage = 0;
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

  start() {
    this.animation.openMenu();
  }

  play() {
    document.querySelector('.score').textContent = this.score;
    document.querySelector('.refreshCost').textContent = this.refreshCost;
    document.querySelector('.counter_time').textContent = this.time + ".00";

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

    for(let i=0; i<2; i++){
      this.tokens[0][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
      this.password[0][i] = this.tokens[0][i];
    }
    for(let i=0; i<3; i++){
      this.tokens[1][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
      this.password[1][i] = this.tokens[1][i];
    }
    for(let i=0; i<4; i++){
      this.tokens[2][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
      this.password[2][i] = this.tokens[2][i];
    }
    for(let i=0; i<6; i++){
      this.tokens[3][i] = this.keys[Math.floor(Math.random() * this.keys.length)];
      this.password[3][i] = this.tokens[3][i];
    }
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

        token.style.backgroundColor = "rgb(48, 156, 65)";
        token.style.color = "rgb(0, 0, 0)";

        if((this.ramUsage-1) == 7 || (this.tokens[0][this.ramUsage] == "-")){

          this.tokensBlocked[0] = true;

          this.time += this.rewards[0].time;
          this.score += this.rewards[0].bits;

          alert('Container 1 finished');
        }
      } else {

        if((this.ramUsage-1) + 2 < 8){
          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[0][i] = ".";
          }
          this.tokens[0][(this.ramUsage-1) + 1] = this.password[0][0];
          this.tokens[0][(this.ramUsage-1) + 2] = this.password[0][1];
        } else {
          alert('Container 1 lost');
          this.tokensBlocked[0] = true;
        }

      }
    }

    if(!this.tokensBlocked[1]){
      if(this.ram[this.ramUsage-1] == this.tokens[1][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[1].querySelectorAll('.token')[this.ramUsage-1];

        token.style.backgroundColor = "rgb(48, 156, 65)";
        token.style.color = "rgb(0, 0, 0)";

        if((this.ramUsage-1) == 6 || (this.tokens[0][this.ramUsage] == "-")){

          this.tokensBlocked[1] = true;

          this.time += this.rewards[1].time;
          this.score += this.rewards[1].bits;

          alert('Container 2 finished');
        }
      } else {

        if((this.ramUsage-1) + 3 < 8){
          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[1][i] = ".";
          }
          this.tokens[1][(this.ramUsage-1) + 1] = this.password[1][0];
          this.tokens[1][(this.ramUsage-1) + 2] = this.password[1][1];
          this.tokens[1][(this.ramUsage-1) + 3] = this.password[1][2];
        } else {
          alert('Container 2 lost');
          this.tokensBlocked[1] = true;
        }

      }
    }

    if(!this.tokensBlocked[2]){
      if(this.ram[this.ramUsage-1] == this.tokens[2][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[2].querySelectorAll('.token')[this.ramUsage-1];

        token.style.backgroundColor = "rgb(48, 156, 65)";
        token.style.color = "rgb(0, 0, 0)";

        if((this.ramUsage-1) == 5 || (this.tokens[2][this.ramUsage] == "-")){

          this.tokensBlocked[2] = true;

          this.time += this.rewards[2].time;
          this.score += this.rewards[2].bits;

          alert('Container 3 finished');
        }
      } else {

        if((this.ramUsage-1) + 4 < 8){
          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[2][i] = ".";
          }
          this.tokens[2][(this.ramUsage-1) + 1] = this.password[2][0];
          this.tokens[2][(this.ramUsage-1) + 2] = this.password[2][1];
          this.tokens[2][(this.ramUsage-1) + 3] = this.password[2][2];
          this.tokens[2][(this.ramUsage-1) + 4] = this.password[2][3];
        } else {
          alert('Container 3 lost');
          this.tokensBlocked[2] = true;
        }

      }
    }

    if(!this.tokensBlocked[3]){
      if(this.ram[this.ramUsage-1] == this.tokens[3][this.ramUsage-1]){
        const tokenGroups = document.querySelectorAll('.token_group');
        const token = tokenGroups[3].querySelectorAll('.token')[this.ramUsage-1];

        token.style.backgroundColor = "rgb(48, 156, 65)";
        token.style.color = "rgb(0, 0, 0)";

        if((this.ramUsage-1) == 3 || (this.tokens[3][this.ramUsage] == "-")){

          this.tokensBlocked[3] = true;

          this.time += this.rewards[3].time;
          this.score += this.rewards[3].bits;

          alert('Container 4 finished');
        }
      } else {

        if((this.ramUsage-1) + 6 < 8){
          for(let i=0; i <= (this.ramUsage-1); i++){
            this.tokens[3][i] = ".";
          }
          this.tokens[3][(this.ramUsage-1) + 1] = this.password[3][0];
          this.tokens[3][(this.ramUsage-1) + 2] = this.password[3][1];
          this.tokens[3][(this.ramUsage-1) + 3] = this.password[3][2];
          this.tokens[3][(this.ramUsage-1) + 4] = this.password[3][3];
          this.tokens[3][(this.ramUsage-1) + 5] = this.password[3][4];
          this.tokens[3][(this.ramUsage-1) + 6] = this.password[3][5];
        } else {
          alert('Container 4 lost');
          this.tokensBlocked[3] = true;
        }

      }
    }

    this.drawTokens();

  }

  checkKey(row, col){
    if(this.end) return

    if(!this.playing) {
      this.playing = true;
      this.timer();
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

  timer() {
    if(this.playing){
      const element = document.querySelector('.counter_time');

      if(this.time > 0){
        if(this.miliseconds > 0){
          this.miliseconds -= 1;
        } else {
          this.time -= 1;
          this.miliseconds = 50;
        }
      } else if(this.time == 0) {
        if(this.miliseconds > 0){
          this.miliseconds -= 1;
        } else {
          this.time -= 1;
        }
      } else {
        this.time = 0;
        this.miliseconds = 0;
        this.playing = false;
        this.end = true;
      }

      const seconds = this.time;
      const miliseconds = this.miliseconds >= 10 ? this.miliseconds : '0' + this.miliseconds;

      element.textContent = `${seconds}:${miliseconds}`;

      setTimeout(this.timer.bind(this), 20);
    }
  }

  refresh() {
    this.time -= this.refreshCost;
    this.ram = ["-","-","-","-","-","-","-","-"];
    this.ramUsage = 0;
    this.generateMatrix();
    this.writeRam();
  }

  initEventListeners() {
    document.querySelector('.btn_play').addEventListener('click', this.play.bind(this));
    document.querySelector('.btn_refresh').addEventListener('click', this.refresh.bind(this));
  }
}