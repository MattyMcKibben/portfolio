const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.nav');
const year = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogClose = document.getElementById('dialog-close');
const hero = document.getElementById('inicio');
const networkCanvas = document.getElementById('hero-network');

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

if (hero && networkCanvas) {
  const context = networkCanvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let nodes = [];
  let width = 0;
  let height = 0;
  let frameId = 0;

  const makeNodes = () => {
    const count = Math.max(22, Math.min(48, Math.round(width / 28)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.15 + 1
    }));
  };

  const drawNetwork = () => {
    context.clearRect(0, 0, width, height);
    const connectionDistance = Math.min(145, width * 0.18);

    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];

      for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
        const nextNode = nodes[nextIndex];
        const distance = Math.hypot(node.x - nextNode.x, node.y - nextNode.y);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.24;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(nextNode.x, nextNode.y);
          context.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }

      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(6, 182, 212, 0.58)';
      context.fill();
    }
  };

  const animateNetwork = () => {
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -8) node.x = width + 8;
      if (node.x > width + 8) node.x = -8;
      if (node.y < -8) node.y = height + 8;
      if (node.y > height + 8) node.y = -8;
    });

    drawNetwork();
    frameId = window.requestAnimationFrame(animateNetwork);
  };

  const updateAnimation = () => {
    window.cancelAnimationFrame(frameId);
    drawNetwork();

    if (!reduceMotion.matches && !document.hidden) {
      frameId = window.requestAnimationFrame(animateNetwork);
    }
  };

  const resizeNetwork = () => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    networkCanvas.width = Math.round(width * pixelRatio);
    networkCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    makeNodes();
    updateAnimation();
  };

  const resizeObserver = new ResizeObserver(resizeNetwork);
  resizeObserver.observe(hero);
  reduceMotion.addEventListener('change', updateAnimation);
  document.addEventListener('visibilitychange', updateAnimation);
}

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
