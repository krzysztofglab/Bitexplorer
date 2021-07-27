export class UI {
  constructor() {
    this.elementMemory = document.querySelector('.memory');
    this.elementTokens = document.querySelector('.tokens');
    this.createMemory();
    this.createTokens();
  }

  createMemory() {
    let elements = '';
    const element = `<div class="memory_slot">-</div>`;

    for (let i = 0; i < 8; i++) {
      elements += element;
    }

    this.elementMemory.innerHTML = elements;
  }

  createTokens() {
    let elements = '';
    const element = `
    <div class="token_group">
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="token">-</div>
      <div class="reward">{ reward }</div>
    </div>
    `;

    for (let i = 0; i < 4; i++) {
      elements += element;
    }

    this.elementTokens.innerHTML = elements;
  }
}