import { Module } from '@nestjs/common';
import { HashingService } from './services/hashing.service';
import { EncryptionService } from './services/encryption.service';

@Module({
  providers: [HashingService, EncryptionService],
  exports: [HashingService, EncryptionService],
})
export class CryptoModule {}

