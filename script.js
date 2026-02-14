/* ===================================
   GALAXY CAROUSEL 3D - JAVASCRIPT
   Para Vero y Nuestro Thiago
   =================================== */

const galaxy = document.getElementById('galaxy');
const photoCount = 9;

// Rutas de las fotos del album
const photoSources = [
    'ALBUN DE FOTOS/PEDIDADEMANO.jpg',
    'ALBUN DE FOTOS/juntoamihijo.jpeg',
    'ALBUN DE FOTOS/juntos.jpg',
    'ALBUN DE FOTOS/juntos09deabri.jpg',
    'ALBUN DE FOTOS/juntos1.jpg',
    'ALBUN DE FOTOS/juntos2.jpg',
    'ALBUN DE FOTOS/juntossiempre.jpeg',
    'ALBUN DE FOTOS/miamorembarazada.jpeg',
    'ALBUN DE FOTOS/yoymibebe.jpeg'
];

// Utilidades
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

/* ===================================
   CREAR ESTRELLAS (POLVO COSMICO)
   =================================== */
// Ajustar cantidad de estrellas segun dispositivo
const isMobile = window.innerWidth <= 768;
const starCount = isMobile ? 200 : 600;
const maxStarRadius = isMobile ? 600 : 1000;

console.log('Generando', starCount, 'estrellas...');

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Tipo de estrella: 60% tiny, 30% medium, 10% bright
    const rand = Math.random();
    let type, size;

    if (rand > 0.90) {
        type = 'bright';
        size = random(3, 4.5);
    } else if (rand > 0.60) {
        type = 'medium';
        size = random(1.5, 3);
    } else {
        type = 'tiny';
        size = 1;
    }

    star.classList.add(type);

    // Distribucion esferica
    const radius = random(100, maxStarRadius);
    const angle = random(0, 360);
    const height = random(-200, 200);
    const x = radius * Math.cos(toRadians(angle));
    const z = radius * Math.sin(toRadians(angle));

    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // Colores realistas
    if (type === 'bright') {
        const colors = ['#fff', '#e0f7fa', '#fff5e6'];
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    } else {
        star.style.backgroundColor = '#fff';
        star.style.opacity = type === 'tiny' ? random(0.2, 0.5) : random(0.6, 0.9);
    }

    star.style.transform = `translate3d(${x}px, ${height}px, ${z}px)`;

    // Animacion individual
    const duration = random(2, 6);
    const delay = random(0, 5);
    star.style.animation = type === 'bright'
        ? `pulseBright ${duration}s infinite alternate ${delay}s`
        : `twinkle ${duration}s infinite alternate ${delay}s`;

    galaxy.appendChild(star);
}

console.log('Estrellas creadas');

/* ===================================
   CREAR LAS FOTOS (PLANETAS)
   =================================== */
const angleStep = 360 / photoCount;

photoSources.forEach((src, index) => {
    const photo = document.createElement('div');
    photo.classList.add('photo-card');
    photo.style.backgroundImage = `url('${src}')`;

    // Posicion 3D - Adaptativo segun dispositivo (Compacto en movil)
    const baseRadius = isMobile ? 340 : 500;
    const variation = isMobile ? 40 : 80;
    
    // Radio responsivo: mas compacto en moviles
    const radius = baseRadius + random(-variation, variation);
    const angle = angleStep * index + random(-15, 15);
    const height = random(-100, 100);
    const x = radius * Math.cos(toRadians(angle));
    const z = radius * Math.sin(toRadians(angle));

     // CSS Custom Properties para composicion de transforms
    photo.style.setProperty('--x', `${x}px`);
    photo.style.setProperty('--y', `${height}px`);
    photo.style.setProperty('--z', `${z}px`);
    photo.style.setProperty('--rotY', `${-angle}deg`);
    photo.style.transform = `translate3d(var(--x), var(--y), var(--z)) rotateY(var(--rotY))`;

    // Desktop: Hover para pausar galaxia + zoom
    photo.addEventListener('mouseenter', () => {
        galaxy.style.animationPlayState = 'paused';
        photo.classList.add('photo-hovered');
        photo.style.zIndex = '1000';
    });

    photo.addEventListener('mouseleave', () => {
        galaxy.style.animationPlayState = 'running';
        photo.classList.remove('photo-hovered');
        photo.style.zIndex = 'auto';
    });

    // Mobile: Touch para pausar galaxia + zoom
    photo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        // Cerrar cualquier otra foto abierta
        document.querySelectorAll('.photo-hovered').forEach(p => {
            p.classList.remove('photo-hovered');
            p.style.zIndex = 'auto';
        });
        galaxy.style.animationPlayState = 'paused';
        photo.classList.add('photo-hovered');
        photo.style.zIndex = '1000';
    }, { passive: false });

    photo.addEventListener('touchend', () => {
        setTimeout(() => {
            galaxy.style.animationPlayState = 'running';
            photo.classList.remove('photo-hovered');
            photo.style.zIndex = 'auto';
        }, 1500); // Mantener zoom 1.5s despues de soltar
    });

    galaxy.appendChild(photo);
});

// Cerrar zoom al tocar fuera de una foto (mobile)
document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.photo-card')) {
        document.querySelectorAll('.photo-hovered').forEach(p => {
            p.classList.remove('photo-hovered');
            p.style.zIndex = 'auto';
        });
        galaxy.style.animationPlayState = 'running';
    }
});

console.log('Galaxia 3D completa');

/* ===================================
   PERFORMANCE & ACCESIBILIDAD
   =================================== */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    galaxy.style.animation = 'none';
}

