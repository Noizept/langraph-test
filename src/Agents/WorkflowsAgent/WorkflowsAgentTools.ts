import { DynamicStructuredTool, tool, Tool } from '@langchain/core/tools';

import { z } from 'zod';
import mongoDb from '../../DB/mongoDb';

export type WorkFlowType = {
  /** id: identifier of the WorkFlow  */
  id: string;
  /** */
  type: 'Workflow' | 'Function';
  /** name: Name for the the WorkFlow  */
  name: string;
  /** description: Brief description of the WorkFlow  */
  description?: string;
  /** Company id  */
  companyId: string;

  /** status: current status of the workflow  */
  status: 'DRAFT' | 'TESTING' | 'PUBLISHED' | 'INACTIVE';
  /** tags: Tags for workflow classification */
  tags: string[];

  /** createdBy:: Identifier of the workflow creator  */
  createdBy: string;
  /** createdAt: string and time when workflow is created  */
  createdAt: string;
  /** lastModifiedBy: Identifier of user who last modify the workflow */
  lastModifiedBy?: string;
  /** lastModifiedAt: string and time when workflow was modified  */
  lastModifiedAt?: string;
};

export const getWorkflowByDescription = tool(
  async ({ query }) => {
    return sampleWorkflows;
    // const db = await mongoDb.getInstance();
    // return db
    //   .collection<WorkFlowType>('Workflows')
    //   .find({
    //     name: { $regex: new RegExp(query, 'i') },
    //   })
    //   .toArray();
  },
  {
    name: 'getWorkflowByDescription',
    description:
      'Fetch workflows based on a description passed. this will do a similarity search and give 10 results back',
    schema: z.object({
      query: z.string().describe('The query to use in your search.'),
    }),
  },
);

export const sampleWorkflows: WorkFlowType[] = [
  {
    id: 'workflow_001',
    type: 'Workflow',
    name: 'Marketing Pipeline',
    description: 'Automates email campaigns and lead scoring.',
    companyId: 'company_123',
    status: 'DRAFT',
    tags: ['marketing', 'lead-generation'],
    createdBy: 'user_001',
    createdAt: '2023-01-10T09:15:00Z',
    lastModifiedBy: 'user_002',
    lastModifiedAt: '2023-01-15T14:22:00Z',
  },
  {
    id: 'workflow_002',
    type: 'Function',
    name: 'Generate Invoice',
    description: 'Generates invoice PDFs from order data.',
    companyId: 'company_123',
    status: 'TESTING',
    tags: ['finance', 'invoicing'],
    createdBy: 'user_003',
    createdAt: '2023-02-05T11:05:00Z',
  },
  {
    id: 'workflow_003',
    type: 'Workflow',
    name: 'Order Fulfillment',
    companyId: 'company_987',
    description: 'Coordinates warehouse pick, pack, and ship steps.',
    status: 'PUBLISHED',
    tags: ['operations', 'supply-chain'],
    createdBy: 'user_010',
    createdAt: '2023-03-01T08:00:00Z',
    lastModifiedBy: 'user_010',
    lastModifiedAt: '2023-03-15T17:30:00Z',
  },
  {
    id: 'workflow_004',
    type: 'Workflow',
    name: 'Customer Onboarding',
    description: 'Guides new users through initial setup and tutorials.',
    companyId: 'company_111',
    status: 'INACTIVE',
    tags: ['onboarding', 'customer-success'],
    createdBy: 'user_101',
    createdAt: '2022-12-20T22:00:00Z',
    lastModifiedBy: 'user_102',
    lastModifiedAt: '2023-01-05T10:45:00Z',
  },
  {
    id: 'workflow_005',
    type: 'Function',
    name: 'Send Welcome Email',
    description: 'Sends a personalized welcome email to new customers.',
    companyId: 'company_111',
    status: 'PUBLISHED',
    tags: ['email', 'communication'],
    createdBy: 'user_101',
    createdAt: '2023-04-01T16:30:00Z',
  },
  {
    id: 'workflow_006',
    type: 'Workflow',
    name: 'Data Backup Routine',
    companyId: 'company_555',
    description: 'Nightly backup of production databases.',
    status: 'TESTING',
    tags: ['infrastructure', 'maintenance'],
    createdBy: 'devops_001',
    createdAt: '2023-02-10T03:15:00Z',
    lastModifiedBy: 'devops_002',
    lastModifiedAt: '2023-02-11T12:20:00Z',
  },
  {
    id: 'workflow_007',
    type: 'Workflow',
    name: 'Social Media Scheduler',
    description: 'Automates posting to Twitter, LinkedIn, and Facebook.',
    companyId: 'company_678',
    status: 'DRAFT',
    tags: ['marketing', 'social-media'],
    createdBy: 'user_500',
    createdAt: '2023-05-02T09:40:00Z',
  },
  {
    id: 'workflow_008',
    type: 'Function',
    name: 'Calculate Discount',
    companyId: 'company_222',
    description: 'Applies discount rules based on user segment and cart value.',
    status: 'INACTIVE',
    tags: ['pricing', 'ecommerce'],
    createdBy: 'user_221',
    createdAt: '2022-11-15T13:00:00Z',
    lastModifiedBy: 'user_221',
    lastModifiedAt: '2023-01-05T13:55:00Z',
  },
  {
    id: 'workflow_009',
    type: 'Workflow',
    name: 'User Feedback Pipeline',
    companyId: 'company_333',
    description: 'Collects feedback, aggregates scores, and triggers notifications.',
    status: 'TESTING',
    tags: ['feedback', 'analytics'],
    createdBy: 'user_310',
    createdAt: '2023-05-20T14:15:00Z',
  },
  {
    id: 'workflow_010',
    type: 'Function',
    name: 'Publish Blog Post',
    description: 'Publishes blog content to the company website and RSS feeds.',
    companyId: 'company_444',
    status: 'PUBLISHED',
    tags: ['content', 'marketing'],
    createdBy: 'user_450',
    createdAt: '2023-05-25T08:00:00Z',
    lastModifiedBy: 'user_452',
    lastModifiedAt: '2023-05-25T09:30:00Z',
  },
];
