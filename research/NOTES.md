# Research notes — raw fetch evidence

All fetches performed 2026-10-22 from a Linux sandbox using Node `fetch` / `curl` with a desktop browser
User-Agent, plus the WebFetch tool where noted. Quotes below are verbatim excerpts from the fetched pages
(HTML stripped, whitespace collapsed). Raw HTML was kept in a scratch directory outside the repo and is not committed.

HTTP status legend: `200` = fetched OK, `403/404` = failed (not used as a source).

---

## FDIC BankFind API (all 2026-10-22)

Endpoint: `https://banks.data.fdic.gov/api/institutions?...` → 301 redirect to `https://api.fdic.gov/banks/institutions?...`.
Index reported by API: `institutions_20261016090006` (created 2026-10-16T11:58:03Z).

| Query NAME | CERT | ACTIVE | City, State | Note |
|---|---|---|---|---|
| Ally Bank | 57803 | 1 | Sandy, Utah | |
| SoFi Bank, National Association | 26881 | 1 | Cottonwood Heights, Utah | |
| The Bancorp Bank, National Association | 35444 | 1 | Sioux Falls, South Dakota | |
| Stride Bank, National Association | 4091 | 1 | Enid, Oklahoma | |
| Wells Fargo Bank, National Association | 3511 | 1 | Sioux Falls, South Dakota | also CERT 1230 (San Francisco), ACTIVE 0, inactive since 1986 — not used |
| Sutton Bank | 5962 | 1 | Attica, Ohio | |
| Synchrony Bank | 27314 | 1 | Draper, Utah | |
| Lead Bank | 8283 | 1 | Kansas City, Missouri | |
| Community Federal Savings Bank | 57129 | 1 | Woodhaven, New York | 3 other same-name certs all ACTIVE 0 (29111, 31952, 32951) — not used |
| JPMorgan Chase Bank, National Association | 628 | 1 | Columbus, Ohio | |
| Coastal Community Bank | 34403 | 1 | Everett, Washington | also CERT 9619 (Panama City Beach FL), ACTIVE 0 since 2010 — not used |
| Green Dot Bank → no exact match; `search=NAME:Green Dot` returned "Green Dot Bank DBA Bonneville Bank" | 22653 | 1 | Provo, Utah | Wealthfront page says Green Dot Bank operates under trade name Bonneville Bank |
| Choice Financial Group | 9423 | 1 | Fargo, North Dakota | |
| Cross River Bank | 58410 | 1 | Fort Lee, New Jersey | |
| Varo Bank, National Association | 59190 | 1 | Draper, Utah | |
| Lincoln Savings Bank | 14207 | 1 | Reinbeck, Iowa | also CERT 20272 (Carnegie PA) ACTIVE 0 — not used |
| nbkc bank | 35014 | 1 | Leawood, Kansas | |

Selection rule where several certs share a name: chose the single ACTIVE=1 record whose city matches the bank
as commonly identified; the inactive duplicates are historical institutions.

---

## Apps

### Chime — https://www.chime.com/
- curl/Node fetch: **403** (bot protection) for `/`, `/policies/`, `/bank-partners/`. App store listings fetched (200) but contained no bank text.
- WebFetch tool (200) on https://www.chime.com/ returned footer text:
  - "Banking services provided by The Bancorp Bank, N.A. or Stride Bank, N.A., Members FDIC."
  - "Your funds are insured up to the standard maximum deposit insurance amount of up to $250,000 through our partner banks, Stride Bank, N.A. or The Bancorp Bank, N.A., Members FDIC."
  - "Chime is not FDIC-insured. The Bancorp Bank, N.A. and Stride Bank, N.A. are the FDIC-insured members. Deposit insurance covers the failure of an insured bank. Certain conditions must be satisfied for pass-through deposit insurance coverage to apply. FDIC deposit insurance limit is $250,000 per depositor, per insured bank, per ownership category."
- Caveat: raw HTML not retained (WebFetch returns extracted text only). Monitor will likely record a fetch failure for this URL.

### SoFi — https://www.sofi.com/banking/fdic/ (200)
- "SoFi Checking and Savings is offered through SoFi Bank, N.A. Member FDIC."
- "SoFi Bank is a member FDIC and does not provide more than $250,000 of FDIC insurance per depositor per legal category of account ownership, as described in the FDIC's regulations. Any additional FDIC insurance is provided by the SoFi Insured Deposit Program. Deposits may be insured up to $3M through participation in the program. See full terms at SoFi.com/banking/fdic/sidpterms . See list of participating banks at SoFi.com/banking/fdic/participatingbanks ."

### Cash App — https://cash.app/legal/us/en-us/tos (200, redirected to https://cash.app/us/en/legal/tos)
- Header: "Cash App Terms of Service Effective: February 7, 2024 Last Updated: September 11, 2026"
- "9. FDIC Pass-Through Insurance a. Eligibility Cash App is a financial services platform, and not an FDIC-insured bank. FDIC pass-through insurance only covers the failure of an FDIC-insured depository …"
- "… your Cash App Balance and your Savings Balance are eligible for FDIC pass-through insurance through Wells Fargo Bank, N.A. Member FDIC, Sutton Bank, Member FDIC, and/or The Bancorp Bank, N.A., Member FDIC (each a "Bank," and collectively the "Banks"), if certai[n conditions are met]"
- "If you don't have a Cash App Card or a Sponsored Account, and if you do not sponsor a Sponsored Account, your Cash App Balance and Savings Balance are not deposit products and not eligible for FDIC pass-through insurance. FDIC pass-through insurance does not cover Bitcoin or Investing holdings. b. Coverage Limits Eligible funds are insured up to $250,000, including principal and accrued …"
- "Eligible funds held at each Bank may be automatically swept into one or more sweep network banks. The total amount of FDIC pass-through insurance coverage available to you at each Bank and sweep network banks depends on the ownership capacity in which you hold your funds and the amount of deposits you already maintain at that Bank or sweep network banks."

### Venmo — https://venmo.com/legal/us-user-agreement/ (200)
- "This user agreement is effective as of August 24, 2026."
- "Funds added to your personal account (or a Teen Account) via Direct Deposit, including funds added using The Bancorp Bank, N.A. account and routing number, are transferred to and held by one or more banks insured by the Federal Deposit Insurance Corporation (FDIC) that we choose in our discretion ("Program Banks") where they will, subject to certain conditions, be eligible for FDIC pass-through insurance in your name …"
- "FDIC insurance protects against the failure of a Program Bank, not the failure of PayPal, which provides the Venmo se[rvice]"
- "PayPal, the provider of the Venmo service, is not a bank, does not take deposits and is not FDIC insured. If your Venmo account is not eligible for FDIC pass-through insurance, we combine your Venmo account funds with the funds of other Venmo account holders not eligible for FDIC pass-through insurance and invest those funds in liquid investments in accordance with state money transmitter laws."
- "The Venmo Debit Card is issued by The Bancorp Bank, N.A."
- Program Bank names: **not listed** in the fetched agreement.

### PayPal — https://www.paypal.com/us/legalhub/paypal/useragreement-full (200)
- "PAYPAL USER AGREEMENT Last updated on September 14, 2026"
- "… we will place your U.S. dollar PayPal Balance funds in one or more Program Banks, where they will, subject to certain conditions, be eligible for pass-through FDIC insurance, up to applicable limits."
- "FDIC insurance protects against the failure of the Program Banks, not the failure of PayPal. PayPal is not a bank, does not take deposits and is not FDIC insured."
- "[funds … if you do not have a Balance Account,] represent unsecured claims against PayPal that are not eligible for FDIC pass-through insurance."
- "PayPal Savings is a deposit account provided by Synchrony Bank …"
- "When you open a business account, we may also assign you a The Bancorp Bank, N.A. ("The Bancorp") issued account number and routing number …"
- Program Bank names: **not listed** in the fetched agreement.

### Wise — https://wise.com/us/ (200; https://wise.com/us/legal/fdic 404)
- Footer: "Wise is a Money Service Business ("MSB") registered with FinCen, not an FDIC-insured bank. … The Wise Multi-Currency Card Program is issued by Wise's sponsor Bank(s)*, member(s) FDIC. … *Lead Bank and Community Federal Savings Bank."
- Embedded page string `common.disclaimer.us.programBank`: "FDIC insurance is provided as pass-through insurance with our current program bank. (Wise is not a bank). The current Program Bank is JPMorgan Chase Bank, N.A., see Appendix 1 of the Program Agreement for the most updated list of Program Bank(s). Eligible customers must opt in to the interest feature. Participants will have the balance of their USD funds held in their Wise Account "swept" into a Federal Deposit Insurance Corporation ("FDIC") insured account at one or more participating banks (each, a "Program Bank") …"

### Robinhood — https://robinhood.com/us/en/banking/ (200) and https://robinhood.com/us/en/ (200)
- Banking page: "Robinhood Banking is a financial services platform offered by Robinhood Money, LLC (RHY). RHY is a financial technology company, not a bank. Banking services are provided by Coastal Community Bank, Member FDIC. FDIC insurance is available through pass-through insurance at Coastal Community Bank, Member FDIC, if certain conditions have been met."
- Banking page: "Funds in the Sweep Program are eligible for up to $50 million in FDIC deposit insurance through participating program banks, subject to the $250,000 per depositor, per insured bank, for each account ownership category limit and other applicable FDIC requirements. Robinhood Money, LLC is not an FDIC-insured bank."
- Home page: "The Robinhood Cash Card is a prepaid card issued by Sutton Bank, Member FDIC … Funds held in your Robinhood Cash Card account at Sutton Bank are eligible for FDIC insurance up to $250,000 and will not accrue or pay any interest. The availability of FDIC insurance is contingent upon Robinhood maintaining records acceptable to the FDIC, as receiver, if Sutton Bank should fail."
- Sweep program bank names: **not listed** on fetched pages.

### Wealthfront — https://www.wealthfront.com/legal/disclosure (200)
- "Wealthfront sweeps available cash balances to Program Banks where they earn a variable rate of interest and, subject to the satisfaction of certain conditions, are eligible for FDIC insurance."
- "FDIC pass-through insurance is not provided until the funds arrive at the Program Banks, and protects against the failure of Program Banks, not Wealthfront. While cash balances are at Wealthfront Brokerage, and while they are transitioning to and/or from Wealthfront Brokerage to the Program Banks, they are not eligible for FDIC pass-through insurance, but are eligible for SIPC protection, subject to the limit of $250,000 for cash."
- "Wealthfront Brokerage partners with more than one Program Bank to make available up to $8 million (or up to $16 million for joint accounts) of FDIC pass-through coverage for your cash deposits."
- "The Wealthfront Visa® Debit Card is issued by Green Dot Bank, Member FDIC … Green Dot Bank operates under the following registered trade names: GO2bank, GoBank and Bonneville Bank. All of these registered trade names are used by, and refer to, a single FDIC-insured bank, Green Dot Ban[k]"
- Program Bank names: page links to a list that was **not fetched**.

### Ally — https://www.ally.com/bank/fdic/ (200)
- "Ally Bank, the company's direct banking subsidiary, offers an array of deposit products and services. Ally Bank is a Member FDIC and Equal Housing Lender"
- "The standard insurance amount is $250,000 per depositor, per insured bank, for each ownership category."

### Current — https://current.com/ (200; /legal/ 404)
- "Current is a financial technology company, not an FDIC-insured bank. FDIC insurance up to $250,000 only covers the failure of an FDIC-insured bank. Certain conditions must be satisfied for pass-through deposit insurance coverage to apply. Banking services provided by Choice Financial Group, Member FDIC, and/or Cross River Bank, Member FDIC."

### Varo — https://www.varomoney.com/ (200; /legal/ 404)
- Footer: "© 2026 Varo Bank, N.A. All Rights Reserved Member FDIC."

### Dave — https://dave.com/legal (200)
- "Dave Disclosures Last update October 9, 2026 Dave is not a bank. Banking services provided by Coastal Community Bank, Member FDIC."
- "Dave accounts are FDIC-insured up to $250K through Coastal Community Bank, Member FDIC, or another partner bank. Conditions apply."

### Revolut US — revolut.com returns **403** to curl, Node fetch and WebFetch (`/en-US/`, `/en-US/legal/`, `/en-US/legal/products/`, help.revolut.com).
- Fallback: Revolut's own Google Play store listing, https://play.google.com/store/apps/details?id=com.revolut.revolut&hl=en_US&gl=US (200), developer-supplied text:
  - "Funds in your Revolut Prepaid Card Account are held at or transferred to Lead Bank, Member FDIC, and are insured by the FDIC up to $250,000 applicable limits by the FDIC in the event Lead Bank fails if specific deposit insurance requirements are met."
  - "Savings Account services provided by Cross River Bank, Member FDIC, insured up to $250,000."
- A web-search summary claimed savings via Sutton Bank; that conflicts with the fetched listing and was **not used**.

### Betterment — https://www.betterment.com/legal/cash-reserve-program-banks (200, redirected to https://www.betterment.com/cash-portfolio; page title "Betterment Cash Sweep Program | Program Banks"; "Updated April 20, 2026 Effective May 1, 2026")
- "FDIC insurance is available for eligible cash held across Betterment accounts in the Cash Sweep Program up to $4 million at our program banks $8 million for joint accounts), subject to certain conditions"
- "Cash held in Betterment accounts, including funds deposited into Cash Reserve, become eligible for FDIC insurance once they are transferred to one or more Program Banks, with up to $250,000 per depositor per bank … Funds in transit to or from Program Banks are generally not FDIC-insured but remain covered by SIPC"
- Program bank list (footnote 2 = "Program Bank with a Transfer Account"): Bank Hapoalim, B.M.; Barclays Bank Delaware; CIBC Bank USA; Cross River Bank; Encore Bank; First Internet Bank of Indiana; First Merchant Bank; First Western Trust Bank; Forbright Bank; HSBC Bank USA, N.A.; Lake Forest Bank & Trust Company, N.A.; Morgan Stanley Bank, N.A.; Morgan Stanley Private Bank, National Association; NexBank; Northbrook Bank and Trust Company, N.A.; State Bank of the Lakes, N.A.; State Street Bank and Trust Company; The Bancorp Bank (2); Truist Bank; Webster Bank, a division of Santander Bank, N.A.; Wells Fargo Bank, N.A. (1, 2); Western Alliance Bank; Wheaton Bank and Trust, N.A.; Apple Bank; Northern Bank & Trust Company; First Carolina Bank.
- "Betterment is not a bank. Deposit Accounts are obligations of the Program Banks and not of Betterment or Betterment Securities."
- Only the two Transfer Account banks (The Bancorp Bank, Wells Fargo) were looked up in BankFind.

### Acorns — https://www.acorns.com/ (200; /legal/ 404)
- "Acorns is not a bank. Acorns Visa™ debit cards and banking services are issued by Lincoln Savings Bank or nbkc bank, members FDIC."
- "… are insured up to $250,000 per depositor through Lincoln Savings Bank or nbkc bank, Members FDIC. If you have funds jointly owned, these funds would be separately insured for up to $250,000 for each joint account owner. Lincoln Savings Bank or nbkc bank utilizes a deposit network service, which means that at any gi[ven time] … please visit https://www.cambr.com/bank-list. Balances moved to network banks are eligible for FDIC insurance once the funds arrive at a network bank."

### Albert — https://albert.com/ (200; /legal/ 404)
- "Albert is not a bank. Banking services provided by Stride Bank, N.A., Member FDIC. Albert Savings accounts are held for your benefit at FDIC-insured banks, including Wells Fargo, N.A. The Albert Mastercard® debit card is issued by Stride Ba[nk]"
- "Funds in Albert Cash are held in a pooled account at Stride Bank, N.A. Funds in Savings accounts are held at Wells Fargo, N.A. Cash and Savings account funds are eligible for up to $250,000 in FDIC insurance on a pass-through basis should the bank holding your funds fail. Your FDIC insurance is subject to specific conditions being satisfied."

---

## Synapse / fintech failure

### CFPB — https://www.consumerfinance.gov/enforcement/actions/synapse-financial-technologies-inc/ (200; "Page last modified Sept. 15, 2025")
- "Synapse is a Delaware corporation … that provided proprietary technology and software that acted as a bridge between nonbank fintech platforms that offered banking services to consumers and traditional partnering banks. On April 22, 2024, Synapse filed for chapter 11 bankruptcy protection."
- "The Bureau alleged that Synapse violated the Consumer Financial Protection Act of 2010 by failing to maintain adequate records of the location of consumers' funds and failing to ensure those records matched the records maintained by its partnering banks, causing consumers to lose access to their funds. The partnering banks determined that the total funds they were holding for consumers was less than the total amount of consumer funds reflected in records Synapse provided to them, reflecting a shortfall of between $60 and $90 million. Consumers did not have any access to their funds for weeks or months as the partnering banks reconciled their records with Synapse's records and then distributed funds to consumers, and many consumers have not received the full amount of their account balance."
- Failed: FDIC press release URL on custodial-account recordkeeping (404) and FDIC consumer pages tried (404). Not used.

---

## Guide sources

### FDIC — Understanding Deposit Insurance — https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance (200; "Last Updated: April 1, 2024")
- "FDIC deposit insurance protects your money in deposit accounts at FDIC-insured banks in the event of a bank failure. Since the FDIC was founded in 1933, no depositor has lost a penny of FDIC-insured funds."
- "The DIF is backed by the full faith and credit of the United States government"
- "FDIC insurance covers deposits in all types of accounts at FDIC-insured banks, but it does not cover non-deposit investment products, even those offered by FDIC-insured banks. Additionally, FDIC deposit insurance doesn't cover default or bankruptcy of any non-FDIC-insured institution."
- Covered: Checking accounts; NOW accounts; Savings accounts; Money market deposit accounts (MMDAs); Time deposits such as certificates of deposit (CDs); Cashier's checks, money orders, and other official items issued by a bank.
- Not covered: Stock investments; Bond investments; Mutual funds; Annuities; Life insurance policies; Safe deposit boxes or their contents; U.S. Treasury bills, bonds, or notes; Municipal securities; Crypto assets.
- "FDIC deposit insurance covers $250,000 per depositor, per FDIC-insured bank, for each account ownership category." Categories: Single; Joint; Certain Retirement Accounts (e.g. IRAs); Trust; Employee Benefit Plan; Corporation/Partnership/Unincorporated Association; Government.
- Examples (single + joint at same bank insured separately; single accounts at two banks each insured; two single accounts + IRA at same bank → $250,000 combined single, IRA separately $250,000). EDIE estimator mentioned.
- "Make sure your bank is FDIC-insured, using the BankFind Suite search tool."

### FDIC — Financial Products That Are Insured — https://www.fdic.gov/resources/deposit-insurance/financial-products-insured (200; "Last Updated: April 1, 2024")
- "The following are examples of deposit products which are insured by the FDIC Checking Accounts Savings Accounts Money Market Deposit Accounts Certificates of Deposit (CD) Prepaid Cards (assuming certain FDIC requirements are met)"

### FDIC — Your Insured Deposits brochure — https://www.fdic.gov/resources/deposit-insurance/brochures/insured-deposits (200; "Last Updated: May 14, 2024")
- Trust accounts: "As of April 1, 2024, the maximum insurance coverage for a trust owner with five or more beneficiaries is $1,250,000 per owner. This coverage change applies to both existing and new trust accounts, including CDs (regardless of maturity date)."
- Pass-through: ""Pass-through" deposit insurance is a method of insuring depositors whose funds are placed and held at an FDIC-insured bank through a third party." Third parties include "Companies that offer financial products or services through partnerships or arrangements with FDIC-insured banks" and "Brokers who offer brokered CDs".
- Requirements: relationship expressly disclosed in bank's deposit account records; identity and ownership interest of each owner ascertainable from bank's records or third party's records; underlying owners actually own the funds. "The FDIC determines whether these requirements are satisfied at the time of an insured bank's failure. Deposits insured on a pass-through basis are added to any other deposits that the owner holds in the same deposit insurance category at the same bank … For example, if a broker purchases a CD for a single owner at an insured bank, and that person maintains a separate checking account in the Single Account category at the same bank, the two balances would be added together and insured for up to $250,000 in the Single Account category."

### NCUA — Share Insurance Coverage — https://ncua.gov/consumers/share-insurance-coverage (200)
- "Backed by the full faith and credit of the United States, the Share Insurance Fund provides up to $250,000 of federal share insurance to millions of account holders in all federal credit unions and the overwhelming majority of state-chartered credit unions."
- "Credit union members don't need to apply to share insurance coverage as it's provided automatically when they join a federally insured credit union. The Share Insurance Fund insures individual accounts at federally insured credit union up to $250,000, and a member's interest in all joint accounts combined is insured up to $250,000. The Share Insurance Fund also separately protects IRA and KEOGH retirement accounts up to $250,000."
- "No one has lost a single penny of insured deposits at a federally insured credit union."
- "There are several state-chartered credit unions that are insured by private insurers. These private insurers provide non-federal share insurance coverage of deposits that are not backed by the full faith and credit of the United States. As such, it's important that members confirm their credit union is federally insured by visiting the NCUA's Credit Union Locator tool."
- "Share insurance covers many types of share deposits … including deposits in a share draft account, share savings account, or time deposit such as a share certificate."

### SEC Investor.gov — Money Market Funds — https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5 (200)
- "Money market funds are a type of mutual fund that invest in liquid, short-term debt securities, cash and cash equivalents."
- "money invested in a money market fund is not guaranteed by the FDIC like bank accounts are. There is therefore a risk you may lose some or all of the money you invested."
- Stable NAV funds "seek to keep their NAV at a stable $1.00 per share"; deviating by more than half a cent is "breaking the buck".
