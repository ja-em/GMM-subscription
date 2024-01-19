import { IsNumberString, IsUUID, Length } from 'class-validator';
import { IsStartWith } from 'src/utils/validation';

class Msisdn {
  @IsNumberString()
  @Length(11, 11)
  @IsStartWith('66')
  msisdn: string;
}
export class RegisterBody extends Msisdn {
  @IsUUID()
  serviceId: string;
}

export class GetByMsisdnParam extends Msisdn {}

export class DeleteByMsisdnAndServiceId extends RegisterBody {}
