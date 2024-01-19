import { IsString, MinLength } from 'class-validator';
import { MsisdnDto } from 'src/utils/dto';

export class CreateBlackListBody extends MsisdnDto {
  @IsString()
  @MinLength(3)
  reason: string;
}

export class UpdateBlackListByMsisdn {
  @IsString()
  @MinLength(3)
  reason: string;
}
