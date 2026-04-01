-- RenameForeignKey
ALTER TABLE "Mensaje" RENAME CONSTRAINT "Mensaje_receiverId_fkey" TO "msg_receiver_egresado";

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "msg_receiver_empresa" FOREIGN KEY ("receiverId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
