import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/db')
  dbHealth() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const readyState = this.connection.readyState;
    return { state: states[readyState] || 'unknown', readyState };
  }
}