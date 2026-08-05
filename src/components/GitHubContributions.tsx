"use client";

import { useEffect, useState } from "react";

type ContributionLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";

type ContributionCalendar = {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      date: string;
      contributionCount: number;
      contributionLevel: ContributionLevel;
    }>;
  }>;
};

const levelClass: Record<ContributionLevel, string> = {
  NONE: "level-0",
  FIRST_QUARTILE: "level-1",
  SECOND_QUARTILE: "level-2",
  THIRD_QUARTILE: "level-3",
  FOURTH_QUARTILE: "level-4",
};

export default function GitHubContributions() {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github-contributions")
      .then(async (response) => {
        const data = await response.json() as ContributionCalendar & { error?: string };
        if (!response.ok) throw new Error(data.error ?? "Unable to load contributions");
        return data;
      })
      .then(setCalendar)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load contributions"));
  }, []);

  return (
    <section className="github-contributions" aria-labelledby="github-contributions-heading">
      <div className="github-contributions-heading">
        <div>
          <p id="github-contributions-heading">— GitHub contributions</p>
          <a href="https://github.com/loyd000" target="_blank" rel="noreferrer">github.com/loyd000</a>
        </div>
        {calendar && <strong>{calendar.totalContributions.toLocaleString()} contributions</strong>}
      </div>

      <div className="github-calendar-glass">
        {calendar ? (
          <div className="github-calendar-scroll">
            <div
              className="github-calendar-grid"
              style={{
                gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(10px, 1fr))`,
                minWidth: `${calendar.weeks.length * 13 - 3}px`,
              }}
              aria-label={`${calendar.totalContributions} GitHub contributions in the last year`}
            >
              {calendar.weeks.map((week, weekIndex) => (
                <div className="github-calendar-week" key={weekIndex}>
                  {week.contributionDays.map((day) => (
                    <span
                      className={`github-calendar-day ${levelClass[day.contributionLevel]}`}
                      key={day.date}
                      title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <p className="github-calendar-message">{error}</p>
        ) : (
          <div className="github-calendar-loading" aria-label="Loading GitHub contributions" />
        )}
      </div>
    </section>
  );
}
