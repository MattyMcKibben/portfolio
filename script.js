const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.nav');
const year = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogClose = document.getElementById('dialog-close');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('portfolio-theme', next);
});

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const projects = {
  amukisense: {
    title: 'AMUKISENSE',
    subtitle: 'Aplicación móvil de monitoreo ambiental',
    body: `
      <p>Aplicación Android desarrollada en Kotlin para registrar, consultar y visualizar mediciones ambientales georreferenciadas.</p>
      <ul>
        <li>Captura de ubicación mediante GPS y visualización en Google Maps.</li>
        <li>Autenticación con Firebase y Google Sign-In.</li>
        <li>Persistencia de información y almacenamiento de imágenes con Firebase y Cloudinary.</li>
        <li>Uso local de K-means para agrupamiento y apoyo en la identificación de valores atípicos.</li>
      </ul>
      <div class="tags"><span>Kotlin</span><span>Firebase</span><span>Google Maps SDK</span><span>Cloudinary</span><span>K-means</span></div>
      <div class="dialog-actions">
        <a class="btn btn-outline" href="https://github.com/MattyMcKibben/amukisense" target="_blank" rel="noopener noreferrer">Ver código en GitHub</a>
      </div>
    `
  },
  educatoon: {
    title: 'EDUCATOON',
    subtitle: 'Plataforma web educativa',
    body: `
      <p>Proyecto académico de plataforma tipo aula virtual con perfiles diferenciados para alumno, docente y administrador.</p>
      <ul>
        <li>Gestión de cursos, materiales, tareas y calificaciones.</li>
        <li>Administración de usuarios y roles.</li>
        <li>Foros, asesorías y entregas académicas.</li>
        <li>Arquitectura web con frontend y backend separados.</li>
      </ul>
      <div class="tags"><span>Angular</span><span>Node.js</span><span>SQLite</span><span>REST</span></div>
      <div class="dialog-actions">
        <a class="btn btn-outline" href="https://github.com/MattyMcKibben/Educatoon" target="_blank" rel="noopener noreferrer">Ver código en GitHub</a>
      </div>
    `
  }
};

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const data = projects[button.dataset.project];
    if (!data || !dialog) return;
    dialogContent.innerHTML = `<h2>${data.title}</h2><h3>${data.subtitle}</h3>${data.body}`;
    dialog.showModal();
  });
});

dialogClose?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = encodeURIComponent(`Contacto desde portafolio - ${name}`);
  const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
  window.location.href = `mailto:davidhj1804@gmail.com?subject=${subject}&body=${body}`;
});
