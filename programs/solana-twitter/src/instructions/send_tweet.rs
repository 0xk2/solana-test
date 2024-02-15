use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use crate::state;
use crate::errors;

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = state::Tweet::LEN)]
    pub tweet: Account<'info, state::Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    // pub system_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> Result<()> {
  let tweet: &mut Account<state::Tweet> = &mut ctx.accounts.tweet;
  let author: &Signer = &ctx.accounts.author;
  let clock: Clock = Clock::get().unwrap();

  if topic.chars().count() > 50 {
      return Err(error!(errors::TweetError::TopicTooLong));
  }

  if content.chars().count() > 280 {
      return Err(error!(errors::TweetError::ContentTooLong));
  }

  tweet.author = *author.key;
  tweet.timestamp = clock.unix_timestamp;
  tweet.topic = topic;
  tweet.content = content;

  Ok(())
}

