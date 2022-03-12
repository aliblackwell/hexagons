import { createLevelQuery } from '../../../queries/Pupils'

async function createLevel(gqlClient, variables) {
  try {
    const data = await gqlClient.request(createLevelQuery, variables)
    if (data) {
      return data.createLevel.level
    }
  } catch (e) {
    console.error(e)
  }
}

export default createLevel