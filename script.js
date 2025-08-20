const html = document.documentElement;
const darkIcon = document.getElementById('dark-icon');
const lightIcon = document.getElementById('light-icon');
const lightNav = document.getElementById('light-nav');
const darkNav = document.getElementById('dark-nav');

let extensionsData = [];
let currentFilter = 'all';

function applyThemeUi(theme) {
  const isDark = theme === 'dark';
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  // Toggle header icons
  darkIcon.classList.toggle('hidden', isDark);
  lightIcon.classList.toggle('hidden', !isDark);
  // Toggle nav logos
  darkNav.classList.toggle('hidden', !isDark);
  lightNav.classList.toggle('hidden', isDark);
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyThemeUi(theme);
}

(function initTheme() {
  const stored = localStorage.getItem('theme');
  let theme = stored;
  if (!theme) {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyThemeUi(theme);
})();

lightIcon.addEventListener('click', () => setTheme('light'));

darkIcon.addEventListener('click', () => setTheme('dark'));

function renderList() {
  const container = document.getElementById('tools-container');
  if (!container) return;
  container.innerHTML = '';

  const shouldShow = (tool) => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return tool.isActive === true;
    if (currentFilter === 'inactive') return tool.isActive === false;
    return true;
  };

  extensionsData.forEach((tool, index) => {
    if (!shouldShow(tool)) return;

    const section = document.createElement('section');
    section.className = "bg-[hsl(200,60%,99%)] dark:bg-[hsl(226,25%,17%)] rounded-3xl px-8 border border-[1px] border-[hsl(0,0%,78%)] dark:border-[hsl(226,11%,37%)] ";

    // Initial toggle state
    const iconOnClass = tool.isActive ? "" : "hidden";
    const iconOffClass = tool.isActive ? "hidden" : "";

    section.innerHTML = `
      <div class="flex flex-row items-center">
        <img src="${tool.logo}">
        <div class="ml-5">
          <h1 class="text-[20px] dark:text-[hsl(200,60%,99%)] py-6 pb-1 font-bold ">${tool.name}</h1>
          <p class="text-[17px] dark:text-[hsl(0,0%,78%)] font-light">${tool.description}</p>
        </div>
      </div>
      <div class="flex flex-row justify-between py-8">
        <p class="bg-[hsl(200,60%,99%)] font-normal border border-[1px] border-[hsl(0,0%,78%)] hover:bg-[hsl(217,61%,90%)] text-3xl p-10 rounded-full w-40 h-4 flex justify-center items-center cursor-pointer dark:bg-[hsl(226,25%,17%)] dark:text-[hsl(200,60%,99%)] dark:hover:bg-[hsl(3,77%,44%)] dark:hover:text-[hsl(227,75%,14%)] remove-btn" data-index="${index}">Remove</p>
        <button class="toggle-btn cursor-pointer" data-index="${index}">
          <svg class="icon-on ${iconOnClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="red" width="40px" height="40px">
            <path d="M224 128C118 128 32 214 32 320C32 426 118 512 224 512L416 512C522 512 608 426 608 320C608 214 522 128 416 128L224 128zM416 224C469 224 512 267 512 320C512 373 469 416 416 416C363 416 320 373 320 320C320 267 363 224 416 224z"/>
          </svg>
          <svg class="icon-off ${iconOffClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="hsl(217,61%,90%)"height="40px" width="40px">
            <path d="M416 192C486.7 192 544 249.3 544 320C544 390.7 486.7 448 416 448L224 448C153.3 448 96 390.7 96 320C96 249.3 153.3 192 224 192L416 192zM608 320C608 214 522 128 416 128L224 128C118 128 32 214 32 320C32 426 118 512 224 512L416 512C522 512 608 426 608 320zM224 400C268.2 400 304 364.2 304 320C304 275.8 268.2 240 224 240C179.8 240 144 275.8 144 320C144 364.2 179.8 400 224 400z"/>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(section);
  });

  container.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      if (Number.isNaN(index)) return;
      extensionsData[index].isActive = !extensionsData[index].isActive;
      renderList();
    });
  });

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      if (Number.isNaN(index)) return;
      extensionsData.splice(index, 1);
      renderList();
    });
  });
}

function setupFilterControls() {
  const allBtn = document.getElementById('all');
  const activeBtn = document.getElementById('active');
  const inactiveBtn = document.getElementById('inactive');

  if (allBtn) allBtn.addEventListener('click', () => { currentFilter = 'all'; renderList(); });
  if (activeBtn) activeBtn.addEventListener('click', () => { currentFilter = 'active'; renderList(); });
  if (inactiveBtn) inactiveBtn.addEventListener('click', () => { currentFilter = 'inactive'; renderList(); });
}

async function loadData() {
  const response = await fetch('data.json');
  const data = await response.json();

  extensionsData = data;
  setupFilterControls();
  renderList();
}


document.addEventListener("DOMContentLoaded", loadData);
