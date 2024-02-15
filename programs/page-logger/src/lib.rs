use anchor_lang::prelude::*;
pub use state::*;

pub mod state;

declare_id!("8A93pmBLBa6UBNGEtNV1jBwsus6P71dqX16boo1DvV5k");

#[program]
pub mod page_logger {
    use super::*;

    pub fn init_program(ctx: Context<InitProgram>) -> Result<()> {
        // create the ProgramLogger PDA if it is not existed
        *ctx.accounts.program_logger = ProgramLogger {
            view: 0,
            bump: ctx.bumps.program_logger,
        };
        Ok(())
    }

    pub fn init_account(ctx: Context<InitAccount>) -> Result<()> {
        // create the ProgramLogger PDA if it is not existed
        let account_logger = &mut ctx.accounts.account_logger;
        account_logger.view = 0;
        account_logger.bump = ctx.bumps.account_logger;
        Ok(())
    }

    pub fn log(ctx: Context<Log>) -> Result<(u32, u32)> {
        ctx.accounts.program_logger.increase();
        ctx.accounts.account_logger.increase();
        ctx.accounts.program_logger.reload()?;
        ctx.accounts.account_logger.reload()?;
        Ok((ctx.accounts.program_logger.view.to_be(), ctx.accounts.account_logger.view.to_be()))
    }

}

#[derive(Accounts)]
pub struct Log<'info>{
    #[account(signer)]
    pub payer: Signer<'info>,
    #[account(mut, 
        seeds = [ProgramLogger::SEED_PREFIX, program.key().as_ref()], 
        bump)
    ]
    pub program_logger: Account<'info, ProgramLogger>,

    #[account(mut, 
        seeds = [AccountLogger::SEED_PREFIX, payer.key().as_ref()], 
        bump)
    ]
    pub account_logger: Account<'info, AccountLogger>,
    /// CHECK: the account is an existing program, should do some check
    pub program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: used as signer
    pub authority: UncheckedAccount<'info>,
} 

// NOTE: to use variables from instruction as seeds
// follow this https://solana.stackexchange.com/questions/1504/anchor-how-to-set-a-pda-with-seeds-using-variables-from-another-account-that-is

#[derive(Accounts)]
pub struct InitProgram<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    /// CHECK: the account is an existing account program
    program: AccountInfo<'info>,
    #[account(
        init_if_needed,
        space = DISCRIMINATOR_LENGTH + ProgramLogger::INIT_SPACE,
        payer = payer,
        seeds = [
            ProgramLogger::SEED_PREFIX,
            program.key().as_ref(),
        ],
        bump,
    )]
    program_logger: Account<'info, ProgramLogger>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct InitAccount<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(
        init_if_needed,
        space = DISCRIMINATOR_LENGTH + AccountLogger::INIT_SPACE,
        payer = payer,
        seeds = [
            AccountLogger::SEED_PREFIX,
            payer.key().as_ref(),
        ],
        bump,
    )]
    account_logger: Account<'info, AccountLogger>,
    pub system_program: Program<'info, System>,
}

const DISCRIMINATOR_LENGTH: usize = 8;