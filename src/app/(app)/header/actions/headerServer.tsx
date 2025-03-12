// components/HeaderServer.tsx

import { getClient } from "../../(authenticated)/_actions/getClient"
import Header from "../Header"

export default async function HeaderServer() {
  const user = await getClient()

  return <Header user={user} />
}