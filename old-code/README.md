# karsenkeithcom

Personal website for www.karsenkeith.com featuring biblical studies and academic articles.

## Features

- **Home Page**: Welcome section with featured articles and popular topics
- **Articles Page**: Browse all articles with search and tag filtering
- **About Page**: Professional background and contact information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Easy Navigation**: Tag-based filtering and search functionality

## Technology

- Pure HTML, CSS, and JavaScript (no dependencies)
- Client-side search and filtering
- Responsive grid layouts
- Modern UI design

## Usage

Simply open `index.html` in a web browser to view the website locally, or deploy the files to any web hosting service.

### Local Development

```bash
# Start a local web server (Python 3)
python3 -m http.server 8080

# Or use any other static file server
# Then visit http://localhost:8080
```

## Structure

- `index.html` - Home page
- `articles.html` - Articles listing with search/filter
- `about.html` - About page
- `style.css` - All styling and responsive design
- `app.js` - JavaScript for search and filtering
- `.gitignore` - Git configuration

## Adding Articles

To add new articles, edit the `articles` array in `app.js`:

```javascript
{
    id: 9,
    title: "Your Article Title",
    date: "2026-02-01",
    excerpt: "Brief description...",
    content: "Full article content...",
    tags: ["Tag1", "Tag2"],
    featured: false
}
```
