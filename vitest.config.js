import { defineConfig } from 'vitest/config';

// Las pruebas nunca cargan el .env (ningún archivo de prueba importa
// src/server.js ni dotenv): todo lo que necesitan del entorno está aquí, con
// valores inventados.
export default defineConfig({
  test: {
    env: {
      JWT_SECRET: 'secreto-inventado-solo-para-las-pruebas-de-vitest',
      DATABASE_URL: 'postgresql://nadie@127.0.0.1:1/inexistente',
    },
  },
});
