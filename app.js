// Sample articles data structure
// In a real application, this would come from a database or API
const articles = [
    {
        id: 1,
        title: "The Historical Context of the Exodus",
        date: "2026-01-15",
        excerpt: "An exploration of the archaeological and historical evidence surrounding the Exodus narrative.",
        content: "The Exodus narrative represents one of the most significant events in biblical history. This article examines the archaeological evidence, historical context, and scholarly debates surrounding the dating and historicity of the Exodus. We'll explore Egyptian records, archaeological findings, and comparative ancient Near Eastern texts to better understand this pivotal event.",
        tags: ["Old Testament", "History", "Archaeology", "Exodus"],
        featured: true
    },
    {
        id: 2,
        title: "Understanding Greek Verb Tenses in the New Testament",
        date: "2026-01-10",
        excerpt: "A comprehensive guide to Greek verb tenses and their theological implications.",
        content: "The Greek language of the New Testament contains nuanced verb tenses that often carry significant theological meaning. This article explores the aorist, present, perfect, and other tenses, demonstrating how understanding these grammatical features can enhance our interpretation of Scripture. We'll examine specific examples from the Gospels and Pauline epistles.",
        tags: ["New Testament", "Greek", "Language", "Exegesis"],
        featured: true
    },
    {
        id: 3,
        title: "Covenant Theology in the Old Testament",
        date: "2026-01-05",
        excerpt: "An analysis of the major covenants throughout the Hebrew Bible.",
        content: "The concept of covenant is central to understanding Old Testament theology. This article examines the Abrahamic, Mosaic, Davidic, and New Covenants, exploring their structure, conditions, and theological significance. We'll consider how these covenants relate to one another and their fulfillment in the biblical narrative.",
        tags: ["Old Testament", "Theology", "Covenant", "Biblical Theology"],
        featured: true
    },
    {
        id: 4,
        title: "The Pauline Concept of Justification",
        date: "2025-12-20",
        excerpt: "Examining Paul's teaching on justification by faith in Romans and Galatians.",
        content: "Justification by faith is a cornerstone of Pauline theology. This article provides an in-depth analysis of Paul's teaching in Romans and Galatians, examining the Greek terminology, theological framework, and implications for Christian doctrine. We'll also consider the historical debates and various interpretative approaches.",
        tags: ["New Testament", "Paul", "Theology", "Soteriology"],
        featured: false
    },
    {
        id: 5,
        title: "Messianic Prophecies in Isaiah",
        date: "2025-12-15",
        excerpt: "A study of the messianic passages in the book of Isaiah.",
        content: "The book of Isaiah contains numerous passages traditionally interpreted as messianic prophecies. This article examines key texts such as Isaiah 7:14, 9:6-7, 53, and others, considering both their original historical context and their New Testament interpretation. We'll explore the criteria for identifying messianic prophecy and the hermeneutical principles involved.",
        tags: ["Old Testament", "Prophecy", "Messiah", "Isaiah"],
        featured: false
    },
    {
        id: 6,
        title: "The Documentary Hypothesis: An Overview",
        date: "2025-12-01",
        excerpt: "Understanding source criticism and the composition of the Pentateuch.",
        content: "The Documentary Hypothesis proposes that the Pentateuch was composed from multiple source documents. This article provides an overview of the theory, examining the proposed sources (J, E, D, P), the evidence cited in its support, and critical responses. We'll consider both traditional and modern approaches to Pentateuchal composition.",
        tags: ["Old Testament", "Critical Studies", "Pentateuch", "Scholarship"],
        featured: false
    },
    {
        id: 7,
        title: "Jesus' Parables: Literary and Theological Analysis",
        date: "2025-11-25",
        excerpt: "Examining the literary structure and theological message of Jesus' parables.",
        content: "The parables of Jesus are masterful teaching tools that convey profound spiritual truths. This article analyzes the literary features of parables, including their structure, metaphorical language, and rhetorical purpose. We'll examine several key parables and explore various interpretive methods.",
        tags: ["New Testament", "Gospels", "Jesus", "Parables"],
        featured: false
    },
    {
        id: 8,
        title: "The Temple in Ancient Israel",
        date: "2025-11-20",
        excerpt: "Archaeological and biblical perspectives on Solomon's Temple and the Second Temple.",
        content: "The Temple in Jerusalem served as the central place of worship in ancient Israel. This article examines the biblical descriptions, archaeological evidence, and historical records related to Solomon's Temple and the Second Temple. We'll explore the Temple's architecture, rituals, and theological significance.",
        tags: ["Old Testament", "History", "Archaeology", "Temple", "Worship"],
        featured: false
    }
];

// State management
let filteredArticles = [...articles];
let activeFilters = new Set();

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
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
    
    const featuredArticles = articles.filter(article => article.featured);
    
    container.innerHTML = featuredArticles.map(article => `
        <div class="article-card">
            <h4>${article.title}</h4>
            <div class="date">${formatDate(article.date)}</div>
            <div class="excerpt">${article.excerpt}</div>
            <div class="tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Load popular tags on home page
function loadPopularTags() {
    const container = document.getElementById('popular-tags');
    if (!container) return;
    
    const tagCounts = {};
    articles.forEach(article => {
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
    articles.forEach(article => {
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
    
    // Sort articles by date (newest first)
    const sortedArticles = [...filteredArticles].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedArticles.map(article => `
        <div class="article-item">
            <h3>${article.title}</h3>
            <div class="date">${formatDate(article.date)}</div>
            <div class="content">${article.content}</div>
            <div class="tags">
                ${article.tags.map(tag => `<span class="tag" onclick="toggleTagFilter('${tag}')">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-filter');
    
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
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '' && activeFilters.size === 0) {
        filteredArticles = [...articles];
    } else {
        filteredArticles = articles.filter(article => {
            // Check tag filters
            if (activeFilters.size > 0) {
                const hasTag = article.tags.some(tag => activeFilters.has(tag));
                if (!hasTag) return false;
            }
            
            // Check search query
            if (query !== '') {
                const titleMatch = article.title.toLowerCase().includes(query);
                const contentMatch = article.content.toLowerCase().includes(query);
                const excerptMatch = article.excerpt.toLowerCase().includes(query);
                const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
                
                return titleMatch || contentMatch || excerptMatch || tagMatch;
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
    
    filteredArticles = [...articles];
    loadArticles();
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
