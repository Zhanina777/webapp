// Support-screen prototype: the amount changes locally and Purchase opens the profile; no charge is made.
import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Unlock All Access | CRYST" }];
}

export default function Payment() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(49);

  const sliderProgress = ((price - 9) / (499 - 9)) * 100;

  return (
    <main className="payment-page">

  

      {/* Congratulations */}
      <section className="payment-congratulations">
        <h1>Congratulations!</h1>
        <h2>You just grew your first crystal</h2>

        <p>
          We would love for the app to be free, but we have
          to generate income in order to exist. We hope
          you’ll consider supporting our work with a
          <strong> one-time purchase.</strong>
        </p>
      </section>

      {/* Benefits */}
      <section className="payment-benefits">

        <div className="payment-benefit">
          <img src="images/cryst-favicon.png" alt="" />

          <div>
            <h3>Access all of our recipes</h3>
            <p>
              Discover exciting experiments, grow amazing
              crystals, and get creative with science.
            </p>
          </div>
        </div>

        <div className="payment-benefit">
          <img src="images/cryst-favicon.png" alt="" />

          <div>
            <h3>Track your experiments</h3>
            <p>
              Save photos, write notes, and watch your
              crystals grow step by step.
            </p>
          </div>
        </div>

        <div className="payment-benefit">
          <img src="images/cryst-favicon.png" alt="" />

          <div>
            <h3>Join the CRYST community</h3>
            <p>
              Connect with friends you know, share your
              creations, and explore their crystal adventures!
            </p>
          </div>
        </div>

      </section>

      {/* Pick your price */}
      <section className="payment-price">

        <h2 className="payment-price-title">
          Pick Your Price
        </h2>

        <p className="payment-price-description">
          Select a one-time fee that feels fair to you.
          <br />
          Always ask an adult before you make any purchase.
        </p>

        {/* Price slider */}
        <input
          className="payment-slider"
          type="range"
          min="9"
          max="499"
          step="10"
          value={price}
          onChange={(event) =>
            setPrice(Number(event.target.value))
          }
          style={{
            "--slider-progress": `${sliderProgress}%`,
          }}
          aria-label="Choose payment amount"
        />

        {/* Purchase button */}
        <button
          className="purchase-button"
          type="button"
          onClick={() => navigate("/profile")}
        >
          <strong>{price} kr</strong>
          <span>Click here to purchase</span>
        </button>

        {/* Restore purchase */}
        <button
          className="restore-purchase"
          type="button"
          onClick={() => {
            // Connect to your restore purchase logic here.
          }}
        >
          Restore Purchase
        </button>

      </section>

    </main>
  );
}