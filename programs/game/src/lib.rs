use anchor_lang::prelude::*;
use instructions::*;
use state::Authority;

pub mod instructions;
pub mod state;

declare_id!("HMU1Tmv4fAK4Ag6BUu4Dnsox4urEHq1kRzXKzjSCKyYK");

#[program]
pub mod game {
    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String) -> Result<()> {
        instructions::create_user_stats::create_user_stats(ctx, name)
    }

    pub fn change_user_name(
        ctx: Context<ChangeUserName>,
        name: String,
    ) -> Result<()> {
        instructions::change_user_name::change_user_name(ctx, name)
    }

    pub fn init_authority(ctx: Context<InitAuthority>) -> Result<()> {
        let init_authority = &mut ctx.accounts.authority;
        init_authority.bump = ctx.bumps.authority;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitAuthority<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
      init_if_needed,
      payer = user,
      space = Authority::SPACE,
      seeds = [Authority::SEED_PREFIX],
      bump,
    )]
    pub authority: Account<'info, Authority>,
    pub system_program: Program<'info, System>,
}
