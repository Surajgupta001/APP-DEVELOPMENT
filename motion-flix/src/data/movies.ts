export type CastMember = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
    knownFor: string[];
};

export type Movie = {
    id: string;
    title: string;
    tagline: string;
    synopsis: string;
    year: number;
    runtime: string;
    rating: number;
    match: number;
    ageRating: string;
    genres: string[];
    poster: string;
    backdrop: string;
    trailerStill: string;
    palette: string;
    cast: CastMember[];
    stills: string[];
    reviews: {
        source: string;
        quote: string;
    }[];
};

export const genres = [
    'Sci-Fi',
    'Drama',
    'Mystery',
    'Action',
    'Thriller',
    'Adventure',
    'Animation',
    'Romance',
];

export const cast: CastMember[] = [
    {
        id: 'mira-vale',
        name: 'Mira Vale',
        role: 'Commander Elara',
        avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
        bio: 'A precise, emotionally grounded performer known for quiet intensity and physical sci-fi roles.',
        knownFor: ['The Last Signal', 'Orbital Noon', 'Glass Atlas'],
    },
    {
        id: 'jonas-reed',
        name: 'Jonas Reed',
        role: 'Theo March',
        avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        bio: 'A character actor with a warm screen presence and a gift for making high-concept stories human.',
        knownFor: ['Midnight Circuit', 'Harbor Lights', 'Static Bloom'],
    },
    {
        id: 'naomi-sato',
        name: 'Naomi Sato',
        role: 'Dr. Ives',
        avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        bio: 'A director-performer celebrated for stylized thrillers, restrained dialogue, and bold visual worlds.',
        knownFor: ['Neon Wake', 'Nocturne City', 'The Blue Room'],
    },
    {
        id: 'cal-morgan',
        name: 'Cal Morgan',
        role: 'Ash Venn',
        avatar:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
        bio: 'A kinetic lead with a background in stunt work and a sharp instinct for comic timing.',
        knownFor: ['Rogue Frequency', 'Crash Garden', 'The Ninth Lane'],
    },
    {
        id: 'lena-hart',
        name: 'Lena Hart',
        role: 'June',
        avatar:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
        bio: 'A breakout performer who brings softness and tension to grounded drama and near-future stories.',
        knownFor: ['Paper Moons', 'After the Rain', 'Small Fires'],
    },
];

export const movies: Movie[] = [
    {
        id: 'orbital-noon',
        title: 'Orbital Noon',
        tagline: 'A rescue mission with twelve minutes of daylight.',
        synopsis:
            'When a solar research station slips out of orbit, a grounded commander has one pass of daylight to save the crew and uncover why the station stopped answering Earth.',
        year: 2026,
        runtime: '2h 08m',
        rating: 8.8,
        match: 97,
        ageRating: 'PG-13',
        genres: ['Sci-Fi', 'Drama', 'Thriller'],
        poster:
            'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
        backdrop:
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80',
        trailerStill:
            'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1400&q=80',
        palette: '#53A6FF',
        cast: [cast[0], cast[1], cast[2]],
        stills: [
            'https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80',
        ],
        reviews: [
            { source: 'Frame Weekly', quote: 'Large-scale spectacle with a human pulse.' },
            { source: 'Signal Journal', quote: 'Built for a poster-to-detail transition demo.' },
        ],
    },
    {
        id: 'neon-wake',
        title: 'Neon Wake',
        tagline: 'The city remembers every dream.',
        synopsis:
            'A memory courier wakes inside a city-wide blackout and follows fragments of other people’s dreams through rain, billboards, and a conspiracy she helped design.',
        year: 2025,
        runtime: '1h 54m',
        rating: 8.4,
        match: 94,
        ageRating: 'R',
        genres: ['Mystery', 'Thriller', 'Sci-Fi'],
        poster:
            'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
        backdrop:
            'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80',
        trailerStill:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
        palette: '#FF4FA3',
        cast: [cast[2], cast[4], cast[3]],
        stills: [
            'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1520975682031-a4c43c581425?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        ],
        reviews: [
            { source: 'Night Edit', quote: 'A noir machine with a romantic bruise.' },
            { source: 'Motion Desk', quote: 'Perfect for search, drawer, and neon-sheet UI moments.' },
        ],
    },
    {
        id: 'paper-moons',
        title: 'Paper Moons',
        tagline: 'A summer, a secret, and a theater that should be closed.',
        synopsis:
            'Three friends reopen an abandoned coastal cinema and accidentally screen a film that changes every night, forcing them to choose between nostalgia and truth.',
        year: 2024,
        runtime: '1h 47m',
        rating: 7.9,
        match: 91,
        ageRating: 'PG',
        genres: ['Drama', 'Romance', 'Adventure'],
        poster:
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
        backdrop:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        trailerStill:
            'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1400&q=80',
        palette: '#F6C85F',
        cast: [cast[4], cast[1], cast[0]],
        stills: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        ],
        reviews: [
            { source: 'Sunday Reel', quote: 'Tender without becoming sleepy.' },
            { source: 'Coastline Review', quote: 'A warm, nostalgic crowd-pleaser with beautiful coastal contrast.' },
        ],
    },
    {
        id: 'rogue-frequency',
        title: 'Rogue Frequency',
        tagline: 'One pirate broadcast can start a revolution.',
        synopsis:
            'A disgraced sound engineer discovers a hidden radio band that can disable autonomous weapons, then races across the city before the signal collapses.',
        year: 2026,
        runtime: '2h 01m',
        rating: 8.1,
        match: 89,
        ageRating: 'PG-13',
        genres: ['Action', 'Thriller'],
        poster:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
        backdrop:
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80',
        trailerStill:
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
        palette: '#FF6B4A',
        cast: [cast[3], cast[2], cast[1]],
        stills: [
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=1200&q=80',
        ],
        reviews: [
            { source: 'Pulse Cut', quote: 'Lean, loud, and refreshingly direct.' },
            { source: 'The Action Ledger', quote: 'A natural home for fast trailer gestures.' },
        ],
    },
    {
        id: 'glass-atlas',
        title: 'Glass Atlas',
        tagline: 'Every map is a confession.',
        synopsis:
            'An archivist finds a living atlas that redraws itself around the lies people tell, sending her into a mountain city built from impossible geography.',
        year: 2025,
        runtime: '1h 58m',
        rating: 8.6,
        match: 93,
        ageRating: 'PG-13',
        genres: ['Adventure', 'Mystery', 'Drama'],
        poster:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        backdrop:
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
        trailerStill:
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
        palette: '#7ED957',
        cast: [cast[0], cast[4], cast[2]],
        stills: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        ],
        reviews: [
            { source: 'Atlas Notes', quote: 'Big images, clean cards, and generous room for motion.' },
            { source: 'Festival Daily', quote: 'The sort of adventure UI people want to tap through.' },
        ],
    },
];

export const featuredMovies = [movies[2], movies[0], movies[1]];
export const continueWatching = [movies[1], movies[3], movies[0]];
export const trailerQueue = [movies[3], movies[0], movies[1], movies[4], movies[2]];

export function getMovie(id: string | string[] | undefined) {
    const normalized = Array.isArray(id) ? id[0] : id;
    return movies.find((movie) => movie.id === normalized) ?? movies[0];
}

export function getPerson(id: string | string[] | undefined) {
    const normalized = Array.isArray(id) ? id[0] : id;
    return cast.find((member) => member.id === normalized) ?? cast[0];
}