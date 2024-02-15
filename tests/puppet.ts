// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { Keypair } from '@solana/web3.js';
// import { Puppet } from '../target/types/puppet';
// import { PuppetMaster } from '../target/types/puppet_master';
// import { expect } from 'chai';

// describe('puppet', () => {
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const puppetProgram = anchor.workspace.puppet as Program<Puppet>;
//   const puppetMasterProgram = anchor.workspace
//     .puppetMaster as Program<PuppetMaster>;
//   const puppetKeypair = Keypair.generate();

//   it('Does CPI', async () => {
//     await puppetProgram.methods
//       .initialize()
//       .accounts({
//         puppet: puppetKeypair.publicKey,
//         user: provider.wallet.publicKey,
//       })
//       .signers([puppetKeypair])
//       .rpc();
//     await puppetMasterProgram.methods
//       .pullString(new anchor.BN(42))
//       .accounts({
//         puppetProgram: puppetProgram.programId,
//         puppet: puppetKeypair.publicKey,
//       })
//       .rpc();
//     expect(
//       (
//         await puppetProgram.account.data.fetch(puppetKeypair.publicKey)
//       ).data.toNumber()
//     ).to.equal(42);
//   });
// });
