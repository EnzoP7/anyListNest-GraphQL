import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true, // Sirve para que no mandemos mas info de la que precisamos en la api

    })
   );



  app.enableCors({
    origin:'https://studio.apollographql.com',
    credentials:true
  })

  await app.listen(3000);
}
bootstrap();
