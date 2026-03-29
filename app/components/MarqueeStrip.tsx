const ITEMS = [
  "Shop", "Accessories", "Expert Repairs", "10,000+ Happy Customers",
  "Certified Technicians", "90-Day Warranty", "Same-Day Service",
  "Genuine OEM Parts", "Unlocked Devices", "Premium Cases",
  "Screen Replacement", "Battery Swaps",
];

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#f5f5f7",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "14px 0",
        userSelect: "none",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              paddingRight: 36,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#6e6e73",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#c7c7cc",
                marginLeft: 36,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
