import { useEffect, useMemo, useState } from "react";
import { inr } from "../../lib/affordability";

const CATEGORIES = [
  { key: "monthly_rent", label: "Rent", color: "#6366f1" },
  { key: "food_expense", label: "Food", color: "#f59e0b" },
  { key: "transport", label: "Transport", color: "#0ea5e9" },
  { key: "utilities", label: "Utilities", color: "#10b981" },
  { key: "miscellaneous", label: "Misc", color: "#ec4899" },
  { key: "other", label: "Other", color: "#94a3b8" },
];

const DISPLAY = { Bengalore: "Bengaluru" };

function cityName(city) {
  return DISPLAY[city.city] || city.city;
}

function StackedBar({ city, maxTotal }) {
  return (
    <div className="studio-bar" role="img" aria-label={`${cityName(city)} monthly costs, ${inr(city.total_expense)}`}>
      {CATEGORIES.map((category) => {
        const value = Number(city[category.key]) || 0;
        const width = maxTotal > 0 ? (value / maxTotal) * 100 : 0;
        return <i key={category.key} style={{ width: `${width}%`, background: category.color }} />;
      })}
    </div>
  );
}

export default function CityCompare() {
  const [cities, setCities] = useState([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/citydata.json")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setCities(data);
        setLeft(data.find((city) => city.city === "Pune")?.city || data[0]?.city || "");
        setRight(data.find((city) => city.city === "Bengalore")?.city || data[1]?.city || "");
      })
      .catch((error) => console.error("Error loading city data:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  const pair = useMemo(() => {
    const a = cities.find((city) => city.city === left);
    const b = cities.find((city) => city.city === right);
    return [a, b].filter(Boolean);
  }, [cities, left, right]);

  const maxTotal = Math.max(...pair.map((city) => Number(city.total_expense) || 0), 1);
  const gap = pair.length === 2
    ? Number(pair[1].total_expense) - Number(pair[0].total_expense)
    : 0;

  return (
    <section className="studio-hero">
      <p className="studio-kicker">Cost of living</p>
      <h2 className="studio-section-title">Is moving worth it? Compare two cities</h2>
      <p className="studio-lead">
        Monthly costs from the city catalogue. Figures are estimates, not a quote from a landlord.
      </p>
      <div className="studio-row">
        <label className="studio-field">
          <span>First city</span>
          <select value={left} onChange={(event) => setLeft(event.target.value)}>
            {cities.map((city) => <option key={city.city} value={city.city}>{cityName(city)}</option>)}
          </select>
        </label>
        <label className="studio-field">
          <span>Second city</span>
          <select value={right} onChange={(event) => setRight(event.target.value)}>
            {cities.map((city) => <option key={city.city} value={city.city}>{cityName(city)}</option>)}
          </select>
        </label>
      </div>

      <div className="studio-compare" style={{ marginTop: 20 }}>
        {pair.map((city) => (
          <article key={city.city}>
            <h3 style={{ margin: "0 0 8px" }}>{cityName(city)}</h3>
            <StackedBar city={city} maxTotal={maxTotal} />
            <p className="studio-note">{inr(city.total_expense)} / month, all categories</p>
            <ul className="studio-legend">
              {CATEGORIES.map((category) => (
                <li key={category.key}>
                  <span className="studio-swatch" style={{ background: category.color }} />
                  {category.label} {inr(city[category.key])}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {pair.length === 2 && (
        <p className="studio-note">
          {cityName(pair[1])} is {inr(Math.abs(gap))} / month {gap >= 0 ? "more" : "less"} than {cityName(pair[0])}.
        </p>
      )}
    </section>
  );
}
