'use client';

import { useState, useMemo } from 'react';
import { useMasterData } from '@/hooks/use-master-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Info } from 'lucide-react';
import { calculateUseCaseInvestment, determineCostModel } from '@/lib/csv-parser';

type ViewMode = 'program' | 'customer-facing' | 'operations-facing';

type BankOperation = 'CB' | 'CB TB' | 'WB' | 'Bank Wide';

type UseCaseBar = {
  name: string;
  program?: string;
  bankOps: BankOperation[];
  startYear: number;
  endYear: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
  masterDataName?: string; // For fetching from master data
  isNew?: boolean; // Mark newly added use cases
};

type StrategyFunction = {
  id: string;
  name: string;
  useCases: UseCaseBar[];
  priority: 'customer' | 'operations' | 'hybrid';
  order: {
    program: number;
    customerFacing: number;
    operationsFacing: number;
  };
};

const getBankOpColor = (op: BankOperation): string => {
  switch (op) {
    case 'CB': return 'bg-red-600';
    case 'CB TB': return 'bg-purple-600';
    case 'WB': return 'bg-blue-600';
    case 'Bank Wide': return 'bg-gray-900';
  }
};

const getProgramColor = (program: string): string => {
  if (program.includes('ITPL')) return 'bg-blue-100 text-blue-800 border-blue-400';
  if (program.includes('Rubik')) return 'bg-red-100 text-red-800 border-red-400';
  if (program.includes('AI Strategy')) return 'bg-purple-100 text-purple-800 border-purple-400';
  if (program.includes('SBF')) return 'bg-green-100 text-green-800 border-green-400';
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

export default function ExecutiveTimelinePage() {
  const { useCases: allUseCases } = useMasterData();
  const [viewMode, setViewMode] = useState<ViewMode>('program');
  const [selectedFunction, setSelectedFunction] = useState<StrategyFunction | null>(null);
  const [selectedUseCaseName, setSelectedUseCaseName] = useState<string | null>(null);
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false);

  // Executive use cases with master data references
  // Updated counts: Customer Services (10), Self-Service (7), RM (7), Campaign (7), Banking Ops (9), Risk (7), Compliance (7), Finance (5), Productivity (7)
  // Total: 66 Master Cases
  const strategicFunctions: StrategyFunction[] = [
    {
      id: 'customer-services',
      name: 'AI-Operated Customer Services / Sales',
      priority: 'customer',
      order: { program: 1, customerFacing: 1, operationsFacing: 6 },
      useCases: [
        { name: 'AI Assist Agent', masterDataName: 'EVA - AI Assist Agent', program: 'ITPL 2026', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' },
        { name: 'Commercial Leads', masterDataName: 'Commercial Leads Follow-Up', program: 'ITPL 2026', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 1, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' },
        { name: 'RDMS', masterDataName: 'RDMS', program: 'Rubik +', bankOps: ['CB', 'WB'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900' },
        { name: 'AI Contact Center', masterDataName: 'AI-Powered Contact Center (CCaaS)', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 2, bgColor: 'bg-red-100', borderColor: 'border-red-600', textColor: 'text-red-900' },
        { name: 'Branch Transformation', masterDataName: 'Branch Transformation', program: 'AI Strategy', bankOps: ['CB', 'Bank Wide'], startYear: 2, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-400', textColor: 'text-blue-900' },
        { name: 'Bancassurance Agent Co-Pilot', masterDataName: 'Bancassurance Agent Co-Pilot', program: 'AI Strategy', bankOps: ['CB'], startYear: 3, endYear: 4, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' },
        { name: 'Collections Voice Agent', masterDataName: 'Collections Voice & Text Agent', program: 'AI Strategy', bankOps: ['CB'], startYear: 3, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Wealth Portfolio Insight', masterDataName: 'Wealth Portfolio Insight & Rebalancer', program: 'AI Strategy', bankOps: ['CB'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'Customer Outreach Agent', masterDataName: 'AI Customer Outreach Agent', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Sales Lead Qualification', masterDataName: 'AI Sales Lead Qualification', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 5, endYear: 5, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' }
      ]
    },
    {
      id: 'self-service',
      name: 'Intelligent Self-Service Banking Hub',
      priority: 'customer',
      order: { program: 2, customerFacing: 2, operationsFacing: 7 },
      useCases: [
        { name: 'VoiceAI for RTC', masterDataName: 'VoiceAI for RTC', program: 'Rubik +', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'VoiceAI Servicing', masterDataName: 'VoiceAI Servicing', program: 'Rubik +', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Rubik Chatbot', masterDataName: 'Rubik Chatbot', program: 'Rubik +', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'CB Chatbot', masterDataName: 'CB Chatbot', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 1, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'Intelligent FAQ Agent', masterDataName: 'AI-Powered FAQ Agent', program: 'AI Strategy', bankOps: ['CB', 'Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Self-Service Loan Application', masterDataName: 'AI Self-Service Loan Application', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Virtual Account Manager', masterDataName: 'AI Virtual Account Manager', program: 'AI Strategy', bankOps: ['CB'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900' }
      ]
    },
    {
      id: 'rm-empowered',
      name: 'AI Empowered RM',
      priority: 'customer',
      order: { program: 3, customerFacing: 3, operationsFacing: 8 },
      useCases: [
        { name: 'Affluent RM', masterDataName: 'Affluent RM Co-Pilot', program: 'AI Strategy', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'CB/TB RM', masterDataName: 'CB/TB RM Co-Pilot', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 1, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'RM Customer Insights', masterDataName: 'AI RM Customer Insights & Analytics', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 2, endYear: 3, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'RM Portfolio Advisor', masterDataName: 'AI RM Portfolio Advisory Agent', program: 'AI Strategy', bankOps: ['CB'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'RM Credit GenAI', masterDataName: 'RM CoPilot: Credit GenAI for Business Banking', program: 'AI Strategy', bankOps: ['WB'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'RM Deal Structuring', masterDataName: 'AI RM Deal Structuring Assistant', program: 'AI Strategy', bankOps: ['WB'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'RM Meeting Summarization', masterDataName: 'RM Meeting Summarization', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' }
      ]
    },
    {
      id: 'precision-campaign',
      name: 'Precision Campaign',
      priority: 'customer',
      order: { program: 4, customerFacing: 4, operationsFacing: 9 },
      useCases: [
        { name: 'Campaign Modernization', masterDataName: 'Campaign Modernization', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 2, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'SME Journey, Digital Sign', masterDataName: 'SME Journey, Digital Sign', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'Customer Data Platform', masterDataName: 'Customer Data Platform', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-700', textColor: 'text-purple-900' },
        { name: 'Customer 360 Real-time', masterDataName: 'Customer 360 Real-time (CDP++)', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'Next Best Action', masterDataName: 'Next Best Action Engine', program: 'AI Strategy', bankOps: ['CB', 'Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Dynamic Pricing', masterDataName: 'Deposit & Lending Dynamic Pricing', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900' },
        { name: 'Personalized Offers', masterDataName: 'AI Personalized Offers Engine', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 5, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' }
      ]
    },
    {
      id: 'banking-ops',
      name: 'AI Driven Banking Ops.',
      priority: 'operations',
      order: { program: 5, customerFacing: 6, operationsFacing: 1 },
      useCases: [
        { name: 'IDP', masterDataName: 'IDP', program: 'ITPL 2026', bankOps: ['CB'], startYear: 1, endYear: 1, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' },
        { name: 'VoiceAI Collection', masterDataName: 'VoiceAI Collection', program: 'Rubik +', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'AI Loan Automations', masterDataName: 'AI Driven Loan Automations', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Autonomous Underwriting', masterDataName: 'Autonomous Underwriting', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'WB'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' },
        { name: 'Credit Collection', masterDataName: 'Credit Collection', program: 'SBF Lab', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 5, bgColor: 'bg-green-100', borderColor: 'border-green-600', textColor: 'text-green-900' },
        { name: 'Modernization', masterDataName: 'Modernization', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Trade Finance Doc Intelligence', masterDataName: 'Trade Finance Document Intelligence', program: 'AI Strategy', bankOps: ['WB'], startYear: 3, endYear: 5, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900' },
        { name: 'SME Cashflow Underwriting', masterDataName: 'SME Cashflow Underwriting 2.0', program: 'SBF Lab', bankOps: ['CB', 'CB TB'], startYear: 3, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900' }
      ]
    },
    {
      id: 'collections-recovery',
      name: 'AI Collections & Recovery Hub',
      priority: 'operations',
      order: { program: 6, customerFacing: 7, operationsFacing: 2 },
      useCases: [
        { name: 'Predictive Segmentation', masterDataName: 'AI Predictive Collections Segmentation', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 2, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true },
        { name: 'Outreach Orchestration', masterDataName: 'AI Collections Outreach Orchestration', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900', isNew: true },
        { name: 'Payment Plan Optimizer', masterDataName: 'AI Dynamic Payment Plan Optimizer', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 3, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true },
        { name: 'Sentiment & Compliance', masterDataName: 'AI Collections Sentiment & Compliance Monitor', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900', isNew: true },
        { name: 'Performance Analytics', masterDataName: 'AI Collections Performance Analytics', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 2, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900', isNew: true },
        { name: 'Fraud Detection', masterDataName: 'AI Fraud Detection in Collections', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900', isNew: true },
        { name: 'Conversational Assistant', masterDataName: 'AI Conversational Collections Assistant', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 3, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true },
        { name: 'Early Warning System', masterDataName: 'AI Early Warning & Proactive Collections', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'WB'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900', isNew: true }
      ]
    },
    {
      id: 'intelligent-loan-ops',
      name: 'AI Intelligent Loan Operations Hub',
      priority: 'operations',
      order: { program: 7, customerFacing: 8, operationsFacing: 3 },
      useCases: [
        { name: 'Alternative Credit Scoring', masterDataName: 'AI Alternative Credit Scoring Engine', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 2, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true },
        { name: 'Real-Time Loan Decision', masterDataName: 'Real-Time Loan Decision Engine', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900', isNew: true },
        { name: 'Loan Fraud Detection', masterDataName: 'AI Loan Application Fraud Detection', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 2, endYear: 3, bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-900', isNew: true },
        { name: 'Instant Pre-Approval', masterDataName: 'Autonomous Pre-Approval & Instant Offers', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 2, endYear: 3, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900', isNew: true },
        { name: 'Portfolio Risk Optimizer', masterDataName: 'AI Loan Portfolio Risk Optimizer', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'WB', 'Bank Wide'], startYear: 2, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900', isNew: true },
        { name: 'Loan Product Recommender', masterDataName: 'Personalized Loan Product Recommender', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true },
        { name: 'Dynamic Interest Rate Engine', masterDataName: 'AI Dynamic Interest Rate & Pricing Engine', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'WB', 'Bank Wide'], startYear: 3, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900', isNew: true },
        { name: 'Loan Servicing Automation', masterDataName: 'AI Loan Servicing & Lifecycle Automation', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 3, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-600', textColor: 'text-blue-900', isNew: true },
        { name: 'Loan Assistant & Onboarding', masterDataName: 'AI Loan Assistant & Smart Onboarding', program: 'AI Strategy', bankOps: ['CB', 'CB TB'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900', isNew: true },
        { name: 'Loan Cross-Sell Engine', masterDataName: 'AI Loan Cross-Sell & Wallet Share Engine', program: 'AI Strategy', bankOps: ['CB', 'CB TB', 'Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900', isNew: true }
      ]
    },
    {
      id: 'risk-intelligence',
      name: 'AI Risk Intelligence',
      priority: 'operations',
      order: { program: 8, customerFacing: 9, operationsFacing: 4 },
      useCases: [
        { name: 'Network Link Analysis', masterDataName: 'Network Link Analysis', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Early Warning', masterDataName: 'Early Warning', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Risk Automations', masterDataName: 'Risk Automations', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Insider Risk Mgmt', masterDataName: 'Insider Risk Mgmt', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Credit Memo', masterDataName: 'Corporate Lending Credit Memo Co-Writer', program: 'AI Strategy', bankOps: ['CB', 'WB'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Real-time Fraud Graph', masterDataName: 'Real-time Payments Fraud Graph', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 5, bgColor: 'bg-red-100', borderColor: 'border-red-600', textColor: 'text-red-900' },
        { name: 'ESG & Climate Risk', masterDataName: 'ESG & Climate Risk Analytics', program: 'AI Strategy', bankOps: ['WB', 'Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-green-100', borderColor: 'border-green-600', textColor: 'text-green-900' }
      ]
    },
    {
      id: 'compliance-audit',
      name: 'AI Compliance & Audit',
      priority: 'operations',
      order: { program: 9, customerFacing: 10, operationsFacing: 5 },
      useCases: [
        { name: 'Fraud & AML Assistant', masterDataName: 'Fraud & AML Assistant (Sensa)', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'GCAD Audrey', masterDataName: 'AUDREY (Audit Risk Explorer Buddy)', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Compliance Document Review', masterDataName: 'AI Compliance Document Review', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Regulatory Reporting', masterDataName: 'AI Regulatory Reporting Automation', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'AML Transaction Monitoring', masterDataName: 'AI AML Transaction Monitoring', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Policy Compliance Checker', masterDataName: 'AI Policy Compliance Checker', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'RegTech Auto-Filing', masterDataName: 'RegTech Auto-Filing (MAS/BNM)', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 5, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' }
      ]
    },
    {
      id: 'autonomous-finance',
      name: 'Autonomous Finance & Procurement',
      priority: 'operations',
      order: { program: 10, customerFacing: 11, operationsFacing: 6 },
      useCases: [
        { name: 'Autonomous Finance', masterDataName: 'Autonomous Finance', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Autonomous Procurement', masterDataName: 'Autonomous Procurement', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 2, endYear: 3, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'AI Expense Management', masterDataName: 'AI-Powered Expense Management', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Intelligent Invoice Processing', masterDataName: 'AI Intelligent Invoice Processing', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Finance Close & Insight', masterDataName: 'Autonomous Finance Close & Insight', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 5, endYear: 5, bgColor: 'bg-purple-100', borderColor: 'border-purple-600', textColor: 'text-purple-900' }
      ]
    },
    {
      id: 'everyday-productivity',
      name: 'Everyday AI Productivity',
      priority: 'hybrid',
      order: { program: 11, customerFacing: 5, operationsFacing: 7 },
      useCases: [
        { name: 'AI Foundation', masterDataName: 'AI Foundation', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'AI Control Tower', masterDataName: 'AI Control Tower', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 1, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Developer Copilot', masterDataName: 'Developer Copilot', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'Knowledge Copilot', masterDataName: 'Knowledge Copilot', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 1, endYear: 2, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'M365 Copilot Scale', masterDataName: 'M365 Copilot Enterprise Scale', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' },
        { name: 'Copilot Studio for Business', masterDataName: 'Copilot Studio Business Agents', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 3, endYear: 4, bgColor: 'bg-purple-100', borderColor: 'border-purple-500', textColor: 'text-purple-900' },
        { name: 'AI Governance & Security', masterDataName: 'AI Governance & Security Center', program: 'AI Strategy', bankOps: ['Bank Wide'], startYear: 4, endYear: 5, bgColor: 'bg-blue-100', borderColor: 'border-blue-500', textColor: 'text-blue-900' }
      ]
    }
  ];

  // Get master data details for selected use case (create if missing)
  const selectedUseCaseDetails = useMemo(() => {
    if (!selectedUseCaseName) return null;
    
    const masterData = allUseCases.find(uc => 
      uc.useCase?.toLowerCase().includes(selectedUseCaseName.toLowerCase()) ||
      selectedUseCaseName.toLowerCase().includes(uc.useCase?.toLowerCase() || '')
    );
    
    if (masterData) {
      const costModel = determineCostModel(masterData);
      const investment = calculateUseCaseInvestment(masterData);
      
      return {
        ...masterData,
        costModel,
        investment
      };
    }
    
    // CREATE default data based on use case name if not found
    const getDefaultData = (useCaseName: string) => {
      const baseDefaults = {
        useCase: useCaseName,
        group: 'AI Strategy',
        subCategory: 'AI Innovation',
        departments: ['Digital Banking', 'IT'],
        kpis: 'Efficiency improvement, Cost reduction, Enhanced user experience',
        microsoftProducts: ['Azure OpenAI Service', 'Microsoft Copilot', 'Power Platform'],
        roi: 350,
        costModel: 'Hybrid' as const,
        description: `Advanced AI solution for ${useCaseName}. Leverages Microsoft Azure AI and Copilot technologies to drive operational efficiency and business transformation.`,
        economicBenefit: 'Cost reduction, Time savings, Productivity gains',
        investment: {
          licenseCount: 500,
          licenseCost: 180000,
          acrCost: 120000,
          implementationCost: 150000,
          totalInvestment: 450000
        }
      };

      // Customize based on specific use cases
      if (useCaseName.toLowerCase().includes('collection') || useCaseName.toLowerCase().includes('voiceai')) {
        return {
          ...baseDefaults,
          group: 'AI Loan Banking Operations',
          subCategory: 'Collections & Recovery',
          departments: ['Collections', 'Credit Risk', 'Operations'],
          kpis: 'Collection rate improvement, Cost per collection, Recovery time reduction, Agent productivity',
          microsoftProducts: ['Azure OpenAI Service', 'Azure Speech Services', 'Azure Bot Service', 'Power Virtual Agents'],
          roi: 420,
          description: 'AI-powered voice agent for automated collections and customer outreach. Uses natural language processing to handle routine collection calls, improve recovery rates, and reduce operational costs.',
          economicBenefit: 'Reduced cost per collection by 40%, Improved collection rates by 25%, Freed up 60% of agent time for complex cases',
          investment: {
            licenseCount: 200,
            licenseCost: 72000,
            acrCost: 180000,
            implementationCost: 450000,
            totalInvestment: 702000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('idp') || useCaseName.toLowerCase().includes('document')) {
        return {
          ...baseDefaults,
          group: 'AI Loan Banking Operations',
          subCategory: 'Document Processing',
          departments: ['Operations', 'Loan Processing', 'Compliance'],
          kpis: 'Document processing time, Accuracy rate, Processing cost reduction, STP rate',
          microsoftProducts: ['Azure Document Intelligence', 'Azure OpenAI Service', 'Power Automate'],
          roi: 380,
          description: 'Intelligent Document Processing (IDP) solution that automates document extraction, classification, and validation. Reduces manual processing time by 80% and improves accuracy.',
          economicBenefit: 'Reduced processing time by 80%, Improved accuracy to 98%, Cost savings of $1.2M annually',
          investment: {
            licenseCount: 300,
            licenseCost: 108000,
            acrCost: 240000,
            implementationCost: 600000,
            totalInvestment: 948000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('rm') || useCaseName.toLowerCase().includes('relationship manager')) {
        return {
          ...baseDefaults,
          group: 'AI-Empowered Relationship Management',
          subCategory: 'RM Productivity',
          departments: ['Relationship Management', 'Wealth Management', 'Corporate Banking'],
          kpis: 'RM productivity, Client engagement rate, Cross-sell ratio, Assets under management',
          microsoftProducts: ['Microsoft Copilot for Sales', 'Azure OpenAI Service', 'Microsoft 365', 'Power BI'],
          roi: 450,
          description: 'AI-powered assistant for Relationship Managers providing real-time insights, meeting summaries, and next-best-action recommendations to enhance client relationships and drive revenue.',
          economicBenefit: 'Increased RM productivity by 35%, Improved cross-sell rates by 20%, Enhanced client satisfaction scores',
          investment: {
            licenseCount: 800,
            licenseCost: 288000,
            acrCost: 150000,
            implementationCost: 400000,
            totalInvestment: 838000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('contact center') || useCaseName.toLowerCase().includes('ccaas')) {
        return {
          ...baseDefaults,
          group: 'AI-Operated Customer Services / Sales',
          subCategory: 'Contact Center AI',
          departments: ['Customer Service', 'Contact Center', 'Operations'],
          kpis: 'Customer satisfaction (CSAT), Average handle time (AHT), First call resolution (FCR), Agent productivity',
          microsoftProducts: ['Azure OpenAI Service', 'Azure Speech Services', 'Dynamics 365 Customer Service', 'Microsoft Copilot'],
          roi: 480,
          description: 'AI-powered contact center solution providing real-time agent assistance, automated routing, sentiment analysis, and intelligent call summarization to enhance customer experience and operational efficiency.',
          economicBenefit: 'Reduced AHT by 30%, Improved CSAT by 25%, Increased FCR by 35%, Cost savings of $2.5M annually',
          investment: {
            licenseCount: 400,
            licenseCost: 144000,
            acrCost: 240000,
            implementationCost: 650000,
            totalInvestment: 1034000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('copilot') || useCaseName.toLowerCase().includes('m365')) {
        return {
          ...baseDefaults,
          group: 'Everyday AI Productivity',
          subCategory: 'Productivity Enhancement',
          departments: ['All Departments', 'IT', 'Operations'],
          kpis: 'Employee productivity, Time savings, Document processing speed, Meeting efficiency',
          microsoftProducts: ['Microsoft 365 Copilot', 'Copilot Studio', 'Microsoft Teams', 'SharePoint'],
          roi: 320,
          description: 'Enterprise-wide deployment of Microsoft 365 Copilot and Copilot Studio to enhance employee productivity across all business functions through AI-powered assistance in daily tasks.',
          economicBenefit: 'Average 30% time savings per employee, Improved document quality, Faster decision-making, Enhanced collaboration',
          investment: {
            licenseCount: 2000,
            licenseCost: 720000,
            acrCost: 100000,
            implementationCost: 350000,
            totalInvestment: 1170000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('loan') || useCaseName.toLowerCase().includes('underwriting')) {
        return {
          ...baseDefaults,
          group: 'AI Loan Banking Operations',
          subCategory: 'Loan Processing',
          departments: ['Loan Operations', 'Credit Risk', 'Underwriting'],
          kpis: 'Loan processing time, Approval accuracy, Cost per loan, Default rate reduction',
          microsoftProducts: ['Azure OpenAI Service', 'Azure Machine Learning', 'Power Automate', 'Azure Document Intelligence'],
          roi: 390,
          description: 'AI-driven loan processing and underwriting solution that automates credit assessment, document verification, risk scoring, and approval workflows to accelerate loan decisions.',
          economicBenefit: 'Reduced processing time from 5 days to 4 hours, Improved accuracy by 40%, Cost savings of $3.2M annually',
          investment: {
            licenseCount: 350,
            licenseCost: 126000,
            acrCost: 280000,
            implementationCost: 700000,
            totalInvestment: 1106000
          }
        };
      }

      if (useCaseName.toLowerCase().includes('branch') || useCaseName.toLowerCase().includes('transformation')) {
        return {
          ...baseDefaults,
          group: 'AI-Operated Customer Services / Sales',
          subCategory: 'Branch Innovation',
          departments: ['Branch Operations', 'Retail Banking', 'Customer Experience'],
          kpis: 'Customer footfall, Transaction volume, Cost per transaction, Customer satisfaction',
          microsoftProducts: ['Azure OpenAI Service', 'Power Platform', 'Dynamics 365', 'Microsoft Teams'],
          roi: 360,
          description: 'Digital transformation of branch operations with AI-powered kiosks, virtual assistants, and staff augmentation tools to create a hybrid physical-digital banking experience.',
          economicBenefit: 'Reduced operating costs by 25%, Increased transaction efficiency by 40%, Improved customer satisfaction by 30%',
          investment: {
            licenseCount: 600,
            licenseCost: 216000,
            acrCost: 180000,
            implementationCost: 850000,
            totalInvestment: 1246000
          }
        };
      }

      return baseDefaults;
    };
    
    return getDefaultData(selectedUseCaseName);
  }, [selectedUseCaseName, allUseCases]);

  // Sort functions based on view mode
  const sortedFunctions = useMemo(() => {
    const functions = [...strategicFunctions];
    
    if (viewMode === 'customer-facing') {
      return functions.sort((a, b) => a.order.customerFacing - b.order.customerFacing);
    }
    
    // For both operations-facing and program views, keep the original program order
    return functions.sort((a, b) => a.order.program - b.order.program);
  }, [viewMode]);

  const years = [
    { year: 1, label: 'Y1', subtitle: 'Foundation' },
    { year: 2, label: 'Y2', subtitle: 'Expansion' },
    { year: 3, label: 'Y3', subtitle: 'Scale' },
    { year: 4, label: 'Y4', subtitle: 'Maturity' },
    { year: 5, label: 'Y5', subtitle: 'Optimization' }
  ];

  // Calculate visible use cases based on view mode
  // In Customer-Facing: Operations functions shift to Y3, so use cases ending before Y3 are not visible
  // In Operations-Facing: Customer functions shift to Y3, so use cases ending before Y3 are not visible
  const getVisibleUseCases = () => {
    if (viewMode === 'customer-facing') {
      // Customer + Hybrid: all use cases visible
      const customerCount = strategicFunctions
        .filter(f => f.priority === 'customer' || f.priority === 'hybrid')
        .reduce((sum, func) => sum + func.useCases.length, 0);
      
      // Operations: only use cases that extend to Y3 or beyond (shifted to Y3)
      const operationsCount = strategicFunctions
        .filter(f => f.priority === 'operations')
        .reduce((sum, func) => {
          // Count use cases that would still be visible after shifting to Y3
          const visibleUseCases = func.useCases.filter(uc => uc.endYear >= 3);
          return sum + visibleUseCases.length;
        }, 0);
      
      return customerCount + operationsCount;
    } else if (viewMode === 'operations-facing') {
      // Operations + Hybrid: all use cases visible
      const operationsCount = strategicFunctions
        .filter(f => f.priority === 'operations' || f.priority === 'hybrid')
        .reduce((sum, func) => sum + func.useCases.length, 0);
      
      // Customer: only use cases that extend to Y3 or beyond (shifted to Y3)
      const customerCount = strategicFunctions
        .filter(f => f.priority === 'customer')
        .reduce((sum, func) => {
          // Count use cases that would still be visible after shifting to Y3
          const visibleUseCases = func.useCases.filter(uc => uc.endYear >= 3);
          return sum + visibleUseCases.length;
        }, 0);
      
      return operationsCount + customerCount;
    }
    // Program view: all use cases
    return strategicFunctions.reduce((sum, func) => sum + func.useCases.length, 0);
  };
  
  const totalUseCases = getVisibleUseCases();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI First Banking - Strategic Roadmap</h1>
            <p className="text-gray-500 mt-1 text-sm">Executive transformation timeline</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Bank Operations Legend - DOTS INSIDE PILLS */}
            <Card className="px-2.5 py-1.5 border">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="h-7 rounded-full px-2.5 py-1 text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span className="text-gray-900">CB</span>
                </Badge>
                <Badge variant="outline" className="h-7 rounded-full px-2.5 py-1 text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-900">CB TB</span>
                </Badge>
                <Badge variant="outline" className="h-7 rounded-full px-2.5 py-1 text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-900">WB</span>
                </Badge>
                <Badge variant="outline" className="h-7 rounded-full px-2.5 py-1 text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                  <span className="text-gray-900">Bank Wide</span>
                </Badge>
              </div>
            </Card>
            {/* Program Legend - Always Show */}
            <Card className="px-2.5 py-1.5 border">
              <div className="flex items-center gap-1.5">
                <Badge className="h-7 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-900">ITPL 2026</Badge>
                <Badge className="h-7 rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-900">Rubik +</Badge>
                <Badge className="h-7 rounded-full px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-900">AI Strategy</Badge>
                <Badge className="h-7 rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-900">SBF Lab</Badge>
              </div>
            </Card>
            <Button
              variant="outline"
              onClick={() => setShowDetailedTimeline(true)}
              className="gap-2 h-7 px-3 text-xs font-medium"
            >
              <Calendar className="h-3.5 w-3.5" />
              Detailed Timeline
            </Button>
            <Badge className="bg-gray-900 text-white h-7 px-3 py-1 text-xs font-medium rounded-full">
              {totalUseCases} Master Cases
            </Badge>
          </div>
        </div>

        {/* View Mode Toggle - PILLS */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex gap-2 bg-gray-100 p-1.5 rounded-full">
            <button
              onClick={() => setViewMode('program')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                viewMode === 'program'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Program Priority
            </button>
            <button
              onClick={() => setViewMode('customer-facing')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                viewMode === 'customer-facing'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Customer-Facing
            </button>
            <button
              onClick={() => setViewMode('operations-facing')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                viewMode === 'operations-facing'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Operations-Facing
            </button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="overflow-x-auto">
            {/* Header Row */}
            <div className="grid grid-cols-[450px_repeat(5,1fr)] min-w-[2000px] border-b border-gray-200 bg-gray-50">
              <div className="p-4 border-r border-gray-200">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Strategic Function</h3>
              </div>
              {years.map(y => (
                <div key={y.year} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                  <div className="font-bold text-xl text-gray-900">{y.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{y.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Function Rows */}
            {sortedFunctions.map((func) => {
              // Helper function to adjust bar timing based on view mode
              const getAdjustedBar = (bar: UseCase, funcPriority: string): UseCase | null => {
                // In Customer-Facing view: shift operations functions to start at Y3
                if (viewMode === 'customer-facing' && funcPriority === 'operations') {
                  // If use case ends before Y3, it won't be visible
                  if (bar.endYear < 3) return null;
                  // If use case starts before Y3, shift it to Y3
                  if (bar.startYear < 3) {
                    return { ...bar, startYear: 3 };
                  }
                }
                
                // In Operations-Facing view: shift customer functions to start at Y3
                if (viewMode === 'operations-facing' && funcPriority === 'customer') {
                  // If use case ends before Y3, it won't be visible
                  if (bar.endYear < 3) return null;
                  // If use case starts before Y3, shift it to Y3
                  if (bar.startYear < 3) {
                    return { ...bar, startYear: 3 };
                  }
                }
                
                // Default: no adjustment
                return bar;
              };
              
              // INTELLIGENT SLOT ASSIGNMENT - Pack efficiently to minimize wasted space
              const useCasesWithSlots: Array<{ bar: UseCase; originalIdx: number; globalSlot: number }> = [];
              const slotOccupancy: Array<{ start: number; end: number }> = []; // Track which slots are occupied in which years
              
              // Apply view-based adjustments to use cases (shift timing, filter out)
              const adjustedUseCases = func.useCases
                .map(uc => getAdjustedBar(uc, func.priority))
                .filter((uc): uc is UseCase => uc !== null); // Remove null entries
              
              // Sort use cases by start year, then end year (longer first), then original order
              const sortedUseCases = adjustedUseCases
                .map((bar, idx) => ({ bar, originalIdx: idx }))
                .sort((a, b) => {
                  if (a.bar.startYear !== b.bar.startYear) return a.bar.startYear - b.bar.startYear;
                  if (a.bar.endYear !== b.bar.endYear) return b.bar.endYear - a.bar.endYear; // Longer first
                  return a.originalIdx - b.originalIdx;
                });
              
              // Assign each use case to the first available slot
              for (const useCase of sortedUseCases) {
                let slotFound = false;
                
                // Try to find the first slot that's free for the entire duration
                for (let slot = 0; slot < 20; slot++) {
                  const isSlotFree = slotOccupancy
                    .filter(occ => occ.start <= useCase.bar.endYear && occ.end >= useCase.bar.startYear)
                    .every(occ => {
                      // Check if this occupancy is in a different slot
                      const occUseCase = useCasesWithSlots.find(uc => 
                        uc.globalSlot === slotOccupancy.indexOf(occ) && 
                        uc.bar.startYear <= useCase.bar.endYear && 
                        uc.bar.endYear >= useCase.bar.startYear
                      );
                      return !occUseCase || occUseCase.globalSlot !== slot;
                    });
                  
                  // Simpler check: is this slot occupied during our time range?
                  let canUseSlot = true;
                  for (const existing of useCasesWithSlots) {
                    if (existing.globalSlot === slot) {
                      // Check if time ranges overlap
                      if (!(useCase.bar.endYear < existing.bar.startYear || useCase.bar.startYear > existing.bar.endYear)) {
                        canUseSlot = false;
                        break;
                      }
                    }
                  }
                  
                  if (canUseSlot) {
                    useCasesWithSlots.push({ ...useCase, globalSlot: slot });
                    slotFound = true;
                    break;
                  }
                }
                
                // If no slot found, add to the end
                if (!slotFound) {
                  const maxSlot = useCasesWithSlots.length > 0 
                    ? Math.max(...useCasesWithSlots.map(uc => uc.globalSlot)) + 1 
                    : 0;
                  useCasesWithSlots.push({ ...useCase, globalSlot: maxSlot });
                }
              }
              
              const sortedWithSlots = useCasesWithSlots;
              
              // Calculate row height based on max slot used
              const maxSlot = sortedWithSlots.length > 0 
                ? Math.max(...sortedWithSlots.map(uc => uc.globalSlot)) + 1
                : 1;
              const rowHeight = Math.max(140, maxSlot * 36 + 30);
              
              return (
                <div 
                  key={func.id}
                  className="grid grid-cols-[450px_repeat(5,1fr)] min-w-[2000px] border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{ minHeight: `${rowHeight}px` }}
                >
                  {/* Function Name Column */}
                  <div className="p-6 border-r-2 border-gray-300 flex flex-col justify-start bg-white pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-900 text-lg leading-tight">{func.name}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFunction(func)}
                        className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-gray-900 text-white text-sm font-semibold rounded-full px-3 py-1">
                        {adjustedUseCases.length} use cases
                      </Badge>
                    </div>
                  </div>

                  {/* Year Columns */}
                  {years.map(y => {
                    // Get bars that appear in this year with their GLOBAL SLOT
                    const barsInYear = sortedWithSlots.filter(({ bar }) => 
                      bar.startYear <= y.year && bar.endYear >= y.year
                    );
                    
                    return (
                      <div 
                        key={y.year} 
                        className="p-4 border-r border-gray-100 last:border-r-0 relative"
                      >
                        {barsInYear.map(({ bar, originalIdx, globalSlot }) => {
                          const isStart = bar.startYear === y.year;
                          const isEnd = bar.endYear === y.year;
                          const isSingle = bar.startYear === bar.endYear;
                          
                          // Use GLOBAL SLOT for consistent positioning across all years!
                          const topPosition = 6 + (globalSlot * 36);
                          
                          return (
                            <div
                              key={`${bar.name}-${originalIdx}`}
                              style={{ top: `${topPosition}px` }}
                              className={`absolute left-4 right-4 ${bar.bgColor} ${bar.textColor} border-3 ${bar.borderColor} px-4 py-2 cursor-pointer hover:opacity-90 hover:shadow-lg transition-all flex items-center min-h-[32px] ${
                                isSingle 
                                  ? 'rounded-full' 
                                  : isStart 
                                    ? 'rounded-l-full' 
                                    : isEnd 
                                      ? 'rounded-r-full'
                                      : ''
                              }`}
                              onClick={() => setSelectedUseCaseName(bar.masterDataName || bar.name)}
                            >
                              {isStart && (
                                <div className="flex items-center gap-2 pr-4">
                                  <div className="text-xs font-bold leading-tight">
                                    {bar.name}
                                  </div>
                                  {bar.isNew && (
                                    <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border border-amber-500 ml-1.5">
                                      New
                                    </span>
                                  )}
                                </div>
                              )}
                              {isEnd && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                  {bar.bankOps.map((op, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`${getBankOpColor(op)} w-3 h-3 rounded-full`}
                                      title={op}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Use Case Detail Dialog - FROM MASTER DATA */}
      <Dialog open={!!selectedUseCaseName} onOpenChange={() => setSelectedUseCaseName(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">
              {selectedUseCaseName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUseCaseDetails ? (
            <ScrollArea className="h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-5 bg-green-100 border-2 border-green-200">
                    <div className="text-3xl font-bold text-green-700">{selectedUseCaseDetails.roi || 0}%</div>
                    <div className="text-sm text-green-900 mt-1 font-semibold">ROI</div>
                  </Card>
                  <Card className="p-5 bg-blue-100 border-2 border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{formatCurrency(selectedUseCaseDetails.investment?.totalInvestment || 0)}</div>
                    <div className="text-sm text-blue-900 mt-1 font-semibold">Total Investment</div>
                  </Card>
                  <Card className="p-5 bg-purple-100 border-2 border-purple-200">
                    <div className="text-xl font-bold text-purple-700">{selectedUseCaseDetails.costModel || 'Hybrid'}</div>
                    <div className="text-sm text-purple-900 mt-1 font-semibold">Cost Model</div>
                  </Card>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Description */}
                  {selectedUseCaseDetails.description && (
                    <Card className="p-6 border-2 bg-blue-50">
                      <h3 className="font-bold text-lg mb-3 text-blue-900">Description</h3>
                      <p className="text-gray-800 leading-relaxed">{selectedUseCaseDetails.description}</p>
                    </Card>
                  )}

                  {/* Economic Benefits */}
                  {selectedUseCaseDetails.economicBenefit && (
                    <Card className="p-6 border-2 bg-green-50">
                      <h3 className="font-bold text-lg mb-3 text-green-900">Economic Benefits</h3>
                      <p className="text-gray-800 leading-relaxed">{selectedUseCaseDetails.economicBenefit}</p>
                    </Card>
                  )}

                  <Card className="p-6 border-2">
                    <h3 className="font-bold text-lg mb-3">Use Case Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-900">{selectedUseCaseDetails.group || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Sub-Category:</span>
                        <span className="ml-2 text-gray-900">{selectedUseCaseDetails.subCategory || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Departments:</span>
                        <span className="ml-2 text-gray-900">{selectedUseCaseDetails.departments?.join(', ') || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Primary KPIs:</span>
                        <span className="ml-2 text-gray-900">{selectedUseCaseDetails.kpis || 'N/A'}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Investment Breakdown */}
                  <Card className="p-6 border-2">
                    <h3 className="font-bold text-lg mb-3">Investment Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      {selectedUseCaseDetails.investment?.licenseCount && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Licenses ({selectedUseCaseDetails.investment.licenseCount} users):</span>
                          <span className="font-semibold">{formatCurrency(selectedUseCaseDetails.investment.licenseCost || 0)}</span>
                        </div>
                      )}
                      {selectedUseCaseDetails.investment?.acrCost && selectedUseCaseDetails.investment.acrCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Azure Consumption:</span>
                          <span className="font-semibold">{formatCurrency(selectedUseCaseDetails.investment.acrCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700">Implementation Cost:</span>
                        <span className="font-semibold">{formatCurrency(selectedUseCaseDetails.investment?.implementationCost || 0)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t-2 font-bold text-base">
                        <span>Total Investment:</span>
                        <span className="text-blue-700">{formatCurrency(selectedUseCaseDetails.investment?.totalInvestment || 0)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Microsoft Products */}
                  <Card className="p-6 border-2">
                    <h3 className="font-bold text-lg mb-3">Microsoft Products</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUseCaseDetails.microsoftProducts?.map((product, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 border border-blue-300">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">Use case details not found in master data.</p>
              <p className="text-sm mt-2">This use case may need to be added to the master CSV file.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Timeline Dialog */}
      <Dialog open={showDetailedTimeline} onOpenChange={setShowDetailedTimeline}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Navigate to Detailed Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700 text-base">
              View the complete Gantt chart with all use cases, dependencies, and detailed schedules.
            </p>
            <Button
              className="w-full h-12 text-base font-bold"
              onClick={() => {
                window.location.href = '/timeline';
              }}
            >
              Go to Detailed Timeline View
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
