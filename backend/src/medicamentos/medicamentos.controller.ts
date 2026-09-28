import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentosService.create(createMedicamentoDto);
  }

  @Get()
  findAll() {
    return this.medicamentosService.findAll();
  }

  @Get(':id')
  //usamos partesintpipe para que asegurar que el id que viaja en la url como texto se convierta en numero
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicamentosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.medicamentosService.update(id, updateMedicamentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicamentosService.remove(id);
  }
}
