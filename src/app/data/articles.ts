export interface Article {
  id: number;
  title: string;
  slug: string;
  date: string;
  summary: string;
  subtitle?: string;
  tags: string[];
  featured: boolean;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Shepherding God's People as His Representatives",
    slug: 'shepherding-gods-people',
    date: '2026-01-20',
    summary:
      "A biblical survey examining 1 Peter 5:1-4 through the lens of God's shepherding model from Genesis to Revelation.",
    subtitle: 'Biblical Survey for the Exhortation of 1 Peter 5:1-4',
    tags: ['New Testament', 'Old Testament', 'Theology', 'Biblical Theology', 'Exegesis'],
    featured: true
  }
];
