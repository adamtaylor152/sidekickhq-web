export type CountryCode = "CA" | "US";
export type BillingCadence = "monthly" | "annual";

export interface PriceOffer {
  readonly key: string;
  readonly name: string;
  readonly product: string;
  readonly unit: string;
  readonly usdMonthly: number;
  readonly trialEligible: boolean;
}

const offer = (key:string,name:string,product:string,unit:string,usdMonthly:number,trialEligible=true):PriceOffer => ({key,name,product,unit,usdMonthly,trialEligible});

export const PRICE_OFFERS: readonly PriceOffer[] = [
  offer("crm.essentials","Essentials","Sidekick CRM","user / month",24), offer("crm.professional","Professional","Sidekick CRM","user / month",60), offer("crm.enterprise","Enterprise","Sidekick CRM","user / month",120),
  offer("msp.essentials","Essentials","Sidekick MSP","technician / month",90), offer("msp.professional","Professional","Sidekick MSP","technician / month",150), offer("msp.enterprise","Enterprise","Sidekick MSP","technician / month",210),
  offer("rentals.essentials","Essentials","Sidekick Rentals","organization / month",48), offer("rentals.professional","Professional","Sidekick Rentals","organization / month",96), offer("rentals.enterprise","Enterprise","Sidekick Rentals","organization / month",180),
  offer("commerce.essentials","Essentials","Sidekick Commerce","organization / month",48), offer("commerce.professional","Professional","Sidekick Commerce","organization / month",96), offer("commerce.enterprise","Enterprise","Sidekick Commerce","organization / month",180),
  offer("appointments.essentials","Essentials","Sidekick Appointments","location / month",24), offer("appointments.professional","Professional","Sidekick Appointments","location / month",48), offer("appointments.enterprise","Enterprise","Sidekick Appointments","location / month",90),
  offer("sites.essentials","Essentials","Sidekick Sites","site / month",24), offer("sites.professional","Professional","Sidekick Sites","site / month",48), offer("sites.enterprise","Enterprise","Sidekick Sites","site / month",90),
  offer("erp.full-user","Full User","Sidekick ERP","user / month",60), offer("erp.team-user","Team User","Sidekick ERP","user / month",18),
  offer("voice.business","Business Voice","Sidekick Voice","user / month",30,false), offer("voice.contact-center","Contact Centre","Sidekick Voice","agent / month",90,false), offer("voice.ai-receptionist","AI Reception","Sidekick Voice","number / month",36,false),
  offer("protect.workstation","Workstation","Sidekick Protect","device / month",12,false), offer("protect.server","Server","Sidekick Protect","server / month",36,false), offer("protect.cloud-user","Cloud User","Sidekick Protect","user / month",6,false),
  offer("ai.agent","AI Agent","Sidekick AI","agent / month",60), offer("ai.credits.10000","10,000 credits","Sidekick AI","pack",50,false),
];

export const localMonthlyPrice = (usd: number, country: CountryCode) => country === "CA" ? Math.round(usd * 1.4) : usd;
export const localAnnualPrice = (usd: number, country: CountryCode) => country === "CA" ? Math.round(usd * 10 * 1.4) : usd * 10;
export const currencyFor = (country: CountryCode) => country === "CA" ? "CAD" : "USD";
export const getPriceOffer = (key:string) => PRICE_OFFERS.find((candidate)=>candidate.key===key);

export const PHONE_HARDWARE = [
  ["yealink.t34w","Yealink T34W",163],["yealink.t33g","Yealink T33G",158],["yealink.t73u","Yealink T73U",209],["yealink.t73w","Yealink T73W",224],["yealink.t43u","Yealink T43U",219],["yealink.w76p","Yealink W76P",237],["yealink.t53w","Yealink T53W",255],["yealink.t74u","Yealink T74U",279],["yealink.t74w","Yealink T74W",283],["yealink.ax83h","Yealink AX83H",209],["yealink.ax86r","Yealink AX86R",309],["yealink.t85w","Yealink T85W",319],["yealink.t48u","Yealink T48U",329],["yealink.t77u","Yealink T77U",355],["yealink.t57w","Yealink T57W",359],["yealink.t87w","Yealink T87W",375],
  ["poly.edge-e220","Poly Edge E220",188],["poly.edge-e320","Poly Edge E320",258],["poly.edge-e350","Poly Edge E350",278],["poly.edge-e450","Poly Edge E450",361],["poly.edge-e550","Poly Edge E550",479],["poly.ccx-400","Poly CCX 400",309],["poly.ccx-505","Poly CCX 505",710],["poly.ccx-600","Poly CCX 600",889],["poly.rove-30","Poly Rove 30",728],["poly.rove-40","Poly Rove 40",780],["poly.trio-8300","Poly Trio 8300",890],["poly.trio-c60","Poly Trio C60",1370],
] as const;

export const TERMINAL_HARDWARE = [
  ["terminal.s710","S710 Smart Terminal",299,419],["terminal.m425","M425 Countertop Terminal",349,489],["terminal.mobile","Mobile Reader",59,79],
] as const;
