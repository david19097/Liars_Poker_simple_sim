const chancesTable = { 1: 0.125, 2: 0.25, 3: 0.375, 4: 0.5, 5: 0.625, 8: 0.95 };
const survivalTable = { 1: 87.5, 2: 75, 3: 62.5, 4: 50, 5: 37.5, 8: 5 };

let players = [createPlayer(1), createPlayer(2)];
let results = [];

function createPlayer(id) {
  return { id, bullets: 1, radio: false, alive: true, winner: false };
}
const bulletOptions = [1, 2, 3, 4, 5, 8];

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

const headerSection = document.createElement('div');
headerSection.className = 'header-section';

const heading = document.createElement('h1');
heading.textContent = "LIAR'S POKER SIMULATOR";
heading.className = 'neon-title';
headerSection.appendChild(heading);

const controls = document.createElement('div');
controls.className = 'controls';
controls.innerHTML = `
  <button id="reset">Reset</button>
  <button id="add">+</button>
  <button id="remove">-</button>
`;
headerSection.appendChild(controls);

// Add combined header section to the page
app.appendChild(headerSection);


  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // ✅ Create proper <thead>
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>PLAYER</th>
      <th>BULLETS</th>
      <th>SURVIVAL CHANCE</th>
      <th>ROUND WINNER</th>
      <th>STATUS</th>
    </tr>
  `;
  table.appendChild(thead);

  // ✅ Create <tbody> for players
  const tbody = document.createElement('tbody');

  players.forEach(player => {
    const row = document.createElement('tr');
    row.className = '';

    const bulletInput = document.createElement('select');
    [1, 2, 3, 4, 5, 8].forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      if (val === player.bullets) option.selected = true;
      bulletInput.appendChild(option);
    });

    bulletInput.disabled = !player.alive;
    bulletInput.addEventListener('change', e => {
      player.bullets = parseInt(e.target.value);
      render();
    });

    const radioInput = document.createElement('input');
    radioInput.type = 'checkbox';
    radioInput.checked = player.radio;
    radioInput.disabled = !player.alive;
    radioInput.addEventListener('change', e => {
      player.radio = e.target.checked;
      render();
    });

    row.innerHTML = `
    <td style="text-align: center;">Player ${player.id}</td>
    <td style="text-align: center;"></td>
    <td style="text-align: center;">${player.radio ? '100%' : (survivalTable[player.bullets] || 0) + '%'}</td>
    <td style="text-align: center;"></td>
    <td style="text-align: center;" class="${
  player.winner
    ? 'winner'
    : player.alive
    ? 'alive'
    : 'dead-text'
}">
  ${player.winner ? 'Winner' : player.alive ? 'Alive' : 'Dead'}
</td>

    `;

    row.children[1].appendChild(bulletInput);
    row.children[3].appendChild(radioInput);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  app.appendChild(table);

  const fireBtn = document.createElement('button');
  fireBtn.textContent = 'Fire';
  fireBtn.onclick = fire;
  app.appendChild(fireBtn);
  players.forEach((player, index) => {
  if (!player.alive) return;

  const increaseBtn = document.createElement('button');
  increaseBtn.textContent = `Player ${player.id}`;
  increaseBtn.onclick = () => {
    const currentIndex = bulletOptions.indexOf(player.bullets);
    const nextIndex = Math.min(currentIndex + 1, bulletOptions.length - 1);
    player.bullets = bulletOptions[nextIndex];
    render();
  };
  app.appendChild(increaseBtn);
});


/*
const resultsDiv = document.createElement('div');
resultsDiv.innerHTML = `<h4>Roulette Results</h4><ul>${
  results.map(r => `<li>Player ${r.id}: ${r.result}</li>`).join('')
}</ul>`;
app.appendChild(resultsDiv);
*/

  document.getElementById('reset').onclick = () => {
    players = players.map(p => createPlayer(p.id));
    results = [];
    render();
  };

  document.getElementById('add').onclick = () => {
    if (players.length < 4) players.push(createPlayer(players.length + 1));
    render();
  };

  document.getElementById('remove').onclick = () => {
    if (players.length > 2) players.pop();
    render();
  };
}



function fire() {
  results = [];

  let deathsThisRound = 0;

  players = players.map(p => {
    if (!p.alive) return p;
    if (p.radio) {
      results.push({ id: p.id, result: 'alive' });
      return { ...p };
    }
    const chance = chancesTable[p.bullets] || 0;
    const isDead = Math.random() < chance;
    if (isDead) deathsThisRound++;
    results.push({ id: p.id, result: isDead ? 'dead' : 'alive' });
    return { ...p, alive: !isDead };
  });

  const alive = players.filter(p => p.alive);
  if (alive.length === 1) {
    players = players.map(p =>
      p.id === alive[0].id ? { ...p, winner: true } : p
    );
  }

  // 🔊 Play audio based on deaths
  let soundName = 'blank';
  if (deathsThisRound > 0 && deathsThisRound <= 4) {
    soundName = `gunshot_${deathsThisRound}`;
  }

  const audio = new Audio(`audio/${soundName}.mp4`);
  audio.play();

  render();
}


document.addEventListener('DOMContentLoaded', render);
