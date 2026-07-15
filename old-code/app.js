// State management
const allArticles = (() => {
    if (Array.isArray(window.articles)) return window.articles;
    if (typeof articles !== 'undefined' && Array.isArray(articles)) return articles;
    return [];
})();
let filteredArticles = [...allArticles];
let activeFilters = new Set();
let currentSortOrder = 'date-desc'; // Default sort order

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await loadHtmlIncludes();
    setActiveNavLink();

    const currentPage = getCurrentPage();
    
    if (currentPage === 'index') {
        loadFeaturedArticles();
        loadPopularTags();
    } else if (currentPage === 'articles') {
        loadAllTags();
        loadArticles();
        setupSearchAndFilter();
    }
});

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('articles.html')) return 'articles';
    if (path.includes('about.html')) return 'about';
    return 'index';
}

// Load featured articles on home page
function loadFeaturedArticles() {
    const container = document.getElementById('featured-articles');
    if (!container) return;
    
    const featuredArticles = allArticles.filter(article => article.featured);
    
    container.innerHTML = featuredArticles.map(article => `
        <div class="article-card">
            <h4><a href="articles/${article.filename}">${article.title}</a></h4>
            <div class="date">${formatDate(article.date)}</div>
            <div class="excerpt">${article.summary}</div>
            <div class="tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="articles/${article.filename}" class="btn btn-primary" style="margin-top: 1rem;">Read More</a>
        </div>
    `).join('');
}

// Load popular tags on home page
function loadPopularTags() {
    const container = document.getElementById('popular-tags');
    if (!container) return;
    
    const tagCounts = {};
    allArticles.forEach(article => {
        article.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    container.innerHTML = sortedTags.map(([tag, count]) => 
        `<span class="tag" onclick="navigateToTag('${tag}')">${tag} (${count})</span>`
    ).join('');
}

// Navigate to articles page with tag filter
function navigateToTag(tag) {
    window.location.href = `articles.html?tag=${encodeURIComponent(tag)}`;
}

// Load all unique tags for filtering
function loadAllTags() {
    const container = document.getElementById('tag-filter');
    if (!container) return;
    
    const allTags = new Set();
    allArticles.forEach(article => {
        article.tags.forEach(tag => allTags.add(tag));
    });
    
    const sortedTags = Array.from(allTags).sort();
    
    container.innerHTML = sortedTags.map(tag => 
        `<span class="tag" data-tag="${tag}" onclick="toggleTagFilter('${tag}')">${tag}</span>`
    ).join('');
    
    // Check URL parameters for initial tag filter
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    if (tagParam) {
        toggleTagFilter(tagParam);
    }
}

// Load articles on articles page
function loadArticles() {
    const container = document.getElementById('articles-container');
    const noResults = document.getElementById('no-results');
    if (!container) return;
    
    if (filteredArticles.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    noResults.style.display = 'none';
    
    // Sort articles based on current sort order
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        switch (currentSortOrder) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    
    container.innerHTML = sortedArticles.map(article => `
        <div class="article-item">
            <h3><a href="articles/${article.filename}">${article.title}</a></h3>
            <div class="date">${formatDate(article.date)}</div>
            <div class="summary">${article.summary}</div>
            <div class="tags">
                ${article.tags.map(tag => `<span class="tag" onclick="toggleTagFilter('${tag}')">${tag}</span>`).join('')}
            </div>
            <a href="articles/${article.filename}" class="btn btn-primary" style="margin-top: 1rem;">Read Full Article</a>
        </div>
    `).join('');
}

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-filter');
    const sortSelect = document.getElementById('sort-select');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSortOrder = e.target.value;
            loadArticles();
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '' && activeFilters.size === 0) {
        filteredArticles = [...allArticles];
    } else {
        filteredArticles = allArticles.filter(article => {
            // Check tag filters
            if (activeFilters.size > 0) {
                const hasTag = article.tags.some(tag => activeFilters.has(tag));
                if (!hasTag) return false;
            }
            
            // Check search query
            if (query !== '') {
                const titleMatch = article.title.toLowerCase().includes(query);
                const summaryMatch = article.summary.toLowerCase().includes(query);
                const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
                
                return titleMatch || summaryMatch || tagMatch;
            }
            
            return true;
        });
    }
    
    loadArticles();
}

// Toggle tag filter
function toggleTagFilter(tag) {
    const tagElement = document.querySelector(`[data-tag="${tag}"]`);
    
    if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
        if (tagElement) tagElement.classList.remove('active');
    } else {
        activeFilters.add(tag);
        if (tagElement) tagElement.classList.add('active');
    }
    
    performSearch();
}

// Clear all filters
function clearFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    activeFilters.clear();
    
    const tagElements = document.querySelectorAll('.tag-filter .tag');
    tagElements.forEach(tag => tag.classList.remove('active'));
    
    filteredArticles = [...allArticles];
    loadArticles();
}

// Inject reusable HTML fragments
async function loadHtmlIncludes() {
    const includeNodes = document.querySelectorAll('[data-include]');

    await Promise.all(Array.from(includeNodes).map(async (node) => {
        const includePath = node.getAttribute('data-include');
        if (!includePath) return;

        try {
            const response = await fetch(includePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${includePath}: ${response.status}`);
            }
            node.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }));
}

// Apply active class to nav link based on current page
function setActiveNavLink() {
    const page = document.body.getAttribute('data-page');
    if (!page) return;

    const activeLink = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Toggle search filter section
function toggleSearchFilter() {
    const content = document.getElementById('search-filter-content');
    const btn = document.getElementById('show-more-btn');
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        btn.textContent = 'More Filters';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        btn.textContent = 'Less Filters';
    }
}
