// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————
import data from './data.js';

// const nextBtn = document.querySelector('.next');
// const beforeBtn = document.querySelector('.before');

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = 'ㅇㅅㅁ';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        this.randomColor1 = Math.floor(Math.random() * 255 + 1);
        this.randomColor2 = Math.floor(Math.random() * 255 + 1);
        this.randomColor3 = Math.floor(Math.random() * 255 + 1);
        const oldText = this.el.innerText;
        if (!newText) {
            return;
        }
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update(this.randomColor1, this.randomColor2, this.randomColor3);
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        console.log(this.randomColor1, this.randomColor2, this.randomColor3);
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud" style="color : rgb(${this.randomColor1},${this.randomColor2},${this.randomColor3})">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const mainDesc = data.map((item) => {
    return item.desc;
});
const mainTitle = data.map((item) => {
    return item.title;
});

const phrases = mainDesc;

const title = mainTitle;

const ol = document.querySelector('.title');
const el = document.querySelector('.text');
const fx = new TextScramble(el);
const gx = new TextScramble(ol);

let counter = 0;
let x;
let cx;
let mode = false;

const next = () => {
    // nextBtn.addEventListener('click', () => {
    //     counter++;
    //     fx.setText(phrases[counter]);
    //     console.log(counter);
    // });
    // beforeBtn.addEventListener('click', () => {
    //     counter--;
    //     if (counter < 0) {
    //         counter = 0;
    //     }
    //     fx.setText(phrases[counter]);
    // });

    window.addEventListener('pointerdown', (e) => {
        mode = true;
        x = e.offsetX;
    });
    window.addEventListener('pointerup', (e) => {
        mode = false;
        cx = e.offsetX;
        if (x - cx < 0) {
            counter++;
            if (counter > phrases.length) {
                counter = phrases.length - 1;
            }
            fx.setText(phrases[counter]);
            gx.setText(title[counter]);
        } else if (x - cx > 0) {
            counter--;
            if (counter < 0) {
                counter = 0;
            }
            fx.setText(phrases[counter]);
            gx.setText(title[counter]);
        }
    });
};

gx.setText(title[counter]);
fx.setText(phrases[counter]);
next();
