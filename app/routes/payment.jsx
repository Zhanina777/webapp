import { useState } from "react";

export function meta() {
  return [{ title: "Payment | CRYST" }];
}

export default function Payment() {
  const [price, setPrice] = useState(49);

  return (
    <main className="payment-page">
      <header className="payment-header">
        <button className="payment-close" aria-label="Close">
          ×
        </button>

        <h1 className="payment-logo">CRYST</h1>
        <h2>UNLOCK ALL ACCESS</h2>
      </header>

      <section className="payment-description">
        <h3>Pick Your Price</h3>

        <p>
          We would love for the app to be free, but we have to generate
          income in order to exist. We hope you’ll consider supporting
          our work with a one-time purchase.
        </p>
      </section>

      <section className="payment-benefits">
        <div className="payment-benefit">
          <span className="benefit-icon">✓</span>
          <div>
            <h3>Crystal Growing Guides</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>

        <div className="payment-benefit">
          <span className="benefit-icon">✓</span>
          <div>
            <h3>Track Your Experiments</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>

        <div className="payment-benefit">
          <span className="benefit-icon">✓</span>
          <div>
            <h3>Premium Content</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </section>

      <section className="payment-price">
        <h3>Pick Your Price</h3>

        <p>Select a one-time fee that feels most fair to you</p>

        <input
  type="range"
  min="9"
  max="499"
  step="10"
  value={price}
  onChange={(event) => setPrice(Number(event.target.value))}
  aria-label="Choose payment amount"
/>

        <button className="purchase-button">
          <strong>{price} kr</strong>
          <span>Click Here To Purchase</span>
        </button>

        <button className="restore-button">
          Restore Purchase
        </button>
      </section>
    </main>
  );
}