export interface RoadmapItem {
    id: string
    title: string
    description: string
    date: string // ISO string
}

export const issues = [
    'drag n drop flickers after dropping. Item goes back to original position for a split second before settling in the new position',
    'drag n drop dropzone not good enough']

export const roadmapData = {
    completed: [
        {
            id: "1",
            title: "SMS Integration",
            description: "Save bookmarks instantly via SMS messaging",
            date: "2024-11-10"
        },
        {
            id: "2",
            title: "Basic Bookmark Management",
            description: "Create, organize, and delete bookmarks through the web interface",
            date: "2024-11-10"
        },
        {
            id: "3",
            title: "Platform Stats",
            description: "Added real-time stats showing users and bookmarks on frontpage",
            date: "2024-11-10"
        },
        {
            id: "4",
            title: "Product Roadmap",
            description: "Public roadmap and changelog on frontpage for transparency",
            date: "2024-11-10"
        },
        {
            id: "5",
            title: "Theme Refactor & Categories",
            description: "Refactored theme system and started work on bookmark categories",
            date: "2024-11-10"
        },
        {
            id: "6",
            title: "Advanced Categories & Collections",
            description: "Hierarchical categories and improved collection management",
            date: "2024-11-10"
        },
        {
            id: "7",
            title: "Drag & Drop Interface",
            description: "Intuitive drag & drop for organizing bookmarks and categories",
            date: "2024-11-10"
        },
        {
            id: "8",
            title: "Analytics & View Counter",
            description: "Track bookmark popularity and usage with view statistics",
            date: "2024-11-10"
        }
    ],
    inProgress: [
        {
            id: "9",
            title: "Browser Extension",
            description: "Save bookmarks directly from your browser",
            date: "2024-11-11"
        }
    ],
    planned: [
        {
            id: "10",
            title: "AI-Powered Summaries",
            description: "Automatic content summarization for saved bookmarks",
            date: "2024-11-12"
        },
        {
            id: "11",
            title: "Advanced Search & Filters",
            description: "Full-text search and advanced filtering options",
            date: "2024-11-12"
        },
        {
            id: "12",
            title: "Bookmark Sharing",
            description: "Share bookmarks with others",
            date: "2024-11-12"
        },
        {
            id: "13",
            title: "Category subscriptions",
            description: "Subscribe to peoples categories, perhaps get a daily email with new bookmarks?",
            date: "2024-11-12"
        },
        {
            id: "14",
            title: "Bookmark comments",
            description: "Add comments to bookmarks",
            date: "2024-11-12"
        },
        {
            id: "15",
            title: "Bookmark ratings",
            description: "Rate bookmarks",
            date: "2024-11-12"
        },
        {
            id: "16",
            title: "Category ratings",
            description: "Rate categories",
            date: "2024-11-12"
        },
        {
            id: "17",
            title: "Paid subscriptions?",
            description: "Add paid subscriptions for advanced features, paid 'readlists' maybe?",
            date: "2024-11-12"
        },
        {
            id: "18",
            title: "Submit bookmark by email",
            description: "Submit a bookmark by sending an email to a special address",
            date: "2024-11-12"
        }
    ]
} as const 