import { IsUUID } from 'class-validator';
import { MsisdnDto } from 'src/utils/dto';

export class RegisterBody extends MsisdnDto {
  @IsUUID()
  serviceId: string;
}

export class GetByMsisdnParam extends MsisdnDto {}

export class DeleteByMsisdnAndServiceId extends RegisterBody {}
