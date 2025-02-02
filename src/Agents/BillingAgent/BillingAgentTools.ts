import { DynamicStructuredTool, tool, Tool } from '@langchain/core/tools';

import { z } from 'zod';

export const getBillingInfo = new DynamicStructuredTool({
  name: 'get_billing_info',
  description: 'get billing information to the user, based on his order number',
  schema: z.object({
    data: z.string(),
  }),
  func: async ({ data }) => {
    return {
      order_id: data,
      location: 'warehouse',
      shipping: 'next week',
    };
  },
});

export const getRefundContact = new DynamicStructuredTool({
  name: 'get_refund_contact',
  description: 'give back the refund contact, based on his order number.',
  schema: z.object({
    data: z.string(),
  }),
  func: async ({ data }) => {
    return {
      refundEmail: 'sbnoize@gmail.com',
    };
  },
});
