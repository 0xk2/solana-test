use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)] // automatically calculate the space
// seeds: ["account_visit", account::PubKey]
pub struct AccountLogger{
    pub bump: u8,
    pub view: u32,
}
impl AccountLogger {
    pub const SEED_PREFIX: &'static [u8; 13] = b"account_visit";
    pub fn increase(&mut self) {
        self.view += 1;
    }
}