"use client";

export default function SeedButton() {
  const handleSeed = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message}\n${data.productsCreated} products, ${data.categoriesCreated} categories created.`);
        window.location.reload();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch {
      alert("❌ Seeding failed. Check console.");
    }
  };

  return (
    <button id="seed-db-btn" onClick={handleSeed} className="btn-gold">
      Seed Database
    </button>
  );
}
