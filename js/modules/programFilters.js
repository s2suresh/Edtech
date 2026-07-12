export function initProgramFilters() {
    const courseSearch = document.getElementById('courseSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    if (!courseSearch || !filterButtons.length || !programCards.length) {
        return;
    }

    const filterPrograms = () => {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const query = courseSearch.value.trim().toLowerCase();

        programCards.forEach((card) => {
            const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
            const searchableText = `${card.dataset.title} ${card.textContent}`.toLowerCase();
            const matchesSearch = !query || searchableText.includes(query);

            card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            filterPrograms();
        });
    });

    courseSearch.addEventListener('input', filterPrograms);
}
