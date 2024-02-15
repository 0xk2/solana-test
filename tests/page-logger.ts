import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { PageLogger } from '../target/types/page_logger';
import { assert, expect } from 'chai';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

describe('page-logger', () => {
  // Configure the client to use the local cluster.
  // anchor.setProvider(anchor.AnchorProvider.env());
  // const program = anchor.workspace.PageLogger as Program<PageLogger>;
  // const anchorProvider = program.provider as anchor.AnchorProvider;
  // it('can create new pda for an account', async () => {
  //   const [accountLoggerPDA, _] = PublicKey.findProgramAddressSync(
  //     [
  //       anchor.utils.bytes.utf8.encode('account_visit'),
  //       anchorProvider.wallet.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  //   console.log('accountLoggerPDA: ', accountLoggerPDA);
  //   const tx = await program.methods
  //     .initAccount()
  //     .accounts({
  //       payer: anchorProvider.wallet.publicKey,
  //       accountLogger: accountLoggerPDA,
  //     })
  //     .rpc();
  //   console.log('Your transaction signature', tx);
  //   expect(
  //     (await program.account.accountLogger.fetch(accountLoggerPDA)).view
  //   ).to.equal(0);
  // });
});
