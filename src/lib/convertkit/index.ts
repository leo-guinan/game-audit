/**
 * ConvertKit API integration
 * Docs: https://developers.convertkit.com/#forms
 * 
 * Setup:
 * 1. Get API Key from ConvertKit Settings > Advanced
 * 2. Get Form ID from your form URL or Forms page
 * 3. Create custom fields in ConvertKit (Settings > Custom Fields):
 *    - game_path (Text) - stores the path string
 *    - games_played (Text) - comma-separated game numbers
 *    - last_game_node (Text) - last node they visited
 * 4. Set env vars: CONVERTKIT_API_KEY, CONVERTKIT_FORM_ID
 */

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const CONVERTKIT_API_URL = "https://api.convertkit.com/v3";

export interface ConvertKitSubscriber {
  email: string;
  first_name?: string;
  tags?: number[];
  fields?: Record<string, string | number | boolean>;
}

/**
 * Subscribe an email to ConvertKit form with custom fields
 * Returns subscriber ID on success
 */
export async function subscribeToConvertKit(
  subscriber: ConvertKitSubscriber
): Promise<{ subscriber_id: number } | { error: string }> {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
    console.warn("[ConvertKit] Missing API key or form ID");
    return { error: "ConvertKit not configured" };
  }

  try {
    // ConvertKit form subscribe endpoint
    const url = `${CONVERTKIT_API_URL}/forms/${CONVERTKIT_FORM_ID}/subscribe`;
    const body: Record<string, unknown> = {
      api_key: CONVERTKIT_API_KEY,
      email: subscriber.email,
    };

    if (subscriber.first_name) {
      body.first_name = subscriber.first_name;
    }

    if (subscriber.tags && subscriber.tags.length > 0) {
      body.tags = subscriber.tags;
    }

    // Custom fields (must be created in ConvertKit first)
    if (subscriber.fields && Object.keys(subscriber.fields).length > 0) {
      body.fields = subscriber.fields;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[ConvertKit] Subscribe error:", data);
      return { error: data.error?.message || "Failed to subscribe" };
    }

    const subscriberId = data.subscription?.subscriber?.id ?? 0;
    return { subscriber_id: subscriberId };
  } catch (error) {
    console.error("[ConvertKit] Request error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
