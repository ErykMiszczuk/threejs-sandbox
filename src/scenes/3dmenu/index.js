import Scene from "./3dmenu";

document.body.innerHTML = `
<nav class="mainNav | visually-hidden">
<ul>
    <li><a href="#">General Kenobi!</a></li>
    <li><a href="#">Hello there!</a></li>
</ul>
</nav>
<canvas id="stage"></canvas>`;

new Scene();