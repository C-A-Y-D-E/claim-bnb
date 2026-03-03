import { darkTheme, type Theme } from "@rainbow-me/rainbowkit";

export const claimTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#FF7A1A",
    accentColorForeground: "#1C0F02",
    connectButtonBackground: "#251506",
    connectButtonText: "#FFF3E0",
    modalBackground: "#1C0F02",
    modalText: "#FFF3E0",
    modalBorder: "rgba(255, 122, 26, 0.2)",
    generalBorder: "rgba(255, 122, 26, 0.15)",
  },
  radii: {
    ...darkTheme().radii,
    connectButton: "12px",
    modal: "16px",
    modalMobile: "16px",
  },
  fonts: {
    body: "Inter, sans-serif",
  },
};
