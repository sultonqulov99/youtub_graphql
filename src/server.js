import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import ip from '#helpers/getIp'
import schema from './modules/index.js'
import path from 'path'
import './config/index.js'
import { graphqlUploadExpress} from 'graphql-upload'
import JWT from './helpers/jwt.js'
import queryParser from '#helpers/queryParser'

!async function(){
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.static(path.join(process.cwd(), 'uploads')))
  app.use(graphqlUploadExpress())

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    introspection:true,
    context: ({req}) => {
      const { operation, fieldName } = queryParser(req.body)
      if(fieldName == '__schema') return 

      if(['login','register','users','videos','video','user'].includes(fieldName)){
        return {
          agent:req.headers['user-agent'],
          userIp:req.ip
        }
      }
        const TOKEN = req.headers?.token?.trim()
        if(!TOKEN){
          throw new Error('Token is required')
        }

        const { userId,agent,userIp } = JWT.verify(TOKEN)

        // if(
        //   req.headers['user-agent'] != agent ||
        //   req.ip != userIp
        // ){
        //   throw new Error("Wrong device")
        // }
        return {
          userId,
          agent:req.headers['user-agent'],
          userIp: req.ip
      }

    },

    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageGraphQLPlayground()
    ],
  });

  await server.start();
  server.applyMiddleware({app,path: '/graphql'})
  const PORT = process.env.PORT || 4000
  await new Promise(resolve => httpServer.listen({ port:PORT }, resolve))
  console.log(`🚀 Server ready at http://${ip({ internal: false })}:${PORT}${server.graphqlPath}`)
}()