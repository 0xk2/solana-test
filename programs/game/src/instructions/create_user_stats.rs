use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CreateUserStats<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  #[account(
    init_if_needed,
    payer = user,
    space = UserStats::SPACE,
    seeds = [UserStats::SEED_PREFIX, user.key().as_ref()],
    bump,
  )]
  pub user_stats: Account<'info, UserStats>,
  pub system_program: Program<'info, System>,
}

pub fn create_user_stats(ctx: Context<CreateUserStats>, name:String) -> Result<()> {
  let user_stats = &mut ctx.accounts.user_stats;
  user_stats.level = 0;
  if name.as_bytes().len() > 200 {
    // proper error handling omitted for brevity
    panic!();
  }
  user_stats.name = name;
  user_stats.bump = ctx.bumps.user_stats;
  Ok(())
}