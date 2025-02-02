import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentState } from './State/State'; // Import your state definition
import { supervisorNode } from './Agents/SupervisorAgent'; // Import the supervisor node
import { workflowsNode } from './Agents/WorkflowsAgent/WorkflowsAgent'; // Import the workflow node
import { billingNode } from './Agents/BillingAgent/BillingAgent'; // Import the billing node

// 1. Create the graph
const workflow = new StateGraph(AgentState)
  // 2. Add the nodes; these will do the work
  .addNode('Supervisor', supervisorNode)
  .addNode('Workflow', workflowsNode)
  .addNode('Billing', billingNode);

// After a worker completes, report to supervisor
workflow.addEdge('Workflow', 'Supervisor');
workflow.addEdge('Billing', 'Supervisor');

workflow.addConditionalEdges('Supervisor', (state) => state.next, {
  Workflow: 'Workflow',
  Billing: 'Billing',
  [END]: END,
});
// Set the entry point
workflow.addEdge(START, 'Supervisor');

// Compile the graph
const graph = workflow.compile();
export default graph;
