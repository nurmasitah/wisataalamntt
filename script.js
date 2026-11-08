document.addEventListener("DOMContentLoaded", () => {

    // 1. ANIMASI CUSTOM MOUSE CURSOR TRAIL
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .blog-card, .filter-btn, .info-card-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '35px';
                cursor.style.height = '35px';
                cursor.style.backgroundColor = 'rgba(0, 180, 216, 0.1)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }

    // 2. NAVIGASI ACTIVE HIGHLIGHTER (Updated with Logic from New Code)
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // 3. READING PROGRESS BAR & BACK TO TOP CONTROLLER
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-bar').style.width = scrolled + '%';
        
        const backBtn = document.getElementById("backToTop");
        if (winScroll > 400) { backBtn.style.display = "block"; } else { backBtn.style.display = "none"; }
    });

    document.getElementById("backToTop").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. DARK / LIGHT MODE CONTROLLER
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            themeBtn.innerHTML = '🌙 Mode Gelap';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '☀️ Mode Terang';
        }
    });

    // 5. LIVE SEARCH DI BLOG WISATA
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('searchBlog');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.toLowerCase();
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-title').textContent.toLowerCase();
                if (title.includes(searchValue)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 50);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    }

    // 6. KATEGORI FILTER
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            const selectedCategory = button.getAttribute('data-category');

            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-cat');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 50);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // 7. ANIMASI FADE-IN SCROLL OBSERVER
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Fitur baru: Tambahkan class active untuk mendukung CSS reveal baru jika ada
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    blogCards.forEach(card => cardObserver.observe(card));

    // --- FITUR BARU: 3D TILT EFFECT UNTUK BLOG CARDS ---
    blogCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 12; // Sensitivitas kemiringan
            const rotateY = (centerX - x) / 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
    // --- AKHIR FITUR BARU ---

    // 8. TOMBOL LIKE REAKSI
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const countSpan = this.querySelector('.like-count');
            let count = parseInt(countSpan.textContent);
            if (this.classList.contains('liked')) {
                this.classList.remove('liked'); countSpan.textContent = count - 1; this.style.color = '';
            } else {
                this.classList.add('liked'); countSpan.textContent = count + 1; this.style.color = '#e63946';
            }
        });
    });

    // 9. FORM KONTAK INTEGRATION
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameField = document.getElementById('name');
            const name = nameField ? nameField.value : "Pengunjung";
            showToast(`Terima kasih ${name}, pesan konsultasi wisata Anda terkirim!`);
            contactForm.reset();
        });
    }

    // 10. ANIMASI PENGHITUNG ANGKA STATISTIK (COUNT UP)
    const statsSection = document.getElementById('about-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countStarted = false;

    function startCountUp() {
        statNumbers.forEach(stat => {
            const targetValue = stat.textContent;
            const target = parseFloat(targetValue.replace(/[^\d.]/g, ''));
            const suffix = targetValue.replace(/[\d.]/g, '');
            let current = 0;
            const duration = 2000;
            const stepTime = 30;
            const increment = target / (duration / stepTime);

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = targetValue;
                    clearInterval(counter);
                } else {
                    stat.textContent = (target % 1 !== 0 ? current.toFixed(1) : Math.floor(current)) + suffix;
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countStarted) {
                startCountUp();
                countStarted = true;
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// 11. ENGINE UTILITY UNTUK NOTIFIKASI TOAST & SHARE LINK
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3000);
}

function shareLink(namaWisata) {
    const dummyUrl = window.location.origin + window.location.pathname + "?trip=" + namaWisata.toLowerCase().replace(/\s+/g, '-');
    navigator.clipboard.writeText(dummyUrl).then(() => {
        showToast(`Tautan rute ${namaWisata} berhasil disalin!`);
    });
}