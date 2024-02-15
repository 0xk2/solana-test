use anchor_lang::prelude::*;
use crate::program::Game;
use crate::state::*;
use page_logger::cpi::accounts::Log;
use page_logger::program::PageLogger;
use page_logger::{self, ProgramLogger, AccountLogger};

#[derive(Accounts)]
pub struct ChangeUserName<'info>{
  pub user: Signer<'info>,
  pub system_program: Program<'info, System>,
  #[account(
    mut,
    seeds = [UserStats::SEED_PREFIX, user.key().as_ref()],
    bump = user_stats.bump,
  )]
  pub user_stats: Account<'info, UserStats>,

  #[account(
    mut,
    seeds = [b"authority"],
    bump = authority.bump
  )]
  pub authority: Account<'info, Authority>,
  
  // #[account(
  //   mut,
  //   seeds = [ProgramLogger::SEED_PREFIX, game_program.key().as_ref()],
  //   bump = program_pda.bump,
  //   owner = logger_progam.key()
  // )]
  // pub program_pda: Account<'info, ProgramLogger>,

  #[account(
    mut,
    seeds = [b"account_visit", user.key().as_ref()],
    // bump = user_pda.bump,
    bump,
    owner = logger_progam.key()
  )]
  pub user_pda: Account<'info, AccountLogger>,
  
  pub logger_progam: Program<'info, PageLogger>,
  pub game_program: Program<'info, Game>,
}

pub fn change_user_name(ctx: Context<ChangeUserName>, name: String) -> Result<()> {
  msg!("start changing user name");
  let user_stats = &mut ctx.accounts.user_stats;
  if name.as_bytes().len() > 200 {
    // proper error handling omitted for brevity
    panic!();
  }
  user_stats.name = name;
  // let cpi_program = ctx.accounts.logger_progam.to_account_info();
  // let cpi_accounts = Log {
  //   payer: ctx.accounts.user.to_account_info(),
  //   program_logger: ctx.accounts.program_pda.to_account_info(),
  //   account_logger: ctx.accounts.user_pda.to_account_info(),
  //   system_program: ctx.accounts.system_program.to_account_info(),
  //   program: ctx.accounts.game_program.to_account_info(),
  //   authority: ctx.accounts.user.to_account_info(),
  // };
  
  // PDA seeds and bump to "sign" for CPI
  // TODO: learn to sign CPI with PDA later
  let bump = ctx.accounts.authority.bump;
  let signer: &[&[&[u8]]] = &[&[b"authority", &[bump]]];
  // usually, an authority is required to sign the CPI

  // let cpi_context = CpiContext::new_with_signer(
  //   cpi_program, 
  //   cpi_accounts, 
  //   signer
  // );
  // let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
  // TODO: learn to use _rs later
  // let _rs = page_logger::cpi::log(cpi_context).unwrap();
  Ok(())
}