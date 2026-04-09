import { PartialType } from '@nestjs/swagger';
import { CreateGoodsSaleDto } from './create-goods-sale.dto';

export class UpdateGoodsSaleDto extends PartialType(CreateGoodsSaleDto) {}
