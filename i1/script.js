/* LearnPro Academy SEO research dashboard — illustrative planning data only. */
const keywordData = [
  { keyword: 'online courses', volume: 18100, difficulty: 72, intent: 'Commercial investigation', priority: 'High', recommendation: 'Create a searchable course directory with clear subject filters.' },
  { keyword: 'digital marketing course', volume: 9900, difficulty: 58, intent: 'Commercial investigation', priority: 'High', recommendation: 'Build a focused course page with syllabus, projects and FAQs.' },
  { keyword: 'data analytics course', volume: 8100, difficulty: 54, intent: 'Transactional', priority: 'High', recommendation: 'Show tools, prerequisites, projects and a transparent course outline.' },
  { keyword: 'Python course for beginners', volume: 6600, difficulty: 43, intent: 'Informational', priority: 'High', recommendation: 'Pair a beginner course page with a free first-project tutorial.' },
  { keyword: 'online courses with certificates', volume: 5400, difficulty: 61, intent: 'Commercial investigation', priority: 'High', recommendation: 'Explain certificate requirements, assessment and recognition clearly.' },
  { keyword: 'SEO course online', volume: 2900, difficulty: 39, intent: 'Transactional', priority: 'High', recommendation: 'Create a practical SEO course page with current learning outcomes.' },
  { keyword: 'learn Python online', volume: 4400, difficulty: 46, intent: 'Informational', priority: 'Medium', recommendation: 'Publish a structured learning path with practice exercises.' },
  { keyword: 'social media marketing course', volume: 3600, difficulty: 47, intent: 'Transactional', priority: 'Medium', recommendation: 'Show platform coverage and hands-on campaign assignments.' },
  { keyword: 'data analyst skills', volume: 2400, difficulty: 35, intent: 'Informational', priority: 'Medium', recommendation: 'Create a skills checklist and link it to relevant course modules.' },
  { keyword: 'Python projects for beginners', volume: 1900, difficulty: 31, intent: 'Informational', priority: 'Medium', recommendation: 'Offer guided project walkthroughs with downloadable practice files.' },
  { keyword: 'career development courses', volume: 1600, difficulty: 42, intent: 'Commercial investigation', priority: 'Medium', recommendation: 'Build a career-path hub linking skills, courses and learner stories.' },
  { keyword: 'LearnPro Academy courses', volume: 320, difficulty: 18, intent: 'Navigational', priority: 'Low', recommendation: 'Strengthen branded course navigation and consistent search snippets.' }
];

const intentOrder = ['Informational', 'Navigational', 'Commercial investigation', 'Transactional'];
const priorityOrder = { High: 3, Medium: 2, Low: 1 };
const tbody = document.getElementById('keywordRows');
const searchInput = document.getElementById('keywordSearch');
const intentFilter = document.getElementById('intentFilter');
const priorityFilter = document.getElementById('priorityFilter');
const tableCount = document.getElementById('tableCount');
let sortKey = '';
let sortDirection = 1;

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderKeywords() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedIntent = intentFilter.value;
  const selectedPriority = priorityFilter.value;
  let rows = keywordData.filter((item) => {
    const matchesQuery = `${item.keyword} ${item.recommendation} ${item.intent}`.toLowerCase().includes(query);
    return matchesQuery && (selectedIntent === 'all' || item.intent === selectedIntent) && (selectedPriority === 'all' || item.priority === selectedPriority);
  });

  if (sortKey) {
    rows = [...rows].sort((a, b) => {
      let left = a[sortKey];
      let right = b[sortKey];
      if (sortKey === 'priority') { left = priorityOrder[left]; right = priorityOrder[right]; }
      if (typeof left === 'string') return left.localeCompare(right) * sortDirection;
      return (left - right) * sortDirection;
    });
  }

  tbody.innerHTML = rows.map((item) => {
    const difficultyClass = item.difficulty >= 60 ? 'hard' : item.difficulty >= 40 ? 'mid' : '';
    return `<tr>
      <td><span class="keyword-name">${item.keyword}</span></td>
      <td><span class="volume-value">${item.volume.toLocaleString('en-IN')}</span> <span class="text-muted">/ mo</span></td>
      <td><div class="difficulty-cell"><span>${item.difficulty}</span><span class="difficulty-track"><i class="${difficultyClass}" style="width:${item.difficulty}%"></i></span></div></td>
      <td><span class="intent-badge ${slugify(item.intent)}">${item.intent}</span></td>
      <td><span class="priority-badge ${item.priority.toLowerCase()}">${item.priority}</span></td>
      <td class="recommendation">${item.recommendation}</td>
    </tr>`;
  }).join('');

  tableCount.textContent = `Showing ${rows.length} of ${keywordData.length} keywords`;
}

[searchInput, intentFilter, priorityFilter].forEach((control) => control.addEventListener('input', renderKeywords));

document.querySelectorAll('.sort-button').forEach((button) => {
  button.addEventListener('click', () => {
    const nextKey = button.dataset.sort;
    sortDirection = sortKey === nextKey ? sortDirection * -1 : 1;
    sortKey = nextKey;
    renderKeywords();
    document.querySelectorAll('.sort-button span').forEach((icon) => { icon.textContent = '↕'; });
    button.querySelector('span').textContent = sortDirection === 1 ? '↑' : '↓';
  });
});

document.getElementById('exportCsv').addEventListener('click', () => {
  const headers = ['Keyword', 'Illustrative monthly search volume', 'Illustrative SEO difficulty', 'Search intent', 'Priority', 'Recommendation'];
  const rows = keywordData.map((item) => [item.keyword, item.volume, item.difficulty, item.intent, item.priority, item.recommendation]);
  const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'learnpro-illustrative-keyword-research.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

const mobileMenu = document.getElementById('mobileMenu');
const sidebar = document.getElementById('sidebar');
mobileMenu.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  mobileMenu.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.side-nav a').forEach((link) => link.addEventListener('click', () => {
  sidebar.classList.remove('open');
  mobileMenu.setAttribute('aria-expanded', 'false');
}));

function drawCharts() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color = '#8d95a6';
  const volumeCanvas = document.getElementById('volumeChart');
  if (volumeCanvas) {
    new Chart(volumeCanvas, {
      type: 'bar',
      data: {
        labels: ['Online courses', 'Digital marketing', 'Data analytics', 'Python beginner', 'Courses + certificates', 'Learn Python'],
        datasets: [{ data: [18100, 9900, 8100, 6600, 5400, 4400], backgroundColor: ['#6553cf', '#8171dc', '#9587e5', '#a99deb', '#bcb3ef', '#cec8f4'], borderRadius: 5, maxBarThickness: 27 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw.toLocaleString('en-IN')} illustrative searches / month` } } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 8 }, maxRotation: 28, minRotation: 0 } },
          y: { beginAtZero: true, border: { display: false, dash: [3, 4] }, grid: { color: '#f0f1f5' }, ticks: { font: { size: 8 }, maxTicksLimit: 5, callback: (value) => value >= 1000 ? `${value / 1000}k` : value } }
        }
      }
    });
  }

  const counts = intentOrder.map((intent) => keywordData.filter((item) => item.intent === intent).length);
  const colors = ['#59a897', '#6390cf', '#9179d9', '#e7a15d'];
  const intentCanvas = document.getElementById('intentChart');
  if (intentCanvas) {
    new Chart(intentCanvas, {
      type: 'doughnut',
      data: { labels: intentOrder, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '73%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} keywords` } } } }
    });
  }
  document.getElementById('intentLegend').innerHTML = intentOrder.map((intent, index) => `<div class="chart-key-item"><i style="background:${colors[index]}"></i><span>${intent}</span><b>${counts[index]}</b></div>`).join('');
}

function setActiveNavigation() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.side-nav a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-22% 0px -68% 0px' });
  sections.forEach((section) => observer.observe(section));
}

renderKeywords();
drawCharts();
setActiveNavigation();
