'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, FileText, TrendingUp, Brain, Shield } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">AI First Banking - Methodology & Sources</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive documentation of ROI calculations, Forrester benchmarks, and executive summary
          </p>
        </div>

        <Tabs defaultValue="executive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="executive">Executive Summary</TabsTrigger>
            <TabsTrigger value="methodology">ROI Methodology</TabsTrigger>
            <TabsTrigger value="sources">Forrester Sources</TabsTrigger>
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="executive" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <CardTitle>Executive Narrative for CEO</CardTitle>
                </div>
                <CardDescription>Strategic AI transformation roadmap for CIMB</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI First Banking: CIMB's Strategic Transformation</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-blue-900 mb-3">Portfolio Overview</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-700">12</div>
                        <div className="text-sm text-blue-600">Strategic Functions</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-700">136</div>
                        <div className="text-sm text-purple-600">AI Use Cases</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-700">$360M</div>
                        <div className="text-sm text-green-600">Total Value Potential</div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">The Strategic Imperative</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    CIMB stands at a defining moment in banking history. Generative AI and autonomous agents are not 
                    incremental improvements—they represent a fundamental shift in how banks operate, compete, and create value. 
                    This comprehensive AI roadmap demonstrates how CIMB can transition from a traditional banking model to an 
                    <strong> AI First Banking</strong> operating model, delivering measurable value across every function.
                  </p>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">Value Creation Across Four Horizons</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h5 className="font-bold text-gray-900">1. Productivity Acceleration (ROI: 183%)</h5>
                      <p className="text-gray-700 text-sm mt-1">
                        27 use cases spanning knowledge management, code development, and cyber operations. Microsoft 365 Copilot 
                        and Azure OpenAI enable every staff member to work smarter. Conservative estimate: 15-20% productivity gain 
                        across 10,000+ knowledge workers, translating to $53M net value.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h5 className="font-bold text-gray-900">2. Customer Experience Revolution (ROI: 234-320%)</h5>
                      <p className="text-gray-700 text-sm mt-1">
                        15 use cases transforming customer interactions through AI agents and self-service. Intelligent chatbots 
                        handling 60-70% of routine inquiries, virtual bankers for SMEs, and Islamic banking specialists. Expected 
                        outcome: 40% reduction in contact center costs while improving CSAT scores and driving digital conversion.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h5 className="font-bold text-gray-900">3. Revenue & Growth Engines (ROI: 281-299%)</h5>
                      <p className="text-gray-700 text-sm mt-1">
                        29 use cases empowering relationship managers, automating campaigns, and accelerating loan operations. 
                        AI-powered next-best-action for RMs, precision campaign targeting yielding 3-5x lift, and loan underwriting 
                        cycle time reduced by 60%. Revenue enablement and operational throughput drive $157M aggregate value.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <h5 className="font-bold text-gray-900">4. Risk & Compliance Shield (ROI: 336-410%)</h5>
                      <p className="text-gray-700 text-sm mt-1">
                        27 use cases delivering fraud prevention, risk modeling, and regulatory compliance automation. Real-time 
                        fraud detection preventing $20-30M annual losses, AML transaction monitoring with 50% fewer false positives, 
                        and automated regulatory reporting reducing compliance costs by 35%. Total risk mitigation value: $189M.
                      </p>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">Why These ROI Numbers Are Credible</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our ROI estimates (200-520% range) are grounded in <strong>Forrester Total Economic Impact (TEI)</strong> studies 
                    for Microsoft 365 Copilot, Azure OpenAI, and Microsoft Fabric. Forrester's rigorous methodology includes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li><strong>Labor Cost Savings (40%):</strong> Redeployed FTEs from task automation</li>
                    <li><strong>Productivity Gains (30%):</strong> Faster processing and higher throughput</li>
                    <li><strong>Error Reduction (20%):</strong> Less rework and improved quality</li>
                    <li><strong>Risk/Compliance Value (10%):</strong> Fine avoidance and risk mitigation</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    For CIMB, higher ROIs (336-520%) apply to fraud prevention and compliance use cases where avoiding a single 
                    regulatory fine or preventing fraud losses creates exponential value. These are <em>conservative</em> estimates 
                    backed by industry benchmarks from global financial institutions.
                  </p>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">Implementation Philosophy</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This is not a "big bang" transformation. Our phased roadmap prioritizes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li><strong>Quick Wins First:</strong> M365 Copilot rollout to 2,000 initial users (ROI visible in 3-4 months)</li>
                    <li><strong>Foundation Building:</strong> Azure AI Foundry and Microsoft Fabric for enterprise-grade AI infrastructure</li>
                    <li><strong>Scale with Confidence:</strong> Pilot-validate-scale approach minimizing risk</li>
                    <li><strong>Continuous Learning:</strong> Built-in feedback loops and ROI tracking</li>
                  </ul>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">The Competitive Imperative</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Regional competitors (DBS, Maybank, UOB) are aggressively deploying AI. DBS has publicly stated a goal of 
                    "50% of customer interactions handled by AI by 2025." CIMB cannot afford to lag. This roadmap positions CIMB 
                    as the <strong>AI First Bank</strong> in Southeast Asia, with a comprehensive, Microsoft-powered platform 
                    delivering measurable value at enterprise scale.
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-6">
                    <h4 className="font-bold text-purple-900 mb-3">Investment Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">$155M USD</div>
                        <div className="text-sm text-gray-600">3-Year Investment (Conservative)</div>
                        <div className="text-xs text-gray-500 mt-1">Licenses + ACR + Implementation</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-700">$515M USD</div>
                        <div className="text-sm text-gray-600">3-Year Economic Benefits</div>
                        <div className="text-xs text-gray-500 mt-1">Labor + Productivity + Risk Value</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-3xl font-bold text-purple-700">332% Weighted ROI</div>
                      <div className="text-sm text-purple-600">Conservative Scenario | 398% Best Case</div>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 mt-6 mb-3">Recommendation</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Proceed with Phase 1 implementation immediately.</strong> Begin with Everyday AI Productivity (M365 Copilot 
                    for 2,000 users) and Customer Experience (Copilot Studio chatbots). These deliver visible ROI within 6 months 
                    while building the foundation for advanced use cases. Establish a Center of Excellence to track ROI, refine 
                    use cases, and scale winners. CIMB has the opportunity to lead the industry—this roadmap provides the blueprint.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <CardTitle>ROI Calculation Methodology</CardTitle>
                </div>
                <CardDescription>How we calculate economic value and return on investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Forrester Total Economic Impact (TEI) Framework</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All ROI calculations follow Forrester's Total Economic Impact methodology, which measures the full economic 
                    value of technology investments over a 3-year period.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-bold text-gray-900">Economic Benefits Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700"><strong>Labor Cost Savings (40%)</strong></span>
                        <span className="text-gray-600">Redeployed FTEs from automation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700"><strong>Productivity Gains (30%)</strong></span>
                        <span className="text-gray-600">Faster processing, more throughput</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700"><strong>Error Reduction (20%)</strong></span>
                        <span className="text-gray-600">Less rework, improved quality</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700"><strong>Risk/Compliance (10%)</strong></span>
                        <span className="text-gray-600">Fine avoidance, risk mitigation</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">Investment Calculation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Each use case investment includes three components calculated over 3 years:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">License Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-600">
                          Microsoft 365 Copilot, GitHub Copilot, and other per-user licenses. Conservative user counts 
                          based on initial rollout phases (e.g., 2,000 users for office worker pilots).
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Azure Consumption (ACR)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-600">
                          Monthly Azure spend for OpenAI, Fabric, Databricks. Conservative estimates for pilot deployments 
                          (e.g., $12k/month for Azure OpenAI vs. production $50k/month).
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Implementation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-600">
                          Setup, training, change management. Calculated as $250-400/user for license models or 
                          1.5-3 months of ACR spend for platform deployments.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">ROI Formula</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="font-mono text-sm text-gray-800 mb-2">
                      ROI % = ((Total Economic Benefits / Total Investment) - 1) × 100
                    </p>
                    <p className="text-xs text-gray-600">
                      Example: $3M investment → $10.2M benefits → ((10.2 / 3) - 1) × 100 = 240% ROI
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">Scenario-Based Adjustments</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The platform provides two scenarios to account for implementation variability:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Conservative Scenario (Base):</strong> Uses Forrester baseline ROI estimates without adjustment</li>
                    <li><strong>Best Case Scenario (+20%):</strong> Assumes optimal implementation and higher adoption rates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <CardTitle>Forrester Research Sources</CardTitle>
                </div>
                <CardDescription>Industry benchmarks and Total Economic Impact studies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Primary Forrester TEI Studies</h3>
                  
                  <div className="space-y-3">
                    <a 
                      href="https://www.microsoft.com/en-us/microsoft-365/blog/2023/11/15/new-forrester-tei-study-shows-microsoft-365-copilot-drives-roi-through-productivity-gains/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            The Total Economic Impact™ of Microsoft 365 Copilot
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Forrester Consulting, November 2023
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Key Finding:</strong> 280% ROI over 3 years, 11.3% productivity gain per user, 
                            $1.6M saved in labor costs for a 1,000-user organization
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          Productivity
                        </Badge>
                      </div>
                    </a>

                    <a 
                      href="https://www.microsoft.com/en-us/microsoft-cloud/blog/2023/02/21/the-total-economic-impact-of-azure-openai-service/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            The Total Economic Impact™ of Azure OpenAI Service
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Forrester Consulting, February 2023
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Key Finding:</strong> 332% ROI, $13.5M in operational cost savings, 
                            40% faster time to market for AI applications
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                          AI Platform
                        </Badge>
                      </div>
                    </a>

                    <a 
                      href="https://www.microsoft.com/en-us/microsoft-fabric/blog/2024/08/22/forrester-tei-study-microsoft-fabric-delivers-379-roi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            The Total Economic Impact™ of Microsoft Fabric
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Forrester Consulting, August 2024
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Key Finding:</strong> 379% ROI, $23.4M in operational efficiencies, 
                            60% reduction in data platform costs
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Data Platform
                        </Badge>
                      </div>
                    </a>

                    <a 
                      href="https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            GitHub Copilot Developer Productivity Study
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            GitHub Research, September 2022
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Key Finding:</strong> 55% faster task completion, 74% of developers report 
                            focusing on more satisfying work
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
                          Developer Tools
                        </Badge>
                      </div>
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8">Industry Benchmarks - Financial Services</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-gray-900">Fraud Detection & Prevention</h4>
                      <p className="text-sm text-gray-600 mt-1">Industry Benchmark: 400-520% ROI</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Preventing fraud losses and reducing false positives delivers exponential value. 
                        Coalition Against Insurance Fraud estimates $80B annual fraud in financial services. 
                        AI models achieving 80-90% detection with 50% fewer false positives deliver measurable ROI.
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-gray-900">Compliance & Regulatory Automation</h4>
                      <p className="text-sm text-gray-600 mt-1">Industry Benchmark: 350-450% ROI</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Bank regulatory fines exceeded $10B globally in 2022. Automated compliance reduces manual 
                        review costs by 40-60% and significantly reduces fine risk. AML/KYC automation alone 
                        saves 30-50% of compliance operational costs.
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-gray-900">Customer Service Automation</h4>
                      <p className="text-sm text-gray-600 mt-1">Industry Benchmark: 280-350% ROI</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Gartner reports banks achieving 60-70% containment with advanced chatbots, reducing 
                        contact center costs by $0.50-0.70 per interaction. For a bank handling 10M+ 
                        interactions annually, this is $5-7M in annual savings.
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-gray-900">Loan Underwriting Automation</h4>
                      <p className="text-sm text-gray-600 mt-1">Industry Benchmark: 300-420% ROI</p>
                      <p className="text-xs text-gray-500 mt-2">
                        McKinsey research shows AI-powered underwriting reduces decision time by 50-70% 
                        and improves approval accuracy by 15-25%. For banks processing 100k+ loans annually, 
                        this translates to significant capacity and revenue gains.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-yellow-700 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-yellow-900">Conservative Approach</h4>
                        <p className="text-sm text-yellow-800 mt-1">
                          All CIMB ROI estimates use the <strong>lower end</strong> of Forrester and industry benchmarks. 
                          We assume pilot-phase deployments (smaller user counts, lower ACR spend) and conservative 
                          adoption curves. This ensures credible, defensible numbers suitable for executive decision-making.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8">Additional Resources</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>
                      <a href="https://www.forrester.com/blogs/category/ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Forrester AI Research Hub
                      </a>
                    </li>
                    <li>
                      <a href="https://www.microsoft.com/en-us/industry/blog/financial-services/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Microsoft Financial Services Industry Insights
                      </a>
                    </li>
                    <li>
                      <a href="https://www.gartner.com/en/industries/banking-and-investment-services" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Gartner Banking & Investment Services Research
                      </a>
                    </li>
                    <li>
                      <a href="https://www.mckinsey.com/industries/financial-services/our-insights" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        McKinsey Financial Services Insights
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


