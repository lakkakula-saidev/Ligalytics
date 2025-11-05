import { useState } from "react";
import WishForm from "./components/WishForm";
import WishList from "./components/WishList";
import { TEAMS } from "./data/teams";
import type { Wish, WishFormValues } from "./types";
import "./App.css";

const App = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);

  const handleAddWish = (values: WishFormValues) => {
    const timestamp = new Date().toISOString();
    const newWish: Wish = {
      ...values,
      id: timestamp,
      createdAt: timestamp,
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
        <WishForm
          teams={TEAMS}
          onSubmit={(values) => {
            handleAddWish(values);
          }}
        />
      </section>

      <WishList wishes={wishes} teams={TEAMS} />
    </main>
  );
};

export default App;
