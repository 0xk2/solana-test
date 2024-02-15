use anchor_lang::prelude::*;
use puppet::{self, Data};
use puppet::program::Puppet;
// cpi feature create puppet::cpi::accounts::SetData
// since there is not cpi::account::SetData in the original code
use puppet::cpi::accounts::SetData;

declare_id!("3VH2jbsWL1mLCggLbGcS7HKiGT8oZ9PHJBB8uyjzwThi");

#[program]
pub mod puppet_master {

    use super::*;
    pub fn pull_string(ctx: Context<PullString>, data: u64) -> Result<()> {
        // puppet::cpi::set_data made available because of cpi feature
        puppet::cpi::set_data(ctx.accounts.set_data_ctx(), data)
    }
}

#[derive(Accounts)]
pub struct PullString<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, Puppet>
}

impl<'info> PullString<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_,'_,'_, 'info, SetData<'info>>{
        let cpi_program = self.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet: self.puppet.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}