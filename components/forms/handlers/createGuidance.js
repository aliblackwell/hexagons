import { createGuidanceQuery } from '../../../queries/Subjects'

async function createGuidance({ formData, gqlClient, capabilityId }) {

  const result = {}

  const variables = {
    text: formData.text,
    capability: capabilityId
  }
  try {
    const data = await gqlClient.request(createGuidanceQuery, variables)
    if (data) {
      result.success = true
      result.guidance = data
    }
  } catch (e) {
    result.error = e.message
    console.error(e)
  }
  return result
}

export default createGuidance