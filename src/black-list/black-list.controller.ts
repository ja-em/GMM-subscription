import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { BlackListService } from './black-list.service';
import { CreateBlackListBody, UpdateBlackListByMsisdn } from './black-list.dto';
import { MsisdnDto } from 'src/utils/dto';

@Controller('black-list')
export class BlackListController {
  constructor(private readonly _blackListService: BlackListService) {}
  @Post()
  createBlackList(@Body() body: CreateBlackListBody) {
    return this._blackListService.createBlackList(body);
  }

  @Delete('msisdn/:msisdn')
  deleteBlackListByMsisdn(@Param() param: MsisdnDto) {
    return this._blackListService.deleteBlackListByMsisdn(param.msisdn);
  }

  @Patch('msisdn/:msisdn')
  updateBlackListByMsisdn(
    @Param() param: MsisdnDto,
    @Body() body: UpdateBlackListByMsisdn,
  ) {
    return this._blackListService.updateBlackListByMsisdn(
      param.msisdn,
      body.reason,
    );
  }
}
