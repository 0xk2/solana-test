// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { SolanaTwitter } from '../target/types/solana_twitter';
// import { assert } from 'chai';
// import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

// describe('solana-twitter', () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;
//   const anchorProvider = program.provider as anchor.AnchorProvider;

//   it('can send a new tweet!', async () => {
//     const newTweet = anchor.web3.Keypair.generate();
//     const tx = await program.methods
//       .sendTweet('Computer Science', 'Is Solana good?')
//       .accounts({
//         tweet: newTweet.publicKey,
//         author: anchorProvider.wallet.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([newTweet])
//       .rpc();
//     // console.log('Your transaction signature', tx);
//     const newTweetAccount = await program.account.tweet.fetch(
//       newTweet.publicKey
//     );

//     assert.equal(
//       newTweetAccount.author.toBase58(),
//       anchorProvider.wallet.publicKey.toBase58()
//     );
//     assert.equal(newTweetAccount.topic, 'Computer Science');
//     assert.equal(newTweetAccount.content, 'Is Solana good?');
//     assert.ok(newTweetAccount.timestamp);
//   });

//   it('can send a new tweet without a topic', async () => {
//     const tweet = anchor.web3.Keypair.generate();
//     await program.methods
//       .sendTweet('', 'Is Solana good?')
//       .accounts({
//         tweet: tweet.publicKey,
//         author: anchorProvider.wallet.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([tweet])
//       .rpc();
//     const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
//     assert.equal(
//       tweetAccount.author.toBase58(),
//       anchorProvider.wallet.publicKey.toBase58()
//     );
//     assert.equal(tweetAccount.topic, '');
//     assert.equal(tweetAccount.content, 'Is Solana good?');
//     assert.ok(tweetAccount.timestamp);
//   });

//   it('can send a new tweet from a different author', async () => {
//     const otherUser = anchor.web3.Keypair.generate();
//     const signature = await program.provider.connection.requestAirdrop(
//       otherUser.publicKey,
//       1000000000
//     );
//     await program.provider.connection.confirmTransaction(signature);
//     const tweet = anchor.web3.Keypair.generate();
//     await program.methods
//       .sendTweet('Computer Science', 'Is Solana good?')
//       .accounts({
//         tweet: tweet.publicKey,
//         author: otherUser.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([otherUser, tweet])
//       .rpc();
//     const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
//     assert.equal(
//       tweetAccount.author.toBase58(),
//       otherUser.publicKey.toBase58()
//     );
//     assert.equal(tweetAccount.topic, 'Computer Science');
//     assert.equal(tweetAccount.content, 'Is Solana good?');
//     assert.ok(tweetAccount.timestamp);
//   });
//   it('cannot provide a topic with more than 50 characters', async () => {
//     const tweet = anchor.web3.Keypair.generate();
//     try {
//       await program.methods
//         .sendTweet('x'.repeat(51), 'Is Solana good?')
//         .accounts({
//           tweet: tweet.publicKey,
//           author: anchorProvider.wallet.publicKey,
//           systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .signers([tweet])
//         .rpc();
//     } catch (err) {
//       assert.equal(
//         err.error.errorMessage,
//         'The provided topic should be 50 characters long maximum.'
//       );
//       return;
//     }
//     assert.fail('The transaction should have failed with a 51-character topic');
//   });
//   it('cannot provide a topic with more than 50 characters', async () => {
//     const tweet = anchor.web3.Keypair.generate();
//     try {
//       await program.methods
//         .sendTweet('Computer Science', 'x'.repeat(281))
//         .accounts({
//           tweet: tweet.publicKey,
//           author: anchorProvider.wallet.publicKey,
//           systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .signers([tweet])
//         .rpc();
//     } catch (err) {
//       assert.equal(
//         err.error.errorMessage,
//         'The provided content should be 280 characters long maximum.'
//       );
//       return;
//     }
//     assert.fail(
//       'The transaction should have failed with a 281-character content'
//     );
//   });
//   it('can fetch all tweets', async () => {
//     const tweets = await program.account.tweet.all();
//     assert.equal(tweets.length, 3);
//   });
//   it('can filter tweets by author', async () => {
//     const authorPublicKey = anchorProvider.wallet.publicKey;
//     const tweets = await program.account.tweet.all([
//       {
//         memcmp: {
//           offset: 8,
//           bytes: authorPublicKey.toBase58(),
//         },
//       },
//     ]);
//     assert.equal(tweets.length, 2);
//     // console.log(tweets);
//     assert.ok(
//       tweets.every(
//         (tweet) =>
//           tweet.account.author.toBase58() === authorPublicKey.toBase58()
//       )
//     );
//   });
//   it('can filter tweets by topic', async () => {
//     const tweets = await program.account.tweet.all([
//       {
//         memcmp: {
//           offset:
//             8 + // Discriminator
//             32 + // Author public key
//             8 + // Timestamp
//             4, // Topic string prefix
//           bytes: bs58.encode(Buffer.from('Computer Science')),
//         },
//       },
//     ]);
//     assert.equal(tweets.length, 2);
//     assert.ok(
//       tweets.every((tweet) => tweet.account.topic === 'Computer Science')
//     );
//   });
// });
