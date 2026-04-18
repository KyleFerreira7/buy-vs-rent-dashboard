Buy vs Rent Dashboard

A data-driven property decision tool built for the Cape Town market. This interactive dashboard compares the long-term financial outcomes of buying property versus renting and investing, helping you understand which path builds more wealth over time.

What it does

The dashboard models two competing financial paths:

Buying property → building equity through bond repayments and property appreciation
Renting + investing → investing your deposit and monthly savings in the market

It then compares both strategies across a selected time horizon and answers the key question:

Which option leaves you wealthier — and when?

Key features
📊 Wealth comparison over time
Visualises buy vs rent wealth curves year-by-year
Includes property appreciation and investment growth
⚖️ Break-even analysis
Automatically calculates the exact year buying overtakes renting (if it does)
💰 Real-world cost modelling

Includes:

Bond repayments
Transfer & upfront costs
Annual ownership costs (rates, levies, maintenance)
Estate agent commission on sale
Rent escalation
Opportunity cost of capital
📈 Interactive charts (Chart.js)
Wealth over time
Monthly cost comparison
Property equity vs bond balance
⚙️ Flexible assumptions
Adjust 20+ variables:
Property price, deposit, interest rate
Rent & escalation
Market return
Investment horizon (1–40 years)
How it works
1. Input your scenario

Enter:

Property details (price, deposit, interest rate)
Renting scenario (monthly rent, increases)
Investment assumptions
2. Run the model

Click “Run the numbers” to simulate both strategies.

3. Analyse the results

The dashboard calculates:

Net wealth for both scenarios
Monthly costs over time
Break-even year
Final wealth difference
Project structure
buy-vs-rent-dashboard/
├── index.html     # Landing page + dashboard UI
├── styles.css     # Full styling (landing + dashboard)
├── script.js      # Calculator logic + charts
Tech stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Charts	Chart.js
Logic	Vanilla JavaScript (no frameworks)
Hosting	Static (GitHub Pages-ready)
How to run locally

No setup required.

# Clone the repo
git clone https://github.com/yourusername/buy-vs-rent-dashboard.git

# Open the project
cd buy-vs-rent-dashboard

# Launch
open index.html

Or simply double-click index.html.

Deployment

This project can be deployed as a static site using:

GitHub Pages
Netlify
Vercel

Since it’s fully client-side, no backend is required.

Assumptions & limitations
Returns are modelled estimates, not guarantees
Does not account for:
Tax implications
Inflation-adjusted returns
Behavioural factors
Designed primarily for the South African / Cape Town market context
Why I built this

Most “buy vs rent” calculators oversimplify the problem.

This tool was built to:

Reflect real-world costs and trade-offs
Incorporate local South African market dynamics
Provide a clear, visual answer to a complex financial decision
Future improvements
Inflation-adjusted (real) returns
Tax modelling (CGT, rental deductions)
Scenario comparison saving
Export/share results
Mobile optimisation