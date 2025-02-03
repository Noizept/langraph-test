import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentState } from './State/State'; // Import your state definition
import { supervisorNode } from './Agents/SupervisorAgent'; // Import the supervisor node
import { workflowsNode } from './Agents/WorkflowsAgent/WorkflowsAgent'; // Import the workflow node
import { billingNode } from './Agents/BillingAgent/BillingAgent'; // Import the billing node
import { moviesNode } from './Agents/MovieAgent/MovieAgent';

// 1. Create the graph
const workflow = new StateGraph(AgentState)
  // 2. Add the nodes; these will do the work
  .addNode('Supervisor', supervisorNode)
  .addNode('Workflow', workflowsNode)
  .addNode('Billing', billingNode)
  .addNode('Movie', moviesNode);

// After a worker completes, report to supervisor
workflow.addEdge('Workflow', 'Supervisor');
workflow.addEdge('Billing', 'Supervisor');
workflow.addEdge('Movie', 'Supervisor');

workflow.addConditionalEdges('Supervisor', (state) => state.next, {
  Workflow: 'Workflow',
  Billing: 'Billing',
  Movie: 'Movie',
  [END]: END,
});
// Set the entry point
workflow.addEdge(START, 'Supervisor');

// Compile the graph
const graph = workflow.compile();
export default graph;
