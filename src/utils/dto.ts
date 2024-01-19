import { IsNumberString, Length } from 'class-validator';
import { IsStartWith } from './validation';

export class MsisdnDto {
  @IsNumberString()
  @Length(11, 11)
  @IsStartWith('66')
  msisdn: string;
}
