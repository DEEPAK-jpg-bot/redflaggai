// Industry-specific data for programmatic SEO pages
export interface IndustryData {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  commonRedFlags: string[];
  ebitdaAddBacks: string[];
  avgAskingMultiple: string;
  avgDealSize: string;
  keyMetrics: string[];
  faqs: { q: string; a: string }[];
}

export const industries: IndustryData[] = [
  {
    slug: 'hvac',
    name: 'HVAC',
    title: 'HVAC Company Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE analysis for HVAC acquisitions. Detect revenue seasonality issues, technician expense padding, and equipment inventory discrepancies in minutes.',
    heroTitle: 'HVAC Company Due Diligence',
    heroSubtitle: 'Specialized QoE analysis for heating, ventilation, and air conditioning businesses',
    commonRedFlags: [
      'Seasonal revenue smoothing through timing manipulation',
      'Technician labor costs miscategorized as subcontractors',
      'Personal vehicle expenses run through fleet accounts',
      'Service agreement revenue recognized upfront vs. over time',
      'Equipment inventory valuation discrepancies',
    ],
    ebitdaAddBacks: [
      'Owner vehicle and fuel expenses',
      'Family member salaries above market rate',
      'Personal cell phone and internet costs',
      'Owner health insurance premiums',
      'Non-recurring equipment repairs',
    ],
    avgAskingMultiple: '3.5-5x SDE',
    avgDealSize: '$1.5M - $8M',
    keyMetrics: [
      'Service vs. Install revenue mix',
      'Technician utilization rate',
      'Average ticket size',
      'Customer retention rate',
      'Seasonal revenue variance',
    ],
    faqs: [
      {
        q: 'What makes HVAC due diligence unique?',
        a: 'HVAC businesses have significant seasonality, with 60-70% of revenue often concentrated in summer and winter peaks. Our analysis normalizes for this and detects attempts to smooth revenue across periods.',
      },
      {
        q: 'How do you verify technician labor costs?',
        a: 'We cross-reference payroll records against bank deposits and flag discrepancies where 1099 contractors may actually be misclassified employees, which creates tax liability risk.',
      },
    ],
  },
  {
    slug: 'dental-practice',
    name: 'Dental Practice',
    title: 'Dental Practice Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for dental practice acquisitions. Verify production vs. collections, detect personal expenses, and analyze patient attrition in minutes.',
    heroTitle: 'Dental Practice Due Diligence',
    heroSubtitle: 'Specialized financial analysis for dental practice acquisitions and DSO roll-ups',
    commonRedFlags: [
      'Production vs. collection timing discrepancies',
      'Personal expenses coded as dental supplies',
      'Associate dentist compensation irregularities',
      'Patient count inflation through inactive records',
      'Insurance reimbursement timing manipulation',
    ],
    ebitdaAddBacks: [
      'Owner dentist salary above replacement cost',
      'Personal continuing education travel',
      'Family member administrative salaries',
      'Personal vehicle expenses',
      'Non-recurring equipment purchases',
    ],
    avgAskingMultiple: '70-85% of collections',
    avgDealSize: '$500K - $3M',
    keyMetrics: [
      'Production per hour',
      'Collection percentage',
      'Active patient count',
      'New patient acquisition cost',
      'Hygiene production ratio',
    ],
    faqs: [
      {
        q: 'Why is collections more important than production?',
        a: 'Production is what you bill; collections is what you actually receive. A practice with 95%+ collection rate is well-managed. Below 90% signals billing issues or bad debt.',
      },
      {
        q: 'How do you verify active patient counts?',
        a: 'We analyze visit frequency patterns. Practices sometimes inflate patient counts by including patients who haven\'t visited in 18+ months.',
      },
    ],
  },
  {
    slug: 'saas',
    name: 'SaaS',
    title: 'SaaS Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for SaaS acquisitions. Analyze ARR quality, churn cohorts, and revenue recognition in minutes. Trusted by search funds and PE firms.',
    heroTitle: 'SaaS Company Due Diligence',
    heroSubtitle: 'Specialized analysis for software-as-a-service business acquisitions',
    commonRedFlags: [
      'Annual contracts recognized monthly without adjustment',
      'Customer churn hidden through cohort mixing',
      'Professional services revenue mixed with SaaS',
      'Logo churn vs. revenue churn discrepancies',
      'Deferred revenue balance inconsistencies',
    ],
    ebitdaAddBacks: [
      'Founder salaries above market rate',
      'One-time development costs',
      'Personal SaaS subscriptions',
      'Conference and travel expenses',
      'Recruiting fees for key hires',
    ],
    avgAskingMultiple: '4-8x ARR',
    avgDealSize: '$2M - $20M',
    keyMetrics: [
      'Monthly Recurring Revenue (MRR)',
      'Net Revenue Retention (NRR)',
      'Customer Acquisition Cost (CAC)',
      'Lifetime Value (LTV)',
      'Gross margin',
    ],
    faqs: [
      {
        q: 'What is Net Revenue Retention and why does it matter?',
        a: 'NRR measures revenue from existing customers year-over-year, including upsells and churn. NRR above 100% means the business grows even without new customers. Below 90% is a red flag.',
      },
      {
        q: 'How do you verify ARR quality?',
        a: 'We analyze customer cohorts by signup date, contract terms, and payment history to ensure ARR isn\'t inflated by annual prepayments or one-time deals.',
      },
    ],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    title: 'Plumbing Company Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for plumbing business acquisitions. Detect labor cost manipulation, verify recurring revenue, and analyze customer concentration.',
    heroTitle: 'Plumbing Company Due Diligence',
    heroSubtitle: 'Specialized QoE analysis for residential and commercial plumbing businesses',
    commonRedFlags: [
      'Cash jobs not deposited through business accounts',
      'Material costs inflated with personal purchases',
      'Subcontractor payments to related parties',
      'Service agreement revenue recognition issues',
      'Vehicle expenses mixing personal and business use',
    ],
    ebitdaAddBacks: [
      'Owner salary and benefits above market',
      'Personal vehicle expenses',
      'Family member wages',
      'One-time equipment purchases',
      'Owner cell phone and tools',
    ],
    avgAskingMultiple: '2.5-4x SDE',
    avgDealSize: '$800K - $5M',
    keyMetrics: [
      'Recurring service agreement revenue %',
      'Average job ticket size',
      'Technician productivity',
      'Customer retention rate',
      'Commercial vs. residential mix',
    ],
    faqs: [
      {
        q: 'How common is unreported cash revenue in plumbing?',
        a: 'Very common in residential service. We use proof-of-cash analysis to compare bank deposits against booked revenue. Discrepancies often reveal cash that should increase the business value.',
      },
      {
        q: 'What\'s a healthy service agreement percentage?',
        a: 'Top plumbing businesses have 25-40% of revenue from recurring service agreements. This provides predictable cash flow and higher valuations.',
      },
    ],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    title: 'Landscaping Company Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for landscaping business acquisitions. Analyze seasonal revenue, labor costs, and equipment expenses in minutes.',
    heroTitle: 'Landscaping Company Due Diligence',
    heroSubtitle: 'Specialized financial analysis for lawn care and landscaping acquisitions',
    commonRedFlags: [
      'Seasonal revenue manipulation across periods',
      'Day laborer payments off the books',
      'Equipment maintenance costs inflated',
      'Fuel expenses mixed with personal vehicles',
      'Customer contract terms not matching deposits',
    ],
    ebitdaAddBacks: [
      'Owner and family salaries',
      'Personal vehicle and fuel use',
      'Non-recurring equipment purchases',
      'Owner health and life insurance',
      'Personal cell phone expenses',
    ],
    avgAskingMultiple: '2-3.5x SDE',
    avgDealSize: '$500K - $4M',
    keyMetrics: [
      'Recurring maintenance revenue %',
      'Revenue per crew',
      'Equipment age and condition',
      'Customer contract length',
      'Seasonal revenue variance',
    ],
    faqs: [
      {
        q: 'How do you handle seasonal fluctuations?',
        a: 'Landscaping typically has 70%+ revenue in 6 months. We normalize financials to 12-month trailing and verify that winter revenue (snow removal, holiday lighting) is properly categorized.',
      },
      {
        q: 'What labor red flags should I watch for?',
        a: 'Cash payments to day laborers create tax liability. We flag large cash withdrawals and verify all labor is properly documented with payroll or 1099s.',
      },
    ],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    title: 'Roofing Company Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for roofing business acquisitions. Verify job costing, subcontractor expenses, and insurance claim revenue.',
    heroTitle: 'Roofing Company Due Diligence',
    heroSubtitle: 'Specialized analysis for residential and commercial roofing acquisitions',
    commonRedFlags: [
      'Insurance claim revenue timing manipulation',
      'Subcontractor costs to related parties',
      'Material costs including personal purchases',
      'Job costing discrepancies',
      'Warranty reserve inconsistencies',
    ],
    ebitdaAddBacks: [
      'Owner compensation above market',
      'Personal vehicle and fuel',
      'Family administrative salaries',
      'One-time storm damage equipment',
      'Owner insurance premiums',
    ],
    avgAskingMultiple: '2.5-4x SDE',
    avgDealSize: '$1M - $6M',
    keyMetrics: [
      'Insurance vs. retail job mix',
      'Gross margin by job type',
      'Subcontractor vs. W-2 labor ratio',
      'Average job size',
      'Customer acquisition cost',
    ],
    faqs: [
      {
        q: 'Why is insurance vs. retail mix important?',
        a: 'Insurance jobs have higher gross margins but are weather-dependent and can fluctuate dramatically. A balanced mix of 40-60% insurance provides stability.',
      },
      {
        q: 'How do you verify subcontractor payments?',
        a: 'We cross-reference 1099 filings with bank payments and flag any payments to entities with unclear business purposes or related parties.',
      },
    ],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    title: 'Manufacturing Company Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for manufacturing acquisitions. Analyze inventory, COGS, and customer concentration with AI-powered due diligence.',
    heroTitle: 'Manufacturing Company Due Diligence',
    heroSubtitle: 'Specialized QoE analysis for manufacturing and production businesses',
    commonRedFlags: [
      'Inventory valuation methodology changes',
      'Customer concentration above 20%',
      'Related party raw material purchases',
      'Capitalized expenses that should be expensed',
      'Warranty and return reserve inadequacy',
    ],
    ebitdaAddBacks: [
      'Owner salary and benefits',
      'Related party rent above market',
      'One-time equipment costs',
      'Non-recurring consulting fees',
      'Personal expenses through the business',
    ],
    avgAskingMultiple: '3-5x EBITDA',
    avgDealSize: '$3M - $25M',
    keyMetrics: [
      'Gross margin by product line',
      'Inventory turnover',
      'Customer concentration',
      'Capacity utilization',
      'Working capital requirements',
    ],
    faqs: [
      {
        q: 'How do you analyze inventory for manufacturing businesses?',
        a: 'We verify FIFO/LIFO consistency, check for obsolete inventory reserves, and compare physical counts against book value. Inventory manipulation is the #1 red flag in manufacturing deals.',
      },
      {
        q: 'What\'s an acceptable customer concentration?',
        a: 'No single customer should exceed 15-20% of revenue. Higher concentration means the business is at risk if that customer leaves. We flag this as a major valuation risk.',
      },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    title: 'E-commerce Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for e-commerce acquisitions. Analyze revenue trends, customer LTV, and advertising ROI with AI-powered due diligence.',
    heroTitle: 'E-commerce Business Due Diligence',
    heroSubtitle: 'Specialized financial analysis for online retail and DTC brand acquisitions',
    commonRedFlags: [
      'Advertising spend classified as COGS',
      'Returns and chargebacks understated',
      'Customer acquisition cost trending up',
      'Inventory valuation inconsistencies',
      'Platform fee recognition timing',
    ],
    ebitdaAddBacks: [
      'Owner salary and management fees',
      'One-time branding/website costs',
      'Personal subscriptions and software',
      'Influencer deals coded as owner compensation',
      'Personal Amazon/shipping accounts',
    ],
    avgAskingMultiple: '3-5x SDE',
    avgDealSize: '$500K - $10M',
    keyMetrics: [
      'Customer acquisition cost (CAC)',
      'Lifetime value (LTV)',
      'Return rate',
      'Average order value',
      'Repeat purchase rate',
    ],
    faqs: [
      {
        q: 'Why is LTV:CAC ratio critical for e-commerce?',
        a: 'A healthy e-commerce business should have LTV:CAC of 3:1 or higher. Below 2:1 means the business is losing money acquiring customers and is unsustainable.',
      },
      {
        q: 'How do you verify Amazon revenue?',
        a: 'We reconcile Amazon Seller Central reports against bank deposits and accounting records. Fee structures and FBA costs are often miscategorized.',
      },
    ],
  },
  {
    slug: 'home-services',
    name: 'Home Services',
    title: 'Home Services Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for home services acquisitions. Analyze cleaning, pest control, and home maintenance businesses with AI-powered due diligence.',
    heroTitle: 'Home Services Due Diligence',
    heroSubtitle: 'Specialized analysis for recurring home service business acquisitions',
    commonRedFlags: [
      'Recurring revenue churn understated',
      'Technician labor costs miscategorized',
      'Route density and efficiency issues',
      'Customer acquisition cost inflation',
      'Service agreement terms inconsistencies',
    ],
    ebitdaAddBacks: [
      'Owner salary above market',
      'Personal vehicle expenses',
      'Family member wages',
      'One-time marketing campaigns',
      'Owner benefits and insurance',
    ],
    avgAskingMultiple: '3-5x SDE',
    avgDealSize: '$1M - $8M',
    keyMetrics: [
      'Recurring revenue percentage',
      'Customer retention rate',
      'Route density/efficiency',
      'Average revenue per customer',
      'Technician productivity',
    ],
    faqs: [
      {
        q: 'What makes home services businesses attractive?',
        a: 'High recurring revenue (70%+), predictable cash flow, and recession resistance. However, churn can be hidden in aggregate metrics—we analyze by customer cohort.',
      },
      {
        q: 'How do you verify recurring revenue quality?',
        a: 'We analyze customer payment history, contract terms, and churn by signup cohort. A business claiming 90% retention might have much lower cohort retention when analyzed properly.',
      },
    ],
  },
  {
    slug: 'insurance-agency',
    name: 'Insurance Agency',
    title: 'Insurance Agency Quality of Earnings Analysis | RedFlag.ai',
    metaDescription: 'Automated QoE for insurance agency acquisitions. Analyze book of business, commission structures, and carrier relationships.',
    heroTitle: 'Insurance Agency Due Diligence',
    heroSubtitle: 'Specialized analysis for P&C and life insurance agency acquisitions',
    commonRedFlags: [
      'Commission revenue recognition timing',
      'Contingent bonus income volatility',
      'Producer departure risk',
      'Book of business ownership disputes',
      'Carrier concentration above 40%',
    ],
    ebitdaAddBacks: [
      'Owner commission draws above market',
      'Personal vehicle and travel',
      'Family member salaries',
      'One-time licensing and training',
      'Owner benefits and perks',
    ],
    avgAskingMultiple: '2-3x revenue',
    avgDealSize: '$500K - $5M',
    keyMetrics: [
      'Policy retention rate',
      'New business vs. renewal split',
      'Average policy premium',
      'Commission per policy',
      'Producer dependency',
    ],
    faqs: [
      {
        q: 'Why is producer retention so important?',
        a: 'Top producers often control 30-50% of revenue. If they leave post-acquisition, the book erodes rapidly. We analyze producer-level revenue concentration and contract terms.',
      },
      {
        q: 'How do you value contingent commissions?',
        a: 'Contingent/bonus commissions can be 10-20% of revenue but are volatile. We typically exclude or heavily discount them in EBITDA calculations due to unpredictability.',
      },
    ],
  },
];

export const getIndustryBySlug = (slug: string): IndustryData | undefined => {
  return industries.find((ind) => ind.slug === slug);
};

export const getAllIndustrySlugs = (): string[] => {
  return industries.map((ind) => ind.slug);
};
