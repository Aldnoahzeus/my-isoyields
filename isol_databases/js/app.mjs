let fullData = [];
let currentTraces = [];
let currentResults = [];

fetch('data.json')
  .then(r => r.json())
  .then(data => {
    fullData = data;
    const projectiles = [...new Set(data.map(d => d.projectile))].sort();
    const targets = [...new Set(data.map(d => d.target))].sort();

    const projList = document.getElementById('projectiles');
    const tarList = document.getElementById('targets');

    projectiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      projList.appendChild(opt);
    });
    targets.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      tarList.appendChild(opt);
    });
  })
  .catch(err => console.error("Failed to load data.json:", err));

const plotDiv = document.getElementById('chart');
Plotly.newPlot(plotDiv, [], {
  xaxis: { title: '质量数 A' },
  yaxis: { title: '产额', type: 'linear' },
  hovermode: 'closest'
});

document.getElementById('queryForm').onsubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const q = {
    projectile: form.projectile.value.trim(),
    target: form.target.value.trim(),
    energy: parseFloat(form.energy.value)
  };

  const results = fullData.filter(d =>
    d.projectile === q.projectile &&
    d.target === q.target &&
    Math.abs(d.energy - q.energy) < 0.5
  );

  if (results.length === 0) {
    alert(`未找到 ${q.projectile} + ${q.target} @ ${q.energy} MeV 的数据`);
    return;
  }

  const trace = {
    x: results.map(r => r.A),
    y: results.map(r => r.yield),
    mode: 'lines+markers',
    type: 'scatter',
    name: `${q.projectile} + ${q.target} @ ${q.energy} MeV`,
    text: results.map(r => `${r.product} (Z=${r.Z})`),
    hovertemplate: '%{text}<br>A=%{x}, Yield=%{y}<extra></extra>'
  };

  currentTraces.push(trace);
  currentResults = currentResults.concat(results);
  Plotly.addTraces(plotDiv, trace);
  updateTable();
};

document.getElementById('clearBtn').onclick = function() {
  Plotly.react(plotDiv, [], {
    xaxis: { title: '质量数 A' },
    yaxis: { title: '产额', type: 'linear' }
  });
  currentTraces = [];
  currentResults = [];
  document.getElementById('table').innerHTML = '图表已清空。';
};

let isLog = false;
document.getElementById('logScaleBtn').onclick = function() {
  isLog = !isLog;
  this.textContent = isLog ? "线性坐标" : "对数坐标";
  Plotly.relayout(plotDiv, { 'yaxis.type': isLog ? 'log' : 'linear' });
};

document.getElementById('downloadBtn').onclick = function() {
  if (currentResults.length === 0) {
    alert("无数据可下载");
    return;
  }
  const headers = ["projectile","target","energy","product","Z","A","yield","yield_unit"];
  const csv = [
    headers.join(","),
    ...currentResults.map(r => headers.map(h => r[h] || "").join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `isoyields_export_${Date.now()}.csv`;
  a.click();
};

function updateTable() {
  const tableDiv = document.getElementById('table');
  tableDiv.innerHTML = `
    <table class="table table-striped table-sm">
      <thead><tr><th>反应</th><th>产物</th><th>Z</th><th>A</th><th>产额</th></tr></thead>
      <tbody>
        ${currentResults.map(r => `
          <tr>
            <td>${r.projectile}+${r.target}@${r.energy}MeV</td>
            <td>${r.product}</td>
            <td>${r.Z}</td>
            <td>${r.A}</td>
            <td>${r.yield.toExponential(4)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}