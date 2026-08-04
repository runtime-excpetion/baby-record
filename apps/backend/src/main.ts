import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  const swaggerPath = configService.get<string>('app.swaggerPath') || 'docs';
  const port = configService.get<number>('app.port') || 3000;

  // 全局 API 前缀
  app.setGlobalPrefix(apiPrefix);

  // 全局参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 全局异常过滤 + 统一响应拦截
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 跨域
  app.enableCors();

  // 静态文件服务（宝宝头像上传目录）
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Swagger 文档
  const swaggerConfig = new DocumentBuilder()
    .setTitle('宝宝成长记录服务 API')
    .setDescription('家庭内部使用的宝宝成长记录系统 —— RESTful API 文档\n\n统一响应格式：`{ code, message, data }`')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port);

  Logger.log(`🚀 应用已启动: http://localhost:${port}/${apiPrefix}`, 'Bootstrap');
  Logger.log(`📄 Swagger 文档: http://localhost:${port}/${swaggerPath}`, 'Bootstrap');
}

bootstrap();
