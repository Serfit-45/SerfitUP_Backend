import bcrypt from "bcrypt";

/** Funciones relacionadas con la autenticación, como el hash de contraseñas y la verificación de contraseñas */
export const hashPassword = async (password: string) => {
  //Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
export const checkPassword = async (enteredPassword: string, storeHash: string) => {
    return await bcrypt.compare(enteredPassword, storeHash);
}