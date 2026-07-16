# Sidekick Marketing, Storefront, and Activation Program Design

**Date:** 2026-07-16
**Status:** Approved
**Company:** Sidekick HQ Inc.
**Target domain:** `sidekickhq.ca`
**Production repository:** `/Users/adamtaylor/Github/sidekickhq-web`
**Application source repository:** `/Users/adamtaylor/Github/HeroNet`

## 1. Executive summary

Sidekick is the customer-facing rebrand of HeroNet. The public experience must never present HeroNet as a separate product or use dual branding. The marketing site, storefront, signup, checkout, transactional communication, account UI, and legal surfaces all use Sidekick. The name HeroNet remains only where internal engineering documentation must identify the current source repository or code symbols.

The program delivers a sales-focused website and self-serve storefront for a broad suite of connected business applications. It combines a platform homepage, genuine product mini-sites, three-tier edition families, 40 industry pages, a structured Help Center landing page, localized CAD/USD pricing, a persistent cart, product-aware ordering wizards, account creation, payment, and asynchronous provisioning.

The program also owns missing HeroNet application work. It is not limited to a static marketing frontend. It creates the Sidekick seller tenant, completes commercial catalogue entries, adds the public catalogue projection, implements the CRM tier model, builds signup and checkout orchestration, and delivers telecommunications-style Sidekick Voice ordering and activation.

The implementation is one approved program delivered through dependency-ordered workstreams. Workstream boundaries are technical, not new product-approval gates.

## 2. Approved business decisions

| Area | Decision |
| --- | --- |
| Legal entity | Sidekick HQ Inc. |
| Brand | Sidekick only; no customer-facing HeroNet name |
| Domain | `sidekickhq.ca`; the domain is planned but not yet owned |
| Application login | `sidekickhq.ca/login`, which routes users by account type |
| Production repo | Fresh standalone `sidekickhq-web` repository |
| Launch markets | Canada and the United States |
| Currencies | CAD and USD |
| Language | English at launch; localization-ready content architecture |
| Primary CTA | Start Trial |
| Software trial | 30 days, no credit card, only for catalogue offers explicitly marked eligible |
| No-trial products | Sidekick Voice, Sidekick Payments, and Sidekick Protect |
| Pricing | Approved Sidekick price book published through versioned catalogue offers |
| CAD rule | Software CAD list prices are 140% of USD list prices, rounded to the nearest whole dollar |
| Annual incentive | Two months free: annual total equals 10 monthly payments, a 16.67% discount |
| Hardware | Country-specific verified retail MSRP, with no Sidekick hardware markup |
| Cadence | Monthly/annual toggle using independently published prices; usage and hardware are excluded from annual discounting |
| Tax display | Prices before tax; calculate applicable tax from confirmed billing or shipping address |
| Country UX | Edge detection, flag and country in top bar, persistent manual override |
| Cart UX | Header cart icon and item count; product-aware configured intents |
| Customer proof | No testimonials, customer logos, fabricated metrics, or unsupported adoption claims |
| Feature posture | Approved roadmap capabilities can be marketed without Coming Soon labels; do not claim “available today” unless verified, and do not make unpublished products purchasable |
| Help Center | Public docs and troubleshooting; account-specific billing, diagnostics, tickets, and support require login |
| Product architecture | Product constellation with prominent industry pathways |
| Public payments branding | Never identify the underlying payments platform |
| Public Protect branding | Never identify the underlying protection provider |
| Phone brands | Yealink and Poly only |

## 3. Brand promise and positioning

The platform-level promise is:

> Every part of your business, working together—with AI built in.

Supporting positioning:

- Sidekick connects customer, operational, financial, communications, and commerce workflows.
- Sidekick AI is embedded across eligible products and tiers.
- Sidekick AI Agents are separately purchasable recurring agents with metered AI credits.
- Sidekick Voice AI usage remains part of Voice.
- Buyers can start with one product and add more without creating disconnected customer records.
- Product depth is demonstrated through real workflows, product UI, real hardware, and transparent packaging rather than unsupported social proof.

Marketing copy should lead with outcomes and plain language. It may explain technical depth after the buyer understands the value. It must not overwhelm first-time visitors with every feature on a single page.

## 4. Visual design system

### 4.1 Approved assets and direction

The exact approved logo is the Sidekick caped-K lockup currently located at:

`/Users/adamtaylor/Github/heroITweb/.worktrees/sidekick-logo/public/brand/sidekick/sidekick-lockup-color-dark.svg`

The implementation must copy that exact vector into the production repository. It must not redraw, simplify, regenerate, or substitute the cape, chevron, gradient, or wrapped lower K.

Approved visual direction:

- Deep navy and electric blue as primary brand colours
- Cape-derived blue gradients used selectively
- Warm paper surfaces to keep long pages human
- Purposeful circles that signal connection, attention, or motion
- Real photography for industry context
- Production-quality product and hardware imagery
- Superhero confidence without comic-book styling
- Lighter display typography; no clunky extra-bold headings

### 4.2 Token layers

The design system has four token layers:

1. **Foundations:** raw colour, typography, spacing, radius, shadow, and motion scales.
2. **Semantics:** surface, text, border, action, focus, success, warning, danger, and disabled roles.
3. **Components:** header, button, card, form, pricing, product hardware, cart, checkout, and Help Center roles.
4. **Product accents:** restricted product-specific variations derived from the Sidekick blue system.

Initial approved core colours:

| Token | Value | Role |
| --- | --- | --- |
| Sidekick Navy | `#06162F` | Authority, AI surfaces, footer, dark hero moments |
| Action Blue | `#246BFD` | Primary actions and active states |
| Cape Azure | `#5AA7FF` | Gradient and focus accent |
| Signal Sky | `#DCECFF` | Soft informational surfaces |
| Warm Paper | `#F7F5F0` | Editorial and photography-adjacent surfaces |

Typography:

- Manrope at weight 600 for display and major headings
- Inter at weights 400–500 for body and dense product content
- Controlled label weight around 650/700
- No extra-bold display style
- Tight display tracking only at large sizes; body text remains conventional and readable

### 4.3 Page composition

The site does not use a generic “standard page” template. It uses accessible primitives and a restrained family of composable slices:

- Editorial white for detailed features, comparisons, and evidence
- Action blue for decisive trial and purchase moments
- Intelligence navy for Sidekick AI and connected workflows
- Warm paper for long-form explanation and pricing context
- Photography-led industry stories
- Product-stage layouts for UI and hardware

Each page has an explicit composition manifest that selects and orders slices around that page’s sales story.

## 5. Information architecture

### 5.1 Primary navigation

The global header contains:

- Products
- Industries
- Pricing
- Resources
- Login
- Country selector with flag and country label
- Cart icon with item count
- Start Trial

Products uses a grouped mega-menu organized by customer job, not one undifferentiated product list.

### 5.2 Core routes

- `/`
- `/platform`
- `/products`
- `/sidekick-ai`
- `/sidekick-ai/agents`
- `/pricing`
- `/industries`
- `/resources`
- `/resources/help`
- `/resources/guides`
- `/resources/product-updates`
- `/status`
- `/contact`
- `/login`
- `/trial`
- `/cart`
- `/checkout`
- `/order/{orderId}`
- `/legal/privacy`
- `/legal/terms`
- `/legal/cookies`
- `/legal/refunds`
- `/legal/returns`
- `/legal/accessibility`
- `/sitemap.xml`

### 5.3 Product mini-site routes

Each product lives under `/products/{product}` and owns supporting pages appropriate to its depth. The exact supporting pages are declared in the product registry; products are not forced into identical route sets.

Products:

- Sidekick CRM
- Sidekick Voice
- Sidekick Payments
- Sidekick MSP
- Sidekick Rentals
- Sidekick ERP
- Sidekick Protect
- Sidekick Commerce
- Sidekick Appointments
- Sidekick Sites
- Sidekick Desktop
- Sidekick AI

CRM, MSP, and Rentals additionally include:

- `/products/{family}/editions`
- `/products/{family}/editions/essentials`
- `/products/{family}/editions/professional`
- `/products/{family}/editions/enterprise`

Voice and Payments include dedicated hardware catalogue and buying-guide routes. Other supporting feature routes are created only when the content warrants a standalone page.

## 6. Product mini-site narratives

Every mini-site has its own navigation, photography and media treatment, page rhythm, feature grouping, industry relevance, pricing, FAQs, and conversion path.

### 6.1 Sidekick AI

- Embedded, tier-aware assistance across the platform
- Cross-product context and action suggestions
- Sidekick AI Agents as separately purchased workers
- Recurring per-agent pricing plus metered AI credits
- Governed human review where required
- Voice AI positioned within Sidekick Voice

### 6.2 Sidekick CRM

- Companies, contacts, service locations, activity, tasks, and imports
- Opportunities and core pipeline
- Multi-pipeline management
- Email and calendar sync
- Sales automation, playbooks, and cadences
- Data enrichment
- Proposals and forecasting
- Reporting and Sidekick AI

### 6.3 Sidekick Voice

- Real Yealink and Poly deskphone choice as a differentiator
- Browser, desktop, and mobile calling
- New numbers, area-code search, and number porting
- Users, seats, queues, IVR, routing, voicemail, and call flip
- Contact-center and operator workflows
- AI receptionist and live-call assistance
- Transcription, post-call intelligence, and analytics
- Phone provisioning and activation status

### 6.4 Sidekick Payments

- Production-quality terminal imagery presented before abstract processing copy
- In-person terminal checkout
- Online payments and payment links
- Recurring collections
- Merchant onboarding
- Payouts, settlement, risk, and reconciliation
- POS and Commerce integration
- Country-aware device catalogue

### 6.5 Sidekick MSP

- PSA and service operations
- Projects and onboarding
- RMM device management
- Dispatch and automation
- Client portal
- Finance and reporting
- HR and internal operations at higher tiers
- Sidekick workspace and AI

### 6.6 Sidekick Rentals

- Availability and fleet calendar
- Quotes, contracts, reservations, and POS
- Barcode staging and warehouse readiness
- Dispatch, run sheets, logistics, and handoff
- Returns, damage, inspections, insurance/COI, and maintenance
- Metering and continuation billing
- Subrentals, purchasing, multi-location, and partner inventory
- Profitability, telemetry, sustainability evidence, and enterprise controls

### 6.7 Sidekick ERP

- General ledger and chart of accounts
- Journals, close, statements, and audit controls
- Bank feeds and reconciliation
- Accounts receivable and payable
- Tax and regulatory evidence
- Inventory, warehouses, purchasing, and orders
- Multi-entity and multi-currency support
- Reporting and platform-wide financial authority

### 6.8 Sidekick Protect

- Protected users, endpoints, servers, and cloud workloads
- Backup, recovery, cybersecurity, and monitoring
- Business continuity and recovery readiness
- Coverage, usage, and billing visibility
- No public mention of the underlying provider

### 6.9 Sidekick Commerce

- Products, variants, collections, and price lists
- Promotions and customer-specific terms
- Inventory and availability
- POS and online storefronts
- Checkout, orders, fulfilment, and returns
- Shared CRM customer context
- ERP-centred financial and inventory authority

### 6.10 Sidekick Appointments

- Public booking pages
- Team availability and routing
- Round-robin assignment
- Reschedule and cancellation
- Reminders and notifications
- Calendar synchronization
- Deposits and payment collection
- Service-business-specific examples

### 6.11 Sidekick Sites

- AI-assisted first drafts from safe CRM context
- Approved templates and visual editing
- Customer portal review and controlled editing
- Media, SEO, domains, DNS, and SSL readiness
- Static publishing, immutable deployments, and rollback
- Revision history and approval workflow

### 6.12 Sidekick Desktop

- Native workspace for Windows, macOS, and Linux
- Tray presence and unread/call badges
- Native notifications
- Global shortcuts
- Sidekick deep links
- Calling and workspace continuity
- Secure automatic updates

## 7. Edition design

### 7.1 CRM

**Essentials**

- Companies, contacts, sites, activity, tasks, opportunities
- Core pipeline and imports
- Finance Core
- Standard reporting

**Professional**

- Everything in Essentials
- Multiple pipelines
- Email and calendar synchronization
- Sales automation and cadences
- Enriched data
- Proposals and forecasting
- Advanced reporting
- Enhanced Sidekick AI

**Enterprise**

- Everything in Professional
- APIs and webhooks
- Advanced permissions and governance
- Audit controls
- Enterprise reporting and higher limits
- Enterprise Sidekick AI

The current HeroNet registry has only one CRM tier. Implementation must replace that packaging with the approved three-tier model, compatibility handling, tests, catalogue entries, and Super-Admin configuration.

### 7.2 MSP

- Essentials
- Professional
- Enterprise

The website reflects the current inherited package model: Essentials establishes PSA/projects/Sidekick core; Professional adds RMM, portal, automation, internal operations, and enhanced finance/AI; Enterprise adds advanced proposals/bookings, API/webhooks, governance, unlimited RMM, and enterprise AI/finance.

### 7.3 Rentals

- Essentials
- Professional
- Enterprise

The website reflects the current inherited package model and the recently added rental depth. Essentials covers core rental, commerce, POS, projects, proposals, bookings, HR, and Sidekick. Professional adds portal, warehouse, dispatch, multi-location, enhanced finance, and enhanced AI. Enterprise adds enterprise rental, telemetry, API/webhooks, governance, enterprise finance, and enterprise AI.

### 7.4 Add-ons

Sidekick Voice is an optional add-on across edition families. Other standalone products and capabilities must be represented through published catalogue offers and entitlement mappings rather than hidden hard-coded website logic.

## 8. Industry programme

The site contains a complete directory plus one full page for each of the following 40 industries.

### Service and Care

- Beauty Salons and Spas
- Fitness and Wellness
- Medical Clinics
- Dental Clinics
- Veterinary and Pet Services
- Senior Care and Home Care
- Childcare and Daycares
- Life Sciences and Private Health

### Trades, Field and Fleet

- Home Services
- Construction
- Commercial Cleaning
- Logistics and Transportation
- Automotive
- Dealerships and Equipment Sales
- Equipment Rental
- Manufacturing
- Oil and Gas
- Agribusiness

### Storefront and Multi-Location

- Retail
- Restaurants and Food Service
- Hospitality
- Franchises and Multi-Location
- Wholesale Distribution
- Property Management
- Real Estate
- Education and Training

### Professional and Regulated

- Law Firms
- Accountants and Bookkeepers
- Financial Services
- Insurance
- Professional Services
- Engineering Firms
- Architecture and Design
- Staffing and Recruiting
- Non-Profits

### Technology Operators

- Managed Service Providers
- Technology and SaaS
- IT Service Providers
- Multi-Entity Operators
- Internal Service Desks

Each page must contain:

- Industry-specific hero and photography
- Plain-language operational pains
- Relevant Sidekick product stack
- A realistic day-in-the-business workflow
- Sidekick AI actions and decisions
- Relevant hardware and field context
- Role-specific examples
- Regulated-industry caveats where appropriate
- A preconfigured-cart or Start Trial path

Shared primitives are allowed; repeated generic copy is not.

## 9. Help Center landing page

Only the public Help Center landing experience and future information architecture are in scope. Article bodies are not.

Hierarchy:

`Product family → Product → Task area → Article`

Landing-page elements:

- Global search with loading, results, no-results, and error states
- Browse by Sidekick product
- Get-started journeys
- Owner, admin, sales, finance, technician, and frontline role shortcuts
- Hardware setup paths
- Popular tasks and troubleshooting categories
- Sidekick Desktop and mobile setup
- Release notes
- System status
- Login path for account-specific billing, diagnostics, support tickets, and service data

The route model must be ready for future article content without publishing placeholder articles.

## 10. Localized storefront

### 10.1 Country and currency

- Detect country from trusted edge/request metadata.
- Support Canada and the United States only.
- Display a flag and country label in the top bar.
- Persist manual override in a first-party cookie.
- Use Canada as the safe fallback when detection fails.
- Revalidate the cart when country changes.

### 10.2 Pricing

- Read prices from a customer-safe projection of the Sidekick seller tenant’s published catalogue offers.
- Display exact CAD or USD amounts.
- Use independent monthly and annual price components.
- Display savings only when the published amounts prove them.
- Display “plus applicable taxes.”
- Resolve tax from the confirmed billing or shipping address.
- Never expose draft offers, provider costs, margins, or internal configuration.
- Never invent or cache indefinitely when the source is unavailable.

#### 10.2.1 Price-book rules

The following launch price book is approved and must be created in the Sidekick seller tenant rather than hard-coded into the marketing frontend.

- USD is the base software currency.
- Monthly CAD list price is `round(USD monthly list price × 1.40)`.
- Annual USD total is ten times the monthly USD list price: two months free, equivalent to a 16.67% discount.
- Annual CAD total is `round(USD annual total × 1.40)`.
- All displayed software prices are whole dollars with no cents.
- Annual cards show the whole-dollar effective monthly amount and the exact annual amount billed in advance.
- The small variation caused by whole-dollar CAD rounding is accepted and must not be disguised as a different promotional percentage.
- Annual discounts apply only to recurring software, seats, locations, workloads, and recurring add-ons.
- Metered usage, payment-processing fees, shipping, taxes, one-time services, and physical goods do not receive the annual discount.
- Hardware uses verified country-specific retail MSRP. Hardware is not derived using the software CAD conversion rule.
- Any future discount is a separate dated promotion or contract adjustment; it does not mutate list price.

#### 10.2.2 Edition price book

| Product and edition | Billing unit | USD monthly | USD annual | CAD monthly | CAD annual |
| --- | --- | ---: | ---: | ---: | ---: |
| CRM Essentials | user | $24 | $240 | $34 | $336 |
| CRM Professional | user | $60 | $600 | $84 | $840 |
| CRM Enterprise | user | $120 | $1,200 | $168 | $1,680 |
| MSP Essentials | technician; unlimited managed endpoints subject to edition limits | $90 | $900 | $126 | $1,260 |
| MSP Professional | technician; unlimited managed endpoints subject to edition limits | $150 | $1,500 | $210 | $2,100 |
| MSP Enterprise | technician; unlimited managed endpoints | $210 | $2,100 | $294 | $2,940 |
| Rentals Essentials | organization | $48 | $480 | $67 | $672 |
| Rentals Professional | organization | $96 | $960 | $134 | $1,344 |
| Rentals Enterprise | organization | $180 | $1,800 | $252 | $2,520 |

The public edition comparison states included users, limits, and any additional-user charge from the published offer. It may not imply unlimited staff access unless the edition entitlement actually supplies it.

#### 10.2.3 Standalone product and add-on price book

| Product or offer | Billing unit | USD monthly | USD annual | CAD monthly | CAD annual |
| --- | --- | ---: | ---: | ---: | ---: |
| ERP Full User | full operational user | $60 | $600 | $84 | $840 |
| ERP Team User | light approval, time, expense, and self-service user | $18 | $180 | $25 | $252 |
| Voice Business Communications | user/seat; one local number included | $30 | $300 | $42 | $420 |
| Voice Contact Center | contact-center agent add-on | $90 | $900 | $126 | $1,260 |
| Voice AI Receptionist | receptionist instance | $36 | $360 | $50 | $504 |
| Voice Additional Local Number | number | $6 | $60 | $8 | $84 |
| Protect Workstation | protected workstation | $12 | $120 | $17 | $168 |
| Protect Server | protected physical or virtual server | $36 | $360 | $50 | $504 |
| Protect Cloud User | protected Microsoft 365 or Google Workspace user | $6 | $60 | $8 | $84 |
| Commerce Essentials | organization | $48 | $480 | $67 | $672 |
| Commerce Professional | organization | $96 | $960 | $134 | $1,344 |
| Commerce Enterprise | organization | $180 | $1,800 | $252 | $2,520 |
| Appointments Essentials | location | $24 | $240 | $34 | $336 |
| Appointments Professional | location | $48 | $480 | $67 | $672 |
| Appointments Enterprise | location | $90 | $900 | $126 | $1,260 |
| Sites Essentials | published site | $24 | $240 | $34 | $336 |
| Sites Professional | published site | $48 | $480 | $67 | $672 |
| Sites Enterprise | published site | $90 | $900 | $126 | $1,260 |
| Sidekick AI Agent | active configured agent; includes 5,000 credits/month | $60 | $600 | $84 | $840 |

Sidekick Desktop is included with every paid user entitlement and is not sold separately. Embedded Sidekick AI remains included according to edition capability limits. Voice AI usage is part of the Voice catalogue and is never debited from general Sidekick AI Agent credits.

#### 10.2.4 Metered offers

Sidekick Payments has no platform subscription fee, setup fee, or annual plan at launch. Revenue is earned from processing and separately purchased hardware. Merchant eligibility and approval still apply.

| Offer | United States | Canada | Annual discount |
| --- | ---: | ---: | --- |
| Payments online domestic card | 2.9% + $0.30 | 2.9% + CA$0.30 | None |
| Payments in-person domestic card | 2.7% + $0.05 | 2.7% + CA$0.05 | None |
| Payments Interac debit | Not applicable | CA$0.15 | None |
| Protect cloud-storage overage | $0.10/GB/month | CA$0.14/GB/month | None |
| Sidekick AI Agent credit pack | $50 per 10,000 credits | CA$70 per 10,000 credits | None |

International-card, currency-conversion, manually entered card, dispute, optional encryption, cellular-data, and other exceptional payment fees are published from country-specific catalogue components. Their public labels describe the customer charge without naming the underlying provider. Large-volume custom payment pricing is sales-assisted and must never be represented as guaranteed self-serve pricing.

An AI credit has a versioned consumption schedule. A standard agent action consumes 20 credits at launch. The storefront therefore explains both pack size and example action cost; it never presents credits as an unlimited agent subscription.

#### 10.2.5 Market position

The price book intentionally uses a value-led middle position:

- CRM Essentials is close to mainstream small-business entry plans while Professional and Enterprise remain materially below Salesforce and HubSpot list prices.
- MSP pricing is comparable to Atera, Syncro, and SuperOps while preserving per-technician buying and meaningful capability progression.
- Rentals spans Booqable’s growth range and reserves the highest price for multi-location, dispatch, telemetry, governance, and enterprise depth.
- ERP Full User sits near configurable ERP plans while recognizing the value of connected CRM, commerce, appointments, rentals, and finance data.
- Commerce follows the familiar small, growing, and advanced-store pattern without copying a competitor’s packaging.
- Appointments begins below the common per-location growth plan and scales with multi-location operations.
- Voice is priced in the established business-communications range while differentiating through optional Yealink and Poly hardware, activation help, number selection, and porting.
- Protect uses simple workload pricing rather than an opaque bundle.
- Sidekick AI Agents combine an affordable recurring agent with transparent metered actions instead of charging per resolved conversation.

The research snapshot for these decisions is dated 2026-07-16 and uses official Salesforce, HubSpot, Pipedrive, RingCentral, Zoom, Dialpad, Atera, Syncro, SuperOps, Booqable, Rentman, Odoo, Shopify, Square Appointments, Webflow, Backblaze, Intercom, and underlying processing/device pricing pages. Competitor prices are research inputs only and are not shown as permanent claims on the public site without a fresh source check.

### 10.3 Cart model

The cart stores configured product intents:

- Catalogue offer-version identifier
- Product configuration schema version
- Country
- Billing cadence
- Quantity and assignment intent
- Hardware selections
- Product-specific configuration

Client totals are informational. Server-side validation is authoritative at cart display, checkout entry, and order submission.

## 11. Trial and payment policy

Trial eligibility is per offer.

- Eligible Sidekick software: 30-day trial, no credit card required when ordered alone.
- Sidekick Voice: no trial.
- Sidekick Payments: no trial.
- Sidekick Protect: no trial.
- Physical hardware: paid at order time.
- A mixed cart containing a non-trial product or hardware requires payment details.
- Trial-eligible software in a mixed cart remains zero-cost during the approved trial period.

The existing hard-coded 14-day Super-Admin trial behaviour must be replaced or bypassed by the catalogue/edition policy so Sidekick storefront trials are consistently 30 days.

## 12. Product-aware ordering and activation

There is no simplistic software-versus-hardware split. Each product contributes validated wizard steps and provisioning dependencies to one order orchestrator.

### 12.1 Voice activation wizard

Voice behaves like a typical telecommunications ordering and activation journey:

1. Account and business identity
2. Service locations
3. Emergency-service addresses
4. Users, seats, queues, and required capabilities
5. New numbers or porting choice
6. Area-code preference
7. Available-number search and selection
8. Porting numbers, current-carrier data, authorization, and supporting documents
9. Call-flow and receptionist choices
10. Optional Yealink and Poly hardware
11. Shipping and installation preferences
12. Billing details and credit card
13. Terms, emergency calling, number-porting, and payment authorization
14. Review and submit
15. Per-step activation and provisioning status

Porting, number assignment, device shipment, and provisioning are asynchronous. The order view must show real status and recoverable action requests.

### 12.2 Payments

- Business and ownership information
- Processing requirements
- Merchant onboarding handoff
- Terminal and accessory selection
- Shipping
- Billing and payment
- Approval, shipment, activation, and readiness status

### 12.3 Protect

- Business identity
- Users, devices, servers, cloud workloads, or storage requiring coverage
- Coverage and optional capabilities
- Billing and payment
- Deployment and activation status

### 12.4 Software editions

- Business identity
- Edition and cadence
- Initial users and administrator
- Optional add-ons
- Trial confirmation
- Tenant provisioning and login handoff

## 13. Sidekick seller tenant and control-plane boundaries

Create a dedicated tenant through the Super-Admin tenant creation wizard:

- Display name: Sidekick HQ
- Legal name: Sidekick HQ Inc.
- Slug: `sidekick`
- Default operating currency: CAD
- USD selling support through explicit USD catalogue offers

The Sidekick tenant owns:

- Buyer Company and Contact records
- Sales pipeline and sales orders
- Product catalogue and published offer versions
- Customer-facing prices
- Hardware order and fulfilment context
- Invoices, collections, refunds, and customer commercial history
- Customer support relationship context

The platform control plane owns:

- Customer tenant identity and schema provisioning
- Edition and capability assignment
- Platform subscription status
- Authentication and tenant routing
- Cross-tenant idempotency and provisioning state

An explicit activation bridge links the Sidekick seller order to the customer tenant. It must be idempotent, auditable, retryable, and safe against duplicate tenant or subscription creation.

Super-Admin remains the operator surface for:

- Edition family and tier authoring
- Capability and limit configuration
- Optional add-ons
- Tenant assignment and overrides
- Subscription inspection
- Catalogue authoring and publication
- Provisioning and readiness inspection

If an operator surface does not exist, the programme adds it rather than introducing hidden seed-only state.

## 14. Public catalogue projection

HeroNet currently has tenant-scoped `listPublishedCatalogOffers` but no anonymous customer-safe storefront endpoint. Add a narrow endpoint for the Sidekick seller tenant.

The public response may contain only:

- Stable public product and offer identifiers
- Slug, name, customer-safe description, and approved imagery
- Product family and offer kind
- CAD/USD price components and cadence
- Taxable indicator
- Trial policy
- Market availability
- Public configuration schema
- Public fulfilment category
- Public inventory/availability state where applicable
- Published version and effective timestamp

It must not contain:

- Provider identifiers
- Provider cost or margin
- Tenant slug or private database identifiers not required by checkout
- Draft, retired, or archived prices
- Internal metadata
- Credential, fulfilment secret, or marketplace configuration

Use short-lived caching with explicit version/ETag semantics. Checkout always revalidates against the authoritative server source.

## 15. Hardware catalogues

### 15.1 Voice hardware

Support only Yealink and Poly models from the current RingCentral phone catalogue.

Included categories:

- Desk phones
- Cordless and DECT phones
- Conference phones
- Compatible expansion modules and required phone accessories

Excluded brands:

- Cisco
- Mitel
- Grandstream
- Algo

The catalogue importer/authoring workflow records:

- Brand and model
- Category
- Customer-safe features
- Country availability
- Current displayed purchase price
- Currency
- Source URL
- Source verification timestamp
- Image provenance and usage approval
- Sidekick provisioning profile compatibility
- Active, unavailable, or retired status

The source catalogue is a pricing and selection benchmark, not a fulfilment dependency. Sidekick must have a valid procurement/fulfilment path before an item is published for purchase.

### 15.2 Payment terminals

Support every underlying terminal model available for sale and activation in Canada or the United States, including relevant countertop, handheld, mobile, and self-service categories.

Rules:

- Country-specific availability is authoritative.
- Retail price comes from the provider’s official device pricing or authenticated hardware catalogue feed.
- Models without a verified price remain unpublished until a price is available.
- Public copy, URLs, metadata, image alt text, schema, and checkout never mention the underlying platform.
- Customer-facing product names use Sidekick-approved naming and manufacturer model names where appropriate.
- Internal provider SKU and fulfilment identifiers remain server-only.
- Product imagery must be generated or licensed as production-ready assets with Sidekick-branded screens; CSS screen overlays are prohibited.

## 16. Technical architecture

### 16.1 Marketing/storefront repository

- Astro 7
- Strict TypeScript
- Tailwind 4 backed by semantic CSS variables
- Server-rendered or prerendered pages by default
- Interactive islands only for country, pricing, cart, Help Center search, signup, and checkout
- Dockerized Astro Node deployment
- Cloudflare-compatible DNS/CDN setup
- Hosting-specific behaviour behind a narrow adapter

### 16.2 Typed content model

Typed registries define:

- Products
- Features and feature groups
- Edition families and tiers
- Industries and workflows
- Claims and claim evidence
- FAQs
- Navigation
- Media and attribution
- Catalogue keys
- Page composition manifests

Registries are validated during build. A missing required page, claim source, route, image, edition link, or catalogue key fails verification.

### 16.3 Runtime data flow

1. Request context resolves country and persisted override.
2. Server/storefront client loads published offers for country and currency.
3. Buyer configures product intents.
4. Cart stores versioned configuration, never trusted totals.
5. Checkout revalidates offers, trial rules, availability, tax inputs, and configuration.
6. Secure payment client collects payment details when required.
7. Server creates an idempotent Sidekick seller order.
8. Payment or trial acceptance advances the order.
9. Activation bridge provisions the customer tenant and assigns editions/add-ons.
10. Product-specific jobs provision numbers, phones, merchant services, terminals, Protect coverage, and software access.
11. Order status exposes customer-safe progress and required actions.

## 17. Failure-state design

- Pricing unavailable: keep marketing content, fail purchasing closed, show retry.
- Country change: revalidate and identify unavailable or changed items.
- Price changed: show old and current values before confirmation.
- Phone number unavailable: preserve configuration and return to selection.
- Porting incomplete: save a resumable draft and required-document list.
- Payment declined: preserve account and configuration; create no fulfilled order.
- Merchant approval pending: show pending state without false activation.
- Hardware unavailable: preserve service configuration and offer removal or replacement.
- Provisioning delayed: show per-product status; do not fail the entire order.
- Duplicate submission: return the existing idempotent order.
- Unsupported mixed configuration: name the conflict and corrective action.
- Help search no results: offer product/category navigation and authenticated support.
- JavaScript unavailable: marketing, pricing disclosures, legal content, and navigation remain readable; transactions explain the scripting requirement.

## 18. Security, privacy, and legal

- Sidekick HQ Inc. is the seller, privacy controller, and contracting entity.
- Legal pages must be newly adapted; Hero IT’s entity name must not be copied.
- Privacy, terms, cookie notice, refund, return, accessibility, and sitemap routes are required.
- Return policy covers physical phones and terminals.
- Refund policy distinguishes trials, recurring services, usage, merchant services, porting/setup work, and hardware.
- Cookie consent gates optional analytics and marketing scripts.
- Payment credentials are handled through secure provider-hosted/client elements and never pass through marketing-site logs.
- Public catalogue responses are allowlisted projections.
- Checkout uses CSRF protection, idempotency, rate limiting, server-side validation, and audit records.
- Voice ordering captures emergency-calling and number-porting disclosures.
- Protect and Payments onboarding may require additional provider terms without exposing provider branding in marketing.
- No secrets, provider costs, private identifiers, or internal HeroNet names enter public bundles.

## 19. Accessibility, SEO, and performance

Accessibility target: WCAG 2.2 AA.

Required behaviours:

- Keyboard-complete navigation and mega-menus
- Visible focus
- Semantic landmarks and heading hierarchy
- Reduced-motion support
- Accessible form errors and recovery
- Adequate touch targets
- Alt text and caption-ready video
- Token-enforced contrast

SEO and discovery:

- Canonical URLs
- Product, software, organization, FAQ, breadcrumb, and article-ready structured data where valid
- Complete sitemap
- Product and industry metadata from typed registries
- No doorway-page duplication
- Help Center search-ready route structure
- Performance budgets for images, scripts, fonts, and interactive islands

## 20. Verification strategy

### 20.1 Marketing repository

- Content-schema and route-completeness tests
- Claim-policy tests
- Product/edition/industry cross-link tests
- Country/currency/cadence unit tests
- Cart and configuration merge tests
- Public API contract tests
- Responsive visual regression
- Accessibility automation and keyboard review
- Link, sitemap, canonical, structured-data, and metadata validation
- Lighthouse checks on representative page types

### 20.2 HeroNet repository

- CRM three-tier registry and compatibility tests
- Trial-policy and 30-day storefront tests
- Sidekick tenant provisioning and seed idempotency tests
- Super-Admin edition and catalogue authoring tests
- Public catalogue allowlist and tenant-isolation tests
- Storefront order idempotency tests
- Seller-order to customer-tenant activation tests
- Subscription and entitlement synchronization tests
- Phone/terminal catalogue provenance and publication tests
- Voice number search, reservation, porting, hardware, and activation tests
- Payments and Protect no-trial tests
- Payment failure and asynchronous provisioning tests

### 20.3 End-to-end journeys

- Canada software-only trial
- U.S. software-only trial
- Sidekick Voice with new number and Poly/Yealink hardware
- Sidekick Voice with porting and resumable document state
- Sidekick Payments with terminal purchase and merchant onboarding
- Sidekick Protect coverage order
- Mixed software-trial and paid hardware/service order
- Country change with cart revalidation
- Price change before submission
- Failed payment recovery
- Delayed provisioning status
- Authenticated login routing
- Help Center browse/search shell

## 21. Launch gates

Production checkout stays disabled until all of the following are proven:

- Sidekick HQ Inc. legal copy is approved
- `sidekickhq.ca` is acquired and configured
- Sidekick seller tenant exists and passes readiness checks
- CRM tiers and product entitlements are configured
- Published CAD and USD offers exist
- Trial policies are correct
- Public catalogue projection passes privacy and contract tests
- Hardware procurement and fulfilment paths are active
- Payment test-mode journeys pass
- Voice number search/porting/provisioning journeys pass
- Merchant onboarding and Protect activation handoffs pass
- Tax configuration covers intended Canadian and U.S. jurisdictions
- Customer communications use Sidekick branding
- Accessibility, security, performance, and end-to-end gates pass

## 22. Explicit exclusions

- Help Center article bodies
- French page publication at launch
- Testimonials or customer logos without future approval
- Unsupported customer metrics
- Phone brands other than Yealink and Poly
- Customer-facing disclosure of the underlying payments or Protect providers
- CSS overlays used to fake phone or terminal screens
- Publishing products with unverified pricing or no fulfilment path

## 23. Approved source references

Internal source of truth:

- HeroNet repository `/docs`
- HeroNet edition, capability, app, and catalogue registries
- HNET Confluence feature-domain, edition, Commerce, ERP, Rentals, CRM, Voice, Sidekick workspace, and RMM/PSA pages
- HNET Jira implementation status

External research references:

- Salesforce Sales Cloud editions: `https://www.salesforce.com/sales/pricing/`
- Salesforce Agentforce usage pricing: `https://www.salesforce.com/agentforce/pricing/`
- HubSpot Sales Hub pricing: `https://www.hubspot.com/pricing/sales`
- Zoho CRM and Zoho One platform patterns
- Pipedrive CRM packaging: `https://www.pipedrive.com/en/pricing/professional-crm`
- Acumatica ERP and edition patterns
- Odoo app hierarchy and pricing: `https://www.odoo.com/pricing`
- Atera MSP pricing: `https://www.atera.com/msp-pricing/`
- Syncro MSP pricing: `https://syncromsp.com/pricing-packages/`
- SuperOps MSP pricing: `https://superops.com/pricing`
- Booqable rental pricing: `https://booqable.com/pricing/`
- Rentman rental pricing: `https://rentman.io/pricing`
- Shopify commerce pricing: `https://www.shopify.com/pricing`
- Square Appointments pricing: `https://squareup.com/us/en/appointments/pricing`
- Webflow site-plan pricing: `https://webflow.com/pricing`
- Backblaze business backup pricing: `https://www.backblaze.com/cloud-backup/business`
- Intercom AI Agent outcome pricing: `https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes`
- RingCentral communications pricing and device catalogue: `https://www.ringcentral.com/us/en/office/plansandpricing.html` and `https://www.ringcentral.com/products/devices.html`
- Zoom Phone pricing: `https://www.zoom.com/en/products/voip-phone/`
- Dialpad communications pricing: `https://www.dialpad.com/pricing/`
- Official regional processing, terminal-device, hardware-order, and pricing pages: `https://stripe.com/pricing`, `https://stripe.com/en-ca/pricing`, `https://stripe.com/terminal`, and `https://stripe.com/en-ca/terminal`

External references inform page structure, selection breadth, and retail-price verification. They do not authorize copying protected marketing copy, imagery, or trademarks beyond factual manufacturer/model use.
