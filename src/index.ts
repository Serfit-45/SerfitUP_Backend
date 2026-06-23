/** Punto de entrada de la aplicación, aquí se inicia el servidor */
import colors from 'colors'
import server from './server'

const port = Number(process.env.PORT) || 4000

server.listen(port, '0.0.0.0', () => {
    console.log( colors.bgYellow.bold(`REST API funcionando en el puerto ${port}`))
})