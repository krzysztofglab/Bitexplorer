export class Time {
  constructor(seconds, gameOverFunction) {
    this.gameOverFunction = gameOverFunction;
    this.active = false;
    this.maxSeconds = seconds;
    this.seconds = seconds;
    this.miliseconds = 0;
    this.elementCounter = document.querySelector('.counter_time');
    this.elementTimeBar = document.querySelector('.board_bar');
    this.elementCounter.textContent = `${this.seconds}.00`;
  }

  start() {
    this.active = true;
    this.countdown();
  }

  changeSeconds(value) {
    this.seconds += value;
    this.miliseconds = 0;
    this.maxSeconds = this.seconds > this.maxSeconds ? this.seconds : this.maxSeconds;
  }

  countdown() {
    if(this.active) {

      // Calculate time
      if(this.seconds > 0) {
        if(this.miliseconds > 0){
          this.miliseconds -= 1;
        } else {
          this.seconds -= 1;
          this.miliseconds = 49;
        }
      } else if(this.seconds == 0){
        if(this.miliseconds > 0){
          this.miliseconds -= 1;
        } else {
          this.seconds -= 1;
        }
      } else {
        this.seconds = 0;
        this.miliseconds = 0;
        this.stop();
      }

      // Draw counter text
      const txtSeconds = this.seconds;
      const txtMiliseconds = this.miliseconds >= 10 ? this.miliseconds : '0' + this.miliseconds;
      this.elementCounter.textContent = `${txtSeconds}.${txtMiliseconds}`;
      
      // Draw counter bar
      const currentValue = (this.seconds * 50) + this.miliseconds;
      const maxValue = this.maxSeconds * 50;
      this.elementTimeBar.style.width = `${(currentValue / maxValue) * 100}%`;

      // Set Timeout
      setTimeout(this.countdown.bind(this), 20);
    }
  }

  stop() {
    this.gameOverFunction();
    this.active = false;
  }
}