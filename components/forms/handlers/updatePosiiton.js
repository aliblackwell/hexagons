import { updatePositionQuery } from '../../../queries/Pupils'

async function updatePosition(gqlClient, variables) {
  try {
    const data = await gqlClient.request(updatePositionQuery, variables)
    if (data) {
       return data.updatePosition.position
    }
  } catch (e) {
    //setError(e)
    console.error(e)
  }
}

export default updatePosition