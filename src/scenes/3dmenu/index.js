import Scene from "./3dmenu";

document.body.innerHTML = `
<nav class="mainNav | visually-hidden">
<ul>
    <li><a href="#">Watermelon</a></li>
    <li><a href="#">Banana</a></li>
    <li><a href="#">Strawberry</a></li>
</ul>
</nav>
<canvas id="stage"></canvas>`;

new Scene();