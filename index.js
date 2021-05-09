import server from './src/server.js'
import { getDb } from './db/index.js'

  ; (async () => {
    try {
      await getDb();
      await server();
    } catch (err) {
      console.log('err---->', err)
    }
  })();