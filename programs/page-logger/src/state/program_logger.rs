use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)] // automatically calculate the space
// seeds: ["program_visit", program::PubKey]
pub struct ProgramLogger{
    pub bump: u8,
    pub view: u32,
}
impl ProgramLogger {
    pub const SEED_PREFIX: &'static [u8; 13] = b"program_visit";
    pub fn increase(&mut self) {
        self.view += 1;
    }
}