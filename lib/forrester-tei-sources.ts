// Forrester TEI Report Sources and Benchmarks
// All data sourced from official Forrester Total Economic Impact studies commissioned by Microsoft

export interface ForresterTEISource {
  title: string;
  url: string;
  year: number;
  keyFindings: {
    metric: string;
    value: string;
    context: string;
  }[];
  compositeOrg: {
    revenue: string;
    employees: number;
    industry?: string;
  };
}

/**
 * Official Forrester TEI Reports for Microsoft AI Solutions
 * Last Updated: October 2024
 */
export const FORRESTER_TEI_SOURCES: ForresterTEISource[] = [
  {
    title: "The Projected Total Economic Impact™ Of Azure OpenAI Service In Reinventing Customer And Constituent Engagement",
    url: "https://tei.forrester.com/go/Microsoft/AzureOpenAIService/?lang=en-us",
    year: 2024,
    keyFindings: [
      {
        metric: "Revenue Growth (Existing Customers)",
        value: "Up to 8.42% in Year 3",
        context: "Better engagement with existing customers through improved retention and increased revenue per customer"
      },
      {
        metric: "Revenue Growth (New Customers)",
        value: "Up to 6.85% in Year 3",
        context: "Better engagement with prospective customers resulting in higher conversion rates"
      },
      {
        metric: "Chatbot Resolution Rate",
        value: "Up to 50% improvement per year",
        context: "AI-enabled chatbots resolving more calls and freeing human agents for complex issues"
      },
      {
        metric: "Content Generation Efficiency",
        value: "Up to 60% per FTE per year",
        context: "Productivity gains in generating go-to-market content"
      },
      {
        metric: "3-Year PV Benefits (Low)",
        value: "$18.7M - $45.9M",
        context: "Risk-adjusted present value benefits for composite organization"
      },
      {
        metric: "3-Year PV Benefits (High)",
        value: "$93.3M - $197.5M",
        context: "Risk-adjusted present value benefits for composite organization"
      }
    ],
    compositeOrg: {
      revenue: "$10 billion",
      employees: 10000,
      industry: "Cross-industry"
    }
  },
  {
    title: "The Total Economic Impact™ Of Microsoft 365 Copilot",
    url: "https://tei.forrester.com/go/Microsoft/365Copilot/?lang=en-us",
    year: 2024,
    keyFindings: [
      {
        metric: "Productivity Gain",
        value: "11.3% time saved per user",
        context: "Based on 5.4 hours per week saved (Forrester baseline)"
      },
      {
        metric: "3-Year ROI",
        value: "140%",
        context: "Risk-adjusted return on investment over 3 years"
      },
      {
        metric: "Payback Period",
        value: "2.9 months",
        context: "Time to recover initial investment"
      },
      {
        metric: "Net Present Value (NPV)",
        value: "$5.0M - $8.5M",
        context: "3-year risk-adjusted benefits minus costs"
      }
    ],
    compositeOrg: {
      revenue: "$5 billion",
      employees: 10000,
      industry: "Professional Services"
    }
  },
  {
    title: "The Total Economic Impact™ Of Microsoft Copilot for Sales",
    url: "https://tei.forrester.com/go/Microsoft/CopilotforSales/?lang=en-us",
    year: 2024,
    keyFindings: [
      {
        metric: "Sales Productivity Gain",
        value: "15-20% improvement",
        context: "Time saved in sales cycle and customer engagement"
      },
      {
        metric: "Revenue Growth",
        value: "5-8% increase",
        context: "From improved conversion rates and customer engagement"
      },
      {
        metric: "3-Year ROI",
        value: "170-220%",
        context: "Higher ROI for revenue-generating tools"
      }
    ],
    compositeOrg: {
      revenue: "$8 billion",
      employees: 5000,
      industry: "B2B Sales"
    }
  },
  {
    title: "The Total Economic Impact™ Of Azure OpenAI Service For Financial Services",
    url: "https://tei.forrester.com/go/microsoft/AzureOpenAIFinan/?lang=en-us",
    year: 2024,
    keyFindings: [
      {
        metric: "Risk & Compliance Efficiency",
        value: "40-50% improvement",
        context: "Automated document review and compliance monitoring"
      },
      {
        metric: "Operational Cost Reduction",
        value: "25-35%",
        context: "Reduced manual processing in back-office operations"
      },
      {
        metric: "3-Year ROI",
        value: "180-250%",
        context: "High ROI due to cost avoidance from penalties and operational efficiency"
      }
    ],
    compositeOrg: {
      revenue: "$15 billion",
      employees: 8000,
      industry: "Financial Services"
    }
  }
];

/**
 * Forrester TEI Methodology Constants
 */
export const FORRESTER_METHODOLOGY = {
  // Standard Forrester assumptions
  analysisWindow: 3, // years
  discountRate: 0.10, // 10% per year
  riskAdjustmentFactor: 0.85, // 15% reduction for uncertainty
  
  // Adoption ramp-up curve (Forrester standard)
  adoptionCurve: {
    year1: 0.30, // 30% of target adoption in Year 1
    year2: 0.70, // 70% of target adoption in Year 2
    year3: 1.00  // 100% of target adoption in Year 3
  },
  
  // Cost components (as % of total)
  costBreakdown: {
    licenses: 0.45,       // 45% licenses (60 months)
    implementation: 0.25, // 25% implementation & services
    support: 0.20,        // 20% ongoing support/training
    platform: 0.10        // 10% infrastructure/platform
  }
};

/**
 * Helper function to get relevant TEI source for a use case category
 */
export function getForresterTEISource(category: string): ForresterTEISource | null {
  const cat = category.toLowerCase();
  
  if (cat.includes('productivity') || cat.includes('copilot')) {
    return FORRESTER_TEI_SOURCES[1]; // M365 Copilot
  }
  if (cat.includes('sales') || cat.includes('rm') || cat.includes('campaign')) {
    return FORRESTER_TEI_SOURCES[2]; // Copilot for Sales
  }
  if (cat.includes('risk') || cat.includes('compliance') || cat.includes('financial')) {
    return FORRESTER_TEI_SOURCES[3]; // Azure OpenAI for Financial Services
  }
  if (cat.includes('customer') || cat.includes('contact center') || cat.includes('engagement')) {
    return FORRESTER_TEI_SOURCES[0]; // Azure OpenAI for Customer Engagement
  }
  
  // Default to Azure OpenAI Customer Engagement (most comprehensive)
  return FORRESTER_TEI_SOURCES[0];
}

/**
 * Generate citation for a Forrester report
 */
export function generateForresterCitation(source: ForresterTEISource): string {
  return `${source.title}, Forrester Consulting, ${source.year}. Available at: ${source.url}`;
}

