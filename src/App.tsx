import { useEffect, useState } from "react";
import WishForm from "./components/WishForm";
import WishList from "./components/WishList";
import type { Team, Wish, WishFormValues, TeamsResponse } from "./types";
import "./App.css";

const TEAMS_ENDPOINT = `${import.meta.env.BASE_URL}api/teams.json`;

const fetchTeams = async (signal: AbortSignal): Promise<TeamsResponse> => {
  const response = await fetch(TEAMS_ENDPOINT, { signal });
  if (!response.ok) {
    throw new Error(
      `Teams request failed (${response.status}) for ${TEAMS_ENDPOINT}`
    );
  }
  return (await response.json()) as TeamsResponse;
};

const App = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTeams = async () => {
      try {
        const payload = await fetchTeams(controller.signal);
        const normalizedTeams = payload.leagues.flatMap(
          (league) => league.teams
        );
        setTeams(normalizedTeams);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Failed to load teams", error);
        setTeamsError("Teams konnten nicht geladen werden.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTeams(false);
        }
      }
    };

    loadTeams();

    return () => controller.abort();
  }, []);

  const handleAddWish = (values: WishFormValues) => {
    const timestamp = new Date().toISOString();
    const newWish: Wish = {
      ...values,
      id: timestamp,
      createdAt: timestamp
    };
    setWishes((previous) => [newWish, ...previous]);
  };

  return (
    <main className="app-shell">
      <header>
        <h1>Ligalytics Pairing Planner</h1>
        <p>Create pairing requests for the Alpha League.</p>
      </header>

      <section>
        {isLoadingTeams ? (
          <p>Teams werden geladen…</p>
        ) : teamsError ? (
          <p role="alert">{teamsError}</p>
        ) : (
          <WishForm
            teams={teams}
            onSubmit={(values) => {
              handleAddWish(values);
            }}
          />
        )}
      </section>

      <WishList wishes={wishes} teams={teams} />
    </main>
  );
};

export default App;
