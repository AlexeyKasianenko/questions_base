export interface Question {
    id: number;
    title: string;
    body: string;
    category: Category;
    rank: Rank;
}

export enum Rank {
    Junior = 'Junior',
    Middle = 'Middle',
    Senior = 'Senior'
}

export enum Category {
    General = 'General questions',
    Git = 'Git',
    Ruby = 'Ruby',
    Rails = 'Ruby on Rails',
    ActiveRecord = 'ActiveRecord',
    Security = 'Security',
    RelationalDatabases = 'Relational databases',
    SQL = 'SQL',
    SQLIndexes = 'SQL indexes',
    PostgreSQL = 'PostgreSQL',
    NoSQL = 'NoSQL',
    StaticCodeAnalysis = 'Static code analysis',
    Testing = 'Testing',
    DevOps = 'DevOps',
    Monitoring = 'Monitoring',
    WebToolsRuby = 'Web tools Ruby',
    DomainDrivenDesign = 'Domain-Driven Design',
    Databases = 'Databases',
    Redis = 'Redis',
    Elasticsearch = 'Elasticsearch',
    Metaprogramming = 'Metaprogramming'
}
