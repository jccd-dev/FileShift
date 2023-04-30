import express, {Response, Request} from 'express'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'
import appRouter from './src/routes/appRoutes'

const port = process.env.PORT || 5000
const app = express();
const server = http.createServer(app)
const io = new Server(server)
app.set('io', io);
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', appRouter)


server.listen(port, () => {
    console.log('Listening on port 3000');
})