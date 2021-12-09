import avocado from "../assets/images/avocado.min.svg?raw";
import sphericalCow from "../assets/images/spherical-cow.min.svg?raw";
import characters from "../assets/characters.json";

const IMAGES = [
  avocado,
  sphericalCow
];

const capitalize = (s) => s[0].toUpperCase() + s.substring(1);

class ManzdevMemecard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        --width: 325px;
        --title-font: "Encode Sans", sans-serif;
        --normal-font: "Clear Sans", sans-serif;
        --bottom-gradient: linear-gradient(#22213E00 20%, #000 40%);
        --top-gradient: repeating-conic-gradient(at 49% 38%, #fff4 5%, #0000 15%, #fff4 17%);
        font-size: 16px;
      }

      .container {
        width: var(--width);
        height: var(--height);
        min-width: 250px;
        margin: 25px;
        margin-top: 6em;
        border-radius: 25px;
        box-shadow: 2px 2px 12px 4px #0006;
        padding: 25px;
        background:
          var(--bottom-gradient),
          var(--top-gradient);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        animation: move-bg 5s ease-in-out infinite alternate;
        transition: background 5s ease-in-out;
        position: relative;
      }

      .image {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }

      .image svg {
        max-height: 300px;
        transform: translateY(18px);
        clip-path: polygon(0 0, 100% 0, 100% 94%, 0% 94%);
        filter: drop-shadow(0 0 10px #0007);
      }

      .image svg .container {
        transform: translateY(8px);
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 55%;
        padding: 15px;
        box-sizing: border-box;
        font-family: var(--normal-font);
      }

      h2.title {
        font-family: var(--title-font);
        font-size: 1.4rem;
      }

      .date {
        color: #aaa;
        font-weight: bold;
        font-size: 0.8rem;
        letter-spacing: 2px;
      }

      .title {
        color: #fff;
      }

      .info {
        display: flex;
        align-items: center;
        color: #fff;
      }

      .star {
        color: #F8CB1C;
      }

      .tags {
        display: flex;
        gap: 6px;
        margin: 0 10px;
        user-select: none;
      }

      .tags .tag {
        background: #3D3D3D;
        border-radius: 5px;
        padding: 5px 10px;
        color: #aaa;
        letter-spacing: -1px;
        font-size: 0.8rem;
      }

      .text {
        color: #888;
        text-align: center;
        letter-spacing: -0.5px;
        margin-bottom: 1em;
      }

      .button {
        display: flex;
        width: 100%;
        background: #5D2D9D;
        color: #fff;
        text-decoration: none;
        display: flex;
        justify-content: center;
        padding: 10px;
        border-radius: 5px;
        transition: background 0.5s;
        margin-bottom: 0.25em;
      }

      .arrow {
        position: absolute;
        top: 6px;
        color: #fff;
        font-size: 2.25rem;
        text-shadow:
          0 0 3px #000,
          2px 3px 4px #0007;
        cursor: pointer;
      }

      .arrow.left {
        left: 20px;
        transform: scaleX(-1);
      }

      .arrow.right {
        right: 20px;
      }

      .button:hover {
        background: #8B43EA;
      }
    `;
  }

  static get observedAttributes() {
    return ["index"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "index") {
      this.index = parseInt(newValue);
      this.render();
    }
  }

  connectedCallback() {
    this.index = Number(this.getAttribute("index")) || 0;
    this.render();
  }

  prev() {
    const newIndex = Math.max(0, this.index - 1);
    this.setAttribute("index", newIndex);
  }

  next() {
    const newIndex = Math.min(characters.length - 1, this.index + 1);
    this.setAttribute("index", newIndex);
  }

  getTags() {
    return characters[this.index].tags.map(tag => `<span class="tag">${capitalize(tag)}</span>`).join("");
  }

  setPrevArrow() {
    if (this.index === 0) return;

    const div = document.createElement("div");
    div.classList.add("left", "arrow");
    div.textContent = "➔";
    div.addEventListener("click", () => this.prev());
    this.shadowRoot.querySelector(".container").appendChild(div);
  }

  setNextArrow() {
    if (this.index === (characters.length - 1)) return;

    const div = document.createElement("div");
    div.classList.add("right", "arrow");
    div.textContent = "➔";
    div.addEventListener("click", () => this.next());
    this.shadowRoot.querySelector(".container").appendChild(div);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${ManzdevMemecard.styles}</style>
    <div class="container">
      <div class="image">
        ${IMAGES[this.index]}
      </div>
      <div class="content">
        <div class="date">${characters[this.index].date}</div>
        <h2 class="title">${characters[this.index].title}</h2>
        <div class="info">
          <div class="rating">
            ${characters[this.index].rating}
            <span class="star">★</span>
          </div>
          <div class="tags">
            ${this.getTags()}
          </div>
        </div>
        <div class="text">
          <p>${characters[this.index].text}</p>
        </div>
        <a class="button" href="${characters[this.index].link}">
          Ver su primera aparición
        </a>
      </div>
    </div>`;
    if (!this.hasAttribute("static")) {
      this.setPrevArrow();
      this.setNextArrow();
    }
  }
}

customElements.define("manzdev-memecard", ManzdevMemecard);
