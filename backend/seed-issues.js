// seed-issues.js
// Logs in as an existing user, then POSTs a batch of sample issues
// to the CommunityHub API using the app's real /api/auth/login and
// /api/issues endpoints — no direct DB access needed.
//
// Usage:
//   1. Set API_URL, EMAIL, and PASSWORD below (or via env vars).
//   2. Run: node seed-issues.js
//   Requires Node 18+ (for built-in fetch).

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const EMAIL = process.env.SEED_EMAIL || 'your-test-user@example.com';
const PASSWORD = process.env.SEED_PASSWORD || 'your-password';

const issues = [
    {
        title: 'Broken water pipe on Main Street',
        description: 'Water has been leaking continuously for two days near the market entrance, creating a large puddle and wasting water.'
    },
    {
        title: 'Streetlight out near primary school',
        description: "The streetlight on Church Road, right outside the primary school gate, has been off for over a week. It's unsafe for children walking home after evening classes."
    },
    {
        title: 'Pothole on Kimathi Avenue',
        description: 'A large pothole has formed near the junction with River Road. Several motorbike riders have nearly been thrown off after hitting it at night.'
    },
    {
        title: 'Overflowing drainage near the market',
        description: 'The drainage channel behind the community market is blocked and overflowing whenever it rains, flooding nearby stalls.'
    },
    {
        title: 'Unsecured fence at the community park',
        description: 'Part of the perimeter fence at the community park has collapsed, leaving it open at night and raising security concerns for residents nearby.'
    },
    {
        title: 'No electricity in the eastern block',
        description: 'Households in the eastern residential block have had no power for three days. Neighbors suspect a fault at the local transformer.'
    },
    {
        title: 'Vandalized bus stop shelter',
        description: 'The bus shelter on Independence Road has broken glass panels scattered on the ground, which is a hazard for commuters, especially children.'
    },
    {
        title: 'Stray dogs near the health center',
        description: 'A pack of stray dogs has been gathering near the community health center entrance, making patients and staff uneasy, especially at night.'
    }
];

async function login() {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Login failed: ${data.error || res.statusText}`);
    }
    return data.token;
}

async function createIssue(token, issue) {
    const res = await fetch(`${API_URL}/issues`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(issue)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Failed to create "${issue.title}": ${data.error || data.errors || res.statusText}`);
    }
    return data;
}

async function main() {
    console.log(`Logging in as ${EMAIL}...`);
    const token = await login();
    console.log('Logged in. Seeding issues...\n');

    for (const issue of issues) {
        try {
            const created = await createIssue(token, issue);
            console.log(`✓ Created: ${created.title} (id: ${created._id})`);
        } catch (err) {
            console.error(`✗ ${err.message}`);
        }
    }

    console.log('\nDone.');
}

main().catch((err) => {
    console.error('Seed script failed:', err.message);
    process.exit(1);
});
