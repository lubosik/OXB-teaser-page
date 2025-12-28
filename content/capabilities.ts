import {
  Code2,
  Globe,
  Target,
  LayoutDashboard,
  Workflow,
  MessageSquare,
  Phone,
  Plug,
  Users,
} from 'lucide-react'

export interface Capability {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export const capabilities: Capability[] = [
  {
    id: 'websites',
    title: 'Websites & Landing Pages',
    description: 'High-converting websites and landing pages that drive leads and sales.',
    icon: Globe,
  },
  {
    id: 'lead-gen',
    title: 'Lead Generation Systems',
    description: 'Automated systems to capture, qualify, and nurture leads into customers.',
    icon: Target,
  },
  {
    id: 'saas',
    title: 'Full SaaS Platforms',
    description: 'Complete web applications with authentication, payments, and dashboards.',
    icon: Code2,
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Agents',
    description: 'Voice-enabled AI assistants for customer service and operations.',
    icon: Phone,
  },
  {
    id: 'ai-chat',
    title: 'AI Chat Systems',
    description: 'Intelligent chatbots and conversational interfaces powered by AI.',
    icon: MessageSquare,
  },
  {
    id: 'automation',
    title: 'Workflow Automations',
    description: 'Custom automation to streamline operations and reduce manual work.',
    icon: Workflow,
  },
  {
    id: 'crm',
    title: 'CRM & Lead Management',
    description: 'Custom CRM systems tailored to your sales and customer workflows.',
    icon: Users,
  },
  {
    id: 'integrations',
    title: 'Custom Integrations',
    description: 'Connect your tools with APIs, webhooks, and third-party services.',
    icon: Plug,
  },
  {
    id: 'dashboards',
    title: 'Internal Dashboards',
    description: 'Custom analytics and operational dashboards for your team.',
    icon: LayoutDashboard,
  },
]
