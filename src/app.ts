import express, {Response, Request} from 'express'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'
import appRouter from './routes/appRoutes'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000
const app = express();
const server = http.createServer(app)
const io = new Server(server)
app.set('io', io);
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

if (process.env.NODE_ENV === 'development'){
    app.use(express.static(path.join(__dirname, '../public')))
}
else{
    app.use(express.static(path.join(__dirname, 'public')))
}


app.use('/', appRouter)


server.listen(port, () => {
    console.log('Listening on port 3000');
})