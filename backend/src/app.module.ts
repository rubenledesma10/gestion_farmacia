import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicamento } from './medicamentos/entities/medicamento.entity';
import { Categoria } from './categorias/entities/categoria.entity';
import { Empleado } from './empleados/entities/empleado.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicamentosModule } from './medicamentos/medicamentos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { EmpleadosModule } from './empleados/empleados.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', 
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '', 
      database: process.env.DB_DATABASE || 'farmacia',
      entities: [Medicamento, Categoria, Empleado],
      synchronize: true,
    }),
    MedicamentosModule,
    CategoriasModule,
    EmpleadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
