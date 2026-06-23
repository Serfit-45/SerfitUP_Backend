import mongoose from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process';

/**
 * Función para conectar a la base de datos MongoDB utilizando Mongoose.
 * Intenta establecer una conexión con la URL de la base de datos proporcionada
 * en las variables de entorno. Si la conexión es exitosa, se muestra un mensaje
 * con el host y puerto de MongoDB. Si ocurre un error, se muestra un mensaje
 * de error y se termina el proceso con un código de salida 1.
 */
export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        console.log( colors.bgRed.bold("Error al conectar a MongoDB"))
        exit(1)
    }
}

console.log("TEST SSH OK ✅");