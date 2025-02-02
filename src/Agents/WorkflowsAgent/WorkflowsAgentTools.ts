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
    const db = await mongoDb.getInstance();
    return db
      .collection<WorkFlowType>('Workflows')
      .find({
        name: { $regex: new RegExp(query, 'i') },
      })
      .toArray();
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
