import { createPositionQuery } from '../../../queries/Pupils'

async function createPosition(gqlClient, variables) {
  try {
    const data = await gqlClient.request(createPositionQuery, variables)
    if (data) {
      return data.createPosition.position
    }
  } catch (e) {
    console.error(e)
  }
}

export default createPosition