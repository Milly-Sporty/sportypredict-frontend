import styles from "@/app/style/sport.module.css";

export default function BetOfTheDayInfo() {
  return (
    <div className={styles.predictionInfo}>
      <h1>Bet of the Day – Today’s Top Sports Prediction</h1>
      <p>
        Looking for the most trusted daily betting tip? SportyPredict’s Bet of
        the Day delivers one high-value prediction every day—carefully selected
        from football, basketball, or tennis by our expert analysts. This is not
        just any pick. It&apos;s the best value bet today, based on deep data,
        team form, player news, and real betting odds. Whether it’s a Champions
        League fixture, an NBA clash, or a Grand Slam showdown—we focus on one
        confident prediction to help you win.
      </p>

      <h2>What Makes It the Bet of the Day?</h2>
      <p>
        We only label a prediction as our Bet of the Day when it passes strict
        value checks, including:
      </p>
      <ul>
        <li>
          <strong>Current form & injuries:</strong> Evaluating momentum and
          fitness levels.
        </li>
        <li>
          <strong>Team/player motivation:</strong> Considering tournament
          stakes, qualification needs, or mental drive.
        </li>
        <li>
          <strong>Historical stats & trends:</strong> H2H records, surface or
          matchup patterns.
        </li>
        <li>
          <strong>Odds vs. probability value:</strong> Only bets with a clear
          value edge make the cut.
        </li>
      </ul>

      <h2>Also Covering Basketball & Tennis</h2>
      <p>
        While football often takes the spotlight, our Bet of the Day may also
        come from:
      </p>
      <ul>
        <li>
          <strong>Basketball:</strong> Spread or total points markets from NBA,
          EuroLeague, or FIBA fixtures.
        </li>
        <li>
          <strong>Tennis:</strong> Match winner, correct set score, or
          over/under total games in ATP & WTA events.
        </li>
      </ul>

      <p>
        Our goal? One confident, high-value pick daily—so you can bet smarter
        and win more with SportyPredict.
      </p>
    </div>
  );
}
