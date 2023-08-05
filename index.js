const tabs = document.querySelectorAll("#tabs li");
const update = document.getElementById("update");
const discard = document.getElementById("discard");
let userInput = '';
let previewSection = document.querySelector('#preview');
const user = getUserInput();
let result = markdown(user);

function toggleTabs() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      removeActiveClass();
      tab.classList.add('active');
      const targetId = tab.firstElementChild.getAttribute('href');
      showSection(targetId);
    });
  });
}


function removeActiveClass() {
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
}

function showSection(targetId) {
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    sec.style.display = 'none';
  });
  const targetSection = document.querySelector(targetId);
  targetSection.style.display = 'block';
  if (targetId === '#markdown' && targetSection.querySelector('textarea') === null) {
    addTextArea(targetSection);
  }
}


function addTextArea(section) {
  const textarea = document.createElement('textarea');
  section.appendChild(textarea);
  if (!user) {
    textarea.setAttribute('placeholder', 'Enter your text');
  } else {
    textarea.value = user;
  }
  textarea.addEventListener('input', updateResult);
}


function updateResult(event) {
  userInput = event.target.value;
  result = markdown(userInput);
}

function markdown(text) {
  const replacements = [
    [/^(\d+\.)?\s*###\s*(.*$)/gim, '<h3>$2</h3>'],
      [/^(\d+\.)?\s*##\s*(.*$)/gim, '<h2>$2</h2>'],
      [/^(\d+\.)?\s*#\s*(.*$)/gim, '<h1>$2</h1>'],
      [/^(\d+\.)?\s*-\s*(.*$)/gim, '<li>$2</li>'],
      [/^(\d+\.\s*)?\*\*(.*?)\*\*/g, '<strong>$2</strong>'],
      [/^(\d+\.\s*)?\*(.*?)\*/g, '<em>$2</em>'],
      [/(?:\d+\.\s*)?~~(.*?)~~/g, '<del>$1</del>'],
      [/^(?:\d+\.\s*)?\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'],
      [/^(?:\d+\.\s*)?!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">'],
      [/^`([^`]+)`/gm, '<pre>$1</pre>'],
      [/^> (.*)/gm, '<blockquote>$1</blockquote>'],
      [/^\|(.*?)\|(.*?)\|(.*?)\|/gm, '<table><tr><td>$1</td><td>$2</td><td>$3</td></tr></table>']
    ];
  
    let html = text;
    for (const [pattern, replacement] of replacements) {
      html = html.replace(pattern, replacement);
    }
  
    return html.trim();
  }
  
  
function preview() {
  previewSection.innerHTML = result;
  saveMarkdown();
}

toggleTabs();
update.addEventListener('click', preview);
discard.addEventListener('click', () => {
  userInput = '';
  result = '';
  const textarea = document.querySelector('#markdown textarea');
  textarea.value = '';
  previewSection.innerHTML = '';
  localStorage.clear();
});



function saveMarkdown() {
  localStorage.setItem('userInput', JSON.stringify(userInput));
}


function getUserInput() {
  try {
    const userData = JSON.parse(localStorage.getItem('userInput'));
    return userData || '';
  } catch (error) {
    console.error('Error parsing user input from localStorage:', error);
    return '';
  }
}
