export class Time {
  constructor(seconds, gameClass) {
    this.gameClass = gameClass;
    this.stoperTime = 0;
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
    this.stoper()
  }

  changeSeconds(value) {
    this.seconds += value;
    this.miliseconds = 0;
    this.maxSeconds = this.seconds > this.maxSeconds ? this.seconds : this.maxSeconds;
  }

  stoper() {
    if(this.active){
      this.stoperTime++;
      console.log(this.stoperTime);
      setTimeout(this.stoper.bind(this), 1000);
    }
  }

  convertStoperTime() {
    const minutes = Math.floor(this.stoperTime / 60);
    let seconds = this.stoperTime - (minutes * 60);

    seconds = seconds >= 10 ? seconds : '0' + seconds;

    this.convertedStoperTime = `${minutes}m ${seconds}s`;
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
    this.active = false;
    this.convertStoperTime();
    this.gameClass.showResult();
  }
}