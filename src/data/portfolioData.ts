import type { Portfolio } from "../types/portfolio";
import portfolioJson from "./portfolio.json";

export const initialPortfolioData: Portfolio = portfolioJson as unknown as Portfolio;

if (import.meta.hot) {
  import.meta.hot.accept();
}
