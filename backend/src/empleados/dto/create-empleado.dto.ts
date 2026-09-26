import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
export class CreateEmpleadoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del empleado es obligatorio' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido del empleado es obligatorio' })
    apellido: string;

    @IsString()
    @IsNotEmpty({ message: 'El DNI del empleado es obligatorio' })
    dni: string;

    @IsString()
    @IsNotEmpty({ message: 'El email del empleado es obligatorio' })
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsString()
    @IsOptional({ message: 'El teléfono es opcional' })
    telefono?: string;

    @IsString()
    @IsNotEmpty()
    cargo: string;

    @IsString()
    @IsNotEmpty()
    fechaIngreso: Date;
}
