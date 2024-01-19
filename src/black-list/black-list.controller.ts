import { Controller } from '@nestjs/common';
import { BlackListService } from './black-list.service';

@Controller('black-list')
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}
}
