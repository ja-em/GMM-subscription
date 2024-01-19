import { IsString, IsUUID, Length } from 'class-validator';
import { IsStartWith } from 'src/utils/validation';

export class RegisterBody {
  @IsString()
  @Length(11, 11)
  @IsStartWith('66')
  msisdn: string;

  @IsUUID()
  serviceId: string;
}
