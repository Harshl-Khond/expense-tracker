function Footer() {
  const COLORS = {
    NAVY: "#2F3E46",
    TEXT_LIGHT: "#EAF4F4",
    TEXT_MUTED: "#CDE5E2",
    BORDER: "#52796F",
  };

  return (
    <footer
      className="mt-12 py-6"
      style={{
        backgroundColor: COLORS.NAVY,
        borderTop: `1px solid ${COLORS.BORDER}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p
          className="text-sm font-medium"
          style={{ color: COLORS.TEXT_LIGHT }}
        >
          © {new Date().getFullYear()} Expense Management System
        </p>

        <p
          className="text-xs mt-1"
          style={{ color: COLORS.TEXT_MUTED }}
        >
          Designed & Developed by{" "}
          <a
            href="https://kitstechsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.TEXT_LIGHT,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            KITS
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
