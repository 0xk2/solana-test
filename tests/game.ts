import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { Game } from '../target/types/game';
import { PageLogger } from '../target/types/page_logger';
import { assert, expect, use } from 'chai';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

describe('game', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const gameProgram = anchor.workspace.Game as Program<Game>;
  const loggerProgram = anchor.workspace.PageLogger as Program<PageLogger>;
  const anchorProvider = gameProgram.provider as anchor.AnchorProvider;

  // before(async function () {});

  it('Set and changes name!', async () => {
    console.log(anchorProvider.wallet.publicKey.toString());
    /* setup PDA
     */
    const [gamePDA, bumpGame] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_visit'), gameProgram.programId.toBuffer()],
      loggerProgram.programId
    );

    const [userPDA, bumpUser] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('account_visit'),
        anchorProvider.wallet.publicKey.toBuffer(),
      ],
      loggerProgram.programId
    );

    const [authority, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('authority')],
      gameProgram.programId
    );
    /* end seting up PDA
     */
    /* init PDA
     */
    await loggerProgram.methods
      .initProgram()
      .accounts({
        program: gameProgram.programId,
        programLogger: gamePDA,
        payer: anchorProvider.wallet.publicKey,
      })
      .rpc();
    console.log('** gamePDA: ', gamePDA.toBase58(), '**');
    await loggerProgram.methods
      .initAccount()
      .accounts({
        payer: anchorProvider.wallet.publicKey,
        accountLogger: userPDA,
      })
      .rpc();
    console.log('** userPDA: ', userPDA.toBase58(), '**');

    await gameProgram.methods
      .initAuthority()
      .accounts({
        user: anchorProvider.wallet.publicKey,
        authority: authority,
      })
      .rpc();
    console.log('*** authorityPDA for signing: ', authority.toBase58(), '**');

    const tx1 = await loggerProgram.methods
      .log()
      .accounts({
        payer: anchorProvider.wallet.publicKey,
        programLogger: gamePDA,
        accountLogger: userPDA,
        program: gameProgram.programId,
      })
      .rpc({ skipPreflight: true });

    console.log('init logging', tx1);
    expect(
      (await loggerProgram.account.accountLogger.fetch(userPDA)).view
    ).to.equal(1);
    expect(
      (await loggerProgram.account.programLogger.fetch(gamePDA)).view
    ).to.equal(1);

    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [Buffer.from('user_stats'), anchorProvider.wallet.publicKey.toBuffer()],
      gameProgram.programId
    );
    await gameProgram.methods
      .createUserStats('brian')
      .accounts({
        user: anchorProvider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();
    expect(
      (await gameProgram.account.userStats.fetch(userStatsPDA)).name
    ).to.equal('brian');
    console.log('created brian user stats');

    // Everytime user change the name, invoke logger program
    const tx2 = await gameProgram.methods
      .changeUserName('tom')
      .accounts({
        user: anchorProvider.wallet.publicKey,
        userStats: userStatsPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: authority,
        programPda: gamePDA,
        userPda: userPDA,
        loggerProgam: loggerProgram.programId,
        gameProgram: gameProgram.programId,
      })
      .rpc({ skipPreflight: true });
    console.log('tx_first cpi: ', tx2);
    expect(
      (await gameProgram.account.userStats.fetch(userStatsPDA)).name
    ).to.equal('tom');
    expect(
      (await loggerProgram.account.accountLogger.fetch(userPDA)).view
    ).to.equal(2);
    expect(
      (await loggerProgram.account.programLogger.fetch(gamePDA)).view
    ).to.equal(2);

    // Everytime user change the name, invoke logger program
    const tx3 = await gameProgram.methods
      .changeUserName('chau')
      .accounts({
        user: anchorProvider.wallet.publicKey,
        userStats: userStatsPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: authority,
        programPda: gamePDA,
        userPda: userPDA,
        loggerProgam: loggerProgram.programId,
        gameProgram: gameProgram.programId,
      })
      .rpc({ skipPreflight: true });
    console.log('2nd cpi:', tx3);

    expect(
      (await gameProgram.account.userStats.fetch(userStatsPDA)).name
    ).to.equal('chau');
    expect(
      (await loggerProgram.account.accountLogger.fetch(userPDA)).view
    ).to.equal(3);
    expect(
      (await loggerProgram.account.programLogger.fetch(gamePDA)).view
    ).to.equal(3);
    expect(
      (await gameProgram.account.userStats.fetch(userStatsPDA)).level
    ).to.equal(6);
  });
});
