# ConvertKit Integration Setup

This app tracks user journeys through the 6 Games and sends path data to ConvertKit when they subscribe.

## Setup Steps

### 1. Get ConvertKit Credentials

1. Go to [ConvertKit Settings > Advanced](https://app.convertkit.com/settings/advanced)
2. Copy your **API Key**
3. Go to your Forms page and note the **Form ID** from the form URL (e.g., `https://app.convertkit.com/forms/123456/` → Form ID is `123456`)

### 2. Create Custom Fields in ConvertKit

Go to [ConvertKit Settings > Custom Fields](https://app.convertkit.com/settings/custom_fields) and create:

- **`game_path`** (Text) - Stores the full path string, e.g., `game1_intro→fork→path_a→core_problem→ending`
- **`games_played`** (Text) - Comma-separated game numbers, e.g., `1,2,3`
- **`last_game_node`** (Text) - Last node visited, e.g., `path_path_a` or `shared_core_problem`
- **`subscription_source`** (Text) - Where they subscribed, e.g., `coordination_game` or `creator_game`

### 3. Set Environment Variables

Add to your `.env.local`:

```bash
CONVERTKIT_API_KEY=your_api_key_here
CONVERTKIT_FORM_ID=your_form_id_here
```

For the Coordination Game newsletter, use one form ID.
For the Creator Game course, you can use a different form ID (update the API route accordingly).

### 4. Test the Integration

1. Navigate through a game (e.g., `/games/1`)
2. Click through some paths
3. Subscribe via the form
4. Check ConvertKit to see the subscriber with custom fields populated

## Path Tracking

The system tracks:
- **Page views**: Each game node (intro, fork, path, shared, ending) is tracked in Fathom
- **Navigation**: Link clicks between nodes are tracked
- **Path string**: Full journey stored in `sessionStorage` and sent to ConvertKit on subscribe

Example path: `game1_intro→fork→path_a→core_problem→cycle→ending`

## Fathom Events

Events tracked:
- `game_{n}_intro`, `game_{n}_fork`, `game_{n}_path_{id}`, `game_{n}_shared_{id}`, `game_{n}_ending`
- `game_{n}_nav_{from}_to_{to}` - navigation between nodes
- `subscribe_attempt_{source}`, `subscribe_success_{source}`, `subscribe_error_{source}`

View in Fathom dashboard to see conversion funnels.
