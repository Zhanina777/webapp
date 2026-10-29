import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Unlock All Access | CRYST" }];
}

export default function Payment() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(49);

  // Calculate how much of the slider should be purple
  const sliderProgress = ((price - 9) / (499 - 9)) * 100;

  return (
    <main className="payment-page">
      {/* Congratulations */}
      <section className="payment-congratulations">
        <h2>
          Congratulations, you
          <br />
          finished your first recipe!
        </h2>

        <img
          className="payment-crystal-image"
          src="/images/cryst-favicon.png"
          alt="Crystal growing in a flask"
        />
      </section>

      {/* Unlock access */}
      <section className="payment-description">
        <h2>UNLOCK ALL ACCESS</h2>

        <p>
          We hope you’ve enjoyed growing your first
          crystal. Continue exploring new recipes and
          discover the magic of crystal growing.
        </p>
      </section>

      {/* Benefits */}
      <section className="payment-benefits">
        <div className="payment-benefit">
          <h3>All Crystal Recipes</h3>
          <p>
            • Unlock access to all crystal recipes,
            from beginner-friendly projects to more
            advanced creations.
          </p>
        </div>

        <div className="payment-benefit">
          <h3>Track Your Progress</h3>
          <p>
            • Keep track of your crystals as they grow
            and celebrate each completed recipe.
          </p>
        </div>

        <div className="payment-benefit">
          <h3>Save Your Favorites</h3>
          <p>
            • Save recipes for later and easily find the
            ones you want to try next.
          </p>
        </div>
      </section>

      {/* Price section */}
      <section className="payment-price">
        <div className="payment-price-heading">
          <h2>PICK YOUR PRICE</h2>
        </div>

        <p>
          Select a one-time fee that feels fair to you.
        </p>

        {/* Working slider */}
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
      </section>
    </main>
  );
}