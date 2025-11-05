import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { RuleKey, Team, Wish } from "../types";

interface WishListProps {
  wishes: Wish[];
  teams: Team[];
}

const RULE_LABELS: Record<RuleKey, string> = {
  "same-day-home": "Same day home",
  "same-weekend-home": "Same weekend home",
  "not-same-day-home": "Not same day home",
  "not-same-weekend-home": "Not same weekend home",
};

const WishList = ({ wishes, teams }: WishListProps) => {
  const teamNameById = new Map(teams.map((team) => [team.id, team.name]));

  if (wishes.length === 0) {
    return (
      <section>
        <Typography variant="h2" gutterBottom>
          Saved Preferences
        </Typography>
        <Typography variant="body1">
          No pairing requests have been created yet.
        </Typography>
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h2" gutterBottom>
        Saved Preferences
      </Typography>
      <Stack spacing={2}>
        {wishes.map((wish) => {
          const teamALabel = teamNameById.get(wish.teamA) ?? wish.teamA;
          const teamBLabel = teamNameById.get(wish.teamB) ?? wish.teamB;

          return (
            <Card key={wish.id} variant="outlined">
              <CardHeader
                title={`${teamALabel} vs ${teamBLabel}`}
                subheader={`${wish.startDate} – ${wish.endDate}`}
              />
              <Divider />
              <CardContent>
                <Stack spacing={1.5} component="dl">
                  <Detail title="Rule" value={RULE_LABELS[wish.rule]} />
                  <Detail title="Comments" value={wish.comment || "—"} />
                  <Detail
                    title="Created at"
                    value={new Date(wish.createdAt).toLocaleString("de-DE")}
                  />
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </section>
  );
};

interface DetailProps {
  title: string;
  value: string;
}

const Detail = ({ title, value }: DetailProps) => (
  <Stack spacing={0.25}>
    <Typography variant="subtitle2" component="dt">
      {title}
    </Typography>
    <Typography variant="body1" component="dd">
      {value}
    </Typography>
  </Stack>
);

export default WishList;
