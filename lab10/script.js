document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll(".kateqoriya_btn");
    const cards = document.querySelectorAll(".meqale_qutulari .meqale_qutusu");
    const searchInput = document.getElementById("axtar_alan");
    const resultsCount = document.querySelector('.netice_sayi');
    const articleModal = document.getElementById('articleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalBody = document.getElementById('modalBody');
    const closeModalButton = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('articleModalOverlay');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const readButtons = document.querySelectorAll('.oxu_duymesi, .read-btn');

    let activeCategory = 'Hamısı';
    let searchText = '';

    function updateResultsCount(count) {
        if (resultsCount) {
            resultsCount.textContent = `${count} məqalə tapıldı`;
        }
    }

    function filterCards() {
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.dataset.category || '';
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';

            const matchesCategory = activeCategory === 'Hamısı' || category === activeCategory;
            const matchesSearch = !searchText || title.includes(searchText) || description.includes(searchText);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount += 1;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    function setActiveFilter(categoryName) {
        filterButtons.forEach(btn => {
            btn.classList.toggle('aktiv', btn.textContent.trim() === categoryName);
        });

        activeCategory = categoryName;
        filterCards();
    }
    function openModal(details) {
        if (!articleModal || !modalTitle || !modalMeta || !modalBody) {
            if (details.body) {
                alert(`${details.title}\n\n${details.meta}\n\n${details.body}`);
            } else if (details.href) {
                window.location.href = details.href;
            }
            return;
        }

        modalTitle.textContent = details.title;
        modalMeta.textContent = details.meta;
        modalBody.textContent = details.body;
        articleModal.classList.add('open');
    }

    function closeModal() {
        if (articleModal) {
            articleModal.classList.remove('open');
        }
    }
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setActiveFilter(this.textContent.trim());
            console.log('filter is clicked', this.textContent.trim());
        
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchText = e.target.value.toLowerCase();
            console.log(searchText);
            filterCards();
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryCard = this.closest('.category-card');
            const categoryName = categoryCard?.dataset.category;
            if (categoryName) {
                window.location.href = `index.html?category=${encodeURIComponent(categoryName)}`;
            }
        });
    });

    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            const href = this.dataset.href;
            if (href) {
                window.location.href = href;
                return;
            }

            const closestCard = this.closest('.meqale_qutusu') || this.closest('.card');
            const title = this.dataset.title || closestCard?.querySelector('h3')?.textContent || 'Məqalə';
            const author = this.dataset.author || closestCard?.dataset.author || 'Müəllif';
            const date = this.dataset.date || closestCard?.dataset.date || '';
            const views = this.dataset.views || closestCard?.dataset.views || '';
            const content = this.dataset.content || closestCard?.dataset.content || '';

            openModal({
                title,
                meta: `${author} • ${date} • ${views} baxış`,
                body: content || 'Bu məqalə haqqında daha çox məlumat burada göstəriləcək.',
            });
        });
    });

    closeModalButton && closeModalButton.addEventListener('click', function() {
        articleModal.classList.remove('open');
    });

    modalOverlay && modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            articleModal.classList.remove('open');
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const normalized = categoryParam.trim().toLowerCase();
        const matchingButton = Array.from(filterButtons).find(btn => btn.textContent.trim().toLowerCase() === normalized);
        if (matchingButton) {
            setActiveFilter(matchingButton.textContent.trim());
        }
    } else {
        filterCards();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mesajınız göndərildi, təşəkkürlər!');
            contactForm.reset();
        });
    }

    const primaryBtns = document.querySelectorAll('.primary-btn');
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.trim() === 'Məqalələrə Keç') {
                window.location.href = 'index.html';
            }
        });
    });
});