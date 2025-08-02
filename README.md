# Task 1: Laying the Foundation for Brent Oil Price Analysis

## Objective
This task sets the foundation for analyzing fluctuations in Brent oil prices by preparing data, understanding the key modeling concepts, and planning the full analysis pipeline.

---

## Workflow Overview

The core steps defined for this project are:

1. **Data Collection & Cleaning**  
   - Historical Brent oil prices were preprocessed and stored as `BrentOilPrices.csv`.

2. **Feature Engineering**  
   - Log returns were computed to normalize and stabilize variance in price movements.
   - Rolling statistics (mean, standard deviation) were calculated for multiple window sizes to explore short- and long-term volatility regimes.

3. **Stationarity Testing**  
   - Augmented Dickey-Fuller (ADF) test was applied.
   - Results showed log returns are stationary (p-value ≈ 0.000).

4. **Event Data Compilation**  
   - 26 major oil market events were compiled from credible sources (EIA, OPEC, historical news).
   - Events include geopolitical conflicts, OPEC decisions, economic disruptions, and supply shocks.

5. **Model Selection Planning**  
   - Change Point Detection using Bayesian methods (PyMC3) is chosen for identifying structural breaks in the data.

---

## Example Events Collected

| Date | Event | Type | Description |
|------|-------|------|-------------|
| 1980-09-23 | Iran–Iraq War begins | Conflict | Iraq invades Iran, disrupting oil production |
| 1981-01-28 | U.S. Deregulates Oil Prices | Policy | Reagan lifts federal oil price controls |
| 1983-10-01 | OPEC Quotas Set | OPEC Decision | OPEC sets production quotas amid oversupply |
| 1985-08-01 | Saudi Arabia floods market | Market Strategy | Output surge triggers oil glut and price crash |
| 1986-06-08 | OPEC fails agreement | OPEC Decision | Failure to agree on cuts leads to sub-$10 prices |
| 1989-03-24 | Exxon Valdez Oil Spill | Disaster | Alaska spill disrupts supply and markets |
| 1990-08-02 | Iraq invades Kuwait | Conflict | Triggers Gulf War, causes price spike |
| ... | ... | ... | ... |

The full dataset includes 26 curated events and is saved as `oil_market_events.csv`.

---

## Assumptions & Limitations

- **Log returns** are used instead of raw prices to ensure stationarity and normality.
- **Rolling statistics** vary depending on window size; professionals often use 21 (monthly), 60 (quarterly), or 252 (yearly) trading days.
- **Causation vs Correlation**:  
  Correlation in time series doesn't imply a causal relationship. For example, if a price spike coincides with an OPEC decision, it could be due to underlying expectations, not the announcement itself. This analysis identifies **temporal alignment**, not definitive cause-effect.

---

##  Communication Formats

Results will be shared through:

- **Interactive web dashboard** built with **React (frontend)** and **Flask (API backend)**.
- **Jupyter notebooks** for technical analysis, exploration, and validation.
- **Summarized insights and reports**


## Status: Complete
Task 1 is now complete. The analysis framework, events, and data understanding are in place to proceed with Bayesian modeling in Task 2.

