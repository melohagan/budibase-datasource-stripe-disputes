import { IntegrationBase, SqlQuery } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async read(query: { id: string, charge: string, payment_intent: string, ending_before: string, limit: number, starting_after: string }) {
    const { id, ...params } = query
    if (id) {
      return await this.stripe.disputes.retrieve(id)
    }
    return await this.stripe.disputes.list(params)
  }

  async update(query: {
    id: string, 
    evidence: object,
    metadata: object,
    submit: string,
   }) {
    return await this.stripe.disputes.update(query.id, {
      evidence: query.evidence,
      metadata: query.metadata as Stripe.MetadataParam,
      submit: query.submit === "true"
    })
  }

  async close(query: { id: string }) {
    return await this.stripe.disputes.close(query.id)
  }
}

export default CustomIntegration