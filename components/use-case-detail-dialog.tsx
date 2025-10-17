'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

// Generate intelligent descriptions for use cases
function generateDescription(useCase: UseCaseRecord): string {
  const name = useCase.useCase.toLowerCase();
  const group = useCase.group.toLowerCase();
  const subCategory = useCase.subCategory.toLowerCase();
  
  // Collections use cases
  if (group.includes('collections')) {
    if (name.includes('segmentation')) {
      return 'Leverage predictive analytics and machine learning to intelligently segment delinquent accounts based on payment behavior, risk profiles, and recovery likelihood. This enables targeted collection strategies and optimized resource allocation for maximum recovery rates.';
    }
    if (name.includes('outreach orchestration')) {
      return 'Automate and optimize multi-channel collection outreach campaigns using AI-driven timing, channel selection, and personalized messaging. Improves right-party contact rates and promise-to-pay conversion while maintaining regulatory compliance.';
    }
    if (name.includes('payment plan')) {
      return 'Use AI to dynamically generate personalized payment plans based on customer financial situation, payment history, and risk tolerance. Optimizes recovery timelines while maximizing customer satisfaction and plan adherence rates.';
    }
    if (name.includes('sentiment') || name.includes('compliance')) {
      return 'Monitor all collection interactions in real-time using AI to detect customer sentiment, compliance risks, and regulatory violations. Ensures adherence to fair lending practices while improving customer experience during difficult conversations.';
    }
    if (name.includes('performance analytics')) {
      return 'Provide comprehensive analytics and insights into collections performance across agents, strategies, and customer segments. Enables data-driven optimization of collection operations and identification of best practices.';
    }
    if (name.includes('fraud detection')) {
      return 'Deploy AI models to identify fraudulent payment behaviors, false promises, and deception patterns in collections. Protects the bank from bad faith actors while focusing resources on genuine recovery opportunities.';
    }
    if (name.includes('conversational') || name.includes('assistant')) {
      return 'Enable 24/7 self-service collections through AI-powered conversational agents that can handle payment arrangements, account inquiries, and payment processing. Reduces operational costs while improving customer accessibility.';
    }
    if (name.includes('early warning') || name.includes('proactive')) {
      return 'Predict customers at risk of delinquency before they miss payments using behavioral analytics and early warning signals. Enables proactive engagement and prevention strategies to reduce flow into collections.';
    }
  }
  
  // Loan operations use cases
  if (group.includes('loan') && group.includes('operations')) {
    if (name.includes('alternative credit') || name.includes('scoring')) {
      return 'Expand credit access and improve risk assessment by incorporating alternative data sources (utility payments, rental history, transaction patterns) into credit scoring models. Enables more inclusive lending while maintaining risk discipline.';
    }
    if (name.includes('real-time') && name.includes('decision')) {
      return 'Provide instant loan decisions through automated underwriting engines that evaluate applications in real-time. Dramatically reduces time-to-decision from days to seconds while maintaining credit quality standards.';
    }
    if (name.includes('fraud detection') && name.includes('loan')) {
      return 'Detect fraudulent loan applications using AI pattern recognition, document verification, and behavioral analytics. Protects the bank from identity theft, income falsification, and synthetic identity fraud.';
    }
    if (name.includes('pre-approval') || name.includes('instant offer')) {
      return 'Generate personalized, pre-approved loan offers for existing customers based on their financial profile and payment history. Increases conversion rates and cross-sell effectiveness while ensuring responsible lending.';
    }
    if (name.includes('portfolio') && name.includes('optimizer')) {
      return 'Optimize loan portfolio composition and risk-adjusted returns using advanced analytics and simulation. Enables strategic portfolio management across risk, return, capital allocation, and regulatory requirements.';
    }
    if (name.includes('product recommender')) {
      return 'Recommend the most suitable loan products to customers based on their financial needs, profile, and likelihood of approval. Improves customer experience and conversion rates through personalized product matching.';
    }
    if (name.includes('dynamic') && (name.includes('interest') || name.includes('pricing'))) {
      return 'Dynamically price loan products based on real-time market conditions, customer risk profile, competitive landscape, and profit targets. Optimizes net interest margin while maintaining competitive positioning.';
    }
    if (name.includes('servicing') || name.includes('lifecycle')) {
      return 'Automate and optimize loan servicing operations throughout the entire lifecycle from origination to payoff. Reduces operational costs, improves customer experience, and ensures compliance with servicing requirements.';
    }
    if (name.includes('cross-sell')) {
      return 'Identify and execute cross-sell opportunities for loan products to existing customers using predictive analytics. Increases wallet share and deepens customer relationships through timely, relevant offers.';
    }
    if (name.includes('assistant') || name.includes('onboarding')) {
      return 'Guide customers through the loan application and onboarding process using AI assistants that answer questions, collect documentation, and provide status updates. Improves completion rates and customer satisfaction.';
    }
    if (name.includes('idp') || name.includes('document processing')) {
      return 'Automatically extract, validate, and process information from loan documents using intelligent document processing. Eliminates manual data entry, reduces errors, and accelerates loan processing times.';
    }
    if (name.includes('collateral valuation')) {
      return 'Automate collateral valuation using AI-powered property appraisal, market data analysis, and risk assessment. Provides faster, more accurate valuations while reducing reliance on manual appraisals.';
    }
    if (name.includes('esg') || name.includes('risk scoring')) {
      return 'Incorporate ESG factors and sector-specific risks into credit risk models to better assess long-term borrower viability. Supports sustainable finance initiatives and improves risk assessment accuracy.';
    }
    if (name.includes('covenant')) {
      return 'Automatically draft loan covenants tailored to the specific borrower and transaction using AI analysis of similar deals and regulatory requirements. Reduces legal review time while maintaining risk protection.';
    }
    if (name.includes('memo') && name.includes('draft')) {
      return 'Generate first-draft credit memos and commercial memos using AI analysis of borrower information, financial statements, and market conditions. Accelerates underwriting process and improves consistency.';
    }
    if (name.includes('underwriter copilot')) {
      return 'Assist underwriters with AI-powered insights, document search, policy guidance, and decision support throughout the underwriting process. Improves decision quality and underwriter productivity.';
    }
    if (name.includes('stress') && name.includes('scenario')) {
      return 'Simulate various economic stress scenarios and their impact on loan portfolios using generative AI and advanced analytics. Supports stress testing, capital planning, and risk management requirements.';
    }
    if (name.includes('restructuring')) {
      return 'Recommend optimal loan restructuring strategies for troubled borrowers using AI analysis of financial situation, recovery scenarios, and historical outcomes. Maximizes recovery while supporting viable businesses.';
    }
    if (name.includes('end-to-end') && name.includes('automation')) {
      return 'Fully automate the loan processing workflow from application intake through approval using intelligent automation and AI decision-making. Achieves straight-through processing for qualifying applications.';
    }
    if (name.includes('deterioration') && name.includes('flag')) {
      return 'Provide early warning signals when loan performance or borrower financial health begins to deteriorate. Enables proactive portfolio management and early intervention to prevent losses.';
    }
  }
  
  // Productivity use cases
  if (group.includes('productivity')) {
    if (name.includes('copilot') || name.includes('microsoft 365')) {
      return 'Empower employees with AI-powered productivity tools embedded in Microsoft 365 applications. Enhances email writing, meeting summaries, document creation, and information discovery across the digital workplace.';
    }
    if (name.includes('knowledge') || name.includes('search')) {
      return 'Enable employees to quickly find relevant information across all corporate knowledge repositories using AI-powered semantic search. Reduces time spent searching and improves decision-making with better information access.';
    }
    if (name.includes('report') && name.includes('draft')) {
      return 'Accelerate report creation using AI assistants that generate first drafts based on data, templates, and business context. Reduces reporting cycles and allows staff to focus on analysis rather than formatting.';
    }
    if (name.includes('analyze') && name.includes('unstructured')) {
      return 'Extract insights from unstructured documents, reports, and data sources using natural language processing and AI analytics. Uncovers hidden patterns and accelerates insight generation from textual information.';
    }
    if (name.includes('specialized llm') || name.includes('financial services')) {
      return 'Deploy domain-specific large language models fine-tuned for financial services terminology, regulations, and use cases. Provides more accurate and contextually appropriate AI assistance for banking operations.';
    }
    if (name.includes('interview') || name.includes('screener')) {
      return 'Automate initial candidate screening using AI-powered interviews that assess skills, experience, and cultural fit. Reduces time-to-hire and enables HR teams to focus on qualified candidates.';
    }
    if (name.includes('coding') || name.includes('github')) {
      return 'Accelerate software development with AI pair programming that suggests code, identifies bugs, and generates tests. Improves developer productivity and code quality while reducing repetitive coding tasks.';
    }
    if (name.includes('legacy') && name.includes('doc')) {
      return 'Automatically generate documentation for legacy systems and undocumented code using AI analysis. Improves maintainability and reduces knowledge loss when experienced developers leave.';
    }
    if (name.includes('cyber') || name.includes('threat')) {
      return 'Enhance cybersecurity operations with AI-powered threat detection, analysis, and response recommendations. Reduces mean time to detect and respond to security incidents while improving detection accuracy.';
    }
    if (name.includes('it support')) {
      return 'Provide 24/7 automated IT support using conversational AI that can resolve common issues, answer questions, and route complex problems to appropriate teams. Improves employee satisfaction and reduces support costs.';
    }
  }
  
  // Customer-facing use cases
  if (group.includes('direct to customer') || group.includes('self-service')) {
    if (name.includes('chatbot') || name.includes('bot')) {
      return 'Deploy AI-powered conversational agents that handle customer inquiries, provide account information, and complete transactions across digital channels. Improves customer service availability while reducing contact center volume.';
    }
    if (name.includes('islamic')) {
      return 'Provide specialized AI assistance for Islamic banking products with built-in Shariah compliance verification. Ensures religious requirements are met while delivering modern digital banking experiences to Islamic banking customers.';
    }
    if (name.includes('voice') || name.includes('ccaas')) {
      return 'Transform contact center operations with AI-powered voice analytics, sentiment detection, and automated call handling. Improves customer experience, agent productivity, and operational efficiency.';
    }
  }
  
  // RM and relationship management
  if (name.includes('rm ') || name.includes('relationship manager') || group.includes('empowered rm')) {
    return 'Equip relationship managers with AI-powered insights, next-best-action recommendations, and customer intelligence to deepen relationships and increase wallet share. Improves sales effectiveness and customer retention through data-driven engagement.';
  }
  
  // Campaign and marketing
  if (name.includes('campaign') || name.includes('precision') || name.includes('marketing')) {
    return 'Optimize marketing campaigns using AI-driven customer segmentation, channel selection, timing, and personalized messaging. Improves campaign ROI and customer engagement through data-driven targeting and content optimization.';
  }
  
  // Risk and compliance
  if (group.includes('risk') || group.includes('compliance')) {
    if (name.includes('aml') || name.includes('money laundering')) {
      return 'Enhance anti-money laundering detection using AI pattern recognition and behavioral analytics. Reduces false positives while improving detection of sophisticated money laundering schemes and suspicious activities.';
    }
    if (name.includes('kyc') || name.includes('know your customer')) {
      return 'Streamline customer onboarding and KYC processes using automated identity verification, document processing, and risk assessment. Improves customer experience while ensuring regulatory compliance.';
    }
    if (name.includes('fraud') && !name.includes('loan')) {
      return 'Detect and prevent fraud across banking channels using real-time AI analysis of transaction patterns, device intelligence, and behavioral biometrics. Protects customers and the bank while minimizing friction for legitimate transactions.';
    }
    if (name.includes('regulatory') || name.includes('compliance')) {
      return 'Automate regulatory reporting and compliance monitoring using AI-powered data extraction, validation, and report generation. Reduces compliance costs and risks while ensuring accuracy and timeliness of regulatory filings.';
    }
    if (name.includes('credit risk')) {
      return 'Enhance credit risk assessment and portfolio monitoring using advanced analytics and AI models. Improves risk-adjusted returns and early identification of credit deterioration signals.';
    }
  }
  
  // Finance and operations
  if (group.includes('finance') || group.includes('procurement') || name.includes('autonomous finance')) {
    return 'Automate finance and procurement processes using AI-powered invoice processing, payment optimization, and spend analytics. Reduces operational costs, improves cash flow management, and provides better visibility into financial operations.';
  }
  
  // Default description based on category and name
  return `This AI-powered solution leverages Microsoft Azure and AI technologies to transform ${subCategory} operations. By automating manual processes, providing intelligent insights, and enabling data-driven decisions, this use case helps ${useCase.departments.slice(0, 2).join(' and ')} teams improve efficiency, reduce costs, and deliver better outcomes.`;
}

interface UseCaseDetailDialogProps {
  useCase: UseCaseRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCluster?: (useCaseId: string, cluster: string) => void;
  onUpdateValueSize?: (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => void;
  onUpdateUseCase?: (useCaseId: string, updates: Partial<UseCaseRecord>) => Promise<void>;
  availableClusters?: string[];
}

export function UseCaseDetailDialog({ 
  useCase, 
  open, 
  onOpenChange,
  onUpdateCluster,
  onUpdateValueSize,
  onUpdateUseCase,
  availableClusters = []
}: UseCaseDetailDialogProps) {
  const [selectedCluster, setSelectedCluster] = useState<string | undefined>(useCase?.commercialCluster);
  const [selectedValueSize, setSelectedValueSize] = useState<string | undefined>(useCase?.clusterValueSize);
  const [implementationSize, setImplementationSize] = useState<string>(useCase?.implementationCostBucket || 'M');
  const [costEstimation, setCostEstimation] = useState<string>(useCase?.costEstimation || 'M');
  const [editingDepartments, setEditingDepartments] = useState(false);
  const [editingKPIs, setEditingKPIs] = useState(false);
  const [editingProducts, setEditingProducts] = useState(false);
  const [departments, setDepartments] = useState<string[]>(useCase?.departments || []);
  const [kpis, setKpis] = useState<string[]>(useCase?.kpis || []);
  const [products, setProducts] = useState<string[]>(useCase?.microsoftProducts || []);

  // Update state when useCase changes
  useEffect(() => {
    if (useCase) {
      setSelectedCluster(useCase.commercialCluster);
      setSelectedValueSize(useCase.clusterValueSize);
      setImplementationSize(useCase.implementationCostBucket || 'M');
      setCostEstimation(useCase.costEstimation || 'M');
      setDepartments(useCase.departments || []);
      setKpis(useCase.kpis || []);
      setProducts(useCase.microsoftProducts || []);
      // Reset editing states
      setEditingDepartments(false);
      setEditingKPIs(false);
      setEditingProducts(false);
    }
  }, [useCase]);

  if (!useCase) return null;

  const handleClusterChange = async (value: string) => {
    setSelectedCluster(value);
    if (onUpdateCluster) {
      onUpdateCluster(useCase.id, value);
    }
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { commercialCluster: value === 'unassigned' ? undefined : value });
    }
  };

  const handleValueSizeChange = async (value: string) => {
    setSelectedValueSize(value);
    if (onUpdateValueSize && (value === 'Small' || value === 'Medium' || value === 'Large')) {
      onUpdateValueSize(useCase.id, value);
    }
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { clusterValueSize: value as 'Small' | 'Medium' | 'Large' });
    }
  };

  const handleImplementationSizeChange = async (value: string) => {
    setImplementationSize(value);
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { implementationCostBucket: value });
    }
  };

  const handleCostEstimationChange = async (value: string) => {
    setCostEstimation(value);
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { costEstimation: value });
    }
  };

  const saveDepartments = async () => {
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { departments });
    }
    setEditingDepartments(false);
  };

  const saveKPIs = async () => {
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { kpis });
    }
    setEditingKPIs(false);
  };

  const saveProducts = async () => {
    if (onUpdateUseCase) {
      await onUpdateUseCase(useCase.id, { microsoftProducts: products });
    }
    setEditingProducts(false);
  };

  // Check if this use case is new
  const newUseCaseNames = new Set([
    // Collections (8 use cases)
    'AI Predictive Collections Segmentation',
    'AI Collections Outreach Orchestration',
    'AI Dynamic Payment Plan Optimizer',
    'AI Collections Sentiment & Compliance Monitor',
    'AI Collections Performance Analytics',
    'AI Fraud Detection in Collections',
    'AI Conversational Collections Assistant',
    'AI Early Warning & Proactive Collections',
    // Recently added Loan Operations (10 use cases)
    'AI Alternative Credit Scoring Engine',
    'Real-Time Loan Decision Engine',
    'AI Loan Application Fraud Detection',
    'Autonomous Pre-Approval & Instant Offers',
    'AI Loan Portfolio Risk Optimizer',
    'Personalized Loan Product Recommender',
    'AI Dynamic Interest Rate & Pricing Engine',
    'AI Loan Servicing & Lifecycle Automation',
    'Cross-Sell Intelligence for Loan Products',
    'AI Loan Assistant & Onboarding Copilot'
  ]);

  const isNew = newUseCaseNames.has(useCase.useCase);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {useCase.useCase}
            </DialogTitle>
            {isNew && (
              <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-2 border-amber-500 shrink-0">
                New
              </span>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
              {useCase.group}
            </Badge>
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
              {useCase.subCategory}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-5 py-2">
            {/* Description */}
            <div className="space-y-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-sm font-semibold text-blue-900">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {generateDescription(useCase)}
              </p>
            </div>

            <Separator className="bg-gray-200" />

            {/* Commercial Cluster Assignment */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Commercial Cluster</h3>
              <Select 
                value={selectedCluster || ''} 
                onValueChange={handleClusterChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Assign to commercial cluster..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {availableClusters.map((cluster) => (
                    <SelectItem key={cluster} value={cluster}>
                      {cluster}
                    </SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <SelectItem value="new-cluster">+ Create New Cluster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Value Size Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Value Size</h3>
              <Select 
                value={selectedValueSize || ''} 
                onValueChange={handleValueSizeChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select value size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small ($50M USD)</SelectItem>
                  <SelectItem value="Medium">Medium ($75M USD)</SelectItem>
                  <SelectItem value="Large">Large ($120M USD)</SelectItem>
                </SelectContent>
              </Select>
              {selectedValueSize && (
                <p className="text-xs text-gray-500">
                  {selectedValueSize === 'Small' && 'Estimated value: $50M USD'}
                  {selectedValueSize === 'Medium' && 'Estimated value: $75M USD'}
                  {selectedValueSize === 'Large' && 'Estimated value: $120M USD'}
                </p>
              )}
            </div>

            {/* Implementation Size */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Implementation Size</h3>
              <Select 
                value={implementationSize} 
                onValueChange={handleImplementationSizeChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select implementation size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small (&lt;$100K)</SelectItem>
                  <SelectItem value="M">Medium ($100K-$1M)</SelectItem>
                  <SelectItem value="L">Large ($1M-$3M)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {implementationSize === 'S' && 'Low complexity: <$100K implementation cost'}
                {implementationSize === 'M' && 'Medium complexity: $100K-$1M implementation cost'}
                {implementationSize === 'L' && 'High complexity: $1M-$3M implementation cost'}
              </p>
            </div>

            {/* Cost Estimation (5 Years) */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Cost Estimation (5 Years TCO)</h3>
              <Select 
                value={costEstimation} 
                onValueChange={handleCostEstimationChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select cost estimation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small ($1M-$5M)</SelectItem>
                  <SelectItem value="M">Medium ($5M-$15M)</SelectItem>
                  <SelectItem value="L">Large ($15M-$50M)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {costEstimation === 'S' && 'Total Cost of Ownership over 5 years: $1M-$5M'}
                {costEstimation === 'M' && 'Total Cost of Ownership over 5 years: $5M-$15M'}
                {costEstimation === 'L' && 'Total Cost of Ownership over 5 years: $15M-$50M'}
              </p>
            </div>

            <Separator className="bg-gray-200" />

            {/* Departments - Editable */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Departments Involved</h3>
                {!editingDepartments && (
                  <button
                    onClick={() => setEditingDepartments(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingDepartments ? (
                <div className="space-y-2">
                  <textarea
                    value={departments.join('\n')}
                    onChange={(e) => setDepartments(e.target.value.split('\n').filter(d => d.trim()))}
                    className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded"
                    placeholder="Enter departments (one per line)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveDepartments}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setDepartments(useCase.departments);
                        setEditingDepartments(false);
                      }}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-4 space-y-1.5">
                  {departments.map((dept, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 text-xs">•</span>
                      <span className="text-sm text-gray-700">{dept}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* KPIs - Editable */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Primary KPIs</h3>
                {!editingKPIs && (
                  <button
                    onClick={() => setEditingKPIs(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingKPIs ? (
                <div className="space-y-2">
                  <textarea
                    value={kpis.join('\n')}
                    onChange={(e) => setKpis(e.target.value.split('\n').filter(k => k.trim()))}
                    className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded"
                    placeholder="Enter KPIs (one per line)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveKPIs}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setKpis(useCase.kpis);
                        setEditingKPIs(false);
                      }}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-4 space-y-1.5">
                  {kpis.map((kpi, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 text-xs">•</span>
                      <span className="text-sm text-gray-700">{kpi}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Microsoft Products - Editable */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Microsoft & Partner Products</h3>
                {!editingProducts && (
                  <button
                    onClick={() => setEditingProducts(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingProducts ? (
                <div className="space-y-2">
                  <textarea
                    value={products.join('\n')}
                    onChange={(e) => setProducts(e.target.value.split('\n').filter(p => p.trim()))}
                    className="w-full min-h-[120px] p-2 text-sm border border-gray-300 rounded"
                    placeholder="Enter products (one per line)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveProducts}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setProducts(useCase.microsoftProducts);
                        setEditingProducts(false);
                      }}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-4 space-y-1.5">
                  {products.map((product, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 text-xs">•</span>
                      <span className="text-sm text-gray-700">{product}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prerequisites */}
            {useCase.prerequisites && useCase.prerequisites.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Prerequisites</h3>
                  <div className="pl-4 space-y-2">
                    {useCase.prerequisites.map((prereq, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2 text-xs">{idx + 1}.</span>
                          <span className="text-sm text-gray-700">{prereq}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Contribution Types */}
            {useCase.contributionType && useCase.contributionType.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Contribution Types</h3>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {useCase.contributionType.map((type, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="text-xs border-blue-200 bg-blue-50 text-blue-700"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            {useCase.tags && useCase.tags.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {useCase.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-600 bg-gray-50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

