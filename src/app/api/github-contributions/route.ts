const GITHUB_USERNAME = "loyd000";

type GitHubResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export const revalidate = 3600;

export async function GET() {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  const token = process.env.GITHUB_TOKEN;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "loyd000-portfolio",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: `
        query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: GITHUB_USERNAME,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    next: { revalidate },
  });

  const result = (await response.json()) as GitHubResponse;
  const calendar = result.data?.user?.contributionsCollection.contributionCalendar;

  if (!response.ok || result.errors || !calendar) {
    return Response.json(
      { error: token ? "GitHub contributions could not be loaded." : "Add GITHUB_TOKEN to include GitHub contributions." },
      { status: 502 },
    );
  }

  return Response.json(calendar, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
