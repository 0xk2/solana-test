use anchor_lang::prelude::*;
use instructions::*;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("3WrQ9mPywBz7RK4ozQWjJ2qGr5gQx3wpx66YH7FciH1j");

#[program]
pub mod solana_twitter {
    use super::*;

    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> Result<()> {
        instructions::send_tweet::send_tweet(ctx, topic, content)
    }
}