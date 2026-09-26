import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateMedicamentoDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre del medicamento es obligatorio' })
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'El precio no puede ser negativo' })
    precio: number;

    @IsNumber()
    @Min(0, { message: 'El stock debe ser un número positivo' })
    stock: number;

}
