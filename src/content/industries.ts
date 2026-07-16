import type { IndustryDefinition, IndustryFamily, ProductSlug } from "./types";

type Scenario = readonly [title: string, steps: readonly string[]];

type IndustryInput = {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly body: string;
  readonly pains: readonly string[];
  readonly products: readonly ProductSlug[];
  readonly scenarios: readonly [Scenario, Scenario, Scenario];
  readonly ai: readonly string[];
  readonly roles: readonly string[];
  readonly caveat?: string;
};

const industry = (family: IndustryFamily, input: IndustryInput): IndustryDefinition => ({
  slug: input.slug,
  name: input.name,
  family,
  hero: { eyebrow: `Sidekick for ${input.name}`, title: input.title, body: input.body },
  seo: {
    title: `Sidekick for ${input.name} | Connected business operations`,
    description: `${input.body} See practical CRM, operations, payments, communications, and AI workflows for ${input.name.toLowerCase()}.`,
  },
  pains: input.pains,
  productSlugs: input.products,
  workflows: input.scenarios.map(([title, steps]) => ({
    title,
    description: `A practical Sidekick workflow that helps the team ${title.toLowerCase()}.`,
    steps,
  })),
  aiActions: input.ai,
  roleExamples: input.roles,
  caveat: input.caveat,
  media: {
    kind: "photography",
    src: `/images/industries/${input.slug}.webp`,
    alt: `${input.name} team using Sidekick during a real working day`,
    direction: `Documentary photography inside a real ${input.name.toLowerCase()} workplace, with natural light, credible tools, and no staged handshake imagery.`,
  },
  cta: { label: `Start with Sidekick for ${input.name}`, href: `/checkout?industry=${input.slug}`, trialEligible: !input.products.some((slug) => ["voice", "payments", "protect"].includes(slug)) },
});

export const INDUSTRIES: readonly IndustryDefinition[] = [
  industry("Service and Care", {
    slug: "beauty-salons-and-spas", name: "Beauty Salons and Spas", title: "A calmer front desk, a fuller day, and clients who feel remembered.",
    body: "Connect online booking, staff calendars, client preferences, deposits, retail, reminders, and follow-up without making the service team run five apps.",
    pains: ["Phone tag for bookings", "Last-minute gaps", "Client notes separated from schedules"], products: ["appointments", "crm", "payments", "commerce", "voice"],
    scenarios: [["fill a cancelled chair from the waitlist", ["Apply the cancellation policy", "Offer the opening to eligible clients", "Collect the deposit", "Update the stylist calendar"]], ["prepare for a returning colour client", ["Open the client history", "Review formula and preferences", "Confirm service timing", "Suggest the right follow-up"]], ["turn checkout into the next visit", ["Take terminal payment", "Add retail products", "Book the next service", "Send care instructions"]]],
    ai: ["Suggest likely rebooking windows", "Summarize preferences before the appointment", "Draft personalized after-care"], roles: ["Owner sees utilization and revenue", "Reception manages bookings and calls", "Service professional starts prepared"],
  }),
  industry("Service and Care", {
    slug: "fitness-and-wellness", name: "Fitness and Wellness", title: "Keep every class, coach, member, and payment moving together.",
    body: "Coordinate classes, one-to-one appointments, memberships, waivers, reminders, payments, and member relationships from first inquiry through renewal.",
    pains: ["Fragmented class and appointment calendars", "Manual membership follow-up", "Low visibility into member history"], products: ["appointments", "crm", "payments", "commerce", "sites"],
    scenarios: [["convert a trial class into a membership", ["Capture the booking", "Record attendance", "Send the right offer", "Start recurring billing"]], ["manage a coach schedule change", ["Identify affected sessions", "Offer replacement times", "Notify members", "Confirm the revised roster"]], ["recover an at-risk member", ["Detect reduced activity", "Review member context", "Assign coach outreach", "Track the response"]]],
    ai: ["Flag declining attendance", "Prepare renewal outreach", "Recommend the next suitable class"], roles: ["Coach sees client goals", "Front desk manages attendance", "Owner monitors retention signals"],
  }),
  industry("Service and Care", {
    slug: "medical-clinics", name: "Medical Clinics", title: "Coordinate the patient journey without turning care into clerical work.",
    body: "Bring appointment operations, secure communication, phone routing, payments, tasks, and business reporting around the clinic's approved systems of record.",
    pains: ["High phone volume", "Manual reminders and intake", "Administrative work scattered across teams"], products: ["appointments", "voice", "payments", "crm", "protect"],
    scenarios: [["route an incoming patient call", ["Identify the caller", "Apply privacy-safe context", "Route by reason and urgency", "Create the follow-up task"]], ["prepare the next clinic day", ["Review confirmed appointments", "Identify missing intake", "Send preparation reminders", "Escalate unresolved gaps"]], ["collect an eligible patient balance", ["Present the approved amount", "Take payment securely", "Issue a receipt", "Reconcile the transaction"]]],
    ai: ["Summarize administrative context", "Draft non-clinical reminders", "Identify unresolved scheduling tasks"], roles: ["Reception coordinates calls and visits", "Clinic manager sees operational load", "Finance reconciles payments"], caveat: "Sidekick must be configured to the clinic's privacy, residency, consent, and clinical-system requirements. It does not replace regulated clinical judgment or an approved clinical record system.",
  }),
  industry("Service and Care", {
    slug: "dental-clinics", name: "Dental Clinics", title: "Keep chairs productive and every patient handoff clear.",
    body: "Coordinate treatment-related scheduling, recalls, phone calls, deposits, reminders, and administrative follow-up while preserving the clinic's clinical boundaries.",
    pains: ["Recall work managed manually", "Gaps from cancellations", "Treatment follow-up lost between roles"], products: ["appointments", "voice", "payments", "crm", "protect"],
    scenarios: [["fill a same-week hygiene opening", ["Find matching recall patients", "Offer the opening", "Confirm the appointment", "Update the schedule"]], ["coordinate a treatment plan follow-up", ["Record the administrative next step", "Assign the coordinator", "Schedule approved outreach", "Track the outcome"]], ["prepare the front desk for tomorrow", ["Review appointment status", "Find missing forms or deposits", "Send reminders", "Escalate conflicts"]]],
    ai: ["Prioritize recall outreach", "Draft administrative follow-up", "Summarize call outcomes"], roles: ["Treatment coordinator sees next actions", "Reception manages schedule gaps", "Owner reviews chair utilization"], caveat: "Clinical charting and treatment decisions remain in approved dental systems and with qualified professionals.",
  }),
  industry("Service and Care", {
    slug: "veterinary-and-pet-services", name: "Veterinary and Pet Services", title: "Keep pets, owners, appointments, and service history connected.",
    body: "Manage booking, intake, owner communication, phone routing, deposits, recurring services, and customer follow-up around the practice's clinical or service workflow.",
    pains: ["Owner and animal records split", "Urgent calls mixed with routine requests", "Recurring care reminders handled manually"], products: ["appointments", "voice", "crm", "payments", "commerce"],
    scenarios: [["book the right service for the right pet", ["Match the owner", "Select the animal and service", "Apply availability rules", "Send preparation details"]], ["route an urgent incoming call", ["Identify owner and pet", "Capture the stated reason", "Route by clinic policy", "Record the handoff"]], ["manage recurring grooming or wellness", ["Set the recommended interval", "Offer future times", "Collect any deposit", "Send reminders"]]],
    ai: ["Summarize recent non-clinical interactions", "Suggest overdue service outreach", "Draft owner instructions approved by the team"], roles: ["Reception manages owner communication", "Service staff see preferences", "Manager monitors capacity"], caveat: "Sidekick supports administrative operations and does not provide veterinary diagnosis or replace the practice management record.",
  }),
  industry("Service and Care", {
    slug: "senior-care-and-home-care", name: "Senior Care and Home Care", title: "Coordinate people, visits, families, and follow-up with dignity.",
    body: "Connect inquiries, scheduling, caregiver availability, family communication, service tasks, billing, and operational oversight without losing the person behind the plan.",
    pains: ["Complex visit coordination", "Family updates spread across channels", "Coverage gaps discovered late"], products: ["crm", "appointments", "voice", "erp", "protect"],
    scenarios: [["turn an inquiry into a care assessment", ["Capture household context", "Schedule the assessment", "Assign the coordinator", "Track required follow-up"]], ["cover a caregiver absence", ["Identify affected visits", "Find qualified availability", "Confirm reassignment", "Notify approved contacts"]], ["prepare family communication", ["Collect approved operational updates", "Review consent boundaries", "Send the update", "Record the interaction"]]],
    ai: ["Identify scheduling conflicts", "Summarize approved service history", "Draft consent-aware communication"], roles: ["Coordinator manages referrals", "Scheduler covers visits", "Administrator reviews service and billing"], caveat: "Configure access, consent, privacy, and record retention for applicable health and care regulations; Sidekick does not make care decisions.",
  }),
  industry("Service and Care", {
    slug: "childcare-and-daycares", name: "Childcare and Daycares", title: "Keep enrolment, rooms, families, and daily administration in step.",
    body: "Coordinate inquiries, tours, waitlists, enrolment tasks, family communication, payments, staff workflows, and protected business records.",
    pains: ["Waitlists kept in spreadsheets", "Enrolment documents chased manually", "Family calls lack shared context"], products: ["crm", "appointments", "voice", "payments", "erp", "protect"],
    scenarios: [["move a family from waitlist to offer", ["Review age and start-date fit", "Confirm room capacity", "Send the offer", "Open enrolment tasks"]], ["prepare a centre tour", ["Capture family needs", "Book the right location", "Prepare the host", "Track follow-up"]], ["resolve an account question", ["Identify the approved contact", "Review invoice and payment context", "Record the resolution", "Assign any remaining action"]]],
    ai: ["Prioritize likely waitlist fits", "Summarize family interactions", "Draft enrolment reminders"], roles: ["Director sees capacity and pipeline", "Administrator manages enrolment", "Finance follows payment status"], caveat: "Child and family data requires strict consent, access, retention, and jurisdiction-specific privacy controls.",
  }),
  industry("Service and Care", {
    slug: "life-sciences-and-private-health", name: "Life Sciences and Private Health", title: "Give regulated teams a clearer commercial and operational trail.",
    body: "Connect organizations, stakeholders, agreements, projects, appointments, communication, finance, and audit-ready workflow controls without overstating clinical capability.",
    pains: ["Complex stakeholder relationships", "Approval-heavy workflows", "Operational and commercial records disconnected"], products: ["crm", "erp", "appointments", "voice", "protect", "ai"],
    scenarios: [["coordinate a multi-stakeholder engagement", ["Map organizations and contacts", "Record approvals", "Assign project work", "Maintain the relationship timeline"]], ["prepare a regulated customer review", ["Gather approved records", "Identify open commitments", "Build the agenda", "Record outcomes"]], ["route a controlled document task", ["Select the governed workflow", "Assign reviewers", "Capture approval evidence", "Publish the approved outcome"]]],
    ai: ["Summarize approved records", "Identify unresolved commitments", "Draft review material with human approval"], roles: ["Commercial lead sees account structure", "Operations tracks governed work", "Finance connects project and customer value"], caveat: "Validation, privacy, residency, electronic-record, and quality-system requirements must be assessed before regulated use. Sidekick does not provide clinical decisions.",
  }),

  industry("Trades, Field and Fleet", {
    slug: "home-services", name: "Home Services", title: "Answer the call, book the right visit, and get the technician there prepared.",
    body: "Connect local phone numbers, customer history, scheduling, estimates, dispatch, field work, payment, and follow-up for plumbing, HVAC, electrical, and other service teams.",
    pains: ["Missed calls become missed jobs", "Dispatch lacks customer context", "Field payment and office records diverge"], products: ["voice", "crm", "appointments", "payments", "erp", "sites"],
    scenarios: [["turn an urgent call into a dispatched job", ["Identify customer and location", "Capture issue and urgency", "Find qualified availability", "Dispatch with context"]], ["prepare the technician before arrival", ["Review site and equipment history", "Surface access notes", "Confirm parts or tools", "Notify the customer"]], ["close the job at the doorstep", ["Record work and materials", "Take terminal payment", "Issue the receipt", "Schedule follow-up"]]],
    ai: ["Summarize site history", "Suggest dispatch priority", "Draft estimate and follow-up"], roles: ["Dispatcher sees capacity", "Technician sees site context", "Owner sees booked and completed work"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "construction", name: "Construction", title: "Keep customers, projects, equipment, purchasing, and field commitments aligned.",
    body: "Connect opportunity, proposal, project, rental equipment, purchasing, site communication, costs, billing, and operational reporting.",
    pains: ["Sales promises disconnected from delivery", "Equipment conflicts across sites", "Costs arrive after decisions"], products: ["crm", "erp", "rentals", "voice", "payments", "protect"],
    scenarios: [["hand a won project to operations", ["Carry proposal scope forward", "Open project and budget", "Assign site and team", "Schedule equipment needs"]], ["coordinate shared equipment", ["Review project demand", "Check fleet availability", "Reserve and dispatch", "Record return and condition"]], ["review project margin before month end", ["Collect time and materials", "Reconcile purchase and rental costs", "Compare billing progress", "Escalate variance"]]],
    ai: ["Summarize project risk", "Flag equipment conflicts", "Explain margin variance"], roles: ["Estimator carries scope forward", "Project manager sees commitments", "Finance traces costs"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "commercial-cleaning", name: "Commercial Cleaning", title: "Deliver every scheduled service and make exceptions visible early.",
    body: "Manage prospects, sites, recurring service, staff schedules, supplies, issues, inspections, invoices, and customer communication.",
    pains: ["Recurring work managed in disconnected calendars", "Site instructions hard to keep current", "Exceptions surface after customer complaints"], products: ["crm", "appointments", "erp", "voice", "payments", "sites"],
    scenarios: [["open a new customer site", ["Capture scope and access", "Build recurring schedule", "Assign team and supplies", "Confirm customer expectations"]], ["recover a missed shift", ["Receive the exception", "Find available qualified staff", "Notify the customer", "Track completion"]], ["turn inspection findings into action", ["Record issue and location", "Assign corrective work", "Verify completion", "Update the customer"]]],
    ai: ["Detect recurring service risk", "Summarize site instructions", "Draft customer exception updates"], roles: ["Scheduler covers shifts", "Supervisor manages sites", "Owner monitors contract delivery"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "logistics-and-transportation", name: "Logistics and Transportation", title: "Connect the customer promise to the movement, exception, and invoice.",
    body: "Bring accounts, quotes, orders, fleet or asset context, dispatch communication, exception work, billing, and reporting into one operational trail.",
    pains: ["Customer and dispatch systems split", "Exceptions handled off-record", "Billing lacks operational evidence"], products: ["crm", "erp", "voice", "protect", "ai"],
    scenarios: [["quote and accept a shipment", ["Capture lanes and requirements", "Build pricing", "Confirm capacity", "Create the operational order"]], ["manage a delivery exception", ["Receive the event", "Resolve customer and shipment", "Assign corrective action", "Communicate status"]], ["prepare the invoice with evidence", ["Confirm completion", "Attach approved charges", "Resolve exceptions", "Issue and reconcile invoice"]]],
    ai: ["Summarize active exceptions", "Prioritize customer communication", "Explain charge variance"], roles: ["Account team sees service history", "Dispatcher manages exceptions", "Finance sees delivery evidence"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "automotive", name: "Automotive", title: "Keep the vehicle, customer, appointment, work, parts, and payment on one visit.",
    body: "Coordinate service booking, phone calls, vehicle and customer context, estimates, work status, inventory, payment, and future maintenance reminders.",
    pains: ["High inbound call volume", "Vehicle history separated from customer communication", "Parts and work status unclear"], products: ["appointments", "voice", "crm", "erp", "payments", "commerce"],
    scenarios: [["book the right service visit", ["Identify customer and vehicle", "Capture concern", "Estimate time and resources", "Confirm appointment"]], ["approve additional work", ["Record findings", "Prepare clear estimate", "Request customer approval", "Update work and parts"]], ["finish the visit and preserve the relationship", ["Confirm completed work", "Take terminal payment", "Issue records", "Schedule future reminder"]]],
    ai: ["Summarize vehicle interactions", "Draft approval explanations", "Recommend maintenance follow-up"], roles: ["Advisor manages customer communication", "Technician sees approved work", "Parts and finance reconcile the visit"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "dealerships-and-equipment-sales", name: "Dealerships and Equipment Sales", title: "Manage the whole account around the machine—not just the deal.",
    body: "Connect leads, organizations, equipment, quotes, trade or rental context, parts, service, financing steps, delivery, and long-term account activity.",
    pains: ["Long buying cycles", "Equipment context fragmented", "Sales and post-sale teams lose the handoff"], products: ["crm", "commerce", "rentals", "erp", "voice", "payments"],
    scenarios: [["build an equipment opportunity", ["Map account and stakeholders", "Capture equipment need", "Configure quote", "Schedule follow-up"]], ["coordinate delivery and acceptance", ["Confirm inventory and prep", "Schedule delivery", "Capture acceptance", "Open service relationship"]], ["surface the next account opportunity", ["Review owned and rented fleet", "Identify lifecycle signals", "Prepare recommendation", "Assign seller action"]]],
    ai: ["Summarize account fleet", "Draft configuration options", "Identify lifecycle opportunities"], roles: ["Seller manages stakeholders", "Operations prepares delivery", "Service sees equipment history"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "equipment-rental", name: "Equipment Rental", title: "Promise the right machine, deliver it ready, and turn it faster.",
    body: "Run availability, rate quoting, reservations, serialized fleet, dispatch, delivery, inspection, maintenance, returns, payment, and customer history.",
    pains: ["Availability uncertainty", "Asset condition learned too late", "Dispatch and finance disconnected"], products: ["rentals", "crm", "erp", "payments", "voice", "protect"],
    scenarios: [["quote a date-critical rental", ["Capture job requirements", "Check combination availability", "Apply rate rules", "Reserve assets"]], ["stage and dispatch the order", ["Pick serialized units", "Complete pre-delivery checks", "Assign delivery", "Confirm on-rent status"]], ["return and ready the fleet", ["Scan returned assets", "Inspect condition", "Assess charges or maintenance", "Release availability"]]],
    ai: ["Recommend available alternatives", "Flag turn-risk reservations", "Summarize asset condition history"], roles: ["Counter staff quotes confidently", "Yard team stages assets", "Fleet manager sees utilization and readiness"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "manufacturing", name: "Manufacturing", title: "Connect demand, material, production work, customer commitments, and financial result.",
    body: "Coordinate customers, forecasts, orders, purchasing, inventory, work, quality tasks, shipping, invoices, and operational reporting.",
    pains: ["Demand and inventory viewed separately", "Exceptions live in spreadsheets", "Customer commitments outpace production context"], products: ["erp", "crm", "commerce", "voice", "protect", "ai"],
    scenarios: [["turn an order into material demand", ["Confirm customer order", "Resolve product and configuration", "Check inventory and supply", "Open required work"]], ["manage a production exception", ["Record shortage or quality issue", "Assess affected commitments", "Assign corrective work", "Update customer-facing teams"]], ["ship and recognize the result", ["Confirm completion", "Pack and ship", "Create invoice", "Review cost and margin"]]],
    ai: ["Explain material risk", "Summarize affected orders", "Flag margin and schedule variance"], roles: ["Planner sees demand", "Operations manages exceptions", "Account team sees customer impact"],
  }),
  industry("Trades, Field and Fleet", {
    slug: "oil-and-gas", name: "Oil and Gas", title: "Keep field assets, contractors, service work, customer commitments, and controls visible.",
    body: "Connect accounts, projects, rental or owned equipment, dispatch, inspections, maintenance, purchasing, communication, billing, and governed records.",
    pains: ["Remote asset and service visibility", "Complex contractor coordination", "High consequence of missing inspection or maintenance context"], products: ["rentals", "erp", "crm", "voice", "protect", "ai"],
    scenarios: [["mobilize equipment to a site", ["Confirm customer and site", "Select compliant available assets", "Complete pre-dispatch checks", "Track delivery and on-rent state"]], ["respond to a field exception", ["Receive call or alert", "Resolve site and equipment", "Assign qualified response", "Record evidence and status"]], ["prepare billing from field records", ["Confirm time and equipment usage", "Attach approved extras", "Resolve discrepancies", "Issue invoice"]]],
    ai: ["Summarize site and asset history", "Flag overdue controls", "Prepare exception communication"], roles: ["Dispatcher coordinates field response", "Asset manager sees readiness", "Finance traces billable evidence"], caveat: "Configuration must match applicable safety, environmental, records, and contractor-control requirements; Sidekick does not replace certified operational controls.",
  }),
  industry("Trades, Field and Fleet", {
    slug: "agribusiness", name: "Agribusiness", title: "Coordinate seasonal demand, equipment, customers, inventory, and field service.",
    body: "Connect growers and accounts, equipment sales or rentals, parts, service appointments, dispatch, inventory, payments, and seasonal communication.",
    pains: ["Seasonal demand compresses response time", "Equipment and parts context split", "Field service communication is manual"], products: ["crm", "rentals", "erp", "appointments", "voice", "payments"],
    scenarios: [["prepare for a seasonal demand window", ["Review account and fleet history", "Forecast likely equipment or parts", "Reserve inventory", "Schedule proactive outreach"]], ["dispatch urgent field service", ["Identify customer and equipment", "Capture location and issue", "Find qualified availability", "Send technician prepared"]], ["complete a parts and service visit", ["Record work and parts", "Take payment if required", "Update equipment history", "Plan next maintenance"]]],
    ai: ["Identify seasonal account needs", "Summarize equipment history", "Prioritize field-service requests"], roles: ["Account manager prepares customers", "Parts team sees demand", "Service coordinator dispatches work"],
  }),

  industry("Storefront and Multi-Location", {
    slug: "retail", name: "Retail", title: "Make every sale update the customer, inventory, and next decision.",
    body: "Connect products, pricing, stores, online orders, POS, terminal payments, inventory, returns, customer history, and multi-location reporting.",
    pains: ["Online and store inventory diverge", "Customer history ends at checkout", "Returns are difficult to reconcile"], products: ["commerce", "payments", "crm", "erp", "sites"],
    scenarios: [["sell the last unit from the right location", ["Check location inventory", "Reserve the item", "Take terminal or online payment", "Update stock and customer history"]], ["handle an exchange cleanly", ["Find the original order", "Inspect returned item", "Apply exchange and price rules", "Reconcile inventory and payment"]], ["follow up after a meaningful purchase", ["Recognize the customer", "Review product and preference context", "Prepare relevant outreach", "Track response"]]],
    ai: ["Explain inventory risk", "Suggest relevant customer follow-up", "Summarize return patterns"], roles: ["Associate sees customer and stock", "Manager sees store performance", "Merchandiser sees demand"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "restaurants-and-food-service", name: "Restaurants and Food Service", title: "Connect the guest, order, payment, location, and business behind the shift.",
    body: "Coordinate products, menus, orders, terminal payments, reservations or bookings, customer relationships, purchasing, inventory, and location reporting.",
    pains: ["Guest and payment context fragmented", "Location performance difficult to compare", "Catering inquiries handled manually"], products: ["commerce", "payments", "appointments", "crm", "erp", "voice"],
    scenarios: [["take and fulfil a counter order", ["Build the order", "Take terminal payment", "Route fulfilment", "Record sale and stock movement"]], ["turn a catering inquiry into an order", ["Capture event needs", "Prepare proposal", "Collect deposit", "Schedule production and delivery"]], ["compare locations after service", ["Review sales and payment mix", "Assess product and labour signals", "Identify exceptions", "Assign follow-up"]]],
    ai: ["Summarize catering requirements", "Flag location exceptions", "Draft guest follow-up"], roles: ["Frontline takes payment", "Manager runs the shift", "Owner compares locations"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "hospitality", name: "Hospitality", title: "Give every guest request a clear owner and every location shared context.",
    body: "Connect guest relationships, phone and message routing, bookings or appointments, service requests, commerce, payment, locations, and operational follow-up.",
    pains: ["Requests cross departments", "Guest context is inconsistent", "Multi-location standards are hard to inspect"], products: ["crm", "voice", "appointments", "commerce", "payments", "erp"],
    scenarios: [["route a guest request to completion", ["Identify guest and stay context", "Classify the request", "Assign the right team", "Confirm completion"]], ["coordinate a paid experience", ["Publish availability", "Take booking and deposit", "Send preparation details", "Record attendance and payment"]], ["recover a service exception", ["Capture the issue", "Review guest history", "Authorize the response", "Record outcome and follow-up"]]],
    ai: ["Summarize guest context", "Route requests by policy", "Prepare recovery communication"], roles: ["Front desk sees history", "Operations owns requests", "Manager reviews exceptions"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "franchises-and-multi-location", name: "Franchises and Multi-Location", title: "Give every location room to operate without losing system-wide control.",
    body: "Standardize customer, commerce, appointments, voice, finance, protection, and reporting while preserving location-level ownership and visibility.",
    pains: ["Inconsistent location workflows", "Central reporting arrives late", "Permissions and ownership become unclear"], products: ["crm", "commerce", "appointments", "erp", "voice", "protect"],
    scenarios: [["launch a new location", ["Create location and permissions", "Publish catalogue and services", "Configure numbers and hardware", "Open operational readiness tasks"]], ["compare an exception across locations", ["Identify outlier signal", "Resolve source transactions", "Assign local action", "Track central review"]], ["roll out a controlled change", ["Define policy and effective date", "Target locations", "Capture acknowledgement", "Verify adoption"]]],
    ai: ["Explain location variance", "Prepare rollout tasks", "Summarize readiness gaps"], roles: ["Location manager owns local work", "Regional operator compares performance", "Administrator governs access"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "wholesale-distribution", name: "Wholesale Distribution", title: "Connect account pricing, inventory, orders, fulfilment, and cash.",
    body: "Manage customer-specific relationships, catalogues, price lists, inventory, orders, purchasing, warehouse work, shipping, invoices, and collections.",
    pains: ["Customer pricing is difficult to govern", "Inventory and order promises diverge", "Collections lack account context"], products: ["commerce", "erp", "crm", "payments", "voice"],
    scenarios: [["create a customer-specific order", ["Identify account and terms", "Apply the right price list", "Check availability", "Confirm order"]], ["fulfil across warehouses", ["Reserve inventory", "Create pick and transfer work", "Ship and notify", "Update financial records"]], ["resolve an overdue account", ["Review relationship and invoices", "Identify dispute or promise", "Assign outreach", "Record payment outcome"]]],
    ai: ["Explain availability risk", "Summarize account terms and disputes", "Prioritize collections"], roles: ["Seller sees account pricing", "Warehouse sees fulfilment work", "Finance sees customer context"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "property-management", name: "Property Management", title: "Keep every property, owner, resident, vendor, and service request connected.",
    body: "Coordinate relationships, sites, phone calls, appointments, work requests, projects, vendor spend, payment, documents, and portfolio reporting.",
    pains: ["Requests lack property context", "Vendor work and owner communication split", "Portfolio data is hard to compare"], products: ["crm", "appointments", "voice", "erp", "payments", "protect"],
    scenarios: [["route a property service request", ["Identify resident and property", "Capture issue and access", "Assign vendor or team", "Track completion"]], ["coordinate a unit turnover", ["Open turnover project", "Schedule inspections and work", "Track cost and readiness", "Confirm completion"]], ["prepare an owner update", ["Collect approved property activity", "Summarize open work and financials", "Review exceptions", "Send and record"]]],
    ai: ["Summarize property history", "Prioritize service requests", "Draft owner updates"], roles: ["Coordinator manages requests", "Property manager sees portfolio context", "Finance traces property costs"],
  }),
  industry("Storefront and Multi-Location", {
    slug: "real-estate", name: "Real Estate", title: "Keep every lead, property conversation, appointment, and referral moving.",
    body: "Connect contacts, households, properties, pipelines, calls, showings, tasks, documents, referrals, and long-cycle follow-up.",
    pains: ["Lead follow-up inconsistent", "Property and relationship context split", "Referral history gets lost"], products: ["crm", "appointments", "voice", "sites", "ai"],
    scenarios: [["respond to a new property inquiry", ["Match contact and source", "Capture needs", "Assign agent", "Book the next conversation"]], ["prepare for a showing day", ["Review contacts and properties", "Confirm appointments", "Surface relevant notes", "Plan follow-up"]], ["nurture a long-cycle relationship", ["Track milestone and timing", "Prepare useful update", "Schedule outreach", "Record response and referrals"]]],
    ai: ["Summarize client preferences", "Draft property follow-up", "Identify neglected opportunities"], roles: ["Agent sees relationship context", "Coordinator manages appointments", "Broker reviews pipeline"], caveat: "Configure consent, communications, representation, record, and advertising practices for the applicable jurisdiction.",
  }),
  industry("Storefront and Multi-Location", {
    slug: "education-and-training", name: "Education and Training", title: "Connect inquiry, enrolment, scheduling, payment, delivery, and learner follow-up.",
    body: "Coordinate programmes, cohorts, learners or clients, appointments, instructors, payments, communication, projects, and operational reporting.",
    pains: ["Enrolment and delivery records split", "Instructor scheduling is manual", "Learner follow-up lacks ownership"], products: ["crm", "appointments", "commerce", "payments", "erp", "sites"],
    scenarios: [["turn an inquiry into enrolment", ["Capture programme interest", "Qualify timing and fit", "Collect registration and payment", "Open onboarding tasks"]], ["coordinate a cohort change", ["Identify affected learners", "Update instructor and room", "Notify participants", "Track acknowledgements"]], ["follow up after completion", ["Record completion", "Issue approved documentation", "Request feedback", "Offer the next relevant programme"]]],
    ai: ["Summarize learner communication", "Identify enrolment gaps", "Draft programme follow-up"], roles: ["Advisor manages inquiries", "Coordinator runs schedules", "Instructor sees prepared rosters"], caveat: "Student records, consent, accessibility, and credential requirements vary by jurisdiction and programme.",
  }),

  industry("Professional and Regulated", {
    slug: "law-firms", name: "Law Firms", title: "Keep every relationship, matter-adjacent task, call, appointment, and invoice accountable.",
    body: "Connect organizations, contacts, intake, conflicts workflow, phone routing, appointments, projects, documents, time, billing, collections, and protected business records.",
    pains: ["Intake context fragmented", "Calls and follow-up lack ownership", "Billing questions arrive without relationship context"], products: ["crm", "voice", "appointments", "erp", "protect", "ai"],
    scenarios: [["move an inquiry through controlled intake", ["Capture contact and matter summary", "Run the firm's required checks", "Assign reviewer", "Schedule approved next step"]], ["prepare for a client call", ["Review relationship and open work", "Surface commitments", "Build the agenda", "Record follow-up"]], ["resolve an invoice question", ["Identify client and invoice", "Review approved billing context", "Record resolution", "Assign collection or adjustment action"]]],
    ai: ["Summarize approved client context", "Identify unresolved commitments", "Draft administrative communication"], roles: ["Intake team manages qualification", "Professional sees relationship context", "Finance manages billing"], caveat: "Configure confidentiality, privilege, conflicts, retention, supervision, and jurisdiction-specific professional obligations. Sidekick does not provide legal advice.",
  }),
  industry("Professional and Regulated", {
    slug: "accountants-and-bookkeepers", name: "Accountants and Bookkeepers", title: "Run recurring client work, deadlines, communication, and billing from one account view.",
    body: "Connect client organizations, contacts, recurring services, document requests, appointments, projects, tasks, invoices, collections, and protected records.",
    pains: ["Recurring deadlines managed manually", "Document chasing consumes staff time", "Client service and billing records split"], products: ["crm", "erp", "appointments", "voice", "protect", "ai"],
    scenarios: [["open a recurring client period", ["Generate standard work", "Assign owners and dates", "Request required documents", "Track readiness"]], ["prepare a client review", ["Summarize open work", "Identify missing information", "Build agenda", "Schedule follow-up"]], ["manage a billing exception", ["Review service and invoice context", "Resolve scope or payment issue", "Record decision", "Update collection plan"]]],
    ai: ["Summarize client status", "Draft document reminders", "Flag deadline and collection risk"], roles: ["Partner sees client health", "Staff owns recurring work", "Administrator tracks documents and billing"], caveat: "Professional standards, client confidentiality, records, and financial-reporting obligations remain with qualified professionals and approved systems.",
  }),
  industry("Professional and Regulated", {
    slug: "financial-services", name: "Financial Services", title: "Give relationship teams governed context without loosening control.",
    body: "Connect organizations, households, stakeholders, appointments, communication, tasks, documents, approvals, billing, audit, and protection controls.",
    pains: ["Complex relationship structures", "Communication and approval obligations", "Sensitive data spread across tools"], products: ["crm", "appointments", "voice", "erp", "protect", "ai"],
    scenarios: [["prepare a relationship review", ["Gather approved customer context", "Identify open actions", "Complete required checks", "Build the meeting record"]], ["route a controlled customer request", ["Authenticate and classify", "Apply policy", "Assign authorized owner", "Record outcome"]], ["monitor unresolved commitments", ["Review due actions", "Prioritize by policy", "Escalate exceptions", "Capture completion evidence"]]],
    ai: ["Summarize permissioned records", "Explain outstanding actions", "Draft supervised communication"], roles: ["Advisor sees relationship context", "Operations manages controls", "Supervisor reviews exceptions"], caveat: "Licensing, suitability, supervision, books-and-records, consent, privacy, and communications requirements must be configured for each regulated activity. Sidekick does not provide financial advice.",
  }),
  industry("Professional and Regulated", {
    slug: "insurance", name: "Insurance", title: "Connect producers, customers, policies, service requests, renewals, and communication.",
    body: "Manage relationships, opportunities, calls, appointments, renewal tasks, documents, service requests, billing context, and governed follow-up around approved policy systems.",
    pains: ["Renewal work starts too late", "Service requests lack shared context", "Producer and operations handoffs are manual"], products: ["crm", "voice", "appointments", "erp", "protect", "ai"],
    scenarios: [["prepare an upcoming renewal", ["Review customer and policy context", "Identify required updates", "Assign outreach", "Track quote and decision"]], ["route a policy service request", ["Identify customer", "Capture request", "Apply authorization workflow", "Track completion"]], ["hand a won account to service", ["Carry approved scope", "Create onboarding tasks", "Assign service owner", "Confirm customer readiness"]]],
    ai: ["Summarize account history", "Prioritize renewals", "Draft supervised service communication"], roles: ["Producer manages opportunity", "Account manager runs service", "Operations tracks controlled work"], caveat: "Configure licensing, disclosure, suitability, consent, record, and carrier-system requirements. Sidekick does not underwrite risk or provide insurance advice.",
  }),
  industry("Professional and Regulated", {
    slug: "professional-services", name: "Professional Services", title: "Carry the promise from opportunity through project, invoice, and renewal.",
    body: "Connect customer relationships, proposals, resource planning, projects, time, deliverables, billing, collections, and account growth.",
    pains: ["Sales scope changes in delivery", "Resource and project context split", "Margin arrives after the work"], products: ["crm", "erp", "appointments", "voice", "ai", "sites"],
    scenarios: [["hand a proposal into delivery", ["Carry scope and commercial terms", "Open project plan", "Assign team", "Confirm kickoff"]], ["manage a scope decision", ["Record request", "Assess schedule and margin", "Route approval", "Update project and customer"]], ["prepare an account growth review", ["Summarize delivered work", "Review open needs", "Identify opportunity", "Assign follow-up"]]],
    ai: ["Summarize engagement status", "Explain margin variance", "Draft account follow-up"], roles: ["Seller owns relationship", "Project lead manages delivery", "Finance connects work to billing"],
  }),
  industry("Professional and Regulated", {
    slug: "engineering-firms", name: "Engineering Firms", title: "Connect pursuits, projects, technical teams, approvals, time, and commercial control.",
    body: "Manage client relationships, proposals, projects, staffing, milestones, documents, time, costs, invoices, and governed review workflows.",
    pains: ["Pursuit and project handoff gaps", "Resource conflicts across engagements", "Approval evidence fragmented"], products: ["crm", "erp", "appointments", "voice", "protect", "ai"],
    scenarios: [["turn a pursuit into a project", ["Carry client and scope context", "Create project and budget", "Assign discipline leads", "Schedule kickoff"]], ["route a technical review", ["Select controlled milestone", "Assign reviewers", "Capture comments and approval", "Release the next task"]], ["review portfolio capacity", ["Compare committed work", "Identify resource conflicts", "Model reassignment", "Notify project leads"]]],
    ai: ["Summarize project commitments", "Flag resource collisions", "Prepare review agendas"], roles: ["Principal sees client and portfolio", "Project manager coordinates delivery", "Finance reviews utilization and margin"], caveat: "Professional sealing, technical approval, quality, document control, and records remain with qualified professionals and approved engineering systems.",
  }),
  industry("Professional and Regulated", {
    slug: "architecture-and-design", name: "Architecture and Design", title: "Keep the client vision, project decisions, team work, and billing aligned.",
    body: "Connect inquiries, proposals, projects, appointments, stakeholder communication, milestones, time, expenses, invoices, and portfolio follow-up.",
    pains: ["Decision history scattered", "Scope and billing drift", "Client updates assembled manually"], products: ["crm", "erp", "appointments", "voice", "protect", "sites"],
    scenarios: [["move a design inquiry to kickoff", ["Capture project vision", "Qualify scope and timing", "Build proposal", "Open the project"]], ["record a client design decision", ["Prepare decision context", "Capture approval", "Update scope and tasks", "Preserve history"]], ["prepare a milestone invoice", ["Confirm completed work", "Review time and expenses", "Resolve scope changes", "Issue invoice"]]],
    ai: ["Summarize decision history", "Flag scope drift", "Draft client milestone updates"], roles: ["Principal manages relationship", "Designer sees decisions", "Project administrator tracks scope and billing"], caveat: "Professional sign-off, technical documents, and records remain in approved discipline-specific systems and with qualified professionals.",
  }),
  industry("Professional and Regulated", {
    slug: "staffing-and-recruiting", name: "Staffing and Recruiting", title: "Keep every client need, candidate conversation, interview, placement, and follow-up moving.",
    body: "Connect companies, contacts, opportunities, candidate relationships, calls, appointments, tasks, proposals, placements, billing, and long-cycle nurturing.",
    pains: ["Client and candidate context split", "Interview scheduling consumes time", "Follow-up depends on individual memory"], products: ["crm", "appointments", "voice", "erp", "ai", "sites"],
    scenarios: [["turn a hiring need into a live search", ["Capture role and stakeholders", "Qualify commercial terms", "Open search workflow", "Assign recruiter"]], ["coordinate interviews", ["Match calendars", "Confirm participants", "Send preparation", "Record outcome"]], ["maintain the relationship after placement", ["Schedule check-ins", "Capture feedback", "Resolve issues", "Identify future demand"]]],
    ai: ["Summarize client and candidate activity", "Draft interview preparation", "Flag stalled searches"], roles: ["Account lead owns client", "Recruiter runs search", "Coordinator manages interviews"], caveat: "Configure consent, equality, privacy, automated-decision, retention, and employment requirements for each jurisdiction. Human review remains required for consequential decisions.",
  }),
  industry("Professional and Regulated", {
    slug: "non-profits", name: "Non-Profits", title: "Connect supporters, programmes, volunteers, appointments, payments, and accountable work.",
    body: "Manage organizations, households, relationships, campaigns, service or programme bookings, projects, payments, communication, and operational reporting.",
    pains: ["Supporter and programme records split", "Volunteer coordination is manual", "Impact reporting requires exports"], products: ["crm", "appointments", "payments", "erp", "sites", "voice"],
    scenarios: [["turn an inquiry into programme participation", ["Capture person and need", "Apply eligibility workflow", "Book the next step", "Track participation"]], ["coordinate a volunteer shift", ["Publish requirements", "Match availability", "Confirm and remind", "Record completion"]], ["follow a contribution into stewardship", ["Record payment", "Issue acknowledgement", "Update supporter history", "Assign appropriate follow-up"]]],
    ai: ["Summarize supporter history", "Identify missing programme follow-up", "Draft stewardship communication"], roles: ["Programme team sees participant context", "Volunteer coordinator fills shifts", "Fundraising team sees relationship history"], caveat: "Consent, safeguarding, charitable-receipt, grant, and programme eligibility requirements vary and require organization-specific controls.",
  }),

  industry("Technology Operators", {
    slug: "managed-service-providers", name: "Managed Service Providers", title: "Run tickets, endpoints, projects, contracts, billing, and customer growth as one MSP.",
    body: "Connect service desk, RMM, assets, automation, projects, agreements, customer portal, voice, billing, and AI-assisted operations.",
    pains: ["PSA and RMM context split", "Order-to-onboarding handoffs fail", "Customer and service health viewed separately"], products: ["msp", "crm", "voice", "erp", "protect", "ai"],
    scenarios: [["resolve an endpoint alert with customer context", ["Correlate alert and asset", "Open customer and contract", "Run or assign remediation", "Document resolution"]], ["turn a sold service into onboarding", ["Accept order", "Create delivery plan", "Provision entitlements", "Confirm readiness"]], ["prepare a client service review", ["Summarize tickets and assets", "Review projects and protection", "Identify risks and opportunities", "Build the meeting plan"]]],
    ai: ["Summarize service history", "Recommend next remediation", "Prepare client review"], roles: ["Technician sees assets and contracts", "Service manager sees queues", "Owner sees delivery and growth"],
  }),
  industry("Technology Operators", {
    slug: "technology-and-saas", name: "Technology and SaaS", title: "Connect the buying journey, onboarding, product-facing work, billing, and renewal.",
    body: "Manage accounts, opportunities, calls, appointments, proposals, projects, support work, subscriptions, payments, sites, and AI Agents around the customer lifecycle.",
    pains: ["Sales and onboarding context drops", "Customer work scattered across systems", "Renewal risk assembled manually"], products: ["crm", "erp", "appointments", "voice", "sites", "ai"],
    scenarios: [["hand a new customer into onboarding", ["Carry goals and scope", "Create onboarding plan", "Assign owners", "Track readiness"]], ["prepare a renewal decision", ["Summarize relationship and open work", "Review commercial history", "Identify risk and value", "Assign outreach"]], ["deploy a customer-facing AI Agent", ["Define role and tools", "Set permissions and credits", "Test human handoff", "Publish and monitor"]]],
    ai: ["Summarize account health", "Draft onboarding communication", "Operate approved customer workflows"], roles: ["Seller owns commercial path", "Customer team owns outcomes", "Finance tracks recurring value"],
  }),
  industry("Technology Operators", {
    slug: "it-service-providers", name: "IT Service Providers", title: "Keep projects, field service, support, products, and customer commitments on one record.",
    body: "Connect inquiries, proposals, orders, projects, tickets, appointments, phone service, inventory, payment, billing, and ongoing account management.",
    pains: ["Project and support work split", "Hardware and service orders lose context", "Customer communication is reactive"], products: ["msp", "crm", "erp", "appointments", "voice", "payments"],
    scenarios: [["quote a mixed hardware and service project", ["Capture requirements", "Configure products and services", "Build proposal", "Open delivery after acceptance"]], ["dispatch an onsite technician", ["Resolve customer and site", "Review asset and ticket", "Book qualified availability", "Send prepared technician"]], ["turn project completion into managed service", ["Confirm delivered state", "Offer service package", "Activate agreement", "Open recurring operations"]]],
    ai: ["Summarize site and asset context", "Draft project scope", "Identify recurring-service fit"], roles: ["Seller configures solution", "Technician sees site history", "Service manager coordinates work"],
  }),
  industry("Technology Operators", {
    slug: "multi-entity-operators", name: "Multi-Entity Operators", title: "Run shared customers and operations without blurring entity control.",
    body: "Coordinate organizations, locations, entities, permissions, catalogues, orders, finance, reporting, voice, protection, and governed workflows.",
    pains: ["Entity ownership unclear", "Shared services duplicate records", "Consolidated reporting lacks traceability"], products: ["erp", "crm", "commerce", "voice", "protect", "ai"],
    scenarios: [["onboard a new operating entity", ["Create identity and controls", "Assign products and permissions", "Publish catalogues and workflows", "Verify readiness"]], ["handle a shared customer correctly", ["Resolve relationship and entity", "Apply correct terms and tax", "Route operational work", "Record entity-specific result"]], ["review consolidated variance", ["Compare entity performance", "Trace source transactions", "Explain exceptions", "Assign local action"]]],
    ai: ["Explain entity variance", "Summarize cross-entity relationships", "Flag control and readiness gaps"], roles: ["Entity leader sees local operations", "Shared service team sees assigned work", "Group finance sees traceable consolidation"], caveat: "Legal entity, tax, accounting, employment, privacy, and data-residency configurations require qualified review for each operating jurisdiction.",
  }),
  industry("Technology Operators", {
    slug: "internal-service-desks", name: "Internal Service Desks", title: "Give employees one place to ask and service teams one accountable queue.",
    body: "Connect requesters, tickets, assets, alerts, approvals, knowledge, projects, communication, automation, and service reporting inside the organization.",
    pains: ["Requests arrive through too many channels", "Asset context missing during triage", "Approvals and handoffs slow resolution"], products: ["msp", "crm", "voice", "appointments", "protect", "ai"],
    scenarios: [["turn an employee request into routed work", ["Identify requester and service", "Capture required details", "Apply priority and routing", "Track resolution"]], ["resolve an alert before it becomes a request", ["Correlate alert and asset", "Assess impact", "Run or assign remediation", "Notify affected users"]], ["coordinate a scheduled support session", ["Offer qualified availability", "Confirm user and device", "Send preparation", "Record outcome"]]],
    ai: ["Summarize requester and asset context", "Suggest routing and knowledge", "Draft resolution communication"], roles: ["Employee gets a clear request path", "Technician sees context", "Service owner sees demand and outcomes"],
  }),
] as const;

export const getIndustry = (slug: string) =>
  INDUSTRIES.find((candidate) => candidate.slug === slug);
